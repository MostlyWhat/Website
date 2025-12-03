import { db } from '$lib/server/db';
import { projectRequests, profiles, organizations, projects } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { fail, redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// Generate project number like PRJ-YYYY-XXXXX
async function generateProjectNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `PRJ-${year}-`;
    
    const latest = await db
        .select({ projectNumber: projects.projectNumber })
        .from(projects)
        .where(sql`${projects.projectNumber} LIKE ${prefix + '%'}`)
        .orderBy(desc(projects.projectNumber))
        .limit(1);

    let nextNum = 1;
    if (latest.length > 0 && latest[0].projectNumber) {
        const lastNum = parseInt(latest[0].projectNumber.replace(prefix, ''), 10);
        if (!isNaN(lastNum)) {
            nextNum = lastNum + 1;
        }
    }

    return `${prefix}${String(nextNum).padStart(5, '0')}`;
}

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || !locals.profile || !['super_admin', 'admin', 'staff'].includes(locals.profile.role ?? '')) {
        redirect(302, '/auth/login');
    }

    const requestId = params.id;

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
            organizationName: organizations.name,
            projectId: projectRequests.projectId,
            requestedById: projectRequests.requestedById,
            requestedByName: profiles.displayName,
            requestedByEmail: profiles.email
        })
        .from(projectRequests)
        .innerJoin(profiles, eq(projectRequests.requestedById, profiles.id))
        .innerJoin(organizations, eq(projectRequests.organizationId, organizations.id))
        .where(eq(projectRequests.id, requestId))
        .limit(1);

    if (request.length === 0) {
        error(404, 'Project request not found.');
    }

    const req = request[0];

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

    // Get reviewer info if reviewed
    let reviewer = null;
    if (req.reviewedAt) {
        const reviewerResult = await db
            .select({
                id: profiles.id,
                name: profiles.displayName
            })
            .from(projectRequests)
            .innerJoin(profiles, eq(projectRequests.reviewedById, profiles.id))
            .where(eq(projectRequests.id, requestId))
            .limit(1);

        if (reviewerResult.length > 0) {
            reviewer = reviewerResult[0];
        }
    }

    return {
        request: req,
        project,
        reviewer
    };
};

export const actions: Actions = {
    updateStatus: async ({ request, locals, params }) => {
        if (!locals.user || !locals.profile || !['super_admin', 'admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const status = formData.get('status') as string;
        const reviewNotes = formData.get('reviewNotes') as string;

        if (!status) {
            return fail(400, { error: 'Missing status' });
        }

        try {
            await db
                .update(projectRequests)
                .set({
                    status: status as 'pending' | 'under_review' | 'approved' | 'rejected' | 'converted',
                    reviewedById: locals.profile.id,
                    reviewedAt: new Date(),
                    reviewNotes: reviewNotes || null,
                    updatedAt: new Date()
                })
                .where(eq(projectRequests.id, params.id));

            return { success: true, message: `Request status updated to ${status}` };
        } catch (error) {
            console.error('Failed to update request status:', error);
            return fail(500, { error: 'Failed to update request status' });
        }
    },

    convertToProject: async ({ request, locals, params }) => {
        if (!locals.user || !locals.profile || !['super_admin', 'admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const projectName = formData.get('projectName') as string;

        // Get the request details
        const req = await db
            .select()
            .from(projectRequests)
            .where(eq(projectRequests.id, params.id))
            .limit(1);

        if (req.length === 0) {
            return fail(404, { error: 'Request not found' });
        }

        const projectRequest = req[0];

        if (projectRequest.status === 'converted') {
            return fail(400, { error: 'Request has already been converted' });
        }

        try {
            const projectNumber = await generateProjectNumber();
            const name = projectName || projectRequest.title;
            const slug = name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            // Create the project
            const [newProject] = await db
                .insert(projects)
                .values({
                    organizationId: projectRequest.organizationId,
                    projectNumber,
                    name,
                    slug,
                    description: projectRequest.description,
                    status: 'draft',
                    currency: 'USD'
                })
                .returning({ id: projects.id });

            // Update the request to converted status
            await db
                .update(projectRequests)
                .set({
                    status: 'converted',
                    projectId: newProject.id,
                    convertedAt: new Date(),
                    reviewedById: locals.profile.id,
                    reviewedAt: new Date(),
                    updatedAt: new Date()
                })
                .where(eq(projectRequests.id, params.id));

            redirect(303, `/admin/projects/${newProject.id}`);
        } catch (err) {
            if (err instanceof Response) throw err; // Re-throw redirects
            console.error('Failed to convert request to project:', err);
            return fail(500, { error: 'Failed to convert request to project' });
        }
    }
};
