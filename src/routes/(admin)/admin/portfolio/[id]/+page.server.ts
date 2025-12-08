import { createDb } from '$lib/server/db';
import { portfolioProjects, profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const db = createDb();
    if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
        throw redirect(303, '/admin');
    }

    try {
        const [project] = await db
            .select({
                id: portfolioProjects.id,
                slug: portfolioProjects.slug,
                title: portfolioProjects.title,
                client: portfolioProjects.client,
                description: portfolioProjects.description,
                content: portfolioProjects.content,
                category: portfolioProjects.category,
                tags: portfolioProjects.tags,
                year: portfolioProjects.year,
                featuredImage: portfolioProjects.featuredImage,
                gallery: portfolioProjects.gallery,
                videoUrl: portfolioProjects.videoUrl,
                liveUrl: portfolioProjects.liveUrl,
                metaTitle: portfolioProjects.metaTitle,
                metaDescription: portfolioProjects.metaDescription,
                status: portfolioProjects.status,
                isFeatured: portfolioProjects.isFeatured,
                publishedAt: portfolioProjects.publishedAt,
                sortOrder: portfolioProjects.sortOrder,
                createdAt: portfolioProjects.createdAt,
                updatedAt: portfolioProjects.updatedAt,
                createdById: portfolioProjects.createdById,
                createdByName: profiles.displayName
            })
            .from(portfolioProjects)
            .leftJoin(profiles, eq(portfolioProjects.createdById, profiles.id))
            .where(eq(portfolioProjects.id, params.id));

        if (!project) {
            throw error(404, 'Portfolio project not found');
        }

        // Default categories for portfolio projects
        const defaultCategories = [
            'web-app',
            'mobile',
            'design',
            'branding',
            'e-commerce',
            'saas',
            'marketing'
        ];

        return {
            project,
            categories: defaultCategories
        };
    } catch (err) {
        if (err instanceof Response) throw err;
        console.error('Failed to load portfolio project:', err);
        throw error(500, 'Failed to load portfolio project');
    }
};

export const actions: Actions = {
    update: async ({ params, request, locals }) => {
        // Create per-request database connection
        const db = createDb();
if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();

        const title = formData.get('title') as string;
        const slug = formData.get('slug') as string;
        const client = formData.get('client') as string;
        const description = formData.get('description') as string;
        const content = formData.get('content') as string;
        const category = formData.get('category') as string;
        const tags = formData.get('tags') as string;
        const year = formData.get('year') as string;
        const featuredImage = formData.get('featuredImage') as string;
        const liveUrl = formData.get('liveUrl') as string;
        const metaTitle = formData.get('metaTitle') as string;
        const metaDescription = formData.get('metaDescription') as string;
        const status = formData.get('status') as 'draft' | 'published' | 'archived';
        const isFeatured = formData.get('isFeatured') === 'true';

        // Validation
        if (!title?.trim()) {
            return fail(400, { error: 'Title is required' });
        }
        if (!slug?.trim()) {
            return fail(400, { error: 'Slug is required' });
        }
        if (!client?.trim()) {
            return fail(400, { error: 'Client is required' });
        }
        if (!content?.trim()) {
            return fail(400, { error: 'Content is required' });
        }
        if (!category?.trim()) {
            return fail(400, { error: 'Category is required' });
        }

        // Parse tags
        const parsedTags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

        // Get current project to check if status is changing to published
        const [currentProject] = await db
            .select({ status: portfolioProjects.status, publishedAt: portfolioProjects.publishedAt })
            .from(portfolioProjects)
            .where(eq(portfolioProjects.id, params.id));

        const publishedAt = status === 'published' && currentProject?.status !== 'published'
            ? new Date()
            : currentProject?.publishedAt;

        try {
            await db.update(portfolioProjects).set({
                title: title.trim(),
                slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
                client: client.trim(),
                description: description?.trim() || null,
                content: content.trim(),
                category: category.trim(),
                tags: parsedTags,
                year: year?.trim() || null,
                featuredImage: featuredImage?.trim() || null,
                liveUrl: liveUrl?.trim() || null,
                metaTitle: metaTitle?.trim() || null,
                metaDescription: metaDescription?.trim() || null,
                status,
                isFeatured,
                publishedAt,
                updatedAt: new Date()
            }).where(eq(portfolioProjects.id, params.id));

            return { success: true };
        } catch (error) {
            console.error('Failed to update portfolio project:', error);

            // Check for unique constraint violation
            if (error instanceof Error && error.message.includes('duplicate')) {
                return fail(400, { error: 'A project with this slug already exists' });
            }

            return fail(500, { error: 'Failed to update project' });
        }
    },

    delete: async ({ params, locals }) => {
        // Create per-request database connection
        const db = createDb();
if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        try {
            await db.delete(portfolioProjects).where(eq(portfolioProjects.id, params.id));
            throw redirect(303, '/admin/portfolio');
        } catch (error) {
            if (error instanceof Response) throw error;
            console.error('Failed to delete portfolio project:', error);
            return fail(500, { error: 'Failed to delete project' });
        }
    }
};
