/**
 * Recurring Invoices Processor
 * 
 * Handles the automatic generation of recurring invoices and payment reminders.
 * Designed to be called by a cron job (Cloudflare Workers scheduled trigger).
 */

import { db } from '$lib/server/db';
import { invoices, organizations, profiles, organizationMembers } from '$lib/server/db/schema';
import { eq, and, lte, isNotNull, desc, sql } from 'drizzle-orm';
import { sendPaymentReminderEmail, sendInvoiceEmail } from '$lib/server/email';

// =============================================================================
// TYPES
// =============================================================================

export interface ProcessingResult {
    processedInvoices: number;
    createdInvoices: string[];
    sentReminders: string[];
    errors: Array<{ invoiceId: string; error: string }>;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Generate the next invoice number
 */
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

/**
 * Calculate the next due date based on interval
 */
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

/**
 * Get the primary contact email for an organization
 */
async function getOrganizationContact(organizationId: string): Promise<{ email: string; name: string } | null> {
    // Get the organization owner (role = 'owner') from organization members
    const [ownerMember] = await db
        .select({
            email: profiles.email,
            name: profiles.displayName,
        })
        .from(organizationMembers)
        .innerJoin(profiles, eq(organizationMembers.profileId, profiles.id))
        .where(
            and(
                eq(organizationMembers.organizationId, organizationId),
                eq(organizationMembers.role, 'owner')
            )
        )
        .limit(1);

    if (ownerMember?.email) {
        return { email: ownerMember.email, name: ownerMember.name || 'Customer' };
    }

    // Fallback: get organization's email directly
    const [org] = await db
        .select({
            email: organizations.email,
            name: organizations.name
        })
        .from(organizations)
        .where(eq(organizations.id, organizationId));

    if (org?.email) {
        return { email: org.email, name: org.name || 'Customer' };
    }

    return null;
}

// =============================================================================
// MAIN PROCESSOR
// =============================================================================

/**
 * Process recurring invoices that are due
 * - Generates new invoices for recurring series when the next date is reached
 * - Does NOT auto-generate on payment (that's handled in the payment action)
 * - This is for cases where invoices should be generated before payment
 */
export async function processRecurringInvoices(): Promise<ProcessingResult> {
    const result: ProcessingResult = {
        processedInvoices: 0,
        createdInvoices: [],
        sentReminders: [],
        errors: []
    };

    const now = new Date();

    try {
        // Find recurring invoices that need a new invoice generated
        // These are recurring invoices where recurringNextDate <= now and they're paid
        const recurringDue = await db
            .select({
                id: invoices.id,
                invoiceNumber: invoices.invoiceNumber,
                organizationId: invoices.organizationId,
                projectId: invoices.projectId,
                title: invoices.title,
                description: invoices.description,
                lineItems: invoices.lineItems,
                subtotal: invoices.subtotal,
                taxRate: invoices.taxRate,
                taxAmount: invoices.taxAmount,
                discount: invoices.discount,
                total: invoices.total,
                currency: invoices.currency,
                dueDate: invoices.dueDate,
                notes: invoices.notes,
                createdById: invoices.createdById,
                recurringInterval: invoices.recurringInterval,
                recurringStartDate: invoices.recurringStartDate,
                recurringEndDate: invoices.recurringEndDate,
                recurringNextDate: invoices.recurringNextDate,
                recurringParentId: invoices.recurringParentId,
                recurringCount: invoices.recurringCount,
                status: invoices.status
            })
            .from(invoices)
            .where(
                and(
                    eq(invoices.isRecurring, true),
                    eq(invoices.status, 'paid'),
                    isNotNull(invoices.recurringNextDate),
                    lte(invoices.recurringNextDate, now)
                )
            );

        for (const invoice of recurringDue) {
            result.processedInvoices++;

            // Check if we're past the end date
            if (invoice.recurringEndDate && now > new Date(invoice.recurringEndDate)) {
                continue; // Skip - past end date
            }

            try {
                // Generate new invoice
                const newInvoiceNumber = await generateInvoiceNumber();
                const nextDueDate = calculateNextDueDate(invoice.dueDate, invoice.recurringInterval!);

                // Check if next due date is within end date
                if (invoice.recurringEndDate && nextDueDate > new Date(invoice.recurringEndDate)) {
                    continue; // Skip - next invoice would be past end date
                }

                const parentId = invoice.recurringParentId || invoice.id;
                const newCount = (invoice.recurringCount || 1) + 1;
                const nextRecurringDate = calculateNextDueDate(nextDueDate, invoice.recurringInterval!);

                // Create the new recurring invoice
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
                        invoiceType: 'recurring',
                        isRecurring: true,
                        recurringInterval: invoice.recurringInterval,
                        recurringStartDate: invoice.recurringStartDate,
                        recurringEndDate: invoice.recurringEndDate,
                        recurringNextDate: nextRecurringDate,
                        recurringParentId: parentId,
                        recurringCount: newCount
                    })
                    .returning({ id: invoices.id, invoiceNumber: invoices.invoiceNumber });

                // Clear the recurringNextDate on the old invoice since it's been processed
                await db
                    .update(invoices)
                    .set({ recurringNextDate: null, updatedAt: new Date() })
                    .where(eq(invoices.id, invoice.id));

                result.createdInvoices.push(newInvoice.invoiceNumber);

                // Try to send notification email
                const contact = await getOrganizationContact(invoice.organizationId);
                if (contact) {
                    const [org] = await db
                        .select({ name: organizations.name })
                        .from(organizations)
                        .where(eq(organizations.id, invoice.organizationId));

                    try {
                        await sendInvoiceEmail({
                            recipientName: contact.name,
                            recipientEmail: contact.email,
                            invoiceNumber: newInvoice.invoiceNumber,
                            organizationName: org?.name || 'Your Organization',
                            total: parseFloat(invoice.total).toFixed(2),
                            currency: invoice.currency,
                            dueDate: nextDueDate,
                            invoiceUrl: `${process.env.PUBLIC_BASE_URL || 'https://mostlywhat.com'}/app/invoices/${newInvoice.id}`
                        });
                    } catch (emailErr) {
                        console.error('Failed to send invoice email:', emailErr);
                    }
                }
            } catch (err) {
                console.error(`Error processing recurring invoice ${invoice.id}:`, err);
                result.errors.push({
                    invoiceId: invoice.id,
                    error: err instanceof Error ? err.message : 'Unknown error'
                });
            }
        }
    } catch (err) {
        console.error('Error in processRecurringInvoices:', err);
        result.errors.push({
            invoiceId: 'system',
            error: err instanceof Error ? err.message : 'System error'
        });
    }

    return result;
}

/**
 * Send payment reminders for overdue invoices
 * Called by cron job to remind customers about unpaid invoices
 */
export async function sendPaymentReminders(): Promise<ProcessingResult> {
    const result: ProcessingResult = {
        processedInvoices: 0,
        createdInvoices: [],
        sentReminders: [],
        errors: []
    };

    const now = new Date();

    try {
        // Find invoices that are:
        // 1. Status is 'sent' or 'overdue'
        // 2. Due date has passed
        // 3. Has remaining amount due
        const overdueInvoices = await db
            .select({
                id: invoices.id,
                invoiceNumber: invoices.invoiceNumber,
                organizationId: invoices.organizationId,
                total: invoices.total,
                amountDue: invoices.amountDue,
                currency: invoices.currency,
                dueDate: invoices.dueDate,
                status: invoices.status
            })
            .from(invoices)
            .where(
                and(
                    sql`${invoices.status} IN ('sent', 'overdue')`,
                    lte(invoices.dueDate, now),
                    sql`CAST(${invoices.amountDue} AS DECIMAL) > 0`
                )
            );

        for (const invoice of overdueInvoices) {
            result.processedInvoices++;

            // Calculate days overdue
            const daysOverdue = Math.floor(
                (now.getTime() - new Date(invoice.dueDate).getTime()) / (1000 * 60 * 60 * 24)
            );

            // Only send reminders at certain intervals: 1, 7, 14, 30, 60 days
            const reminderDays = [1, 7, 14, 30, 60];
            if (!reminderDays.includes(daysOverdue)) {
                continue;
            }

            try {
                // Update status to overdue if not already
                if (invoice.status !== 'overdue') {
                    await db
                        .update(invoices)
                        .set({ status: 'overdue', updatedAt: new Date() })
                        .where(eq(invoices.id, invoice.id));
                }

                // Get contact info
                const contact = await getOrganizationContact(invoice.organizationId);
                if (!contact) {
                    continue;
                }

                const [org] = await db
                    .select({ name: organizations.name })
                    .from(organizations)
                    .where(eq(organizations.id, invoice.organizationId));

                // Send reminder email
                await sendPaymentReminderEmail({
                    recipientName: contact.name,
                    recipientEmail: contact.email,
                    invoiceNumber: invoice.invoiceNumber,
                    organizationName: org?.name || 'Your Organization',
                    total: parseFloat(invoice.amountDue).toFixed(2),
                    currency: invoice.currency,
                    dueDate: invoice.dueDate,
                    invoiceUrl: `${process.env.PUBLIC_BASE_URL || 'https://mostlywhat.com'}/app/invoices/${invoice.id}`,
                    daysOverdue
                });

                result.sentReminders.push(invoice.invoiceNumber);
            } catch (err) {
                console.error(`Error sending reminder for invoice ${invoice.id}:`, err);
                result.errors.push({
                    invoiceId: invoice.id,
                    error: err instanceof Error ? err.message : 'Unknown error'
                });
            }
        }
    } catch (err) {
        console.error('Error in sendPaymentReminders:', err);
        result.errors.push({
            invoiceId: 'system',
            error: err instanceof Error ? err.message : 'System error'
        });
    }

    return result;
}

/**
 * Main cron handler - processes all recurring invoice tasks
 */
export async function handleRecurringInvoiceCron(): Promise<{
    recurring: ProcessingResult;
    reminders: ProcessingResult;
}> {
    console.log('[Cron] Starting recurring invoice processing...');
    
    const recurringResult = await processRecurringInvoices();
    console.log(`[Cron] Processed ${recurringResult.processedInvoices} recurring invoices, created ${recurringResult.createdInvoices.length} new invoices`);

    const reminderResult = await sendPaymentReminders();
    console.log(`[Cron] Processed ${reminderResult.processedInvoices} invoices for reminders, sent ${reminderResult.sentReminders.length} reminders`);

    return {
        recurring: recurringResult,
        reminders: reminderResult
    };
}
