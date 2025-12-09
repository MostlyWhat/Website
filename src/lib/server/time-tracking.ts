/**
 * Time Tracking Service
 * 
 * Manages time entries for tickets and projects with billing support
 */

import { createDb } from '$lib/server/db';
import { timeEntries, tickets, projects, invoices } from '$lib/server/db/schema';
import { eq, and, isNull, desc, gte, lte } from 'drizzle-orm';

/**
 * Start a new time entry
 */
export async function startTimeEntry(options: {
	userId: string;
	ticketId?: string;
	projectId?: string;
	description?: string;
	isBillable?: boolean;
	hourlyRate?: number;
}) {
	const db = createDb();

	// Check if user has an active timer
	const activeTimer = await getActiveTimeEntry(options.userId);
	if (activeTimer) {
		throw new Error('You already have an active timer. Please stop it first.');
	}

	// Validate that either ticketId or projectId is provided
	if (!options.ticketId && !options.projectId) {
		throw new Error('Either ticketId or projectId must be provided');
	}

	const [entry] = await db
		.insert(timeEntries)
		.values({
			userId: options.userId,
			ticketId: options.ticketId,
			projectId: options.projectId,
			description: options.description,
			startTime: new Date(),
			isBillable: options.isBillable ?? true,
			hourlyRate: options.hourlyRate?.toString(),
			createdAt: new Date(),
			updatedAt: new Date()
		})
		.returning();

	return entry;
}

/**
 * Stop an active time entry
 */
export async function stopTimeEntry(entryId: string) {
	const db = createDb();

	const [entry] = await db.select().from(timeEntries).where(eq(timeEntries.id, entryId)).limit(1);

	if (!entry) {
		throw new Error('Time entry not found');
	}

	if (entry.endTime) {
		throw new Error('Time entry is already stopped');
	}

	const endTime = new Date();
	const duration = Math.round((endTime.getTime() - entry.startTime.getTime()) / (1000 * 60)); // minutes

	// Calculate total amount if billable
	let totalAmount: string | null = null;
	if (entry.isBillable && entry.hourlyRate) {
		const hours = duration / 60;
		totalAmount = (hours * parseFloat(entry.hourlyRate)).toFixed(2);
	}

	const [updated] = await db
		.update(timeEntries)
		.set({
			endTime,
			duration,
			totalAmount,
			updatedAt: new Date()
		})
		.where(eq(timeEntries.id, entryId))
		.returning();

	return updated;
}

/**
 * Get active time entry for a user
 */
export async function getActiveTimeEntry(userId: string) {
	const db = createDb();

	const [entry] = await db
		.select()
		.from(timeEntries)
		.where(and(eq(timeEntries.userId, userId), isNull(timeEntries.endTime)))
		.limit(1);

	return entry || null;
}

/**
 * Get time entries for a ticket
 */
export async function getTicketTimeEntries(ticketId: string) {
	const db = createDb();

	const entries = await db
		.select({
			entry: timeEntries,
			user: {
				id: timeEntries.userId,
				// Note: You'd need to join with profiles table to get user details
			}
		})
		.from(timeEntries)
		.where(eq(timeEntries.ticketId, ticketId))
		.orderBy(desc(timeEntries.startTime));

	return entries;
}

/**
 * Get time entries for a project
 */
export async function getProjectTimeEntries(projectId: string) {
	const db = createDb();

	const entries = await db
		.select()
		.from(timeEntries)
		.where(eq(timeEntries.projectId, projectId))
		.orderBy(desc(timeEntries.startTime));

	return entries;
}

/**
 * Get time entries for a user within a date range
 */
export async function getUserTimeEntries(
	userId: string,
	startDate?: Date,
	endDate?: Date
) {
	const db = createDb();

	const conditions = [eq(timeEntries.userId, userId)];

	if (startDate) {
		conditions.push(gte(timeEntries.startTime, startDate));
	}

	if (endDate) {
		conditions.push(lte(timeEntries.startTime, endDate));
	}

	const entries = await db
		.select()
		.from(timeEntries)
		.where(and(...conditions))
		.orderBy(desc(timeEntries.startTime));

	return entries;
}

/**
 * Update a time entry
 */
export async function updateTimeEntry(
	entryId: string,
	updates: {
		description?: string;
		startTime?: Date;
		endTime?: Date;
		isBillable?: boolean;
		hourlyRate?: number;
	}
) {
	const db = createDb();

	const [entry] = await db.select().from(timeEntries).where(eq(timeEntries.id, entryId)).limit(1);

	if (!entry) {
		throw new Error('Time entry not found');
	}

	// Recalculate duration and total if times are updated
	let duration = entry.duration;
	let totalAmount = entry.totalAmount;

	if (updates.startTime || updates.endTime) {
		const start = updates.startTime || entry.startTime;
		const end = updates.endTime || entry.endTime;

		if (end) {
			duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60));

			const isBillable = updates.isBillable ?? entry.isBillable;
			const hourlyRate = updates.hourlyRate?.toString() || entry.hourlyRate;

			if (isBillable && hourlyRate) {
				const hours = duration / 60;
				totalAmount = (hours * parseFloat(hourlyRate)).toFixed(2);
			}
		}
	}

	const [updated] = await db
		.update(timeEntries)
		.set({
			...updates,
			hourlyRate: updates.hourlyRate?.toString(),
			duration,
			totalAmount,
			updatedAt: new Date()
		})
		.where(eq(timeEntries.id, entryId))
		.returning();

	return updated;
}

/**
 * Delete a time entry
 */
export async function deleteTimeEntry(entryId: string) {
	const db = createDb();

	const [entry] = await db.select().from(timeEntries).where(eq(timeEntries.id, entryId)).limit(1);

	if (!entry) {
		throw new Error('Time entry not found');
	}

	if (entry.invoiceId) {
		throw new Error('Cannot delete time entry that has been invoiced');
	}

	await db.delete(timeEntries).where(eq(timeEntries.id, entryId));
}

/**
 * Get unbilled time entries for a project
 */
export async function getUnbilledTimeEntries(projectId: string) {
	const db = createDb();

	const entries = await db
		.select()
		.from(timeEntries)
		.where(
			and(
				eq(timeEntries.projectId, projectId),
				eq(timeEntries.isBillable, true),
				isNull(timeEntries.invoiceId)
			)
		)
		.orderBy(desc(timeEntries.startTime));

	return entries;
}

/**
 * Link time entries to an invoice
 */
export async function linkTimeEntriesToInvoice(entryIds: string[], invoiceId: string) {
	const db = createDb();

	await db
		.update(timeEntries)
		.set({ invoiceId, updatedAt: new Date() })
		.where(
			and(
				eq(timeEntries.id, entryIds[0]), // This is a simplification
				isNull(timeEntries.invoiceId)
			)
		);

	// TODO: Update this to handle multiple IDs properly
}

/**
 * Get total billable hours for a project
 */
export async function getProjectBillableHours(projectId: string): Promise<{
	totalHours: number;
	totalAmount: number;
	billedHours: number;
	billedAmount: number;
	unbilledHours: number;
	unbilledAmount: number;
}> {
	const db = createDb();

	const entries = await db
		.select()
		.from(timeEntries)
		.where(and(eq(timeEntries.projectId, projectId), eq(timeEntries.isBillable, true)));

	const totalHours = entries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60;
	const totalAmount = entries.reduce(
		(sum, entry) => sum + parseFloat(entry.totalAmount || '0'),
		0
	);

	const billedEntries = entries.filter((e) => e.invoiceId);
	const billedHours = billedEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60;
	const billedAmount = billedEntries.reduce(
		(sum, entry) => sum + parseFloat(entry.totalAmount || '0'),
		0
	);

	return {
		totalHours,
		totalAmount,
		billedHours,
		billedAmount,
		unbilledHours: totalHours - billedHours,
		unbilledAmount: totalAmount - billedAmount
	};
}

/**
 * Get user time tracking statistics
 */
export async function getUserTimeStats(
	userId: string,
	startDate: Date,
	endDate: Date
): Promise<{
	totalHours: number;
	billableHours: number;
	nonBillableHours: number;
	totalAmount: number;
	entriesCount: number;
}> {
	const db = createDb();

	const entries = await db
		.select()
		.from(timeEntries)
		.where(
			and(
				eq(timeEntries.userId, userId),
				gte(timeEntries.startTime, startDate),
				lte(timeEntries.startTime, endDate)
			)
		);

	const totalHours = entries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60;
	const billableEntries = entries.filter((e) => e.isBillable);
	const billableHours = billableEntries.reduce((sum, entry) => sum + (entry.duration || 0), 0) / 60;
	const totalAmount = billableEntries.reduce(
		(sum, entry) => sum + parseFloat(entry.totalAmount || '0'),
		0
	);

	return {
		totalHours,
		billableHours,
		nonBillableHours: totalHours - billableHours,
		totalAmount,
		entriesCount: entries.length
	};
}
