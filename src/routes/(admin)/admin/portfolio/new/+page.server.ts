import { createDb } from '$lib/server/db';
import { portfolioProjects } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { logActivity, getClientIp } from '$lib/server/activity-logger';

// Calculate read time based on word count
function calculateReadTime(content: string): string {
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
}

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.profile || !['super_admin', 'admin'].includes(locals.profile.role)) {
        redirect(303, '/admin');
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
        const status = formData.get('status') as 'draft' | 'published';
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

        const ipAddress = getClientIp(request);

        try {
            const [newProject] = await db.insert(portfolioProjects).values({
                title: title.trim(),
                slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
                client: client.trim(),
                description: description?.trim() || null,
                content: content.trim(),
                category: category.trim(),
                tags: parsedTags,
                year: year?.trim() || new Date().getFullYear().toString(),
                featuredImage: featuredImage?.trim() || null,
                liveUrl: liveUrl?.trim() || null,
                metaTitle: metaTitle?.trim() || null,
                metaDescription: metaDescription?.trim() || null,
                status: status || 'draft',
                isFeatured,
                publishedAt: status === 'published' ? new Date() : null,
                createdById: locals.profile.id
            }).returning({ id: portfolioProjects.id, title: portfolioProjects.title, slug: portfolioProjects.slug });

            // Log activity
            await logActivity({
                entityType: 'user',
                entityId: newProject.id,
                activityType: 'created',
                description: `Portfolio project "${newProject.title}" was created`,
                newValues: {
                    title: newProject.title,
                    slug: newProject.slug,
                    client: client.trim(),
                    status,
                    category
                },
                performedById: locals.profile.id,
                ipAddress
            });

            return { success: true, message: 'Portfolio project created successfully!' };
        } catch (error) {
            // Re-throw redirect errors
            if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
                throw error;
            }

            console.error('Failed to create portfolio project:', error);

            // Check for unique constraint violation
            if (error instanceof Error && error.message.includes('duplicate')) {
                return fail(400, { error: 'A project with this slug already exists' });
            }

            return fail(500, { error: 'Failed to create project' });
        }
    }
};
