import { db } from '$lib/server/db';
import { projects, organizationMembers, profiles } from '$lib/server/db/schema';
import { eq, inArray, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        return { projects: [] };
    }

    // Get user's organization IDs
    const userOrgs = await db
        .select({ organizationId: organizationMembers.organizationId })
        .from(organizationMembers)
        .where(eq(organizationMembers.profileId, locals.profile.id));

    const orgIds = userOrgs.map((o) => o.organizationId);

    if (orgIds.length === 0) {
        return { projects: [] };
    }

    // Fetch projects for user's organizations
    const userProjects = await db
        .select({
            id: projects.id,
            name: projects.name,
            description: projects.description,
            status: projects.status,
            startDate: projects.startDate,
            endDate: projects.endDate,
            organizationId: projects.organizationId,
            assignedToId: projects.assignedToId,
            assignedToName: profiles.displayName
        })
        .from(projects)
        .leftJoin(profiles, eq(projects.assignedToId, profiles.id))
        .where(inArray(projects.organizationId, orgIds))
        .orderBy(desc(projects.updatedAt));

    return {
        projects: userProjects.map((p) => ({
            ...p,
            assignedTo: p.assignedToName ?? 'Unassigned'
        }))
    };
};
