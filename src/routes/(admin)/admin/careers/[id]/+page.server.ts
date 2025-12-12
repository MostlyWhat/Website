import { createDb } from '$lib/server/db';
import { jobPostings, jobApplications, profiles } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';
import { isRedirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, locals }) => {
    const db = createDb();
    if (!locals.profile || !['super_admin', 'admin', 'staff'].includes(locals.profile.role)) {
        error(403, 'Unauthorized');
    }

    try {
        const [job] = await db
            .select()
            .from(jobPostings)
            .where(eq(jobPostings.id, params.id));

        if (!job) {
            error(404, 'Job posting not found');
        }

        // Get applications
        const applications = await db
            .select({
                id: jobApplications.id,
                firstName: jobApplications.firstName,
                lastName: jobApplications.lastName,
                email: jobApplications.email,
                phone: jobApplications.phone,
                linkedinUrl: jobApplications.linkedinUrl,
                portfolioUrl: jobApplications.portfolioUrl,
                resumeUrl: jobApplications.resumeUrl,
                status: jobApplications.status,
                createdAt: jobApplications.createdAt,
                reviewerName: profiles.displayName
            })
            .from(jobApplications)
            .leftJoin(profiles, eq(jobApplications.reviewedById, profiles.id))
            .where(eq(jobApplications.jobId, params.id))
            .orderBy(desc(jobApplications.createdAt));

        return { job, applications };
    } catch (err) {
        console.error('Failed to load job posting:', err);
        error(500, 'Failed to load job posting');
    }
};

export const actions: Actions = {
    // Update job posting
    update: async ({ request, params, locals }) => {
        const db = createDb();
        if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const department = formData.get('department') as string;
        const location = formData.get('location') as string;
        const locationType = formData.get('locationType') as 'remote' | 'onsite' | 'hybrid';
        const type = formData.get('type') as 'full_time' | 'part_time' | 'contract' | 'freelance' | 'internship';
        const description = formData.get('description') as string;
        const responsibilities = formData.get('responsibilities') as string;
        const requirements = formData.get('requirements') as string;
        const niceToHave = formData.get('niceToHave') as string;
        const benefits = formData.get('benefits') as string;
        const salaryMin = formData.get('salaryMin') as string;
        const salaryMax = formData.get('salaryMax') as string;
        const salaryCurrency = formData.get('salaryCurrency') as string;
        const applicationUrl = formData.get('applicationUrl') as string;
        const applicationEmail = formData.get('applicationEmail') as string;

        if (!title?.trim()) {
            return fail(400, { error: 'Job title is required' });
        }

        try {
            // Parse list fields (one item per line)
            const parseList = (text: string | null): string[] => {
                if (!text?.trim()) return [];
                return text.split('\n').map(s => s.trim()).filter(Boolean);
            };

            await db.update(jobPostings)
                .set({
                    title: title.trim(),
                    department: department?.trim() || null,
                    location: location?.trim() || null,
                    locationType: locationType || 'remote',
                    type: type || 'full_time',
                    description: description?.trim() || '',
                    responsibilities: parseList(responsibilities),
                    requirements: parseList(requirements),
                    niceToHave: parseList(niceToHave),
                    benefits: parseList(benefits),
                    salaryMin: salaryMin ? salaryMin : null,
                    salaryMax: salaryMax ? salaryMax : null,
                    salaryCurrency: salaryCurrency?.trim() || 'USD',
                    applicationUrl: applicationUrl?.trim() || null,
                    applicationEmail: applicationEmail?.trim() || null,
                    updatedAt: new Date()
                })
                .where(eq(jobPostings.id, params.id));

            return { success: true };
        } catch (err) {
            console.error('Failed to update job posting:', err);
            return fail(500, { error: 'Failed to update job posting' });
        }
    },

    // Publish job
    publish: async ({ params, locals }) => {
        const db = createDb();
        if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        try {
            await db.update(jobPostings)
                .set({
                    status: 'published',
                    publishedAt: new Date(),
                    updatedAt: new Date()
                })
                .where(eq(jobPostings.id, params.id));

            return { success: true };
        } catch (err) {
            console.error('Failed to publish job:', err);
            return fail(500, { error: 'Failed to publish job' });
        }
    },

    // Update application status
    updateApplicationStatus: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['super_admin', 'admin', 'staff'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const status = formData.get('status') as string;

        if (!id || !status) {
            return fail(400, { error: 'Application ID and status are required' });
        }

        try {
            await db.update(jobApplications)
                .set({
                    status: status as 'submitted' | 'reviewing' | 'interviewing' | 'offered' | 'hired' | 'rejected' | 'withdrawn',
                    reviewedById: locals.profile.id,
                    updatedAt: new Date()
                })
                .where(eq(jobApplications.id, id));

            return { success: true };
        } catch (err) {
            console.error('Failed to update application:', err);
            return fail(500, { error: 'Failed to update application' });
        }
    },

    // Delete job
    delete: async ({ params, locals }) => {
        const db = createDb();
        if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        try {
            await db.delete(jobApplications).where(eq(jobApplications.jobId, params.id));
            await db.delete(jobPostings).where(eq(jobPostings.id, params.id));
            redirect(303, '/admin/careers');
        } catch (err) {
            if (isRedirect(err)) throw err;
            console.error('Failed to delete job:', err);
            return fail(500, { error: 'Failed to delete job' });
        }
    }
};
