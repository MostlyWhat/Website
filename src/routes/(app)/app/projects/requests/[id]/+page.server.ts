import { createDb } from '$lib/server/db';
import { projectRequests, profiles, projects } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals, url }) => {
    if (!locals.user || !locals.profile) {
        error(401, 'You must be logged in to view this page.');
    }

    const requestId = params.id;

    // Create per-request database connection
    const db = createDb();

    // Get the request with related data
    const request = await db
        .select({
            id: projectRequests.id,
            requestNumber: projectRequests.requestNumber,
            title: projectRequests.title,
            description: projectRequests.description,
            projectType: projectRequests.projectType,
            budgetRange: projectRequests.budgetRange,
            timeline: projectRequests.timeline,
            goals: projectRequests.goals,
            requirements: projectRequests.requirements,
            references: projectRequests.references,
            status: projectRequests.status,
            reviewNotes: projectRequests.reviewNotes,
            reviewedAt: projectRequests.reviewedAt,
            convertedAt: projectRequests.convertedAt,
            createdAt: projectRequests.createdAt,
            updatedAt: projectRequests.updatedAt,
            organizationId: projectRequests.organizationId,
            projectId: projectRequests.projectId,
            requestedByName: profiles.displayName,
            requestedByEmail: profiles.email
        })
        .from(projectRequests)
        .innerJoin(profiles, eq(projectRequests.requestedById, profiles.id))
        .where(eq(projectRequests.id, requestId))
        .limit(1);

    if (request.length === 0) {
        error(404, 'Project request not found.');
    }

    const req = request[0];

    // Verify user has access to this request's organization
    // (Either they submitted it or are part of the org)
    const isRequester = req.requestedByEmail === locals.profile.email;

    if (!isRequester) {
        // Check if user is part of the organization
        const membership = await db.query.organizationMembers.findFirst({
            where: (om, { and: _and, eq: _eq }) =>
                _and(
                    _eq(om.organizationId, req.organizationId),
                    _eq(om.profileId, locals.profile!.id)
                )
        });

        if (!membership) {
            error(403, 'You do not have access to this project request.');
        }
    }

    // Get the converted project if exists
    let project = null;
    if (req.projectId) {
        const projectResult = await db
            .select({
                id: projects.id,
                name: projects.name,
                projectNumber: projects.projectNumber,
                status: projects.status
            })
            .from(projects)
            .where(eq(projects.id, req.projectId))
            .limit(1);

        if (projectResult.length > 0) {
            project = projectResult[0];
        }
    }

    return {
        request: req,
        project,
        showSuccess: url.searchParams.get('success') === 'true'
    };
};
