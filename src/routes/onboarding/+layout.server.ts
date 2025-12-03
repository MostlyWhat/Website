import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    // Require authentication
    if (!locals.user) {
        redirect(303, '/auth/login?redirectTo=/onboarding');
    }

    // If onboarding is already complete, redirect to app
    if (locals.profile?.onboardingCompleted) {
        const redirectTo = locals.profile.role === 'admin' || locals.profile.role === 'staff'
            ? '/admin'
            : '/app';
        redirect(303, redirectTo);
    }

    return {
        session: locals.session,
        user: locals.user,
        profile: locals.profile
    };
};
