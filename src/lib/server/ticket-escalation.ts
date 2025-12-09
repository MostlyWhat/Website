/**
 * Ticket Escalation System
 * 
 * Automatically escalates tickets based on:
 * - SLA breaches
 * - Priority levels
 * - Time in status
 * - Custom escalation rules
 * 
 * Run this as a scheduled job (e.g., every 15 minutes)
 */

import { createDb } from '$lib/server/db';
import { tickets, profiles, ticketEscalations, ticketComments, notifications } from '$lib/server/db/schema';
import { eq, and, lt, isNull, or, sql } from 'drizzle-orm';
import { calculateSLAStatus } from './sla-calculator';
import type { TicketPriority } from './db/schema';

interface EscalationRule {
	condition: 'sla_breach' | 'high_priority_waiting' | 'urgent_unassigned' | 'long_open';
	priority?: TicketPriority;
	status?: string;
	hoursThreshold?: number;
	escalateToRole?: 'admin' | 'super_admin';
	increasePriority?: boolean;
}

const ESCALATION_RULES: EscalationRule[] = [
	{
		condition: 'urgent_unassigned',
		priority: 'urgent',
		hoursThreshold: 1, // Escalate urgent tickets unassigned for >1 hour
		escalateToRole: 'admin',
		increasePriority: false
	},
	{
		condition: 'high_priority_waiting',
		priority: 'high',
		status: 'waiting',
		hoursThreshold: 24, // Escalate high priority waiting >24 hours
		escalateToRole: 'admin',
		increasePriority: true
	},
	{
		condition: 'sla_breach',
		hoursThreshold: 0, // Immediate escalation on SLA breach
		escalateToRole: 'super_admin',
		increasePriority: true
	},
	{
		condition: 'long_open',
		status: 'open',
		hoursThreshold: 72, // Escalate tickets open for >72 hours
		escalateToRole: 'admin',
		increasePriority: false
	}
];

export async function runTicketEscalations(): Promise<{
	processed: number;
	escalated: number;
	errors: string[];
}> {
	const db = createDb();
	const errors: string[] = [];
	let escalated = 0;

	try {
		// Get all active tickets that might need escalation
		const activeTickets = await db
			.select({
				id: tickets.id,
				ticketNumber: tickets.ticketNumber,
				subject: tickets.subject,
				priority: tickets.priority,
				status: tickets.status,
				createdAt: tickets.createdAt,
				updatedAt: tickets.updatedAt,
				assignedToId: tickets.assignedToId,
				createdById: tickets.createdById,
				organizationId: tickets.organizationId,
				slaPolicyId: tickets.slaPolicyId,
				slaResponseDeadline: tickets.slaResponseDeadline,
				slaResolutionDeadline: tickets.slaResolutionDeadline,
				firstResponseAt: tickets.firstResponseAt,
				resolvedAt: tickets.resolvedAt
			})
			.from(tickets)
			.where(
				and(
					or(
						eq(tickets.status, 'open'),
						eq(tickets.status, 'in_progress'),
						eq(tickets.status, 'waiting')
					),
					isNull(tickets.resolvedAt)
				)
			);

		const now = new Date();

		for (const ticket of activeTickets) {
			try {
				// Check each escalation rule
				for (const rule of ESCALATION_RULES) {
					const shouldEscalate = await checkEscalationRule(ticket, rule, now);

					if (shouldEscalate) {
						await escalateTicket(db, ticket, rule);
						escalated++;
						break; // Only escalate once per ticket per run
					}
				}
			} catch (err) {
				errors.push(`Error escalating ticket ${ticket.ticketNumber}: ${err}`);
			}
		}

		return {
			processed: activeTickets.length,
			escalated,
			errors
		};
	} catch (error) {
		errors.push(`Fatal error in escalation job: ${error}`);
		return { processed: 0, escalated: 0, errors };
	}
}

async function checkEscalationRule(
	ticket: any,
	rule: EscalationRule,
	now: Date
): Promise<boolean> {
	// Check priority match
	if (rule.priority && ticket.priority !== rule.priority) {
		return false;
	}

	// Check status match
	if (rule.status && ticket.status !== rule.status) {
		return false;
	}

	// Check time threshold
	if (rule.hoursThreshold !== undefined) {
		const hoursSinceUpdate = (now.getTime() - new Date(ticket.updatedAt).getTime()) / (1000 * 60 * 60);
		if (hoursSinceUpdate < rule.hoursThreshold) {
			return false;
		}
	}

	// Check specific conditions
	switch (rule.condition) {
		case 'urgent_unassigned':
			return ticket.priority === 'urgent' && !ticket.assignedToId;

		case 'sla_breach':
			if (!ticket.slaPolicyId) return false;
			const slaStatus = calculateSLAStatus(
				ticket.slaResponseDeadline,
				ticket.slaResolutionDeadline,
				ticket.firstResponseAt,
				ticket.resolvedAt
			);
			return slaStatus.responseBreached || slaStatus.resolutionBreached;

		case 'high_priority_waiting':
			return ticket.priority === 'high' && ticket.status === 'waiting';

		case 'long_open':
			return ticket.status === 'open';

		default:
			return false;
	}
}

async function escalateTicket(db: any, ticket: any, rule: EscalationRule): Promise<void> {
	// Check if already escalated recently (within 24 hours)
	const recentEscalations = await db
		.select()
		.from(ticketEscalations)
		.where(
			and(
				eq(ticketEscalations.ticketId, ticket.id),
				sql`${ticketEscalations.escalatedAt} > NOW() - INTERVAL '24 hours'`
			)
		)
		.limit(1);

	if (recentEscalations.length > 0) {
		return; // Don't escalate again within 24 hours
	}

	const updates: any = {
		updatedAt: new Date()
	};

	// Increase priority if rule specifies
	if (rule.increasePriority) {
		const priorityMap: Record<string, TicketPriority> = {
			low: 'medium',
			medium: 'high',
			high: 'urgent',
			urgent: 'urgent' // Already at max
		};
		updates.priority = priorityMap[ticket.priority] || ticket.priority;
	}

	// Update ticket
	await db
		.update(tickets)
		.set(updates)
		.where(eq(tickets.id, ticket.id));

	// Record escalation
	await db.insert(ticketEscalations).values({
		ticketId: ticket.id,
		reason: rule.condition,
		fromPriority: ticket.priority,
		toPriority: updates.priority || ticket.priority,
		escalatedAt: new Date()
	});

	// Add internal comment
	const escalationMessage = `[AUTOMATIC ESCALATION] Ticket escalated due to: ${rule.condition.replace(/_/g, ' ')}`;
	
	await db.insert(ticketComments).values({
		ticketId: ticket.id,
		userId: null, // System-generated
		content: escalationMessage,
		isInternal: true
	});

	// Notify admins/super admins
	if (rule.escalateToRole) {
		const admins = await db
			.select({ id: profiles.id })
			.from(profiles)
			.where(
				rule.escalateToRole === 'super_admin'
					? eq(profiles.role, 'super_admin')
					: or(eq(profiles.role, 'admin'), eq(profiles.role, 'super_admin'))
			);

		for (const admin of admins) {
			await db.insert(notifications).values({
				userId: admin.id,
				type: 'ticket_escalated',
				title: 'Ticket Escalated',
				message: `Ticket #${ticket.ticketNumber} - ${ticket.subject}`,
				actionUrl: `/admin/tickets/${ticket.id}`,
				metadata: {
					ticketId: ticket.id,
					reason: rule.condition
				}
			});
		}
	}
}

/**
 * Cron job handler
 * Call this from a scheduled job every 15 minutes
 */
export async function handleEscalationCron(): Promise<void> {
	const result = await runTicketEscalations();
	console.log(`[Escalation Job] Processed: ${result.processed}, Escalated: ${result.escalated}`);
	if (result.errors.length > 0) {
		console.error('[Escalation Job] Errors:', result.errors);
	}
}
