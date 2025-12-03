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
	}>(),

	// Metadata
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
	lastLoginAt: timestamp('last_login_at', { withTimezone: true })
});

// =============================================================================
// ORGANIZATIONS TABLE
// =============================================================================
// Companies/clients that projects and billing are associated with

export const organizations = pgTable('organizations', {
	id: uuid('id').primaryKey().defaultRandom(),
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

	// Metadata
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

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
	(table) => ({
		pk: primaryKey({ columns: [table.organizationId, table.profileId] })
	})
);

// =============================================================================
// PROJECTS TABLE
// =============================================================================

export const projects = pgTable('projects', {
	id: uuid('id').primaryKey().defaultRandom(),
	organizationId: uuid('organization_id')
		.notNull()
		.references(() => organizations.id, { onDelete: 'cascade' }),

	// Basic Info
	name: text('name').notNull(),
	slug: text('slug').notNull(),
	description: text('description'),
	status: projectStatusEnum('status').default('draft').notNull(),

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

	// Metadata
	metadata: jsonb('metadata'),
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

// =============================================================================
// PROPOSALS TABLE
// =============================================================================

export const proposals = pgTable('proposals', {
	id: uuid('id').primaryKey().defaultRandom(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade' }),

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
});

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
});

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
});

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

	// Content
	subject: text('subject').notNull(),
	description: text('description').notNull(),

	// Status & Priority
	status: ticketStatusEnum('status').default('open').notNull(),
	priority: ticketPriorityEnum('priority').default('medium').notNull(),

	// Category/Type
	category: text('category'),
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

	// SLA
	dueAt: timestamp('due_at', { withTimezone: true }),
	firstResponseAt: timestamp('first_response_at', { withTimezone: true }),

	// Metadata
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

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
});

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
});

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
});

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
	tickets: many(tickets)
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
});

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
});

// =============================================================================
// PENDING ORGANIZATION MEMBERS TABLE
// =============================================================================
// Members awaiting approval to join an organization

export const pendingOrganizationMembers = pgTable('pending_organization_members', {
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
});

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

export type UserRole = 'super_admin' | 'admin' | 'staff' | 'customer';
export type ProjectStatus = typeof projectStatusEnum.enumValues[number];
export type ProposalStatus = typeof proposalStatusEnum.enumValues[number];
export type InvoiceStatus = typeof invoiceStatusEnum.enumValues[number];
export type TicketStatus = typeof ticketStatusEnum.enumValues[number];
export type TicketPriority = typeof ticketPriorityEnum.enumValues[number];
export type ActivityType = typeof activityTypeEnum.enumValues[number];
