import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { organizations, organizationMembers, organizationInvites, profiles, projects, tickets } from '$lib/server/db/schema';
import { eq, and, count, inArray, desc } from 'drizzle-orm';
import { generateOrgNumber } from '$lib/server/id-generator';
import crypto from 'node:crypto';
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

export const load: PageServerLoad = async ({ locals, url }) => {
    if (!locals.user) {
        throw redirect(303, '/auth/login?redirectTo=/app/organization');
    }

    // Get selected org from URL or use first
    const selectedOrgId = url.searchParams.get('org');

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

    // For each org, get member count, members, and stats
    const orgsWithDetails = await Promise.all(
        userOrganizations.map(async (org) => {
            const members = await db
                .select({
                    id: organizationMembers.profileId,
                    role: organizationMembers.role,
                    joinedAt: organizationMembers.createdAt,
                    firstName: profiles.firstName,
                    lastName: profiles.lastName,
                    email: profiles.email,
                    avatarUrl: profiles.avatarUrl,
                    displayName: profiles.displayName
                })
                .from(organizationMembers)
                .innerJoin(profiles, eq(organizationMembers.profileId, profiles.id))
                .where(eq(organizationMembers.organizationId, org.id))
                .orderBy(desc(organizationMembers.createdAt));

            // Get project count
            const [projectCount] = await db
                .select({ count: count() })
                .from(projects)
                .where(eq(projects.organizationId, org.id));

            // Get open ticket count
            const [openTicketCount] = await db
                .select({ count: count() })
                .from(tickets)
                .where(
                    and(
                        eq(tickets.organizationId, org.id),
                        inArray(tickets.status, ['open', 'in_progress'])
                    )
                );

            // Get invites if user is owner/admin
            let invites: Array<{
                id: string;
                code: string;
                email: string | null;
                role: string;
                expiresAt: Date | null;
                maxUses: number | null;
                usedCount: number;
                createdAt: Date;
            }> = [];

            if (['owner', 'admin'].includes(org.memberRole)) {
                invites = await db
                    .select({
                        id: organizationInvites.id,
                        code: organizationInvites.code,
                        email: organizationInvites.email,
                        role: organizationInvites.role,
                        expiresAt: organizationInvites.expiresAt,
                        maxUses: organizationInvites.maxUses,
                        usedCount: organizationInvites.usedCount,
                        createdAt: organizationInvites.createdAt
                    })
                    .from(organizationInvites)
                    .where(eq(organizationInvites.organizationId, org.id))
                    .orderBy(desc(organizationInvites.createdAt));
            }

            return {
                ...org,
                memberCount: members.length,
                members,
                projectCount: projectCount?.count ?? 0,
                openTickets: openTicketCount?.count ?? 0,
                invites: invites.filter(i => !i.expiresAt || new Date(i.expiresAt) > new Date())
            };
        })
    );

    // Determine selected organization
    const selectedOrg = selectedOrgId
        ? orgsWithDetails.find(o => o.id === selectedOrgId)
        : orgsWithDetails[0] || null;

    return {
        organizations: orgsWithDetails,
        selectedOrg,
        canCreateOrg: locals.profile?.preferences?.accountType === 'organization' || orgsWithDetails.length === 0
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
    },

    updateOrganization: async ({ request, locals, url }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in' });
        }

        const formData = await request.formData();
        const orgId = formData.get('orgId') as string;
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const website = formData.get('website') as string;

        // Verify ownership
        const [membership] = await db
            .select({ role: organizationMembers.role })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, orgId),
                    eq(organizationMembers.profileId, locals.user.id)
                )
            );

        if (!membership || membership.role !== 'owner') {
            return fail(403, { error: 'Only owners can update organization details' });
        }

        if (!name?.trim()) {
            return fail(400, { error: 'Organization name is required' });
        }

        try {
            await db
                .update(organizations)
                .set({
                    name: name.trim(),
                    email: email?.trim() || null,
                    phone: phone?.trim() || null,
                    website: website?.trim() || null,
                    updatedAt: new Date()
                })
                .where(eq(organizations.id, orgId));

            return { success: true, message: 'Organization updated successfully' };
        } catch (err) {
            console.error('Update org error:', err);
            return fail(500, { error: 'Failed to update organization' });
        }
    },

    createInvite: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in' });
        }

        const formData = await request.formData();
        const orgId = formData.get('orgId') as string;
        const email = formData.get('email') as string;
        const role = formData.get('role') as string || 'member';
        const maxUses = parseInt(formData.get('maxUses') as string) || 1;

        // Verify admin/owner role
        const [membership] = await db
            .select({ role: organizationMembers.role })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, orgId),
                    eq(organizationMembers.profileId, locals.user.id)
                )
            );

        if (!membership || !['owner', 'admin'].includes(membership.role)) {
            return fail(403, { error: 'You do not have permission to create invites' });
        }

        // Generate invite code
        const code = crypto.randomBytes(6).toString('hex').toUpperCase();

        // Set expiry to 7 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        try {
            await db.insert(organizationInvites).values({
                organizationId: orgId,
                code,
                email: email?.trim() || null,
                role,
                maxUses,
                expiresAt,
                createdById: locals.user.id
            });

            return { success: true, message: 'Invite created successfully', inviteCode: code };
        } catch (err) {
            console.error('Create invite error:', err);
            return fail(500, { error: 'Failed to create invite' });
        }
    },

    deleteInvite: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in' });
        }

        const formData = await request.formData();
        const orgId = formData.get('orgId') as string;
        const inviteId = formData.get('inviteId') as string;

        // Verify admin/owner role
        const [membership] = await db
            .select({ role: organizationMembers.role })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, orgId),
                    eq(organizationMembers.profileId, locals.user.id)
                )
            );

        if (!membership || !['owner', 'admin'].includes(membership.role)) {
            return fail(403, { error: 'You do not have permission to delete invites' });
        }

        try {
            await db
                .delete(organizationInvites)
                .where(
                    and(
                        eq(organizationInvites.id, inviteId),
                        eq(organizationInvites.organizationId, orgId)
                    )
                );

            return { success: true, message: 'Invite deleted' };
        } catch (err) {
            console.error('Delete invite error:', err);
            return fail(500, { error: 'Failed to delete invite' });
        }
    },

    updateMemberRole: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in' });
        }

        const formData = await request.formData();
        const orgId = formData.get('orgId') as string;
        const profileId = formData.get('profileId') as string;
        const newRole = formData.get('role') as string;

        // Only owners can change roles
        const [membership] = await db
            .select({ role: organizationMembers.role })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, orgId),
                    eq(organizationMembers.profileId, locals.user.id)
                )
            );

        if (!membership || membership.role !== 'owner') {
            return fail(403, { error: 'Only owners can change member roles' });
        }

        if (!['member', 'admin'].includes(newRole)) {
            return fail(400, { error: 'Invalid role' });
        }

        try {
            await db
                .update(organizationMembers)
                .set({ role: newRole })
                .where(
                    and(
                        eq(organizationMembers.profileId, profileId),
                        eq(organizationMembers.organizationId, orgId)
                    )
                );

            return { success: true, message: 'Member role updated' };
        } catch (err) {
            console.error('Update member role error:', err);
            return fail(500, { error: 'Failed to update member role' });
        }
    },

    removeMember: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in' });
        }

        const formData = await request.formData();
        const orgId = formData.get('orgId') as string;
        const profileId = formData.get('profileId') as string;

        // Verify admin/owner role
        const [membership] = await db
            .select({ role: organizationMembers.role })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, orgId),
                    eq(organizationMembers.profileId, locals.user.id)
                )
            );

        if (!membership || !['owner', 'admin'].includes(membership.role)) {
            return fail(403, { error: 'You do not have permission to remove members' });
        }

        // Get the member to check if they're owner
        const [targetMember] = await db
            .select({ role: organizationMembers.role })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.profileId, profileId),
                    eq(organizationMembers.organizationId, orgId)
                )
            );

        if (!targetMember) {
            return fail(404, { error: 'Member not found' });
        }

        if (targetMember.role === 'owner') {
            return fail(400, { error: 'Cannot remove the organization owner' });
        }

        if (membership.role === 'admin' && targetMember.role === 'admin') {
            return fail(403, { error: 'Admins cannot remove other admins' });
        }

        try {
            await db
                .delete(organizationMembers)
                .where(
                    and(
                        eq(organizationMembers.profileId, profileId),
                        eq(organizationMembers.organizationId, orgId)
                    )
                );

            return { success: true, message: 'Member removed' };
        } catch (err) {
            console.error('Remove member error:', err);
            return fail(500, { error: 'Failed to remove member' });
        }
    },

    deleteOrganization: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in' });
        }

        const formData = await request.formData();
        const orgId = formData.get('orgId') as string;
        const confirmName = formData.get('confirmName') as string;

        // Verify ownership
        const [membership] = await db
            .select({ role: organizationMembers.role })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, orgId),
                    eq(organizationMembers.profileId, locals.user.id)
                )
            );

        if (!membership || membership.role !== 'owner') {
            return fail(403, { error: 'Only the organization owner can delete the organization' });
        }

        // Get organization to verify name
        const [org] = await db
            .select({ name: organizations.name })
            .from(organizations)
            .where(eq(organizations.id, orgId));

        if (!org) {
            return fail(404, { error: 'Organization not found' });
        }

        if (confirmName?.trim().toLowerCase() !== org.name.toLowerCase()) {
            return fail(400, { error: 'Organization name does not match. Please type the exact organization name to confirm deletion.' });
        }

        try {
            // Delete organization (cascade will handle members, invites, etc.)
            await db.delete(organizations).where(eq(organizations.id, orgId));

            return { success: true, message: 'Organization deleted successfully' };
        } catch (err) {
            console.error('Delete organization error:', err);
            return fail(500, { error: 'Failed to delete organization' });
        }
    },

    leaveOrganization: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'You must be logged in' });
        }

        const formData = await request.formData();
        const orgId = formData.get('orgId') as string;

        // Verify membership
        const [membership] = await db
            .select({ role: organizationMembers.role })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, orgId),
                    eq(organizationMembers.profileId, locals.user.id)
                )
            );

        if (!membership) {
            return fail(404, { error: 'You are not a member of this organization' });
        }

        if (membership.role === 'owner') {
            return fail(400, { error: 'Organization owners cannot leave. Transfer ownership or delete the organization instead.' });
        }

        try {
            await db
                .delete(organizationMembers)
                .where(
                    and(
                        eq(organizationMembers.profileId, locals.user.id),
                        eq(organizationMembers.organizationId, orgId)
                    )
                );

            return { success: true, message: 'You have left the organization' };
        } catch (err) {
            console.error('Leave organization error:', err);
            return fail(500, { error: 'Failed to leave organization' });
        }
    }
};
