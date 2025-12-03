import { db } from '$lib/server/db';
import { slaPolicies, profiles } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { slaActivity, getClientIp } from '$lib/server/activity-logger';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        throw redirect(302, '/auth/login');
    }

    // Require admin/super_admin role
    if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
        throw redirect(302, '/admin');
    }

    // Fetch all SLA policies
    const policies = await db
        .select({
            id: slaPolicies.id,
            name: slaPolicies.name,
            description: slaPolicies.description,
            urgentResponseHours: slaPolicies.urgentResponseHours,
            urgentResolutionHours: slaPolicies.urgentResolutionHours,
            highResponseHours: slaPolicies.highResponseHours,
            highResolutionHours: slaPolicies.highResolutionHours,
            mediumResponseHours: slaPolicies.mediumResponseHours,
            mediumResolutionHours: slaPolicies.mediumResolutionHours,
            lowResponseHours: slaPolicies.lowResponseHours,
            lowResolutionHours: slaPolicies.lowResolutionHours,
            businessHoursOnly: slaPolicies.businessHoursOnly,
            businessHoursStart: slaPolicies.businessHoursStart,
            businessHoursEnd: slaPolicies.businessHoursEnd,
            businessDays: slaPolicies.businessDays,
            isDefault: slaPolicies.isDefault,
            isActive: slaPolicies.isActive,
            createdAt: slaPolicies.createdAt,
            createdById: slaPolicies.createdById,
            createdByName: profiles.displayName
        })
        .from(slaPolicies)
        .leftJoin(profiles, eq(slaPolicies.createdById, profiles.id))
        .orderBy(desc(slaPolicies.isDefault), slaPolicies.name);

    return { policies };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const isDefault = formData.get('isDefault') === 'true';

        // Response times
        const urgentResponseHours = parseInt(formData.get('urgentResponseHours') as string) || 1;
        const highResponseHours = parseInt(formData.get('highResponseHours') as string) || 4;
        const mediumResponseHours = parseInt(formData.get('mediumResponseHours') as string) || 8;
        const lowResponseHours = parseInt(formData.get('lowResponseHours') as string) || 24;

        // Resolution times
        const urgentResolutionHours = parseInt(formData.get('urgentResolutionHours') as string) || 4;
        const highResolutionHours = parseInt(formData.get('highResolutionHours') as string) || 8;
        const mediumResolutionHours = parseInt(formData.get('mediumResolutionHours') as string) || 24;
        const lowResolutionHours = parseInt(formData.get('lowResolutionHours') as string) || 72;

        // Business hours
        const businessHoursOnly = formData.get('businessHoursOnly') === 'true';
        const businessHoursStart = parseInt(formData.get('businessHoursStart') as string) || 9;
        const businessHoursEnd = parseInt(formData.get('businessHoursEnd') as string) || 17;

        if (!name?.trim()) {
            return fail(400, { error: 'Policy name is required' });
        }

        // If setting as default, unset other defaults
        if (isDefault) {
            await db
                .update(slaPolicies)
                .set({ isDefault: false, updatedAt: new Date() })
                .where(eq(slaPolicies.isDefault, true));
        }

        const [created] = await db.insert(slaPolicies).values({
            name: name.trim(),
            description: description?.trim() || null,
            urgentResponseHours,
            urgentResolutionHours,
            highResponseHours,
            highResolutionHours,
            mediumResponseHours,
            mediumResolutionHours,
            lowResponseHours,
            lowResolutionHours,
            businessHoursOnly,
            businessHoursStart,
            businessHoursEnd,
            isDefault,
            createdById: locals.profile.id
        }).returning({ id: slaPolicies.id });

        // Log activity
        await slaActivity.created(created.id, name.trim(), locals.profile.id, getClientIp(request));

        return { success: true, message: 'SLA policy created' };
    },

    update: async ({ request, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;
        const isDefault = formData.get('isDefault') === 'true';
        const isActive = formData.get('isActive') === 'true';

        // Response times
        const urgentResponseHours = parseInt(formData.get('urgentResponseHours') as string) || 1;
        const highResponseHours = parseInt(formData.get('highResponseHours') as string) || 4;
        const mediumResponseHours = parseInt(formData.get('mediumResponseHours') as string) || 8;
        const lowResponseHours = parseInt(formData.get('lowResponseHours') as string) || 24;

        // Resolution times
        const urgentResolutionHours = parseInt(formData.get('urgentResolutionHours') as string) || 4;
        const highResolutionHours = parseInt(formData.get('highResolutionHours') as string) || 8;
        const mediumResolutionHours = parseInt(formData.get('mediumResolutionHours') as string) || 24;
        const lowResolutionHours = parseInt(formData.get('lowResolutionHours') as string) || 72;

        // Business hours
        const businessHoursOnly = formData.get('businessHoursOnly') === 'true';
        const businessHoursStart = parseInt(formData.get('businessHoursStart') as string) || 9;
        const businessHoursEnd = parseInt(formData.get('businessHoursEnd') as string) || 17;

        if (!id || !name?.trim()) {
            return fail(400, { error: 'Policy ID and name are required' });
        }

        // Get old values for logging
        const [oldPolicy] = await db.select().from(slaPolicies).where(eq(slaPolicies.id, id));

        // If setting as default, unset other defaults
        if (isDefault) {
            await db
                .update(slaPolicies)
                .set({ isDefault: false, updatedAt: new Date() })
                .where(eq(slaPolicies.isDefault, true));
        }

        await db
            .update(slaPolicies)
            .set({
                name: name.trim(),
                description: description?.trim() || null,
                urgentResponseHours,
                urgentResolutionHours,
                highResponseHours,
                highResolutionHours,
                mediumResponseHours,
                mediumResolutionHours,
                lowResponseHours,
                lowResolutionHours,
                businessHoursOnly,
                businessHoursStart,
                businessHoursEnd,
                isDefault,
                isActive,
                updatedAt: new Date()
            })
            .where(eq(slaPolicies.id, id));

        // Build changes object for meaningful logging
        const changes: Record<string, { old: unknown; new: unknown }> = {};
        if (oldPolicy?.name !== name.trim()) changes.name = { old: oldPolicy?.name, new: name.trim() };
        if (oldPolicy?.isDefault !== isDefault) changes.isDefault = { old: oldPolicy?.isDefault, new: isDefault };
        if (oldPolicy?.isActive !== isActive) changes.isActive = { old: oldPolicy?.isActive, new: isActive };
        if (Object.keys(changes).length > 0) {
            await slaActivity.updated(id, name.trim(), changes, locals.profile.id, getClientIp(request));
        }

        return { success: true, message: 'SLA policy updated' };
    },


    delete: async ({ request, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'Policy ID is required' });
        }

        // Get policy name for logging
        const [policy] = await db.select({ name: slaPolicies.name }).from(slaPolicies).where(eq(slaPolicies.id, id));

        await db.delete(slaPolicies).where(eq(slaPolicies.id, id));

        // Log activity
        await slaActivity.deleted(id, policy?.name ?? 'Unknown', locals.profile.id, getClientIp(request));

        return { success: true, message: 'SLA policy deleted' };
    },

    setDefault: async ({ request, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'Policy ID is required' });
        }

        // Get policy name for logging
        const [policy] = await db.select({ name: slaPolicies.name }).from(slaPolicies).where(eq(slaPolicies.id, id));

        // Unset current default
        await db
            .update(slaPolicies)
            .set({ isDefault: false, updatedAt: new Date() })
            .where(eq(slaPolicies.isDefault, true));

        // Set new default
        await db
            .update(slaPolicies)
            .set({ isDefault: true, updatedAt: new Date() })
            .where(eq(slaPolicies.id, id));

        // Log activity
        await slaActivity.setDefault(id, policy?.name ?? 'Unknown', locals.profile.id, getClientIp(request));

        return { success: true, message: 'Default SLA policy updated' };
    }
};

