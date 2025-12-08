import { createDb } from '$lib/server/db';
import { tickets, profiles, organizations, ticketComments, projects, cannedResponses, fileUploads } from '$lib/server/db/schema';
import { eq, desc, and, or, inArray } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { error, fail, redirect } from '@sveltejs/kit';
import { ticketActivity, getClientIp } from '$lib/server/activity-logger';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const db = createDb();
    if (!locals.user || !locals.profile) {
        redirect(302, '/auth/login');
    }

    // Verify admin/staff role
    if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        error(403, 'Access denied');
    }

    const ticketId = params.id;

    // Aliases for joined tables
    const assignedProfile = alias(profiles, 'assigned_profile');
    const creatorProfile = alias(profiles, 'creator_profile');

    // Fetch the ticket
    const ticketData = await db
        .select({
            id: tickets.id,
            ticketNumber: tickets.ticketNumber,
            subject: tickets.subject,
            description: tickets.description,
            status: tickets.status,
            priority: tickets.priority,
            category: tickets.category,
            tags: tickets.tags,
            createdAt: tickets.createdAt,
            updatedAt: tickets.updatedAt,
            resolvedAt: tickets.resolvedAt,
            closedAt: tickets.closedAt,
            resolution: tickets.resolution,
            dueAt: tickets.dueAt,
            firstResponseAt: tickets.firstResponseAt,
            assignedToId: tickets.assignedToId,
            assignedToName: assignedProfile.displayName,
            assignedToEmail: assignedProfile.email,
            createdById: tickets.createdById,
            createdByName: creatorProfile.displayName,
            createdByEmail: creatorProfile.email,
            organizationId: tickets.organizationId,
            organizationName: organizations.name,
            projectId: tickets.projectId
        })
        .from(tickets)
        .leftJoin(assignedProfile, eq(tickets.assignedToId, assignedProfile.id))
        .leftJoin(creatorProfile, eq(tickets.createdById, creatorProfile.id))
        .leftJoin(organizations, eq(tickets.organizationId, organizations.id))
        .where(eq(tickets.id, ticketId))
        .limit(1);

    if (!ticketData.length) {
        error(404, 'Ticket not found');
    }

    const ticket = ticketData[0];

    // Fetch project if exists
    let project = null;
    if (ticket.projectId) {
        const projectData = await db
            .select({
                id: projects.id,
                name: projects.name,
                slug: projects.slug
            })
            .from(projects)
            .where(eq(projects.id, ticket.projectId))
            .limit(1);

        if (projectData.length) {
            project = projectData[0];
        }
    }

    // Fetch comments
    const commentsData = await db
        .select({
            id: ticketComments.id,
            content: ticketComments.content,
            isInternal: ticketComments.isInternal,
            createdAt: ticketComments.createdAt,
            authorId: ticketComments.authorId,
            authorName: profiles.displayName,
            authorEmail: profiles.email,
            authorRole: profiles.role
        })
        .from(ticketComments)
        .leftJoin(profiles, eq(ticketComments.authorId, profiles.id))
        .where(eq(ticketComments.ticketId, ticketId))
        .orderBy(desc(ticketComments.createdAt));

    // Fetch available staff for assignment
    const staffMembers = await db
        .select({
            id: profiles.id,
            displayName: profiles.displayName,
            email: profiles.email,
            role: profiles.role
        })
        .from(profiles)
        .where(
            or(
                eq(profiles.role, 'super_admin'),
                eq(profiles.role, 'admin'),
                eq(profiles.role, 'staff')
            )
        )
        .orderBy(profiles.displayName);

    // Fetch canned responses (global or created by current user)
    const cannedResponsesData = await db
        .select({
            id: cannedResponses.id,
            shortcut: cannedResponses.shortcut,
            title: cannedResponses.title,
            content: cannedResponses.content,
            category: cannedResponses.category
        })
        .from(cannedResponses)
        .where(
            and(
                eq(cannedResponses.isActive, true),
                or(
                    eq(cannedResponses.isGlobal, true),
                    eq(cannedResponses.createdById, locals.profile.id)
                )
            )
        )
        .orderBy(cannedResponses.shortcut);

    // Fetch attachments
    const uploaderProfile = alias(profiles, 'uploader_profile');
    const attachmentsData = await db
        .select({
            id: fileUploads.id,
            name: fileUploads.fileName,
            type: fileUploads.fileType,
            size: fileUploads.fileSize,
            url: fileUploads.fileUrl,
            createdAt: fileUploads.createdAt,
            uploadedBy: uploaderProfile.displayName
        })
        .from(fileUploads)
        .leftJoin(uploaderProfile, eq(fileUploads.uploadedById, uploaderProfile.id))
        .where(
            and(
                eq(fileUploads.entityType, 'ticket'),
                eq(fileUploads.entityId, ticketId)
            )
        )
        .orderBy(desc(fileUploads.createdAt));

    return {
        ticket: {
            ...ticket,
            organization: ticket.organizationName ?? 'Unknown',
            createdBy: {
                id: ticket.createdById,
                name: ticket.createdByName ?? 'Unknown',
                email: ticket.createdByEmail
            },
            assignedTo: ticket.assignedToId ? {
                id: ticket.assignedToId,
                name: ticket.assignedToName ?? 'Unknown',
                email: ticket.assignedToEmail
            } : null
        },
        project,
        comments: commentsData.map(c => ({
            ...c,
            author: {
                id: c.authorId,
                name: c.authorName ?? 'Unknown',
                email: c.authorEmail,
                role: c.authorRole,
                isStaff: c.authorRole && ['super_admin', 'admin', 'staff'].includes(c.authorRole)
            }
        })),
        staffMembers,
        cannedResponses: cannedResponsesData,
        attachments: attachmentsData
    };
};

export const actions: Actions = {
    assign: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const assignedToId = formData.get('assignedToId') as string;

        // Get current ticket info for logging
        const [currentTicket] = await db
            .select({ ticketNumber: tickets.ticketNumber })
            .from(tickets)
            .where(eq(tickets.id, params.id));

        await db
            .update(tickets)
            .set({
                assignedToId: assignedToId || null,
                updatedAt: new Date()
            })
            .where(eq(tickets.id, params.id));

        // Get assignee name for logging
        let assigneeName: string | null = null;
        if (assignedToId) {
            const [assignee] = await db
                .select({ displayName: profiles.displayName })
                .from(profiles)
                .where(eq(profiles.id, assignedToId));
            assigneeName = assignee?.displayName ?? null;
        }

        // Log activity
        await ticketActivity.assigned(
            params.id,
            currentTicket.ticketNumber,
            assigneeName,
            locals.profile.id,
            getClientIp(request)
        );

        return { success: true, message: 'Ticket assigned successfully' };
    },

    updateStatus: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const status = formData.get('status') as string;

        // Get current ticket info for logging
        const [currentTicket] = await db
            .select({ ticketNumber: tickets.ticketNumber, status: tickets.status })
            .from(tickets)
            .where(eq(tickets.id, params.id));

        const oldStatus = currentTicket.status;

        const updateData: Record<string, unknown> = {
            status,
            updatedAt: new Date()
        };

        // Set timestamps based on status
        if (status === 'resolved') {
            updateData.resolvedAt = new Date();
        } else if (status === 'closed') {
            updateData.closedAt = new Date();
        } else if (status === 'open' || status === 'in_progress') {
            // Reopening - clear resolved/closed dates
            updateData.resolvedAt = null;
            updateData.closedAt = null;
        }

        await db
            .update(tickets)
            .set(updateData)
            .where(eq(tickets.id, params.id));

        // Log activity
        await ticketActivity.statusChanged(
            params.id,
            currentTicket.ticketNumber,
            oldStatus,
            status,
            locals.profile.id,
            getClientIp(request)
        );

        return { success: true, message: 'Status updated successfully' };
    },

    updatePriority: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const priority = formData.get('priority') as 'low' | 'medium' | 'high' | 'urgent';

        // Get current ticket info for logging
        const [currentTicket] = await db
            .select({ ticketNumber: tickets.ticketNumber, priority: tickets.priority })
            .from(tickets)
            .where(eq(tickets.id, params.id));

        const oldPriority = currentTicket.priority;

        await db
            .update(tickets)
            .set({
                priority,
                updatedAt: new Date()
            })
            .where(eq(tickets.id, params.id));

        // Log activity
        await ticketActivity.updated(
            params.id,
            currentTicket.ticketNumber,
            { priority: { old: oldPriority, new: priority } },
            locals.profile.id,
            getClientIp(request)
        );

        return { success: true, message: 'Priority updated successfully' };
    },

    addComment: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const content = formData.get('content') as string;
        const isInternal = formData.get('isInternal') === 'true';

        if (!content?.trim()) {
            return fail(400, { error: 'Comment content is required' });
        }

        // Get ticket info for logging
        const [currentTicket] = await db
            .select({ ticketNumber: tickets.ticketNumber })
            .from(tickets)
            .where(eq(tickets.id, params.id));

        await db.insert(ticketComments).values({
            ticketId: params.id,
            authorId: locals.profile.id,
            content: content.trim(),
            isInternal
        });

        // Update ticket timestamp
        await db
            .update(tickets)
            .set({ updatedAt: new Date() })
            .where(eq(tickets.id, params.id));

        // Log activity
        await ticketActivity.commentAdded(
            params.id,
            currentTicket.ticketNumber,
            isInternal,
            locals.profile.id,
            getClientIp(request)
        );

        return { success: true, message: 'Comment added successfully' };
    },

    deleteComment: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Only admins can delete comments' });
        }

        const formData = await request.formData();
        const commentId = formData.get('commentId') as string;

        await db
            .delete(ticketComments)
            .where(
                and(
                    eq(ticketComments.id, commentId),
                    eq(ticketComments.ticketId, params.id)
                )
            );

        return { success: true, message: 'Comment deleted successfully' };
    },

    updateCategory: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const category = formData.get('category') as string;

        await db
            .update(tickets)
            .set({
                category: category || null,
                updatedAt: new Date()
            })
            .where(eq(tickets.id, params.id));

        return { success: true, message: 'Category updated successfully' };
    },

    addTag: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const tag = (formData.get('tag') as string)?.trim().toLowerCase();

        if (!tag) {
            return fail(400, { error: 'Tag cannot be empty' });
        }

        // Get current tags
        const [ticketData] = await db
            .select({ tags: tickets.tags })
            .from(tickets)
            .where(eq(tickets.id, params.id))
            .limit(1);

        const currentTags = ticketData?.tags ?? [];

        // Check if tag already exists
        if (currentTags.includes(tag)) {
            return fail(400, { error: 'Tag already exists' });
        }

        // Add new tag
        await db
            .update(tickets)
            .set({
                tags: [...currentTags, tag],
                updatedAt: new Date()
            })
            .where(eq(tickets.id, params.id));

        return { success: true, message: 'Tag added successfully' };
    },

    removeTag: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const tag = formData.get('tag') as string;

        // Get current tags
        const [ticketData] = await db
            .select({ tags: tickets.tags })
            .from(tickets)
            .where(eq(tickets.id, params.id))
            .limit(1);

        const currentTags = ticketData?.tags ?? [];

        // Remove the tag
        const newTags = currentTags.filter(t => t !== tag);

        await db
            .update(tickets)
            .set({
                tags: newTags.length > 0 ? newTags : null,
                updatedAt: new Date()
            })
            .where(eq(tickets.id, params.id));

        return { success: true, message: 'Tag removed successfully' };
    }
};
