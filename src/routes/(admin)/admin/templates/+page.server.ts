/**
 * Ticket Templates Admin Page Server
 * 
 * Manages ticket templates with CRUD operations
 */

import { createDb } from '$lib/server/db';
import { ticketTemplates, ticketCategories, profiles, staffGroups } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const db = createDb();
	
	if (!locals.user || !locals.profile) {
		redirect(302, '/auth/login');
	}

	// Verify admin role
	if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
		error(403, 'Access denied');
	}

	// Fetch all templates with category and creator information
	const templates = await db
		.select({
			id: ticketTemplates.id,
			name: ticketTemplates.name,
			slug: ticketTemplates.slug,
			description: ticketTemplates.description,
			categoryId: ticketTemplates.categoryId,
			categoryName: ticketCategories.name,
			defaultPriority: ticketTemplates.defaultPriority,
			subjectTemplate: ticketTemplates.subjectTemplate,
			descriptionTemplate: ticketTemplates.descriptionTemplate,
			defaultAssigneeId: ticketTemplates.defaultAssigneeId,
			defaultStaffGroupId: ticketTemplates.defaultStaffGroupId,
			tags: ticketTemplates.tags,
			isActive: ticketTemplates.isActive,
			isPublic: ticketTemplates.isPublic,
			usageCount: ticketTemplates.usageCount,
			createdById: ticketTemplates.createdById,
			createdByName: profiles.displayName,
			createdAt: ticketTemplates.createdAt,
			updatedAt: ticketTemplates.updatedAt
		})
		.from(ticketTemplates)
		.leftJoin(ticketCategories, eq(ticketTemplates.categoryId, ticketCategories.id))
		.leftJoin(profiles, eq(ticketTemplates.createdById, profiles.id))
		.orderBy(desc(ticketTemplates.usageCount));

	// Fetch categories for the form
	const categories = await db
		.select({
			id: ticketCategories.id,
			name: ticketCategories.name,
			slug: ticketCategories.slug
		})
		.from(ticketCategories)
		.where(eq(ticketCategories.isActive, true));

	// Fetch staff members for assignee dropdown
	const staffMembers = await db
		.select({
			id: profiles.id,
			displayName: profiles.displayName,
			email: profiles.email
		})
		.from(profiles)
		.where(eq(profiles.isStaff, true));

	// Fetch staff groups
	const groups = await db
		.select({
			id: staffGroups.id,
			name: staffGroups.name
		})
		.from(staffGroups)
		.where(eq(staffGroups.isActive, true));

	return {
		templates,
		categories,
		staffMembers,
		groups
	};
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		const db = createDb();

		if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const slug = formData.get('slug') as string;
		const description = formData.get('description') as string | null;
		const categoryId = formData.get('categoryId') as string | null;
		const defaultPriority = formData.get('defaultPriority') as 'low' | 'medium' | 'high' | 'urgent';
		const subjectTemplate = formData.get('subjectTemplate') as string;
		const descriptionTemplate = formData.get('descriptionTemplate') as string;
		const defaultAssigneeId = formData.get('defaultAssigneeId') as string | null;
		const defaultStaffGroupId = formData.get('defaultStaffGroupId') as string | null;
		const tags = formData.get('tags') as string;
		const isPublic = formData.get('isPublic') === 'true';

		// Validation
		if (!name?.trim()) {
			return fail(400, { error: 'Template name is required' });
		}

		if (!slug?.trim()) {
			return fail(400, { error: 'Template slug is required' });
		}

		if (!subjectTemplate?.trim()) {
			return fail(400, { error: 'Subject template is required' });
		}

		if (!descriptionTemplate?.trim()) {
			return fail(400, { error: 'Description template is required' });
		}

		// Parse tags
		const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : null;

		try {
			await db.insert(ticketTemplates).values({
				name: name.trim(),
				slug: slug.trim(),
				description: description?.trim() || null,
				categoryId: categoryId || null,
				defaultPriority,
				subjectTemplate: subjectTemplate.trim(),
				descriptionTemplate: descriptionTemplate.trim(),
				defaultAssigneeId: defaultAssigneeId || null,
				defaultStaffGroupId: defaultStaffGroupId || null,
				tags: tagsArray,
				isActive: true,
				isPublic,
				usageCount: 0,
				createdById: locals.profile.id
			});

			return { success: true, message: 'Template created successfully' };
		} catch (err) {
			console.error('Error creating template:', err);
			return fail(500, { error: 'Failed to create template' });
		}
	},

	update: async ({ request, locals }) => {
		const db = createDb();

		if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;
		const name = formData.get('name') as string;
		const slug = formData.get('slug') as string;
		const description = formData.get('description') as string | null;
		const categoryId = formData.get('categoryId') as string | null;
		const defaultPriority = formData.get('defaultPriority') as 'low' | 'medium' | 'high' | 'urgent';
		const subjectTemplate = formData.get('subjectTemplate') as string;
		const descriptionTemplate = formData.get('descriptionTemplate') as string;
		const defaultAssigneeId = formData.get('defaultAssigneeId') as string | null;
		const defaultStaffGroupId = formData.get('defaultStaffGroupId') as string | null;
		const tags = formData.get('tags') as string;
		const isPublic = formData.get('isPublic') === 'true';

		// Validation
		if (!id) {
			return fail(400, { error: 'Template ID is required' });
		}

		if (!name?.trim()) {
			return fail(400, { error: 'Template name is required' });
		}

		if (!slug?.trim()) {
			return fail(400, { error: 'Template slug is required' });
		}

		if (!subjectTemplate?.trim()) {
			return fail(400, { error: 'Subject template is required' });
		}

		if (!descriptionTemplate?.trim()) {
			return fail(400, { error: 'Description template is required' });
		}

		// Parse tags
		const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : null;

		try {
			await db
				.update(ticketTemplates)
				.set({
					name: name.trim(),
					slug: slug.trim(),
					description: description?.trim() || null,
					categoryId: categoryId || null,
					defaultPriority,
					subjectTemplate: subjectTemplate.trim(),
					descriptionTemplate: descriptionTemplate.trim(),
					defaultAssigneeId: defaultAssigneeId || null,
					defaultStaffGroupId: defaultStaffGroupId || null,
					tags: tagsArray,
					isPublic,
					updatedAt: new Date()
				})
				.where(eq(ticketTemplates.id, id));

			return { success: true, message: 'Template updated successfully' };
		} catch (err) {
			console.error('Error updating template:', err);
			return fail(500, { error: 'Failed to update template' });
		}
	},

	toggleActive: async ({ request, locals }) => {
		const db = createDb();

		if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Template ID is required' });
		}

		try {
			// Get current state
			const [template] = await db
				.select({ isActive: ticketTemplates.isActive })
				.from(ticketTemplates)
				.where(eq(ticketTemplates.id, id))
				.limit(1);

			if (!template) {
				return fail(404, { error: 'Template not found' });
			}

			// Toggle state
			await db
				.update(ticketTemplates)
				.set({ isActive: !template.isActive, updatedAt: new Date() })
				.where(eq(ticketTemplates.id, id));

			return { success: true, message: `Template ${template.isActive ? 'deactivated' : 'activated'}` };
		} catch (err) {
			console.error('Error toggling template:', err);
			return fail(500, { error: 'Failed to toggle template' });
		}
	},

	delete: async ({ request, locals }) => {
		const db = createDb();

		if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { error: 'Template ID is required' });
		}

		try {
			await db
				.delete(ticketTemplates)
				.where(eq(ticketTemplates.id, id));

			return { success: true, message: 'Template deleted successfully' };
		} catch (err) {
			console.error('Error deleting template:', err);
			return fail(500, { error: 'Failed to delete template' });
		}
	}
};
