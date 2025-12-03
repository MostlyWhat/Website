import { db } from '$lib/server/db';
import { projects, organizations, profiles, organizationMembers, activityLog } from '$lib/server/db/schema';
import { eq, and, inArray, desc } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || !locals.profile) {
        error(401, 'Unauthorized');
    }

    // Get user's organization IDs
    const userOrgs = await db
        .select({ organizationId: organizationMembers.organizationId })
        .from(organizationMembers)
        .where(eq(organizationMembers.profileId, locals.profile.id));

    const orgIds = userOrgs.map((o) => o.organizationId);

    if (orgIds.length === 0) {
        error(403, 'Not authorized to view this project');
    }

    // Fetch the project
    const [project] = await db
        .select({
            id: projects.id,
            name: projects.name,
            slug: projects.slug,
            description: projects.description,
            status: projects.status,
            startDate: projects.startDate,
            endDate: projects.endDate,
            completedAt: projects.completedAt,
            estimatedBudget: projects.estimatedBudget,
            actualBudget: projects.actualBudget,
            currency: projects.currency,
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
        .where(
            and(
                eq(projects.id, params.id),
                inArray(projects.organizationId, orgIds)
            )
        )
        .limit(1);

    if (!project) {
        error(404, 'Project not found');
    }

    // Get recent activity for this project
    const recentActivity = await db
        .select({
            id: activityLog.id,
            activityType: activityLog.activityType,
            description: activityLog.description,
            createdAt: activityLog.createdAt,
            userName: profiles.displayName
        })
        .from(activityLog)
        .leftJoin(profiles, eq(activityLog.performedById, profiles.id))
        .where(
            and(
                eq(activityLog.entityType, 'project'),
                eq(activityLog.entityId, params.id)
            )
        )
        .orderBy(desc(activityLog.createdAt))
        .limit(10);

    return {
        project: {
            ...project,
            organization: project.organizationName ?? 'Unknown',
            assignedTo: project.assignedToName ?? 'Unassigned',
            estimatedBudget: project.estimatedBudget ? parseFloat(project.estimatedBudget) : 0,
            actualBudget: project.actualBudget ? parseFloat(project.actualBudget) : 0
        },
        recentActivity: recentActivity.map((a) => ({
            ...a,
            user: a.userName ?? 'System'
        }))
    };
};
