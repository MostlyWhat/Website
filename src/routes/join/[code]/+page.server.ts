import { createDb } from '$lib/server/db';
import {
    organizations,
    organizationInvites,
    organizationMembers,
    pendingOrganizationMembers
} from '$lib/server/db/schema';
import { eq, and, gt, or, sql } from 'drizzle-orm';
import { error, fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const code = params.code;

    // Create per-request database connection
    const db = createDb();

    // Fetch the invite
    const [invite] = await db
        .select({
            id: organizationInvites.id,
            organizationId: organizationInvites.organizationId,
            code: organizationInvites.code,
            email: organizationInvites.email,
            role: organizationInvites.role,
            maxUses: organizationInvites.maxUses,
            usedCount: organizationInvites.usedCount,
            expiresAt: organizationInvites.expiresAt,
            requiresApproval: organizationInvites.requiresApproval,
            organizationName: organizations.name,
            organizationSlug: organizations.slug
        })
        .from(organizationInvites)
        .innerJoin(organizations, eq(organizationInvites.organizationId, organizations.id))
        .where(eq(organizationInvites.code, code));

    if (!invite) {
        error(404, 'Invite not found or has been deleted');
    }

    // Check if expired
    if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
        error(410, 'This invite has expired');
    }

    // Check if exhausted
    if (invite.maxUses && invite.usedCount >= invite.maxUses) {
        error(410, 'This invite has reached its maximum uses');
    }

    // Check if user is already a member (if logged in)
    let alreadyMember = false;
    let pendingApproval = false;
    if (locals.profile) {
        const [existingMember] = await db
            .select()
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, invite.organizationId),
                    eq(organizationMembers.profileId, locals.profile.id)
                )
            );
        alreadyMember = !!existingMember;

        // Check if pending
        const [pending] = await db
            .select()
            .from(pendingOrganizationMembers)
            .where(
                and(
                    eq(pendingOrganizationMembers.organizationId, invite.organizationId),
                    eq(pendingOrganizationMembers.profileId, locals.profile.id),
                    eq(pendingOrganizationMembers.status, 'pending')
                )
            );
        pendingApproval = !!pending;
    }

    return {
        invite: {
            id: invite.id,
            code: invite.code,
            email: invite.email,
            role: invite.role,
            requiresApproval: invite.requiresApproval,
            organizationName: invite.organizationName,
            organizationSlug: invite.organizationSlug
        },
        isLoggedIn: !!locals.user,
        userEmail: locals.profile?.email,
        alreadyMember,
        pendingApproval
    };
};

export const actions: Actions = {
    join: async ({ request, params, locals }) => {
        if (!locals.user || !locals.profile) {
            redirect(302, `/auth/login?redirect=/join/${params.code}`);
        }

        const code = params.code;

        // Create per-request database connection
        const db = createDb();

        // Fetch and validate invite again
        const [invite] = await db
            .select()
            .from(organizationInvites)
            .where(eq(organizationInvites.code, code));

        if (!invite) {
            return fail(404, { error: 'Invite not found' });
        }

        // Check if expired
        if (invite.expiresAt && new Date(invite.expiresAt) < new Date()) {
            return fail(410, { error: 'This invite has expired' });
        }

        // Check if exhausted
        if (invite.maxUses && invite.usedCount >= invite.maxUses) {
            return fail(410, { error: 'This invite has reached its maximum uses' });
        }

        // Check email restriction
        if (invite.email && invite.email.toLowerCase() !== locals.profile.email.toLowerCase()) {
            return fail(403, { error: 'This invite is restricted to a different email address' });
        }

        // Check if already a member
        const [existingMember] = await db
            .select()
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.organizationId, invite.organizationId),
                    eq(organizationMembers.profileId, locals.profile.id)
                )
            );

        if (existingMember) {
            return fail(400, { error: 'You are already a member of this organization' });
        }

        // Check for pending request
        const [existingPending] = await db
            .select()
            .from(pendingOrganizationMembers)
            .where(
                and(
                    eq(pendingOrganizationMembers.organizationId, invite.organizationId),
                    eq(pendingOrganizationMembers.profileId, locals.profile.id),
                    eq(pendingOrganizationMembers.status, 'pending')
                )
            );

        if (existingPending) {
            return fail(400, { error: 'You already have a pending request to join this organization' });
        }

        if (invite.requiresApproval) {
            // Create pending member request
            await db.insert(pendingOrganizationMembers).values({
                organizationId: invite.organizationId,
                profileId: locals.profile.id,
                inviteId: invite.id,
                requestedRole: invite.role
            });

            // Increment used count
            await db
                .update(organizationInvites)
                .set({ usedCount: sql`${organizationInvites.usedCount} + 1` })
                .where(eq(organizationInvites.id, invite.id));

            return { success: true, pending: true };
        } else {
            // Add directly to organization
            await db.insert(organizationMembers).values({
                organizationId: invite.organizationId,
                profileId: locals.profile.id,
                role: invite.role
            });

            // Increment used count
            await db
                .update(organizationInvites)
                .set({ usedCount: sql`${organizationInvites.usedCount} + 1` })
                .where(eq(organizationInvites.id, invite.id));

            return { success: true, pending: false };
        }
    }
};
