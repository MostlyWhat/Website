import { createDb } from '$lib/server/db';
import { blogPosts, profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { fail, redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const db = createDb();
    if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
        throw redirect(303, '/admin');
    }

    try {
        const [post] = await db
            .select({
                id: blogPosts.id,
                slug: blogPosts.slug,
                title: blogPosts.title,
                excerpt: blogPosts.excerpt,
                content: blogPosts.content,
                category: blogPosts.category,
                tags: blogPosts.tags,
                featuredImage: blogPosts.featuredImage,
                metaTitle: blogPosts.metaTitle,
                metaDescription: blogPosts.metaDescription,
                readTime: blogPosts.readTime,
                status: blogPosts.status,
                isFeatured: blogPosts.isFeatured,
                publishedAt: blogPosts.publishedAt,
                viewCount: blogPosts.viewCount,
                createdAt: blogPosts.createdAt,
                updatedAt: blogPosts.updatedAt,
                authorId: blogPosts.authorId,
                authorName: profiles.displayName,
                authorEmail: profiles.email
            })
            .from(blogPosts)
            .leftJoin(profiles, eq(blogPosts.authorId, profiles.id))
            .where(eq(blogPosts.id, params.id));

        if (!post) {
            throw error(404, 'Blog post not found');
        }

        // Default categories for blog posts
        const defaultCategories = [
            'development',
            'design',
            'technology',
            'business',
            'tutorials',
            'case-studies',
            'announcements'
        ];

        return {
            post,
            categories: defaultCategories
        };
    } catch (err) {
        if (err instanceof Response) throw err;
        console.error('Failed to load blog post:', err);
        throw error(500, 'Failed to load blog post');
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
        const excerpt = formData.get('excerpt') as string;
        const content = formData.get('content') as string;
        const category = formData.get('category') as string;
        const tags = formData.get('tags') as string;
        const featuredImage = formData.get('featuredImage') as string;
        const metaTitle = formData.get('metaTitle') as string;
        const metaDescription = formData.get('metaDescription') as string;
        const readTime = formData.get('readTime') as string;
        const status = formData.get('status') as 'draft' | 'published' | 'archived';
        const isFeatured = formData.get('isFeatured') === 'true';

        // Validation
        if (!title?.trim()) {
            return fail(400, { error: 'Title is required' });
        }
        if (!slug?.trim()) {
            return fail(400, { error: 'Slug is required' });
        }
        if (!content?.trim()) {
            return fail(400, { error: 'Content is required' });
        }
        if (!category?.trim()) {
            return fail(400, { error: 'Category is required' });
        }

        // Parse tags
        const parsedTags = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [];

        // Get current post to check if status is changing to published
        const [currentPost] = await db
            .select({ status: blogPosts.status, publishedAt: blogPosts.publishedAt })
            .from(blogPosts)
            .where(eq(blogPosts.id, params.id));

        const publishedAt = status === 'published' && currentPost?.status !== 'published'
            ? new Date()
            : currentPost?.publishedAt;

        try {
            await db.update(blogPosts).set({
                title: title.trim(),
                slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
                excerpt: excerpt?.trim() || null,
                content: content.trim(),
                category: category.trim(),
                tags: parsedTags,
                featuredImage: featuredImage?.trim() || null,
                metaTitle: metaTitle?.trim() || null,
                metaDescription: metaDescription?.trim() || null,
                readTime: readTime?.trim() || '5 min read',
                status,
                isFeatured,
                publishedAt,
                updatedAt: new Date()
            }).where(eq(blogPosts.id, params.id));

            return { success: true };
        } catch (error) {
            console.error('Failed to update blog post:', error);

            // Check for unique constraint violation
            if (error instanceof Error && error.message.includes('duplicate')) {
                return fail(400, { error: 'A post with this slug already exists' });
            }

            return fail(500, { error: 'Failed to update blog post' });
        }
    },

    delete: async ({ params, locals }) => {
        // Create per-request database connection
        const db = createDb();
if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
            return fail(403, { error: 'Unauthorized' });
        }

        try {
            await db.delete(blogPosts).where(eq(blogPosts.id, params.id));
            throw redirect(303, '/admin/blog');
        } catch (error) {
            if (error instanceof Response) throw error;
            console.error('Failed to delete blog post:', error);
            return fail(500, { error: 'Failed to delete blog post' });
        }
    }
};
