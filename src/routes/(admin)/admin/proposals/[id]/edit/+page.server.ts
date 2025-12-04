/**
 * Edit Proposal Page Server
 * 
 * Loads proposal data and handles proposal updates.
 * Only draft proposals can be edited.
 */

import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { proposals, projects, organizations } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';
import { proposalActivity, getClientIp } from '$lib/server/activity-logger';

export const load: PageServerLoad = async ({ params, locals }) => {
    // Verify admin/staff role
    if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        throw redirect(303, '/admin');
    }

    // Fetch the proposal
    const [proposal] = await db
        .select({
            id: proposals.id,
            projectId: proposals.projectId,
            proposalNumber: proposals.proposalNumber,
            title: proposals.title,
            summary: proposals.summary,
            content: proposals.content,
            status: proposals.status,
            subtotal: proposals.subtotal,
            taxRate: proposals.taxRate,
            discount: proposals.discount,
            expiresAt: proposals.expiresAt,
            projectName: projects.name,
            organizationName: organizations.name
        })
        .from(proposals)
        .leftJoin(projects, eq(proposals.projectId, projects.id))
        .leftJoin(organizations, eq(projects.organizationId, organizations.id))
        .where(eq(proposals.id, params.id))
        .limit(1);

    if (!proposal) {
        error(404, 'Proposal not found');
    }

    // Only draft proposals can be edited
    if (proposal.status !== 'draft') {
        error(403, 'Only draft proposals can be edited');
    }

    // Fetch all projects (for the project selector)
    const allProjects = await db
        .select({
            id: projects.id,
            name: projects.name,
            organizationId: projects.organizationId,
            organizationName: organizations.name,
            status: projects.status
        })
        .from(projects)
        .leftJoin(organizations, eq(projects.organizationId, organizations.id))
        .orderBy(desc(projects.updatedAt));

    // Parse content
    const content = proposal.content as {
        lineItems?: Array<{ description: string; quantity: number; unitPrice: number; total: number }>;
        sections?: Array<{ title: string; content: string; order: number }>;
    } | null;

    return {
        proposal: {
            ...proposal,
            subtotal: parseFloat(proposal.subtotal) || 0,
            taxRate: parseFloat(proposal.taxRate ?? '0') || 0,
            discount: parseFloat(proposal.discount ?? '0') || 0,
            lineItems: content?.lineItems ?? [],
            sections: content?.sections ?? [],
            expiresAt: proposal.expiresAt ? proposal.expiresAt.toISOString().split('T')[0] : ''
        },
        projects: allProjects.map((p) => ({
            id: p.id,
            name: p.name,
            organization: p.organizationName ?? 'Unknown',
            status: p.status
        }))
    };
};

export const actions: Actions = {
    update: async ({ request, params, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();

        const projectId = formData.get('projectId') as string;
        const title = formData.get('title') as string;
        const summary = formData.get('summary') as string;

        // Line items and sections from JSON
        const lineItemsJson = formData.get('lineItems') as string;
        const sectionsJson = formData.get('sections') as string;

        // Pricing
        const subtotalStr = formData.get('subtotal') as string;
        const taxRateStr = formData.get('taxRate') as string;
        const discountStr = formData.get('discount') as string;

        // Expiry
        const expiresAtStr = formData.get('expiresAt') as string;

        // Validation
        if (!projectId) {
            return fail(400, { error: 'Project is required' });
        }
        if (!title?.trim()) {
            return fail(400, { error: 'Title is required' });
        }

        try {
            // Verify proposal exists and is in draft status
            const [existingProposal] = await db
                .select({ id: proposals.id, status: proposals.status, title: proposals.title })
                .from(proposals)
                .where(eq(proposals.id, params.id))
                .limit(1);

            if (!existingProposal) {
                return fail(404, { error: 'Proposal not found' });
            }

            if (existingProposal.status !== 'draft') {
                return fail(400, { error: 'Only draft proposals can be edited' });
            }

            // Parse line items and sections
            let lineItems: Array<{ description: string; quantity: number; unitPrice: number; total: number }> = [];
            let sections: Array<{ title: string; content: string; order: number }> = [];

            try {
                if (lineItemsJson) lineItems = JSON.parse(lineItemsJson);
                if (sectionsJson) sections = JSON.parse(sectionsJson);
            } catch {
                return fail(400, { error: 'Invalid line items or sections format' });
            }

            // Calculate totals
            const subtotal = parseFloat(subtotalStr) || 0;
            const taxRate = parseFloat(taxRateStr) || 0;
            const discount = parseFloat(discountStr) || 0;
            const taxAmount = subtotal * (taxRate / 100);
            const total = subtotal + taxAmount - discount;

            // Update the proposal
            await db
                .update(proposals)
                .set({
                    projectId,
                    title: title.trim(),
                    summary: summary?.trim() || null,
                    content: { lineItems, sections },
                    subtotal: String(subtotal),
                    taxRate: String(taxRate),
                    taxAmount: String(taxAmount),
                    discount: String(discount),
                    total: String(total),
                    expiresAt: expiresAtStr ? new Date(expiresAtStr) : null,
                    updatedAt: new Date()
                })
                .where(eq(proposals.id, params.id));

            // Log activity
            await proposalActivity.updated(
                params.id,
                title.trim(),
                { content: { old: 'previous', new: 'updated' } },
                locals.profile.id,
                getClientIp(request)
            );

            return redirect(303, `/admin/proposals/${params.id}`);
        } catch (err) {
            // Re-throw redirect errors
            if (err && typeof err === 'object' && 'status' in err && 'location' in err) throw err;
            console.error('Update proposal error:', err);
            return fail(500, { error: 'Failed to update proposal' });
        }
    }
};
