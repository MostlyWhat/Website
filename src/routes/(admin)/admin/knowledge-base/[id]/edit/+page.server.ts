import { createDb } from '$lib/server/db';
import { supportArticles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, params }) => {
    if (!locals.user || !locals.profile) {
        redirect(302, '/auth/login');
    }

    // Only admin and staff can access
    const allowedRoles = ['super_admin', 'admin', 'staff'];
    if (!allowedRoles.includes(locals.profile.role)) {
        redirect(302, '/app');
    }

    const { id } = params;

    // Create per-request database connection
    const db = createDb();

    try {
        // Get the article
        const [article] = await db
            .select()
            .from(supportArticles)
            .where(eq(supportArticles.id, id))
            .limit(1);

        if (!article) {
            error(404, 'Article not found');
        }

        // Get existing categories for suggestions
        const articles = await db
            .select({ category: supportArticles.category })
            .from(supportArticles);
        const categories = [...new Set(articles.map(a => a.category))].sort();

        return {
            article,
            categories,
            defaultCategories: ['getting-started', 'projects', 'billing', 'account', 'tickets', 'troubleshooting']
        };
    } catch (err) {
        if ((err as { status?: number }).status === 404) {
            throw err;
        }
        console.error('Error loading article:', err);
        error(500, 'Failed to load article');
    }
};

export const actions: Actions = {
    default: async ({ request, locals, params }) => {
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        const allowedRoles = ['super_admin', 'admin', 'staff'];
        if (!allowedRoles.includes(locals.profile.role)) {
            return fail(403, { error: 'Forbidden' });
        }

        const { id } = params;
        const formData = await request.formData();
        const title = formData.get('title')?.toString().trim();
        const slug = formData.get('slug')?.toString().trim();
        const excerpt = formData.get('excerpt')?.toString().trim() || null;
        const content = formData.get('content')?.toString().trim();
        const category = formData.get('category')?.toString().trim();
        const audience = formData.get('audience')?.toString() as 'user' | 'admin' | 'all';
        const isPublished = formData.get('isPublished') === 'on';
        const isFeatured = formData.get('isFeatured') === 'on';
        const tagsInput = formData.get('tags')?.toString().trim() || '';

        // Validation
        if (!title) {
            return fail(400, { error: 'Title is required' });
        }
        if (!slug) {
            return fail(400, { error: 'Slug is required' });
        }
        if (!content) {
            return fail(400, { error: 'Content is required' });
        }
        if (!category) {
            return fail(400, { error: 'Category is required' });
        }
        if (!audience || !['user', 'admin', 'all'].includes(audience)) {
            return fail(400, { error: 'Valid audience is required' });
        }

        // Parse tags
        const tags = tagsInput
            .split(',')
            .map(t => t.trim().toLowerCase())
            .filter(Boolean);

        // Create per-request database connection
        const db = createDb();

        try {
            // Get current article to check publish status
            const [current] = await db
                .select({ isPublished: supportArticles.isPublished, publishedAt: supportArticles.publishedAt })
                .from(supportArticles)
                .where(eq(supportArticles.id, id))
                .limit(1);

            // Determine publishedAt
            let publishedAt = current?.publishedAt;
            if (isPublished && !current?.isPublished) {
                publishedAt = new Date();
            } else if (!isPublished) {
                publishedAt = null;
            }

            // Update article
            await db
                .update(supportArticles)
                .set({
                    slug,
                    title,
                    excerpt,
                    content,
                    category: category.toLowerCase().replace(/\s+/g, '-'),
                    tags,
                    audience,
                    isPublished,
                    isFeatured,
                    publishedAt,
                    updatedAt: new Date()
                })
                .where(eq(supportArticles.id, id));

            redirect(302, '/admin/knowledge-base');
        } catch (err) {
            if ((err as { status?: number }).status === 302) {
                throw err;
            }
            console.error('Error updating article:', err);
            return fail(500, { error: 'Failed to update article' });
        }
    }
};
