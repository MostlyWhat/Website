import { createDb } from '$lib/server/db';
import {
    profiles,
    organizations,
    organizationMembers,
    tickets,
    projects,
    activityLog
} from '$lib/server/db/schema';
import { eq, desc, and, count } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import { userActivity, getClientIp } from '$lib/server/activity-logger';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const userId = params.id;

    // Fetch the user profile
    const [user] = await db
        .select()
        .from(profiles)
        .where(eq(profiles.id, userId));

    if (!user) {
        throw error(404, 'User not found');
    }

    // Fetch organization memberships
    const memberships = await db
        .select({
            organizationId: organizationMembers.organizationId,
            role: organizationMembers.role,
            joinedAt: organizationMembers.createdAt,
            organizationName: organizations.name,
            organizationSlug: organizations.slug,
            organizationLogoUrl: organizations.logoUrl
        })
        .from(organizationMembers)
        .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
        .where(eq(organizationMembers.profileId, userId))
        .orderBy(desc(organizationMembers.createdAt));

    // Fetch ticket stats
    const [ticketStats] = await db
        .select({
            total: count()
        })
        .from(tickets)
        .where(eq(tickets.createdById, userId));

    // Fetch assigned tickets (for staff)
    const [assignedTickets] = await db
        .select({
            total: count()
        })
        .from(tickets)
        .where(eq(tickets.assignedToId, userId));

    // Fetch assigned projects (for staff)
    const [assignedProjects] = await db
        .select({
            total: count()
        })
        .from(projects)
        .where(eq(projects.assignedToId, userId));

    // Fetch recent activity
    const recentActivity = await db
        .select()
        .from(activityLog)
        .where(eq(activityLog.performedById, userId))
        .orderBy(desc(activityLog.createdAt))
        .limit(10);

    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            displayName: user.displayName,
            avatarUrl: user.avatarUrl,
            phone: user.phone,
            role: user.role,
            onboardingCompleted: user.onboardingCompleted,
            preferences: user.preferences,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            lastLoginAt: user.lastLoginAt
        },
        memberships,
        stats: {
            ticketsCreated: ticketStats?.total ?? 0,
            ticketsAssigned: assignedTickets?.total ?? 0,
            projectsAssigned: assignedProjects?.total ?? 0,
            organizationCount: memberships.length
        },
        recentActivity
    };
};

export const actions: Actions = {
    updateRole: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
const formData = await request.formData();
        const newRole = formData.get('role') as string;

        if (!newRole || !['super_admin', 'admin', 'staff', 'customer'].includes(newRole)) {
            return fail(400, { error: 'Invalid role' });
        }

        try {
            // Get current user data for activity log
            const [user] = await db.select({ email: profiles.email, role: profiles.role }).from(profiles).where(eq(profiles.id, params.id));
            const oldRole = user?.role ?? 'unknown';

            await db
                .update(profiles)
                .set({
                    role: newRole as 'super_admin' | 'admin' | 'staff' | 'customer',
                    updatedAt: new Date()
                })
                .where(eq(profiles.id, params.id));

            // Log activity
            if (locals.profile) {
                await userActivity.updated(params.id, user?.email ?? 'Unknown', { role: { old: oldRole, new: newRole } }, locals.profile.id, getClientIp(request));
            }

            return { success: true, message: 'Role updated successfully' };
        } catch (err) {
            console.error('Failed to update role:', err);
            return fail(500, { error: 'Failed to update role' });
        }
    },

    updateProfile: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
const formData = await request.formData();
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const phone = formData.get('phone') as string;

        try {
            // Get current user data for activity log
            const [user] = await db.select({ email: profiles.email, firstName: profiles.firstName, lastName: profiles.lastName, phone: profiles.phone }).from(profiles).where(eq(profiles.id, params.id));

            await db
                .update(profiles)
                .set({
                    firstName: firstName || null,
                    lastName: lastName || null,
                    phone: phone || null,
                    updatedAt: new Date()
                })
                .where(eq(profiles.id, params.id));

            // Log activity
            if (locals.profile) {
                await userActivity.updated(
                    params.id,
                    user?.email ?? 'Unknown',
                    {
                        firstName: { old: user?.firstName, new: firstName },
                        lastName: { old: user?.lastName, new: lastName },
                        phone: { old: user?.phone, new: phone }
                    },
                    locals.profile.id,
                    getClientIp(request)
                );
            }

            return { success: true, message: 'Profile updated successfully' };
        } catch (err) {
            console.error('Failed to update profile:', err);
            return fail(500, { error: 'Failed to update profile' });
        }
    },

    removeFromOrganization: async ({ request, params, locals }) => {
        // Create per-request database connection
        const db = createDb();
const formData = await request.formData();
        const organizationId = formData.get('organizationId') as string;

        if (!organizationId) {
            return fail(400, { error: 'Organization ID is required' });
        }

        try {
            // Get user and org info for activity log
            const [user] = await db.select({ email: profiles.email }).from(profiles).where(eq(profiles.id, params.id));
            const [org] = await db.select({ name: organizations.name }).from(organizations).where(eq(organizations.id, organizationId));

            await db
                .delete(organizationMembers)
                .where(
                    and(
                        eq(organizationMembers.profileId, params.id),
                        eq(organizationMembers.organizationId, organizationId)
                    )
                );

            // Log activity
            if (locals.profile) {
                await userActivity.updated(
                    params.id,
                    user?.email ?? 'Unknown',
                    { removedFromOrganization: { old: org?.name ?? organizationId, new: null } },
                    locals.profile.id,
                    getClientIp(request)
                );
            }

            return { success: true, message: 'Removed from organization' };
        } catch (err) {
            console.error('Failed to remove from organization:', err);
            return fail(500, { error: 'Failed to remove from organization' });
        }
    }
};
