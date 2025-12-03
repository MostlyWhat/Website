import { fail, redirect, isRedirect } from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';
import { completeOnboarding } from '$lib/server/auth';

export const actions = {
    default: async ({ request, locals }: RequestEvent) => {
        if (!locals.user) {
            redirect(303, '/auth/login');
        }

        const formData = await request.formData();
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const phone = formData.get('phone') as string | null;
        const emailNotifications = formData.get('emailNotifications') === 'true';
        const smsNotifications = formData.get('smsNotifications') === 'true';
        const magicLinkEnabled = formData.get('magicLinkEnabled') === 'true';
        const theme = formData.get('theme') as 'light' | 'dark' | 'system';

        // Validation
        if (!firstName || !lastName) {
            return fail(400, { error: 'First name and last name are required' });
        }

        try {
            const profile = await completeOnboarding(locals.user.id, {
                firstName,
                lastName,
                phone: phone || undefined,
                preferences: {
                    emailNotifications,
                    smsNotifications,
                    magicLinkEnabled,
                    theme
                }
            });

            // Redirect based on role
            const redirectTo = profile.role === 'super_admin' || profile.role === 'admin' || profile.role === 'staff'
                ? '/admin'
                : '/app';

            redirect(303, redirectTo);
        } catch (error) {
            // Re-throw redirects - they're not errors
            if (isRedirect(error)) {
                throw error;
            }
            console.error('Onboarding error:', error);
            return fail(500, { error: 'Failed to complete onboarding. Please try again.' });
        }
    }
};
