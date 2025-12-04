import { db } from '$lib/server/db';
import { proposals, projects, organizations, profiles, organizationMembers } from '$lib/server/db/schema';
import { eq, and, inArray, or } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import { proposalActivity, getClientIp } from '$lib/server/activity-logger';
import { sendProposalAcceptedEmail, sendProposalRejectedEmail } from '$lib/server/email';
import { env } from '$env/dynamic/private';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || !locals.profile) {
        error(401, 'Unauthorized');
    }

    // Get user's organization IDs
    const userOrgs = await db
        .select({ organizationId: organizationMembers.organizationId })
        .from(organizationMembers)
        .where(eq(organizationMembers.profileId, locals.profile.id));

    const orgIds = userOrgs.map((o) => o.organizationId);

    if (orgIds.length === 0) {
        error(403, 'Not authorized to view this proposal');
    }

    // Fetch the proposal (joining through projects to get org)
    const [proposal] = await db
        .select({
            id: proposals.id,
            proposalNumber: proposals.proposalNumber,
            title: proposals.title,
            summary: proposals.summary,
            content: proposals.content,
            status: proposals.status,
            total: proposals.total,
            subtotal: proposals.subtotal,
            taxRate: proposals.taxRate,
            taxAmount: proposals.taxAmount,
            discount: proposals.discount,
            currency: proposals.currency,
            sentAt: proposals.sentAt,
            viewedAt: proposals.viewedAt,
            respondedAt: proposals.respondedAt,
            expiresAt: proposals.expiresAt,
            rejectionReason: proposals.rejectionReason,
            pdfUrl: proposals.pdfUrl,
            projectId: proposals.projectId,
            projectName: projects.name,
            organizationId: projects.organizationId,
            organizationName: organizations.name,
            orgNumber: organizations.orgNumber,
            createdById: proposals.createdById,
            createdByName: profiles.displayName,
            createdAt: proposals.createdAt,
            updatedAt: proposals.updatedAt
        })
        .from(proposals)
        .leftJoin(projects, eq(proposals.projectId, projects.id))
        .leftJoin(organizations, eq(projects.organizationId, organizations.id))
        .leftJoin(profiles, eq(proposals.createdById, profiles.id))
        .where(
            and(
                eq(proposals.id, params.id),
                inArray(projects.organizationId, orgIds)
            )
        )
        .limit(1);

    if (!proposal) {
        error(404, 'Proposal not found');
    }

    // Mark as viewed if sent and not yet viewed
    if (proposal.status === 'sent' && !proposal.viewedAt) {
        await db
            .update(proposals)
            .set({ viewedAt: new Date(), status: 'viewed' })
            .where(eq(proposals.id, params.id));
    }

    return {
        proposal: {
            ...proposal,
            proposalNumber: proposal.proposalNumber,
            orgNumber: proposal.orgNumber,
            organization: proposal.organizationName ?? 'Unknown',
            project: proposal.projectName,
            createdBy: proposal.createdByName ?? 'Unknown',
            total: parseFloat(proposal.total) || 0,
            subtotal: parseFloat(proposal.subtotal) || 0,
            taxRate: parseFloat(proposal.taxRate ?? '0') || 0,
            taxAmount: parseFloat(proposal.taxAmount ?? '0') || 0,
            discount: parseFloat(proposal.discount ?? '0') || 0
        }
    };
};

export const actions: Actions = {
    accept: async ({ params, locals, request }) => {
        if (!locals.user || !locals.profile) {
            error(401, 'Unauthorized');
        }

        // Get full proposal details for notification
        const [proposal] = await db
            .select({
                title: proposals.title,
                status: proposals.status,
                proposalNumber: proposals.proposalNumber,
                total: proposals.total,
                currency: proposals.currency,
                projectId: proposals.projectId,
                createdById: proposals.createdById
            })
            .from(proposals)
            .where(eq(proposals.id, params.id));

        await db
            .update(proposals)
            .set({
                status: 'accepted',
                respondedAt: new Date(),
                approvedById: locals.profile.id
            })
            .where(eq(proposals.id, params.id));

        // Log activity
        await proposalActivity.approved(params.id, proposal?.title ?? 'Unknown', locals.profile.id, getClientIp(request));
        await proposalActivity.statusChanged(params.id, proposal?.title ?? 'Unknown', proposal?.status ?? 'viewed', 'accepted', locals.profile.id, getClientIp(request));

        // Send email notification to staff/admins
        if (proposal?.projectId) {
            const [project] = await db
                .select({
                    organizationId: projects.organizationId,
                    organizationName: organizations.name
                })
                .from(projects)
                .leftJoin(organizations, eq(projects.organizationId, organizations.id))
                .where(eq(projects.id, proposal.projectId))
                .limit(1);

            // Notify staff members (admins and the proposal creator)
            const staffMembers = await db
                .select({
                    id: profiles.id,
                    name: profiles.displayName,
                    email: profiles.email
                })
                .from(profiles)
                .where(
                    or(
                        eq(profiles.role, 'super_admin'),
                        eq(profiles.role, 'admin'),
                        eq(profiles.id, proposal.createdById)
                    )
                );

            const proposalUrl = `${env.PUBLIC_SITE_URL || 'http://localhost:5173'}/admin/proposals/${params.id}`;

            for (const staff of staffMembers) {
                if (staff.email) {
                    await sendProposalAcceptedEmail({
                        recipientName: staff.name ?? 'Admin',
                        recipientEmail: staff.email,
                        proposalNumber: proposal.proposalNumber,
                        proposalTitle: proposal.title,
                        organizationName: project?.organizationName ?? 'Unknown',
                        total: proposal.total,
                        currency: proposal.currency ?? 'USD',
                        proposalUrl,
                        acceptedBy: locals.profile.displayName ?? locals.profile.email
                    });
                }
            }
        }

        return { success: true };
    },

    reject: async ({ params, locals, request }) => {
        if (!locals.user || !locals.profile) {
            error(401, 'Unauthorized');
        }

        const formData = await request.formData();
        const reason = formData.get('reason') as string;

        // Get full proposal details for notification
        const [proposal] = await db
            .select({
                title: proposals.title,
                status: proposals.status,
                proposalNumber: proposals.proposalNumber,
                total: proposals.total,
                currency: proposals.currency,
                projectId: proposals.projectId,
                createdById: proposals.createdById
            })
            .from(proposals)
            .where(eq(proposals.id, params.id));

        await db
            .update(proposals)
            .set({
                status: 'rejected',
                respondedAt: new Date(),
                rejectionReason: reason || null
            })
            .where(eq(proposals.id, params.id));

        // Log activity
        await proposalActivity.rejected(params.id, proposal?.title ?? 'Unknown', locals.profile.id, getClientIp(request));
        await proposalActivity.statusChanged(params.id, proposal?.title ?? 'Unknown', proposal?.status ?? 'viewed', 'rejected', locals.profile.id, getClientIp(request));

        // Send email notification to staff/admins
        if (proposal?.projectId) {
            const [project] = await db
                .select({
                    organizationId: projects.organizationId,
                    organizationName: organizations.name
                })
                .from(projects)
                .leftJoin(organizations, eq(projects.organizationId, organizations.id))
                .where(eq(projects.id, proposal.projectId))
                .limit(1);

            // Notify staff members (admins and the proposal creator)
            const staffMembers = await db
                .select({
                    id: profiles.id,
                    name: profiles.displayName,
                    email: profiles.email
                })
                .from(profiles)
                .where(
                    or(
                        eq(profiles.role, 'super_admin'),
                        eq(profiles.role, 'admin'),
                        eq(profiles.id, proposal.createdById)
                    )
                );

            const proposalUrl = `${env.PUBLIC_SITE_URL || 'http://localhost:5173'}/admin/proposals/${params.id}`;

            for (const staff of staffMembers) {
                if (staff.email) {
                    await sendProposalRejectedEmail({
                        recipientName: staff.name ?? 'Admin',
                        recipientEmail: staff.email,
                        proposalNumber: proposal.proposalNumber,
                        proposalTitle: proposal.title,
                        organizationName: project?.organizationName ?? 'Unknown',
                        total: proposal.total,
                        currency: proposal.currency ?? 'USD',
                        proposalUrl,
                        rejectedBy: locals.profile.displayName ?? locals.profile.email,
                        reason: reason || undefined
                    });
                }
            }
        }

        return { success: true };
    }
};
