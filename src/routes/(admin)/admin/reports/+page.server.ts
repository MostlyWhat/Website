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

    // === TICKET METRICS ===
    // Total tickets in period
    const ticketStats = await db
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

    // Tickets by priority
    const ticketsByPriority = await db
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
    const ticketsByCategory = await db
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

    // === PROJECT METRICS ===
    const projectStats = await db
        .select({
            total: count(),
            draft: sql<number>`count(*) filter (where ${projects.status} = 'draft')`,
            inProgress: sql<number>`count(*) filter (where ${projects.status} = 'in_progress')`,
            completed: sql<number>`count(*) filter (where ${projects.status} = 'completed')`,
            onHold: sql<number>`count(*) filter (where ${projects.status} = 'on_hold')`
        })
        .from(projects);

    // === INVOICE METRICS ===
    const invoiceStats = await db
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

    // === USER METRICS ===
    const userStats = await db
        .select({
            total: count(),
            admins: sql<number>`count(*) filter (where ${profiles.role} in ('admin', 'super_admin'))`,
            staff: sql<number>`count(*) filter (where ${profiles.role} = 'staff')`,
            customers: sql<number>`count(*) filter (where ${profiles.role} = 'customer')`
        })
        .from(profiles);

    // === ORGANIZATION METRICS ===
    const orgStats = await db
        .select({
            total: count()
        })
        .from(organizations);

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

    // === RECENT ACTIVITY SUMMARY ===
    // Get ticket creation by day for chart
    const ticketsByDay = await db
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
    const topOrgsByTickets = await db
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

    return {
        dateRange: { startDate, endDate },
        tickets: {
            stats: ticketStats[0] ?? { total: 0, open: 0, resolved: 0, closed: 0 },
            byPriority: ticketsByPriority,
            byCategory: ticketsByCategory,
            byDay: ticketsByDay
        },
        projects: {
            stats: projectStats[0] ?? { total: 0, draft: 0, inProgress: 0, completed: 0, onHold: 0 }
        },
        invoices: {
            stats: invoiceStats[0] ?? { total: 0, draft: 0, sent: 0, paid: 0, overdue: 0, totalAmount: 0, paidAmount: 0 }
        },
        users: {
            stats: userStats[0] ?? { total: 0, admins: 0, staff: 0, customers: 0 }
        },
        organizations: {
            total: orgStats[0]?.total ?? 0,
            newInPeriod: newOrgsInPeriod[0]?.count ?? 0
        },
        topOrgsByTickets
    };
};
