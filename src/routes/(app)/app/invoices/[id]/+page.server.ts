import { createDb } from '$lib/server/db';
import { invoices, organizations, projects, organizationMembers, paymentEvidence, profiles } from '$lib/server/db/schema';
import { eq, and, inArray, desc, sql } from 'drizzle-orm';
import { error, fail } from '@sveltejs/kit';
import { invoiceActivity, getClientIp } from '$lib/server/utils/activity-logger';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    const db = createDb();
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
        error(403, 'Not authorized to view this invoice');
    }

    // Fetch the invoice
    const [invoice] = await db
        .select({
            id: invoices.id,
            invoiceNumber: invoices.invoiceNumber,
            title: invoices.title,
            description: invoices.description,
            status: invoices.status,
            total: invoices.total,
            subtotal: invoices.subtotal,
            taxRate: invoices.taxRate,
            taxAmount: invoices.taxAmount,
            discount: invoices.discount,
            amountPaid: invoices.amountPaid,
            amountDue: invoices.amountDue,
            currency: invoices.currency,
            issueDate: invoices.issueDate,
            dueDate: invoices.dueDate,
            paidAt: invoices.paidAt,
            lineItems: invoices.lineItems,
            notes: invoices.notes,
            organizationId: invoices.organizationId,
            organizationName: organizations.name,
            projectId: invoices.projectId,
            projectName: projects.name
        })
        .from(invoices)
        .leftJoin(organizations, eq(invoices.organizationId, organizations.id))
        .leftJoin(projects, eq(invoices.projectId, projects.id))
        .where(
            and(
                eq(invoices.id, params.id),
                inArray(invoices.organizationId, orgIds)
            )
        )
        .limit(1);

    if (!invoice) {
        error(404, 'Invoice not found');
    }

    // Fetch payment evidence for this invoice
    const evidenceList = await db
        .select({
            id: paymentEvidence.id,
            fileName: paymentEvidence.fileName,
            fileUrl: paymentEvidence.fileUrl,
            fileSize: paymentEvidence.fileSize,
            amount: paymentEvidence.amount,
            paymentDate: paymentEvidence.paymentDate,
            paymentMethod: paymentEvidence.paymentMethod,
            transactionReference: paymentEvidence.transactionReference,
            notes: paymentEvidence.notes,
            status: paymentEvidence.status,
            adminNotes: paymentEvidence.adminNotes,
            reviewedAt: paymentEvidence.reviewedAt,
            reviewedByName: sql<string | null>`CASE WHEN ${profiles.firstName} IS NOT NULL AND ${profiles.lastName} IS NOT NULL THEN ${profiles.firstName} || ' ' || ${profiles.lastName} ELSE NULL END`,
            createdAt: paymentEvidence.createdAt
        })
        .from(paymentEvidence)
        .leftJoin(profiles, eq(paymentEvidence.reviewedById, profiles.id))
        .where(eq(paymentEvidence.invoiceId, params.id))
        .orderBy(desc(paymentEvidence.createdAt));

    return {
        invoice: {
            ...invoice,
            organization: invoice.organizationName ?? 'Unknown',
            project: invoice.projectName,
            total: parseFloat(invoice.total) || 0,
            subtotal: parseFloat(invoice.subtotal) || 0,
            taxRate: parseFloat(invoice.taxRate ?? '0') || 0,
            taxAmount: parseFloat(invoice.taxAmount ?? '0') || 0,
            discount: parseFloat(invoice.discount ?? '0') || 0,
            amountPaid: parseFloat(invoice.amountPaid) || 0,
            amountDue: parseFloat(invoice.amountDue) || 0
        },
        paymentEvidence: evidenceList.map((e) => ({
            ...e,
            amount: e.amount ? parseFloat(e.amount) : null,
            reviewedBy: e.reviewedByName ?? null
        }))
    };
};

export const actions: Actions = {
    submitEvidence: async ({ params, request, locals }) => {
        if (!locals.user || !locals.profile) {
            return fail(401, { error: 'Unauthorized' });
        }

        const formData = await request.formData();
        const fileUrl = formData.get('fileUrl') as string;
        const fileName = formData.get('fileName') as string;
        const fileSize = formData.get('fileSize') as string;
        const fileType = formData.get('fileType') as string;
        const amount = formData.get('amount') as string;
        const paymentDate = formData.get('paymentDate') as string;
        const paymentMethod = formData.get('paymentMethod') as string;
        const transactionReference = formData.get('transactionReference') as string;
        const notes = formData.get('notes') as string;

        if (!fileUrl || !fileName) {
            return fail(400, { error: 'File upload is required' });
        }

        const db = createDb();

        // Verify user has access to this invoice
        const userOrgs = await db
            .select({ organizationId: organizationMembers.organizationId })
            .from(organizationMembers)
            .where(eq(organizationMembers.profileId, locals.profile.id));

        const orgIds = userOrgs.map((o) => o.organizationId);

        const [invoice] = await db
            .select({
                id: invoices.id,
                invoiceNumber: invoices.invoiceNumber,
                organizationId: invoices.organizationId
            })
            .from(invoices)
            .where(
                and(
                    eq(invoices.id, params.id),
                    inArray(invoices.organizationId, orgIds)
                )
            )
            .limit(1);

        if (!invoice) {
            return fail(403, { error: 'Not authorized to submit evidence for this invoice' });
        }

        try {
            // Insert payment evidence
            await db.insert(paymentEvidence).values({
                invoiceId: params.id,
                fileName,
                fileUrl,
                fileSize: fileSize ? parseInt(fileSize) : null,
                fileType: fileType || null,
                amount: amount || null,
                paymentDate: paymentDate ? new Date(paymentDate) : null,
                paymentMethod: paymentMethod || null,
                transactionReference: transactionReference || null,
                notes: notes || null,
                status: 'pending',
                submittedById: locals.profile.id
            });

            // Log activity
            await invoiceActivity.created(
                params.id,
                invoice.invoiceNumber,
                locals.profile.id,
                getClientIp(request),
                {
                    action: 'payment_evidence_submitted',
                    fileName,
                    amount: amount || 'Not specified'
                }
            );

            return {
                success: true,
                message: 'Payment evidence submitted successfully. Our team will review it shortly.'
            };
        } catch (err) {
            console.error('Error submitting payment evidence:', err);
            return fail(500, { error: 'Failed to submit payment evidence' });
        }
    }
};
