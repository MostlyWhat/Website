import { fail, redirect, isRedirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { createServiceRoleClient } from '$lib/server/supabase';

export const actions: Actions = {
    updateProfile: async ({ request, locals: { supabase, user } }) => {
        if (!user) {
            return fail(401, { error: 'Not authenticated' });
        }

        const formData = await request.formData();
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const displayName = formData.get('displayName') as string;
        const phone = formData.get('phone') as string;

        const { error } = await supabase
            .from('profiles')
            .update({
                first_name: firstName || null,
                last_name: lastName || null,
                display_name: displayName || null,
                phone: phone || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (error) {
            console.error('Profile update error:', error);
            return fail(500, { error: 'Failed to update profile' });
        }

        return { success: true, message: 'Profile updated successfully' };
    },

    changePassword: async ({ request, locals: { supabase, user } }) => {
        if (!user) {
            return fail(401, { error: 'Not authenticated' });
        }

        const formData = await request.formData();
        const currentPassword = formData.get('currentPassword') as string;
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return fail(400, { error: 'All password fields are required' });
        }

        if (newPassword.length < 8) {
            return fail(400, { error: 'New password must be at least 8 characters' });
        }

        if (newPassword !== confirmPassword) {
            return fail(400, { error: 'New passwords do not match' });
        }

        // Verify current password by attempting to sign in
        const { error: signInError } = await supabase.auth.signInWithPassword({
            email: user.email!,
            password: currentPassword
        });

        if (signInError) {
            return fail(400, { error: 'Current password is incorrect' });
        }

        // Update password
        const { error: updateError } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (updateError) {
            console.error('Password update error:', updateError);
            return fail(500, { error: 'Failed to update password. Please try again.' });
        }

        return { success: true, message: 'Password updated successfully' };
    },

    deleteAccount: async ({ locals: { user }, cookies }) => {
        if (!user) {
            return fail(401, { error: 'Not authenticated' });
        }

        try {
            // Use service role client to delete the account
            const serviceClient = createServiceRoleClient();

            // Call the account deletion function
            const { error: deleteError } = await serviceClient.rpc('delete_user_account', {
                user_id_to_delete: user.id
            });

            if (deleteError) {
                console.error('Account deletion error:', deleteError);
                return fail(500, { error: 'Failed to delete account. Please contact support.' });
            }

            // Clear all auth cookies
            cookies.delete('sb-access-token', { path: '/' });
            cookies.delete('sb-refresh-token', { path: '/' });

            // Redirect to home page
            redirect(303, '/?accountDeleted=true');
        } catch (err) {
            if (isRedirect(err)) {
                throw err;
            }
            console.error('Account deletion exception:', err);
            return fail(500, { error: 'An unexpected error occurred. Please contact support.' });
        }
    }
};
