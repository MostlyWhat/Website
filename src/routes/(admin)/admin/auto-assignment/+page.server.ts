/**
 * Auto-Assignment Rules Management - Server
 * Admin page for configuring automatic ticket assignment rules
 */

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db';
import {
	ticketAutoAssignmentRules,
	ticketCategories,
	staffGroups,
	staffGroupMembers,
	profiles
} from '$lib/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { logActivity } from '$lib/server/activity-logger';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || !locals.profile) {
		redirect(302, '/auth/login');
	}

	// Verify admin role
	if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
		redirect(302, '/admin');
	}

	const db = createDb();

	// Fetch all auto-assignment rules with related data
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

	// Get member counts for each staff group
	const rulesWithMemberCounts = await Promise.all(
		rules.map(async (rule) => {
			const members = await db
				.select({ profileId: staffGroupMembers.profileId })
				.from(staffGroupMembers)
				.where(eq(staffGroupMembers.groupId, rule.staffGroupId));

			return {
				...rule,
				memberCount: members.length
			};
		})
	);

	// Fetch ticket categories for dropdown
	const categories = await db
		.select({
			id: ticketCategories.id,
			name: ticketCategories.name,
			slug: ticketCategories.slug,
			isActive: ticketCategories.isActive
		})
		.from(ticketCategories)
		.where(eq(ticketCategories.isActive, true))
		.orderBy(ticketCategories.name);

	// Fetch staff groups for dropdown
	const groups = await db
		.select({
			id: staffGroups.id,
			name: staffGroups.name,
			slug: staffGroups.slug,
			isActive: staffGroups.isActive
		})
		.from(staffGroups)
		.where(eq(staffGroups.isActive, true))
		.orderBy(staffGroups.name);

	return {
		rules: rulesWithMemberCounts,
		categories,
		staffGroups: groups
	};
};

export const actions: Actions = {
	createRule: async ({ request, locals }) => {
		const db = createDb();

		if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const categoryId = formData.get('categoryId') as string | null;
		const priority = formData.get('priority') as string | null;
		const keywordsStr = formData.get('keywords') as string;
		const staffGroupId = formData.get('staffGroupId') as string;
		const assignmentStrategy = formData.get('assignmentStrategy') as string;
		const priorityOrder = parseInt(formData.get('priorityOrder') as string) || 0;

		if (!staffGroupId) {
			return fail(400, { error: 'Staff group is required' });
		}

		// Parse keywords
		const keywords = keywordsStr
			? keywordsStr.split(',').map(k => k.trim()).filter(Boolean)
			: [];

		try {
			const [newRule] = await db
				.insert(ticketAutoAssignmentRules)
				.values({
					categoryId: categoryId || null,
					priority: priority || null,
					keywords: keywords.length > 0 ? keywords : null,
					staffGroupId,
					assignmentStrategy: assignmentStrategy || 'round_robin',
					priorityOrder,
					isActive: true,
					createdById: locals.profile.id
				})
				.returning({ id: ticketAutoAssignmentRules.id });

			await logActivity({
				entityType: 'ticket_auto_assignment_rule',
				entityId: newRule.id,
				activityType: 'created',
				description: `Created auto-assignment rule`,
				performedById: locals.profile.id
			});

			return { success: true, message: 'Auto-assignment rule created successfully' };
		} catch (err) {
			console.error('Error creating auto-assignment rule:', err);
			return fail(500, { error: 'Failed to create rule' });
		}
	},

	toggleRule: async ({ request, locals }) => {
		const db = createDb();

		if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const ruleId = formData.get('ruleId') as string;
		const isActive = formData.get('isActive') === 'true';

		if (!ruleId) {
			return fail(400, { error: 'Rule ID is required' });
		}

		try {
			await db
				.update(ticketAutoAssignmentRules)
				.set({
					isActive: !isActive,
					updatedAt: new Date()
				})
				.where(eq(ticketAutoAssignmentRules.id, ruleId));

			await logActivity({
				entityType: 'ticket_auto_assignment_rule',
				entityId: ruleId,
				activityType: 'updated',
				description: `${isActive ? 'Disabled' : 'Enabled'} auto-assignment rule`,
				performedById: locals.profile.id
			});

			return { success: true, message: `Rule ${isActive ? 'disabled' : 'enabled'} successfully` };
		} catch (err) {
			console.error('Error toggling rule:', err);
			return fail(500, { error: 'Failed to update rule' });
		}
	},

	deleteRule: async ({ request, locals }) => {
		const db = createDb();

		if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const ruleId = formData.get('ruleId') as string;

		if (!ruleId) {
			return fail(400, { error: 'Rule ID is required' });
		}

		try {
			await db.delete(ticketAutoAssignmentRules).where(eq(ticketAutoAssignmentRules.id, ruleId));

			await logActivity({
				entityType: 'ticket_auto_assignment_rule',
				entityId: ruleId,
				activityType: 'deleted',
				description: `Deleted auto-assignment rule`,
				performedById: locals.profile.id
			});

			return { success: true, message: 'Rule deleted successfully' };
		} catch (err) {
			console.error('Error deleting rule:', err);
			return fail(500, { error: 'Failed to delete rule' });
		}
	}
};
