import { createDb } from '$lib/server/db';
import { supportArticles, profiles } from '$lib/server/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user || !locals.profile) {
        throw redirect(302, '/auth/login');
    }

    // Only admin and staff can access
    const allowedRoles = ['super_admin', 'admin', 'staff'];
    if (!allowedRoles.includes(locals.profile.role)) {
        throw redirect(302, '/app');
    }

    const audienceFilter = url.searchParams.get('audience');
    const categoryFilter = url.searchParams.get('category');

    // Create per-request database connection
    const db = createDb();

    try {
        // Build query
        let query = db
            .select({
                id: supportArticles.id,
                slug: supportArticles.slug,
                title: supportArticles.title,
                excerpt: supportArticles.excerpt,
                category: supportArticles.category,
                audience: supportArticles.audience,
                isPublished: supportArticles.isPublished,
                isFeatured: supportArticles.isFeatured,
                viewCount: supportArticles.viewCount,
                helpfulCount: supportArticles.helpfulCount,
                notHelpfulCount: supportArticles.notHelpfulCount,
                createdAt: supportArticles.createdAt,
                updatedAt: supportArticles.updatedAt,
                authorId: supportArticles.authorId
            })
            .from(supportArticles)
            .orderBy(desc(supportArticles.updatedAt));

        const articles = await query;

        // Apply filters in memory for now (can be optimized with proper where clauses)
        let filteredArticles = articles;
        if (audienceFilter && audienceFilter !== 'all') {
            filteredArticles = filteredArticles.filter(a => a.audience === audienceFilter);
        }
        if (categoryFilter) {
            filteredArticles = filteredArticles.filter(a => a.category === categoryFilter);
        }

        // Get unique categories
        const categories = [...new Set(articles.map(a => a.category))].sort();

        // Get stats
        const totalArticles = articles.length;
        const publishedArticles = articles.filter(a => a.isPublished).length;
        const userArticles = articles.filter(a => a.audience === 'user').length;
        const adminArticles = articles.filter(a => a.audience === 'admin').length;

        return {
            articles: filteredArticles,
            categories,
            stats: {
                total: totalArticles,
                published: publishedArticles,
                userArticles,
                adminArticles
            },
            filters: {
                audience: audienceFilter ?? 'all',
                category: categoryFilter ?? ''
            }
        };
    } catch (error) {
        console.warn('Support articles table not available:', error);
        return {
            articles: [],
            categories: [],
            stats: { total: 0, published: 0, userArticles: 0, adminArticles: 0 },
            filters: { audience: 'all', category: '' }
        };
    }
};

export const actions: Actions = {
    delete: async ({ request, locals }) => {
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        const allowedRoles = ['super_admin', 'admin'];
        if (!allowedRoles.includes(locals.profile.role)) {
            return fail(403, { error: 'Forbidden' });
        }

        const formData = await request.formData();
        const articleId = formData.get('articleId')?.toString();

        if (!articleId) {
            return fail(400, { error: 'Article ID required' });
        }

        // Create per-request database connection
        const db = createDb();

        try {
            await db.delete(supportArticles).where(eq(supportArticles.id, articleId));
            return { success: true };
        } catch (error) {
            console.error('Error deleting article:', error);
            return fail(500, { error: 'Failed to delete article' });
        }
    },

    togglePublish: async ({ request, locals }) => {
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const articleId = formData.get('articleId')?.toString();
        const currentStatus = formData.get('isPublished') === 'true';

        if (!articleId) {
            return fail(400, { error: 'Article ID required' });
        }

        // Create per-request database connection
        const db = createDb();

        try {
            await db
                .update(supportArticles)
                .set({
                    isPublished: !currentStatus,
                    publishedAt: !currentStatus ? new Date() : null,
                    updatedAt: new Date()
                })
                .where(eq(supportArticles.id, articleId));
            return { success: true };
        } catch (error) {
            console.error('Error toggling publish:', error);
            return fail(500, { error: 'Failed to update article' });
        }
    }
};
