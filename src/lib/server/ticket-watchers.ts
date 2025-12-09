/**
 * Ticket Watchers System
 * 
 * Allows staff members to watch tickets and receive notifications
 * when the ticket is updated.
 */

import { createDb } from '$lib/server/db';
import { ticketWatchers, tickets, profiles, notifications } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { logActivity } from './activity-logger';

/**
 * Add a watcher to a ticket
 */
export async function addTicketWatcher(
	ticketId: string,
	userId: string
): Promise<{ success: boolean; error?: string }> {
	const db = createDb();

	try {
		// Check if already watching
		const existing = await db
			.select()
			.from(ticketWatchers)
			.where(
				and(
					eq(ticketWatchers.ticketId, ticketId),
					eq(ticketWatchers.userId, userId)
				)
			)
			.limit(1);

		if (existing.length > 0) {
			return { success: false, error: 'Already watching this ticket' };
		}

		// Add watcher
		await db.insert(ticketWatchers).values({
			ticketId,
			userId
		});

		// Log activity
		await logActivity(
			'ticket',
			ticketId,
			'updated',
			'Watcher added',
			userId,
			null,
			{ watcherId: userId }
		);

		return { success: true };
	} catch (error) {
		console.error('Error adding ticket watcher:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Remove a watcher from a ticket
 */
export async function removeTicketWatcher(
	ticketId: string,
	userId: string
): Promise<{ success: boolean; error?: string }> {
	const db = createDb();

	try {
		await db
			.delete(ticketWatchers)
			.where(
				and(
					eq(ticketWatchers.ticketId, ticketId),
					eq(ticketWatchers.userId, userId)
				)
			);

		// Log activity
		await logActivity(
			'ticket',
			ticketId,
			'updated',
			'Watcher removed',
			userId,
			null,
			{ watcherId: userId }
		);

		return { success: true };
	} catch (error) {
		console.error('Error removing ticket watcher:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Get all watchers for a ticket
 */
export async function getTicketWatchers(ticketId: string) {
	const db = createDb();

	const watchers = await db
		.select({
			userId: ticketWatchers.userId,
			name: profiles.displayName,
			email: profiles.email,
			role: profiles.role,
			addedAt: ticketWatchers.addedAt
		})
		.from(ticketWatchers)
		.leftJoin(profiles, eq(ticketWatchers.userId, profiles.id))
		.where(eq(ticketWatchers.ticketId, ticketId));

	return watchers;
}

/**
 * Check if a user is watching a ticket
 */
export async function isWatchingTicket(
	ticketId: string,
	userId: string
): Promise<boolean> {
	const db = createDb();

	const [result] = await db
		.select()
		.from(ticketWatchers)
		.where(
			and(
				eq(ticketWatchers.ticketId, ticketId),
				eq(ticketWatchers.userId, userId)
			)
		)
		.limit(1);

	return !!result;
}

/**
 * Notify all watchers about ticket update
 */
export async function notifyWatchers(
	ticketId: string,
	updateType: 'comment' | 'status_change' | 'assignment' | 'priority_change',
	updatedById: string,
	details: {
		message: string;
		oldValue?: string;
		newValue?: string;
	}
): Promise<void> {
	const db = createDb();

	try {
		// Get ticket info
		const [ticket] = await db
			.select({
				ticketNumber: tickets.ticketNumber,
				subject: tickets.subject
			})
			.from(tickets)
			.where(eq(tickets.id, ticketId))
			.limit(1);

		if (!ticket) return;

		// Get watchers (exclude the person who made the update)
		const watchers = await db
			.select({ userId: ticketWatchers.userId })
			.from(ticketWatchers)
			.where(
				and(
					eq(ticketWatchers.ticketId, ticketId),
					// Don't notify the person who made the change
					// (using SQL to avoid issues with comparison)
				)
			);

		// Create notifications for each watcher
		const notificationTitle = getNotificationTitle(updateType);
		const notificationMessage = `Ticket #${ticket.ticketNumber}: ${details.message}`;

		for (const watcher of watchers) {
			// Skip if watcher is the updater
			if (watcher.userId === updatedById) continue;

			await db.insert(notifications).values({
				userId: watcher.userId,
				type: 'ticket_updated',
				title: notificationTitle,
				message: notificationMessage,
				actionUrl: `/admin/tickets/${ticketId}`,
				metadata: {
					ticketId,
					ticketNumber: ticket.ticketNumber,
					updateType,
					...details
				}
			});
		}
	} catch (error) {
		console.error('Error notifying watchers:', error);
	}
}

function getNotificationTitle(updateType: string): string {
	const titles: Record<string, string> = {
		comment: 'New Comment on Watched Ticket',
		status_change: 'Ticket Status Changed',
		assignment: 'Ticket Assignment Changed',
		priority_change: 'Ticket Priority Changed'
	};
	return titles[updateType] || 'Ticket Updated';
}

/**
 * Auto-watch tickets for assigned staff
 */
export async function autoWatchOnAssignment(
	ticketId: string,
	assignedToId: string
): Promise<void> {
	// Automatically add the assigned staff as a watcher
	await addTicketWatcher(ticketId, assignedToId);
}
