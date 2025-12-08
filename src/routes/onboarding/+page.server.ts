import { fail, redirect, isRedirect } from '@sveltejs/kit';
import type { Actions, RequestEvent } from '@sveltejs/kit';
import { completeOnboarding, getOrCreateProfile } from '$lib/server/auth';
import { createDb } from '$lib/server/db';
import { organizations, organizationMembers, organizationInvites, pendingOrganizationMembers } from '$lib/server/db/schema';
import { generateOrgNumber } from '$lib/server/id-generator';
import { eq, and, sql } from 'drizzle-orm';

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
            return fail(401, { error: 'You must be logged in' });
        }

        // Create per-request database connection (Cloudflare Workers compatible)
        const db = createDb();

        // Ensure profile exists before onboarding
        // This handles cases where the user signed in via magic link, OAuth, etc.
        // and the profile wasn't created during the auth flow
        await getOrCreateProfile(locals.user);

        const formData = await request.formData();
        const firstName = formData.get('firstName') as string;
        const lastName = formData.get('lastName') as string;
        const phone = formData.get('phone') as string | null;
        const accountType = formData.get('accountType') as 'personal' | 'join' | 'create';
        const organizationName = formData.get('organizationName') as string | null;
        const inviteCode = formData.get('inviteCode') as string | null;
        const emailNotifications = formData.get('emailNotifications') === 'true';
        const smsNotifications = formData.get('smsNotifications') === 'true';
        const magicLinkEnabled = formData.get('magicLinkEnabled') === 'true';
        const theme = formData.get('theme') as 'light' | 'dark' | 'system';

        // Validation
        if (!firstName || !lastName) {
            return fail(400, { error: 'First name and last name are required' });
        }

        if (accountType === 'create' && !organizationName?.trim()) {
            return fail(400, { error: 'Organization name is required' });
        }

        if (accountType === 'join' && !inviteCode?.trim()) {
            return fail(400, { error: 'Invite code is required' });
        }

        try {
            // If creating an organization
            if (accountType === 'create' && organizationName) {
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

            // If joining an organization with invite code
            if (accountType === 'join' && inviteCode) {
                // Validate the invite code
                const [invite] = await db
                    .select()
                    .from(organizationInvites)
                    .where(eq(organizationInvites.code, inviteCode.trim()));

                if (!invite) {
                    return fail(400, { error: 'Invalid invite code. Please check and try again.' });
                }

                // Check if expired
                if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
                    return fail(400, { error: 'This invite code has expired.' });
                }

                // Check if exhausted
                if (invite.maxUses && invite.usedCount >= invite.maxUses) {
                    return fail(400, { error: 'This invite code has reached its maximum uses.' });
                }

                // Check email restriction
                if (invite.email && invite.email.toLowerCase() !== locals.user.email?.toLowerCase()) {
                    return fail(400, { error: 'This invite is restricted to a different email address.' });
                }

                // Check if already a member
                const [existingMember] = await db
                    .select()
                    .from(organizationMembers)
                    .where(
                        and(
                            eq(organizationMembers.organizationId, invite.organizationId),
                            eq(organizationMembers.profileId, locals.user.id)
                        )
                    );

                if (existingMember) {
                    return fail(400, { error: 'You are already a member of this organization.' });
                }

                // Handle join based on approval requirement
                if (invite.requiresApproval) {
                    // Check if already pending
                    const [existingPending] = await db
                        .select()
                        .from(pendingOrganizationMembers)
                        .where(
                            and(
                                eq(pendingOrganizationMembers.organizationId, invite.organizationId),
                                eq(pendingOrganizationMembers.profileId, locals.user.id)
                            )
                        );

                    if (!existingPending) {
                        // Create pending membership
                        await db.insert(pendingOrganizationMembers).values({
                            organizationId: invite.organizationId,
                            profileId: locals.user.id,
                            requestedRole: invite.role,
                            inviteId: invite.id,
                            status: 'pending'
                        });
                    }
                } else {
                    // Direct join
                    await db.insert(organizationMembers).values({
                        organizationId: invite.organizationId,
                        profileId: locals.user.id,
                        role: invite.role
                    });

                    // Increment used count
                    await db
                        .update(organizationInvites)
                        .set({ usedCount: sql`${organizationInvites.usedCount} + 1` })
                        .where(eq(organizationInvites.id, invite.id));
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
                    accountType: accountType === 'create' ? 'organization' : 'personal'
                }
            });

            // Redirect based on role
            const redirectTo = profile.role === 'super_admin' || profile.role === 'admin' || profile.role === 'staff'
                ? '/admin'
                : '/app';

            return redirect(303, redirectTo);
        } catch (error) {
            // Re-redirects - they're not errors
            if (isRedirect(error)) {
                error;
            }
            console.error('Onboarding error:', error);
            return fail(500, { error: 'Failed to complete onboarding. Please try again.' });
        }
    }
};
