import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
    // Require authentication
    if (!locals.user) {
        throw redirect(303, '/auth/login?redirectTo=/onboarding');
    }

    // If onboarding is already complete, redirect to app
    if (locals.profile?.onboardingCompleted) {
        const redirectTo = locals.profile.role === 'super_admin' || locals.profile.role === 'admin' || locals.profile.role === 'staff'
            ? '/admin'
            : '/app';
        throw redirect(303, redirectTo);
    }

    return {
        session: locals.session,
        user: locals.user,
        profile: locals.profile
    };
};
