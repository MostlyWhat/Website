/**
 * File Upload API
 * 
 * Handles file uploads to Supabase Storage with security:
 * - Rate limiting: 10 uploads per hour per user
 * - File content validation (magic number checks)
 * - Size and type restrictions
 * Files are organized by entity type (ticket, project, etc.)
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createDb } from '$lib/server/db';
import { fileUploads } from '$lib/server/db/schema';
import { createSupabaseAdminClient } from '$lib/server/auth/supabase';
import { rateLimiters, getClientIP } from '$lib/server/utils/rate-limiter';
import { validateUploadedFile, sanitizeFilename, ALLOWED_FILE_TYPES } from '$lib/server/utils/file-security';

// File size limit: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed MIME types
const ALLOWED_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/x-zip-compressed'
];

export const POST: RequestHandler = async ({ request, locals }) => {
    // Verify authentication
    if (!locals.user || !locals.profile) {
        error(401, 'Authentication required');
    }

    // SECURITY: Require onboarding completion for file uploads
    if (!locals.profile.onboardingCompleted) {
        error(403, 'Please complete onboarding first');
    }

    // Rate limiting - 10 uploads per hour per user
    const clientIP = getClientIP(request, request.headers);
    const rateLimitKey = `${clientIP}:${locals.user.id}`;
    const rateLimitResult = await rateLimiters.upload.check(rateLimitKey);

    if (!rateLimitResult.success) {
        const resetInMinutes = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000 / 60);
        error(429, `Too many uploads. Please try again in ${resetInMinutes} minute${resetInMinutes > 1 ? 's' : ''}.`);
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const entityType = formData.get('entityType') as string;
        const entityId = formData.get('entityId') as string;

        // Validate required fields
        if (!file) {
            error(400, 'No file provided');
        }
        if (!entityType || !entityId) {
            error(400, 'Entity type and ID are required');
        }

        // Validate entity type
        const validEntityTypes = ['ticket', 'project', 'proposal', 'invoice', 'comment'];
        if (!validEntityTypes.includes(entityType)) {
            error(400, 'Invalid entity type');
        }

        // Determine file category for validation
        let fileCategory: 'image' | 'document' | 'archive' = 'document';
        if (file.type.startsWith('image/')) {
            fileCategory = 'image';
        } else if (file.type.includes('zip') || file.type.includes('compressed')) {
            fileCategory = 'archive';
        }

        // Comprehensive file validation (content, size, type)
        const allowedTypes = fileCategory === 'image'
            ? ALLOWED_FILE_TYPES.images
            : [...ALLOWED_FILE_TYPES.documents, ...ALLOWED_FILE_TYPES.archives];

        const fileValidation = await validateUploadedFile(file, {
            allowedTypes,
            category: fileCategory
        });

        if (!fileValidation.valid) {
            error(400, `File validation failed: ${fileValidation.errors.join(', ')}`);
        }

        // Sanitize filename to prevent path traversal attacks
        const sanitizedFileName = sanitizeFilename(file.name);
        const timestamp = Date.now();
        const storagePath = `${entityType}/${entityId}/${timestamp}_${sanitizedFileName}`;

        // Get file buffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to Supabase Storage
        const supabase = createSupabaseAdminClient();
        const { data, error: uploadError } = await supabase
            .storage
            .from('attachments')
            .upload(storagePath, buffer, {
                contentType: file.type,
                upsert: false
            });

        if (uploadError) {
            console.error('Supabase upload error:', uploadError);
            error(500, 'Failed to upload file');
        }

        // Get public URL
        const { data: urlData } = supabase
            .storage
            .from('attachments')
            .getPublicUrl(storagePath);

        const fileUrl = urlData.publicUrl;

        // Create per-request database connection
        const db = createDb();

        // Save file record to database
        const [fileRecord] = await db.insert(fileUploads).values({
            entityType,
            entityId,
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            fileUrl,
            storagePath,
            uploadedById: locals.profile.id
        }).returning();

        return json({
            success: true,
            file: {
                id: fileRecord.id,
                name: file.name,
                type: file.type,
                size: file.size,
                url: fileUrl
            }
        });
    } catch (err) {
        console.error('Upload error:', err);
        if (err instanceof Response) {
            throw err;
        }
        error(500, 'Upload failed');
    }
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
    // Verify authentication
    if (!locals.user || !locals.profile) {
        error(401, 'Authentication required');
    }

    // Create per-request database connection
    const db = createDb();

    try {
        const body = await request.json() as { fileId?: string };
        const { fileId } = body;

        if (!fileId) {
            error(400, 'File ID is required');
        }

        // Get file record
        const [fileRecord] = await db
            .select()
            .from(fileUploads)
            .where(eq(fileUploads.id, fileId))
            .limit(1);

        if (!fileRecord) {
            error(404, 'File not found');
        }

        // Check permissions - only uploader or staff can delete
        const isStaff = ['super_admin', 'admin', 'staff'].includes(locals.profile.role ?? '');
        if (fileRecord.uploadedById !== locals.profile.id && !isStaff) {
            error(403, 'Not authorized to delete this file');
        }

        // Delete from Supabase Storage
        const supabase = createSupabaseAdminClient();
        const { error: deleteError } = await supabase
            .storage
            .from('attachments')
            .remove([fileRecord.storagePath]);

        if (deleteError) {
            console.error('Supabase delete error:', deleteError);
            // Continue anyway to clean up the database record
        }

        // Delete from database
        await db.delete(fileUploads).where(eq(fileUploads.id, fileId));

        return json({ success: true });
    } catch (err) {
        console.error('Delete error:', err);
        if (err instanceof Response) {
            throw err;
        }
        error(500, 'Delete failed');
    }
};

// Import for delete operation
import { eq } from 'drizzle-orm';
