/**
 * Ticket Creation Server Actions
 * 
 * Creates new support tickets with organization association and file attachments.
 */

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db';
import { tickets, organizationMembers, organizations, projects, supportArticles, profiles, fileUploads } from '$lib/server/db/schema';
import { eq, and, or, desc } from 'drizzle-orm';
import crypto from 'node:crypto';
import { generateOrgNumber } from '$lib/server/id-generator';
import { sendTicketCreatedEmail } from '$lib/server/email';
import { env } from '$env/dynamic/private';
import { ticketActivity, organizationActivity, getClientIp } from '$lib/server/activity-logger';
import { createSupabaseAdminClient } from '$lib/server/supabase';

// File size limit: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

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

export const load: PageServerLoad = async ({ locals }) => {
    // Verify user is authenticated
    if (!locals.session || !locals.profile) {
        throw redirect(303, '/auth/login');
    }

    // Create per-request database connection
    const db = createDb();

    // Get user's organizations
    const userOrgs = await db
        .select({
            id: organizations.id,
            name: organizations.name
        })
        .from(organizationMembers)
        .innerJoin(organizations, eq(organizations.id, organizationMembers.organizationId))
        .where(eq(organizationMembers.profileId, locals.profile.id));

    // Get user's projects (for optional linking)
    const userProjects = await db
        .select({
            id: projects.id,
            name: projects.name,
            organizationId: projects.organizationId
        })
        .from(projects)
        .innerJoin(organizations, eq(projects.organizationId, organizations.id))
        .innerJoin(organizationMembers, eq(organizationMembers.organizationId, organizations.id))
        .where(
            and(
                eq(organizationMembers.profileId, locals.profile.id),
                // Only show active projects
                eq(projects.status, 'in_progress')
            )
        );

    // Get suggested help articles for common ticket topics
    // Wrapped in try-catch in case support_articles table doesn't exist yet
    let suggestedArticles: { id: string; title: string; slug: string; category: string }[] = [];
    try {
        suggestedArticles = await db
            .select({
                id: supportArticles.id,
                title: supportArticles.title,
                slug: supportArticles.slug,
                category: supportArticles.category
            })
            .from(supportArticles)
            .where(
                and(
                    eq(supportArticles.isPublished, true),
                    or(
                        eq(supportArticles.audience, 'user'),
                        eq(supportArticles.audience, 'all')
                    )
                )
            )
            .orderBy(desc(supportArticles.viewCount))
            .limit(5);
    } catch (error) {
        console.warn('Support articles query failed (table may not exist):', error);
    }

    return {
        organizations: userOrgs,
        projects: userProjects,
        suggestedArticles
    };
};

// Generate unique ticket number
function generateTicketNumber(): string {
    const year = new Date().getFullYear();
    const random = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `TKT-${year}-${random}`;
}

// Generate unique slug for organization
function generateSlug(): string {
    return `org-${crypto.randomBytes(4).toString('hex').toLowerCase()}`;
}

export const actions: Actions = {
    default: async ({ request, locals }) => {
        // Verify user is authenticated
        if (!locals.session || !locals.profile) {
            return fail(401, { error: 'You must be logged in to create a ticket' });
        }

        const formData = await request.formData();
        const subject = formData.get('subject') as string;
        const description = formData.get('description') as string;
        const priority = formData.get('priority') as 'low' | 'medium' | 'high' | 'urgent';
        const category = formData.get('category') as string;
        const projectId = formData.get('projectId') as string | null;

        // Validation
        if (!subject?.trim()) {
            return fail(400, {
                error: 'Subject is required',
                subject, description, priority, category
            });
        }

        if (subject.trim().length < 5) {
            return fail(400, {
                error: 'Subject must be at least 5 characters',
                subject, description, priority, category
            });
        }

        if (!description?.trim()) {
            return fail(400, {
                error: 'Description is required',
                subject, description, priority, category
            });
        }

        if (description.trim().length < 20) {
            return fail(400, {
                error: 'Please provide more details (at least 20 characters)',
                subject, description, priority, category
            });
        }

        const validPriorities = ['low', 'medium', 'high', 'urgent'];
        if (!validPriorities.includes(priority)) {
            return fail(400, {
                error: 'Invalid priority level',
                subject, description, priority, category
            });
        }

        // Create per-request database connection
        const db = createDb();

        try {
            // Get user's first organization (or use project's organization)
            let organizationId: string | null = null;

            if (projectId) {
                // If project specified, verify user has access and get its organization
                const project = await db
                    .select({ organizationId: projects.organizationId })
                    .from(projects)
                    .innerJoin(organizationMembers, eq(organizationMembers.organizationId, projects.organizationId))
                    .where(
                        and(
                            eq(projects.id, projectId),
                            eq(organizationMembers.profileId, locals.profile.id)
                        )
                    )
                    .limit(1);

                if (project.length > 0) {
                    organizationId = project[0].organizationId;
                }
            }

            // If no organization from project, get user's first organization
            if (!organizationId) {
                const userOrg = await db
                    .select({ organizationId: organizationMembers.organizationId })
                    .from(organizationMembers)
                    .where(eq(organizationMembers.profileId, locals.profile.id))
                    .limit(1);

                if (userOrg.length > 0) {
                    organizationId = userOrg[0].organizationId;
                }
            }

            // If still no organization, create a personal one
            if (!organizationId) {
                const orgNumber = await generateOrgNumber();
                const [newOrg] = await db.insert(organizations).values({
                    name: `${locals.profile.firstName || 'User'}'s Organization`,
                    orgNumber,
                    slug: generateSlug(),
                    email: locals.profile.email
                }).returning({ id: organizations.id });

                organizationId = newOrg.id;

                // Add user as owner
                await db.insert(organizationMembers).values({
                    organizationId: newOrg.id,
                    profileId: locals.profile.id,
                    role: 'owner'
                });
            }

            // Calculate due date based on priority
            const dueDate = new Date();
            switch (priority) {
                case 'urgent':
                    dueDate.setHours(dueDate.getHours() + 2);
                    break;
                case 'high':
                    dueDate.setHours(dueDate.getHours() + 4);
                    break;
                case 'medium':
                    dueDate.setHours(dueDate.getHours() + 24);
                    break;
                case 'low':
                    dueDate.setHours(dueDate.getHours() + 48);
                    break;
            }

            // Create the ticket
            const [newTicket] = await db.insert(tickets).values({
                organizationId,
                projectId: projectId || null,
                ticketNumber: generateTicketNumber(),
                subject: subject.trim(),
                description: description.trim(),
                status: 'open',
                priority,
                category: category || 'general',
                createdById: locals.profile.id,
                dueAt: dueDate
            }).returning({ id: tickets.id, ticketNumber: tickets.ticketNumber });

            // Handle file attachments
            const files = formData.getAll('files') as File[];
            if (files.length > 0) {
                const supabase = createSupabaseAdminClient();

                for (const file of files.slice(0, MAX_FILES)) {
                    // Skip empty files or invalid types
                    if (!file.size || file.size > MAX_FILE_SIZE || !ALLOWED_TYPES.includes(file.type)) {
                        continue;
                    }

                    try {
                        // Create unique file path
                        const timestamp = Date.now();
                        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
                        const storagePath = `ticket/${newTicket.id}/${timestamp}_${sanitizedFileName}`;

                        // Get file buffer
                        const arrayBuffer = await file.arrayBuffer();
                        const buffer = new Uint8Array(arrayBuffer);

                        // Upload to Supabase Storage
                        const { error: uploadError } = await supabase
                            .storage
                            .from('attachments')
                            .upload(storagePath, buffer, {
                                contentType: file.type,
                                upsert: false
                            });

                        if (uploadError) {
                            console.error('File upload error:', uploadError);
                            continue;
                        }

                        // Get public URL
                        const { data: urlData } = supabase
                            .storage
                            .from('attachments')
                            .getPublicUrl(storagePath);

                        // Save file record to database
                        await db.insert(fileUploads).values({
                            entityType: 'ticket',
                            entityId: newTicket.id,
                            fileName: file.name,
                            fileType: file.type,
                            fileSize: file.size,
                            fileUrl: urlData.publicUrl,
                            storagePath,
                            uploadedById: locals.profile.id
                        });
                    } catch (fileErr) {
                        console.error('Error processing file:', file.name, fileErr);
                    }
                }
            }

            // Log activity
            await ticketActivity.created(
                newTicket.id,
                newTicket.ticketNumber,
                locals.profile.id,
                getClientIp(request)
            );

            // Send confirmation email to ticket creator
            const ticketUrl = `${env.PUBLIC_SITE_URL || 'http://localhost:5173'}/app/tickets/${newTicket.id}`;
            await sendTicketCreatedEmail({
                recipientName: locals.profile.displayName ?? locals.profile.firstName ?? 'Client',
                recipientEmail: locals.profile.email,
                ticketNumber: newTicket.ticketNumber,
                subject: subject.trim(),
                status: 'Open',
                priority: priority.charAt(0).toUpperCase() + priority.slice(1),
                ticketUrl
            });

            // Notify admins about new ticket
            const adminStaff = await db
                .select({ email: profiles.email, name: profiles.displayName })
                .from(profiles)
                .where(
                    or(
                        eq(profiles.role, 'super_admin'),
                        eq(profiles.role, 'admin'),
                        eq(profiles.role, 'staff')
                    )
                );

            const adminTicketUrl = `${env.PUBLIC_SITE_URL || 'http://localhost:5173'}/admin/tickets/${newTicket.id}`;
            for (const admin of adminStaff) {
                if (admin.email) {
                    await sendTicketCreatedEmail({
                        recipientName: admin.name ?? 'Admin',
                        recipientEmail: admin.email,
                        ticketNumber: newTicket.ticketNumber,
                        subject: subject.trim(),
                        status: 'Open',
                        priority: priority.charAt(0).toUpperCase() + priority.slice(1),
                        ticketUrl: adminTicketUrl
                    });
                }
            }

            // Redirect to the new ticket
            return redirect(303, `/app/tickets/${newTicket.id}`);
        } catch (err) {
            // Re-throw redirect errors
            if (err && typeof err === 'object' && 'status' in err && 'location' in err) throw err;

            console.error('Ticket creation exception:', err);
            return fail(500, {
                error: 'An unexpected error occurred while creating your ticket',
                subject, description, priority, category
            });
        }
    }
};
