/**
 * Files API - List files for an entity
 * 
 * GET /api/files?entityType=ticket&entityId=xxx
 */

import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createDb } from '$lib/server/db';
import { fileUploads, profiles } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { rateLimiters, getClientIP } from '$lib/server/utils/rate-limiter';

export const GET: RequestHandler = async ({ url, locals, request }) => {
    // Verify authentication
    if (!locals.user || !locals.profile) {
        error(401, 'Authentication required');
    }

    // SECURITY: Require onboarding completion
    if (!locals.profile.onboardingCompleted) {
        error(403, 'Please complete onboarding first');
    }

	// Rate limiting - 100 API requests per minute per user
	const clientIP = getClientIP(request, request.headers);
	const rateLimitKey = `${clientIP}:${locals.user.id}`;
	const rateLimitResult = await rateLimiters.api.check(rateLimitKey);

	if (!rateLimitResult.success) {
		const resetInSeconds = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
		error(429, `Too many requests. Please try again in ${resetInSeconds} seconds.`);
	}

    // Create per-request database connection
    const db = createDb();

    const entityType = url.searchParams.get('entityType');
    const entityId = url.searchParams.get('entityId');

    if (!entityType || !entityId) {
        error(400, 'Entity type and ID are required');
    }

    try {
        const files = await db
            .select({
                id: fileUploads.id,
                fileName: fileUploads.fileName,
                fileType: fileUploads.fileType,
                fileSize: fileUploads.fileSize,
                fileUrl: fileUploads.fileUrl,
                createdAt: fileUploads.createdAt,
                uploadedByName: profiles.displayName
            })
            .from(fileUploads)
            .leftJoin(profiles, eq(fileUploads.uploadedById, profiles.id))
            .where(
                and(
                    eq(fileUploads.entityType, entityType),
                    eq(fileUploads.entityId, entityId)
                )
            )
            .orderBy(desc(fileUploads.createdAt));

        return json({
            success: true,
            files: files.map(f => ({
                id: f.id,
                name: f.fileName,
                type: f.fileType,
                size: f.fileSize,
                url: f.fileUrl,
                createdAt: f.createdAt,
                uploadedBy: f.uploadedByName ?? 'Unknown'
            }))
        });
    } catch (err) {
        console.error('List files error:', err);
        error(500, 'Failed to list files');
    }
};
