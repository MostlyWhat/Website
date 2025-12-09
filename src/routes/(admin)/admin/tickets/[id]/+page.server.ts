import { createDb } from '$lib/server/db';
import { tickets, profiles, organizations, ticketComments, projects, cannedResponses, fileUploads, slaPolicies, ticketSatisfactionSurveys, ticketWatchers } from '$lib/server/db/schema';
import { eq, desc, and, or, inArray, like, isNull } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { error, fail, redirect } from '@sveltejs/kit';
import { ticketActivity, getClientIp } from '$lib/server/activity-logger';
import { calculateSLAStatus } from '$lib/server/sla-calculator';
import { mergeTickets, getMergedTickets, getChildTickets, getParentHierarchy, setParentTicket, createSatisfactionSurvey } from '$lib/server/ticket-relationships';
import { addTicketWatcher, removeTicketWatcher, getTicketWatchers } from '$lib/server/ticket-watchers';
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
            projectId: tickets.projectId,
            // SLA fields
            slaPolicyId: tickets.slaPolicyId,
            slaResponseDueAt: tickets.slaResponseDueAt,
            slaResolutionDueAt: tickets.slaResolutionDueAt,
            slaFirstResponseAt: tickets.slaFirstResponseAt,
            slaResolvedAt: tickets.slaResolvedAt,
            slaBreached: tickets.slaBreached
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
            category: cannedResponses.category,
            supportsVariables: cannedResponses.supportsVariables
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

    // Fetch SLA policy and calculate status
    let slaPolicy = null;
    let slaStatus = null;

    if (ticket.slaPolicyId) {
        const [policy] = await db
            .select()
            .from(slaPolicies)
            .where(eq(slaPolicies.id, ticket.slaPolicyId))
            .limit(1);

        if (policy) {
            slaPolicy = policy;

            // Calculate SLA status if deadlines exist
            if (ticket.slaResponseDueAt && ticket.slaResolutionDueAt) {
                slaStatus = calculateSLAStatus(
                    ticket.createdAt,
                    ticket.slaResponseDueAt,
                    ticket.slaResolutionDueAt,
                    ticket.slaFirstResponseAt,
                    ticket.slaResolvedAt,
                    {
                        urgentResponseHours: policy.urgentResponseHours,
                        urgentResolutionHours: policy.urgentResolutionHours,
                        highResponseHours: policy.highResponseHours,
                        highResolutionHours: policy.highResolutionHours,
                        mediumResponseHours: policy.mediumResponseHours,
                        mediumResolutionHours: policy.mediumResolutionHours,
                        lowResponseHours: policy.lowResponseHours,
                        lowResolutionHours: policy.lowResolutionHours,
                        businessHoursOnly: policy.businessHoursOnly,
                        businessHoursStart: policy.businessHoursStart,
                        businessHoursEnd: policy.businessHoursEnd,
                        businessDays: policy.businessDays
                    }
                );
            }
        }
    }

    // Fetch merged tickets
    const mergedTickets = await getMergedTickets(ticketId);

    // Fetch child tickets
    const childTickets = await getChildTickets(ticketId);

    // Fetch parent hierarchy
    const parentHierarchy = await getParentHierarchy(ticketId);

    // Fetch satisfaction survey if exists
    const [satisfactionSurvey] = await db
        .select({
            id: ticketSatisfactionSurveys.id,
            rating: ticketSatisfactionSurveys.rating,
            responseTimeRating: ticketSatisfactionSurveys.responseTimeRating,
            resolutionQualityRating: ticketSatisfactionSurveys.resolutionQualityRating,
            staffProfessionalismRating: ticketSatisfactionSurveys.staffProfessionalismRating,
            feedback: ticketSatisfactionSurveys.feedback,
            wouldRecommend: ticketSatisfactionSurveys.wouldRecommend,
            surveySentAt: ticketSatisfactionSurveys.surveySentAt,
            respondedAt: ticketSatisfactionSurveys.respondedAt
        })
        .from(ticketSatisfactionSurveys)
        .where(eq(ticketSatisfactionSurveys.ticketId, ticketId))
        .limit(1);

    // Fetch watchers
    const watchers = await getTicketWatchers(ticketId);
    const isWatching = watchers.some(w => w.userId === locals.profile?.id);

    return {
        ticket: {
            ...ticket,
            organization: ticket.organizationId ? {
                id: ticket.organizationId,
                name: ticket.organizationName ?? 'Unknown'
            } : null,
            createdBy: {
                id: ticket.createdById,
                displayName: ticket.createdByName ?? 'Unknown',
                email: ticket.createdByEmail,
                firstName: ticket.createdByName?.split(' ')[0] ?? '',
                lastName: ticket.createdByName?.split(' ').slice(1).join(' ') ?? ''
            },
            assignedTo: ticket.assignedToId ? {
                id: ticket.assignedToId,
                displayName: ticket.assignedToName ?? 'Unknown',
                email: ticket.assignedToEmail
            } : null,
            project: project ? {
                id: project.id,
                name: project.name
            } : null,
            slaStatus
        },
        slaPolicy,
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
        attachments: attachmentsData,
        mergedTickets,
        childTickets,
        parentHierarchy,
        satisfactionSurvey: satisfactionSurvey ?? null,
        watchers,
        isWatching
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

        // Get current ticket info for logging and survey
        const [currentTicket] = await db
            .select({
                ticketNumber: tickets.ticketNumber,
                status: tickets.status,
                createdById: tickets.createdById
            })
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

            // Create satisfaction survey if transitioning to resolved
            if (oldStatus !== 'resolved') {
                try {
                    await createSatisfactionSurvey(params.id, currentTicket.createdById);
                    // TODO: Send email with survey link
                    // The survey token is stored in the database and can be used to generate the link
                    // Survey URL: /surveys/{token}
                } catch (error) {
                    console.error('Failed to create satisfaction survey:', error);
                    // Don't fail the status update if survey creation fails
                }
            }
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

        // Get current ticket info for logging
        const [currentTicket] = await db
            .select({ ticketNumber: tickets.ticketNumber, category: tickets.category })
            .from(tickets)
            .where(eq(tickets.id, params.id));

        const oldCategory = currentTicket.category;

        await db
            .update(tickets)
            .set({
                category: category || null,
                updatedAt: new Date()
            })
            .where(eq(tickets.id, params.id));

        // Log activity
        await ticketActivity.updated(
            params.id,
            currentTicket.ticketNumber,
            { category: { old: oldCategory, new: category } },
            locals.profile.id,
            getClientIp(request)
        );

        return { success: true, message: 'Category updated successfully' };
    }, addTag: async ({ request, params, locals }) => {
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
            .select({ tags: tickets.tags, ticketNumber: tickets.ticketNumber })
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

        // Log activity
        await ticketActivity.updated(
            params.id,
            ticketData.ticketNumber,
            { tags: { added: tag } },
            locals.profile.id,
            getClientIp(request)
        );

        return { success: true, message: 'Tag added successfully' };
    }, removeTag: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const tag = formData.get('tag') as string;

        // Get current tags
        const [ticketData] = await db
            .select({ tags: tickets.tags, ticketNumber: tickets.ticketNumber })
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

        // Log activity
        await ticketActivity.updated(
            params.id,
            ticketData.ticketNumber,
            { tags: { removed: tag } },
            locals.profile.id,
            getClientIp(request)
        );

        return { success: true, message: 'Tag removed successfully' };
    },

    searchTickets: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const query = (formData.get('query') as string)?.trim();

        if (!query || query.length < 2) {
            return { tickets: [] };
        }

        // Search for tickets by number or subject (exclude merged tickets)
        const creatorProfile = alias(profiles, 'creator_profile');

        const searchResults = await db
            .select({
                id: tickets.id,
                ticketNumber: tickets.ticketNumber,
                subject: tickets.subject,
                status: tickets.status,
                priority: tickets.priority,
                createdAt: tickets.createdAt,
                createdByName: creatorProfile.displayName
            })
            .from(tickets)
            .leftJoin(creatorProfile, eq(tickets.createdById, creatorProfile.id))
            .where(
                and(
                    or(
                        like(tickets.ticketNumber, `%${query}%`),
                        like(tickets.subject, `%${query}%`)
                    ),
                    isNull(tickets.mergedIntoId) // Exclude already merged tickets
                )
            )
            .orderBy(desc(tickets.createdAt))
            .limit(10);

        return {
            tickets: searchResults.map(t => ({
                id: t.id,
                ticketNumber: t.ticketNumber,
                subject: t.subject,
                status: t.status,
                priority: t.priority,
                createdAt: t.createdAt?.toISOString() ?? null,
                createdByName: t.createdByName ?? 'Unknown'
            }))
        };
    },

    merge: async ({ request, params, locals }) => {
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const targetTicketId = formData.get('targetTicketId') as string;
        const transferComments = formData.get('transferComments') === 'true';
        const transferTags = formData.get('transferTags') === 'true';

        if (!targetTicketId) {
            return fail(400, { error: 'Target ticket is required' });
        }

        if (targetTicketId === params.id) {
            return fail(400, { error: 'Cannot merge a ticket into itself' });
        }

        // Get ticket numbers for logging
        const [sourceTicket] = await db
            .select({ ticketNumber: tickets.ticketNumber })
            .from(tickets)
            .where(eq(tickets.id, params.id));

        const [targetTicket] = await db
            .select({ ticketNumber: tickets.ticketNumber })
            .from(tickets)
            .where(eq(tickets.id, targetTicketId));

        if (!sourceTicket || !targetTicket) {
            return fail(404, { error: 'One or both tickets not found' });
        }

        // Perform the merge
        const result = await mergeTickets({
            sourceTicketId: params.id,
            targetTicketId,
            mergedById: locals.profile.id,
            transferComments,
            transferTags
        });

        if (!result.success) {
            return fail(400, { error: result.error ?? 'Failed to merge tickets' });
        }

        // Log activity
        await ticketActivity.updated(
            params.id,
            sourceTicket.ticketNumber,
            {
                merged: {
                    into: targetTicket.ticketNumber,
                    transferredComments: result.commentsTransferred,
                    mergedTags: result.tagsMerged
                }
            },
            locals.profile.id,
            getClientIp(request)
        );

        // Redirect to the target ticket
        redirect(303, `/admin/tickets/${targetTicketId}`);
    },

    setParent: async ({ request, params, locals }) => {
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const parentTicketId = formData.get('parentTicketId') as string;

        if (!parentTicketId) {
            return fail(400, { error: 'Parent ticket is required' });
        }

        if (parentTicketId === params.id) {
            return fail(400, { error: 'A ticket cannot be its own parent' });
        }

        // Get ticket numbers for logging
        const [childTicket] = await db
            .select({ ticketNumber: tickets.ticketNumber })
            .from(tickets)
            .where(eq(tickets.id, params.id));

        const [parentTicket] = await db
            .select({ ticketNumber: tickets.ticketNumber })
            .from(tickets)
            .where(eq(tickets.id, parentTicketId));

        if (!childTicket || !parentTicket) {
            return fail(404, { error: 'One or both tickets not found' });
        }

        // Set the parent relationship
        const result = await setParentTicket(params.id, parentTicketId);

        if (!result.success) {
            return fail(400, { error: result.error ?? 'Failed to set parent ticket' });
        }

        // Log activity
        await ticketActivity.updated(
            params.id,
            childTicket.ticketNumber,
            { parent: { set: parentTicket.ticketNumber } },
            locals.profile.id,
            getClientIp(request)
        );

        return { success: true, message: 'Parent ticket set successfully' };
    },

    removeParent: async ({ request, params, locals }) => {
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        // Get ticket number for logging
        const [childTicket] = await db
            .select({ ticketNumber: tickets.ticketNumber, parentTicketId: tickets.parentTicketId })
            .from(tickets)
            .where(eq(tickets.id, params.id));

        if (!childTicket?.parentTicketId) {
            return fail(400, { error: 'Ticket does not have a parent' });
        }

        // Get parent ticket number for logging
        const [parentTicket] = await db
            .select({ ticketNumber: tickets.ticketNumber })
            .from(tickets)
            .where(eq(tickets.id, childTicket.parentTicketId));

        // Remove the parent relationship
        const result = await setParentTicket(params.id, null);

        if (!result.success) {
            return fail(400, { error: result.error ?? 'Failed to remove parent ticket' });
        }

        // Log activity
        await ticketActivity.updated(
            params.id,
            childTicket.ticketNumber,
            { parent: { removed: parentTicket?.ticketNumber ?? 'Unknown' } },
            locals.profile.id,
            getClientIp(request)
        );

        return { success: true, message: 'Parent ticket removed successfully' };
    },

    addPrivateNote: async ({ request, params, locals }) => {
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const content = formData.get('content') as string;

        if (!content?.trim()) {
            return fail(400, { error: 'Note content is required' });
        }

        // Add internal comment (private note)
        await db.insert(ticketComments).values({
            ticketId: params.id,
            authorId: locals.profile.id,
            content: content.trim(),
            isInternal: true // This makes it a private note
        });

        // Log activity
        const [ticket] = await db
            .select({ ticketNumber: tickets.ticketNumber })
            .from(tickets)
            .where(eq(tickets.id, params.id));

        if (ticket) {
            await ticketActivity.updated(
                params.id,
                ticket.ticketNumber,
                { privateNote: 'added' },
                locals.profile.id,
                getClientIp(request)
            );
        }

        return { success: true, message: 'Private note added successfully' };
    },

    watchTicket: async ({ params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const result = await addTicketWatcher(params.id, locals.profile.id);

        if (!result.success) {
            return fail(400, { error: result.error ?? 'Failed to watch ticket' });
        }

        return { success: true, message: 'Now watching this ticket' };
    },

    unwatchTicket: async ({ params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const result = await removeTicketWatcher(params.id, locals.profile.id);

        if (!result.success) {
            return fail(400, { error: result.error ?? 'Failed to unwatch ticket' });
        }

        return { success: true, message: 'Stopped watching this ticket' };
    }
};
