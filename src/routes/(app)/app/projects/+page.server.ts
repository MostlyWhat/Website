import { createDb } from '$lib/server/db';
import { projects, organizationMembers, profiles, projectRequests } from '$lib/server/db/schema';
import { eq, inArray, desc, and, ne } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

// Async function to load projects data
async function loadProjectsData(profileId: string) {
    // Create per-request database connection
    const db = createDb();
    
    // Get user's organization IDs
    const userOrgs = await db
        .select({ organizationId: organizationMembers.organizationId })
        .from(organizationMembers)
        .where(eq(organizationMembers.profileId, profileId));

    const orgIds = userOrgs.map((o) => o.organizationId);

    if (orgIds.length === 0) {
        return { projects: [], requests: [] };
    }

    // Fetch projects for user's organizations
    const userProjects = await db
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
            organizationId: projects.organizationId,
            assignedToId: projects.assignedToId,
            assignedToName: profiles.displayName
        })
        .from(projects)
        .leftJoin(profiles, eq(projects.assignedToId, profiles.id))
        .where(inArray(projects.organizationId, orgIds))
        .orderBy(desc(projects.updatedAt));

    // Fetch project requests (pending, under_review, approved, rejected)
    let userRequests: Array<{
        id: string;
        requestNumber: string;
        title: string;
        projectType: string;
        status: string;
        createdAt: Date;
    }> = [];

    try {
        userRequests = await db
            .select({
                id: projectRequests.id,
                requestNumber: projectRequests.requestNumber,
                title: projectRequests.title,
                projectType: projectRequests.projectType,
                status: projectRequests.status,
                createdAt: projectRequests.createdAt
            })
            .from(projectRequests)
            .where(
                and(
                    inArray(projectRequests.organizationId, orgIds),
                    ne(projectRequests.status, 'converted')
                )
            )
            .orderBy(desc(projectRequests.createdAt));
    } catch (error) {
        // Table may not exist yet
        console.warn('Project requests table not available:', error);
    }

    return {
        projects: userProjects.map((p) => ({
            ...p,
            assignedTo: p.assignedToName ?? 'Unassigned'
        })),
        requests: userRequests
    };
}

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        return {
            streamed: {
                projectsData: Promise.resolve({ projects: [], requests: [] })
            }
        };
    }

    // Return streamed data for progressive loading
    return {
        streamed: {
            projectsData: loadProjectsData(locals.profile.id)
        }
    };
};
