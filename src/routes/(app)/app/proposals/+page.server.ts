import { db } from '$lib/server/db';
import { proposals, organizationMembers, organizations, projects } from '$lib/server/db/schema';
import { eq, inArray, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        return { proposals: [] };
    }

    // Get user's organization IDs
    const userOrgs = await db
        .select({ organizationId: organizationMembers.organizationId })
        .from(organizationMembers)
        .where(eq(organizationMembers.profileId, locals.profile.id));

    const orgIds = userOrgs.map((o) => o.organizationId);

    if (orgIds.length === 0) {
        return { proposals: [] };
    }

    // Fetch proposals for user's organizations (proposals link to projects, projects link to orgs)
    const userProposals = await db
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
            organizationId: projects.organizationId
        })
        .from(proposals)
        .leftJoin(projects, eq(proposals.projectId, projects.id))
        .where(inArray(projects.organizationId, orgIds))
        .orderBy(desc(proposals.createdAt));

    return {
        proposals: userProposals.map((p) => ({
            ...p,
            project: p.projectName ?? 'N/A',
            total: p.total ? parseFloat(p.total) : 0
        }))
    };
};
