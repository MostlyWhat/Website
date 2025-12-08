import { createDb } from '$lib/server/db';
import { projects, organizations, profiles, projectRequests } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        return { projects: [], requests: [] };
    }

    // Verify admin/staff role
    if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        return { projects: [], requests: [] };
    }

    // Create per-request database connection
    const db = createDb();

    // Fetch all projects with organization and assignee info
    const allProjects = await db
        .select({
            id: projects.id,
            projectNumber: projects.projectNumber,
            name: projects.name,
            description: projects.description,
            phase: projects.phase,
            status: projects.status,
            proposalStatus: projects.proposalStatus,
            startDate: projects.startDate,
            endDate: projects.endDate,
            estimatedBudget: projects.estimatedBudget,
            organizationId: projects.organizationId,
            organizationName: organizations.name,
            orgNumber: organizations.orgNumber,
            assignedToId: projects.assignedToId,
            assignedToName: profiles.displayName,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt
        })
        .from(projects)
        .leftJoin(organizations, eq(projects.organizationId, organizations.id))
        .leftJoin(profiles, eq(projects.assignedToId, profiles.id))
        .orderBy(desc(projects.updatedAt));

    // Fetch all project requests (may not exist if migration hasn't run)
    let allRequests: Array<{
        id: string;
        requestNumber: string;
        title: string;
        projectType: string;
        status: string;
        organizationId: string;
        organizationName: string | null;
        orgNumber: string | null;
        createdAt: Date;
    }> = [];

    try {
        allRequests = await db
            .select({
                id: projectRequests.id,
                requestNumber: projectRequests.requestNumber,
                title: projectRequests.title,
                projectType: projectRequests.projectType,
                status: projectRequests.status,
                organizationId: projectRequests.organizationId,
                organizationName: organizations.name,
                orgNumber: organizations.orgNumber,
                createdAt: projectRequests.createdAt
            })
            .from(projectRequests)
            .leftJoin(organizations, eq(projectRequests.organizationId, organizations.id))
            .orderBy(desc(projectRequests.createdAt));
    } catch (error) {
        // Table may not exist yet
        console.warn('Project requests table not available:', error);
    }

    return {
        projects: allProjects.map((p) => ({
            ...p,
            organization: p.organizationName ?? 'Unknown',
            assignedTo: p.assignedToName ?? null,
            budget: p.estimatedBudget ? parseFloat(p.estimatedBudget) : 0
        })),
        requests: allRequests.map((r) => ({
            ...r,
            organization: r.organizationName ?? 'Unknown'
        }))
    };
};
