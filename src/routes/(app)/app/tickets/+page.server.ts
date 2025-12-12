import { createDb } from '$lib/server/db';
import { tickets, ticketComments, profiles, organizations, organizationMembers } from '$lib/server/db/schema';
import { eq, and, desc, sql, inArray } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { CachePresets, setCacheHeaders } from '$lib/server/utils/cache';

// Async function to load tickets data
async function loadTicketsData(profileId: string) {
    const db = createDb();

    // Get all organizations the user belongs to
    const userOrgs = await db
        .select({ organizationId: organizationMembers.organizationId })
        .from(organizationMembers)
        .where(eq(organizationMembers.profileId, profileId));

    const orgIds = userOrgs.map((o) => o.organizationId);

    if (orgIds.length === 0) {
        return [];
    }

    // Fetch tickets for user's organizations
    const userTickets = await db
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
            assignedToName: profiles.displayName,
            organizationId: tickets.organizationId,
            projectId: tickets.projectId
        })
        .from(tickets)
        .leftJoin(profiles, eq(tickets.assignedToId, profiles.id))
        .where(inArray(tickets.organizationId, orgIds))
        .orderBy(desc(tickets.updatedAt));

    // Get comment counts for each ticket
    const ticketIds = userTickets.map((t) => t.id);

    let commentCounts: Record<string, number> = {};

    if (ticketIds.length > 0) {
        const counts = await db
            .select({
                ticketId: ticketComments.ticketId,
                count: sql<number>`count(*)::int`
            })
            .from(ticketComments)
            .where(
                and(
                    inArray(ticketComments.ticketId, ticketIds),
                    eq(ticketComments.isInternal, false) // Only count public comments
                )
            )
            .groupBy(ticketComments.ticketId);

        commentCounts = Object.fromEntries(counts.map((c) => [c.ticketId, c.count]));
    }

    // Combine data
    return userTickets.map((ticket) => ({
        ...ticket,
        responseCount: commentCounts[ticket.id] || 0,
        assignedTo: ticket.assignedToName
    }));
}

export const load: PageServerLoad = async ({ locals, setHeaders }) => {
    // Private browser-only caching for personalized tickets (no CDN caching)
    setCacheHeaders(setHeaders, CachePresets.PRIVATE);

    if (!locals.user || !locals.profile) {
        return { streamed: { tickets: Promise.resolve([]) } };
    }

    // Return streamed data for progressive loading
    return {
        streamed: {
            tickets: loadTicketsData(locals.profile.id)
        }
    };
};
