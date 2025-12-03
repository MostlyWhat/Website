/**
 * Create Proposal Page Server
 * 
 * Loads necessary data and handles proposal creation.
 */

import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { proposals, projects, organizations } from '$lib/server/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { proposalActivity, getClientIp } from '$lib/server/activity-logger';

// Generate proposal number (e.g., PRP-2024-00001)
async function generateProposalNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `PRP-${year}-`;

    const [lastProposal] = await db
        .select({ proposalNumber: proposals.proposalNumber })
        .from(proposals)
        .where(sql`${proposals.proposalNumber} LIKE ${prefix + '%'}`)
        .orderBy(desc(proposals.proposalNumber))
        .limit(1);

    let nextNum = 1;
    if (lastProposal) {
        const match = lastProposal.proposalNumber.match(/PRP-\d{4}-(\d+)/);
        if (match) {
            nextNum = parseInt(match[1], 10) + 1;
        }
    }

    return `${prefix}${nextNum.toString().padStart(5, '0')}`;
}

export const load: PageServerLoad = async ({ locals }) => {
    // Verify admin/staff role
    if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
        redirect(303, '/admin');
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

    return {
        projects: allProjects.map(p => ({
            id: p.id,
            name: p.name,
            organization: p.organizationName ?? 'Unknown',
            status: p.status
        }))
    };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();

        const projectId = formData.get('projectId') as string;
        const title = formData.get('title') as string;
        const summary = formData.get('summary') as string;

        // Line items from JSON
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

            // Generate proposal number
            const proposalNumber = await generateProposalNumber();

            // Create the proposal
            const [newProposal] = await db
                .insert(proposals)
                .values({
                    projectId,
                    proposalNumber,
                    title: title.trim(),
                    summary: summary?.trim() || null,
                    content: { lineItems, sections },
                    subtotal: String(subtotal),
                    taxRate: String(taxRate),
                    taxAmount: String(taxAmount),
                    discount: String(discount),
                    total: String(total),
                    currency: 'USD',
                    status: 'draft',
                    expiresAt: expiresAtStr ? new Date(expiresAtStr) : null,
                    createdById: locals.profile.id
                })
                .returning({ id: proposals.id });

            // Log activity
            await proposalActivity.created(newProposal.id, title.trim(), locals.profile.id, getClientIp(request));

            redirect(303, `/admin/proposals/${newProposal.id}`);
        } catch (err) {
            if ((err as { status?: number }).status === 303) throw err; // Re-throw redirect
            console.error('Create proposal error:', err);
            return fail(500, { error: 'Failed to create proposal' });
        }
    },

    saveDraft: async ({ request, locals }) => {
        // Same as create but explicitly sets status to draft
        if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
            return fail(403, { error: 'Unauthorized' });
        }

        const formData = await request.formData();

        const projectId = formData.get('projectId') as string;
        const title = formData.get('title') as string;
        const summary = formData.get('summary') as string;
        const lineItemsJson = formData.get('lineItems') as string;
        const sectionsJson = formData.get('sections') as string;
        const subtotalStr = formData.get('subtotal') as string;
        const taxRateStr = formData.get('taxRate') as string;
        const discountStr = formData.get('discount') as string;
        const expiresAtStr = formData.get('expiresAt') as string;

        if (!projectId) {
            return fail(400, { error: 'Project is required' });
        }
        if (!title?.trim()) {
            return fail(400, { error: 'Title is required' });
        }

        try {
            let lineItems: Array<{ description: string; quantity: number; unitPrice: number; total: number }> = [];
            let sections: Array<{ title: string; content: string; order: number }> = [];

            try {
                if (lineItemsJson) lineItems = JSON.parse(lineItemsJson);
                if (sectionsJson) sections = JSON.parse(sectionsJson);
            } catch {
                return fail(400, { error: 'Invalid line items or sections format' });
            }

            const subtotal = parseFloat(subtotalStr) || 0;
            const taxRate = parseFloat(taxRateStr) || 0;
            const discount = parseFloat(discountStr) || 0;
            const taxAmount = subtotal * (taxRate / 100);
            const total = subtotal + taxAmount - discount;

            // Generate proposal number
            const proposalNumber = await generateProposalNumber();

            const [newProposal] = await db
                .insert(proposals)
                .values({
                    projectId,
                    proposalNumber,
                    title: title.trim(),
                    summary: summary?.trim() || null,
                    content: { lineItems, sections },
                    subtotal: String(subtotal),
                    taxRate: String(taxRate),
                    taxAmount: String(taxAmount),
                    discount: String(discount),
                    total: String(total),
                    currency: 'USD',
                    status: 'draft',
                    expiresAt: expiresAtStr ? new Date(expiresAtStr) : null,
                    createdById: locals.profile.id
                })
                .returning({ id: proposals.id });

            // Log activity for draft save
            await proposalActivity.created(newProposal.id, title.trim(), locals.profile.id, getClientIp(request));

            return { success: true, proposalId: newProposal.id };
        } catch (err) {
            console.error('Save draft error:', err);
            return fail(500, { error: 'Failed to save draft' });
        }
    }
};
