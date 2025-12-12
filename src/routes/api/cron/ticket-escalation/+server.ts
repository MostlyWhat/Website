/**
 * Cron Job Endpoint - Ticket Escalation
 * 
 * This endpoint should be called by a scheduled task (e.g., Cloudflare Cron Trigger)
 * every 15 minutes to check for tickets that need escalation.
 * 
 * Authentication: Requires CRON_SECRET in Authorization header
 * 
 * Cloudflare Workers Cron Syntax:
 * Add to wrangler.jsonc:
 * 
 * "triggers": {
 *   "crons": ["0/15 * * * *"]
 * }
 * 
 * Or use an external service like:
 * - GitHub Actions scheduled workflow
 * - Uptime Robot monitors
 * - cron-job.org
 */

import { json } from '@sveltejs/kit';
import { handleEscalationCron } from '$lib/server/tickets/escalation';
import type { RequestHandler } from './$types';

const CRON_SECRET = process.env.CRON_SECRET || 'change-me-in-production';

export const GET: RequestHandler = async ({ request }) => {
	try {
		// Verify cron secret
		const authHeader = request.headers.get('authorization');
		if (!authHeader || authHeader !== `Bearer ${CRON_SECRET}`) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Run escalation job
		await handleEscalationCron();

		return json({
			success: true,
			message: 'Escalation job completed',
			timestamp: new Date().toISOString()
		});

	} catch (error) {
		console.error('Cron job error:', error);
		return json({
			error: 'Internal server error',
			message: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
};

// Also support POST for flexibility
export const POST = GET;
