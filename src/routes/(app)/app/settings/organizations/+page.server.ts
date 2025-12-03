import { db } from '$lib/server/db';
import { organizations, organizationMembers } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.profile) {
		return { organizations: [] };
	}

	// Get user's organizations with member count
	const userOrgs = await db
		.select({
			id: organizations.id,
			name: organizations.name,
			slug: organizations.slug,
			logoUrl: organizations.logoUrl,
			role: organizationMembers.role,
			memberCount: sql<number>`(
				SELECT count(*) FROM organization_members 
				WHERE organization_id = ${organizations.id}
			)::int`
		})
		.from(organizationMembers)
		.innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
		.where(eq(organizationMembers.profileId, locals.profile.id));

	return {
		organizations: userOrgs
	};
};

export const actions: Actions = {
	joinOrganization: async ({ request, locals }) => {
		if (!locals.profile) {
			return fail(401, { error: 'Unauthorized' });
		}

		const formData = await request.formData();
		const inviteCode = formData.get('inviteCode') as string;

		if (!inviteCode) {
			return fail(400, { error: 'Invite code is required' });
		}

		// TODO: Implement invite code validation and joining logic
		return fail(400, { error: 'Invite system coming soon' });
	}
};
