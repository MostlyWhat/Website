/**
 * Stripe Webhook Handler
 * 
 * Handles webhooks from Stripe for payment events
 */

import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';
import { verifyWebhookSignature } from '$lib/server/stripe';
import { createDb } from '$lib/server/db';
import { invoices } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from '$lib/server/email';

export const POST = async ({ request }: RequestEvent) => {
    const db = createDb();

    try {
        // Get the raw body and signature
        const payload = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return json({ error: 'Missing signature' }, { status: 400 });
        }

        // Verify webhook signature
        const verification = verifyWebhookSignature(payload, signature);

        if (!verification.success || !verification.event) {
            return json({ error: 'Invalid signature' }, { status: 400 });
        }

        const event = verification.event;

        // Handle different event types
        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const invoiceId = paymentIntent.metadata.invoiceId;

                if (!invoiceId) {
                    console.error('Payment succeeded but no invoice ID in metadata');
                    break;
                }

                // Update invoice status
                await db
                    .update(invoices)
                    .set({
                        status: 'paid',
                        paidAt: new Date(),
                        stripePaymentIntentId: paymentIntent.id,
                        updatedAt: new Date()
                    })
                    .where(eq(invoices.id, invoiceId));

                // Get invoice details for email
                const invoice = await db
                    .select()
                    .from(invoices)
                    .where(eq(invoices.id, invoiceId))
                    .limit(1);

                if (invoice[0]) {
                    // Send payment confirmation email
                    await sendEmail({
                        to: paymentIntent.receipt_email || '',
                        subject: `Payment Received - Invoice #${invoice[0].invoiceNumber}`,
                        html: `
							<h2>Payment Confirmed</h2>
							<p>Thank you! Your payment has been received.</p>
							<p><strong>Invoice Number:</strong> ${invoice[0].invoiceNumber}</p>
							<p><strong>Amount Paid:</strong> $${(paymentIntent.amount / 100).toFixed(2)}</p>
							<p><strong>Transaction ID:</strong> ${paymentIntent.id}</p>
						`
                    });
                }

                console.log(`Payment succeeded for invoice ${invoiceId}`);
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                const invoiceId = paymentIntent.metadata.invoiceId;

                if (invoiceId) {
                    console.error(`Payment failed for invoice ${invoiceId}:`, paymentIntent.last_payment_error);

                    // Optionally send email notification about failed payment
                    if (paymentIntent.receipt_email) {
                        await sendEmail({
                            to: paymentIntent.receipt_email,
                            subject: 'Payment Failed',
                            html: `
								<h2>Payment Failed</h2>
								<p>Unfortunately, your payment could not be processed.</p>
								<p>Reason: ${paymentIntent.last_payment_error?.message || 'Unknown error'}</p>
								<p>Please try again or contact support.</p>
							`
                        });
                    }
                }
                break;
            }

            case 'checkout.session.completed': {
                const session = event.data.object;
                const invoiceId = session.metadata?.invoiceId;

                if (!invoiceId) {
                    console.error('Checkout completed but no invoice ID in metadata');
                    break;
                }

                // Update invoice status
                await db
                    .update(invoices)
                    .set({
                        status: 'paid',
                        paidAt: new Date(),
                        stripeSessionId: session.id,
                        updatedAt: new Date()
                    })
                    .where(eq(invoices.id, invoiceId));

                console.log(`Checkout completed for invoice ${invoiceId}`);
                break;
            }

            case 'charge.refunded': {
                const charge = event.data.object;
                const paymentIntentId = charge.payment_intent;

                if (paymentIntentId) {
                    // Find invoice by payment intent ID
                    const invoice = await db
                        .select()
                        .from(invoices)
                        .where(eq(invoices.stripePaymentIntentId, paymentIntentId as string))
                        .limit(1);

                    if (invoice[0]) {
                        // Update invoice status to refunded
                        await db
                            .update(invoices)
                            .set({
                                status: 'refunded',
                                updatedAt: new Date()
                            })
                            .where(eq(invoices.id, invoice[0].id));

                        console.log(`Refund processed for invoice ${invoice[0].id}`);

                        // Send refund notification email
                        if (charge.billing_details?.email) {
                            await sendEmail({
                                to: charge.billing_details.email,
                                subject: `Refund Processed - Invoice #${invoice[0].invoiceNumber}`,
                                html: `
									<h2>Refund Processed</h2>
									<p>Your payment has been refunded.</p>
									<p><strong>Invoice Number:</strong> ${invoice[0].invoiceNumber}</p>
									<p><strong>Refund Amount:</strong> $${(charge.amount_refunded / 100).toFixed(2)}</p>
									<p><strong>Transaction ID:</strong> ${charge.id}</p>
								`
                            });
                        }
                    }
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        return json(
            { error: error instanceof Error ? error.message : 'Webhook processing failed' },
            { status: 500 }
        );
    }
};
