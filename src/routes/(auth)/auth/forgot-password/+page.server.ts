import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    default: async ({ request, locals: { supabase }, url }) => {
        const formData = await request.formData();
        const email = formData.get('email') as string;

        if (!email) {
            return fail(400, { error: 'Email is required' });
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${url.origin}/auth/reset-password`
        });

        if (error) {
            console.error('Password reset error:', error.message);
            // Don't reveal if user exists or not for security
            return {
                success: true,
                message: 'If an account exists with this email, you will receive a password reset link.'
            };
        }

        return {
            success: true,
            message: 'If an account exists with this email, you will receive a password reset link.'
        };
    }
};
