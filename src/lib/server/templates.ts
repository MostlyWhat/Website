/**
 * Template Library Service
 * 
 * Manages reusable templates for tickets
 */

import { createDb } from '$lib/server/db';
import { ticketTemplates, tickets } from '$lib/server/db/schema';
import { eq, and, or, ilike, desc } from 'drizzle-orm';

// ============================================================================
// Ticket Templates
// ============================================================================

/**
 * Create a ticket template
 */
export async function createTicketTemplate(options: {
	name: string;
	slug: string;
	description?: string;
	categoryId?: string;
	isPublic?: boolean;
	createdById: string;
	subjectTemplate: string;
	descriptionTemplate: string;
	defaultPriority?: 'low' | 'medium' | 'high' | 'urgent';
	tags?: string[];
}) {
	const db = createDb();

	const [template] = await db
		.insert(ticketTemplates)
		.values({
			name: options.name,
			slug: options.slug,
			description: options.description,
			categoryId: options.categoryId,
			isPublic: options.isPublic,
			createdById: options.createdById,
			subjectTemplate: options.subjectTemplate,
			descriptionTemplate: options.descriptionTemplate,
			defaultPriority: options.defaultPriority || 'medium',
			tags: options.tags
		})
		.returning();

	return template;
}

/**
 * Get ticket templates
 */
export async function getTicketTemplates(filters?: {
	categoryId?: string;
	isPublic?: boolean;
	searchQuery?: string;
}) {
	const db = createDb();

	const conditions = [];

	if (filters?.isPublic !== undefined) {
		conditions.push(eq(ticketTemplates.isPublic, filters.isPublic));
	}

	if (filters?.categoryId) {
		conditions.push(eq(ticketTemplates.categoryId, filters.categoryId));
	}

	if (filters?.searchQuery) {
		conditions.push(
			or(
				ilike(ticketTemplates.name, `%${filters.searchQuery}%`),
				ilike(ticketTemplates.description, `%${filters.searchQuery}%`)
			) as any
		);
	}

	const templates = await db
		.select()
		.from(ticketTemplates)
		.where(conditions.length > 0 ? and(...conditions) : undefined)
		.orderBy(desc(ticketTemplates.usageCount));

	return templates;
}

/**
 * Get a single ticket template
 */
export async function getTicketTemplate(templateId: string) {
	const db = createDb();

	const [template] = await db
		.select()
		.from(ticketTemplates)
		.where(eq(ticketTemplates.id, templateId))
		.limit(1);

	return template;
}

/**
 * Update a ticket template
 */
export async function updateTicketTemplate(
	templateId: string,
	updates: Partial<{
		name: string;
		slug: string;
		description: string;
		categoryId: string;
		isPublic: boolean;
		subjectTemplate: string;
		descriptionTemplate: string;
		defaultPriority: 'low' | 'medium' | 'high' | 'urgent';
		tags: string[];
	}>
) {
	const db = createDb();

	const [template] = await db
		.update(ticketTemplates)
		.set(updates)
		.where(eq(ticketTemplates.id, templateId))
		.returning();

	return template;
}

/**
 * Delete a ticket template
 */
export async function deleteTicketTemplate(templateId: string) {
	const db = createDb();

	await db.delete(ticketTemplates).where(eq(ticketTemplates.id, templateId));
}

/**
 * Create a ticket from a template
 */
export async function createTicketFromTemplate(
	templateId: string,
	overrides: {
		organizationId: string;
		createdById: string;
		customerId?: string;
		projectId?: string;
		assignedToId?: string;
	}
) {
	const db = createDb();

	const template = await getTicketTemplate(templateId);

	if (!template) {
		throw new Error('Template not found');
	}

	// Create the ticket using template values
	const [ticket] = await db
		.insert(tickets)
		.values({
			subject: template.subjectTemplate,
			description: template.descriptionTemplate,
			priority: template.defaultPriority,
			categoryId: template.categoryId,
			organizationId: overrides.organizationId,
			createdById: overrides.createdById,
			customerId: overrides.customerId,
			projectId: overrides.projectId,
			assignedToId: overrides.assignedToId || template.defaultAssigneeId,
			staffGroupId: template.defaultStaffGroupId,
			status: 'new'
		})
		.returning();

	// Increment usage count
	await db
		.update(ticketTemplates)
		.set({
			usageCount: template.usageCount + 1
		})
		.where(eq(ticketTemplates.id, templateId));

	return ticket;
}

// ============================================================================
// Popular Templates
// ============================================================================

/**
 * Get popular templates
 */
export async function getPopularTemplates(type: 'ticket' | 'project', limit = 10) {
	const db = createDb();

	if (type === 'ticket') {
		return await db
			.select()
			.from(ticketTemplates)
			.where(eq(ticketTemplates.isPublic, true))
			.orderBy(desc(ticketTemplates.usageCount))
			.limit(limit);
	} else {
		// TODO: Implement projectTemplates table and functions
		return [];
	}
}
