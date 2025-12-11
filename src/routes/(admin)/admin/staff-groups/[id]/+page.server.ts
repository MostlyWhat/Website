import { createDb } from '$lib/server/db';
import { staffGroups, staffGroupMembers, profiles } from '$lib/server/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import { logActivity } from '$lib/server/utils/activity-logger';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const db = createDb();
    if (!locals.user || !locals.profile) {
        redirect(302, '/auth/login');
    }

    if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
        error(403, 'Access denied');
    }

    const groupId = params.id;

    // Fetch group details
    const [group] = await db
        .select()
        .from(staffGroups)
        .where(eq(staffGroups.id, groupId));

    if (!group) {
        error(404, 'Staff group not found');
    }

    // Fetch group members
    const membersData = await db
        .select({
            groupId: staffGroupMembers.groupId,
            profileId: staffGroupMembers.profileId,
            role: staffGroupMembers.role,
            createdAt: staffGroupMembers.createdAt,
            email: profiles.email,
            displayName: profiles.displayName,
            profileRole: profiles.role,
            avatarUrl: profiles.avatarUrl
        })
        .from(staffGroupMembers)
        .innerJoin(profiles, eq(staffGroupMembers.profileId, profiles.id))
        .where(eq(staffGroupMembers.groupId, groupId));

    // Fetch all staff members for adding to group
    const allStaff = await db
        .select({
            id: profiles.id,
            email: profiles.email,
            displayName: profiles.displayName,
            role: profiles.role
        })
        .from(profiles)
        .where(inArray(profiles.role, ['super_admin', 'admin', 'staff']));

    // Filter out members already in the group
    const memberIds = new Set(membersData.map(m => m.profileId));
    const availableStaff = allStaff.filter(s => !memberIds.has(s.id));

    return {
        group,
        members: membersData,
        availableStaff
    };
};

export const actions: Actions = {
    addMember: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const profileId = formData.get('profileId')?.toString() ?? '';
        const role = formData.get('memberRole')?.toString() ?? 'member';

        if (!profileId) {
            return fail(400, { error: 'Please select a staff member' });
        }

        try {
            await db.insert(staffGroupMembers).values({
                groupId: params.id,
                profileId,
                role
            });

            // Get user name for logging
            const [user] = await db
                .select({ displayName: profiles.displayName, email: profiles.email })
                .from(profiles)
                .where(eq(profiles.id, profileId));

            await logActivity({
                entityType: 'staff_group',
                entityId: params.id,
                activityType: 'updated',
                description: `Added ${user?.displayName || user?.email} to group`,
                performedById: locals.profile.id
            });

            return { success: true, message: 'Member added successfully' };
        } catch (err) {
            console.error('Error adding member:', err);
            return fail(500, { error: 'Failed to add member' });
        }
    },

    removeMember: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const profileId = formData.get('profileId')?.toString() ?? '';

        if (!profileId) {
            return fail(400, { error: 'Member ID is required' });
        }

        try {
            await db
                .delete(staffGroupMembers)
                .where(
                    and(
                        eq(staffGroupMembers.groupId, params.id),
                        eq(staffGroupMembers.profileId, profileId)
                    )
                );

            return { success: true, message: 'Member removed successfully' };
        } catch (err) {
            console.error('Error removing member:', err);
            return fail(500, { error: 'Failed to remove member' });
        }
    },

    updateMemberRole: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const profileId = formData.get('profileId')?.toString() ?? '';
        const role = formData.get('role')?.toString() ?? 'member';

        if (!profileId) {
            return fail(400, { error: 'Member ID is required' });
        }

        try {
            await db
                .update(staffGroupMembers)
                .set({ role })
                .where(
                    and(
                        eq(staffGroupMembers.groupId, params.id),
                        eq(staffGroupMembers.profileId, profileId)
                    )
                );

            return { success: true, message: 'Role updated successfully' };
        } catch (err) {
            console.error('Error updating member role:', err);
            return fail(500, { error: 'Failed to update role' });
        }
    },

    updateGroup: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const name = formData.get('name')?.toString() ?? '';
        const description = formData.get('description')?.toString() ?? '';
        const color = formData.get('color')?.toString() ?? '#6b7280';
        const icon = formData.get('icon')?.toString() ?? 'users';

        if (!name.trim()) {
            return fail(400, { error: 'Group name is required' });
        }

        try {
            await db
                .update(staffGroups)
                .set({
                    name: name.trim(),
                    description: description.trim() || null,
                    color,
                    icon,
                    updatedAt: new Date()
                })
                .where(eq(staffGroups.id, params.id));

            return { success: true, message: 'Group updated successfully' };
        } catch (err) {
            console.error('Error updating group:', err);
            return fail(500, { error: 'Failed to update group' });
        }
    }
};
