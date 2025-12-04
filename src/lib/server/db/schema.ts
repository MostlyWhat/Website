/**
 * Database Schema - MostlyWhat Systems CRM
 * 
 * This schema defines all tables for the project management, billing, and ticketing system.
 * Uses Drizzle ORM with PostgreSQL (Supabase).
 * 
 * Table Relationships:
 * - Users (from Supabase Auth) -> Profiles (1:1)
 * - Profiles -> Organizations (M:N through organization_members)
 * - Organizations -> Projects (1:M)
 * - Projects -> Proposals (1:M)
 * - Projects -> Invoices (1:M)
 * - Organizations -> Tickets (1:M)
 */

import {
	pgTable,
	pgEnum,
	uuid,
	text,
	timestamp,
	boolean,
	integer,
	decimal,
	jsonb,
	primaryKey
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { authUsers } from 'drizzle-orm/supabase';

// =============================================================================
// ENUMS
// =============================================================================

export const userRoleEnum = pgEnum('user_role', ['super_admin', 'admin', 'staff', 'customer']);

// 7-Phase Project Lifecycle
export const projectPhaseEnum = pgEnum('project_phase', [
	'request',      // Phase 01: Client submitted request
	'review',       // Phase 02: Admin reviewing
	'proposal',     // Phase 03: Proposal being created/sent
	'confirmed',    // Phase 04: Both parties confirmed
	'building',     // Phase 05: Active development
	'completed',    // Phase 06: Project delivered
	'support'       // Phase 07: Ongoing support
]);

// Proposal confirmation status (sub-status for Phase 03-04)
export const proposalConfirmationStatusEnum = pgEnum('proposal_confirmation_status', [
	'draft',              // Not yet sent
	'sent',               // Sent to client
	'viewed',             // Client viewed
	'client_accepted',    // Client accepted, awaiting admin
	'admin_confirmed',    // Both confirmed (triggers phase change)
	'rejected',           // Client rejected
	'expired'             // Proposal expired
]);

// Revision status for project revisions
export const revisionStatusEnum = pgEnum('revision_status', [
	'pending',      // Revision requested
	'in_progress',  // Being worked on
	'resolved',     // Completed
	'declined'      // Won't fix
]);

// Legacy project status (kept for backwards compatibility during migration)
export const projectStatusEnum = pgEnum('project_status', [
	'draft',
	'proposal_sent',
	'proposal_accepted',
	'proposal_rejected',
	'in_progress',
	'on_hold',
	'completed',
	'cancelled'
]);

export const proposalStatusEnum = pgEnum('proposal_status', [
	'draft',
	'sent',
	'viewed',
	'accepted',
	'rejected',
	'expired',
	'revised'
]);

export const invoiceStatusEnum = pgEnum('invoice_status', [
	'draft',
	'sent',
	'viewed',
	'paid',
	'partially_paid',
	'overdue',
	'cancelled',
	'refunded'
]);

export const ticketStatusEnum = pgEnum('ticket_status', [
	'open',
	'in_progress',
	'awaiting_customer',
	'awaiting_staff',
	'resolved',
	'closed'
]);

export const ticketPriorityEnum = pgEnum('ticket_priority', ['low', 'medium', 'high', 'urgent']);

export const ticketScopeEnum = pgEnum('ticket_scope', ['organization', 'personal']);

export const customerTypeEnum = pgEnum('customer_type', ['personal', 'business', 'enterprise']);

export const activityTypeEnum = pgEnum('activity_type', [
	'created',
	'updated',
	'status_changed',
	'comment_added',
	'file_uploaded',
	'email_sent',
	'payment_received',
	'assigned',
	'approved',
	'rejected'
]);

// =============================================================================
// PROFILES TABLE
// =============================================================================
// Extends Supabase Auth users with additional profile information

export const profiles = pgTable('profiles', {
	id: uuid('id').primaryKey().references(() => authUsers.id, { onDelete: 'cascade' }),
	email: text('email').notNull(),
	firstName: text('first_name'),
	lastName: text('last_name'),
	displayName: text('display_name'),
	avatarUrl: text('avatar_url'),
	phone: text('phone'),
	role: userRoleEnum('role').default('customer').notNull(),

	// Onboarding & Preferences
	onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
	preferences: jsonb('preferences').$type<{
		emailNotifications: boolean;
		smsNotifications: boolean;
		theme: 'light' | 'dark' | 'system';
		language: string;
		timezone: string;
		magicLinkEnabled: boolean;
		accountType: 'personal' | 'organization';
	}>(),

	// Metadata
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	lastLoginAt: timestamp('last_login_at', { withTimezone: true })
}).enableRLS();

// =============================================================================
// ORGANIZATIONS TABLE
// =============================================================================
// Companies/clients that projects and billing are associated with
export const organizations = pgTable('organizations', {
	id: uuid('id').primaryKey().defaultRandom(),
	// Human-readable Organization Number (auto-generated, e.g. ORG-0001)
	orgNumber: text('org_number').notNull().unique(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	logoUrl: text('logo_url'),
	website: text('website'),

	// Contact Information
	email: text('email'),
	phone: text('phone'),

	// Billing Address
	billingAddressLine1: text('billing_address_line1'),
	billingAddressLine2: text('billing_address_line2'),
	billingCity: text('billing_city'),
	billingState: text('billing_state'),
	billingPostalCode: text('billing_postal_code'),
	billingCountry: text('billing_country'),

	// Tax Information
	taxId: text('tax_id'),

	// Customer Classification & SLA
	customerType: customerTypeEnum('customer_type').default('business'),
	defaultSlaPolicyId: uuid('default_sla_policy_id'),

	// Metadata
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// ORGANIZATION MEMBERS TABLE
// =============================================================================
// Links profiles to organizations with roles

export const organizationMembers = pgTable(
	'organization_members',
	{
		organizationId: uuid('organization_id')
			.notNull()
			.references(() => organizations.id, { onDelete: 'cascade' }),
		profileId: uuid('profile_id')
			.notNull()
			.references(() => profiles.id, { onDelete: 'cascade' }),
		role: text('role').default('member').notNull(), // 'owner', 'admin', 'member'
		createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
	},
	(table) => [primaryKey({ columns: [table.organizationId, table.profileId] })]
).enableRLS();

// =============================================================================
// PROJECTS TABLE
// =============================================================================

export const projects = pgTable('projects', {
	id: uuid('id').primaryKey().defaultRandom(),
	organizationId: uuid('organization_id')
		.notNull()
		.references(() => organizations.id, { onDelete: 'cascade' }),

	// Human-readable Project Number (auto-generated, e.g. PRJ-2024-0001)
	projectNumber: text('project_number').notNull().unique(),

	// Basic Info
	name: text('name').notNull(),
	slug: text('slug').notNull(),
	description: text('description'),

	// 7-Phase System
	phase: projectPhaseEnum('phase').default('request').notNull(),

	// Legacy status (for backwards compatibility)
	status: projectStatusEnum('status').default('draft').notNull(),

	// Proposal Confirmation (for Phase 03-04 two-way confirmation)
	proposalStatus: proposalConfirmationStatusEnum('proposal_status'),
	clientAcceptedAt: timestamp('client_accepted_at', { withTimezone: true }),
	adminConfirmedAt: timestamp('admin_confirmed_at', { withTimezone: true }),

	// Assigned Staff
	assignedToId: uuid('assigned_to_id').references(() => profiles.id, { onDelete: 'set null' }),

	// Timeline
	startDate: timestamp('start_date', { withTimezone: true }),
	endDate: timestamp('end_date', { withTimezone: true }),
	completedAt: timestamp('completed_at', { withTimezone: true }),

	// Budget
	estimatedBudget: decimal('estimated_budget', { precision: 12, scale: 2 }),
	actualBudget: decimal('actual_budget', { precision: 12, scale: 2 }),
	currency: text('currency').default('USD').notNull(),

	// Support Phase (Phase 07)
	supportTierId: uuid('support_tier_id'),
	supportStartedAt: timestamp('support_started_at', { withTimezone: true }),
	supportEndsAt: timestamp('support_ends_at', { withTimezone: true }),

	// Metadata
	metadata: jsonb('metadata'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// PROJECT REQUESTS TABLE
// =============================================================================
// Requests submitted by clients for new projects

export const projectRequestStatusEnum = pgEnum('project_request_status', [
	'pending',
	'under_review',
	'approved',
	'rejected',
	'converted'
]);

export const projectRequests = pgTable('project_requests', {
	id: uuid('id').primaryKey().defaultRandom(),
	organizationId: uuid('organization_id')
		.notNull()
		.references(() => organizations.id, { onDelete: 'cascade' }),
	requestedById: uuid('requested_by_id')
		.notNull()
		.references(() => profiles.id, { onDelete: 'cascade' }),

	// Human-readable Request Number (auto-generated, e.g. REQ-2024-00001)
	requestNumber: text('request_number').notNull().unique(),

	// Basic Info
	title: text('title').notNull(),
	description: text('description').notNull(),
	projectType: text('project_type').notNull(), // website, web_app, mobile_app, design, backend, other

	// Client Preferences
	budgetRange: text('budget_range'), // under_5k, 5k_15k, 15k_50k, 50k_100k, over_100k, not_sure
	timeline: text('timeline'), // asap, 1_month, 1_3_months, 3_6_months, flexible
	goals: text('goals'),
	requirements: text('requirements'),
	references: text('references'),

	// Status & Processing
	status: projectRequestStatusEnum('status').default('pending').notNull(),
	reviewedById: uuid('reviewed_by_id').references(() => profiles.id, { onDelete: 'set null' }),
	reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
	reviewNotes: text('review_notes'),

	// Conversion to Project
	projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
	convertedAt: timestamp('converted_at', { withTimezone: true }),

	// Timestamps
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// PROPOSALS TABLE
// =============================================================================

export const proposals = pgTable('proposals', {
	id: uuid('id').primaryKey().defaultRandom(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),

	// Human-readable Proposal Number (auto-generated, e.g. PRP-2024-0001)
	proposalNumber: text('proposal_number').notNull().unique(),

	// Versioning
	version: integer('version').default(1).notNull(),
	parentProposalId: uuid('parent_proposal_id'),

	// Content
	title: text('title').notNull(),
	summary: text('summary'),
	content: jsonb('content').$type<{
		sections: Array<{
			title: string;
			content: string;
			order: number;
		}>;
		lineItems: Array<{
			description: string;
			quantity: number;
			unitPrice: number;
			total: number;
		}>;
	}>(),

	// Pricing
	subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
	taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).default('0'),
	taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).default('0'),
	discount: decimal('discount', { precision: 12, scale: 2 }).default('0'),
	total: decimal('total', { precision: 12, scale: 2 }).notNull(),
	currency: text('currency').default('USD').notNull(),

	// Status & Approval
	status: proposalStatusEnum('status').default('draft').notNull(),
	sentAt: timestamp('sent_at', { withTimezone: true }),
	viewedAt: timestamp('viewed_at', { withTimezone: true }),
	respondedAt: timestamp('responded_at', { withTimezone: true }),
	expiresAt: timestamp('expires_at', { withTimezone: true }),

	// Assignment (staff working on this proposal)
	assignedToId: uuid('assigned_to_id').references(() => profiles.id, { onDelete: 'set null' }),

	// Approval tracking
	approvedById: uuid('approved_by_id').references(() => profiles.id),
	rejectionReason: text('rejection_reason'),

	// PDF & Documents
	pdfUrl: text('pdf_url'),

	// Internal
	createdById: uuid('created_by_id')
		.notNull()
		.references(() => profiles.id),

	// Metadata
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// PROJECT REVISIONS TABLE
// =============================================================================
// Change requests during the Building phase

export const projectRevisions = pgTable('project_revisions', {
	id: uuid('id').primaryKey().defaultRandom(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),

	// Version reference (e.g., "v1.2", "Build 42")
	version: text('version'),

	// Revision details
	title: text('title').notNull(),
	description: text('description'),

	// Requester and assignee
	requestedById: uuid('requested_by_id').references(() => profiles.id, { onDelete: 'set null' }),
	assignedToId: uuid('assigned_to_id').references(() => profiles.id, { onDelete: 'set null' }),

	// Status & priority
	status: revisionStatusEnum('status').default('pending').notNull(),
	priority: ticketPriorityEnum('priority').default('medium').notNull(),

	// Resolution
	resolvedAt: timestamp('resolved_at', { withTimezone: true }),
	resolutionNotes: text('resolution_notes'),

	// Timestamps
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// PROJECT MILESTONES TABLE
// =============================================================================
// Track project milestones and deliverables

export const milestoneStatusEnum = pgEnum('milestone_status', [
	'pending',      // Not started
	'in_progress',  // Being worked on
	'completed',    // Finished
	'on_hold',      // Paused
	'cancelled'     // Cancelled
]);

export const projectMilestones = pgTable('project_milestones', {
	id: uuid('id').primaryKey().defaultRandom(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),

	// Milestone details
	title: text('title').notNull(),
	description: text('description'),

	// Position in timeline (1 = first milestone)
	sortOrder: integer('sort_order').default(0).notNull(),

	// Status tracking
	status: milestoneStatusEnum('status').default('pending').notNull(),

	// Due date and completion
	dueDate: timestamp('due_date', { withTimezone: true }),
	completedAt: timestamp('completed_at', { withTimezone: true }),

	// Percentage weight (for progress calculation, should sum to 100 per project)
	weight: integer('weight').default(10).notNull(),

	// Optional invoice ID for milestone payments (linked after invoice creation)
	invoiceId: uuid('invoice_id'),

	// Who created/completed
	createdById: uuid('created_by_id').references(() => profiles.id, { onDelete: 'set null' }),
	completedById: uuid('completed_by_id').references(() => profiles.id, { onDelete: 'set null' }),

	// Deliverables - files or links associated with this milestone
	deliverables: jsonb('deliverables').$type<
		Array<{
			name: string;
			type: 'file' | 'link';
			url: string;
			addedAt: string;
		}>
	>(),

	// Timestamps
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// INVOICES TABLE
// =============================================================================

export const invoices = pgTable('invoices', {
	id: uuid('id').primaryKey().defaultRandom(),
	projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),
	organizationId: uuid('organization_id')
		.notNull()
		.references(() => organizations.id, { onDelete: 'cascade' }),

	// Invoice Number (auto-generated or custom)
	invoiceNumber: text('invoice_number').notNull().unique(),

	// Content
	title: text('title'),
	description: text('description'),
	lineItems: jsonb('line_items').$type<
		Array<{
			description: string;
			quantity: number;
			unitPrice: number;
			total: number;
		}>
	>(),

	// Pricing
	subtotal: decimal('subtotal', { precision: 12, scale: 2 }).notNull(),
	taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).default('0'),
	taxAmount: decimal('tax_amount', { precision: 12, scale: 2 }).default('0'),
	discount: decimal('discount', { precision: 12, scale: 2 }).default('0'),
	total: decimal('total', { precision: 12, scale: 2 }).notNull(),
	amountPaid: decimal('amount_paid', { precision: 12, scale: 2 }).default('0').notNull(),
	amountDue: decimal('amount_due', { precision: 12, scale: 2 }).notNull(),
	currency: text('currency').default('USD').notNull(),

	// Dates
	issueDate: timestamp('issue_date', { withTimezone: true }).defaultNow().notNull(),
	dueDate: timestamp('due_date', { withTimezone: true }).notNull(),
	paidAt: timestamp('paid_at', { withTimezone: true }),

	// Status
	status: invoiceStatusEnum('status').default('draft').notNull(),
	sentAt: timestamp('sent_at', { withTimezone: true }),
	viewedAt: timestamp('viewed_at', { withTimezone: true }),

	// Payment Information
	paymentMethod: text('payment_method'),
	paymentReference: text('payment_reference'),

	// Notes
	notes: text('notes'),
	internalNotes: text('internal_notes'),

	// PDF
	pdfUrl: text('pdf_url'),

	// Internal
	createdById: uuid('created_by_id')
		.notNull()
		.references(() => profiles.id),

	// Metadata
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// PAYMENTS TABLE
// =============================================================================

export const payments = pgTable('payments', {
	id: uuid('id').primaryKey().defaultRandom(),
	invoiceId: uuid('invoice_id')
		.notNull()
		.references(() => invoices.id, { onDelete: 'cascade' }),

	amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
	currency: text('currency').default('USD').notNull(),

	paymentMethod: text('payment_method').notNull(),
	paymentReference: text('payment_reference'),
	transactionId: text('transaction_id'),

	notes: text('notes'),

	paidAt: timestamp('paid_at', { withTimezone: true }).defaultNow().notNull(),

	// Who recorded this payment
	recordedById: uuid('recorded_by_id')
		.notNull()
		.references(() => profiles.id),

	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// TICKETS TABLE
// =============================================================================

export const tickets = pgTable('tickets', {
	id: uuid('id').primaryKey().defaultRandom(),
	organizationId: uuid('organization_id')
		.notNull()
		.references(() => organizations.id, { onDelete: 'cascade' }),
	projectId: uuid('project_id').references(() => projects.id, { onDelete: 'set null' }),

	// Ticket Number (auto-generated)
	ticketNumber: text('ticket_number').notNull().unique(),

	// Scope (organization or personal)
	scope: ticketScopeEnum('scope').default('organization'),

	// Content
	subject: text('subject').notNull(),
	description: text('description').notNull(),

	// Status & Priority
	status: ticketStatusEnum('status').default('open').notNull(),
	priority: ticketPriorityEnum('priority').default('medium').notNull(),

	// Category/Type
	category: text('category'),
	categoryId: uuid('category_id').references(() => ticketCategories.id, { onDelete: 'set null' }),
	tags: text('tags').array(),

	// Assignment
	assignedToId: uuid('assigned_to_id').references(() => profiles.id, { onDelete: 'set null' }),

	// Reporter
	createdById: uuid('created_by_id')
		.notNull()
		.references(() => profiles.id),

	// Resolution
	resolvedAt: timestamp('resolved_at', { withTimezone: true }),
	closedAt: timestamp('closed_at', { withTimezone: true }),
	resolution: text('resolution'),

	// SLA Tracking
	slaPolicyId: uuid('sla_policy_id').references(() => slaPolicies.id, { onDelete: 'set null' }),
	slaResponseDueAt: timestamp('sla_response_due_at', { withTimezone: true }),
	slaResolutionDueAt: timestamp('sla_resolution_due_at', { withTimezone: true }),
	slaFirstResponseAt: timestamp('sla_first_response_at', { withTimezone: true }),
	slaResolvedAt: timestamp('sla_resolved_at', { withTimezone: true }),
	slaBreached: boolean('sla_breached').default(false),

	// Legacy SLA fields (kept for backward compatibility)
	dueAt: timestamp('due_at', { withTimezone: true }),
	firstResponseAt: timestamp('first_response_at', { withTimezone: true }),

	// Metadata
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// TICKET COMMENTS TABLE
// =============================================================================

export const ticketComments = pgTable('ticket_comments', {
	id: uuid('id').primaryKey().defaultRandom(),
	ticketId: uuid('ticket_id')
		.notNull()
		.references(() => tickets.id, { onDelete: 'cascade' }),

	content: text('content').notNull(),
	isInternal: boolean('is_internal').default(false).notNull(), // Staff-only comments

	authorId: uuid('author_id')
		.notNull()
		.references(() => profiles.id),

	// Attachments
	attachments: jsonb('attachments').$type<
		Array<{
			name: string;
			url: string;
			type: string;
			size: number;
		}>
	>(),

	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// ACTIVITY LOG TABLE
// =============================================================================
// Audit trail for all important actions

export const activityLog = pgTable('activity_log', {
	id: uuid('id').primaryKey().defaultRandom(),

	// What entity this activity is about
	entityType: text('entity_type').notNull(), // 'project', 'proposal', 'invoice', 'ticket', etc.
	entityId: uuid('entity_id').notNull(),

	// Activity details
	activityType: activityTypeEnum('activity_type').notNull(),
	description: text('description').notNull(),

	// Changes (for updates)
	previousValues: jsonb('previous_values'),
	newValues: jsonb('new_values'),

	// Who performed this action
	performedById: uuid('performed_by_id').references(() => profiles.id),

	// IP and user agent for audit purposes
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),

	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// FILE UPLOADS TABLE
// =============================================================================

export const fileUploads = pgTable('file_uploads', {
	id: uuid('id').primaryKey().defaultRandom(),

	// What entity this file belongs to
	entityType: text('entity_type').notNull(),
	entityId: uuid('entity_id').notNull(),

	// File info
	fileName: text('file_name').notNull(),
	fileType: text('file_type').notNull(),
	fileSize: integer('file_size').notNull(),
	fileUrl: text('file_url').notNull(),

	// Storage info
	storagePath: text('storage_path').notNull(),

	uploadedById: uuid('uploaded_by_id')
		.notNull()
		.references(() => profiles.id),

	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// RELATIONS
// =============================================================================

export const profilesRelations = relations(profiles, ({ many }) => ({
	organizationMemberships: many(organizationMembers),
	assignedProjects: many(projects),
	createdProposals: many(proposals),
	createdInvoices: many(invoices),
	createdTickets: many(tickets),
	ticketComments: many(ticketComments),
	activities: many(activityLog),
	uploads: many(fileUploads)
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
	members: many(organizationMembers),
	projects: many(projects),
	invoices: many(invoices),
	tickets: many(tickets)
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
	organization: one(organizations, {
		fields: [organizationMembers.organizationId],
		references: [organizations.id]
	}),
	profile: one(profiles, {
		fields: [organizationMembers.profileId],
		references: [profiles.id]
	})
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
	organization: one(organizations, {
		fields: [projects.organizationId],
		references: [organizations.id]
	}),
	assignedTo: one(profiles, {
		fields: [projects.assignedToId],
		references: [profiles.id]
	}),
	proposals: many(proposals),
	invoices: many(invoices),
	tickets: many(tickets),
	revisions: many(projectRevisions),
	sourceRequest: one(projectRequests, {
		fields: [projects.id],
		references: [projectRequests.projectId]
	})
}));

export const projectRequestsRelations = relations(projectRequests, ({ one }) => ({
	organization: one(organizations, {
		fields: [projectRequests.organizationId],
		references: [organizations.id]
	}),
	requestedBy: one(profiles, {
		fields: [projectRequests.requestedById],
		references: [profiles.id],
		relationName: 'requestedBy'
	}),
	reviewedBy: one(profiles, {
		fields: [projectRequests.reviewedById],
		references: [profiles.id],
		relationName: 'reviewedBy'
	}),
	project: one(projects, {
		fields: [projectRequests.projectId],
		references: [projects.id]
	})
}));

export const proposalsRelations = relations(proposals, ({ one }) => ({
	project: one(projects, {
		fields: [proposals.projectId],
		references: [projects.id]
	}),
	createdBy: one(profiles, {
		fields: [proposals.createdById],
		references: [profiles.id]
	}),
	approvedBy: one(profiles, {
		fields: [proposals.approvedById],
		references: [profiles.id]
	}),
	parentProposal: one(proposals, {
		fields: [proposals.parentProposalId],
		references: [proposals.id]
	})
}));

export const projectRevisionsRelations = relations(projectRevisions, ({ one }) => ({
	project: one(projects, {
		fields: [projectRevisions.projectId],
		references: [projects.id]
	}),
	requestedBy: one(profiles, {
		fields: [projectRevisions.requestedById],
		references: [profiles.id],
		relationName: 'requestedBy'
	}),
	assignedTo: one(profiles, {
		fields: [projectRevisions.assignedToId],
		references: [profiles.id],
		relationName: 'assignedTo'
	})
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
	project: one(projects, {
		fields: [invoices.projectId],
		references: [projects.id]
	}),
	organization: one(organizations, {
		fields: [invoices.organizationId],
		references: [organizations.id]
	}),
	createdBy: one(profiles, {
		fields: [invoices.createdById],
		references: [profiles.id]
	}),
	payments: many(payments)
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
	invoice: one(invoices, {
		fields: [payments.invoiceId],
		references: [invoices.id]
	}),
	recordedBy: one(profiles, {
		fields: [payments.recordedById],
		references: [profiles.id]
	})
}));

export const ticketsRelations = relations(tickets, ({ one, many }) => ({
	organization: one(organizations, {
		fields: [tickets.organizationId],
		references: [organizations.id]
	}),
	project: one(projects, {
		fields: [tickets.projectId],
		references: [projects.id]
	}),
	assignedTo: one(profiles, {
		fields: [tickets.assignedToId],
		references: [profiles.id]
	}),
	createdBy: one(profiles, {
		fields: [tickets.createdById],
		references: [profiles.id]
	}),
	comments: many(ticketComments)
}));

export const ticketCommentsRelations = relations(ticketComments, ({ one }) => ({
	ticket: one(tickets, {
		fields: [ticketComments.ticketId],
		references: [tickets.id]
	}),
	author: one(profiles, {
		fields: [ticketComments.authorId],
		references: [profiles.id]
	})
}));

export const activityLogRelations = relations(activityLog, ({ one }) => ({
	performedBy: one(profiles, {
		fields: [activityLog.performedById],
		references: [profiles.id]
	})
}));

export const fileUploadsRelations = relations(fileUploads, ({ one }) => ({
	uploadedBy: one(profiles, {
		fields: [fileUploads.uploadedById],
		references: [profiles.id]
	})
}));

// =============================================================================
// ANNOUNCEMENTS TABLE
// =============================================================================
// Portal-wide announcements set by super admin

export const announcements = pgTable('announcements', {
	id: uuid('id').primaryKey().defaultRandom(),

	// Content
	title: text('title').notNull(),
	message: text('message').notNull(),
	type: text('type').default('info').notNull(), // 'info', 'warning', 'success', 'error'

	// Visibility
	isActive: boolean('is_active').default(true).notNull(),
	startsAt: timestamp('starts_at', { withTimezone: true }),
	endsAt: timestamp('ends_at', { withTimezone: true }),

	// Targeting (null = show to all)
	targetRoles: text('target_roles').array(), // ['customer', 'staff', 'admin']

	// Who created this
	createdById: uuid('created_by_id')
		.notNull()
		.references(() => profiles.id),

	// Metadata
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// ORGANIZATION INVITES TABLE
// =============================================================================
// Invite codes for joining organizations

export const organizationInvites = pgTable('organization_invites', {
	id: uuid('id').primaryKey().defaultRandom(),
	organizationId: uuid('organization_id')
		.notNull()
		.references(() => organizations.id, { onDelete: 'cascade' }),

	// Invite code (unique, short)
	code: text('code').notNull().unique(),

	// Who this invite is for (optional - if specified, only that email can use it)
	email: text('email'),

	// Role to assign when joining
	role: text('role').default('member').notNull(), // 'admin', 'member'

	// Usage limits
	maxUses: integer('max_uses').default(1),
	usedCount: integer('used_count').default(0).notNull(),

	// Validity
	expiresAt: timestamp('expires_at', { withTimezone: true }),

	// Approval required
	requiresApproval: boolean('requires_approval').default(false).notNull(),

	// Who created this invite
	createdById: uuid('created_by_id')
		.notNull()
		.references(() => profiles.id),

	// Metadata
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// PENDING ORGANIZATION MEMBERS TABLE
// =============================================================================
// Members awaiting approval to join an organization

export const pendingOrganizationMembers = pgTable('pending_org_members', {
	id: uuid('id').primaryKey().defaultRandom(),
	organizationId: uuid('organization_id')
		.notNull()
		.references(() => organizations.id, { onDelete: 'cascade' }),
	profileId: uuid('profile_id')
		.notNull()
		.references(() => profiles.id, { onDelete: 'cascade' }),
	inviteId: uuid('invite_id')
		.references(() => organizationInvites.id, { onDelete: 'set null' }),

	// Requested role
	requestedRole: text('requested_role').default('member').notNull(),

	// Status
	status: text('status').default('pending').notNull(), // 'pending', 'approved', 'rejected'

	// Who reviewed this request
	reviewedById: uuid('reviewed_by_id').references(() => profiles.id),
	reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
	rejectionReason: text('rejection_reason'),

	// Metadata
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// ANNOUNCEMENTS RELATIONS
// =============================================================================

export const announcementsRelations = relations(announcements, ({ one }) => ({
	createdBy: one(profiles, {
		fields: [announcements.createdById],
		references: [profiles.id]
	})
}));

export const organizationInvitesRelations = relations(organizationInvites, ({ one }) => ({
	organization: one(organizations, {
		fields: [organizationInvites.organizationId],
		references: [organizations.id]
	}),
	createdBy: one(profiles, {
		fields: [organizationInvites.createdById],
		references: [profiles.id]
	})
}));

export const pendingOrganizationMembersRelations = relations(pendingOrganizationMembers, ({ one }) => ({
	organization: one(organizations, {
		fields: [pendingOrganizationMembers.organizationId],
		references: [organizations.id]
	}),
	profile: one(profiles, {
		fields: [pendingOrganizationMembers.profileId],
		references: [profiles.id]
	}),
	invite: one(organizationInvites, {
		fields: [pendingOrganizationMembers.inviteId],
		references: [organizationInvites.id]
	}),
	reviewedBy: one(profiles, {
		fields: [pendingOrganizationMembers.reviewedById],
		references: [profiles.id]
	})
}));

// =============================================================================
// TICKET CATEGORIES TABLE
// =============================================================================
// Define categories for ticket organization and SLA routing

export const ticketCategories = pgTable('ticket_categories', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: text('name').notNull(),
	slug: text('slug').notNull().unique(),
	description: text('description'),
	color: text('color').default('#6b7280'),
	icon: text('icon').default('help-circle'),
	sortOrder: integer('sort_order').default(0),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

// =============================================================================
// SLA POLICIES TABLE
// =============================================================================
// Service Level Agreement policies for ticket management

export const slaPolicies = pgTable('sla_policies', {
	id: uuid('id').primaryKey().defaultRandom(),

	// Basic Info
	name: text('name').notNull(),
	description: text('description'),

	// Priority-based targets (in hours)
	urgentResponseHours: integer('urgent_response_hours').default(1).notNull(),
	urgentResolutionHours: integer('urgent_resolution_hours').default(4).notNull(),
	highResponseHours: integer('high_response_hours').default(4).notNull(),
	highResolutionHours: integer('high_resolution_hours').default(8).notNull(),
	mediumResponseHours: integer('medium_response_hours').default(8).notNull(),
	mediumResolutionHours: integer('medium_resolution_hours').default(24).notNull(),
	lowResponseHours: integer('low_response_hours').default(24).notNull(),
	lowResolutionHours: integer('low_resolution_hours').default(72).notNull(),

	// Business hours
	businessHoursOnly: boolean('business_hours_only').default(true).notNull(),
	businessHoursStart: integer('business_hours_start').default(9).notNull(), // 0-23
	businessHoursEnd: integer('business_hours_end').default(17).notNull(), // 0-23
	businessDays: integer('business_days').array().default([1, 2, 3, 4, 5]).notNull(), // 0=Sun, 1=Mon, etc.

	// Applicability Rules
	appliesToCustomerTypes: text('applies_to_customer_types').array().default([]), // personal, business, enterprise
	appliesToCategories: text('applies_to_categories').array().default([]), // category slugs
	priorityOrder: integer('priority_order').default(0), // Higher = checked first when matching

	// Escalation Settings
	escalationEnabled: boolean('escalation_enabled').default(false),
	escalationAfterHours: integer('escalation_after_hours').default(24),
	escalationNotifyEmails: text('escalation_notify_emails').array().default([]),

	// Status
	isDefault: boolean('is_default').default(false).notNull(),
	isActive: boolean('is_active').default(true).notNull(),

	// Metadata
	createdById: uuid('created_by_id')
		.notNull()
		.references(() => profiles.id),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

export const slaPoliciesRelations = relations(slaPolicies, ({ one, many }) => ({
	createdBy: one(profiles, {
		fields: [slaPolicies.createdById],
		references: [profiles.id]
	}),
	organizationAssignments: many(slaOrganizationAssignments)
}));

// =============================================================================
// SLA ORGANIZATION ASSIGNMENTS TABLE
// =============================================================================
// Link specific organizations to specific SLA policies (override default)

export const slaOrganizationAssignments = pgTable('sla_org_assignments', {
	id: uuid('id').primaryKey().defaultRandom(),
	slaPolicyId: uuid('sla_policy_id')
		.notNull()
		.references(() => slaPolicies.id, { onDelete: 'cascade' }),
	organizationId: uuid('organization_id')
		.notNull()
		.references(() => organizations.id, { onDelete: 'cascade' }),
	notes: text('notes'),
	createdById: uuid('created_by_id').references(() => profiles.id),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

export const slaOrganizationAssignmentsRelations = relations(slaOrganizationAssignments, ({ one }) => ({
	slaPolicy: one(slaPolicies, {
		fields: [slaOrganizationAssignments.slaPolicyId],
		references: [slaPolicies.id]
	}),
	organization: one(organizations, {
		fields: [slaOrganizationAssignments.organizationId],
		references: [organizations.id]
	}),
	createdBy: one(profiles, {
		fields: [slaOrganizationAssignments.createdById],
		references: [profiles.id]
	})
}));

// =============================================================================
// CANNED RESPONSES TABLE
// =============================================================================
// Pre-defined response templates for tickets

export const cannedResponses = pgTable('canned_responses', {
	id: uuid('id').primaryKey().defaultRandom(),

	// Basic Info
	title: text('title').notNull(),
	shortcut: text('shortcut'), // Quick access shortcut like "/greeting"
	content: text('content').notNull(),

	// Categorization
	category: text('category'), // e.g., 'greeting', 'closing', 'technical', 'billing'

	// Visibility
	isGlobal: boolean('is_global').default(true).notNull(), // Available to all staff
	isActive: boolean('is_active').default(true).notNull(), // Can be disabled without deleting
	createdById: uuid('created_by_id')
		.notNull()
		.references(() => profiles.id),

	// Usage tracking
	usageCount: integer('usage_count').default(0).notNull(),
	lastUsedAt: timestamp('last_used_at', { withTimezone: true }),

	// Metadata
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

export const cannedResponsesRelations = relations(cannedResponses, ({ one }) => ({
	createdBy: one(profiles, {
		fields: [cannedResponses.createdById],
		references: [profiles.id]
	})
}));

// =============================================================================
// SYSTEM SETTINGS TABLE
// =============================================================================
// Key-value store for system configuration

export const systemSettings = pgTable('system_settings', {
	key: text('key').primaryKey(),

	// Value as JSON to support various types
	value: jsonb('value').notNull(),

	// Categorization
	category: text('category').notNull(), // e.g., 'general', 'tickets', 'billing', 'email', 'security'

	// Description for admin UI
	label: text('label').notNull(),
	description: text('description'),

	// Value constraints
	valueType: text('value_type').default('string').notNull(), // 'string', 'number', 'boolean', 'json', 'array'
	isSecret: boolean('is_secret').default(false).notNull(), // Hide value in UI (e.g., API keys)

	// Metadata
	updatedById: uuid('updated_by_id').references(() => profiles.id, { onDelete: 'set null' }),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

export const systemSettingsRelations = relations(systemSettings, ({ one }) => ({
	updatedBy: one(profiles, {
		fields: [systemSettings.updatedById],
		references: [profiles.id]
	})
}));

// =============================================================================
// SUPPORT ARTICLES TABLE
// =============================================================================
// Knowledge base articles for users and admins

export const supportArticleAudienceEnum = pgEnum('support_article_audience', ['user', 'admin', 'all']);

export const supportArticles = pgTable('support_articles', {
	id: uuid('id').primaryKey().defaultRandom(),

	// URL-friendly identifier
	slug: text('slug').notNull().unique(),

	// Content
	title: text('title').notNull(),
	excerpt: text('excerpt'), // Short summary for listings
	content: text('content').notNull(), // Markdown content

	// Categorization
	category: text('category').notNull(), // e.g., 'getting-started', 'account', 'projects', 'billing'
	tags: jsonb('tags').$type<string[]>().default([]),

	// Access control
	audience: supportArticleAudienceEnum('audience').default('user').notNull(),
	isPublished: boolean('is_published').default(false).notNull(),
	isFeatured: boolean('is_featured').default(false).notNull(),

	// Search & ranking
	sortOrder: integer('sort_order').default(0).notNull(),
	viewCount: integer('view_count').default(0).notNull(),
	helpfulCount: integer('helpful_count').default(0).notNull(),
	notHelpfulCount: integer('not_helpful_count').default(0).notNull(),

	// Author
	authorId: uuid('author_id')
		.notNull()
		.references(() => profiles.id, { onDelete: 'cascade' }),

	// Metadata
	publishedAt: timestamp('published_at', { withTimezone: true }),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
}).enableRLS();

export const supportArticlesRelations = relations(supportArticles, ({ one }) => ({
	author: one(profiles, {
		fields: [supportArticles.authorId],
		references: [profiles.id]
	})
}));

// =============================================================================
// TYPES EXPORT
// =============================================================================

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;

export type OrganizationMember = typeof organizationMembers.$inferSelect;
export type NewOrganizationMember = typeof organizationMembers.$inferInsert;

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export type Proposal = typeof proposals.$inferSelect;
export type NewProposal = typeof proposals.$inferInsert;

export type Invoice = typeof invoices.$inferSelect;
export type NewInvoice = typeof invoices.$inferInsert;

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;

export type Ticket = typeof tickets.$inferSelect;
export type NewTicket = typeof tickets.$inferInsert;

export type TicketComment = typeof ticketComments.$inferSelect;
export type NewTicketComment = typeof ticketComments.$inferInsert;

export type TicketCategory = typeof ticketCategories.$inferSelect;
export type NewTicketCategory = typeof ticketCategories.$inferInsert;

export type ActivityLogEntry = typeof activityLog.$inferSelect;
export type NewActivityLogEntry = typeof activityLog.$inferInsert;

export type FileUpload = typeof fileUploads.$inferSelect;
export type NewFileUpload = typeof fileUploads.$inferInsert;

export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;

export type OrganizationInvite = typeof organizationInvites.$inferSelect;
export type NewOrganizationInvite = typeof organizationInvites.$inferInsert;

export type PendingOrganizationMember = typeof pendingOrganizationMembers.$inferSelect;
export type NewPendingOrganizationMember = typeof pendingOrganizationMembers.$inferInsert;

export type CannedResponse = typeof cannedResponses.$inferSelect;
export type NewCannedResponse = typeof cannedResponses.$inferInsert;

export type SlaPolicy = typeof slaPolicies.$inferSelect;
export type NewSlaPolicy = typeof slaPolicies.$inferInsert;

export type SlaOrganizationAssignment = typeof slaOrganizationAssignments.$inferSelect;
export type NewSlaOrganizationAssignment = typeof slaOrganizationAssignments.$inferInsert;

export type SystemSetting = typeof systemSettings.$inferSelect;
export type NewSystemSetting = typeof systemSettings.$inferInsert;

export type SupportArticle = typeof supportArticles.$inferSelect;
export type NewSupportArticle = typeof supportArticles.$inferInsert;

export type ProjectRevision = typeof projectRevisions.$inferSelect;
export type NewProjectRevision = typeof projectRevisions.$inferInsert;

export type ProjectMilestone = typeof projectMilestones.$inferSelect;
export type NewProjectMilestone = typeof projectMilestones.$inferInsert;

export type UserRole = 'super_admin' | 'admin' | 'staff' | 'customer';
export type CustomerType = typeof customerTypeEnum.enumValues[number];
export type TicketScope = typeof ticketScopeEnum.enumValues[number];
export type ProjectStatus = typeof projectStatusEnum.enumValues[number];
export type ProjectPhase = typeof projectPhaseEnum.enumValues[number];
export type ProposalConfirmationStatus = typeof proposalConfirmationStatusEnum.enumValues[number];
export type RevisionStatus = typeof revisionStatusEnum.enumValues[number];
export type MilestoneStatus = typeof milestoneStatusEnum.enumValues[number];
export type ProposalStatus = typeof proposalStatusEnum.enumValues[number];
export type InvoiceStatus = typeof invoiceStatusEnum.enumValues[number];
export type TicketStatus = typeof ticketStatusEnum.enumValues[number];
export type TicketPriority = typeof ticketPriorityEnum.enumValues[number];
export type ActivityType = typeof activityTypeEnum.enumValues[number];
export type SupportArticleAudience = typeof supportArticleAudienceEnum.enumValues[number];
