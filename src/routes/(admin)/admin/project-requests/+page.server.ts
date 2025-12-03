import { db } from '$lib/server/db';
import { projectRequests, profiles, organizations, projects } from '$lib/server/db/schema';
import { eq, desc, sql, and, ne } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
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

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile || !['super_admin', 'admin', 'staff'].includes(locals.profile.role ?? '')) {
        redirect(302, '/auth/login');
    }

    // Get all project requests with related data
    const allRequests = await db
        .select({
            id: projectRequests.id,
            requestNumber: projectRequests.requestNumber,
            title: projectRequests.title,
            projectType: projectRequests.projectType,
            budgetRange: projectRequests.budgetRange,
            timeline: projectRequests.timeline,
            status: projectRequests.status,
            createdAt: projectRequests.createdAt,
            organizationId: projectRequests.organizationId,
            organizationName: organizations.name,
            requestedByName: profiles.displayName,
            requestedByEmail: profiles.email
        })
        .from(projectRequests)
        .innerJoin(profiles, eq(projectRequests.requestedById, profiles.id))
        .innerJoin(organizations, eq(projectRequests.organizationId, organizations.id))
        .orderBy(desc(projectRequests.createdAt));

    // Get stats
    const pending = allRequests.filter(r => r.status === 'pending').length;
    const underReview = allRequests.filter(r => r.status === 'under_review').length;
    const approved = allRequests.filter(r => r.status === 'approved').length;

    return {
        requests: allRequests,
        stats: { pending, underReview, approved, total: allRequests.length }
    };
};

export const actions: Actions = {
    updateStatus: async ({ request, locals }) => {
        if (!locals.user || !locals.profile || !['super_admin', 'admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const requestId = formData.get('requestId') as string;
        const status = formData.get('status') as string;
        const reviewNotes = formData.get('reviewNotes') as string;

        if (!requestId || !status) {
            return fail(400, { error: 'Missing required fields' });
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
                .where(eq(projectRequests.id, requestId));

            return { success: true, message: `Request status updated to ${status}` };
        } catch (error) {
            console.error('Failed to update request status:', error);
            return fail(500, { error: 'Failed to update request status' });
        }
    },

    convertToProject: async ({ request, locals }) => {
        if (!locals.user || !locals.profile || !['super_admin', 'admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const requestId = formData.get('requestId') as string;
        const projectName = formData.get('projectName') as string;

        if (!requestId) {
            return fail(400, { error: 'Missing request ID' });
        }

        // Get the request details
        const req = await db
            .select()
            .from(projectRequests)
            .where(eq(projectRequests.id, requestId))
            .limit(1);

        if (req.length === 0) {
            return fail(404, { error: 'Request not found' });
        }

        const projectRequest = req[0];

        try {
            const projectNumber = await generateProjectNumber();
            const slug = (projectName || projectRequest.title)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');

            // Create the project
            const [newProject] = await db
                .insert(projects)
                .values({
                    organizationId: projectRequest.organizationId,
                    projectNumber,
                    name: projectName || projectRequest.title,
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
                .where(eq(projectRequests.id, requestId));

            return { success: true, message: 'Request converted to project', projectId: newProject.id };
        } catch (error) {
            console.error('Failed to convert request to project:', error);
            return fail(500, { error: 'Failed to convert request to project' });
        }
    }
};
