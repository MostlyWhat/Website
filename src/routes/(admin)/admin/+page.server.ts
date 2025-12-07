import { db } from '$lib/server/db';
import { profiles, organizations, projects, proposals, invoices, tickets } from '$lib/server/db/schema';
import { eq, sql, or, and, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

// Async function to load admin dashboard data
async function loadAdminDashboardData() {
    // Get counts in parallel
    const [
        usersCount,
        orgsCount,
        activeProjectsCount,
        openTicketsCount,
        pendingProposals,
        unpaidInvoices,
        awaitingTickets
    ] = await Promise.all([
        db.select({ count: sql<number>`count(*)::int` }).from(profiles),
        db.select({ count: sql<number>`count(*)::int` }).from(organizations),
        db.select({ count: sql<number>`count(*)::int` }).from(projects).where(eq(projects.status, 'in_progress')),
        db.select({ count: sql<number>`count(*)::int` }).from(tickets).where(
            or(
                eq(tickets.status, 'open'),
                eq(tickets.status, 'in_progress'),
                eq(tickets.status, 'awaiting_staff')
            )
        ),
        db.select({ count: sql<number>`count(*)::int` }).from(proposals).where(eq(proposals.status, 'draft')),
        db.select({ count: sql<number>`count(*)::int` }).from(invoices).where(
            or(
                eq(invoices.status, 'sent'),
                eq(invoices.status, 'overdue')
            )
        ),
        db.select({ count: sql<number>`count(*)::int` }).from(tickets).where(eq(tickets.status, 'awaiting_staff'))
    ]);

    // Get recent activity from various tables
    const [recentUsers, recentProjects, recentInvoices, recentTickets] = await Promise.all([
        db
            .select({
                id: profiles.id,
                title: profiles.email,
                subtitle: profiles.displayName,
                time: profiles.createdAt,
                type: sql<string>`'user'`
            })
            .from(profiles)
            .orderBy(desc(profiles.createdAt))
            .limit(2),
        db
            .select({
                id: projects.id,
                title: projects.name,
                subtitle: projects.status,
                time: projects.updatedAt,
                type: sql<string>`'project'`
            })
            .from(projects)
            .orderBy(desc(projects.updatedAt))
            .limit(2),
        db
            .select({
                id: invoices.id,
                title: invoices.invoiceNumber,
                subtitle: invoices.status,
                time: invoices.updatedAt,
                type: sql<string>`'invoice'`
            })
            .from(invoices)
            .orderBy(desc(invoices.updatedAt))
            .limit(2),
        db
            .select({
                id: tickets.id,
                title: tickets.subject,
                subtitle: tickets.priority,
                time: tickets.updatedAt,
                type: sql<string>`'ticket'`
            })
            .from(tickets)
            .orderBy(desc(tickets.updatedAt))
            .limit(2)
    ]);

    // Combine and sort recent activity
    const allActivity = [
        ...recentUsers.map((u) => ({
            title: 'New user registered',
            subtitle: u.title,
            time: u.time,
            icon: 'Users'
        })),
        ...recentProjects.map((p) => ({
            title: `Project "${p.title}"`,
            subtitle: `Status: ${p.subtitle}`,
            time: p.time,
            icon: 'FolderKanban'
        })),
        ...recentInvoices.map((i) => ({
            title: `Invoice ${i.title}`,
            subtitle: `Status: ${i.subtitle}`,
            time: i.time,
            icon: 'Receipt'
        })),
        ...recentTickets.map((t) => ({
            title: t.title,
            subtitle: `Priority: ${t.subtitle}`,
            time: t.time,
            icon: 'Ticket'
        }))
    ]
        .sort((a, b) => new Date(b.time!).getTime() - new Date(a.time!).getTime())
        .slice(0, 5);

    return {
        stats: {
            totalUsers: usersCount[0]?.count ?? 0,
            organizations: orgsCount[0]?.count ?? 0,
            activeProjects: activeProjectsCount[0]?.count ?? 0,
            openTickets: openTicketsCount[0]?.count ?? 0
        },
        pendingItems: [
            { type: 'proposal', label: 'Proposals pending approval', count: pendingProposals[0]?.count ?? 0, href: '/admin/proposals?status=draft' },
            { type: 'invoice', label: 'Invoices awaiting payment', count: unpaidInvoices[0]?.count ?? 0, href: '/admin/invoices?status=sent' },
            { type: 'ticket', label: 'Tickets awaiting response', count: awaitingTickets[0]?.count ?? 0, href: '/admin/tickets?status=awaiting_staff' }
        ],
        recentActivity: allActivity
    };
}

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        return {
            streamed: {
                dashboardData: Promise.resolve({
                    stats: { totalUsers: 0, organizations: 0, activeProjects: 0, openTickets: 0 },
                    pendingItems: [],
                    recentActivity: []
                })
            }
        };
    }

    // Return streamed data for progressive loading
    return {
        streamed: {
            dashboardData: loadAdminDashboardData()
        }
    };
};
