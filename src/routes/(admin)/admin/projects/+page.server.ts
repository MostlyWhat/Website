import { db } from '$lib/server/db';
import { projects, organizations, profiles } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || !locals.profile) {
		return { projects: [] };
	}

	// Verify admin/staff role
	if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
		return { projects: [] };
	}

	// Fetch all projects with organization and assignee info
	const allProjects = await db
		.select({
			id: projects.id,
			name: projects.name,
			description: projects.description,
			status: projects.status,
			startDate: projects.startDate,
			endDate: projects.endDate,
			estimatedBudget: projects.estimatedBudget,
			organizationId: projects.organizationId,
			organizationName: organizations.name,
			assignedToId: projects.assignedToId,
			assignedToName: profiles.displayName,
			createdAt: projects.createdAt,
			updatedAt: projects.updatedAt
		})
		.from(projects)
		.leftJoin(organizations, eq(projects.organizationId, organizations.id))
		.leftJoin(profiles, eq(projects.assignedToId, profiles.id))
		.orderBy(desc(projects.updatedAt));

	return {
		projects: allProjects.map((p) => ({
			...p,
			organization: p.organizationName ?? 'Unknown',
			assignedTo: p.assignedToName ?? null,
			budget: p.estimatedBudget ? parseFloat(p.estimatedBudget) : 0
		}))
	};
};
