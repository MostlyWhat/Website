import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

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

    return {
        session: locals.session,
        user: locals.user,
        profile: locals.profile
    };
};
