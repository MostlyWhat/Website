import { db } from '$lib/server/db';
import { blogPosts, profiles } from '$lib/server/db/schema';
import { eq, desc, ilike, and, or } from 'drizzle-orm';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ url, locals }) => {
    if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
        return { posts: [], filters: {} };
    }

    const status = url.searchParams.get('status') ?? 'all';
    const category = url.searchParams.get('category') ?? '';

    try {
        // Build where conditions
        const conditions = [];

        if (status !== 'all') {
            conditions.push(eq(blogPosts.status, status as 'draft' | 'published' | 'archived'));
        }

        if (category) {
            conditions.push(eq(blogPosts.category, category));
        }

        const posts = await db
            .select({
                id: blogPosts.id,
                slug: blogPosts.slug,
                title: blogPosts.title,
                excerpt: blogPosts.excerpt,
                category: blogPosts.category,
                status: blogPosts.status,
                isFeatured: blogPosts.isFeatured,
                publishedAt: blogPosts.publishedAt,
                viewCount: blogPosts.viewCount,
                readTime: blogPosts.readTime,
                createdAt: blogPosts.createdAt,
                updatedAt: blogPosts.updatedAt,
                authorName: profiles.displayName,
                authorEmail: profiles.email
            })
            .from(blogPosts)
            .leftJoin(profiles, eq(blogPosts.authorId, profiles.id))
            .where(conditions.length > 0 ? and(...conditions) : undefined)
            .orderBy(desc(blogPosts.createdAt));

        // Get unique categories for filter
        const allPosts = await db
            .selectDistinct({ category: blogPosts.category })
            .from(blogPosts);

        const categories = allPosts.map(p => p.category).filter(Boolean);

        return {
            posts,
            categories,
            filters: { status, category }
        };
    } catch (error) {
        console.warn('Blog posts table not available:', error);
        return { posts: [], categories: [], filters: { status, category } };
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
            return fail(400, { error: 'Post ID is required' });
        }

        try {
            await db.delete(blogPosts).where(eq(blogPosts.id, id));
            return { success: true };
        } catch (error) {
            console.error('Failed to delete blog post:', error);
            return fail(500, { error: 'Failed to delete blog post' });
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
            return fail(400, { error: 'Post ID is required' });
        }

        try {
            await db
                .update(blogPosts)
                .set({ isFeatured: !isFeatured, updatedAt: new Date() })
                .where(eq(blogPosts.id, id));
            return { success: true };
        } catch (error) {
            console.error('Failed to toggle featured:', error);
            return fail(500, { error: 'Failed to update post' });
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
            return fail(400, { error: 'Post ID is required' });
        }

        // Toggle between draft and published
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        const publishedAt = newStatus === 'published' ? new Date() : null;

        try {
            await db
                .update(blogPosts)
                .set({
                    status: newStatus,
                    publishedAt,
                    updatedAt: new Date()
                })
                .where(eq(blogPosts.id, id));
            return { success: true };
        } catch (error) {
            console.error('Failed to toggle status:', error);
            return fail(500, { error: 'Failed to update post' });
        }
    }
};
