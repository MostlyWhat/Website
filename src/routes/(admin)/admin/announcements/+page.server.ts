import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { announcements, staffGroups, organizations, profiles } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { logActivity } from '$lib/server/activity-logger';

export const load: PageServerLoad = async ({ locals }) => {
    // Only super_admin can manage announcements
    if (locals.profile?.role !== 'super_admin' && locals.profile?.role !== 'admin') {
        throw redirect(303, '/admin');
    }

    const [allAnnouncements, allProfiles, allStaffGroups, allOrganizations] = await Promise.all([
        db.select().from(announcements).orderBy(desc(announcements.createdAt)),
        db.select({
            id: profiles.id,
            email: profiles.email,
            displayName: profiles.displayName
        })
            .from(profiles),
        db.select().from(staffGroups).orderBy(staffGroups.name),
        db.select().from(organizations).orderBy(organizations.name)
    ]);

    return {
        announcements: allAnnouncements,
        users: allProfiles,
        staffGroups: allStaffGroups,
        organizations: allOrganizations
    };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (locals.profile?.role !== 'super_admin' && locals.profile?.role !== 'admin') {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const title = formData.get('title') as string;
        const message = formData.get('content') as string || '';
        const type = formData.get('type') as string || 'info';
        const dismissible = formData.get('isDismissible') === 'true';
        const endsAt = formData.get('expiresAt') as string;
        const targetType = formData.get('targetType') as string || 'all';
        const targetIds = formData.getAll('targetIds') as string[];

        if (!title) {
            return fail(400, { error: 'Title is required' });
        }

        // Build target based on targetType
        let targetUserId: string | null = null;
        let targetStaffGroupId: string | null = null;
        let targetOrganizationId: string | null = null;
        let targetRoles: string[] | null = null;

        if (targetType === 'users' && targetIds.length > 0) {
            targetUserId = targetIds[0]; // Single user
        } else if (targetType === 'staff_groups' && targetIds.length > 0) {
            targetStaffGroupId = targetIds[0]; // Single group
        } else if (targetType === 'organizations' && targetIds.length > 0) {
            targetOrganizationId = targetIds[0]; // Single org
        }

        const [newAnnouncement] = await db.insert(announcements).values({
            title,
            message,
            type,
            dismissible,
            endsAt: endsAt ? new Date(endsAt) : null,
            targetUserId,
            targetStaffGroupId,
            targetOrganizationId,
            targetRoles,
            createdById: locals.user!.id
        }).returning();

        await logActivity({
            performedById: locals.user!.id,
            activityType: 'created',
            entityType: 'announcement',
            entityId: newAnnouncement.id,
            description: `Created announcement: ${title}`
        });

        return { success: true };
    },

    update: async ({ request, locals }) => {
        if (locals.profile?.role !== 'super_admin' && locals.profile?.role !== 'admin') {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const title = formData.get('title') as string;
        const message = formData.get('content') as string || '';
        const type = formData.get('type') as string || 'info';
        const isActive = formData.get('isActive') === 'true';
        const dismissible = formData.get('isDismissible') === 'true';
        const endsAt = formData.get('expiresAt') as string;

        if (!id || !title) {
            return fail(400, { error: 'ID and title are required' });
        }

        await db.update(announcements)
            .set({
                title,
                message,
                type,
                isActive,
                dismissible,
                endsAt: endsAt ? new Date(endsAt) : null,
                updatedAt: new Date()
            })
            .where(eq(announcements.id, id));

        await logActivity({
            performedById: locals.user!.id,
            activityType: 'updated',
            entityType: 'announcement',
            entityId: id,
            description: `Updated announcement: ${title}`
        });

        return { success: true };
    },

    delete: async ({ request, locals }) => {
        if (locals.profile?.role !== 'super_admin' && locals.profile?.role !== 'admin') {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;

        if (!id) {
            return fail(400, { error: 'ID is required' });
        }

        const [deleted] = await db.delete(announcements)
            .where(eq(announcements.id, id))
            .returning();

        await logActivity({
            performedById: locals.user!.id,
            activityType: 'status_changed',
            entityType: 'announcement',
            entityId: id,
            description: `Deleted announcement: ${deleted?.title}`
        });

        return { success: true };
    },

    toggleActive: async ({ request, locals }) => {
        if (locals.profile?.role !== 'super_admin' && locals.profile?.role !== 'admin') {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const id = formData.get('id') as string;
        const isActive = formData.get('isActive') === 'true';

        if (!id) {
            return fail(400, { error: 'ID is required' });
        }

        await db.update(announcements)
            .set({ isActive, updatedAt: new Date() })
            .where(eq(announcements.id, id));

        await logActivity({
            performedById: locals.user!.id,
            activityType: 'status_changed',
            entityType: 'announcement',
            entityId: id,
            description: `${isActive ? 'Activated' : 'Deactivated'} announcement`
        });

        return { success: true };
    }
};
