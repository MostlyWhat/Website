import { createDb } from '$lib/server/db';
import { blogPosts } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
        redirect(303, '/admin');
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
        categories: defaultCategories
    };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
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
        const status = formData.get('status') as 'draft' | 'published';
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

        try {
            const [newPost] = await db.insert(blogPosts).values({
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
                status: status || 'draft',
                isFeatured,
                publishedAt: status === 'published' ? new Date() : null,
                authorId: locals.profile.id
            }).returning({ id: blogPosts.id });

            return redirect(303, `/admin/blog/${newPost.id}`);
        } catch (error) {
            // Re-throw redirect errors
            if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
                throw error;
            }

            console.error('Failed to create blog post:', error);

            // Check for unique constraint violation
            if (error instanceof Error && error.message.includes('duplicate')) {
                return fail(400, { error: 'A post with this slug already exists' });
            }

            return fail(500, { error: 'Failed to create blog post' });
        }
    }
};
