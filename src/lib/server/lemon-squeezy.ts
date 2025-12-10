/**
 * Lemon Squeezy Payment Integration
 * 
 * Handles payment processing for invoices using Lemon Squeezy
 * https://docs.lemonsqueezy.com/api
 */

import { LEMON_SQUEEZY_API_KEY, LEMON_SQUEEZY_STORE_ID, LEMON_SQUEEZY_WEBHOOK_SECRET } from '$env/static/private';
import { PUBLIC_SITE_URL } from '$env/static/public';
import crypto from 'node:crypto';

const LEMON_SQUEEZY_API_URL = 'https://api.lemonsqueezy.com/v1';

interface LemonSqueezyCheckoutOptions {
	invoiceId: string;
	customerId: string;
	customerEmail: string;
	customerName: string;
	amount: number; // in cents
	currency?: string;
	productName: string;
	productDescription?: string;
}

interface LemonSqueezyCheckoutResult {
	success: boolean;
	error?: string;
	checkoutUrl?: string;
	checkoutId?: string;
}

/**
 * Create a Lemon Squeezy checkout session
 */
export async function createCheckout(
	options: LemonSqueezyCheckoutOptions
): Promise<LemonSqueezyCheckoutResult> {
	try {
		const {
			invoiceId,
			customerId,
			customerEmail,
			customerName,
			amount,
			currency = 'USD',
			productName,
			productDescription
		} = options;

		const response = await fetch(`${LEMON_SQUEEZY_API_URL}/checkouts`, {
			method: 'POST',
			headers: {
				'Accept': 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json',
				'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`
			},
			body: JSON.stringify({
				data: {
					type: 'checkouts',
					attributes: {
						checkout_data: {
							email: customerEmail,
							name: customerName,
							custom: {
								invoice_id: invoiceId,
								customer_id: customerId
							}
						},
						product_options: {
							name: productName,
							description: productDescription,
							redirect_url: `${PUBLIC_SITE_URL}/app/invoices/${invoiceId}/success`,
							receipt_button_text: 'View Invoice',
							receipt_link_url: `${PUBLIC_SITE_URL}/app/invoices/${invoiceId}`,
							receipt_thank_you_note: 'Thank you for your payment!'
						},
						checkout_options: {
							button_color: '#3b82f6'
						},
						preview_url: `${PUBLIC_SITE_URL}/app/invoices/${invoiceId}`,
						test_mode: process.env.NODE_ENV !== 'production'
					},
					relationships: {
						store: {
							data: {
								type: 'stores',
								id: LEMON_SQUEEZY_STORE_ID
							}
						},
						variant: {
							data: {
								type: 'variants',
								id: process.env.LEMON_SQUEEZY_VARIANT_ID // You'll need to create a variant in LS
							}
						}
					}
				}
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Lemon Squeezy API error:', errorData);
			return {
				success: false,
				error: errorData.errors?.[0]?.detail || 'Failed to create checkout'
			};
		}

		const data = await response.json();
		const checkout = data.data;

		return {
			success: true,
			checkoutUrl: checkout.attributes.url,
			checkoutId: checkout.id
		};
	} catch (error) {
		console.error('Error creating Lemon Squeezy checkout:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Verify Lemon Squeezy webhook signature
 */
export function verifyWebhookSignature(
	payload: string,
	signature: string
): boolean {
	try {
		const hmac = crypto.createHmac('sha256', LEMON_SQUEEZY_WEBHOOK_SECRET);
		const digest = hmac.update(payload).digest('hex');
		
		return crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(digest)
		);
	} catch (error) {
		console.error('Error verifying webhook signature:', error);
		return false;
	}
}

/**
 * Get order details from Lemon Squeezy
 */
export async function getOrder(orderId: string) {
	try {
		const response = await fetch(`${LEMON_SQUEEZY_API_URL}/orders/${orderId}`, {
			headers: {
				'Accept': 'application/vnd.api+json',
				'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`
			}
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Lemon Squeezy API error:', errorData);
			return null;
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error('Error fetching order:', error);
		return null;
	}
}

/**
 * Get customer details from Lemon Squeezy
 */
export async function getCustomer(customerId: string) {
	try {
		const response = await fetch(`${LEMON_SQUEEZY_API_URL}/customers/${customerId}`, {
			headers: {
				'Accept': 'application/vnd.api+json',
				'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`
			}
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Lemon Squeezy API error:', errorData);
			return null;
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error('Error fetching customer:', error);
		return null;
	}
}

/**
 * Create or get Lemon Squeezy customer
 */
export async function getOrCreateCustomer(
	email: string,
	name: string,
	organizationId: string
) {
	try {
		// First, try to find existing customer
		const searchResponse = await fetch(
			`${LEMON_SQUEEZY_API_URL}/customers?filter[email]=${encodeURIComponent(email)}&filter[store_id]=${LEMON_SQUEEZY_STORE_ID}`,
			{
				headers: {
					'Accept': 'application/vnd.api+json',
					'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`
				}
			}
		);

		if (searchResponse.ok) {
			const searchData = await searchResponse.json();
			if (searchData.data && searchData.data.length > 0) {
				return searchData.data[0];
			}
		}

		// Create new customer
		const createResponse = await fetch(`${LEMON_SQUEEZY_API_URL}/customers`, {
			method: 'POST',
			headers: {
				'Accept': 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json',
				'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`
			},
			body: JSON.stringify({
				data: {
					type: 'customers',
					attributes: {
						name,
						email,
						custom_data: {
							organization_id: organizationId
						}
					},
					relationships: {
						store: {
							data: {
								type: 'stores',
								id: LEMON_SQUEEZY_STORE_ID
							}
						}
					}
				}
			})
		});

		if (!createResponse.ok) {
			const errorData = await createResponse.json();
			console.error('Lemon Squeezy API error:', errorData);
			return null;
		}

		const createData = await createResponse.json();
		return createData.data;
	} catch (error) {
		console.error('Error creating/getting customer:', error);
		return null;
	}
}

/**
 * Issue a refund
 */
export async function refundOrder(
	orderId: string,
	amount?: number
): Promise<{ success: boolean; error?: string }> {
	try {
		const response = await fetch(`${LEMON_SQUEEZY_API_URL}/orders/${orderId}/refund`, {
			method: 'POST',
			headers: {
				'Accept': 'application/vnd.api+json',
				'Content-Type': 'application/vnd.api+json',
				'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`
			},
			body: JSON.stringify({
				data: {
					type: 'refunds',
					attributes: amount ? { amount } : {}
				}
			})
		});

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Lemon Squeezy API error:', errorData);
			return {
				success: false,
				error: errorData.errors?.[0]?.detail || 'Failed to process refund'
			};
		}

		return { success: true };
	} catch (error) {
		console.error('Error processing refund:', error);
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * List customer orders
 */
export async function listCustomerOrders(customerId: string) {
	try {
		const response = await fetch(
			`${LEMON_SQUEEZY_API_URL}/orders?filter[customer_id]=${customerId}`,
			{
				headers: {
					'Accept': 'application/vnd.api+json',
					'Authorization': `Bearer ${LEMON_SQUEEZY_API_KEY}`
				}
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			console.error('Lemon Squeezy API error:', errorData);
			return [];
		}

		const data = await response.json();
		return data.data || [];
	} catch (error) {
		console.error('Error fetching customer orders:', error);
		return [];
	}
}

/**
 * Generate checkout URL for invoice (used with Lemon.js overlay)
 */
export function generateCheckoutUrl(
	checkoutId: string,
	options?: {
		embed?: boolean;
		media?: boolean;
		logo?: boolean;
		desc?: boolean;
		discount?: boolean;
		dark?: boolean;
	}
): string {
	const params = new URLSearchParams();
	
	if (options?.embed !== undefined) params.set('embed', options.embed ? '1' : '0');
	if (options?.media !== undefined) params.set('media', options.media ? '1' : '0');
	if (options?.logo !== undefined) params.set('logo', options.logo ? '1' : '0');
	if (options?.desc !== undefined) params.set('desc', options.desc ? '1' : '0');
	if (options?.discount !== undefined) params.set('discount', options.discount ? '1' : '0');
	if (options?.dark !== undefined) params.set('dark', options.dark ? '1' : '0');

	const queryString = params.toString();
	return `https://app.lemonsqueezy.com/checkout/${checkoutId}${queryString ? `?${queryString}` : ''}`;
}
