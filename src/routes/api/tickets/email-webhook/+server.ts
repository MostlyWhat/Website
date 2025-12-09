/**
 * Email-to-Ticket Webhook Handler
 * 
 * Receives incoming emails via webhook (e.g., from SendGrid Inbound Parse, Mailgun Routes)
 * and converts them to support tickets.
 * 
 * Webhook URL: POST /api/tickets/email-webhook
 * 
 * Expected payload format (SendGrid Inbound Parse):
 * - from: sender email
 * - to: support email address
 * - subject: email subject
 * - text: plain text body
 * - html: HTML body (optional)
 * - attachments: array of attachments (optional)
 * 
 * Authentication: Requires webhook secret in Authorization header
 */

import { json } from '@sveltejs/kit';
import { createDb } from '$lib/server/db';
import { tickets, profiles, organizations, ticketComments } from '$lib/server/db/schema';
import { eq, or } from 'drizzle-orm';
import type { RequestHandler } from './$types';

const WEBHOOK_SECRET = process.env.EMAIL_WEBHOOK_SECRET || 'change-me-in-production';
const SUPPORT_EMAIL_DOMAIN = process.env.SUPPORT_EMAIL_DOMAIN || 'support@mostlywhat.com';

export const POST: RequestHandler = async ({ request }) => {
	try {
		// Verify webhook secret
		const authHeader = request.headers.get('authorization');
		if (!authHeader || authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		// Parse incoming email data
		const formData = await request.formData();
		const from = formData.get('from') as string;
		const to = formData.get('to') as string;
		const subject = formData.get('subject') as string;
		const textBody = formData.get('text') as string;
		const htmlBody = formData.get('html') as string | null;

		if (!from || !subject || !textBody) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		const db = createDb();

		// Extract email address from "Name <email>" format
		const emailMatch = from.match(/<(.+?)>/);
		const senderEmail = emailMatch ? emailMatch[1] : from;

		// Find user by email
		const [user] = await db
			.select({
				id: profiles.id,
				email: profiles.email,
				organizationId: profiles.organizationId
			})
			.from(profiles)
			.where(eq(profiles.email, senderEmail))
			.limit(1);

		if (!user) {
			return json({
				error: 'User not found',
				message: `No user account found for ${senderEmail}. User must have an account to create tickets via email.`
			}, { status: 404 });
		}

		// Check if this is a reply to an existing ticket
		// Look for ticket number in subject line (e.g., "Re: [#12345]")
		const ticketNumberMatch = subject.match(/#(\d+)/);
		
		if (ticketNumberMatch) {
			// This is a reply to an existing ticket
			const ticketNumber = ticketNumberMatch[1];
			
			const [existingTicket] = await db
				.select({ id: tickets.id })
				.from(tickets)
				.where(eq(tickets.ticketNumber, ticketNumber))
				.limit(1);

			if (existingTicket) {
				// Add comment to existing ticket
				await db.insert(ticketComments).values({
					ticketId: existingTicket.id,
					userId: user.id,
					content: textBody.trim(),
					isInternal: false
				});

				return json({
					success: true,
					action: 'comment_added',
					ticketId: existingTicket.id,
					ticketNumber
				});
			}
		}

		// Create new ticket
		const [newTicket] = await db
			.insert(tickets)
			.values({
				subject: subject.trim(),
				description: textBody.trim(),
				createdById: user.id,
				organizationId: user.organizationId,
				status: 'open',
				priority: 'medium', // Default priority for email tickets
				source: 'email' // Track that this came from email
			})
			.returning({
				id: tickets.id,
				ticketNumber: tickets.ticketNumber
			});

		// TODO: Process attachments if present
		// const attachments = formData.getAll('attachments');
		// if (attachments.length > 0) {
		//     // Upload to storage and link to ticket
		// }

		return json({
			success: true,
			action: 'ticket_created',
			ticketId: newTicket.id,
			ticketNumber: newTicket.ticketNumber
		});

	} catch (error) {
		console.error('Email webhook error:', error);
		return json({
			error: 'Internal server error',
			message: error instanceof Error ? error.message : 'Unknown error'
		}, { status: 500 });
	}
};
