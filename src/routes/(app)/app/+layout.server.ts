import { redirect } from '@sveltejs/kit';
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

    return {
        session: locals.session,
        user: locals.user,
        profile: locals.profile
    };
};
