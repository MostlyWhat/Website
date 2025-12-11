/**
 * Advanced Search Service
 * 
 * Enhanced search capabilities with filters, saved searches, and complex queries
 */

import { createDb } from '$lib/server/db';
import { tickets, projects, invoices } from '$lib/server/db/schema';
import { and, or, eq, gte, lte, ilike, inArray, isNull, isNotNull, sql, desc } from 'drizzle-orm';

export interface SearchFilter {
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in' | 'null' | 'not_null';
    value?: any;
}

export interface SearchOptions {
    filters?: SearchFilter[];
    dateRange?: {
        field: string;
        start?: Date;
        end?: Date;
    };
    sort?: {
        field: string;
        direction: 'asc' | 'desc';
    };
    limit?: number;
    offset?: number;
}

/**
 * Build filter conditions from search options
 */
function buildFilterConditions(table: any, filters: SearchFilter[]) {
    const conditions = [];

    for (const filter of filters) {
        const field = table[filter.field];
        if (!field) continue;

        switch (filter.operator) {
            case 'eq':
                conditions.push(eq(field, filter.value));
                break;
            case 'ne':
                conditions.push(sql`${field} != ${filter.value}`);
                break;
            case 'gt':
                conditions.push(sql`${field} > ${filter.value}`);
                break;
            case 'gte':
                conditions.push(gte(field, filter.value));
                break;
            case 'lt':
                conditions.push(sql`${field} < ${filter.value}`);
                break;
            case 'lte':
                conditions.push(lte(field, filter.value));
                break;
            case 'like':
                conditions.push(ilike(field, `%${filter.value}%`));
                break;
            case 'in':
                if (Array.isArray(filter.value)) {
                    conditions.push(inArray(field, filter.value));
                }
                break;
            case 'null':
                conditions.push(isNull(field));
                break;
            case 'not_null':
                conditions.push(isNotNull(field));
                break;
        }
    }

    return conditions;
}

/**
 * Advanced ticket search
 */
export async function searchTickets(options: SearchOptions & {
    organizationId: string;
    textSearch?: string;
    statuses?: string[];
    priorities?: string[];
    assignedToIds?: string[];
    customerIds?: string[];
    projectIds?: string[];
    tags?: string[];
}) {
    const db = createDb();

    const conditions = [eq(tickets.organizationId, options.organizationId)];

    // Text search
    if (options.textSearch) {
        conditions.push(
            or(
                ilike(tickets.title, `%${options.textSearch}%`),
                ilike(tickets.description, `%${options.textSearch}%`)
            ) as any
        );
    }

    // Status filter
    if (options.statuses && options.statuses.length > 0) {
        conditions.push(inArray(tickets.status, options.statuses as any));
    }

    // Priority filter
    if (options.priorities && options.priorities.length > 0) {
        conditions.push(inArray(tickets.priority, options.priorities as any));
    }

    // Assigned to filter
    if (options.assignedToIds && options.assignedToIds.length > 0) {
        conditions.push(inArray(tickets.assignedToId, options.assignedToIds));
    }

    // Customer filter
    if (options.customerIds && options.customerIds.length > 0) {
        conditions.push(inArray(tickets.customerId, options.customerIds));
    }

    // Project filter
    if (options.projectIds && options.projectIds.length > 0) {
        conditions.push(inArray(tickets.projectId, options.projectIds));
    }

    // Date range filter
    if (options.dateRange) {
        const dateField = tickets[options.dateRange.field as keyof typeof tickets];
        if (dateField) {
            if (options.dateRange.start) {
                conditions.push(gte(dateField, options.dateRange.start));
            }
            if (options.dateRange.end) {
                conditions.push(lte(dateField, options.dateRange.end));
            }
        }
    }

    // Custom filters
    if (options.filters) {
        conditions.push(...buildFilterConditions(tickets, options.filters));
    }

    // Build query
    let query = db.select().from(tickets).where(and(...conditions));

    // Sort
    if (options.sort) {
        const sortField = tickets[options.sort.field as keyof typeof tickets];
        if (sortField) {
            query = query.orderBy(
                options.sort.direction === 'desc' ? desc(sortField) : sortField
            ) as any;
        }
    } else {
        query = query.orderBy(desc(tickets.createdAt)) as any;
    }

    // Pagination
    if (options.limit) {
        query = query.limit(options.limit) as any;
    }
    if (options.offset) {
        query = query.offset(options.offset) as any;
    }

    const results = await query;

    // Get total count
    const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(tickets)
        .where(and(...conditions));

    return {
        results,
        total: count,
        limit: options.limit || results.length,
        offset: options.offset || 0
    };
}

/**
 * Advanced project search
 */
export async function searchProjects(options: SearchOptions & {
    organizationId: string;
    textSearch?: string;
    statuses?: string[];
    phases?: string[];
    customerIds?: string[];
    budgetRange?: { min?: number; max?: number };
}) {
    const db = createDb();

    const conditions = [eq(projects.organizationId, options.organizationId)];

    // Text search
    if (options.textSearch) {
        conditions.push(
            or(
                ilike(projects.name, `%${options.textSearch}%`),
                ilike(projects.description, `%${options.textSearch}%`)
            ) as any
        );
    }

    // Status filter
    if (options.statuses && options.statuses.length > 0) {
        conditions.push(inArray(projects.status, options.statuses as any));
    }

    // Phase filter
    if (options.phases && options.phases.length > 0) {
        conditions.push(inArray(projects.phase, options.phases as any));
    }

    // Customer filter
    // TODO: Add customerId field to projects table
    if (options.customerIds && options.customerIds.length > 0) {
        // conditions.push(inArray(projects.customerId, options.customerIds));
    }    // Budget range
    if (options.budgetRange) {
        if (options.budgetRange.min !== undefined) {
            conditions.push(gte(projects.estimatedBudget, options.budgetRange.min.toString()));
        }
        if (options.budgetRange.max !== undefined) {
            conditions.push(lte(projects.estimatedBudget, options.budgetRange.max.toString()));
        }
    }

    // Date range filter
    if (options.dateRange) {
        const dateField = projects[options.dateRange.field as keyof typeof projects] as any;
        if (dateField) {
            if (options.dateRange.start) {
                conditions.push(gte(dateField, options.dateRange.start));
            }
            if (options.dateRange.end) {
                conditions.push(lte(dateField, options.dateRange.end));
            }
        }
    }    // Custom filters
    if (options.filters) {
        conditions.push(...buildFilterConditions(projects, options.filters));
    }

    // Build query
    let query = db.select().from(projects).where(and(...conditions));

    // Sort
    if (options.sort) {
        const sortField = projects[options.sort.field as keyof typeof projects] as any;
        if (sortField) {
            query = query.orderBy(
                options.sort.direction === 'desc' ? desc(sortField) : sortField
            ) as any;
        }
    } else {
        query = query.orderBy(desc(projects.createdAt)) as any;
    }

    // Pagination
    if (options.limit) {
        query = query.limit(options.limit) as any;
    }
    if (options.offset) {
        query = query.offset(options.offset) as any;
    }

    const results = await query;

    // Get total count
    const [{ count }] = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(projects)
        .where(and(...conditions));

    return {
        results,
        total: count,
        limit: options.limit || results.length,
        offset: options.offset || 0
    };
}

/**
 * Search across multiple entities (tickets, projects, customers)
 */
export async function globalSearch(query: string, organizationId: string, limit = 20) {
    const db = createDb();

    // Search tickets
    const ticketResults = await db
        .select()
        .from(tickets)
        .where(
            and(
                eq(tickets.organizationId, organizationId),
                or(
                    ilike(tickets.title, `%${query}%`),
                    ilike(tickets.description, `%${query}%`)
                ) as any
            )
        )
        .limit(limit);

    // Search projects
    const projectResults = await db
        .select()
        .from(projects)
        .where(
            and(
                eq(projects.organizationId, organizationId),
                or(
                    ilike(projects.name, `%${query}%`),
                    ilike(projects.description, `%${query}%`)
                ) as any
            )
        )
        .limit(limit);

    // TODO: Add customer search when customers table exists
    const customerResults: any[] = [];

    return {
        tickets: ticketResults.map((t) => ({ ...t, type: 'ticket' })),
        projects: projectResults.map((p) => ({ ...p, type: 'project' })),
        customers: customerResults.map((c) => ({ ...c, type: 'customer' })),
        total: ticketResults.length + projectResults.length + customerResults.length
    };
}

/**
 * Save a search filter preset
 */
export interface SavedSearch {
    id: string;
    name: string;
    description?: string;
    entityType: 'ticket' | 'project' | 'customer' | 'invoice';
    filters: SearchOptions;
    userId: string;
    isPublic: boolean;
    createdAt: Date;
}

// Note: This would require a saved_searches table in the schema
// For now, this is just the interface definition

/**
 * Get search suggestions based on partial query
 */
export async function getSearchSuggestions(
    partialQuery: string,
    organizationId: string,
    entityType: 'ticket' | 'project' | 'customer'
) {
    const db = createDb();

    if (entityType === 'ticket') {
        const suggestions = await db
            .select({ id: tickets.id, title: tickets.title, ticketNumber: tickets.ticketNumber })
            .from(tickets)
            .where(
                and(
                    eq(tickets.organizationId, organizationId),
                    or(
                        ilike(tickets.title, `%${partialQuery}%`),
                        ilike(tickets.ticketNumber, `%${partialQuery}%`)
                    ) as any
                )
            )
            .limit(10);

        return suggestions;
    } else if (entityType === 'project') {
        const suggestions = await db
            .select({ id: projects.id, name: projects.name })
            .from(projects)
            .where(
                and(
                    eq(projects.organizationId, organizationId),
                    ilike(projects.name, `%${partialQuery}%`)
                )
            )
            .limit(10);

        return suggestions;
    } else {
        // TODO: Implement customer autocomplete when customers table exists
        return [];
    }
}
