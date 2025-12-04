/**
 * Security Settings Server
 * 
 * Handles 2FA enrollment and verification
 */

import { error, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        error(401, 'Unauthorized');
    }

    // Get MFA factors for the user
    const { data: factors, error: factorsError } = await locals.supabase.auth.mfa.listFactors();

    if (factorsError) {
        console.error('Error fetching MFA factors:', factorsError);
    }

    // Find TOTP factor
    const totpFactor = factors?.totp?.[0] ?? null;
    const isMfaEnabled = totpFactor?.status === 'verified';

    return {
        isMfaEnabled,
        factorId: totpFactor?.id ?? null
    };
};

export const actions: Actions = {
    /**
     * Enroll in TOTP 2FA - generates QR code
     */
    enrollTotp: async ({ locals }) => {
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        try {
            const { data, error: enrollError } = await locals.supabase.auth.mfa.enroll({
                factorType: 'totp',
                friendlyName: 'Authenticator App'
            });

            if (enrollError) {
                console.error('TOTP enrollment error:', enrollError);
                return fail(400, { error: enrollError.message });
            }

            return {
                success: true,
                enrollData: {
                    id: data.id,
                    qrCode: data.totp.qr_code,
                    secret: data.totp.secret,
                    uri: data.totp.uri
                }
            };
        } catch (err) {
            console.error('Error enrolling TOTP:', err);
            return fail(500, { error: 'Failed to start 2FA enrollment' });
        }
    },

    /**
     * Verify TOTP code to complete enrollment
     */
    verifyTotp: async ({ locals, request }) => {
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const code = formData.get('code')?.toString() ?? '';
        const factorId = formData.get('factorId')?.toString() ?? '';

        if (!code || code.length !== 6) {
            return fail(400, { error: 'Please enter a valid 6-digit code' });
        }

        if (!factorId) {
            return fail(400, { error: 'Missing factor ID' });
        }

        try {
            // Create a challenge
            const { data: challengeData, error: challengeError } = await locals.supabase.auth.mfa.challenge({
                factorId
            });

            if (challengeError) {
                console.error('Challenge error:', challengeError);
                return fail(400, { error: challengeError.message });
            }

            // Verify the challenge
            const { data: verifyData, error: verifyError } = await locals.supabase.auth.mfa.verify({
                factorId,
                challengeId: challengeData.id,
                code
            });

            if (verifyError) {
                console.error('Verification error:', verifyError);
                return fail(400, { error: 'Invalid code. Please try again.' });
            }

            return {
                success: true,
                verified: true,
                message: 'Two-factor authentication enabled successfully!'
            };
        } catch (err) {
            console.error('Error verifying TOTP:', err);
            return fail(500, { error: 'Failed to verify code' });
        }
    },

    /**
     * Disable 2FA (unenroll factor)
     */
    disableTotp: async ({ locals, request }) => {
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const factorId = formData.get('factorId')?.toString() ?? '';
        const code = formData.get('code')?.toString() ?? '';

        if (!factorId) {
            return fail(400, { error: 'Missing factor ID' });
        }

        if (!code || code.length !== 6) {
            return fail(400, { error: 'Please enter a valid 6-digit code to confirm' });
        }

        try {
            // First verify the code to confirm identity
            const { data: challengeData, error: challengeError } = await locals.supabase.auth.mfa.challenge({
                factorId
            });

            if (challengeError) {
                return fail(400, { error: challengeError.message });
            }

            const { error: verifyError } = await locals.supabase.auth.mfa.verify({
                factorId,
                challengeId: challengeData.id,
                code
            });

            if (verifyError) {
                return fail(400, { error: 'Invalid code. Please enter the correct code from your authenticator app.' });
            }

            // Now unenroll the factor
            const { error: unenrollError } = await locals.supabase.auth.mfa.unenroll({
                factorId
            });

            if (unenrollError) {
                console.error('Unenroll error:', unenrollError);
                return fail(400, { error: unenrollError.message });
            }

            return {
                success: true,
                disabled: true,
                message: 'Two-factor authentication has been disabled.'
            };
        } catch (err) {
            console.error('Error disabling TOTP:', err);
            return fail(500, { error: 'Failed to disable 2FA' });
        }
    }
};
