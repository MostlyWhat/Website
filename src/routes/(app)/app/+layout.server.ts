import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { announcements } from '$lib/server/db/schema';
import { eq, and, lte, gte, desc, isNull, or } from 'drizzle-orm';
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

    // Fetch active announcements
    const now = new Date();
    const activeAnnouncements = await db
        .select({
            id: announcements.id,
            title: announcements.title,
            message: announcements.message,
            priority: announcements.type
        })
        .from(announcements)
        .where(
            and(
                eq(announcements.isActive, true),
                or(isNull(announcements.startsAt), lte(announcements.startsAt, now)),
                or(isNull(announcements.endsAt), gte(announcements.endsAt, now))
            )
        )
        .orderBy(desc(announcements.type), desc(announcements.createdAt))
        .limit(5);

    return {
        session: locals.session,
        user: locals.user,
        profile: locals.profile,
        announcements: activeAnnouncements
    };
};
