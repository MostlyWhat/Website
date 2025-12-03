import { db } from '$lib/server/db';
import { tickets, profiles, organizations, ticketComments, projects } from '$lib/server/db/schema';
import { eq, desc, and, or, inArray } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || !locals.profile) {
        throw redirect(302, '/auth/login');
    }

    // Verify admin/staff role
    if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        throw error(403, 'Access denied');
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
        throw error(404, 'Ticket not found');
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
        staffMembers
    };
};

export const actions: Actions = {
    assign: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const assignedToId = formData.get('assignedToId') as string;

        await db
            .update(tickets)
            .set({
                assignedToId: assignedToId || null,
                updatedAt: new Date()
            })
            .where(eq(tickets.id, params.id));

        return { success: true, message: 'Ticket assigned successfully' };
    },

    updateStatus: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const status = formData.get('status') as string;

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

        return { success: true, message: 'Status updated successfully' };
    },

    updatePriority: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const priority = formData.get('priority') as 'low' | 'medium' | 'high' | 'urgent';

        await db
            .update(tickets)
            .set({
                priority,
                updatedAt: new Date()
            })
            .where(eq(tickets.id, params.id));

        return { success: true, message: 'Priority updated successfully' };
    },

    addComment: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const content = formData.get('content') as string;
        const isInternal = formData.get('isInternal') === 'true';

        if (!content?.trim()) {
            return fail(400, { error: 'Comment content is required' });
        }

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

        return { success: true, message: 'Comment added successfully' };
    },

    deleteComment: async ({ request, params, locals }) => {
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
    }
};
