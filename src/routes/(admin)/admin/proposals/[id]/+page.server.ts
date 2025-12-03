/**
 * Admin Proposal Detail Server
 * 
 * Loads proposal data and handles admin actions (send, edit, etc).
 */

import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { proposals, projects, organizations, profiles } from '$lib/server/db/schema';
import { eq, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { proposalActivity, getClientIp } from '$lib/server/activity-logger';

export const load: PageServerLoad = async ({ params, locals }) => {
    // Verify admin/staff role
    if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        redirect(303, '/admin');
    }

    // Aliases for profiles
    const creatorProfile = alias(profiles, 'creator_profile');
    const assignedProfile = alias(profiles, 'assigned_profile');

    // Fetch the proposal
    const [proposal] = await db
        .select({
            id: proposals.id,
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
            createdById: proposals.createdById,
            createdByName: creatorProfile.displayName,
            assignedToId: proposals.assignedToId,
            assignedToName: assignedProfile.displayName,
            assignedToEmail: assignedProfile.email,
            createdAt: proposals.createdAt,
            updatedAt: proposals.updatedAt
        })
        .from(proposals)
        .leftJoin(projects, eq(proposals.projectId, projects.id))
        .leftJoin(organizations, eq(projects.organizationId, organizations.id))
        .leftJoin(creatorProfile, eq(proposals.createdById, creatorProfile.id))
        .leftJoin(assignedProfile, eq(proposals.assignedToId, assignedProfile.id))
        .where(eq(proposals.id, params.id))
        .limit(1);

    if (!proposal) {
        error(404, 'Proposal not found');
    }

    // Fetch available staff for assignment
    const staffMembers = await db
        .select({
            id: profiles.id,
            displayName: profiles.displayName,
            email: profiles.email,
            role: profiles.role
        })
        .from(profiles)
        .where(
            or(
                eq(profiles.role, 'super_admin'),
                eq(profiles.role, 'admin'),
                eq(profiles.role, 'staff')
            )
        )
        .orderBy(profiles.displayName);

    return {
        proposal: {
            ...proposal,
            organization: proposal.organizationName ?? 'Unknown',
            project: proposal.projectName,
            createdBy: proposal.createdByName ?? 'Unknown',
            assignedTo: proposal.assignedToId ? {
                id: proposal.assignedToId,
                name: proposal.assignedToName ?? 'Unknown',
                email: proposal.assignedToEmail
            } : null,
            total: parseFloat(proposal.total) || 0,
            subtotal: parseFloat(proposal.subtotal) || 0,
            taxRate: parseFloat(proposal.taxRate ?? '0') || 0,
            taxAmount: parseFloat(proposal.taxAmount ?? '0') || 0,
            discount: parseFloat(proposal.discount ?? '0') || 0
        },
        staffMembers
    };
};

export const actions: Actions = {
    assign: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Access denied' });
        }

        const formData = await request.formData();
        const assignedToId = formData.get('assignedToId') as string;

        // Get proposal title for activity log
        const [proposal] = await db.select({ title: proposals.title }).from(proposals).where(eq(proposals.id, params.id));

        await db
            .update(proposals)
            .set({
                assignedToId: assignedToId || null,
                updatedAt: new Date()
            })
            .where(eq(proposals.id, params.id));

        // Log activity
        let assigneeName: string | null = null;
        if (assignedToId) {
            const [assignee] = await db.select({ displayName: profiles.displayName }).from(profiles).where(eq(profiles.id, assignedToId));
            assigneeName = assignee?.displayName ?? null;
        }
        await proposalActivity.updated(params.id, proposal?.title ?? 'Unknown', { assignee: { old: null, new: assigneeName } }, locals.profile.id, getClientIp(request));

        return { success: true, message: 'Proposal assigned successfully' };
    },

    send: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Unauthorized' });
        }

        try {
            // Verify proposal exists and is in draft status
            const [proposal] = await db
                .select({ id: proposals.id, status: proposals.status, title: proposals.title })
                .from(proposals)
                .where(eq(proposals.id, params.id))
                .limit(1);

            if (!proposal) {
                return fail(404, { error: 'Proposal not found' });
            }

            if (proposal.status !== 'draft') {
                return fail(400, { error: 'Only draft proposals can be sent' });
            }

            await db
                .update(proposals)
                .set({
                    status: 'sent',
                    sentAt: new Date(),
                    updatedAt: new Date()
                })
                .where(eq(proposals.id, params.id));

            // Log activity
            await proposalActivity.sent(params.id, proposal.title, locals.profile.id, getClientIp(request));
            await proposalActivity.statusChanged(params.id, proposal.title, 'draft', 'sent', locals.profile.id, getClientIp(request));

            return { success: true, message: 'Proposal sent successfully' };
        } catch (err) {
            console.error('Send proposal error:', err);
            return fail(500, { error: 'Failed to send proposal' });
        }
    },

    withdraw: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Unauthorized' });
        }

        try {
            const [proposal] = await db
                .select({ id: proposals.id, status: proposals.status, title: proposals.title })
                .from(proposals)
                .where(eq(proposals.id, params.id))
                .limit(1);

            if (!proposal) {
                return fail(404, { error: 'Proposal not found' });
            }

            if (!['sent', 'viewed'].includes(proposal.status)) {
                return fail(400, { error: 'Only sent or viewed proposals can be withdrawn' });
            }

            await db
                .update(proposals)
                .set({
                    status: 'draft',
                    sentAt: null,
                    viewedAt: null,
                    updatedAt: new Date()
                })
                .where(eq(proposals.id, params.id));

            // Log activity
            await proposalActivity.statusChanged(params.id, proposal.title, proposal.status, 'draft', locals.profile.id, getClientIp(request));

            return { success: true, message: 'Proposal withdrawn' };
        } catch (err) {
            console.error('Withdraw proposal error:', err);
            return fail(500, { error: 'Failed to withdraw proposal' });
        }
    },

    delete: async ({ params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Only admins can delete proposals' });
        }

        try {
            await db
                .delete(proposals)
                .where(eq(proposals.id, params.id));

            redirect(303, '/admin/proposals');
        } catch (err) {
            if ((err as { status?: number }).status === 303) throw err;
            console.error('Delete proposal error:', err);
            return fail(500, { error: 'Failed to delete proposal' });
        }
    }
};
