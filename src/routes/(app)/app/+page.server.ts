import { db } from '$lib/server/db';
import { projects, proposals, invoices, tickets, organizationMembers } from '$lib/server/db/schema';
import { eq, and, inArray, desc, sql, or, ne } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

// Async function to load dashboard data
async function loadDashboardData(profileId: string) {
    // Get user's organization IDs
    const userOrgs = await db
        .select({ organizationId: organizationMembers.organizationId })
        .from(organizationMembers)
        .where(eq(organizationMembers.profileId, profileId));

    const orgIds = userOrgs.map((o) => o.organizationId);

    if (orgIds.length === 0) {
        return {
            stats: {
                activeProjects: 0,
                pendingProposals: 0,
                unpaidInvoices: 0,
                openTickets: 0
            },
            recentActivity: []
        };
    }

    // Get counts in parallel
    const [activeProjectsResult, pendingProposalsResult, unpaidInvoicesResult, openTicketsResult] = await Promise.all([
        // Active projects
        db
            .select({ count: sql<number>`count(*)::int` })
            .from(projects)
            .where(
                and(
                    inArray(projects.organizationId, orgIds),
                    eq(projects.status, 'in_progress')
                )
            ),

        // Pending proposals (sent, waiting for customer response) - join through projects
        db
            .select({ count: sql<number>`count(*)::int` })
            .from(proposals)
            .innerJoin(projects, eq(proposals.projectId, projects.id))
            .where(
                and(
                    inArray(projects.organizationId, orgIds),
                    eq(proposals.status, 'sent')
                )
            ),

        // Unpaid invoices
        db
            .select({ count: sql<number>`count(*)::int` })
            .from(invoices)
            .where(
                and(
                    inArray(invoices.organizationId, orgIds),
                    or(
                        eq(invoices.status, 'sent'),
                        eq(invoices.status, 'overdue'),
                        eq(invoices.status, 'viewed')
                    )
                )
            ),

        // Open tickets
        db
            .select({ count: sql<number>`count(*)::int` })
            .from(tickets)
            .where(
                and(
                    inArray(tickets.organizationId, orgIds),
                    or(
                        eq(tickets.status, 'open'),
                        eq(tickets.status, 'in_progress'),
                        eq(tickets.status, 'awaiting_staff')
                    )
                )
            )
    ]);

    // Get recent activity (last 10 updates across all entities)
    const [recentProjects, recentProposals, recentInvoices, recentTickets] = await Promise.all([
        db
            .select({
                id: projects.id,
                title: projects.name,
                updatedAt: projects.updatedAt,
                type: sql<string>`'project'`
            })
            .from(projects)
            .where(inArray(projects.organizationId, orgIds))
            .orderBy(desc(projects.updatedAt))
            .limit(3),

        db
            .select({
                id: proposals.id,
                title: proposals.title,
                updatedAt: proposals.updatedAt,
                type: sql<string>`'proposal'`
            })
            .from(proposals)
            .innerJoin(projects, eq(proposals.projectId, projects.id))
            .where(inArray(projects.organizationId, orgIds))
            .orderBy(desc(proposals.updatedAt))
            .limit(3),

        db
            .select({
                id: invoices.id,
                title: invoices.invoiceNumber,
                updatedAt: invoices.updatedAt,
                type: sql<string>`'invoice'`,
                status: invoices.status
            })
            .from(invoices)
            .where(inArray(invoices.organizationId, orgIds))
            .orderBy(desc(invoices.updatedAt))
            .limit(3),

        db
            .select({
                id: tickets.id,
                title: tickets.subject,
                updatedAt: tickets.updatedAt,
                type: sql<string>`'ticket'`
            })
            .from(tickets)
            .where(inArray(tickets.organizationId, orgIds))
            .orderBy(desc(tickets.updatedAt))
            .limit(3)
    ]);

    // Combine and sort recent activity
    const allActivity = [
        ...recentProjects.map((p) => ({ ...p, type: 'project' as const, icon: 'FolderKanban' })),
        ...recentProposals.map((p) => ({ ...p, type: 'proposal' as const, icon: 'FileText' })),
        ...recentInvoices.map((i) => ({
            ...i,
            type: 'invoice' as const,
            icon: i.status === 'paid' ? 'CheckCircle' : 'Receipt',
            title: `Invoice ${i.title}${i.status === 'paid' ? ' paid' : ''}`
        })),
        ...recentTickets.map((t) => ({ ...t, type: 'ticket' as const, icon: 'Ticket' }))
    ]
        .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime())
        .slice(0, 5);

    return {
        stats: {
            activeProjects: activeProjectsResult[0]?.count ?? 0,
            pendingProposals: pendingProposalsResult[0]?.count ?? 0,
            unpaidInvoices: unpaidInvoicesResult[0]?.count ?? 0,
            openTickets: openTicketsResult[0]?.count ?? 0
        },
        recentActivity: allActivity.map((a) => ({
            type: a.type,
            title: a.title,
            time: a.updatedAt,
            icon: a.icon
        }))
    };
}

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        return {
            streamed: {
                dashboardData: Promise.resolve({
                    stats: {
                        activeProjects: 0,
                        pendingProposals: 0,
                        unpaidInvoices: 0,
                        openTickets: 0
                    },
                    recentActivity: []
                })
            }
        };
    }

    // Return streamed data for progressive loading
    return {
        streamed: {
            dashboardData: loadDashboardData(locals.profile.id)
        }
    };
};
