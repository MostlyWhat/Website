/**
 * Ticket Detail Server Actions
 * 
 * Loads ticket data and handles message sending.
 */

import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { tickets, ticketComments, profiles, organizations, projects } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals, params }) => {
    // Verify user is authenticated
    if (!locals.session || !locals.profile) {
        throw redirect(303, '/auth/login');
    }

    const ticketId = params.id;

    // Fetch ticket with organization and project info
    const ticketData = await db
        .select({
            id: tickets.id,
            ticketNumber: tickets.ticketNumber,
            subject: tickets.subject,
            description: tickets.description,
            status: tickets.status,
            priority: tickets.priority,
            category: tickets.category,
            createdAt: tickets.createdAt,
            updatedAt: tickets.updatedAt,
            resolvedAt: tickets.resolvedAt,
            dueAt: tickets.dueAt,
            firstResponseAt: tickets.firstResponseAt,
            organizationId: tickets.organizationId,
            organizationName: organizations.name,
            projectId: tickets.projectId,
            projectName: projects.name,
            createdById: tickets.createdById,
            assignedToId: tickets.assignedToId
        })
        .from(tickets)
        .innerJoin(organizations, eq(tickets.organizationId, organizations.id))
        .leftJoin(projects, eq(tickets.projectId, projects.id))
        .where(eq(tickets.id, ticketId))
        .limit(1);

    if (ticketData.length === 0) {
        throw error(404, 'Ticket not found');
    }

    const ticket = ticketData[0];

    // Verify user has access to this ticket
    const isStaff = ['super_admin', 'admin', 'staff'].includes(locals.profile.role);
    const isCreator = ticket.createdById === locals.profile.id;

    if (!isStaff && !isCreator) {
        // Check if user is member of the ticket's organization
        const membership = await db
            .select()
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, ticket.organizationId),
                    eq(organizationMembers.profileId, locals.profile.id)
                )
            )
            .limit(1);

        if (membership.length === 0) {
            throw error(403, 'You do not have access to this ticket');
        }
    }

    // Fetch comments/messages
    const comments = await db
        .select({
            id: ticketComments.id,
            content: ticketComments.content,
            isInternal: ticketComments.isInternal,
            attachments: ticketComments.attachments,
            createdAt: ticketComments.createdAt,
            authorId: ticketComments.authorId,
            authorFirstName: profiles.firstName,
            authorLastName: profiles.lastName,
            authorRole: profiles.role
        })
        .from(ticketComments)
        .innerJoin(profiles, eq(ticketComments.authorId, profiles.id))
        .where(
            isStaff
                ? eq(ticketComments.ticketId, ticketId)
                : and(
                    eq(ticketComments.ticketId, ticketId),
                    eq(ticketComments.isInternal, false)
                )
        )
        .orderBy(ticketComments.createdAt);

    // Fetch creator and assignee info
    const creatorData = await db
        .select({
            firstName: profiles.firstName,
            lastName: profiles.lastName,
            role: profiles.role
        })
        .from(profiles)
        .where(eq(profiles.id, ticket.createdById))
        .limit(1);

    let assigneeData = null;
    if (ticket.assignedToId) {
        const assignee = await db
            .select({
                firstName: profiles.firstName,
                lastName: profiles.lastName,
                role: profiles.role
            })
            .from(profiles)
            .where(eq(profiles.id, ticket.assignedToId))
            .limit(1);

        if (assignee.length > 0) {
            assigneeData = assignee[0];
        }
    }

    // Build messages array for display
    const messages = [
        // Initial ticket message
        {
            id: 'initial',
            author: creatorData[0] ? `${creatorData[0].firstName || ''} ${creatorData[0].lastName || ''}`.trim() || 'You' : 'You',
            is_staff: creatorData[0]?.role && ['super_admin', 'admin', 'staff'].includes(creatorData[0].role),
            content: ticket.description,
            created_at: ticket.createdAt.toISOString(),
            attachments: []
        },
        // Comment messages
        ...comments.map(comment => ({
            id: comment.id,
            author: `${comment.authorFirstName || ''} ${comment.authorLastName || ''}`.trim() || 'Unknown',
            is_staff: comment.authorRole && ['super_admin', 'admin', 'staff'].includes(comment.authorRole),
            content: comment.content,
            created_at: comment.createdAt.toISOString(),
            attachments: (comment.attachments as Array<{ name: string }> || []).map(a => a.name)
        }))
    ];

    return {
        ticket: {
            id: ticket.id,
            ticketNumber: ticket.ticketNumber,
            subject: ticket.subject,
            status: ticket.status,
            priority: ticket.priority,
            category: ticket.category || 'general',
            created_at: ticket.createdAt.toISOString(),
            updated_at: ticket.updatedAt.toISOString(),
            project: ticket.projectName || 'No Project',
            assigned_to: assigneeData ? {
                name: `${assigneeData.firstName || ''} ${assigneeData.lastName || ''}`.trim() || 'Staff',
                role: assigneeData.role === 'staff' ? 'Technical Support' : 'Support Team'
            } : null,
            messages
        },
        isStaff
    };
};

// Import for the organization members check above
import { organizationMembers } from '$lib/server/db/schema';

export const actions: Actions = {
    sendMessage: async ({ request, locals, params }) => {
        // Verify user is authenticated
        if (!locals.session || !locals.profile) {
            return fail(401, { error: 'You must be logged in to send messages' });
        }

        const formData = await request.formData();
        const message = formData.get('message') as string;
        const isInternal = formData.get('isInternal') === 'true';

        // Validation
        if (!message?.trim()) {
            return fail(400, { error: 'Message cannot be empty' });
        }

        if (message.trim().length < 2) {
            return fail(400, { error: 'Message is too short' });
        }

        const ticketId = params.id;

        try {
            // Verify ticket exists and user has access
            const ticketData = await db
                .select({
                    id: tickets.id,
                    organizationId: tickets.organizationId,
                    createdById: tickets.createdById,
                    status: tickets.status,
                    firstResponseAt: tickets.firstResponseAt
                })
                .from(tickets)
                .where(eq(tickets.id, ticketId))
                .limit(1);

            if (ticketData.length === 0) {
                return fail(404, { error: 'Ticket not found' });
            }

            const ticket = ticketData[0];
            const isStaff = ['super_admin', 'admin', 'staff'].includes(locals.profile.role);

            // Verify access
            if (!isStaff && ticket.createdById !== locals.profile.id) {
                const membership = await db
                    .select()
                    .from(organizationMembers)
                    .where(
                        and(
                            eq(organizationMembers.organizationId, ticket.organizationId),
                            eq(organizationMembers.profileId, locals.profile.id)
                        )
                    )
                    .limit(1);

                if (membership.length === 0) {
                    return fail(403, { error: 'You do not have access to this ticket' });
                }
            }

            // Only staff can add internal comments
            if (isInternal && !isStaff) {
                return fail(403, { error: 'Only staff can add internal comments' });
            }

            // Create the comment
            await db.insert(ticketComments).values({
                ticketId,
                content: message.trim(),
                isInternal: isInternal && isStaff,
                authorId: locals.profile.id,
                attachments: []
            });

            // Update ticket status and timestamps
            const updateData: { updatedAt: Date; status?: 'awaiting_customer' | 'awaiting_staff'; firstResponseAt?: Date } = {
                updatedAt: new Date()
            };

            // If staff replies, set to awaiting_customer; if customer replies, set to awaiting_staff
            if (ticket.status !== 'closed' && ticket.status !== 'resolved') {
                if (isStaff) {
                    updateData.status = 'awaiting_customer';
                    // Track first response time
                    if (!ticket.firstResponseAt) {
                        updateData.firstResponseAt = new Date();
                    }
                } else {
                    updateData.status = 'awaiting_staff';
                }
            }

            await db.update(tickets)
                .set(updateData)
                .where(eq(tickets.id, ticketId));

            return { success: true };
        } catch (err) {
            console.error('Message sending exception:', err);
            return fail(500, { error: 'An unexpected error occurred' });
        }
    },

    closeTicket: async ({ locals, params }) => {
        if (!locals.session || !locals.profile) {
            return fail(401, { error: 'You must be logged in' });
        }

        const ticketId = params.id;

        try {
            // Only staff can close tickets
            const isStaff = ['super_admin', 'admin', 'staff'].includes(locals.profile.role);

            // Get ticket
            const ticketData = await db
                .select({
                    id: tickets.id,
                    createdById: tickets.createdById,
                    status: tickets.status
                })
                .from(tickets)
                .where(eq(tickets.id, ticketId))
                .limit(1);

            if (ticketData.length === 0) {
                return fail(404, { error: 'Ticket not found' });
            }

            // Customer can close their own ticket
            if (!isStaff && ticketData[0].createdById !== locals.profile.id) {
                return fail(403, { error: 'You cannot close this ticket' });
            }

            await db.update(tickets)
                .set({
                    status: 'closed',
                    closedAt: new Date(),
                    updatedAt: new Date()
                })
                .where(eq(tickets.id, ticketId));

            return { success: true };
        } catch (err) {
            console.error('Close ticket exception:', err);
            return fail(500, { error: 'Failed to close ticket' });
        }
    },

    reopenTicket: async ({ locals, params }) => {
        if (!locals.session || !locals.profile) {
            return fail(401, { error: 'You must be logged in' });
        }

        const ticketId = params.id;

        try {
            // Get ticket
            const ticketData = await db
                .select({
                    id: tickets.id,
                    createdById: tickets.createdById
                })
                .from(tickets)
                .where(eq(tickets.id, ticketId))
                .limit(1);

            if (ticketData.length === 0) {
                return fail(404, { error: 'Ticket not found' });
            }

            const isStaff = ['super_admin', 'admin', 'staff'].includes(locals.profile.role);

            if (!isStaff && ticketData[0].createdById !== locals.profile.id) {
                return fail(403, { error: 'You cannot reopen this ticket' });
            }

            await db.update(tickets)
                .set({
                    status: 'open',
                    closedAt: null,
                    resolvedAt: null,
                    updatedAt: new Date()
                })
                .where(eq(tickets.id, ticketId));

            return { success: true };
        } catch (err) {
            console.error('Reopen ticket exception:', err);
            return fail(500, { error: 'Failed to reopen ticket' });
        }
    },

    markResolved: async ({ locals, params }) => {
        if (!locals.session || !locals.profile) {
            return fail(401, { error: 'You must be logged in' });
        }

        const ticketId = params.id;

        try {
            const ticketData = await db
                .select({
                    id: tickets.id,
                    createdById: tickets.createdById
                })
                .from(tickets)
                .where(eq(tickets.id, ticketId))
                .limit(1);

            if (ticketData.length === 0) {
                return fail(404, { error: 'Ticket not found' });
            }

            const isStaff = ['super_admin', 'admin', 'staff'].includes(locals.profile.role);

            if (!isStaff && ticketData[0].createdById !== locals.profile.id) {
                return fail(403, { error: 'You cannot mark this ticket as resolved' });
            }

            await db.update(tickets)
                .set({
                    status: 'resolved',
                    resolvedAt: new Date(),
                    updatedAt: new Date()
                })
                .where(eq(tickets.id, ticketId));

            return { success: true };
        } catch (err) {
            console.error('Mark resolved exception:', err);
            return fail(500, { error: 'Failed to mark ticket as resolved' });
        }
    }
};
