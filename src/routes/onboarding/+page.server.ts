import { fail, redirect, isRedirect } from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';
import { completeOnboarding } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { organizations, organizationMembers } from '$lib/server/db/schema';
import { generateOrgNumber } from '$lib/server/id-generator';

/**
 * Generate a URL-friendly slug from a name
 */
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 50);
}

export const actions = {
    default: async ({ request, locals }: RequestEvent) => {
        if (!locals.user) {
            redirect(303, '/auth/login');
        }

        const formData = await request.formData();
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const phone = formData.get('phone') as string | null;
        const accountType = formData.get('accountType') as 'personal' | 'organization';
        const organizationName = formData.get('organizationName') as string | null;
        const emailNotifications = formData.get('emailNotifications') === 'true';
        const smsNotifications = formData.get('smsNotifications') === 'true';
        const magicLinkEnabled = formData.get('magicLinkEnabled') === 'true';
        const theme = formData.get('theme') as 'light' | 'dark' | 'system';

        // Validation
        if (!firstName || !lastName) {
            return fail(400, { error: 'First name and last name are required' });
        }

        if (accountType === 'organization' && !organizationName?.trim()) {
            return fail(400, { error: 'Organization name is required' });
        }

        try {
            // If organization account type, create the organization first
            if (accountType === 'organization' && organizationName) {
                const orgNumber = await generateOrgNumber();
                const slug = generateSlug(organizationName);
                
                // Create organization
                const [newOrg] = await db
                    .insert(organizations)
                    .values({
                        orgNumber,
                        name: organizationName.trim(),
                        slug: `${slug}-${Date.now().toString(36)}`, // Ensure uniqueness
                        customerType: 'business',
                        email: locals.user.email
                    })
                    .returning();

                // Add user as organization owner
                if (newOrg) {
                    await db.insert(organizationMembers).values({
                        organizationId: newOrg.id,
                        profileId: locals.user.id,
                        role: 'owner'
                    });
                }
            }

            const profile = await completeOnboarding(locals.user.id, {
                firstName,
                lastName,
                phone: phone || undefined,
                preferences: {
                    emailNotifications,
                    smsNotifications,
                    magicLinkEnabled,
                    theme,
                    accountType
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
