import { createDb } from '$lib/server/db';
import { jobPostings, jobApplications, profiles } from '$lib/server/db/schema';
import { eq, desc, and, count } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { isRedirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, locals }) => {
    const db = createDb();
    if (!locals.profile || !['super_admin', 'admin', 'staff'].includes(locals.profile.role)) {
        return { jobs: [], stats: { total: 0, published: 0, draft: 0, applications: 0 } };
    }

    const status = url.searchParams.get('status') ?? 'all';

    try {
        // Build where conditions
        const conditions = [];
        if (status !== 'all') {
            conditions.push(eq(jobPostings.status, status as 'draft' | 'published' | 'closed' | 'archived'));
        }

        // Fetch all job postings with application count
        const jobs = await db
            .select({
                id: jobPostings.id,
                title: jobPostings.title,
                slug: jobPostings.slug,
                department: jobPostings.department,
                location: jobPostings.location,
                locationType: jobPostings.locationType,
                type: jobPostings.type,
                status: jobPostings.status,
                isFeatured: jobPostings.isFeatured,
                publishedAt: jobPostings.publishedAt,
                closesAt: jobPostings.closesAt,
                createdAt: jobPostings.createdAt,
                createdByName: profiles.displayName
            })
            .from(jobPostings)
            .leftJoin(profiles, eq(jobPostings.createdById, profiles.id))
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(jobPostings.createdAt));

        // Get application counts for each job
        const jobsWithCounts = await Promise.all(
            jobs.map(async (job) => {
                const [result] = await db
                    .select({ count: count() })
                    .from(jobApplications)
                    .where(eq(jobApplications.jobId, job.id));
                return { ...job, applicationCount: result?.count ?? 0 };
            })
        );

        // Stats
        const allJobs = await db.select().from(jobPostings);
        const totalApplications = await db.select({ count: count() }).from(jobApplications);

        const stats = {
            total: allJobs.length,
            published: allJobs.filter(j => j.status === 'published').length,
            draft: allJobs.filter(j => j.status === 'draft').length,
            applications: totalApplications[0]?.count ?? 0
        };

        return { jobs: jobsWithCounts, stats, filters: { status } };
    } catch (error) {
        console.warn('Job postings table not available:', error);
        return { jobs: [], stats: { total: 0, published: 0, draft: 0, applications: 0 }, filters: { status } };
    }
};

export const actions: Actions = {
    // Create new job posting
    create: async ({ request, locals }) => {
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

        if (!title?.trim()) {
            return fail(400, { error: 'Job title is required' });
        }

        const slug = `${Date.now()}-${title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 50)}`;

        try {
            const [job] = await db.insert(jobPostings).values({
                title: title.trim(),
                slug,
                department: department?.trim() || null,
                location: location?.trim() || null,
                locationType: locationType || 'remote',
                type: type || 'full_time',
                description: description?.trim() || '',
                status: 'draft',
                createdById: locals.profile.id
            }).returning();

            redirect(303, `/admin/careers/${job.id}`);
        } catch (error) {
            if (isRedirect(error)) throw error;
            console.error('Failed to create job posting:', error);
            return fail(500, { error: 'Failed to create job posting' });
        }
    },

    // Update job status
    updateStatus: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['super_admin', 'admin', 'staff'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const status = formData.get('status') as 'draft' | 'published' | 'closed' | 'archived';

        if (!id || !status) {
            return fail(400, { error: 'Job ID and status are required' });
        }

        try {
            const updateData: Record<string, unknown> = { status, updatedAt: new Date() };
            if (status === 'published') {
                updateData.publishedAt = new Date();
            }

            await db.update(jobPostings)
                .set(updateData)
                .where(eq(jobPostings.id, id));
            return { success: true };
        } catch (error) {
            console.error('Failed to update job status:', error);
            return fail(500, { error: 'Failed to update job status' });
        }
    },

    // Toggle featured
    toggleFeatured: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const isFeatured = formData.get('isFeatured') === 'true';

        if (!id) {
            return fail(400, { error: 'Job ID is required' });
        }

        try {
            await db.update(jobPostings)
                .set({ isFeatured: !isFeatured, updatedAt: new Date() })
                .where(eq(jobPostings.id, id));
            return { success: true };
        } catch (error) {
            console.error('Failed to toggle featured:', error);
            return fail(500, { error: 'Failed to toggle featured' });
        }
    },

    // Delete job posting
    delete: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'Job ID is required' });
        }

        try {
            // Delete applications first
            await db.delete(jobApplications).where(eq(jobApplications.jobId, id));
            // Delete job posting
            await db.delete(jobPostings).where(eq(jobPostings.id, id));
            return { success: true };
        } catch (error) {
            console.error('Failed to delete job posting:', error);
            return fail(500, { error: 'Failed to delete job posting' });
        }
    }
};
