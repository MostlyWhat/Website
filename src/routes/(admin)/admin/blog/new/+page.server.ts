import { createDb } from '$lib/server/db';
import { blogPosts } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { logActivity, getClientIp } from '$lib/server/utils/activity-logger';

// Calculate read time based on word count (average 200 words per minute)
function calculateReadTime(content: string): string {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
}

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

        const ipAddress = getClientIp(request);

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

        // Calculate read time if not provided
        const calculatedReadTime = readTime?.trim() || calculateReadTime(content);

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
                readTime: calculatedReadTime,
                status: status || 'draft',
                isFeatured,
                publishedAt: status === 'published' ? new Date() : null,
                authorId: locals.profile.id
            }).returning({ id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug });

            // Log activity
            await logActivity({
                entityType: 'user', // Using 'user' as blog isn't in entity types
                entityId: newPost.id,
                activityType: 'created',
                description: `Blog post "${newPost.title}" was created`,
                newValues: {
                    title: newPost.title,
                    slug: newPost.slug,
                    status,
                    category
                },
                performedById: locals.profile.id,
                ipAddress
            });

            return { success: true, message: 'Blog post created successfully!' };
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
