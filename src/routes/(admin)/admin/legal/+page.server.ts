import { createDb } from '$lib/server/db';
import { legalPages, profiles } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { logActivity, getClientIp } from '$lib/server/utils/activity-logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        redirect(302, '/auth/login');
    }

    // Only super_admin and admin can manage legal pages
    if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
        redirect(302, '/admin');
    }

    const db = createDb();

    const pages = await db
        .select({
            id: legalPages.id,
            slug: legalPages.slug,
            title: legalPages.title,
            summary: legalPages.summary,
            version: legalPages.version,
            effectiveDate: legalPages.effectiveDate,
            lastReviewedAt: legalPages.lastReviewedAt,
            isPublished: legalPages.isPublished,
            sortOrder: legalPages.sortOrder,
            lastEditedById: legalPages.lastEditedById,
            lastEditedByName: profiles.displayName,
            createdAt: legalPages.createdAt,
            updatedAt: legalPages.updatedAt
        })
        .from(legalPages)
        .leftJoin(profiles, eq(legalPages.lastEditedById, profiles.id))
        .orderBy(legalPages.sortOrder, legalPages.title);

    return { pages };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const slug = formData.get('slug') as string;
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const summary = formData.get('summary') as string;
        const version = formData.get('version') as string;
        const effectiveDate = formData.get('effectiveDate') as string;
        const isPublished = formData.get('isPublished') === 'true';
        const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;

        if (!slug || !title || !content || !effectiveDate) {
            return fail(400, { error: 'Missing required fields' });
        }

        try {
            const [page] = await db
                .insert(legalPages)
                .values({
                    slug: slug.trim(),
                    title: title.trim(),
                    content: content.trim(),
                    summary: summary?.trim() || null,
                    version: version?.trim() || '1.0',
                    effectiveDate: new Date(effectiveDate),
                    isPublished,
                    sortOrder,
                    lastEditedById: locals.profile.id
                })
                .returning({ id: legalPages.id });

            await logActivity({
                performedById: locals.profile.id,
                activityType: 'created',
                entityType: 'legal_page',
                entityId: page.id,
                description: `Created legal page: ${title}`,
                ipAddress: getClientIp(request),
                userAgent: request.headers.get('user-agent') || undefined,
                newValues: { slug, title, version }
            });

            return { success: true, message: 'Legal page created successfully!' };
        } catch (error) {
            console.error('Error creating legal page:', error);
            return fail(500, { error: 'Failed to create legal page' });
        }
    },

    update: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const summary = formData.get('summary') as string;
        const version = formData.get('version') as string;
        const effectiveDate = formData.get('effectiveDate') as string;
        const isPublished = formData.get('isPublished') === 'true';
        const sortOrder = parseInt(formData.get('sortOrder') as string) || 0;

        if (!id || !title || !content || !effectiveDate) {
            return fail(400, { error: 'Missing required fields' });
        }

        try {
            await db
                .update(legalPages)
                .set({
                    title: title.trim(),
                    content: content.trim(),
                    summary: summary?.trim() || null,
                    version: version?.trim() || '1.0',
                    effectiveDate: new Date(effectiveDate),
                    lastReviewedAt: new Date(),
                    isPublished,
                    sortOrder,
                    lastEditedById: locals.profile.id,
                    updatedAt: new Date()
                })
                .where(eq(legalPages.id, id));

            await logActivity({
                performedById: locals.profile.id,
                activityType: 'updated',
                entityType: 'legal_page',
                entityId: id,
                description: `Updated legal page: ${title}`,
                ipAddress: getClientIp(request),
                userAgent: request.headers.get('user-agent') || undefined,
                newValues: { title, version }
            });

            return { success: true, message: 'Legal page updated successfully!' };
        } catch (error) {
            console.error('Error updating legal page:', error);
            return fail(500, { error: 'Failed to update legal page' });
        }
    },

    delete: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'Page ID required' });
        }

        try {
            const [page] = await db
                .select({ title: legalPages.title })
                .from(legalPages)
                .where(eq(legalPages.id, id));

            await db.delete(legalPages).where(eq(legalPages.id, id));

            await logActivity({
                performedById: locals.profile.id,
                activityType: 'deleted',
                entityType: 'legal_page',
                entityId: id,
                description: `Deleted legal page: ${page?.title}`,
                ipAddress: getClientIp(request),
                userAgent: request.headers.get('user-agent') || undefined
            });

            return { success: true, message: 'Legal page deleted successfully!' };
        } catch (error) {
            console.error('Error deleting legal page:', error);
            return fail(500, { error: 'Failed to delete legal page' });
        }
    },

    togglePublish: async ({ request, locals }) => {
        const db = createDb();
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const isPublished = formData.get('isPublished') === 'true';

        if (!id) {
            return fail(400, { error: 'Page ID required' });
        }

        try {
            const [page] = await db
                .select({ title: legalPages.title })
                .from(legalPages)
                .where(eq(legalPages.id, id));

            await db
                .update(legalPages)
                .set({ isPublished: !isPublished, updatedAt: new Date() })
                .where(eq(legalPages.id, id));

            await logActivity({
                performedById: locals.profile.id,
                activityType: 'updated',
                entityType: 'legal_page',
                entityId: id,
                description: `${!isPublished ? 'Published' : 'Unpublished'} legal page: ${page?.title}`,
                ipAddress: getClientIp(request),
                userAgent: request.headers.get('user-agent') || undefined,
                newValues: { isPublished: !isPublished }
            });

            return { success: true, message: `Page ${!isPublished ? 'published' : 'unpublished'} successfully!` };
        } catch (error) {
            console.error('Error toggling publish status:', error);
            return fail(500, { error: 'Failed to update page' });
        }
    }
};
