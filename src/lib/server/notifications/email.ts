/**
 * Email Service
 *
 * Sends transactional emails using Resend API.
 * Configure RESEND_API_KEY in environment variables.
 */

import { env } from '$env/dynamic/private';

const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_EMAIL = 'MostlyWhat Systems <noreply@mostlywhat.com>';

function getSiteUrl(): string {
	return env.PUBLIC_SITE_URL || 'http://localhost:5173';
}

interface EmailOptions {
	to: string | string[];
	subject: string;
	html: string;
	text?: string;
	replyTo?: string;
}

interface EmailResult {
	success: boolean;
	id?: string;
	error?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: EmailOptions): Promise<EmailResult> {
	const apiKey = env.RESEND_API_KEY;
	if (!apiKey) {
		console.warn('RESEND_API_KEY not configured, email not sent:', options.subject);
		return { success: false, error: 'Email service not configured' };
	}

	try {
		const response = await fetch(RESEND_API_URL, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				from: FROM_EMAIL,
				to: Array.isArray(options.to) ? options.to : [options.to],
				subject: options.subject,
				html: options.html,
				text: options.text,
				reply_to: options.replyTo
			})
		});

		if (!response.ok) {
			const error = await response.text();
			console.error('Email send failed:', error);
			return { success: false, error };
		}

		const data = await response.json() as { id: string };
		return { success: true, id: data.id };
	} catch (err) {
		console.error('Email send error:', err);
		return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
	}
}

// =============================================================================
// EMAIL TEMPLATES
// =============================================================================

/**
 * Base HTML email template with MostlyWhat branding
 */
function baseTemplate(content: string): string {
	return `
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>MostlyWhat Systems</title>
	<style>
		body { font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', 'Courier New', monospace; line-height: 1.6; color: #e5e5e5; margin: 0; padding: 0; background-color: #000814; }
		.container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
		.card { background: #0f1419; border: 1px solid #1a2332; padding: 32px; }
		.header { font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace; font-size: 10px; letter-spacing: 0.15em; color: #6b7280; margin-bottom: 24px; }
		.logo { font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace; font-size: 14px; font-weight: 600; letter-spacing: 0.15em; color: #4a9eff; margin-bottom: 8px; }
		h1 { font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', monospace; font-size: 24px; font-weight: 700; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.1em; color: #ffffff; }
		p { margin: 0 0 16px 0; color: #a3a3a3; }
		.button { display: inline-block; background: #4a9eff; color: #000814 !important; padding: 12px 24px; text-decoration: none; font-family: 'SF Mono', Monaco, monospace; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; border: none; }
		.button:hover { background: #6bb0ff; }
		.button-secondary { background: transparent; border: 1px solid #4a9eff; color: #4a9eff !important; }
		.meta { font-family: 'SF Mono', Monaco, monospace; font-size: 11px; color: #6b7280; padding: 16px 0; border-top: 1px solid #1a2332; margin-top: 24px; }
		.footer { text-align: center; padding: 24px 0; font-size: 11px; color: #6b7280; }
		.footer a { color: #6b7280; text-decoration: none; }
		.footer a:hover { color: #4a9eff; }
		.divider { height: 1px; background: #1a2332; margin: 24px 0; }
		.highlight { background: #0a0f14; padding: 16px; border-left: 2px solid #4a9eff; margin: 16px 0; }
		.detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1a2332; }
		.detail-label { font-family: 'SF Mono', Monaco, monospace; font-size: 10px; letter-spacing: 0.15em; color: #6b7280; text-transform: uppercase; }
		.detail-value { font-weight: 500; color: #e5e5e5; }
		.accent { color: #4a9eff; }
		.accent-yellow { color: #ffd500; }
		.accent-red { color: #ef4444; }
		strong { color: #ffffff; }
	</style>
</head>
<body>
	<div class="container">
		<div class="card">
			<div class="logo">MOSTLYWHAT SYSTEMS</div>
			<div class="header">// NOTIFICATION</div>
			${content}
		</div>
		<div class="footer">
			<p>&copy; ${new Date().getFullYear()} MostlyWhat Systems. All rights reserved.</p>
			<p><a href="${getSiteUrl()}">mostlywhat.com</a> · <a href="${getSiteUrl()}/legal/privacy">Privacy</a> · <a href="${getSiteUrl()}/legal/terms">Terms</a></p>
		</div>
	</div>
</body>
</html>
	`.trim();
}

// =============================================================================
// PROPOSAL EMAILS
// =============================================================================

export interface ProposalEmailData {
	recipientName: string;
	recipientEmail: string;
	proposalNumber: string;
	proposalTitle: string;
	organizationName: string;
	total: string;
	currency: string;
	validUntil?: Date;
	proposalUrl: string;
}

/**
 * Send email when a proposal is sent to client
 */
export async function sendProposalEmail(data: ProposalEmailData): Promise<EmailResult> {
	const validUntilStr = data.validUntil
		? data.validUntil.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
		: 'Not specified';

	const content = `
		<h1>NEW PROPOSAL</h1>
		<p>Hello ${data.recipientName},</p>
		<p>A new proposal has been prepared for <strong>${data.organizationName}</strong>.</p>
		
		<div class="highlight">
			<div class="detail-row">
				<span class="detail-label">Proposal</span>
				<span class="detail-value">${data.proposalNumber}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Title</span>
				<span class="detail-value">${data.proposalTitle}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Total</span>
				<span class="detail-value">${data.currency} ${data.total}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Valid Until</span>
				<span class="detail-value">${validUntilStr}</span>
			</div>
		</div>
		
		<p>Please review the proposal and let us know if you have any questions.</p>
		
		<p style="text-align: center; margin: 32px 0;">
			<a href="${data.proposalUrl}" class="button">VIEW PROPOSAL</a>
		</p>
		
		<div class="meta">
			If you have questions, reply to this email or contact us at support@mostlywhat.com
		</div>
	`;

	return sendEmail({
		to: data.recipientEmail,
		subject: `Proposal ${data.proposalNumber}: ${data.proposalTitle}`,
		html: baseTemplate(content),
		text: `New Proposal: ${data.proposalTitle}\n\nA proposal has been prepared for ${data.organizationName}.\n\nProposal: ${data.proposalNumber}\nTotal: ${data.currency} ${data.total}\n\nView: ${data.proposalUrl}`
	});
}

/**
 * Send email when a proposal is accepted
 */
export async function sendProposalAcceptedEmail(data: ProposalEmailData & { acceptedBy: string }): Promise<EmailResult> {
	const content = `
		<h1>PROPOSAL ACCEPTED</h1>
		<p>Great news! The proposal <strong>${data.proposalNumber}</strong> has been accepted.</p>
		
		<div class="highlight">
			<div class="detail-row">
				<span class="detail-label">Proposal</span>
				<span class="detail-value">${data.proposalNumber}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Title</span>
				<span class="detail-value">${data.proposalTitle}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Organization</span>
				<span class="detail-value">${data.organizationName}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Accepted By</span>
				<span class="detail-value">${data.acceptedBy}</span>
			</div>
		</div>
		
		<p>The project will be created and you will be notified when it's ready to start.</p>
		
		<p style="text-align: center; margin: 32px 0;">
			<a href="${data.proposalUrl}" class="button">VIEW DETAILS</a>
		</p>
	`;

	return sendEmail({
		to: data.recipientEmail,
		subject: `✓ Proposal ${data.proposalNumber} Accepted`,
		html: baseTemplate(content),
		text: `Proposal Accepted: ${data.proposalTitle}\n\nThe proposal ${data.proposalNumber} has been accepted by ${data.acceptedBy}.\n\nView: ${data.proposalUrl}`
	});
}

/**
 * Send email when a proposal is rejected
 */
export async function sendProposalRejectedEmail(data: ProposalEmailData & { rejectedBy: string; reason?: string }): Promise<EmailResult> {
	const content = `
		<h1>PROPOSAL DECLINED</h1>
		<p>The proposal <strong>${data.proposalNumber}</strong> has been declined.</p>
		
		<div class="highlight">
			<div class="detail-row">
				<span class="detail-label">Proposal</span>
				<span class="detail-value">${data.proposalNumber}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Title</span>
				<span class="detail-value">${data.proposalTitle}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Organization</span>
				<span class="detail-value">${data.organizationName}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Declined By</span>
				<span class="detail-value">${data.rejectedBy}</span>
			</div>
		</div>
		
		${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
		
		<p>If you have questions about this decision, please contact us.</p>
		
		<p style="text-align: center; margin: 32px 0;">
			<a href="${data.proposalUrl}" class="button">VIEW DETAILS</a>
		</p>
	`;

	return sendEmail({
		to: data.recipientEmail,
		subject: `Proposal ${data.proposalNumber} Declined`,
		html: baseTemplate(content),
		text: `Proposal Declined: ${data.proposalTitle}\n\nThe proposal ${data.proposalNumber} has been declined by ${data.rejectedBy}.\n${data.reason ? `Reason: ${data.reason}\n` : ''}\nView: ${data.proposalUrl}`
	});
}

// =============================================================================
// TICKET EMAILS
// =============================================================================

export interface TicketEmailData {
	recipientName: string;
	recipientEmail: string;
	ticketNumber: string;
	subject: string;
	status: string;
	priority: string;
	ticketUrl: string;
}

/**
 * Send email when a ticket is created
 */
export async function sendTicketCreatedEmail(data: TicketEmailData): Promise<EmailResult> {
	const content = `
		<h1>TICKET CREATED</h1>
		<p>Hello ${data.recipientName},</p>
		<p>Your support ticket has been created and our team will respond shortly.</p>
		
		<div class="highlight">
			<div class="detail-row">
				<span class="detail-label">Ticket</span>
				<span class="detail-value">${data.ticketNumber}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Subject</span>
				<span class="detail-value">${data.subject}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Priority</span>
				<span class="detail-value">${data.priority}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Status</span>
				<span class="detail-value">${data.status}</span>
			</div>
		</div>
		
		<p style="text-align: center; margin: 32px 0;">
			<a href="${data.ticketUrl}" class="button">VIEW TICKET</a>
		</p>
		
		<div class="meta">
			You can track your ticket status and add comments at any time.
		</div>
	`;

	return sendEmail({
		to: data.recipientEmail,
		subject: `[${data.ticketNumber}] ${data.subject}`,
		html: baseTemplate(content),
		text: `Ticket Created: ${data.subject}\n\nTicket: ${data.ticketNumber}\nPriority: ${data.priority}\nStatus: ${data.status}\n\nView: ${data.ticketUrl}`
	});
}

/**
 * Send email when a ticket receives a reply
 */
export async function sendTicketReplyEmail(data: TicketEmailData & { replyFrom: string; replyContent: string }): Promise<EmailResult> {
	const content = `
		<h1>NEW REPLY</h1>
		<p>Hello ${data.recipientName},</p>
		<p>There's a new reply on your support ticket.</p>
		
		<div class="highlight">
			<div class="detail-row">
				<span class="detail-label">Ticket</span>
				<span class="detail-value">${data.ticketNumber}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Subject</span>
				<span class="detail-value">${data.subject}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">From</span>
				<span class="detail-value">${data.replyFrom}</span>
			</div>
		</div>
		
		<div style="background: #fafafa; padding: 16px; margin: 16px 0; border: 1px solid #e5e5e5;">
			${data.replyContent}
		</div>
		
		<p style="text-align: center; margin: 32px 0;">
			<a href="${data.ticketUrl}" class="button">VIEW & REPLY</a>
		</p>
	`;

	return sendEmail({
		to: data.recipientEmail,
		subject: `Re: [${data.ticketNumber}] ${data.subject}`,
		html: baseTemplate(content),
		text: `New Reply on Ticket: ${data.subject}\n\nFrom: ${data.replyFrom}\n\n${data.replyContent}\n\nView: ${data.ticketUrl}`
	});
}

/**
 * Send email when a ticket status changes
 */
export async function sendTicketStatusChangeEmail(data: TicketEmailData & { oldStatus: string; newStatus: string }): Promise<EmailResult> {
	const content = `
		<h1>TICKET UPDATE</h1>
		<p>Hello ${data.recipientName},</p>
		<p>The status of your ticket has been updated.</p>
		
		<div class="highlight">
			<div class="detail-row">
				<span class="detail-label">Ticket</span>
				<span class="detail-value">${data.ticketNumber}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Subject</span>
				<span class="detail-value">${data.subject}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Previous Status</span>
				<span class="detail-value">${data.oldStatus}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">New Status</span>
				<span class="detail-value" style="color: #22c55e; font-weight: 600;">${data.newStatus}</span>
			</div>
		</div>
		
		<p style="text-align: center; margin: 32px 0;">
			<a href="${data.ticketUrl}" class="button">VIEW TICKET</a>
		</p>
	`;

	return sendEmail({
		to: data.recipientEmail,
		subject: `[${data.ticketNumber}] Status: ${data.newStatus}`,
		html: baseTemplate(content),
		text: `Ticket Status Updated: ${data.subject}\n\nTicket: ${data.ticketNumber}\nStatus: ${data.oldStatus} → ${data.newStatus}\n\nView: ${data.ticketUrl}`
	});
}

// =============================================================================
// ORGANIZATION EMAILS
// =============================================================================

export interface InviteEmailData {
	recipientEmail: string;
	organizationName: string;
	inviterName: string;
	role: string;
	inviteUrl: string;
	expiresAt?: Date;
}

/**
 * Send organization invite email
 */
export async function sendInviteEmail(data: InviteEmailData): Promise<EmailResult> {
	const expiresStr = data.expiresAt
		? data.expiresAt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
		: 'Never';

	const content = `
		<h1>YOU'RE INVITED</h1>
		<p>You've been invited to join <strong>${data.organizationName}</strong> on MostlyWhat Systems.</p>
		
		<div class="highlight">
			<div class="detail-row">
				<span class="detail-label">Organization</span>
				<span class="detail-value">${data.organizationName}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Invited By</span>
				<span class="detail-value">${data.inviterName}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Role</span>
				<span class="detail-value">${data.role}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Expires</span>
				<span class="detail-value">${expiresStr}</span>
			</div>
		</div>
		
		<p>Click the button below to accept this invitation. You may need to create an account if you don't have one.</p>
		
		<p style="text-align: center; margin: 32px 0;">
			<a href="${data.inviteUrl}" class="button">ACCEPT INVITATION</a>
		</p>
		
		<div class="meta">
			If you weren't expecting this invitation, you can ignore this email.
		</div>
	`;

	return sendEmail({
		to: data.recipientEmail,
		subject: `Invitation to join ${data.organizationName}`,
		html: baseTemplate(content),
		text: `You're Invited!\n\nYou've been invited to join ${data.organizationName} as ${data.role} by ${data.inviterName}.\n\nAccept: ${data.inviteUrl}\n\nThis invitation expires: ${expiresStr}`
	});
}

// =============================================================================
// PROJECT EMAILS
// =============================================================================

export interface ProjectEmailData {
	recipientName: string;
	recipientEmail: string;
	projectNumber: string;
	projectName: string;
	organizationName: string;
	status: string;
	projectUrl: string;
}

/**
 * Send email when a project is created
 */
export async function sendProjectCreatedEmail(data: ProjectEmailData): Promise<EmailResult> {
	const content = `
		<h1>PROJECT CREATED</h1>
		<p>Hello ${data.recipientName},</p>
		<p>A new project has been created for <strong>${data.organizationName}</strong>.</p>
		
		<div class="highlight">
			<div class="detail-row">
				<span class="detail-label">Project</span>
				<span class="detail-value">${data.projectNumber}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Name</span>
				<span class="detail-value">${data.projectName}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Status</span>
				<span class="detail-value">${data.status}</span>
			</div>
		</div>
		
		<p>You can now track the progress of this project in your portal.</p>
		
		<p style="text-align: center; margin: 32px 0;">
			<a href="${data.projectUrl}" class="button">VIEW PROJECT</a>
		</p>
	`;

	return sendEmail({
		to: data.recipientEmail,
		subject: `Project Created: ${data.projectName}`,
		html: baseTemplate(content),
		text: `Project Created: ${data.projectName}\n\nProject: ${data.projectNumber}\nOrganization: ${data.organizationName}\nStatus: ${data.status}\n\nView: ${data.projectUrl}`
	});
}

/**
 * Send email when a project status changes
 */
export async function sendProjectStatusChangeEmail(data: ProjectEmailData & { oldStatus: string; newStatus: string }): Promise<EmailResult> {
	const content = `
		<h1>PROJECT UPDATE</h1>
		<p>Hello ${data.recipientName},</p>
		<p>The status of your project has been updated.</p>
		
		<div class="highlight">
			<div class="detail-row">
				<span class="detail-label">Project</span>
				<span class="detail-value">${data.projectNumber}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Name</span>
				<span class="detail-value">${data.projectName}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Previous Status</span>
				<span class="detail-value">${data.oldStatus}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">New Status</span>
				<span class="detail-value" style="color: #22c55e; font-weight: 600;">${data.newStatus}</span>
			</div>
		</div>
		
		<p style="text-align: center; margin: 32px 0;">
			<a href="${data.projectUrl}" class="button">VIEW PROJECT</a>
		</p>
	`;

	return sendEmail({
		to: data.recipientEmail,
		subject: `[${data.projectNumber}] Status: ${data.newStatus}`,
		html: baseTemplate(content),
		text: `Project Status Updated: ${data.projectName}\n\nProject: ${data.projectNumber}\nStatus: ${data.oldStatus} → ${data.newStatus}\n\nView: ${data.projectUrl}`
	});
}

// =============================================================================
// INVOICE EMAILS
// =============================================================================

export interface InvoiceEmailData {
	recipientName: string;
	recipientEmail: string;
	invoiceNumber: string;
	organizationName: string;
	total: string;
	currency: string;
	dueDate?: Date;
	invoiceUrl: string;
}

/**
 * Send email when an invoice is created/sent
 */
export async function sendInvoiceEmail(data: InvoiceEmailData): Promise<EmailResult> {
	const dueDateStr = data.dueDate
		? data.dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
		: 'Upon receipt';

	const content = `
		<h1>NEW INVOICE</h1>
		<p>Hello ${data.recipientName},</p>
		<p>An invoice has been generated for <strong>${data.organizationName}</strong>.</p>
		
		<div class="highlight">
			<div class="detail-row">
				<span class="detail-label">Invoice</span>
				<span class="detail-value">${data.invoiceNumber}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Amount</span>
				<span class="detail-value" style="font-size: 18px; font-weight: 600;">${data.currency} ${data.total}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Due Date</span>
				<span class="detail-value">${dueDateStr}</span>
			</div>
		</div>
		
		<p>Please review and process payment at your earliest convenience.</p>
		
		<p style="text-align: center; margin: 32px 0;">
			<a href="${data.invoiceUrl}" class="button">VIEW INVOICE</a>
		</p>
		
		<div class="meta">
			If you have questions about this invoice, reply to this email or contact billing@mostlywhat.com
		</div>
	`;

	return sendEmail({
		to: data.recipientEmail,
		subject: `Invoice ${data.invoiceNumber} - ${data.currency} ${data.total}`,
		html: baseTemplate(content),
		text: `Invoice ${data.invoiceNumber}\n\nOrganization: ${data.organizationName}\nAmount: ${data.currency} ${data.total}\nDue: ${dueDateStr}\n\nView: ${data.invoiceUrl}`
	});
}

/**
 * Send payment reminder email
 */
export async function sendPaymentReminderEmail(data: InvoiceEmailData & { daysOverdue: number }): Promise<EmailResult> {
	const dueDateStr = data.dueDate
		? data.dueDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
		: 'Unknown';

	const content = `
		<h1>PAYMENT REMINDER</h1>
		<p>Hello ${data.recipientName},</p>
		<p>This is a friendly reminder about an outstanding invoice for <strong>${data.organizationName}</strong>.</p>
		
		<div class="highlight" style="border-left-color: #ef4444;">
			<div class="detail-row">
				<span class="detail-label">Invoice</span>
				<span class="detail-value">${data.invoiceNumber}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Amount Due</span>
				<span class="detail-value" style="font-size: 18px; font-weight: 600;">${data.currency} ${data.total}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Due Date</span>
				<span class="detail-value">${dueDateStr}</span>
			</div>
			<div class="detail-row">
				<span class="detail-label">Days Overdue</span>
				<span class="detail-value" style="color: #ef4444; font-weight: 600;">${data.daysOverdue} days</span>
		<p style="text-align: center; margin: 32px 0;">
			<a href="${data.invoiceUrl}" class="button">PAY NOW</a>
		</p>
		
		<div class="meta">
			If payment has already been made, please disregard this notice.
		</div>
	`;

	return sendEmail({
		to: data.recipientEmail,
		subject: `Payment Reminder: Invoice ${data.invoiceNumber} (${data.daysOverdue} days overdue)`,
		html: baseTemplate(content),
		text: `Payment Reminder\n\nInvoice: ${data.invoiceNumber}\nAmount: ${data.currency} ${data.total}\nDue: ${dueDateStr}\nOverdue: ${data.daysOverdue} days\n\nPay: ${data.invoiceUrl}`
	});
}
