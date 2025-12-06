import { db } from '$lib/server/db';
import { invoices, organizations, projects, profiles } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        return { invoices: [] };
    }

    // Verify admin/staff role
    if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        return { invoices: [] };
    }

    // Fetch all invoices with related data
    const allInvoices = await db
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
            projectName: projects.name,
            createdById: invoices.createdById,
            createdByName: profiles.displayName,
            createdAt: invoices.createdAt,
            updatedAt: invoices.updatedAt,
            // Recurring fields
            isRecurring: invoices.isRecurring,
            recurringInterval: invoices.recurringInterval,
            recurringCount: invoices.recurringCount
        })
        .from(invoices)
        .leftJoin(organizations, eq(invoices.organizationId, organizations.id))
        .leftJoin(projects, eq(invoices.projectId, projects.id))
        .leftJoin(profiles, eq(invoices.createdById, profiles.id))
        .orderBy(desc(invoices.updatedAt));

    return {
        invoices: allInvoices.map((i) => ({
            ...i,
            organization: i.organizationName ?? 'Unknown',
            project: i.projectName,
            createdBy: i.createdByName ?? 'Unknown',
            total: parseFloat(i.total) || 0,
            amountDue: parseFloat(i.amountDue) || 0
        }))
    };
};
