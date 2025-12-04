import { db } from '$lib/server/db';
import { staffGroups, staffGroupMembers, profiles } from '$lib/server/db/schema';
import { eq, desc, and, inArray } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import { logActivity } from '$lib/server/activity-logger';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        throw redirect(302, '/auth/login');
    }

    // Only super_admin and admin can manage staff groups
    if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
        throw error(403, 'Access denied');
    }

    // Fetch all staff groups with member counts
    let groups: Array<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        color: string | null;
        icon: string | null;
        isActive: boolean;
        createdAt: Date;
        memberCount: number;
    }> = [];

    try {
        const groupsData = await db
            .select({
                id: staffGroups.id,
                name: staffGroups.name,
                slug: staffGroups.slug,
                description: staffGroups.description,
                color: staffGroups.color,
                icon: staffGroups.icon,
                isActive: staffGroups.isActive,
                createdAt: staffGroups.createdAt
            })
            .from(staffGroups)
            .orderBy(desc(staffGroups.createdAt));

        // Get member counts for each group
        for (const group of groupsData) {
            const members = await db
                .select({ profileId: staffGroupMembers.profileId })
                .from(staffGroupMembers)
                .where(eq(staffGroupMembers.groupId, group.id));
            
            groups.push({
                ...group,
                memberCount: members.length
            });
        }
    } catch (err) {
        console.warn('Error fetching staff groups:', err);
    }

    // Fetch all staff members for adding to groups
    let staffMembers: Array<{
        id: string;
        email: string;
        displayName: string | null;
        role: string;
    }> = [];

    try {
        staffMembers = await db
            .select({
                id: profiles.id,
                email: profiles.email,
                displayName: profiles.displayName,
                role: profiles.role
            })
            .from(profiles)
            .where(inArray(profiles.role, ['super_admin', 'admin', 'staff']));
    } catch (err) {
        console.warn('Error fetching staff members:', err);
    }

    return {
        groups,
        staffMembers
    };
};

export const actions: Actions = {
    createGroup: async ({ request, locals }) => {
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

        // Generate slug
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

        try {
            const [newGroup] = await db
                .insert(staffGroups)
                .values({
                    name: name.trim(),
                    slug,
                    description: description.trim() || null,
                    color,
                    icon,
                    createdById: locals.profile.id
                })
                .returning();

            await logActivity({
                entityType: 'staff_group',
                entityId: newGroup.id,
                activityType: 'created',
                description: `Created staff group "${name}"`,
                performedById: locals.profile.id
            });

            return { success: true, message: `Group "${name}" created successfully` };
        } catch (err) {
            console.error('Error creating staff group:', err);
            return fail(500, { error: 'Failed to create group' });
        }
    },

    deleteGroup: async ({ request, locals }) => {
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const groupId = formData.get('groupId')?.toString() ?? '';

        if (!groupId) {
            return fail(400, { error: 'Group ID is required' });
        }

        try {
            // Get group name for logging
            const [group] = await db
                .select({ name: staffGroups.name })
                .from(staffGroups)
                .where(eq(staffGroups.id, groupId));

            await db.delete(staffGroups).where(eq(staffGroups.id, groupId));

            await logActivity({
                entityType: 'staff_group',
                entityId: groupId,
                activityType: 'updated',
                description: `Deleted staff group "${group?.name}"`,
                performedById: locals.profile.id
            });

            return { success: true, message: 'Group deleted successfully' };
        } catch (err) {
            console.error('Error deleting staff group:', err);
            return fail(500, { error: 'Failed to delete group' });
        }
    },

    toggleGroup: async ({ request, locals }) => {
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const groupId = formData.get('groupId')?.toString() ?? '';
        const isActive = formData.get('isActive') === 'true';

        if (!groupId) {
            return fail(400, { error: 'Group ID is required' });
        }

        try {
            await db
                .update(staffGroups)
                .set({ 
                    isActive: !isActive,
                    updatedAt: new Date()
                })
                .where(eq(staffGroups.id, groupId));

            return { success: true, message: `Group ${isActive ? 'disabled' : 'enabled'} successfully` };
        } catch (err) {
            console.error('Error toggling staff group:', err);
            return fail(500, { error: 'Failed to update group' });
        }
    }
};
