import { db } from '$lib/server/db';
import { invoices, organizations, projects } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import { invoiceActivity, getClientIp } from '$lib/server/activity-logger';
import type { PageServerLoad, Actions } from './$types';

// Generate invoice number
async function generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;
    
    // Get the last invoice number for this year
    const [lastInvoice] = await db
        .select({ invoiceNumber: invoices.invoiceNumber })
        .from(invoices)
        .where(sql`${invoices.invoiceNumber} LIKE ${prefix + '%'}`)
        .orderBy(desc(invoices.invoiceNumber))
        .limit(1);

    let nextNum = 1;
    if (lastInvoice) {
        const match = lastInvoice.invoiceNumber.match(/INV-\d{4}-(\d+)/);
        if (match) {
            nextNum = parseInt(match[1], 10) + 1;
        }
    }

    return `${prefix}${nextNum.toString().padStart(5, '0')}`;
}

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user || !locals.profile) {
        throw redirect(302, '/auth/login');
    }

    // Verify admin role
    if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
        throw redirect(302, '/admin');
    }

    // Get organizations for dropdown
    const orgs = await db
        .select({
            id: organizations.id,
            name: organizations.name
        })
        .from(organizations)
        .orderBy(organizations.name);

    // Get projects for dropdown (all projects)
    const projectList = await db
        .select({
            id: projects.id,
            name: projects.name,
            organizationId: projects.organizationId
        })
        .from(projects)
        .orderBy(projects.name);

    // Pre-select organization if provided
    const preselectedOrgId = url.searchParams.get('organizationId');
    const preselectedProjectId = url.searchParams.get('projectId');

    return {
        organizations: orgs,
        projects: projectList,
        preselectedOrgId,
        preselectedProjectId
    };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const organizationId = formData.get('organizationId') as string;
        const projectId = formData.get('projectId') as string;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const dueDate = formData.get('dueDate') as string;
        const notes = formData.get('notes') as string;

        // Parse line items
        const lineItemsJson = formData.get('lineItems') as string;
        let lineItems: Array<{ description: string; quantity: number; unitPrice: number; total: number }> = [];
        
        try {
            lineItems = JSON.parse(lineItemsJson || '[]');
        } catch {
            return fail(400, { error: 'Invalid line items format' });
        }

        // Calculate totals
        const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0);
        const taxRate = parseFloat(formData.get('taxRate') as string) || 0;
        const taxAmount = subtotal * (taxRate / 100);
        const discount = parseFloat(formData.get('discount') as string) || 0;
        const total = subtotal + taxAmount - discount;

        if (!organizationId) {
            return fail(400, { error: 'Organization is required' });
        }

        if (!dueDate) {
            return fail(400, { error: 'Due date is required' });
        }

        try {
            const invoiceNumber = await generateInvoiceNumber();

            const [newInvoice] = await db
                .insert(invoices)
                .values({
                    invoiceNumber,
                    organizationId,
                    projectId: projectId || null,
                    title: title?.trim() || null,
                    description: description?.trim() || null,
                    lineItems: lineItems.length > 0 ? lineItems : null,
                    subtotal: subtotal.toString(),
                    taxRate: taxRate.toString(),
                    taxAmount: taxAmount.toString(),
                    discount: discount.toString(),
                    total: total.toString(),
                    amountDue: total.toString(),
                    dueDate: new Date(dueDate),
                    notes: notes?.trim() || null,
                    createdById: locals.profile.id
                })
                .returning({ id: invoices.id });

            await invoiceActivity.created(
                newInvoice.id,
                invoiceNumber,
                locals.profile.id,
                getClientIp(request)
            );

            throw redirect(302, `/admin/invoices/${newInvoice.id}`);
        } catch (err) {
            if ((err as any)?.status === 302) throw err;
            console.error('Error creating invoice:', err);
            return fail(500, { error: 'Failed to create invoice' });
        }
    }
};
