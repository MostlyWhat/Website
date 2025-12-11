import { createDb } from '$lib/server/db';
import { supportArticles } from '$lib/server/db/schema';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { logActivity, getClientIp } from '$lib/server/utils/activity-logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        redirect(302, '/auth/login');
    }

    // Only admin and staff can access
    const allowedRoles = ['super_admin', 'admin', 'staff'];
    if (!allowedRoles.includes(locals.profile.role)) {
        redirect(302, '/app');
    }

    // Create per-request database connection
    const db = createDb();

    // Get existing categories for suggestions
    let categories: string[] = [];
    try {
        const articles = await db
            .select({ category: supportArticles.category })
            .from(supportArticles);
        categories = [...new Set(articles.map(a => a.category))].sort();
    } catch (error) {
        // Table may not exist yet
    }

    return {
        categories,
        defaultCategories: ['getting-started', 'projects', 'billing', 'account', 'tickets', 'troubleshooting']
    };
};

export const actions: Actions = {
    default: async ({ request, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        const allowedRoles = ['super_admin', 'admin', 'staff'];
        if (!allowedRoles.includes(locals.profile.role)) {
            return fail(403, { error: 'Forbidden' });
        }

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
            return fail(400, { error: 'Title is required', values: { title, slug, excerpt, content, category, audience, tagsInput } });
        }
        if (!slug) {
            return fail(400, { error: 'Slug is required', values: { title, slug, excerpt, content, category, audience, tagsInput } });
        }
        if (!content) {
            return fail(400, { error: 'Content is required', values: { title, slug, excerpt, content, category, audience, tagsInput } });
        }
        if (!category) {
            return fail(400, { error: 'Category is required', values: { title, slug, excerpt, content, category, audience, tagsInput } });
        }
        if (!audience || !['user', 'admin', 'all'].includes(audience)) {
            return fail(400, { error: 'Valid audience is required', values: { title, slug, excerpt, content, category, audience, tagsInput } });
        }

        // Parse tags
        const tags = tagsInput
            .split(',')
            .map(t => t.trim().toLowerCase())
            .filter(Boolean);

        try {
            // Create article
            const [article] = await db
                .insert(supportArticles)
                .values({
                    slug,
                    title,
                    excerpt,
                    content,
                    category: category.toLowerCase().replace(/\s+/g, '-'),
                    tags,
                    audience,
                    isPublished,
                    isFeatured,
                    authorId: locals.profile.id,
                    publishedAt: isPublished ? new Date() : null
                })
                .returning({ id: supportArticles.id });

            // Log activity
            const ipAddress = getClientIp(request);
            const userAgent = request.headers.get('user-agent') || undefined;
            await logActivity({
                performedById: locals.profile.id,
                activityType: 'created',
                entityType: 'user',
                entityId: article.id,
                description: `Created knowledge base article: ${title}`,
                ipAddress,
                userAgent,
                newValues: {
                    title,
                    category,
                    audience,
                    isPublished
                }
            });

            return { success: true, message: 'Knowledge base article created successfully!' };
        } catch (error) {
            if ((error as { status?: number }).status === 302) {
                error;
            }
            console.error('Error creating article:', error);
            return fail(500, { error: 'Failed to create article', values: { title, slug, excerpt, content, category, audience, tagsInput } });
        }
    }
};
