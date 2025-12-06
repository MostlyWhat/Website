import { db } from '$lib/server/db';
import { invoices, organizations, projects, profiles, payments } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import { invoiceActivity, getClientIp } from '$lib/server/activity-logger';
import type { PageServerLoad, Actions } from './$types';

// Helper function to generate next invoice number
async function generateInvoiceNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;

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

// Helper function to calculate next due date based on interval
function calculateNextDueDate(currentDueDate: Date, interval: string): Date {
    const nextDate = new Date(currentDueDate);
    switch (interval) {
        case 'weekly':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case 'bi_weekly':
            nextDate.setDate(nextDate.getDate() + 14);
            break;
        case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case 'quarterly':
            nextDate.setMonth(nextDate.getMonth() + 3);
            break;
        case 'yearly':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        default:
            nextDate.setMonth(nextDate.getMonth() + 1);
    }
    return nextDate;
}

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || !locals.profile) {
        throw redirect(302, '/auth/login');
    }

    // Verify admin/staff role
    if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        throw error(403, 'Access denied');
    }

    // Fetch invoice with related data
    const [invoice] = await db
        .select({
            id: invoices.id,
            invoiceNumber: invoices.invoiceNumber,
            title: invoices.title,
            description: invoices.description,
            lineItems: invoices.lineItems,
            subtotal: invoices.subtotal,
            taxRate: invoices.taxRate,
            taxAmount: invoices.taxAmount,
            discount: invoices.discount,
            total: invoices.total,
            amountPaid: invoices.amountPaid,
            amountDue: invoices.amountDue,
            currency: invoices.currency,
            status: invoices.status,
            issueDate: invoices.issueDate,
            dueDate: invoices.dueDate,
            paidAt: invoices.paidAt,
            sentAt: invoices.sentAt,
            viewedAt: invoices.viewedAt,
            notes: invoices.notes,
            internalNotes: invoices.internalNotes,
            paymentMethod: invoices.paymentMethod,
            paymentReference: invoices.paymentReference,
            pdfUrl: invoices.pdfUrl,
            organizationId: invoices.organizationId,
            organizationName: organizations.name,
            projectId: invoices.projectId,
            projectName: projects.name,
            createdById: invoices.createdById,
            createdByName: profiles.displayName,
            createdAt: invoices.createdAt,
            updatedAt: invoices.updatedAt,
            // Recurring invoice fields
            invoiceType: invoices.invoiceType,
            isRecurring: invoices.isRecurring,
            recurringInterval: invoices.recurringInterval,
            recurringStartDate: invoices.recurringStartDate,
            recurringEndDate: invoices.recurringEndDate,
            recurringNextDate: invoices.recurringNextDate,
            recurringParentId: invoices.recurringParentId,
            recurringCount: invoices.recurringCount
        })
        .from(invoices)
        .leftJoin(organizations, eq(invoices.organizationId, organizations.id))
        .leftJoin(projects, eq(invoices.projectId, projects.id))
        .leftJoin(profiles, eq(invoices.createdById, profiles.id))
        .where(eq(invoices.id, params.id))
        .limit(1);

    if (!invoice) {
        throw error(404, 'Invoice not found');
    }

    // Fetch payments for this invoice
    const invoicePayments = await db
        .select({
            id: payments.id,
            amount: payments.amount,
            paymentMethod: payments.paymentMethod,
            paymentReference: payments.paymentReference,
            paidAt: payments.paidAt,
            notes: payments.notes,
            recordedByName: profiles.displayName
        })
        .from(payments)
        .leftJoin(profiles, eq(payments.recordedById, profiles.id))
        .where(eq(payments.invoiceId, params.id))
        .orderBy(desc(payments.paidAt));

    return {
        invoice: {
            ...invoice,
            organization: invoice.organizationName ?? 'Unknown',
            project: invoice.projectName,
            createdBy: invoice.createdByName ?? 'Unknown',
            subtotal: parseFloat(invoice.subtotal) || 0,
            taxRate: parseFloat(invoice.taxRate ?? '0') || 0,
            taxAmount: parseFloat(invoice.taxAmount ?? '0') || 0,
            discount: parseFloat(invoice.discount ?? '0') || 0,
            total: parseFloat(invoice.total) || 0,
            amountPaid: parseFloat(invoice.amountPaid) || 0,
            amountDue: parseFloat(invoice.amountDue) || 0
        },
        payments: invoicePayments.map((p) => ({
            ...p,
            amount: parseFloat(p.amount) || 0,
            recordedBy: p.recordedByName ?? 'Unknown'
        }))
    };
};

export const actions: Actions = {
    updateStatus: async ({ params, request, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const status = formData.get('status') as string;

        if (!['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled', 'refunded'].includes(status)) {
            return fail(400, { error: 'Invalid status' });
        }

        const [invoice] = await db
            .select({ invoiceNumber: invoices.invoiceNumber, status: invoices.status })
            .from(invoices)
            .where(eq(invoices.id, params.id));

        await db
            .update(invoices)
            .set({
                status: status as any,
                updatedAt: new Date(),
                ...(status === 'sent' && { sentAt: new Date() }),
                ...(status === 'paid' && { paidAt: new Date() })
            })
            .where(eq(invoices.id, params.id));

        await invoiceActivity.statusChanged(
            params.id,
            invoice?.invoiceNumber ?? 'Unknown',
            invoice?.status ?? 'draft',
            status,
            locals.profile.id,
            getClientIp(request)
        );

        return { success: true };
    },

    recordPayment: async ({ params, request, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const amount = parseFloat(formData.get('amount') as string);
        const method = formData.get('method') as string;
        const reference = formData.get('reference') as string;
        const notes = formData.get('notes') as string;

        if (!amount || amount <= 0) {
            return fail(400, { error: 'Invalid payment amount' });
        }

        // Get current invoice data including recurring fields
        const [invoice] = await db
            .select({
                invoiceNumber: invoices.invoiceNumber,
                amountPaid: invoices.amountPaid,
                amountDue: invoices.amountDue,
                total: invoices.total,
                organizationId: invoices.organizationId,
                projectId: invoices.projectId,
                title: invoices.title,
                description: invoices.description,
                lineItems: invoices.lineItems,
                subtotal: invoices.subtotal,
                taxRate: invoices.taxRate,
                taxAmount: invoices.taxAmount,
                discount: invoices.discount,
                currency: invoices.currency,
                dueDate: invoices.dueDate,
                notes: invoices.notes,
                createdById: invoices.createdById,
                // Recurring fields
                isRecurring: invoices.isRecurring,
                recurringInterval: invoices.recurringInterval,
                recurringStartDate: invoices.recurringStartDate,
                recurringEndDate: invoices.recurringEndDate,
                recurringNextDate: invoices.recurringNextDate,
                recurringParentId: invoices.recurringParentId,
                recurringCount: invoices.recurringCount
            })
            .from(invoices)
            .where(eq(invoices.id, params.id));

        if (!invoice) {
            return fail(404, { error: 'Invoice not found' });
        }

        const currentPaid = parseFloat(invoice.amountPaid) || 0;
        const total = parseFloat(invoice.total) || 0;
        const newPaid = currentPaid + amount;
        const newDue = Math.max(0, total - newPaid);
        const isFullyPaid = newDue === 0;

        // Record the payment
        await db.insert(payments).values({
            invoiceId: params.id,
            amount: amount.toString(),
            paymentMethod: method || 'other',
            paymentReference: reference || null,
            notes: notes || null,
            recordedById: locals.profile.id,
            paidAt: new Date()
        });

        // Update invoice
        await db
            .update(invoices)
            .set({
                amountPaid: newPaid.toString(),
                amountDue: newDue.toString(),
                status: isFullyPaid ? 'paid' : 'sent',
                paidAt: isFullyPaid ? new Date() : null,
                paymentMethod: method || null,
                paymentReference: reference || null,
                updatedAt: new Date()
            })
            .where(eq(invoices.id, params.id));

        await invoiceActivity.paymentReceived(
            params.id,
            invoice.invoiceNumber,
            amount,
            locals.profile.id,
            getClientIp(request)
        );

        if (isFullyPaid) {
            await invoiceActivity.statusChanged(
                params.id,
                invoice.invoiceNumber,
                'sent',
                'paid',
                locals.profile.id,
                getClientIp(request)
            );

            // Check if we need to generate next recurring invoice
            if (invoice.isRecurring && invoice.recurringInterval) {
                // Check if we've reached the end date
                const shouldGenerateNext = !invoice.recurringEndDate ||
                    new Date() < new Date(invoice.recurringEndDate);

                if (shouldGenerateNext) {
                    // Calculate the next due date
                    const nextDueDate = calculateNextDueDate(
                        invoice.dueDate,
                        invoice.recurringInterval
                    );

                    // Check if next due date is before end date
                    const isWithinEndDate = !invoice.recurringEndDate ||
                        nextDueDate <= new Date(invoice.recurringEndDate);

                    if (isWithinEndDate) {
                        try {
                            // Generate new invoice number
                            const newInvoiceNumber = await generateInvoiceNumber();
                            const parentId = invoice.recurringParentId || params.id;
                            const newCount = (invoice.recurringCount || 1) + 1;

                            // Calculate next recurring date
                            const nextRecurringDate = calculateNextDueDate(nextDueDate, invoice.recurringInterval);

                            // Create the next recurring invoice
                            const [newInvoice] = await db
                                .insert(invoices)
                                .values({
                                    invoiceNumber: newInvoiceNumber,
                                    organizationId: invoice.organizationId,
                                    projectId: invoice.projectId,
                                    title: invoice.title,
                                    description: invoice.description,
                                    lineItems: invoice.lineItems,
                                    subtotal: invoice.subtotal,
                                    taxRate: invoice.taxRate ?? '0',
                                    taxAmount: invoice.taxAmount ?? '0',
                                    discount: invoice.discount ?? '0',
                                    total: invoice.total,
                                    amountDue: invoice.total,
                                    currency: invoice.currency,
                                    dueDate: nextDueDate,
                                    notes: invoice.notes,
                                    createdById: invoice.createdById,
                                    status: 'draft',
                                    // Recurring fields
                                    invoiceType: 'recurring',
                                    isRecurring: true,
                                    recurringInterval: invoice.recurringInterval,
                                    recurringStartDate: invoice.recurringStartDate,
                                    recurringEndDate: invoice.recurringEndDate,
                                    recurringNextDate: nextRecurringDate,
                                    recurringParentId: parentId,
                                    recurringCount: newCount
                                })
                                .returning({ id: invoices.id });

                            // Log the creation of the new recurring invoice
                            await invoiceActivity.created(
                                newInvoice.id,
                                newInvoiceNumber,
                                locals.profile.id,
                                getClientIp(request)
                            );

                            return {
                                success: true,
                                message: `Payment recorded. New recurring invoice ${newInvoiceNumber} has been created.`,
                                newInvoiceId: newInvoice.id
                            };
                        } catch (err) {
                            console.error('Error creating recurring invoice:', err);
                            // Payment was still recorded, just failed to create next invoice
                            return {
                                success: true,
                                message: 'Payment recorded, but failed to create next recurring invoice. Please create it manually.',
                                warning: true
                            };
                        }
                    }
                }
            }
        }

        return { success: true, message: 'Payment recorded successfully' };
    },

    updateNotes: async ({ params, request, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const internalNotes = formData.get('internalNotes') as string;

        await db
            .update(invoices)
            .set({ internalNotes, updatedAt: new Date() })
            .where(eq(invoices.id, params.id));

        return { success: true };
    }
};
