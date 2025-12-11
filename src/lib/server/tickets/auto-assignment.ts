/**
 * Ticket Auto-Assignment Helper
 * 
 * Automatically assigns tickets to staff members based on:
 * - Category
 * - Priority
 * - Keywords
 * - Staff group assignment rules
 * - Load balancing strategies (round-robin, least-busy, random)
 */

import { createDb } from '$lib/server/db';
import {
	ticketAutoAssignmentRules,
	staffGroupMembers,
	tickets,
	profiles,
	ticketCategories,
	staffGroups
} from '$lib/server/db/schema';
import { eq, and, desc, asc, isNull, or, sql, inArray } from 'drizzle-orm';

export interface AutoAssignmentResult {
	assigned: boolean;
	assignedToId: string | null;
	assignedToName: string | null;
	ruleName: string | null;
	strategy: string | null;
}

/**
 * Find the best matching auto-assignment rule for a ticket
 */
async function findMatchingRule(
	categoryId: string | null,
	priority: string,
	subject: string,
	description: string
): Promise<{
	ruleId: string;
	staffGroupId: string;
	assignmentStrategy: string;
	ruleName: string;
} | null> {
	const db = createDb();

	// Get all active rules ordered by priority
	const rules = await db
		.select({
			id: ticketAutoAssignmentRules.id,
			categoryId: ticketAutoAssignmentRules.categoryId,
			priority: ticketAutoAssignmentRules.priority,
			keywords: ticketAutoAssignmentRules.keywords,
			staffGroupId: ticketAutoAssignmentRules.staffGroupId,
			assignmentStrategy: ticketAutoAssignmentRules.assignmentStrategy,
			priorityOrder: ticketAutoAssignmentRules.priorityOrder,
			categoryName: ticketCategories.name,
			groupName: staffGroups.name
		})
		.from(ticketAutoAssignmentRules)
		.leftJoin(ticketCategories, eq(ticketAutoAssignmentRules.categoryId, ticketCategories.id))
		.leftJoin(staffGroups, eq(ticketAutoAssignmentRules.staffGroupId, staffGroups.id))
		.where(
			and(
				eq(ticketAutoAssignmentRules.isActive, true),
				eq(staffGroups.isActive, true)
			)
		)
		.orderBy(desc(ticketAutoAssignmentRules.priorityOrder));

	// Check each rule for a match
	for (const rule of rules) {
		let matches = true;

		// Check category match (null = any category)
		if (rule.categoryId && rule.categoryId !== categoryId) {
			matches = false;
		}

		// Check priority match (null = any priority)
		if (rule.priority && rule.priority !== priority) {
			matches = false;
		}

		// Check keywords match (must contain at least one keyword)
		if (rule.keywords && rule.keywords.length > 0) {
			const searchText = `${subject} ${description}`.toLowerCase();
			const hasKeyword = rule.keywords.some(keyword =>
				searchText.includes(keyword.toLowerCase())
			);
			if (!hasKeyword) {
				matches = false;
			}
		}

		if (matches) {
			return {
				ruleId: rule.id,
				staffGroupId: rule.staffGroupId,
				assignmentStrategy: rule.assignmentStrategy,
				ruleName: `${rule.groupName || 'Unknown Group'} (${rule.categoryName || 'Any Category'})`
			};
		}
	}

	return null;
}

/**
 * Get the next staff member to assign based on strategy
 */
async function getNextAssignee(
	staffGroupId: string,
	strategy: string
): Promise<{ profileId: string; displayName: string } | null> {
	const db = createDb();

	// Get active staff members in this group
	const members = await db
		.select({
			profileId: staffGroupMembers.profileId,
			displayName: profiles.displayName,
			role: profiles.role,
			lastAssignmentAt: staffGroupMembers.lastAssignmentAt
		})
		.from(staffGroupMembers)
		.innerJoin(profiles, eq(staffGroupMembers.profileId, profiles.id))
		.where(
			and(
				eq(staffGroupMembers.groupId, staffGroupId),
				inArray(profiles.role, ['super_admin', 'admin', 'staff'])
			)
		);

	if (members.length === 0) {
		return null;
	}

	let selectedMember: typeof members[0] | null = null;

	switch (strategy) {
		case 'round_robin':
			// Assign to member who was assigned longest ago (or never)
			selectedMember = members.reduce((oldest, current) => {
				if (!oldest.lastAssignmentAt) return oldest;
				if (!current.lastAssignmentAt) return current;
				return current.lastAssignmentAt < oldest.lastAssignmentAt ? current : oldest;
			});
			break;

		case 'least_busy':
			// Count open tickets per member and assign to least busy
			const memberTicketCounts = await Promise.all(
				members.map(async (member) => {
					const [result] = await db
						.select({ count: sql<number>`count(*)::int` })
						.from(tickets)
						.where(
							and(
								eq(tickets.assignedToId, member.profileId),
								inArray(tickets.status, ['open', 'in_progress', 'awaiting_customer', 'awaiting_staff'])
							)
						);

					return {
						member,
						count: result?.count ?? 0
					};
				})
			);

			// Find member with fewest tickets
			const leastBusy = memberTicketCounts.reduce((min, current) =>
				current.count < min.count ? current : min
			);
			selectedMember = leastBusy.member;
			break;

		case 'random':
			// Random assignment
			selectedMember = members[Math.floor(Math.random() * members.length)];
			break;

		default:
			// Default to round robin
			selectedMember = members[0];
	}

	if (!selectedMember) {
		return null;
	}

	// Update last assignment timestamp
	await db
		.update(staffGroupMembers)
		.set({ lastAssignmentAt: new Date() })
		.where(
			and(
				eq(staffGroupMembers.groupId, staffGroupId),
				eq(staffGroupMembers.profileId, selectedMember.profileId)
			)
		);

	return {
		profileId: selectedMember.profileId,
		displayName: selectedMember.displayName ?? 'Unknown'
	};
}

/**
 * Auto-assign a ticket based on category, priority, and keywords
 * 
 * @param categoryId - Ticket category ID (or null)
 * @param priority - Ticket priority (urgent, high, medium, low)
 * @param subject - Ticket subject
 * @param description - Ticket description
 * @returns Assignment result with assignee details
 */
export async function autoAssignTicket(
	categoryId: string | null,
	priority: string,
	subject: string,
	description: string
): Promise<AutoAssignmentResult> {
	try {
		// Find matching rule
		const rule = await findMatchingRule(categoryId, priority, subject, description);

		if (!rule) {
			// No matching rule found
			return {
				assigned: false,
				assignedToId: null,
				assignedToName: null,
				ruleName: null,
				strategy: null
			};
		}

		// Get next assignee based on strategy
		const assignee = await getNextAssignee(rule.staffGroupId, rule.assignmentStrategy);

		if (!assignee) {
			// No available staff in the group
			return {
				assigned: false,
				assignedToId: null,
				assignedToName: null,
				ruleName: rule.ruleName,
				strategy: rule.assignmentStrategy
			};
		}

		return {
			assigned: true,
			assignedToId: assignee.profileId,
			assignedToName: assignee.displayName,
			ruleName: rule.ruleName,
			strategy: rule.assignmentStrategy
		};
	} catch (error) {
		console.error('Auto-assignment error:', error);
		return {
			assigned: false,
			assignedToId: null,
			assignedToName: null,
			ruleName: null,
			strategy: null
		};
	}
}

/**
 * Get all auto-assignment rules with their details
 */
export async function getAutoAssignmentRules() {
	const db = createDb();

	const rules = await db
		.select({
			id: ticketAutoAssignmentRules.id,
			categoryId: ticketAutoAssignmentRules.categoryId,
			categoryName: ticketCategories.name,
			categorySlug: ticketCategories.slug,
			priority: ticketAutoAssignmentRules.priority,
			keywords: ticketAutoAssignmentRules.keywords,
			staffGroupId: ticketAutoAssignmentRules.staffGroupId,
			staffGroupName: staffGroups.name,
			assignmentStrategy: ticketAutoAssignmentRules.assignmentStrategy,
			isActive: ticketAutoAssignmentRules.isActive,
			priorityOrder: ticketAutoAssignmentRules.priorityOrder,
			createdAt: ticketAutoAssignmentRules.createdAt
		})
		.from(ticketAutoAssignmentRules)
		.leftJoin(ticketCategories, eq(ticketAutoAssignmentRules.categoryId, ticketCategories.id))
		.leftJoin(staffGroups, eq(ticketAutoAssignmentRules.staffGroupId, staffGroups.id))
		.orderBy(desc(ticketAutoAssignmentRules.priorityOrder));

	return rules;
}
