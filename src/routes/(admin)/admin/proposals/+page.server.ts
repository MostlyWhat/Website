import { db } from '$lib/server/db';
import { proposals, organizations, projects, profiles } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user || !locals.profile) {
		return { proposals: [] };
	}

	// Verify admin/staff role
	if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
		return { proposals: [] };
	}

	// Fetch all proposals with related data (proposals link to projects, projects link to orgs)
	const allProposals = await db
		.select({
			id: proposals.id,
			title: proposals.title,
			status: proposals.status,
			total: proposals.total,
			sentAt: proposals.sentAt,
			expiresAt: proposals.expiresAt,
			viewedAt: proposals.viewedAt,
			projectId: proposals.projectId,
			projectName: projects.name,
			organizationId: projects.organizationId,
			organizationName: organizations.name,
			createdById: proposals.createdById,
			createdByName: profiles.displayName,
			createdAt: proposals.createdAt,
			updatedAt: proposals.updatedAt
		})
		.from(proposals)
		.leftJoin(projects, eq(proposals.projectId, projects.id))
		.leftJoin(organizations, eq(projects.organizationId, organizations.id))
		.leftJoin(profiles, eq(proposals.createdById, profiles.id))
		.orderBy(desc(proposals.updatedAt));

	return {
		proposals: allProposals.map((p) => ({
			...p,
			organization: p.organizationName ?? 'Unknown',
			project: p.projectName,
			createdBy: p.createdByName ?? 'Unknown',
			total: p.total ? parseFloat(p.total) : 0
		}))
	};
};
