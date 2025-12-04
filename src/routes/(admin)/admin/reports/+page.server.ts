import { db } from '$lib/server/db';
import {
    tickets, projects, invoices, organizations, profiles,
    organizationMembers
} from '$lib/server/db/schema';
import { sql, eq, and, gte, lte, count } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user || !locals.profile) {
        throw redirect(302, '/auth/login');
    }

    // Require admin/super_admin role
    if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
        throw redirect(302, '/admin');
    }

    // Get date range from query params (default: last 30 days)
    const endDate = url.searchParams.get('endDate') ?? new Date().toISOString().split('T')[0];
    const startDate = url.searchParams.get('startDate') ??
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);
    endDateTime.setHours(23, 59, 59, 999);

    // Initialize default values
    let ticketStats = { total: 0, open: 0, resolved: 0, closed: 0 };
    let ticketsByPriority: { priority: string; count: number }[] = [];
    let ticketsByCategory: { category: string | null; count: number }[] = [];
    let ticketsByDay: { date: string; count: number }[] = [];
    let topOrgsByTickets: { organizationId: string; organizationName: string | null; count: number }[] = [];

    // === TICKET METRICS ===
    try {
        const ticketStatsResult = await db
            .select({
                total: count(),
                open: sql<number>`count(*) filter (where ${tickets.status} in ('open', 'pending'))`,
                resolved: sql<number>`count(*) filter (where ${tickets.status} = 'resolved')`,
                closed: sql<number>`count(*) filter (where ${tickets.status} = 'closed')`
            })
            .from(tickets)
            .where(
                and(
                    gte(tickets.createdAt, startDateTime),
                    lte(tickets.createdAt, endDateTime)
                )
            );
        ticketStats = ticketStatsResult[0] ?? ticketStats;

        // Tickets by priority
        ticketsByPriority = await db
            .select({
                priority: tickets.priority,
                count: count()
            })
            .from(tickets)
            .where(
                and(
                    gte(tickets.createdAt, startDateTime),
                    lte(tickets.createdAt, endDateTime)
                )
            )
            .groupBy(tickets.priority);

        // Tickets by category
        ticketsByCategory = await db
            .select({
                category: tickets.category,
                count: count()
            })
            .from(tickets)
            .where(
                and(
                    gte(tickets.createdAt, startDateTime),
                    lte(tickets.createdAt, endDateTime),
                    sql`${tickets.category} is not null`
                )
            )
            .groupBy(tickets.category);

        // Get ticket creation by day for chart
        ticketsByDay = await db
            .select({
                date: sql<string>`date_trunc('day', ${tickets.createdAt})::date`,
                count: count()
            })
            .from(tickets)
            .where(
                and(
                    gte(tickets.createdAt, startDateTime),
                    lte(tickets.createdAt, endDateTime)
                )
            )
            .groupBy(sql`date_trunc('day', ${tickets.createdAt})::date`)
            .orderBy(sql`date_trunc('day', ${tickets.createdAt})::date`);

        // Top organizations by ticket count
        topOrgsByTickets = await db
            .select({
                organizationId: tickets.organizationId,
                organizationName: organizations.name,
                count: count()
            })
            .from(tickets)
            .innerJoin(organizations, eq(tickets.organizationId, organizations.id))
            .where(
                and(
                    gte(tickets.createdAt, startDateTime),
                    lte(tickets.createdAt, endDateTime)
                )
            )
            .groupBy(tickets.organizationId, organizations.name)
            .orderBy(sql`count(*) desc`)
            .limit(5);
    } catch (error) {
        console.warn('Error fetching ticket metrics:', error);
        // Use default values
    }

    // === PROJECT METRICS ===
    let projectStats = { total: 0, draft: 0, inProgress: 0, completed: 0, onHold: 0 };
    try {
        const projectStatsResult = await db
            .select({
                total: count(),
                draft: sql<number>`count(*) filter (where ${projects.status} = 'draft')`,
                inProgress: sql<number>`count(*) filter (where ${projects.status} = 'in_progress')`,
                completed: sql<number>`count(*) filter (where ${projects.status} = 'completed')`,
                onHold: sql<number>`count(*) filter (where ${projects.status} = 'on_hold')`
            })
            .from(projects);
        projectStats = projectStatsResult[0] ?? projectStats;
    } catch (error) {
        console.warn('Error fetching project metrics:', error);
    }

    // === INVOICE METRICS ===
    let invoiceStats = { total: 0, draft: 0, sent: 0, paid: 0, overdue: 0, totalAmount: 0, paidAmount: 0 };
    try {
        const invoiceStatsResult = await db
            .select({
                total: count(),
                draft: sql<number>`count(*) filter (where ${invoices.status} = 'draft')`,
                sent: sql<number>`count(*) filter (where ${invoices.status} = 'sent')`,
                paid: sql<number>`count(*) filter (where ${invoices.status} = 'paid')`,
                overdue: sql<number>`count(*) filter (where ${invoices.status} = 'overdue')`,
                totalAmount: sql<number>`coalesce(sum(${invoices.total}::numeric), 0)`,
                paidAmount: sql<number>`coalesce(sum(case when ${invoices.status} = 'paid' then ${invoices.total}::numeric else 0 end), 0)`
            })
            .from(invoices)
            .where(
                and(
                    gte(invoices.createdAt, startDateTime),
                    lte(invoices.createdAt, endDateTime)
                )
            );
        invoiceStats = invoiceStatsResult[0] ?? invoiceStats;
    } catch (error) {
        console.warn('Error fetching invoice metrics:', error);
    }

    // === USER METRICS ===
    let userStats = { total: 0, admins: 0, staff: 0, customers: 0 };
    try {
        const userStatsResult = await db
            .select({
                total: count(),
                admins: sql<number>`count(*) filter (where ${profiles.role} in ('admin', 'super_admin'))`,
                staff: sql<number>`count(*) filter (where ${profiles.role} = 'staff')`,
                customers: sql<number>`count(*) filter (where ${profiles.role} = 'customer')`
            })
            .from(profiles);
        userStats = userStatsResult[0] ?? userStats;
    } catch (error) {
        console.warn('Error fetching user metrics:', error);
    }

    // === ORGANIZATION METRICS ===
    let orgTotal = 0;
    let newOrgsCount = 0;
    try {
        const orgStats = await db
            .select({
                total: count()
            })
            .from(organizations);
        orgTotal = orgStats[0]?.total ?? 0;

        // New organizations in period
        const newOrgsInPeriod = await db
            .select({
                count: count()
            })
            .from(organizations)
            .where(
                and(
                    gte(organizations.createdAt, startDateTime),
                    lte(organizations.createdAt, endDateTime)
                )
            );
        newOrgsCount = newOrgsInPeriod[0]?.count ?? 0;
    } catch (error) {
        console.warn('Error fetching organization metrics:', error);
    }

    return {
        dateRange: { startDate, endDate },
        tickets: {
            stats: ticketStats,
            byPriority: ticketsByPriority,
            byCategory: ticketsByCategory,
            byDay: ticketsByDay
        },
        projects: {
            stats: projectStats
        },
        invoices: {
            stats: invoiceStats
        },
        users: {
            stats: userStats
        },
        organizations: {
            total: orgTotal,
            newInPeriod: newOrgsCount
        },
        topOrgsByTickets
    };
};
