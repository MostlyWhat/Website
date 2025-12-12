/**
 * Lemon Squeezy Webhook Handler
 * 
 * Processes webhook events from Lemon Squeezy
 * https://docs.lemonsqueezy.com/api/webhooks
 */

import { json, type RequestHandler } from '@sveltejs/kit';
import { verifyWebhookSignature } from '$lib/server/integrations/lemon-squeezy';
import { createDb } from '$lib/server/db';
import { invoices, organizations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.text();
		const signature = request.headers.get('x-signature');

		if (!signature) {
			return json({ error: 'Missing signature' }, { status: 400 });
		}

		// Verify webhook signature
		if (!verifyWebhookSignature(body, signature)) {
			return json({ error: 'Invalid signature' }, { status: 401 });
		}

		const event = JSON.parse(body);
		const eventName = event.meta?.event_name;

		console.log('Lemon Squeezy webhook received:', eventName);

		const db = createDb();

		switch (eventName) {
			case 'order_created': {
				// Order created - update invoice with checkout ID
				const customData = event.data?.attributes?.custom_data;
				const invoiceId = customData?.invoice_id;

				if (invoiceId) {
					await db
						.update(invoices)
						.set({
							lemonSqueezyCheckoutId: event.data.id,
							lemonSqueezyCustomerId: event.data.attributes.customer_id,
							updatedAt: new Date()
						})
						.where(eq(invoices.id, invoiceId));
				}
				break;
			}

			case 'order_paid': {
				// Payment successful - mark invoice as paid
				const customData = event.data?.attributes?.first_order_item?.custom_data;
				const invoiceId = customData?.invoice_id;

				if (invoiceId) {
					await db
						.update(invoices)
						.set({
							status: 'paid',
							lemonSqueezyOrderId: event.data.id,
							lemonSqueezyCustomerId: event.data.attributes.customer_id,
							paymentMethod: 'lemon_squeezy',
							paymentReference: event.data.attributes.order_number,
							updatedAt: new Date()
						})
						.where(eq(invoices.id, invoiceId));

				// Send payment confirmation email
				try {
					const invoice = await db.query.invoices.findFirst({
						where: eq(invoices.id, invoiceId)
					});

					if (invoice) {
						const org = await db.query.organizations.findFirst({
							where: eq(organizations.id, invoice.organizationId)
						});
						
						if (org?.email) {
							const { sendPaymentConfirmation } = await import('$lib/server/email');
							await sendPaymentConfirmation({
								customerEmail: org.email,
								customerName: org.name || 'Customer',
								amount: event.data.attributes.total,
								currency: event.data.attributes.currency,
								orderId: event.data.attributes.order_number,
								productName: invoice.title || 'Invoice Payment'
							});
						}
					}
				} catch (emailError) {
					console.error('Failed to send payment confirmation email:', emailError);
				}

					console.log(`Invoice ${invoiceId} marked as paid via Lemon Squeezy`);
				}
				break;
			}

			case 'order_refunded': {
				// Order refunded - mark invoice as refunded
				const customData = event.data?.attributes?.first_order_item?.custom_data;
				const invoiceId = customData?.invoice_id;

				if (invoiceId) {
					await db
						.update(invoices)
						.set({
							status: 'refunded',
							updatedAt: new Date()
						})
						.where(eq(invoices.id, invoiceId));

				// Send refund notification email
				try {
					const invoice = await db.query.invoices.findFirst({
						where: eq(invoices.id, invoiceId)
					});

					if (invoice) {
						const org = await db.query.organizations.findFirst({
							where: eq(organizations.id, invoice.organizationId)
						});
						
						if (org?.email) {
							const { sendRefundNotification } = await import('$lib/server/email');
							await sendRefundNotification({
								customerEmail: org.email,
								customerName: org.name || 'Customer',
								amount: event.data.attributes.refunded_amount || event.data.attributes.total,
								currency: event.data.attributes.currency,
								orderId: event.data.attributes.order_number
							});
						}
					}
				} catch (emailError) {
					console.error('Failed to send refund notification email:', emailError);
				}

					console.log(`Invoice ${invoiceId} marked as refunded`);
				}
				break;
			}

			case 'subscription_created':
			case 'subscription_updated':
			case 'subscription_cancelled':
			case 'subscription_resumed':
			case 'subscription_expired':
			case 'subscription_paused':
			case 'subscription_unpaused':
				// Handle subscription events if needed
				console.log('Subscription event received:', eventName);
				break;

			case 'license_key_created':
			case 'license_key_updated':
				// Handle license key events if needed
				console.log('License key event received:', eventName);
				break;

			default:
				console.log('Unhandled webhook event:', eventName);
		}

		return json({ success: true });
	} catch (error) {
		console.error('Error processing Lemon Squeezy webhook:', error);
		return json(
			{ error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
