import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { organizations, organizationMembers, profiles } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { generateOrgNumber } from '$lib/server/id-generator';
import type { PageServerLoad, Actions } from './$types';

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

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/auth/login?redirectTo=/app/organization');
    }

    // Fetch user's organizations with member details
    const userOrganizations = await db
        .select({
            id: organizations.id,
            orgNumber: organizations.orgNumber,
            name: organizations.name,
            slug: organizations.slug,
            description: organizations.description,
            logoUrl: organizations.logoUrl,
            website: organizations.website,
            email: organizations.email,
            phone: organizations.phone,
            customerType: organizations.customerType,
            createdAt: organizations.createdAt,
            memberRole: organizationMembers.role
        })
        .from(organizationMembers)
        .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
        .where(eq(organizationMembers.profileId, locals.user.id));

    // For each org, get member count
    const orgsWithMemberCount = await Promise.all(
        userOrganizations.map(async (org) => {
            const members = await db
                .select({
                    id: organizationMembers.profileId,
                    role: organizationMembers.role,
                    firstName: profiles.firstName,
                    lastName: profiles.lastName,
                    email: profiles.email,
                    avatarUrl: profiles.avatarUrl
                })
                .from(organizationMembers)
                .innerJoin(profiles, eq(organizationMembers.profileId, profiles.id))
                .where(eq(organizationMembers.organizationId, org.id));

            return {
                ...org,
                memberCount: members.length,
                members
            };
        })
    );

    return {
        organizations: orgsWithMemberCount,
        canCreateOrg: locals.profile?.preferences?.accountType === 'organization' || orgsWithMemberCount.length === 0
    };
};

export const actions: Actions = {
    createOrganization: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in' });
        }

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const description = formData.get('description') as string | null;
        const website = formData.get('website') as string | null;

        if (!name?.trim()) {
            return fail(400, { error: 'Organization name is required' });
        }

        try {
            const orgNumber = await generateOrgNumber();
            const slug = generateSlug(name);

            // Create organization
            const [newOrg] = await db
                .insert(organizations)
                .values({
                    orgNumber,
                    name: name.trim(),
                    slug: `${slug}-${Date.now().toString(36)}`,
                    description: description?.trim() || null,
                    website: website?.trim() || null,
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

                // Update profile preferences to organization account type
                if (locals.profile?.preferences) {
                    await db
                        .update(profiles)
                        .set({
                            preferences: {
                                ...locals.profile.preferences,
                                accountType: 'organization'
                            },
                            updatedAt: new Date()
                        })
                        .where(eq(profiles.id, locals.user.id));
                }
            }

            return { success: true };
        } catch (error) {
            console.error('Failed to create organization:', error);
            return fail(500, { error: 'Failed to create organization. Please try again.' });
        }
    }
};
