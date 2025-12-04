import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { announcements, announcementDismissals, organizationMembers, organizations } from '$lib/server/db/schema';
import { eq, and, gt, desc, isNull, or, notInArray, lte, sql } from 'drizzle-orm';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    // Require authentication
    if (!locals.user) {
        redirect(303, '/auth/login?redirectTo=/app');
    }

    // Require onboarding completion
    if (locals.profile && !locals.profile.onboardingCompleted) {
        redirect(303, '/onboarding');
    }

    // Fetch user's organizations
    const userOrganizations = locals.user
        ? await db
            .select({
                id: organizations.id,
                name: organizations.name,
                slug: organizations.slug,
                role: organizationMembers.role
            })
            .from(organizationMembers)
            .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
            .where(eq(organizationMembers.profileId, locals.user.id))
        : [];

    const userOrgIds = userOrganizations.map(o => o.id);

    // Get dismissed announcement IDs for this user
    const dismissedAnnouncements = await db
        .select({ announcementId: announcementDismissals.announcementId })
        .from(announcementDismissals)
        .where(eq(announcementDismissals.userId, locals.user.id));

    const dismissedIds = dismissedAnnouncements.map(r => r.announcementId);

    const now = new Date();

    // Fetch active announcements targeted at this user
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
                // Targeting: global OR targeted at this user OR targeted at user's organizations
                or(
                    // Global announcements (no specific targets)
                    and(
                        isNull(announcements.targetUserId),
                        isNull(announcements.targetOrganizationId),
                        isNull(announcements.targetStaffGroupId)
                    ),
                    // Targeted at this specific user
                    eq(announcements.targetUserId, locals.user.id),
                    // Targeted at user's organizations
                    userOrgIds.length > 0
                        ? sql`${announcements.targetOrganizationId} = ANY(ARRAY[${sql.raw(userOrgIds.map(id => `'${id}'::uuid`).join(','))}])`
                        : sql`false`
                ),
                // Not already dismissed
                dismissedIds.length > 0
                    ? notInArray(announcements.id, dismissedIds)
                    : sql`true`
            )
        )
        .orderBy(desc(announcements.createdAt))
        .limit(5);

    return {
        session: locals.session,
        user: locals.user,
        profile: locals.profile,
        announcements: activeAnnouncements,
        userOrganizations
    };
};
