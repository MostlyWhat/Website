/**
 * Cloudflare Workers Cron Handler
 * 
 * This module exports a scheduled event handler for Cloudflare Workers.
 * It will be called when cron triggers fire (configured in wrangler.jsonc).
 * 
 * The handler makes an internal fetch to the /api/cron/invoices endpoint
 * with the appropriate headers to authenticate the cron request.
 */

interface ScheduledController {
    scheduledTime: number;
    cron: string;
}

interface CronEnv extends Env {
    PUBLIC_BASE_URL?: string;
}

export const scheduled = async (
    controller: ScheduledController,
    env: CronEnv,
    ctx: ExecutionContext
): Promise<void> => {
    const baseUrl = env.PUBLIC_BASE_URL || 'https://mostlywhat.com';
    const cronUrl = `${baseUrl}/api/cron/invoices`;

    console.log(`[Scheduled] Cron trigger at ${new Date().toISOString()}`);
    console.log(`[Scheduled] Cron: ${controller.cron}`);
    console.log(`[Scheduled] Calling ${cronUrl}`);

    ctx.waitUntil((async () => {
        try {
            const response = await fetch(cronUrl, {
                method: 'GET',
                headers: {
                    'cf-cron': 'true',
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            console.log('[Scheduled] Cron result:', JSON.stringify(result));

            if (!response.ok) {
                console.error(`[Scheduled] Cron failed with status ${response.status}`);
            }
        } catch (error) {
            console.error('[Scheduled] Cron error:', error);
        }
    })());
};
