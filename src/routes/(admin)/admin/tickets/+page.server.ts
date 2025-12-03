import { db } from '$lib/server/db';
import { tickets, profiles, organizations } from '$lib/server/db/schema';
import { eq, desc, sql, and } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        return { tickets: [] };
    }

    // Verify admin role
    if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        return { tickets: [] };
    }

    // Create alias for joined profiles
    const assignedProfile = alias(profiles, 'assigned_profile');
    const creatorProfile = alias(profiles, 'creator_profile');

    // Fetch all tickets with related data
    const allTickets = await db
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
            assignedToId: tickets.assignedToId,
            assignedToName: assignedProfile.displayName,
            createdById: tickets.createdById,
            createdByName: creatorProfile.displayName,
            organizationId: tickets.organizationId,
            organizationName: organizations.name,
            projectId: tickets.projectId
        })
        .from(tickets)
        .leftJoin(assignedProfile, eq(tickets.assignedToId, assignedProfile.id))
        .leftJoin(creatorProfile, eq(tickets.createdById, creatorProfile.id))
        .leftJoin(organizations, eq(tickets.organizationId, organizations.id))
        .orderBy(desc(tickets.updatedAt));

    // Format tickets for the frontend
    const formattedTickets = allTickets.map((ticket) => ({
        ...ticket,
        organization: ticket.organizationName ?? 'Unknown',
        createdBy: ticket.createdByName ?? 'Unknown',
        assignedTo: ticket.assignedToName
    }));

    return {
        tickets: formattedTickets
    };
};
