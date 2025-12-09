import { createDb } from '$lib/server/db';
import { tickets, ticketComments, profiles, organizations, ticketCategories } from '$lib/server/db/schema';
import { or, and, eq, ilike, sql, desc } from 'drizzle-orm';
import type { RequestEvent } from '@sveltejs/kit';

export const load = async ({ url, locals }: RequestEvent) => {
    const db = createDb();

    if (!locals.user || !locals.profile) {
        return { tickets: [], query: '', totalResults: 0 };
    }

    const searchQuery = url.searchParams.get('q') || '';
    const statusFilter = url.searchParams.get('status') || '';
    const priorityFilter = url.searchParams.get('priority') || '';
    const categoryFilter = url.searchParams.get('category') || '';

    if (!searchQuery.trim()) {
        return {
            tickets: [],
            query: searchQuery,
            totalResults: 0,
            categories: []
        };
    }

    // Build search conditions
    const searchConditions = [];

    // Search in ticket subject and description
    searchConditions.push(
        or(
            ilike(tickets.subject, `%${searchQuery}%`),
            ilike(tickets.description, `%${searchQuery}%`)
        )
    );

    // Add status filter
    if (statusFilter) {
        searchConditions.push(eq(tickets.status, statusFilter as any));
    }

    // Add priority filter
    if (priorityFilter) {
        searchConditions.push(eq(tickets.priority, priorityFilter as any));
    }

    // Add category filter
    if (categoryFilter) {
        searchConditions.push(eq(tickets.categoryId, categoryFilter));
    }

    // Fetch matching tickets
    const ticketResults = await db
        .select({
            id: tickets.id,
            ticketNumber: tickets.ticketNumber,
            subject: tickets.subject,
            description: tickets.description,
            status: tickets.status,
            priority: tickets.priority,
            createdAt: tickets.createdAt,
            updatedAt: tickets.updatedAt,
            categoryId: tickets.categoryId,
            categoryName: ticketCategories.name,
            createdBy: {
                id: profiles.id,
                name: sql<string>`COALESCE(${profiles.displayName}, ${profiles.firstName} || ' ' || ${profiles.lastName}, ${profiles.email})`,
                email: profiles.email
            },
            organizationId: tickets.organizationId,
            organizationName: organizations.name
        })
        .from(tickets)
        .leftJoin(profiles, eq(tickets.createdById, profiles.id))
        .leftJoin(organizations, eq(tickets.organizationId, organizations.id))
        .leftJoin(ticketCategories, eq(tickets.categoryId, ticketCategories.id))
        .where(and(...searchConditions))
        .orderBy(desc(tickets.createdAt))
        .limit(100);

    // Search in comments for tickets that have matching comments
    const commentSearchConditions = [
        ilike(ticketComments.content, `%${searchQuery}%`)
    ];

    const commentsResults = await db
        .select({
            ticketId: ticketComments.ticketId,
            content: ticketComments.content,
            createdAt: ticketComments.createdAt
        })
        .from(ticketComments)
        .where(and(...commentSearchConditions))
        .orderBy(desc(ticketComments.createdAt))
        .limit(50);

    // Get unique ticket IDs from comments
    const ticketIdsFromComments = [...new Set(commentsResults.map(c => c.ticketId))];

    // Fetch tickets that have matching comments (but weren't found in subject/description search)
    const ticketIdsFromDirect = ticketResults.map(t => t.id);
    const additionalTicketIds = ticketIdsFromComments.filter(
        id => !ticketIdsFromDirect.includes(id)
    );

    let additionalTickets: any[] = [];
    if (additionalTicketIds.length > 0) {
        additionalTickets = await db
            .select({
                id: tickets.id,
                ticketNumber: tickets.ticketNumber,
                subject: tickets.subject,
                description: tickets.description,
                status: tickets.status,
                priority: tickets.priority,
                createdAt: tickets.createdAt,
                updatedAt: tickets.updatedAt,
                categoryId: tickets.categoryId,
                categoryName: ticketCategories.name,
                createdBy: {
                    id: profiles.id,
                    name: sql<string>`COALESCE(${profiles.displayName}, ${profiles.firstName} || ' ' || ${profiles.lastName}, ${profiles.email})`,
                    email: profiles.email
                },
                organizationId: tickets.organizationId,
                organizationName: organizations.name,
                matchedInComments: sql<boolean>`true`
            })
            .from(tickets)
            .leftJoin(profiles, eq(tickets.createdById, profiles.id))
            .leftJoin(organizations, eq(tickets.organizationId, organizations.id))
            .leftJoin(ticketCategories, eq(tickets.categoryId, ticketCategories.id))
            .where(sql`${tickets.id} = ANY(${additionalTicketIds})`)
            .orderBy(desc(tickets.updatedAt));
    }

    // Combine results
    const allTickets = [...ticketResults, ...additionalTickets];

    // Get available categories for filter
    const categories = await db
        .select({
            id: ticketCategories.id,
            name: ticketCategories.name
        })
        .from(ticketCategories)
        .orderBy(ticketCategories.name);

    return {
        tickets: allTickets,
        query: searchQuery,
        totalResults: allTickets.length,
        categories,
        filters: {
            status: statusFilter,
            priority: priorityFilter,
            category: categoryFilter
        }
    };
};
