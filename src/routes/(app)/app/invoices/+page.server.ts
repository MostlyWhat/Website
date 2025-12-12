import { createDb } from '$lib/server/db';
import { invoices, organizationMembers, organizations, projects } from '$lib/server/db/schema';
import { eq, inArray, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        return { invoices: [] };
    }

    // Create per-request database connection
    const db = createDb();

    // Get user's organization IDs
    const userOrgs = await db
        .select({ organizationId: organizationMembers.organizationId })
        .from(organizationMembers)
        .where(eq(organizationMembers.profileId, locals.profile.id));

    const orgIds = userOrgs.map((o) => o.organizationId);

    if (orgIds.length === 0) {
        return { invoices: [] };
    }

    // Fetch invoices for user's organizations
    const userInvoices = await db
        .select({
            id: invoices.id,
            invoiceNumber: invoices.invoiceNumber,
            title: invoices.title,
            status: invoices.status,
            total: invoices.total,
            amountDue: invoices.amountDue,
            issueDate: invoices.issueDate,
            dueDate: invoices.dueDate,
            paidAt: invoices.paidAt,
            organizationId: invoices.organizationId,
            organizationName: organizations.name,
            projectId: invoices.projectId,
            projectName: projects.name
        })
        .from(invoices)
        .leftJoin(organizations, eq(invoices.organizationId, organizations.id))
        .leftJoin(projects, eq(invoices.projectId, projects.id))
        .where(inArray(invoices.organizationId, orgIds))
        .orderBy(desc(invoices.createdAt));

    return {
        invoices: userInvoices.map(i => ({
            ...i,
            total: parseFloat(i.total) || 0,
            amountDue: parseFloat(i.amountDue) || 0
        }))
    };
};
