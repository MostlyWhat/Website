import { createDb } from '$lib/server/db';
import { cannedResponses, profiles } from '$lib/server/db/schema';
import { eq, desc, or } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { cannedResponseActivity, getClientIp } from '$lib/server/activity-logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        throw redirect(302, '/auth/login');
    }

    // Verify admin/staff role
    if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        throw error(403, 'Access denied');
    }

    // Create per-request database connection
    const db = createDb();

    // Fetch all canned responses (global + user's own)
    const responses = await db
        .select({
            id: cannedResponses.id,
            title: cannedResponses.title,
            shortcut: cannedResponses.shortcut,
            content: cannedResponses.content,
            category: cannedResponses.category,
            isGlobal: cannedResponses.isGlobal,
            usageCount: cannedResponses.usageCount,
            lastUsedAt: cannedResponses.lastUsedAt,
            createdAt: cannedResponses.createdAt,
            createdById: cannedResponses.createdById,
            createdByName: profiles.displayName
        })
        .from(cannedResponses)
        .leftJoin(profiles, eq(cannedResponses.createdById, profiles.id))
        .where(
            or(
                eq(cannedResponses.isGlobal, true),
                eq(cannedResponses.createdById, locals.profile.id)
            )
        )
        .orderBy(desc(cannedResponses.usageCount), cannedResponses.title);

    // Get unique categories
    const categories = [...new Set(responses.map(r => r.category).filter(Boolean))] as string[];

    return {
        responses: responses.map(r => ({
            ...r,
            createdBy: r.createdByName ?? 'Unknown',
            isOwn: r.createdById === locals.profile?.id
        })),
        categories
    };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const shortcut = formData.get('shortcut') as string;
        const content = formData.get('content') as string;
        const category = formData.get('category') as string;
        const isGlobal = formData.get('isGlobal') === 'true';

        if (!title?.trim() || !content?.trim()) {
            return fail(400, { error: 'Title and content are required' });
        }

        // Only admins can create global responses
        const canCreateGlobal = ['admin', 'super_admin'].includes(locals.profile.role ?? '');

        // Create per-request database connection
        const db = createDb();

        const [created] = await db.insert(cannedResponses).values({
            title: title.trim(),
            shortcut: shortcut?.trim() || null,
            content: content.trim(),
            category: category?.trim() || null,
            isGlobal: canCreateGlobal ? isGlobal : false,
            createdById: locals.profile.id
        }).returning({ id: cannedResponses.id });

        // Log activity
        await cannedResponseActivity.created(created.id, title.trim(), locals.profile.id, getClientIp(request));

        return { success: true, message: 'Canned response created successfully' };
    },

    update: async ({ request, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const title = formData.get('title') as string;
        const shortcut = formData.get('shortcut') as string;
        const content = formData.get('content') as string;
        const category = formData.get('category') as string;
        const isGlobal = formData.get('isGlobal') === 'true';

        if (!id || !title?.trim() || !content?.trim()) {
            return fail(400, { error: 'ID, title, and content are required' });
        }

        // Create per-request database connection
        const db = createDb();

        // Check ownership or admin status
        const [existing] = await db
            .select({ createdById: cannedResponses.createdById, title: cannedResponses.title })
            .from(cannedResponses)
            .where(eq(cannedResponses.id, id))
            .limit(1);

        if (!existing) {
            return fail(404, { error: 'Response not found' });
        }

        const isAdmin = ['admin', 'super_admin'].includes(locals.profile.role ?? '');
        const isOwner = existing.createdById === locals.profile.id;

        if (!isAdmin && !isOwner) {
            return fail(403, { error: 'You can only edit your own responses' });
        }

        await db
            .update(cannedResponses)
            .set({
                title: title.trim(),
                shortcut: shortcut?.trim() || null,
                content: content.trim(),
                category: category?.trim() || null,
                isGlobal: isAdmin ? isGlobal : false,
                updatedAt: new Date()
            })
            .where(eq(cannedResponses.id, id));

        // Log activity
        await cannedResponseActivity.updated(id, title.trim(), locals.profile.id, getClientIp(request));

        return { success: true, message: 'Canned response updated successfully' };
    },

    delete: async ({ request, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'ID is required' });
        }

        // Create per-request database connection
        const db = createDb();

        // Check ownership or admin status
        const [existing] = await db
            .select({ createdById: cannedResponses.createdById, title: cannedResponses.title })
            .from(cannedResponses)
            .where(eq(cannedResponses.id, id))
            .limit(1);

        if (!existing) {
            return fail(404, { error: 'Response not found' });
        }

        const isAdmin = ['admin', 'super_admin'].includes(locals.profile.role ?? '');
        const isOwner = existing.createdById === locals.profile.id;

        if (!isAdmin && !isOwner) {
            return fail(403, { error: 'You can only delete your own responses' });
        }

        await db.delete(cannedResponses).where(eq(cannedResponses.id, id));

        // Log activity
        await cannedResponseActivity.deleted(id, existing.title, locals.profile.id, getClientIp(request));

        return { success: true, message: 'Canned response deleted successfully' };
    }
};
