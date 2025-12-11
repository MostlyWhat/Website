/**
 * Cron API Endpoint for Recurring Invoices
 * 
 * This endpoint is triggered by Cloudflare Workers cron trigger
 * to process recurring invoices and send payment reminders.
 * 
 * Schedule: Daily at midnight UTC (0 0 * * *)
 */

import { json, type RequestHandler } from '@sveltejs/kit';
import { handleRecurringInvoiceCron } from '$lib/server/invoices/recurring';
import { env } from '$env/dynamic/private';

/**
 * Verify the cron request is legitimate
 * Cloudflare Workers sends a specific header for cron triggers
 */
function verifyCronRequest(request: Request): boolean {
    // Check for Cloudflare cron header (set by our scheduled.ts)
    const cfCron = request.headers.get('cf-cron');
    if (cfCron === 'true') {
        return true;
    }

    // Alternative: Check for secret header (for manual triggers or testing)
    const authHeader = request.headers.get('authorization');
    const cronSecret = env.CRON_SECRET;
    if (authHeader && cronSecret) {
        const [type, token] = authHeader.split(' ');
        if (type === 'Bearer' && token === cronSecret) {
            return true;
        }
    }

    return false;
}

export const GET: RequestHandler = async ({ request }) => {
    // Verify the request is from a legitimate cron source
    if (!verifyCronRequest(request)) {
        return json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    try {
        console.log('[Cron API] Processing recurring invoices...');
        const startTime = Date.now();

        const result = await handleRecurringInvoiceCron();

        const duration = Date.now() - startTime;
        console.log(`[Cron API] Completed in ${duration}ms`);

        return json({
            success: true,
            duration: `${duration}ms`,
            results: {
                recurring: {
                    processed: result.recurring.processedInvoices,
                    created: result.recurring.createdInvoices.length,
                    invoices: result.recurring.createdInvoices,
                    errors: result.recurring.errors.length
                },
                reminders: {
                    processed: result.reminders.processedInvoices,
                    sent: result.reminders.sentReminders.length,
                    invoices: result.reminders.sentReminders,
                    errors: result.reminders.errors.length
                }
            }
        });
    } catch (error) {
        console.error('[Cron API] Error:', error);
        return json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
};

// POST method for manual triggers from admin panel
export const POST: RequestHandler = async ({ request, locals }) => {
    // Verify admin access for manual triggers
    if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
        return json(
            { error: 'Admin access required' },
            { status: 403 }
        );
    }

    try {
        console.log(`[Cron API] Manual trigger by ${locals.profile.email}`);
        const startTime = Date.now();

        const result = await handleRecurringInvoiceCron();

        const duration = Date.now() - startTime;

        return json({
            success: true,
            triggeredBy: locals.profile.email,
            duration: `${duration}ms`,
            results: {
                recurring: {
                    processed: result.recurring.processedInvoices,
                    created: result.recurring.createdInvoices.length,
                    invoices: result.recurring.createdInvoices,
                    errors: result.recurring.errors
                },
                reminders: {
                    processed: result.reminders.processedInvoices,
                    sent: result.reminders.sentReminders.length,
                    invoices: result.reminders.sentReminders,
                    errors: result.reminders.errors
                }
            }
        });
    } catch (error) {
        console.error('[Cron API] Manual trigger error:', error);
        return json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
};
