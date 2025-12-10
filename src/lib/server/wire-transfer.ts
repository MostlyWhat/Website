/**
 * Wire Transfer Payment System
 * 
 * Handles manual wire transfer payments with receipt upload and admin approval
 */

import { createDb } from '$lib/server/db';
import { invoices } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export interface WireTransferDetails {
	bankName: string;
	accountName: string;
	accountNumber: string;
	routingNumber?: string;
	swiftCode?: string;
	iban?: string;
	reference: string;
	amount: string;
	currency: string;
}

/**
 * Generate wire transfer instructions for an invoice
 */
export function generateWireTransferInstructions(
	invoiceNumber: string,
	amount: number,
	currency: string = 'USD',
	discount: number = 0 // percentage
): WireTransferDetails {
	const discountedAmount = discount > 0 
		? (amount * (1 - discount / 100)).toFixed(2)
		: amount.toFixed(2);

	return {
		bankName: process.env.BANK_NAME || 'Your Bank Name',
		accountName: process.env.BANK_ACCOUNT_NAME || 'Your Company Name',
		accountNumber: process.env.BANK_ACCOUNT_NUMBER || '****',
		routingNumber: process.env.BANK_ROUTING_NUMBER,
		swiftCode: process.env.BANK_SWIFT_CODE,
		iban: process.env.BANK_IBAN,
		reference: `INV-${invoiceNumber}`,
		amount: discountedAmount,
		currency
	};
}

/**
 * Save wire transfer instructions to invoice
 */
export async function saveWireTransferInstructions(
	invoiceId: string,
	instructions: WireTransferDetails,
	discount: number = 0
) {
	const db = createDb();

	const instructionsText = `
Bank: ${instructions.bankName}
Account Name: ${instructions.accountName}
Account Number: ${instructions.accountNumber}
${instructions.routingNumber ? `Routing Number: ${instructions.routingNumber}\n` : ''}
${instructions.swiftCode ? `SWIFT Code: ${instructions.swiftCode}\n` : ''}
${instructions.iban ? `IBAN: ${instructions.iban}\n` : ''}
Reference: ${instructions.reference}
Amount: ${instructions.currency} ${instructions.amount}
${discount > 0 ? `\n🎉 Wire Transfer Discount: ${discount}% applied!` : ''}
	`.trim();

	await db
		.update(invoices)
		.set({
			paymentProvider: 'wire_transfer',
			wireTransferInstructions: instructionsText,
			wireTransferDiscount: discount.toString(),
			updatedAt: new Date()
		})
		.where(eq(invoices.id, invoiceId));
}

/**
 * Upload wire transfer receipt
 */
export async function uploadWireTransferReceipt(
	invoiceId: string,
	receiptUrl: string,
	uploadedBy: string
) {
	const db = createDb();

	await db
		.update(invoices)
		.set({
			wireTransferReceiptUrl: receiptUrl,
			status: 'pending', // Pending admin approval
			paymentMethod: 'wire_transfer',
			updatedAt: new Date()
		})
		.where(eq(invoices.id, invoiceId));

	// TODO: Send notification to admins for approval
	console.log(`Wire transfer receipt uploaded for invoice ${invoiceId}`);
}

/**
 * Approve wire transfer payment
 */
export async function approveWireTransferPayment(
	invoiceId: string,
	approvedBy: string,
	paymentReference?: string
) {
	const db = createDb();

	await db
		.update(invoices)
		.set({
			status: 'paid',
			wireTransferApprovedBy: approvedBy,
			wireTransferApprovedAt: new Date(),
			paymentReference: paymentReference || `WIRE-${Date.now()}`,
			updatedAt: new Date()
		})
		.where(eq(invoices.id, invoiceId));

	// TODO: Send payment confirmation email to customer
	console.log(`Wire transfer payment approved for invoice ${invoiceId}`);
}

/**
 * Reject wire transfer payment
 */
export async function rejectWireTransferPayment(
	invoiceId: string,
	rejectedBy: string,
	reason: string
) {
	const db = createDb();

	await db
		.update(invoices)
		.set({
			status: 'sent', // Back to sent status
			internalNotes: `Wire transfer rejected by ${rejectedBy}: ${reason}`,
			wireTransferReceiptUrl: null, // Clear receipt
			updatedAt: new Date()
		})
		.where(eq(invoices.id, invoiceId));

	// TODO: Send rejection email to customer with reason
	console.log(`Wire transfer payment rejected for invoice ${invoiceId}: ${reason}`);
}

/**
 * Get default wire transfer discount percentage
 */
export function getWireTransferDiscount(): number {
	return parseFloat(process.env.WIRE_TRANSFER_DISCOUNT_PERCENT || '3');
}

/**
 * Calculate wire transfer savings
 */
export function calculateWireTransferSavings(
	amount: number,
	discount: number = getWireTransferDiscount()
): {
	originalAmount: number;
	discountedAmount: number;
	savings: number;
	discountPercent: number;
} {
	const savings = amount * (discount / 100);
	const discountedAmount = amount - savings;

	return {
		originalAmount: amount,
		discountedAmount,
		savings,
		discountPercent: discount
	};
}
