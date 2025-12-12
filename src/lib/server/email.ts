import nodemailer from 'nodemailer';
import type { SendMailOptions } from 'nodemailer';
import { env } from '$env/dynamic/private';

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
	const html = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2 style="color: #333;">New Contact Form Submission</h2>
			<div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
				<p><strong>From:</strong> ${data.name}</p>
				<p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
				${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
				${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
				<p><strong>Topic:</strong> ${data.topic}</p>
				${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
				${data.orderId ? `<p><strong>Order ID:</strong> ${data.orderId}</p>` : ''}
			</div>
			<div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
				<h3 style="color: #333; margin-top: 0;">Message:</h3>
				<p style="white-space: pre-wrap;">${data.message}</p>
			</div>
			<p style="margin-top: 20px; color: #666; font-size: 12px;">
				Submission ID: ${data.submissionId} | 
				<a href="https://mostlywhat.com/admin/messages">View in Dashboard</a>
			</p>
		</div>
	`;

	await sendEmail({
		to: env.SMTP_USER || 'admin@mostlywhat.com', // Send to admin email
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

	const html = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2 style="color: #333;">Payment Confirmation</h2>
			<p>Hi ${data.customerName},</p>
			<p>Thank you for your payment! Your transaction has been completed successfully.</p>
			<div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
				<h3 style="margin-top: 0;">Payment Details</h3>
				<p><strong>Order ID:</strong> ${data.orderId}</p>
				<p><strong>Product:</strong> ${data.productName}</p>
				<p><strong>Amount:</strong> ${formattedAmount}</p>
				<p><strong>Status:</strong> Paid</p>
			</div>
			<p>If you have any questions, please contact our support team.</p>
			<p style="margin-top: 30px; color: #666; font-size: 12px;">
				© ${new Date().getFullYear()} MostlyWhat Systems. All rights reserved.
			</p>
		</div>
	`;

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

	const html = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2 style="color: #333;">Refund Processed</h2>
			<p>Hi ${data.customerName},</p>
			<p>Your refund has been processed successfully.</p>
			<div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
				<h3 style="margin-top: 0;">Refund Details</h3>
				<p><strong>Order ID:</strong> ${data.orderId}</p>
				<p><strong>Amount:</strong> ${formattedAmount}</p>
				${data.reason ? `<p><strong>Reason:</strong> ${data.reason}</p>` : ''}
				<p><strong>Status:</strong> Refunded</p>
			</div>
			<p>The refund will appear in your account within 5-10 business days depending on your payment provider.</p>
			<p>If you have any questions, please contact our support team.</p>
			<p style="margin-top: 30px; color: #666; font-size: 12px;">
				© ${new Date().getFullYear()} MostlyWhat Systems. All rights reserved.
			</p>
		</div>
	`;

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
	const html = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2 style="color: #333;">${data.notificationTitle}</h2>
			<p>Hi ${data.userName},</p>
			<div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
				<p style="white-space: pre-wrap;">${data.notificationMessage}</p>
			</div>
			${
				data.actionUrl
					? `
				<div style="text-align: center; margin: 30px 0;">
					<a href="${data.actionUrl}" 
					   style="background-color: #007bff; color: white; padding: 12px 30px; 
					          text-decoration: none; border-radius: 5px; display: inline-block;">
						View Details
					</a>
				</div>
			`
					: ''
			}
			<p style="margin-top: 30px; color: #666; font-size: 12px;">
				© ${new Date().getFullYear()} MostlyWhat Systems. All rights reserved.
			</p>
		</div>
	`;

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

	const html = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2 style="color: #333;">How was your support experience?</h2>
			<p>Hi ${data.customerName},</p>
			<p>Your ticket <strong>#${data.ticketId} - ${data.ticketTitle}</strong> has been resolved.</p>
			<p>We'd love to hear about your experience! Please take a moment to complete our brief survey.</p>
			<div style="text-align: center; margin: 30px 0;">
				<a href="${surveyUrl}" 
				   style="background-color: #28a745; color: white; padding: 15px 40px; 
				          text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">
					Take Survey
				</a>
			</div>
			<p style="color: #666; font-size: 14px;">
				This survey link will expire in 30 days.
			</p>
			<p style="margin-top: 30px; color: #666; font-size: 12px;">
				© ${new Date().getFullYear()} MostlyWhat Systems. All rights reserved.
			</p>
		</div>
	`;

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

	const html = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2 style="color: #333;">Wire Transfer Approval Required</h2>
			<p>A new wire transfer payment proof has been uploaded and requires approval.</p>
			<div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
				<h3 style="margin-top: 0;">Payment Details</h3>
				<p><strong>Invoice ID:</strong> #${data.invoiceId}</p>
				<p><strong>Customer:</strong> ${data.customerName}</p>
				<p><strong>Amount:</strong> ${formattedAmount}</p>
				<p><strong>Upload ID:</strong> ${data.uploadId}</p>
			</div>
			<div style="text-align: center; margin: 30px 0;">
				<a href="${approvalUrl}" 
				   style="background-color: #007bff; color: white; padding: 12px 30px; 
				          text-decoration: none; border-radius: 5px; display: inline-block;">
					Review & Approve
				</a>
			</div>
			<p style="margin-top: 30px; color: #666; font-size: 12px;">
				© ${new Date().getFullYear()} MostlyWhat Systems. All rights reserved.
			</p>
		</div>
	`;

	await sendEmail({
		to: env.SMTP_USER || 'admin@mostlywhat.com', // Send to admin email
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

	const html = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2 style="color: #28a745;">Payment Confirmed</h2>
			<p>Hi ${data.customerName},</p>
			<p>Your wire transfer payment has been confirmed and processed successfully.</p>
			<div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
				<h3 style="margin-top: 0;">Payment Details</h3>
				<p><strong>Invoice ID:</strong> #${data.invoiceId}</p>
				<p><strong>Amount:</strong> ${formattedAmount}</p>
				<p><strong>Status:</strong> Paid</p>
			</div>
			<p>Thank you for your payment!</p>
			<p style="margin-top: 30px; color: #666; font-size: 12px;">
				© ${new Date().getFullYear()} MostlyWhat Systems. All rights reserved.
			</p>
		</div>
	`;

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
	const html = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
			<h2 style="color: #dc3545;">Payment Verification Required</h2>
			<p>Hi ${data.customerName},</p>
			<p>We were unable to verify your wire transfer payment for Invoice #${data.invoiceId}.</p>
			<div style="background-color: #fff3cd; padding: 20px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #ffc107;">
				<h3 style="margin-top: 0; color: #856404;">Reason:</h3>
				<p style="color: #856404;">${data.reason}</p>
			</div>
			<p>Please contact our support team or upload a new payment proof with the correct information.</p>
			<div style="text-align: center; margin: 30px 0;">
				<a href="https://mostlywhat.com/app/invoices/${data.invoiceId}" 
				   style="background-color: #007bff; color: white; padding: 12px 30px; 
				          text-decoration: none; border-radius: 5px; display: inline-block;">
					View Invoice
				</a>
			</div>
			<p style="margin-top: 30px; color: #666; font-size: 12px;">
				© ${new Date().getFullYear()} MostlyWhat Systems. All rights reserved.
			</p>
		</div>
	`;

	await sendEmail({
		to: data.customerEmail,
		subject: `Payment Verification Required - Invoice #${data.invoiceId}`,
		html
	});
}
