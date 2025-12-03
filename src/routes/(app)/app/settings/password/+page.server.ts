import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
    changePassword: async ({ request, locals }) => {
        if (!locals.user || !locals.supabase) {
            return fail(401, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return fail(400, { error: 'All fields are required' });
        }

        if (newPassword !== confirmPassword) {
            return fail(400, { error: 'Passwords do not match' });
        }

        if (newPassword.length < 8) {
            return fail(400, { error: 'Password must be at least 8 characters' });
        }

        // Verify current password by attempting to sign in
        const { error: signInError } = await locals.supabase.auth.signInWithPassword({
            email: locals.user.email!,
            password: currentPassword
        });

        if (signInError) {
            return fail(400, { error: 'Current password is incorrect' });
        }

        // Update password
        const { error: updateError } = await locals.supabase.auth.updateUser({
            password: newPassword
        });

        if (updateError) {
            return fail(500, { error: 'Failed to update password. Please try again.' });
        }

        return { success: true, message: 'Password updated successfully.' };
    }
};
