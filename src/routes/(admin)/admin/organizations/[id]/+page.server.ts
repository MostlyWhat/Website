import { createDb } from '$lib/server/db';
import {
    organizations,
    organizationMembers,
    organizationInvites,
    pendingOrganizationMembers,
    profiles,
    projects
} from '$lib/server/db/schema';
import { eq, desc, and, gt } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { error, fail, redirect } from '@sveltejs/kit';
import { organizationActivity, getClientIp } from '$lib/server/activity-logger';
import type { PageServerLoad, Actions } from './$types';

// Generate a random invite code
function generateInviteCode(length: number = 12): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || !locals.profile) {
        redirect(302, '/auth/login');
    }

    // Verify admin role
    if (!['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
        error(403, 'Access denied');
    }

    const orgId = params.id;

    // Create per-request database connection
    const db = createDb();

    // Fetch organization
    const [org] = await db
        .select()
        .from(organizations)
        .where(eq(organizations.id, orgId));

    if (!org) {
        error(404, 'Organization not found');
    }

    // Fetch members with profile info
    const membersData = await db
        .select({
            profileId: organizationMembers.profileId,
            role: organizationMembers.role,
            joinedAt: organizationMembers.createdAt,
            displayName: profiles.displayName,
            email: profiles.email
        })
        .from(organizationMembers)
        .innerJoin(profiles, eq(organizationMembers.profileId, profiles.id))
        .where(eq(organizationMembers.organizationId, orgId))
        .orderBy(desc(organizationMembers.createdAt));

    // Fetch active invites
    const invitesData = await db
        .select({
            id: organizationInvites.id,
            code: organizationInvites.code,
            email: organizationInvites.email,
            role: organizationInvites.role,
            maxUses: organizationInvites.maxUses,
            usedCount: organizationInvites.usedCount,
            expiresAt: organizationInvites.expiresAt,
            requiresApproval: organizationInvites.requiresApproval,
            createdAt: organizationInvites.createdAt,
            createdByName: profiles.displayName
        })
        .from(organizationInvites)
        .leftJoin(profiles, eq(organizationInvites.createdById, profiles.id))
        .where(eq(organizationInvites.organizationId, orgId))
        .orderBy(desc(organizationInvites.createdAt));

    // Fetch pending members
    const reviewerProfile = alias(profiles, 'reviewer');
    const pendingData = await db
        .select({
            id: pendingOrganizationMembers.id,
            profileId: pendingOrganizationMembers.profileId,
            requestedRole: pendingOrganizationMembers.requestedRole,
            status: pendingOrganizationMembers.status,
            createdAt: pendingOrganizationMembers.createdAt,
            reviewedAt: pendingOrganizationMembers.reviewedAt,
            rejectionReason: pendingOrganizationMembers.rejectionReason,
            displayName: profiles.displayName,
            email: profiles.email,
            reviewedByName: reviewerProfile.displayName
        })
        .from(pendingOrganizationMembers)
        .innerJoin(profiles, eq(pendingOrganizationMembers.profileId, profiles.id))
        .leftJoin(reviewerProfile, eq(pendingOrganizationMembers.reviewedById, reviewerProfile.id))
        .where(eq(pendingOrganizationMembers.organizationId, orgId))
        .orderBy(desc(pendingOrganizationMembers.createdAt));

    // Fetch projects
    const projectsData = await db
        .select({
            id: projects.id,
            name: projects.name,
            status: projects.status,
            createdAt: projects.createdAt
        })
        .from(projects)
        .where(eq(projects.organizationId, orgId))
        .orderBy(desc(projects.createdAt))
        .limit(10);

    return {
        organization: org,
        members: membersData,
        invites: invitesData,
        pendingMembers: pendingData,
        projects: projectsData
    };
};

export const actions: Actions = {
    createInvite: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const email = formData.get('email') as string | null;
        const role = (formData.get('role') as string) || 'member';
        const maxUses = parseInt(formData.get('maxUses') as string) || 1;
        const expiresIn = formData.get('expiresIn') as string; // '1day', '7days', '30days', 'never'
        const requiresApproval = formData.get('requiresApproval') === 'true';

        // Generate unique code
        const code = generateInviteCode(12);

        // Calculate expiration
        let expiresAt: Date | null = null;
        if (expiresIn !== 'never') {
            expiresAt = new Date();
            switch (expiresIn) {
                case '1day':
                    expiresAt.setDate(expiresAt.getDate() + 1);
                    break;
                case '7days':
                    expiresAt.setDate(expiresAt.getDate() + 7);
                    break;
                case '30days':
                    expiresAt.setDate(expiresAt.getDate() + 30);
                    break;
            }
        }

        // Create per-request database connection
        const db = createDb();

        await db.insert(organizationInvites).values({
            organizationId: params.id,
            code,
            email: email?.trim() || null,
            role,
            maxUses,
            requiresApproval,
            expiresAt,
            createdById: locals.profile.id
        });

        // Log activity
        const [org] = await db.select({ name: organizations.name }).from(organizations).where(eq(organizations.id, params.id));
        await organizationActivity.inviteCreated(params.id, org?.name ?? 'Unknown', code, locals.profile.id, getClientIp(request));

        return { success: true, message: 'Invite created successfully', code };
    },

    deleteInvite: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const inviteId = formData.get('inviteId') as string;

        // Create per-request database connection
        const db = createDb();

        // Get invite code for logging
        const [invite] = await db.select({ code: organizationInvites.code }).from(organizationInvites).where(eq(organizationInvites.id, inviteId));
        const [org] = await db.select({ name: organizations.name }).from(organizations).where(eq(organizations.id, params.id));

        await db
            .delete(organizationInvites)
            .where(
                and(
                    eq(organizationInvites.id, inviteId),
                    eq(organizationInvites.organizationId, params.id)
                )
            );

        // Log activity
        await organizationActivity.inviteDeleted(params.id, org?.name ?? 'Unknown', invite?.code ?? 'Unknown', locals.profile.id, getClientIp(request));

        return { success: true, message: 'Invite deleted' };
    },

    approveMember: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const pendingId = formData.get('pendingId') as string;

        // Create per-request database connection
        const db = createDb();

        // Get pending member
        const [pending] = await db
            .select()
            .from(pendingOrganizationMembers)
            .where(
                and(
                    eq(pendingOrganizationMembers.id, pendingId),
                    eq(pendingOrganizationMembers.organizationId, params.id)
                )
            );

        if (!pending) {
            return fail(404, { error: 'Pending member not found' });
        }

        // Get org and user info for logging
        const [org] = await db.select({ name: organizations.name }).from(organizations).where(eq(organizations.id, params.id));
        const [user] = await db.select({ email: profiles.email }).from(profiles).where(eq(profiles.id, pending.profileId));

        // Add to organization members
        await db.insert(organizationMembers).values({
            organizationId: params.id,
            profileId: pending.profileId,
            role: pending.requestedRole
        });

        // Update pending status
        await db
            .update(pendingOrganizationMembers)
            .set({
                status: 'approved',
                reviewedById: locals.profile.id,
                reviewedAt: new Date()
            })
            .where(eq(pendingOrganizationMembers.id, pendingId));

        // Log activity
        await organizationActivity.memberApproved(params.id, org?.name ?? 'Unknown', user?.email ?? 'Unknown', locals.profile.id, getClientIp(request));

        return { success: true, message: 'Member approved' };
    },

    rejectMember: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const pendingId = formData.get('pendingId') as string;
        const reason = formData.get('reason') as string;

        // Create per-request database connection
        const db = createDb();

        // Get pending member info for logging
        const [pending] = await db
            .select({ profileId: pendingOrganizationMembers.profileId })
            .from(pendingOrganizationMembers)
            .where(eq(pendingOrganizationMembers.id, pendingId));
        const [org] = await db.select({ name: organizations.name }).from(organizations).where(eq(organizations.id, params.id));
        const [user] = pending ? await db.select({ email: profiles.email }).from(profiles).where(eq(profiles.id, pending.profileId)) : [null];

        await db
            .update(pendingOrganizationMembers)
            .set({
                status: 'rejected',
                reviewedById: locals.profile.id,
                reviewedAt: new Date(),
                rejectionReason: reason || null
            })
            .where(
                and(
                    eq(pendingOrganizationMembers.id, pendingId),
                    eq(pendingOrganizationMembers.organizationId, params.id)
                )
            );

        // Log activity
        await organizationActivity.memberRejected(params.id, org?.name ?? 'Unknown', user?.email ?? 'Unknown', reason || null, locals.profile.id, getClientIp(request));

        return { success: true, message: 'Member rejected' };
    },

    removeMember: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const profileId = formData.get('profileId') as string;

        // Create per-request database connection
        const db = createDb();

        // Get info for activity log
        const [org] = await db.select({ name: organizations.name }).from(organizations).where(eq(organizations.id, params.id));
        const [member] = await db.select({ email: profiles.email }).from(profiles).where(eq(profiles.id, profileId));

        await db
            .delete(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.profileId, profileId),
                    eq(organizationMembers.organizationId, params.id)
                )
            );

        // Log activity
        await organizationActivity.memberRemoved(params.id, org?.name ?? 'Unknown', member?.email ?? 'Unknown', locals.profile.id, getClientIp(request));

        return { success: true, message: 'Member removed' };
    },

    updateMemberRole: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const profileId = formData.get('profileId') as string;
        const role = formData.get('role') as string;

        // Create per-request database connection
        const db = createDb();

        // Get current role and user info for logging
        const [currentMember] = await db.select({ role: organizationMembers.role }).from(organizationMembers).where(and(eq(organizationMembers.profileId, profileId), eq(organizationMembers.organizationId, params.id)));
        const [org] = await db.select({ name: organizations.name }).from(organizations).where(eq(organizations.id, params.id));
        const [user] = await db.select({ email: profiles.email }).from(profiles).where(eq(profiles.id, profileId));

        await db
            .update(organizationMembers)
            .set({ role })
            .where(
                and(
                    eq(organizationMembers.profileId, profileId),
                    eq(organizationMembers.organizationId, params.id)
                )
            );

        // Log activity
        await organizationActivity.roleUpdated(params.id, org?.name ?? 'Unknown', user?.email ?? 'Unknown', currentMember?.role ?? 'Unknown', role, locals.profile.id, getClientIp(request));

        return { success: true, message: 'Role updated' };
    },

    addMember: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const email = formData.get('email') as string;
        const role = (formData.get('role') as string) || 'member';

        if (!email || !email.includes('@')) {
            return fail(400, { error: 'Please provide a valid email address' });
        }

        // Create per-request database connection
        const db = createDb();

        // Find the user by email
        const [user] = await db
            .select({ id: profiles.id, email: profiles.email })
            .from(profiles)
            .where(eq(profiles.email, email.trim().toLowerCase()));

        if (!user) {
            return fail(404, { error: 'No user found with this email. They must have an account first.' });
        }

        // Check if already a member
        const [existing] = await db
            .select()
            .from(organizationMembers)
            .where(
                and(
                    eq(organizationMembers.profileId, user.id),
                    eq(organizationMembers.organizationId, params.id)
                )
            );

        if (existing) {
            return fail(400, { error: 'This user is already a member of this organization' });
        }

        // Add the member
        await db.insert(organizationMembers).values({
            organizationId: params.id,
            profileId: user.id,
            role
        });

        // Log activity
        const [org] = await db.select({ name: organizations.name }).from(organizations).where(eq(organizations.id, params.id));
        await organizationActivity.memberAdded(params.id, org?.name ?? 'Unknown', user.email, locals.profile.id, getClientIp(request));

        return { success: true, message: `${user.email} has been added to the organization` };
    }
};

