import { db } from '$lib/server/db';
import { 
	projects, 
	profiles, 
	organizations, 
	proposals, 
	tickets, 
	invoices, 
	projectRevisions,
	activityLog
} from '$lib/server/db/schema';
import { eq, desc, and, or } from 'drizzle-orm';
import { alias } from 'drizzle-orm/pg-core';
import { error, fail, redirect } from '@sveltejs/kit';
import { projectActivity, getClientIp } from '$lib/server/activity-logger';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	if (!locals.user || !locals.profile) {
		throw redirect(302, '/auth/login');
	}

	// Verify admin/staff role
	if (!['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
		throw error(403, 'Access denied');
	}

	const projectId = params.id;

	// Aliases for joined tables
	const assignedProfile = alias(profiles, 'assigned_profile');
	const requestedByProfile = alias(profiles, 'requested_by');
	const revisionAssignedProfile = alias(profiles, 'revision_assigned');

	// Fetch the project with phase data
	const projectData = await db
		.select({
			id: projects.id,
			projectNumber: projects.projectNumber,
			name: projects.name,
			slug: projects.slug,
			description: projects.description,
			phase: projects.phase,
			status: projects.status,
			proposalStatus: projects.proposalStatus,
			clientAcceptedAt: projects.clientAcceptedAt,
			adminConfirmedAt: projects.adminConfirmedAt,
			startDate: projects.startDate,
			endDate: projects.endDate,
			completedAt: projects.completedAt,
			estimatedBudget: projects.estimatedBudget,
			actualBudget: projects.actualBudget,
			currency: projects.currency,
			assignedToId: projects.assignedToId,
			assignedToName: assignedProfile.displayName,
			assignedToEmail: assignedProfile.email,
			organizationId: projects.organizationId,
			organizationName: organizations.name,
			orgNumber: organizations.orgNumber,
			supportTierId: projects.supportTierId,
			supportStartedAt: projects.supportStartedAt,
			supportEndsAt: projects.supportEndsAt,
			createdAt: projects.createdAt,
			updatedAt: projects.updatedAt
		})
		.from(projects)
		.leftJoin(assignedProfile, eq(projects.assignedToId, assignedProfile.id))
		.leftJoin(organizations, eq(projects.organizationId, organizations.id))
		.where(eq(projects.id, projectId))
		.limit(1);

	if (!projectData.length) {
		throw error(404, 'Project not found');
	}

	const project = projectData[0];

	// Fetch related proposals
	const projectProposals = await db
		.select({
			id: proposals.id,
			proposalNumber: proposals.proposalNumber,
			title: proposals.title,
			status: proposals.status,
			total: proposals.total,
			currency: proposals.currency,
			createdAt: proposals.createdAt,
			sentAt: proposals.sentAt,
			viewedAt: proposals.viewedAt,
			respondedAt: proposals.respondedAt
		})
		.from(proposals)
		.where(eq(proposals.projectId, projectId))
		.orderBy(desc(proposals.createdAt));

	// Fetch related tickets
	const projectTickets = await db
		.select({
			id: tickets.id,
			ticketNumber: tickets.ticketNumber,
			subject: tickets.subject,
			status: tickets.status,
			priority: tickets.priority,
			createdAt: tickets.createdAt
		})
		.from(tickets)
		.where(eq(tickets.projectId, projectId))
		.orderBy(desc(tickets.createdAt));

	// Fetch related invoices
	const projectInvoices = await db
		.select({
			id: invoices.id,
			invoiceNumber: invoices.invoiceNumber,
			status: invoices.status,
			total: invoices.total,
			currency: invoices.currency,
			dueDate: invoices.dueDate,
			paidAt: invoices.paidAt,
			createdAt: invoices.createdAt
		})
		.from(invoices)
		.where(eq(invoices.projectId, projectId))
		.orderBy(desc(invoices.createdAt));

	// Fetch project revisions
	const revisions = await db
		.select({
			id: projectRevisions.id,
			version: projectRevisions.version,
			title: projectRevisions.title,
			description: projectRevisions.description,
			status: projectRevisions.status,
			priority: projectRevisions.priority,
			requestedById: projectRevisions.requestedById,
			requestedByName: requestedByProfile.displayName,
			assignedToId: projectRevisions.assignedToId,
			assignedToName: revisionAssignedProfile.displayName,
			createdAt: projectRevisions.createdAt,
			resolvedAt: projectRevisions.resolvedAt,
			resolutionNotes: projectRevisions.resolutionNotes
		})
		.from(projectRevisions)
		.leftJoin(requestedByProfile, eq(projectRevisions.requestedById, requestedByProfile.id))
		.leftJoin(revisionAssignedProfile, eq(projectRevisions.assignedToId, revisionAssignedProfile.id))
		.where(eq(projectRevisions.projectId, projectId))
		.orderBy(desc(projectRevisions.createdAt));

	// Fetch recent activity for this project
	const recentActivity = await db
		.select({
			id: activityLog.id,
			type: activityLog.type,
			description: activityLog.description,
			metadata: activityLog.metadata,
			createdAt: activityLog.createdAt,
			actorName: profiles.displayName
		})
		.from(activityLog)
		.leftJoin(profiles, eq(activityLog.actorId, profiles.id))
		.where(eq(activityLog.entityId, projectId))
		.orderBy(desc(activityLog.createdAt))
		.limit(20);

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
		project: {
			...project,
			organization: project.organizationName ?? 'Unknown',
			assignedTo: project.assignedToId
				? {
						id: project.assignedToId,
						name: project.assignedToName ?? 'Unknown',
						email: project.assignedToEmail
					}
				: null
		},
		proposals: projectProposals,
		tickets: projectTickets,
		invoices: projectInvoices,
		revisions: revisions.map((r) => ({
			...r,
			requestedBy: r.requestedById ? { name: r.requestedByName ?? 'Unknown' } : null,
			assignedTo: r.assignedToId ? { name: r.assignedToName ?? 'Unknown' } : null
		})),
		activity: recentActivity,
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

		const [project] = await db
			.select({ name: projects.name })
			.from(projects)
			.where(eq(projects.id, params.id));
		let assigneeName: string | null = null;
		if (assignedToId) {
			const [assignee] = await db
				.select({ displayName: profiles.displayName })
				.from(profiles)
				.where(eq(profiles.id, assignedToId));
			assigneeName = assignee?.displayName ?? null;
		}

		await db
			.update(projects)
			.set({
				assignedToId: assignedToId || null,
				updatedAt: new Date()
			})
			.where(eq(projects.id, params.id));

		await projectActivity.assigned(
			params.id,
			project?.name ?? 'Unknown',
			assigneeName,
			locals.profile.id,
			getClientIp(request)
		);

		return { success: true, message: 'Project assigned successfully' };
	},

	updatePhase: async ({ request, params, locals }) => {
		if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const action = formData.get('action') as string;

		const [project] = await db
			.select({ name: projects.name, phase: projects.phase })
			.from(projects)
			.where(eq(projects.id, params.id));
		const oldPhase = project?.phase ?? 'request';

		let newPhase = oldPhase;
		const updateData: Record<string, unknown> = { updatedAt: new Date() };

		switch (action) {
			case 'start_review':
				newPhase = 'review';
				break;
			case 'create_proposal':
				newPhase = 'proposal';
				updateData.proposalStatus = 'draft';
				break;
			case 'send_proposal':
				updateData.proposalStatus = 'sent';
				break;
			case 'confirm_start':
				newPhase = 'confirmed';
				updateData.proposalStatus = 'admin_confirmed';
				updateData.adminConfirmedAt = new Date();
				break;
			case 'start_building':
				newPhase = 'building';
				updateData.startDate = new Date();
				break;
			case 'mark_complete':
				newPhase = 'completed';
				updateData.completedAt = new Date();
				break;
			case 'enable_support':
				newPhase = 'support';
				updateData.supportStartedAt = new Date();
				break;
			case 'end_support':
				newPhase = 'completed';
				updateData.supportEndsAt = new Date();
				break;
			case 'decline':
				updateData.status = 'cancelled';
				break;
			case 'put_on_hold':
				updateData.status = 'on_hold';
				break;
		}

		if (newPhase !== oldPhase) {
			updateData.phase = newPhase;
		}

		await db.update(projects).set(updateData).where(eq(projects.id, params.id));

		await projectActivity.statusChanged(
			params.id,
			project?.name ?? 'Unknown',
			oldPhase,
			newPhase,
			locals.profile.id,
			getClientIp(request)
		);

		return { success: true, message: 'Phase updated successfully' };
	},

	updateDetails: async ({ request, params, locals }) => {
		if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const startDate = formData.get('startDate') as string;
		const endDate = formData.get('endDate') as string;
		const estimatedBudget = formData.get('estimatedBudget') as string;
		const actualBudget = formData.get('actualBudget') as string;

		await db
			.update(projects)
			.set({
				startDate: startDate ? new Date(startDate) : null,
				endDate: endDate ? new Date(endDate) : null,
				estimatedBudget: estimatedBudget || null,
				actualBudget: actualBudget || null,
				updatedAt: new Date()
			})
			.where(eq(projects.id, params.id));

		return { success: true, message: 'Details updated successfully' };
	},

	updateDescription: async ({ request, params, locals }) => {
		if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const description = formData.get('description') as string;

		await db
			.update(projects)
			.set({
				description: description || null,
				updatedAt: new Date()
			})
			.where(eq(projects.id, params.id));

		return { success: true, message: 'Description updated successfully' };
	},

	createRevision: async ({ request, params, locals }) => {
		if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const version = formData.get('version') as string;
		const priority = (formData.get('priority') as string) || 'medium';

		if (!title) {
			return fail(400, { error: 'Title is required' });
		}

		await db.insert(projectRevisions).values({
			projectId: params.id,
			title,
			description: description || null,
			version: version || null,
			priority: priority as 'low' | 'medium' | 'high' | 'urgent',
			requestedById: locals.profile.id,
			status: 'pending'
		});

		return { success: true, message: 'Revision created successfully' };
	},

	updateRevision: async ({ request, params, locals }) => {
		if (!locals.profile || !['admin', 'super_admin', 'staff'].includes(locals.profile.role ?? '')) {
			return fail(403, { error: 'Access denied' });
		}

		const formData = await request.formData();
		const revisionId = formData.get('revisionId') as string;
		const status = formData.get('status') as string;
		const resolutionNotes = formData.get('resolutionNotes') as string;
		const assignedToId = formData.get('assignedToId') as string;

		const updateData: Record<string, unknown> = { updatedAt: new Date() };

		if (status) {
			updateData.status = status;
			if (status === 'resolved' || status === 'declined') {
				updateData.resolvedAt = new Date();
			}
		}
		if (resolutionNotes !== undefined) {
			updateData.resolutionNotes = resolutionNotes || null;
		}
		if (assignedToId !== undefined) {
			updateData.assignedToId = assignedToId || null;
		}

		await db.update(projectRevisions).set(updateData).where(eq(projectRevisions.id, revisionId));

		return { success: true, message: 'Revision updated successfully' };
	}
};
