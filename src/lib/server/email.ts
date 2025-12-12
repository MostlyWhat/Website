import nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';
import { env } from '$env/dynamic/private';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Create reusable transporter using Office 365 SMTP configured in Supabase
const transporter = nodemailer.createTransport({
	host: env.SMTP_HOST || 'smtp.office365.com',
	port: parseInt(env.SMTP_PORT || '587'),
	secure: false, // Use TLS
	auth: {
		user: env.SMTP_USER,
		pass: env.SMTP_PASSWORD
	}
});

interface EmailOptions {
	to: string | string[];
	subject: string;
	html: string;
	text?: string;
	replyTo?: string;
}

/**
 * Load email template from file and replace placeholders
 */
async function loadTemplate(templateName: string, replacements: Record<string, string>): Promise<string> {
	const templatePath = join(process.cwd(), 'src', 'lib', 'server', 'templates', `${templateName}.html`);
	let template = await readFile(templatePath, 'utf-8');

	// Replace all placeholders
	for (const [key, value] of Object.entries(replacements)) {
		template = template.replace(new RegExp(`{{${key}}}`, 'g'), value);
	}

	// Always replace year
	template = template.replace(/{{YEAR}}/g, new Date().getFullYear().toString());

	return template;
}

/**
 * Send an email using Office 365 SMTP
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
	const mailOptions: SendMailOptions = {
		from: `${env.SMTP_FROM_NAME || 'MostlyWhat Systems'} <${env.SMTP_FROM_EMAIL || env.SMTP_USER}>`,
		to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
		subject: options.subject,
		html: options.html,
		text: options.text || stripHtml(options.html),
		replyTo: options.replyTo
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log('Email sent successfully to:', options.to);
	} catch (error) {
		console.error('Failed to send email:', error);
		throw new Error('Failed to send email notification');
	}
}

/**
 * Strip HTML tags for plain text fallback
 */
function stripHtml(html: string): string {
	return html
		.replace(/<style[^>]*>.*<\/style>/gm, '')
		.replace(/<script[^>]*>.*<\/script>/gm, '')
		.replace(/<[^>]+>/gm, '')
		.replace(/\s+/g, ' ')
		.trim();
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotification(data: {
	name: string;
	email: string;
	company?: string;
	phone?: string;
	topic: string;
	subject?: string;
	message: string;
	orderId?: string;
	submissionId: number;
}): Promise<void> {
	const replacements: Record<string, string> = {
		NAME: data.name,
		EMAIL: data.email,
		TOPIC: data.topic,
		MESSAGE: data.message,
		SUBMISSION_ID: data.submissionId.toString(),
		COMPANY: data.company ? `<p style="margin: 8px 0; color: #a3a3a3;"><span style="color: #6b7280; text-transform: uppercase; font-size: 10px; letter-spacing: 0.15em;">COMPANY:</span> <strong style="color: #ffffff;">${data.company}</strong></p>` : '',
		PHONE: data.phone ? `<p style="margin: 8px 0; color: #a3a3a3;"><span style="color: #6b7280; text-transform: uppercase; font-size: 10px; letter-spacing: 0.15em;">PHONE:</span> <strong style="color: #ffffff;">${data.phone}</strong></p>` : '',
		SUBJECT: data.subject ? `<p style="margin: 8px 0; color: #a3a3a3;"><span style="color: #6b7280; text-transform: uppercase; font-size: 10px; letter-spacing: 0.15em;">SUBJECT:</span> <strong style="color: #ffffff;">${data.subject}</strong></p>` : '',
		ORDER_ID: data.orderId ? `<p style="margin: 8px 0; color: #a3a3a3;"><span style="color: #6b7280; text-transform: uppercase; font-size: 10px; letter-spacing: 0.15em;">ORDER ID:</span> <strong style="color: #ffffff;">${data.orderId}</strong></p>` : ''
	};

	const html = await loadTemplate('contact-notification', replacements);

	await sendEmail({
		to: env.SMTP_USER || 'admin@mostlywhat.com',
		subject: `New ${data.topic} inquiry from ${data.name}`,
		html,
		replyTo: data.email
	});
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmation(data: {
	customerEmail: string;
	customerName: string;
	amount: number;
	currency: string;
	orderId: string;
	productName: string;
}): Promise<void> {
	const formattedAmount = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: data.currency.toUpperCase()
	}).format(data.amount / 100);

	const html = await loadTemplate('payment-confirmation', {
		CUSTOMER_NAME: data.customerName,
		ORDER_ID: data.orderId,
		PRODUCT_NAME: data.productName,
		AMOUNT: formattedAmount
	});

	await sendEmail({
		to: data.customerEmail,
		subject: `Payment Confirmation - Order ${data.orderId}`,
		html
	});
}

/**
 * Send refund notification email
 */
export async function sendRefundNotification(data: {
	customerEmail: string;
	customerName: string;
	amount: number;
	currency: string;
	orderId: string;
	reason?: string;
}): Promise<void> {
	const formattedAmount = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: data.currency.toUpperCase()
	}).format(data.amount / 100);

	const html = await loadTemplate('refund-notification', {
		CUSTOMER_NAME: data.customerName,
		ORDER_ID: data.orderId,
		AMOUNT: formattedAmount,
		REASON: data.reason ? `<p style="margin: 8px 0; color: #a3a3a3;"><span style="color: #6b7280; text-transform: uppercase; font-size: 10px; letter-spacing: 0.15em;">REASON:</span> <strong style="color: #ffffff;">${data.reason}</strong></p>` : ''
	});

	await sendEmail({
		to: data.customerEmail,
		subject: `Refund Processed - Order ${data.orderId}`,
		html
	});
}

/**
 * Send notification email for in-app notifications
 */
export async function sendNotificationEmail(data: {
	userEmail: string;
	userName: string;
	notificationTitle: string;
	notificationMessage: string;
	actionUrl?: string;
}): Promise<void> {
	const actionButton = data.actionUrl
		? `<div style="text-align: center; margin: 30px 0;">
				<a href="${data.actionUrl}" 
				   style="background-color: #4a9eff; color: #000814; padding: 12px 30px; 
				          text-decoration: none; display: inline-block; 
				          text-transform: uppercase; letter-spacing: 0.15em; font-weight: 600;">
					VIEW DETAILS
				</a>
			</div>`
		: '';

	const html = await loadTemplate('notification-email', {
		USER_NAME: data.userName,
		NOTIFICATION_TITLE: data.notificationTitle,
		NOTIFICATION_MESSAGE: data.notificationMessage,
		ACTION_BUTTON: actionButton,
		UNSUBSCRIBE_URL: 'https://mostlywhat.com/app/settings/notifications'
	});

	await sendEmail({
		to: data.userEmail,
		subject: data.notificationTitle,
		html
	});
}

/**
 * Send satisfaction survey email after ticket closure
 */
export async function sendSurveyEmail(data: {
	customerEmail: string;
	customerName: string;
	ticketId: number;
	ticketTitle: string;
	surveyToken: string;
}): Promise<void> {
	const surveyUrl = `https://mostlywhat.com/survey/${data.surveyToken}`;

	const html = await loadTemplate('survey-email', {
		CUSTOMER_NAME: data.customerName,
		TICKET_ID: data.ticketId.toString(),
		TICKET_TITLE: data.ticketTitle,
		SURVEY_URL: surveyUrl
	});

	await sendEmail({
		to: data.customerEmail,
		subject: `Survey: How was your support experience? (Ticket #${data.ticketId})`,
		html
	});
}

/**
 * Send wire transfer approval request to admins
 */
export async function sendWireTransferApprovalRequest(data: {
	invoiceId: number;
	customerName: string;
	amount: number;
	currency: string;
	uploadId: string;
}): Promise<void> {
	const formattedAmount = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: data.currency
	}).format(data.amount);

	const approvalUrl = `https://mostlywhat.com/admin/invoices/${data.invoiceId}`;

	const html = await loadTemplate('wire-transfer-approval', {
		INVOICE_ID: data.invoiceId.toString(),
		CUSTOMER_NAME: data.customerName,
		AMOUNT: formattedAmount,
		UPLOAD_ID: data.uploadId,
		APPROVAL_URL: approvalUrl
	});

	await sendEmail({
		to: env.SMTP_USER || 'admin@mostlywhat.com',
		subject: `Wire Transfer Approval Required - Invoice #${data.invoiceId}`,
		html
	});
}

/**
 * Send wire transfer confirmation to customer
 */
export async function sendWireTransferConfirmation(data: {
	customerEmail: string;
	customerName: string;
	invoiceId: number;
	amount: number;
	currency: string;
}): Promise<void> {
	const formattedAmount = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: data.currency
	}).format(data.amount);

	const html = await loadTemplate('wire-transfer-confirmation', {
		CUSTOMER_NAME: data.customerName,
		INVOICE_ID: data.invoiceId.toString(),
		AMOUNT: formattedAmount
	});

	await sendEmail({
		to: data.customerEmail,
		subject: `Payment Confirmed - Invoice #${data.invoiceId}`,
		html
	});
}

/**
 * Send wire transfer rejection notification to customer
 */
export async function sendWireTransferRejection(data: {
	customerEmail: string;
	customerName: string;
	invoiceId: number;
	reason: string;
}): Promise<void> {
	const html = await loadTemplate('wire-transfer-rejection', {
		CUSTOMER_NAME: data.customerName,
		INVOICE_ID: data.invoiceId.toString(),
		REASON: data.reason,
		INVOICE_URL: `https://mostlywhat.com/app/invoices/${data.invoiceId}`
	});

	await sendEmail({
		to: data.customerEmail,
		subject: `Payment Verification Required - Invoice #${data.invoiceId}`,
		html
	});
}
