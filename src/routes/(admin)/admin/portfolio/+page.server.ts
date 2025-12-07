import { db } from '$lib/server/db';
import { portfolioProjects, profiles } from '$lib/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, locals }) => {
    if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
        return { projects: [], filters: {} };
    }

    const status = url.searchParams.get('status') ?? 'all';
    const category = url.searchParams.get('category') ?? '';

    try {
        // Build where conditions
        const conditions = [];
        
        if (status !== 'all') {
            conditions.push(eq(portfolioProjects.status, status as 'draft' | 'published' | 'archived'));
        }
        
        if (category) {
            conditions.push(eq(portfolioProjects.category, category));
        }

        const projects = await db
            .select({
                id: portfolioProjects.id,
                slug: portfolioProjects.slug,
                title: portfolioProjects.title,
                client: portfolioProjects.client,
                description: portfolioProjects.description,
                category: portfolioProjects.category,
                year: portfolioProjects.year,
                status: portfolioProjects.status,
                isFeatured: portfolioProjects.isFeatured,
                featuredImage: portfolioProjects.featuredImage,
                publishedAt: portfolioProjects.publishedAt,
                sortOrder: portfolioProjects.sortOrder,
                createdAt: portfolioProjects.createdAt,
                updatedAt: portfolioProjects.updatedAt,
                createdByName: profiles.displayName
            })
            .from(portfolioProjects)
            .leftJoin(profiles, eq(portfolioProjects.createdById, profiles.id))
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(portfolioProjects.sortOrder), desc(portfolioProjects.createdAt));

        // Get unique categories for filter
        const allProjects = await db
            .selectDistinct({ category: portfolioProjects.category })
            .from(portfolioProjects);
        
        const categories = allProjects.map(p => p.category).filter(Boolean);

        return {
            projects,
            categories,
            filters: { status, category }
        };
    } catch (error) {
        console.warn('Portfolio projects table not available:', error);
        return { projects: [], categories: [], filters: { status, category } };
    }
};

export const actions: Actions = {
    delete: async ({ request, locals }) => {
        if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'Project ID is required' });
        }

        try {
            await db.delete(portfolioProjects).where(eq(portfolioProjects.id, id));
            return { success: true };
        } catch (error) {
            console.error('Failed to delete portfolio project:', error);
            return fail(500, { error: 'Failed to delete project' });
        }
    },

    toggleFeatured: async ({ request, locals }) => {
        if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const isFeatured = formData.get('isFeatured') === 'true';

        if (!id) {
            return fail(400, { error: 'Project ID is required' });
        }

        try {
            await db
                .update(portfolioProjects)
                .set({ isFeatured: !isFeatured, updatedAt: new Date() })
                .where(eq(portfolioProjects.id, id));
            return { success: true };
        } catch (error) {
            console.error('Failed to toggle featured:', error);
            return fail(500, { error: 'Failed to update project' });
        }
    },

    toggleStatus: async ({ request, locals }) => {
        if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const currentStatus = formData.get('status') as string;

        if (!id) {
            return fail(400, { error: 'Project ID is required' });
        }

        // Toggle between draft and published
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        const publishedAt = newStatus === 'published' ? new Date() : null;

        try {
            await db
                .update(portfolioProjects)
                .set({ 
                    status: newStatus, 
                    publishedAt,
                    updatedAt: new Date() 
                })
                .where(eq(portfolioProjects.id, id));
            return { success: true };
        } catch (error) {
            console.error('Failed to toggle status:', error);
            return fail(500, { error: 'Failed to update project' });
        }
    }
};
