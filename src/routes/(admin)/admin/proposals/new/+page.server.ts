/**
 * Create Proposal Page Server
 * 
 * Loads necessary data and handles proposal creation.
 */

import { fail, redirect, error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { proposals, projects, organizations } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

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

            // Create the proposal
            const [newProposal] = await db
                .insert(proposals)
                .values({
                    projectId,
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

            const [newProposal] = await db
                .insert(proposals)
                .values({
                    projectId,
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

            return { success: true, proposalId: newProposal.id };
        } catch (err) {
            console.error('Save draft error:', err);
            return fail(500, { error: 'Failed to save draft' });
        }
    }
};
