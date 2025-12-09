import { createDb } from '$lib/server/db';
import { tickets, profiles, organizations, slaPolicies, slaOrganizationAssignments } from '$lib/server/db/schema';
import { eq, desc, sql, and, or, ilike, inArray } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { fail } from '@sveltejs/kit';
import { calculateSLAStatus } from '$lib/server/sla-calculator';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user || !locals.profile) {
        return { tickets: [], filters: { search: '', status: 'all', priority: 'all', category: 'all' } };
    }

    // Verify admin role
    if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        return { tickets: [], filters: { search: '', status: 'all', priority: 'all', category: 'all' } };
    }

    // Create per-request database connection
    const db = createDb();

    // Get filters from URL
    const search = url.searchParams.get('q') ?? '';
    const status = url.searchParams.get('status') ?? 'all';
    const priority = url.searchParams.get('priority') ?? 'all';
    const category = url.searchParams.get('category') ?? 'all';
    const assignedTo = url.searchParams.get('assigned') ?? 'all';

    // Create alias for joined profiles
    const assignedProfile = alias(profiles, 'assigned_profile');
    const creatorProfile = alias(profiles, 'creator_profile');

    // Build conditions for filtering
    const conditions = [];

    // Search filter - search across multiple fields
    if (search) {
        const searchPattern = `%${search}%`;
        conditions.push(
            or(
                ilike(tickets.ticketNumber, searchPattern),
                ilike(tickets.subject, searchPattern),
                ilike(tickets.description, searchPattern),
                ilike(creatorProfile.displayName, searchPattern),
                ilike(creatorProfile.email, searchPattern),
                ilike(organizations.name, searchPattern)
            )
        );
    }

    // Status filter
    if (status && status !== 'all') {
        conditions.push(eq(tickets.status, status as any));
    }

    // Priority filter
    if (priority && priority !== 'all') {
        conditions.push(eq(tickets.priority, priority as any));
    }

    // Category filter
    if (category && category !== 'all') {
        conditions.push(eq(tickets.category, category));
    }

    // Assigned filter
    if (assignedTo === 'unassigned') {
        conditions.push(sql`${tickets.assignedToId} IS NULL`);
    } else if (assignedTo === 'me') {
        conditions.push(eq(tickets.assignedToId, locals.profile.id));
    } else if (assignedTo && assignedTo !== 'all') {
        conditions.push(eq(tickets.assignedToId, assignedTo));
    }

    // Build the query
    let query = db
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
            dueAt: tickets.dueAt,
            assignedToId: tickets.assignedToId,
            assignedToName: assignedProfile.displayName,
            createdById: tickets.createdById,
            createdByName: creatorProfile.displayName,
            createdByEmail: creatorProfile.email,
            organizationId: tickets.organizationId,
            organizationName: organizations.name,
            orgNumber: organizations.orgNumber,
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
        .leftJoin(organizations, eq(tickets.organizationId, organizations.id));

    // Apply conditions if any
    if (conditions.length > 0) {
        query = query.where(and(...conditions)) as typeof query;
    }

    // Execute with ordering
    const allTickets = await query.orderBy(desc(tickets.updatedAt));

    // Fetch all unique SLA policy IDs from tickets
    const slaPolicyIds = [...new Set(allTickets.map(t => t.slaPolicyId).filter(Boolean))];
    
    // Fetch SLA policies
    const slaPoliciesMap = new Map();
    if (slaPolicyIds.length > 0) {
        const policies = await db
            .select()
            .from(slaPolicies)
            .where(inArray(slaPolicies.id, slaPolicyIds as string[]));
        
        policies.forEach(policy => {
            slaPoliciesMap.set(policy.id, policy);
        });
    }

    // Format tickets for the frontend with SLA status
    const formattedTickets = allTickets.map((ticket) => {
        const slaPolicy = ticket.slaPolicyId ? slaPoliciesMap.get(ticket.slaPolicyId) : null;
        
        // Calculate SLA status if policy and deadlines exist
        let slaStatus = null;
        if (slaPolicy && ticket.slaResponseDueAt && ticket.slaResolutionDueAt) {
            slaStatus = calculateSLAStatus(
                ticket.createdAt,
                ticket.slaResponseDueAt,
                ticket.slaResolutionDueAt,
                ticket.slaFirstResponseAt,
                ticket.slaResolvedAt,
                {
                    urgentResponseHours: slaPolicy.urgentResponseHours,
                    urgentResolutionHours: slaPolicy.urgentResolutionHours,
                    highResponseHours: slaPolicy.highResponseHours,
                    highResolutionHours: slaPolicy.highResolutionHours,
                    mediumResponseHours: slaPolicy.mediumResponseHours,
                    mediumResolutionHours: slaPolicy.mediumResolutionHours,
                    lowResponseHours: slaPolicy.lowResponseHours,
                    lowResolutionHours: slaPolicy.lowResolutionHours,
                    businessHoursOnly: slaPolicy.businessHoursOnly,
                    businessHoursStart: slaPolicy.businessHoursStart,
                    businessHoursEnd: slaPolicy.businessHoursEnd,
                    businessDays: slaPolicy.businessDays
                }
            );
        }

        return {
            ...ticket,
            organization: ticket.organizationName ?? 'Unknown',
            orgNumber: ticket.orgNumber ?? null,
            createdBy: ticket.createdByName ?? 'Unknown',
            createdByEmail: ticket.createdByEmail,
            assignedTo: ticket.assignedToName,
            slaStatus
        };
    });

    // Get staff members for assignment filter
    const staffMembers = await db
        .select({
            id: profiles.id,
            displayName: profiles.displayName,
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
        tickets: formattedTickets,
        staffMembers,
        filters: { search, status, priority, category, assignedTo }
    };
};

export const actions: Actions = {
    bulkUpdateStatus: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const ticketIds = formData.get('ticketIds') as string;
        const status = formData.get('status') as string;

        if (!ticketIds || !status) {
            return fail(400, { error: 'Ticket IDs and status are required' });
        }

        const ids = ticketIds.split(',').filter(Boolean);
        if (ids.length === 0) {
            return fail(400, { error: 'No tickets selected' });
        }

        const updateData: Record<string, unknown> = {
            status,
            updatedAt: new Date()
        };

        // Set timestamps based on status
        if (status === 'resolved') {
            updateData.resolvedAt = new Date();
        } else if (status === 'closed') {
            updateData.closedAt = new Date();
        }

        await db
            .update(tickets)
            .set(updateData)
            .where(inArray(tickets.id, ids));

        return { success: true, message: `Updated status for ${ids.length} ticket(s)` };
    },

    bulkUpdatePriority: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const ticketIds = formData.get('ticketIds') as string;
        const priority = formData.get('priority') as string;

        if (!ticketIds || !priority) {
            return fail(400, { error: 'Ticket IDs and priority are required' });
        }

        const ids = ticketIds.split(',').filter(Boolean);
        if (ids.length === 0) {
            return fail(400, { error: 'No tickets selected' });
        }

        await db
            .update(tickets)
            .set({
                priority: priority as any,
                updatedAt: new Date()
            })
            .where(inArray(tickets.id, ids));

        return { success: true, message: `Updated priority for ${ids.length} ticket(s)` };
    },

    bulkAssign: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const ticketIds = formData.get('ticketIds') as string;
        const assignedToId = formData.get('assignedToId') as string;

        if (!ticketIds) {
            return fail(400, { error: 'Ticket IDs are required' });
        }

        const ids = ticketIds.split(',').filter(Boolean);
        if (ids.length === 0) {
            return fail(400, { error: 'No tickets selected' });
        }

        await db
            .update(tickets)
            .set({
                assignedToId: assignedToId || null,
                updatedAt: new Date()
            })
            .where(inArray(tickets.id, ids));

        return { success: true, message: `Assigned ${ids.length} ticket(s)` };
    },

    bulkDelete: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        // Only super_admin and admin can delete tickets
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Only admins can delete tickets' });
        }

        const formData = await request.formData();
        const ticketIds = formData.get('ticketIds') as string;

        if (!ticketIds) {
            return fail(400, { error: 'Ticket IDs are required' });
        }

        const ids = ticketIds.split(',').filter(Boolean);
        if (ids.length === 0) {
            return fail(400, { error: 'No tickets selected' });
        }

        await db
            .delete(tickets)
            .where(inArray(tickets.id, ids));

        return { success: true, message: `Deleted ${ids.length} ticket(s)` };
    }
};
