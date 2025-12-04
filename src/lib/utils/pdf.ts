/**
 * PDF Generation Utilities
 * Uses jsPDF for client-side PDF generation
 */
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ProposalPDFData {
	proposalNumber: string;
	title: string;
	organization: string;
	orgNumber: string;
	createdAt: Date | string;
	validUntil: Date | string | null;
	description: string | null;
	scope: string | null;
	timeline: string | null;
	deliverables: string | null;
	terms: string | null;
	subtotal: number;
	taxRate: number;
	taxAmount: number;
	total: number;
	currency: string;
	lineItems: Array<{
		description: string;
		quantity: number;
		unitPrice: number;
		amount: number;
	}>;
	sections: Array<{
		title: string;
		content: string;
		order: number;
	}>;
}

export interface InvoicePDFData {
	invoiceNumber: string;
	organizationName: string;
	issuedAt: Date | string;
	dueDate: Date | string;
	status: string;
	subtotal: number;
	taxRate: number;
	taxAmount: number;
	total: number;
	currency: string;
	notes: string | null;
	lineItems: Array<{
		description: string;
		quantity: number;
		unitPrice: number;
		amount: number;
	}>;
}

function formatCurrency(amount: number, currency: string = 'USD'): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency
	}).format(amount);
}

function formatDate(date: Date | string | null): string {
	if (!date) return 'N/A';
	return new Date(date).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});
}

/**
 * Generate a PDF for a proposal
 */
export function generateProposalPDF(data: ProposalPDFData): jsPDF {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.getWidth();
	const margin = 20;
	const contentWidth = pageWidth - margin * 2;
	let yPos = margin;

	// Colors
	const primaryColor = '#000000';
	const mutedColor = '#6B7280';
	const borderColor = '#E5E7EB';

	// Header
	doc.setFillColor(0, 0, 0);
	doc.rect(0, 0, pageWidth, 40, 'F');

	doc.setTextColor(255, 255, 255);
	doc.setFontSize(24);
	doc.setFont('helvetica', 'bold');
	doc.text('PROPOSAL', margin, 26);

	doc.setFontSize(10);
	doc.setFont('helvetica', 'normal');
	doc.text(`#${data.proposalNumber}`, pageWidth - margin, 26, { align: 'right' });

	yPos = 55;

	// Company info
	doc.setTextColor(0, 0, 0);
	doc.setFontSize(12);
	doc.setFont('helvetica', 'bold');
	doc.text('MostlyWhat Systems', margin, yPos);
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(10);
	doc.setTextColor(107, 114, 128);
	doc.text('contact@mostlywhat.com', margin, yPos + 6);
	doc.text('www.mostlywhat.com', margin, yPos + 12);

	// Client info (right side)
	doc.setTextColor(0, 0, 0);
	doc.setFontSize(10);
	doc.setFont('helvetica', 'bold');
	doc.text('PREPARED FOR', pageWidth - margin, yPos, { align: 'right' });
	doc.setFont('helvetica', 'normal');
	doc.text(data.organization, pageWidth - margin, yPos + 6, { align: 'right' });
	doc.setTextColor(107, 114, 128);
	doc.text(`Org #${data.orgNumber}`, pageWidth - margin, yPos + 12, { align: 'right' });

	yPos += 30;

	// Dates
	doc.setDrawColor(229, 231, 235);
	doc.line(margin, yPos, pageWidth - margin, yPos);
	yPos += 10;

	doc.setTextColor(107, 114, 128);
	doc.setFontSize(9);
	doc.text(`CREATED: ${formatDate(data.createdAt)}`, margin, yPos);
	if (data.validUntil) {
		doc.text(`VALID UNTIL: ${formatDate(data.validUntil)}`, pageWidth / 2, yPos);
	}

	yPos += 15;

	// Title
	doc.setTextColor(0, 0, 0);
	doc.setFontSize(18);
	doc.setFont('helvetica', 'bold');
	const titleLines = doc.splitTextToSize(data.title, contentWidth);
	doc.text(titleLines, margin, yPos);
	yPos += titleLines.length * 8 + 10;

	// Description
	if (data.description) {
		doc.setFontSize(11);
		doc.setFont('helvetica', 'normal');
		doc.setTextColor(75, 85, 99);
		const descLines = doc.splitTextToSize(data.description, contentWidth);
		doc.text(descLines, margin, yPos);
		yPos += descLines.length * 5 + 15;
	}

	// Custom sections
	for (const section of data.sections.sort((a, b) => a.order - b.order)) {
		// Check if we need a new page
		if (yPos > 250) {
			doc.addPage();
			yPos = margin;
		}

		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		doc.setTextColor(0, 0, 0);
		doc.text(section.title.toUpperCase(), margin, yPos);
		yPos += 8;

		doc.setFontSize(10);
		doc.setFont('helvetica', 'normal');
		doc.setTextColor(75, 85, 99);
		const sectionLines = doc.splitTextToSize(section.content, contentWidth);
		doc.text(sectionLines, margin, yPos);
		yPos += sectionLines.length * 5 + 15;
	}

	// Line Items Table
	if (data.lineItems.length > 0) {
		if (yPos > 200) {
			doc.addPage();
			yPos = margin;
		}

		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		doc.setTextColor(0, 0, 0);
		doc.text('PRICING', margin, yPos);
		yPos += 10;

		autoTable(doc, {
			startY: yPos,
			head: [['Description', 'Qty', 'Unit Price', 'Amount']],
			body: data.lineItems.map((item) => [
				item.description,
				item.quantity.toString(),
				formatCurrency(item.unitPrice, data.currency),
				formatCurrency(item.amount, data.currency)
			]),
			theme: 'plain',
			headStyles: {
				fillColor: [0, 0, 0],
				textColor: [255, 255, 255],
				fontSize: 9,
				fontStyle: 'bold'
			},
			bodyStyles: {
				fontSize: 10,
				textColor: [0, 0, 0]
			},
			columnStyles: {
				0: { cellWidth: 'auto' },
				1: { cellWidth: 25, halign: 'center' },
				2: { cellWidth: 35, halign: 'right' },
				3: { cellWidth: 35, halign: 'right' }
			},
			margin: { left: margin, right: margin }
		});

		// Get the final Y position after the table
		yPos = (doc as any).lastAutoTable?.finalY ?? yPos + 50;
		yPos += 10;

		// Summary
		const summaryX = pageWidth - margin - 80;
		doc.setFontSize(10);
		doc.setFont('helvetica', 'normal');
		doc.setTextColor(107, 114, 128);
		doc.text('Subtotal:', summaryX, yPos);
		doc.setTextColor(0, 0, 0);
		doc.text(formatCurrency(data.subtotal, data.currency), pageWidth - margin, yPos, {
			align: 'right'
		});

		yPos += 6;
		doc.setTextColor(107, 114, 128);
		doc.text(`Tax (${data.taxRate}%):`, summaryX, yPos);
		doc.setTextColor(0, 0, 0);
		doc.text(formatCurrency(data.taxAmount, data.currency), pageWidth - margin, yPos, {
			align: 'right'
		});

		yPos += 8;
		doc.setDrawColor(0, 0, 0);
		doc.line(summaryX, yPos - 2, pageWidth - margin, yPos - 2);

		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		doc.text('Total:', summaryX, yPos + 4);
		doc.text(formatCurrency(data.total, data.currency), pageWidth - margin, yPos + 4, {
			align: 'right'
		});
	}

	// Terms (new page if needed)
	if (data.terms) {
		doc.addPage();
		yPos = margin;

		doc.setFontSize(12);
		doc.setFont('helvetica', 'bold');
		doc.setTextColor(0, 0, 0);
		doc.text('TERMS & CONDITIONS', margin, yPos);
		yPos += 10;

		doc.setFontSize(10);
		doc.setFont('helvetica', 'normal');
		doc.setTextColor(75, 85, 99);
		const termsLines = doc.splitTextToSize(data.terms, contentWidth);
		doc.text(termsLines, margin, yPos);
	}

	// Footer on all pages
	const pageCount = doc.getNumberOfPages();
	for (let i = 1; i <= pageCount; i++) {
		doc.setPage(i);
		doc.setFontSize(8);
		doc.setTextColor(156, 163, 175);
		doc.text(
			`${data.proposalNumber} | Page ${i} of ${pageCount}`,
			pageWidth / 2,
			doc.internal.pageSize.getHeight() - 10,
			{ align: 'center' }
		);
	}

	return doc;
}

/**
 * Generate a PDF for an invoice
 */
export function generateInvoicePDF(data: InvoicePDFData): jsPDF {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.getWidth();
	const margin = 20;
	const contentWidth = pageWidth - margin * 2;
	let yPos = margin;

	// Header
	doc.setFillColor(0, 0, 0);
	doc.rect(0, 0, pageWidth, 40, 'F');

	doc.setTextColor(255, 255, 255);
	doc.setFontSize(24);
	doc.setFont('helvetica', 'bold');
	doc.text('INVOICE', margin, 26);

	doc.setFontSize(10);
	doc.setFont('helvetica', 'normal');
	doc.text(`#${data.invoiceNumber}`, pageWidth - margin, 26, { align: 'right' });

	yPos = 55;

	// Company info
	doc.setTextColor(0, 0, 0);
	doc.setFontSize(12);
	doc.setFont('helvetica', 'bold');
	doc.text('MostlyWhat Systems', margin, yPos);
	doc.setFont('helvetica', 'normal');
	doc.setFontSize(10);
	doc.setTextColor(107, 114, 128);
	doc.text('contact@mostlywhat.com', margin, yPos + 6);
	doc.text('www.mostlywhat.com', margin, yPos + 12);

	// Client info (right side)
	doc.setTextColor(0, 0, 0);
	doc.setFontSize(10);
	doc.setFont('helvetica', 'bold');
	doc.text('BILL TO', pageWidth - margin, yPos, { align: 'right' });
	doc.setFont('helvetica', 'normal');
	doc.text(data.organizationName, pageWidth - margin, yPos + 6, { align: 'right' });

	yPos += 30;

	// Invoice details
	doc.setDrawColor(229, 231, 235);
	doc.line(margin, yPos, pageWidth - margin, yPos);
	yPos += 10;

	doc.setTextColor(107, 114, 128);
	doc.setFontSize(9);
	doc.text(`ISSUED: ${formatDate(data.issuedAt)}`, margin, yPos);
	doc.text(`DUE: ${formatDate(data.dueDate)}`, margin + 60, yPos);

	// Status badge
	const statusColors: Record<string, [number, number, number]> = {
		draft: [156, 163, 175],
		sent: [59, 130, 246],
		paid: [34, 197, 94],
		overdue: [239, 68, 68],
		cancelled: [156, 163, 175]
	};
	const statusColor = statusColors[data.status] || statusColors.draft;
	doc.setTextColor(...statusColor);
	doc.setFont('helvetica', 'bold');
	doc.text(data.status.toUpperCase(), pageWidth - margin, yPos, { align: 'right' });

	yPos += 20;

	// Line Items Table
	if (data.lineItems.length > 0) {
		autoTable(doc, {
			startY: yPos,
			head: [['Description', 'Qty', 'Unit Price', 'Amount']],
			body: data.lineItems.map((item) => [
				item.description,
				item.quantity.toString(),
				formatCurrency(item.unitPrice, data.currency),
				formatCurrency(item.amount, data.currency)
			]),
			theme: 'plain',
			headStyles: {
				fillColor: [0, 0, 0],
				textColor: [255, 255, 255],
				fontSize: 9,
				fontStyle: 'bold'
			},
			bodyStyles: {
				fontSize: 10,
				textColor: [0, 0, 0]
			},
			columnStyles: {
				0: { cellWidth: 'auto' },
				1: { cellWidth: 25, halign: 'center' },
				2: { cellWidth: 35, halign: 'right' },
				3: { cellWidth: 35, halign: 'right' }
			},
			margin: { left: margin, right: margin }
		});

		yPos = (doc as any).lastAutoTable?.finalY ?? yPos + 50;
		yPos += 10;

		// Summary
		const summaryX = pageWidth - margin - 80;
		doc.setFontSize(10);
		doc.setFont('helvetica', 'normal');
		doc.setTextColor(107, 114, 128);
		doc.text('Subtotal:', summaryX, yPos);
		doc.setTextColor(0, 0, 0);
		doc.text(formatCurrency(data.subtotal, data.currency), pageWidth - margin, yPos, {
			align: 'right'
		});

		yPos += 6;
		doc.setTextColor(107, 114, 128);
		doc.text(`Tax (${data.taxRate}%):`, summaryX, yPos);
		doc.setTextColor(0, 0, 0);
		doc.text(formatCurrency(data.taxAmount, data.currency), pageWidth - margin, yPos, {
			align: 'right'
		});

		yPos += 8;
		doc.setDrawColor(0, 0, 0);
		doc.line(summaryX, yPos - 2, pageWidth - margin, yPos - 2);

		doc.setFontSize(14);
		doc.setFont('helvetica', 'bold');
		doc.text('Total Due:', summaryX, yPos + 5);
		doc.text(formatCurrency(data.total, data.currency), pageWidth - margin, yPos + 5, {
			align: 'right'
		});
	}

	// Notes
	if (data.notes) {
		yPos += 30;
		doc.setFontSize(10);
		doc.setFont('helvetica', 'bold');
		doc.setTextColor(0, 0, 0);
		doc.text('NOTES', margin, yPos);
		yPos += 6;

		doc.setFont('helvetica', 'normal');
		doc.setTextColor(107, 114, 128);
		const notesLines = doc.splitTextToSize(data.notes, contentWidth);
		doc.text(notesLines, margin, yPos);
	}

	// Footer
	doc.setFontSize(8);
	doc.setTextColor(156, 163, 175);
	doc.text(
		`Invoice ${data.invoiceNumber} | Generated ${formatDate(new Date())}`,
		pageWidth / 2,
		doc.internal.pageSize.getHeight() - 10,
		{ align: 'center' }
	);

	return doc;
}

/**
 * Download a PDF document
 */
export function downloadPDF(doc: jsPDF, filename: string): void {
	doc.save(filename);
}

/**
 * Open PDF in a new tab
 */
export function openPDFInNewTab(doc: jsPDF): void {
	const pdfBlob = doc.output('blob');
	const url = URL.createObjectURL(pdfBlob);
	window.open(url, '_blank');
}
