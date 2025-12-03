import { db } from '$lib/server/db';
import { invoices, organizations, projects, organizationMembers } from '$lib/server/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || !locals.profile) {
        error(401, 'Unauthorized');
    }

    // Get user's organization IDs
    const userOrgs = await db
        .select({ organizationId: organizationMembers.organizationId })
        .from(organizationMembers)
        .where(eq(organizationMembers.profileId, locals.profile.id));

    const orgIds = userOrgs.map((o) => o.organizationId);

    if (orgIds.length === 0) {
        error(403, 'Not authorized to view this invoice');
    }

    // Fetch the invoice
    const [invoice] = await db
        .select({
            id: invoices.id,
            invoiceNumber: invoices.invoiceNumber,
            title: invoices.title,
            description: invoices.description,
            status: invoices.status,
            total: invoices.total,
            subtotal: invoices.subtotal,
            taxRate: invoices.taxRate,
            taxAmount: invoices.taxAmount,
            discount: invoices.discount,
            amountPaid: invoices.amountPaid,
            amountDue: invoices.amountDue,
            currency: invoices.currency,
            issueDate: invoices.issueDate,
            dueDate: invoices.dueDate,
            paidAt: invoices.paidAt,
            lineItems: invoices.lineItems,
            notes: invoices.notes,
            organizationId: invoices.organizationId,
            organizationName: organizations.name,
            projectId: invoices.projectId,
            projectName: projects.name
        })
        .from(invoices)
        .leftJoin(organizations, eq(invoices.organizationId, organizations.id))
        .leftJoin(projects, eq(invoices.projectId, projects.id))
        .where(
            and(
                eq(invoices.id, params.id),
                inArray(invoices.organizationId, orgIds)
            )
        )
        .limit(1);

    if (!invoice) {
        error(404, 'Invoice not found');
    }

    return {
        invoice: {
            ...invoice,
            organization: invoice.organizationName ?? 'Unknown',
            project: invoice.projectName,
            total: parseFloat(invoice.total) || 0,
            subtotal: parseFloat(invoice.subtotal) || 0,
            taxRate: parseFloat(invoice.taxRate ?? '0') || 0,
            taxAmount: parseFloat(invoice.taxAmount ?? '0') || 0,
            discount: parseFloat(invoice.discount ?? '0') || 0,
            amountPaid: parseFloat(invoice.amountPaid) || 0,
            amountDue: parseFloat(invoice.amountDue) || 0
        }
    };
};
