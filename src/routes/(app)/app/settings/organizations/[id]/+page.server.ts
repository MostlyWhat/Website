/**
 * Organization Detail/Management Page Server
 * 
 * Loads organization data for owners/admins to manage
 */

import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { createDb } from '$lib/server/db';
import {
    organizations,
    organizationMembers,
    organizationInvites,
    profiles,
    projects,
    tickets
} from '$lib/server/db/schema';
import { eq, and, count, inArray, desc } from 'drizzle-orm';
import crypto from 'node:crypto';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.session || !locals.profile) {
        throw redirect(303, '/auth/login');
    }

    // Create per-request database connection
    const db = createDb();

    // Check if user is member of this organization with admin/owner role
    const [membership] = await db
        .select({
            role: organizationMembers.role
        })
        .from(organizationMembers)
        .where(
            and(
                eq(organizationMembers.organizationId, params.id),
                eq(organizationMembers.profileId, locals.profile.id)
            )
        );

    if (!membership) {
        error(404, 'Organization not found');
    }

    if (!['owner', 'admin'].includes(membership.role)) {
        error(403, 'You do not have permission to manage this organization');
    }

    // Fetch organization details
    const [org] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, params.id));

    if (!org) {
        error(404, 'Organization not found');
    }

    // Fetch members with profiles
    const members = await db
        .select({
            role: organizationMembers.role,
            joinedAt: organizationMembers.createdAt,
            profileId: profiles.id,
            displayName: profiles.displayName,
            email: profiles.email,
            avatarUrl: profiles.avatarUrl
        })
        .from(organizationMembers)
        .innerJoin(profiles, eq(profiles.id, organizationMembers.profileId))
        .where(eq(organizationMembers.organizationId, params.id))
        .orderBy(desc(organizationMembers.createdAt));

    // Fetch active invites
    const invites = await db
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
        .where(eq(organizationInvites.organizationId, params.id))
        .orderBy(desc(organizationInvites.createdAt));

    // Get stats
    const [projectCount] = await db
        .select({ count: count() })
        .from(projects)
        .where(eq(projects.organizationId, params.id));

    const [openTicketCount] = await db
        .select({ count: count() })
        .from(tickets)
        .where(
            and(
                eq(tickets.organizationId, params.id),
                inArray(tickets.status, ['open', 'in_progress'])
            )
        );

    return {
        organization: org,
        members,
        invites: invites.filter((i) => !i.expiresAt || new Date(i.expiresAt) > new Date()),
        userRole: membership.role,
        stats: {
            memberCount: members.length,
            projectCount: projectCount?.count ?? 0,
            openTickets: openTicketCount?.count ?? 0
        }
    };
};

export const actions: Actions = {
    updateOrg: async ({ request, params, locals }) => {
        if (!locals.session || !locals.profile) {
            return fail(401, { error: 'Not authenticated' });
        }

        // Create per-request database connection
        const db = createDb();

        // Verify ownership
        const [membership] = await db
            .select({ role: organizationMembers.role })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, params.id),
                    eq(organizationMembers.profileId, locals.profile.id)
                )
            );

        if (!membership || membership.role !== 'owner') {
            return fail(403, { error: 'Only owners can update organization details' });
        }

        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const website = formData.get('website') as string;

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
                .where(eq(organizations.id, params.id));

            return { success: true, message: 'Organization updated successfully' };
        } catch (err) {
            console.error('Update org error:', err);
            return fail(500, { error: 'Failed to update organization' });
        }
    },

    createInvite: async ({ request, params, locals }) => {
        if (!locals.session || !locals.profile) {
            return fail(401, { error: 'Not authenticated' });
        }

        // Create per-request database connection
        const db = createDb();

        // Verify admin/owner role
        const [membership] = await db
            .select({ role: organizationMembers.role })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, params.id),
                    eq(organizationMembers.profileId, locals.profile.id)
                )
            );

        if (!membership || !['owner', 'admin'].includes(membership.role)) {
            return fail(403, { error: 'You do not have permission to create invites' });
        }

        const formData = await request.formData();
        const email = formData.get('email') as string;
        const role = formData.get('role') as string || 'member';
        const maxUses = parseInt(formData.get('maxUses') as string) || 1;

        // Generate invite code
        const code = crypto.randomBytes(6).toString('hex').toUpperCase();

        // Set expiry to 7 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        try {
            await db.insert(organizationInvites).values({
                organizationId: params.id,
                code,
                email: email?.trim() || null,
                role,
                maxUses,
                expiresAt,
                createdById: locals.profile.id
            });

            return { success: true, message: 'Invite created successfully', inviteCode: code };
        } catch (err) {
            console.error('Create invite error:', err);
            return fail(500, { error: 'Failed to create invite' });
        }
    },

    deleteInvite: async ({ request, params, locals }) => {
        if (!locals.session || !locals.profile) {
            return fail(401, { error: 'Not authenticated' });
        }

        const formData = await request.formData();
        const inviteId = formData.get('inviteId') as string;

        // Create per-request database connection
        const db = createDb();

        // Verify admin/owner role
        const [membership] = await db
            .select({ role: organizationMembers.role })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, params.id),
                    eq(organizationMembers.profileId, locals.profile.id)
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
                        eq(organizationInvites.organizationId, params.id)
                    )
                );

            return { success: true, message: 'Invite deleted' };
        } catch (err) {
            console.error('Delete invite error:', err);
            return fail(500, { error: 'Failed to delete invite' });
        }
    },

    updateMemberRole: async ({ request, params, locals }) => {
        if (!locals.session || !locals.profile) {
            return fail(401, { error: 'Not authenticated' });
        }

        // Create per-request database connection
        const db = createDb();

        // Only owners can change roles
        const [membership] = await db
            .select({ role: organizationMembers.role })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, params.id),
                    eq(organizationMembers.profileId, locals.profile.id)
                )
            );

        if (!membership || membership.role !== 'owner') {
            return fail(403, { error: 'Only owners can change member roles' });
        }

        const formData = await request.formData();
        const profileId = formData.get('profileId') as string;
        const newRole = formData.get('role') as string;

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
                        eq(organizationMembers.organizationId, params.id)
                    )
                );

            return { success: true, message: 'Member role updated' };
        } catch (err) {
            console.error('Update member role error:', err);
            return fail(500, { error: 'Failed to update member role' });
        }
    },

    removeMember: async ({ request, params, locals }) => {
        if (!locals.session || !locals.profile) {
            return fail(401, { error: 'Not authenticated' });
        }

        // Create per-request database connection
        const db = createDb();

        // Only owners/admins can remove members
        const [membership] = await db
            .select({ role: organizationMembers.role })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, params.id),
                    eq(organizationMembers.profileId, locals.profile.id)
                )
            );

        if (!membership || !['owner', 'admin'].includes(membership.role)) {
            return fail(403, { error: 'You do not have permission to remove members' });
        }

        const formData = await request.formData();
        const profileId = formData.get('profileId') as string;

        // Get the member to check if they're owner
        const [targetMember] = await db
            .select({ role: organizationMembers.role, profileId: organizationMembers.profileId })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.profileId, profileId),
                    eq(organizationMembers.organizationId, params.id)
                )
            );

        if (!targetMember) {
            return fail(404, { error: 'Member not found' });
        }

        if (targetMember.role === 'owner') {
            return fail(400, { error: 'Cannot remove the organization owner' });
        }

        // Admins can't remove other admins
        if (membership.role === 'admin' && targetMember.role === 'admin') {
            return fail(403, { error: 'Admins cannot remove other admins' });
        }

        try {
            await db
                .delete(organizationMembers)
                .where(
                    and(
                        eq(organizationMembers.profileId, profileId),
                        eq(organizationMembers.organizationId, params.id)
                    )
                );

            return { success: true, message: 'Member removed' };
        } catch (err) {
            console.error('Remove member error:', err);
            return fail(500, { error: 'Failed to remove member' });
        }
    },

    deleteOrganization: async ({ params, locals }) => {
        if (!locals.session || !locals.profile) {
            return fail(401, { error: 'Not authenticated' });
        }

        // Create per-request database connection
        const db = createDb();

        // Only owners can delete organizations
        const [membership] = await db
            .select({ role: organizationMembers.role })
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, params.id),
                    eq(organizationMembers.profileId, locals.profile.id)
                )
            );

        if (!membership || membership.role !== 'owner') {
            return fail(403, { error: 'Only the organization owner can delete the organization' });
        }

        // Check if there are active projects
        const [projectCount] = await db
            .select({ count: count() })
            .from(projects)
            .where(eq(projects.organizationId, params.id));

        if (projectCount.count > 0) {
            return fail(400, { error: 'Cannot delete organization with existing projects. Please delete or transfer all projects first.' });
        }

        // Check if there are open tickets
        const [ticketCount] = await db
            .select({ count: count() })
            .from(tickets)
            .where(
                and(
                    eq(tickets.organizationId, params.id),
                    inArray(tickets.status, ['open', 'in_progress', 'awaiting_customer', 'awaiting_staff'])
                )
            );

        if (ticketCount.count > 0) {
            return fail(400, { error: 'Cannot delete organization with open tickets. Please close all tickets first.' });
        }

        try {
            // Delete invites first (cascade should handle, but being explicit)
            await db
                .delete(organizationInvites)
                .where(eq(organizationInvites.organizationId, params.id));

            // Delete members
            await db
                .delete(organizationMembers)
                .where(eq(organizationMembers.organizationId, params.id));

            // Delete organization
            await db
                .delete(organizations)
                .where(eq(organizations.id, params.id));

            return redirect(303, '/app/settings/organizations?deleted=true');
        } catch (err) {
            // Re-throw redirect errors
            if (err && typeof err === 'object' && 'status' in err && 'location' in err) throw err;

            console.error('Delete organization error:', err);
            return fail(500, { error: 'Failed to delete organization' });
        }
    }
};
