/**
 * Stripe Payment Integration
 * 
 * Handles payment processing for invoices using Stripe
 */

import Stripe from 'stripe';
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '$env/static/private';
import { PUBLIC_SITE_URL } from '$env/static/public';

// Initialize Stripe
const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2024-11-20.acacia'
});

export interface CreatePaymentIntentOptions {
	invoiceId: string;
	amount: number; // in cents
	currency?: string;
	customerId?: string;
	metadata?: Record<string, string>;
}

export interface CreatePaymentIntentResult {
	success: boolean;
	error?: string;
	clientSecret?: string;
	paymentIntentId?: string;
}

/**
 * Create a Stripe Payment Intent for an invoice
 */
export async function createPaymentIntent(
	options: CreatePaymentIntentOptions
): Promise<CreatePaymentIntentResult> {
	try {
		const { invoiceId, amount, currency = 'usd', customerId, metadata = {} } = options;

		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.round(amount), // Ensure it's an integer
			currency,
			customer: customerId,
			metadata: {
				invoiceId,
				...metadata
			},
			automatic_payment_methods: {
				enabled: true
			}
		});

		return {
			success: true,
			clientSecret: paymentIntent.client_secret || undefined,
			paymentIntentId: paymentIntent.id
		};
	} catch (error) {
		console.error('Error creating payment intent:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to create payment intent'
		};
	}
}

/**
 * Create or retrieve a Stripe customer
 */
export async function getOrCreateStripeCustomer(
	email: string,
	name?: string,
	metadata?: Record<string, string>
): Promise<{ success: boolean; customerId?: string; error?: string }> {
	try {
		// Search for existing customer
		const existingCustomers = await stripe.customers.list({
			email,
			limit: 1
		});

		if (existingCustomers.data.length > 0) {
			return {
				success: true,
				customerId: existingCustomers.data[0].id
			};
		}

		// Create new customer
		const customer = await stripe.customers.create({
			email,
			name,
			metadata
		});

		return {
			success: true,
			customerId: customer.id
		};
	} catch (error) {
		console.error('Error managing Stripe customer:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to manage customer'
		};
	}
}

/**
 * Create a Stripe Checkout Session for invoice payment
 */
export async function createCheckoutSession(options: {
	invoiceId: string;
	invoiceNumber: string;
	amount: number; // in cents
	currency?: string;
	customerEmail?: string;
	metadata?: Record<string, string>;
}): Promise<{ success: boolean; sessionId?: string; url?: string; error?: string }> {
	try {
		const { invoiceId, invoiceNumber, amount, currency = 'usd', customerEmail, metadata = {} } = options;

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: [
				{
					price_data: {
						currency,
						product_data: {
							name: `Invoice ${invoiceNumber}`,
							description: `Payment for Invoice #${invoiceNumber}`
						},
						unit_amount: Math.round(amount)
					},
					quantity: 1
				}
			],
			mode: 'payment',
			success_url: `${PUBLIC_SITE_URL}/app/invoices/${invoiceId}?payment=success`,
			cancel_url: `${PUBLIC_SITE_URL}/app/invoices/${invoiceId}?payment=cancelled`,
			customer_email: customerEmail,
			metadata: {
				invoiceId,
				invoiceNumber,
				...metadata
			}
		});

		return {
			success: true,
			sessionId: session.id,
			url: session.url || undefined
		};
	} catch (error) {
		console.error('Error creating checkout session:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to create checkout session'
		};
	}
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
	payload: string,
	signature: string
): { success: boolean; event?: Stripe.Event; error?: string } {
	try {
		const event = stripe.webhooks.constructEvent(payload, signature, STRIPE_WEBHOOK_SECRET);

		return {
			success: true,
			event
		};
	} catch (error) {
		console.error('Webhook signature verification failed:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Invalid signature'
		};
	}
}

/**
 * Handle successful payment
 */
export interface PaymentSuccessData {
	paymentIntentId: string;
	invoiceId: string;
	amount: number;
	currency: string;
	customerEmail?: string;
	customerId?: string;
}

/**
 * Retrieve payment intent details
 */
export async function getPaymentIntent(paymentIntentId: string): Promise<{
	success: boolean;
	paymentIntent?: Stripe.PaymentIntent;
	error?: string;
}> {
	try {
		const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

		return {
			success: true,
			paymentIntent
		};
	} catch (error) {
		console.error('Error retrieving payment intent:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to retrieve payment intent'
		};
	}
}

/**
 * Refund a payment
 */
export async function refundPayment(
	paymentIntentId: string,
	amount?: number,
	reason?: Stripe.RefundCreateParams.Reason
): Promise<{ success: boolean; refund?: Stripe.Refund; error?: string }> {
	try {
		const refund = await stripe.refunds.create({
			payment_intent: paymentIntentId,
			amount: amount ? Math.round(amount) : undefined,
			reason
		});

		return {
			success: true,
			refund
		};
	} catch (error) {
		console.error('Error creating refund:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to create refund'
		};
	}
}

/**
 * List all payments for a customer
 */
export async function listCustomerPayments(customerId: string, limit = 10): Promise<{
	success: boolean;
	paymentIntents?: Stripe.PaymentIntent[];
	error?: string;
}> {
	try {
		const paymentIntents = await stripe.paymentIntents.list({
			customer: customerId,
			limit
		});

		return {
			success: true,
			paymentIntents: paymentIntents.data
		};
	} catch (error) {
		console.error('Error listing customer payments:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Failed to list payments'
		};
	}
}

export { stripe };
