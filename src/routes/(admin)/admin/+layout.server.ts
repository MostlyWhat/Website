import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { db } from '$lib/server/db';
import { announcements, announcementDismissals, staffGroupMembers } from '$lib/server/db/schema';
import { eq, and, or, isNull, gt, lte, sql, notInArray } from 'drizzle-orm';

export const load: LayoutServerLoad = async ({ locals }) => {
    // Require authentication
    if (!locals.user) {
        redirect(303, '/auth/login?redirectTo=/admin');
    }

    // Require onboarding completion
    if (locals.profile && !locals.profile.onboardingCompleted) {
        redirect(303, '/onboarding');
    }

    // Require admin, staff, or super_admin role
    const allowedRoles = ['super_admin', 'admin', 'staff'];
    if (!locals.profile || !allowedRoles.includes(locals.profile.role)) {
        redirect(303, '/app');
    }

    // Get user's staff group IDs
    const userStaffGroups = await db
        .select({ groupId: staffGroupMembers.groupId })
        .from(staffGroupMembers)
        .where(eq(staffGroupMembers.profileId, locals.profile.id));

    const userGroupIds = userStaffGroups.map(g => g.groupId);

    // Get dismissed announcement IDs for this user
    const dismissedAnnouncements = await db
        .select({ announcementId: announcementDismissals.announcementId })
        .from(announcementDismissals)
        .where(eq(announcementDismissals.userId, locals.user.id));

    const dismissedIds = dismissedAnnouncements.map(r => r.announcementId);

    const now = new Date();

    // Get active announcements
    const activeAnnouncements = await db
        .select()
        .from(announcements)
        .where(
            and(
                eq(announcements.isActive, true),
                // Check timing
                or(
                    isNull(announcements.startsAt),
                    lte(announcements.startsAt, now)
                ),
                or(
                    isNull(announcements.endsAt),
                    gt(announcements.endsAt, now)
                ),
                // Targeting: global OR targeted at this user OR targeted at user's staff groups
                or(
                    // Global announcements (no specific targets)
                    and(
                        isNull(announcements.targetUserId),
                        isNull(announcements.targetStaffGroupId)
                    ),
                    // Targeted at this specific user
                    eq(announcements.targetUserId, locals.user.id),
                    // Targeted at user's staff groups
                    userGroupIds.length > 0
                        ? sql`${announcements.targetStaffGroupId} = ANY(ARRAY[${sql.raw(userGroupIds.map(id => `'${id}'::uuid`).join(','))}])`
                        : sql`false`
                ),
                // Not already dismissed
                dismissedIds.length > 0
                    ? notInArray(announcements.id, dismissedIds)
                    : sql`true`
            )
        )
        .orderBy(announcements.createdAt);

    return {
        session: locals.session,
        user: locals.user,
        profile: locals.profile,
        announcements: activeAnnouncements
    };
};
