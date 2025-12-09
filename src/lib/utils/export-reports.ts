/**
 * Report Export Utilities
 * 
 * Provides functionality for exporting reports to CSV and PDF formats
 */

/**
 * Convert data to CSV format
 */
export function generateCSV(data: any[], headers: string[]): string {
	const rows = [headers.join(',')];
	
	data.forEach(item => {
		const row = headers.map(header => {
			const value = item[header];
			// Escape quotes and wrap in quotes if contains comma
			if (value === null || value === undefined) return '';
			const stringValue = String(value);
			if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
				return `"${stringValue.replace(/"/g, '""')}"`;
			}
			return stringValue;
		});
		rows.push(row.join(','));
	});
	
	return rows.join('\n');
}

/**
 * Download CSV file
 */
export function downloadCSV(csv: string, filename: string) {
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const link = document.createElement('a');
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	link.click();
	URL.revokeObjectURL(link.href);
}

/**
 * Generate and download ticket metrics CSV
 */
export function exportTicketMetricsCSV(metrics: any) {
	const data = [
		{ metric: 'Total Tickets', value: metrics.total },
		{ metric: 'Open Tickets', value: metrics.byStatus.open || 0 },
		{ metric: 'In Progress', value: metrics.byStatus.in_progress || 0 },
		{ metric: 'Waiting', value: metrics.byStatus.waiting || 0 },
		{ metric: 'Resolved', value: metrics.byStatus.resolved || 0 },
		{ metric: 'Closed', value: metrics.byStatus.closed || 0 },
		{ metric: 'Low Priority', value: metrics.byPriority.low || 0 },
		{ metric: 'Medium Priority', value: metrics.byPriority.medium || 0 },
		{ metric: 'High Priority', value: metrics.byPriority.high || 0 },
		{ metric: 'Urgent Priority', value: metrics.byPriority.urgent || 0 }
	];
	
	const csv = generateCSV(data, ['metric', 'value']);
	const timestamp = new Date().toISOString().split('T')[0];
	downloadCSV(csv, `ticket-metrics-${timestamp}.csv`);
}

/**
 * Generate and download project metrics CSV
 */
export function exportProjectMetricsCSV(metrics: any) {
	const data = [
		{ metric: 'Total Projects', value: metrics.total },
		{ metric: 'Request Phase', value: metrics.byPhase.request || 0 },
		{ metric: 'Review Phase', value: metrics.byPhase.review || 0 },
		{ metric: 'Proposal Phase', value: metrics.byPhase.proposal || 0 },
		{ metric: 'Confirmed', value: metrics.byPhase.confirmed || 0 },
		{ metric: 'Building', value: metrics.byPhase.building || 0 },
		{ metric: 'Completed', value: metrics.byPhase.completed || 0 },
		{ metric: 'Support', value: metrics.byPhase.support || 0 }
	];
	
	const csv = generateCSV(data, ['metric', 'value']);
	const timestamp = new Date().toISOString().split('T')[0];
	downloadCSV(csv, `project-metrics-${timestamp}.csv`);
}

/**
 * Generate and download staff performance CSV
 */
export function exportStaffPerformanceCSV(staffPerformance: any[]) {
	const data = staffPerformance.map(staff => ({
		name: staff.name,
		email: staff.email,
		role: staff.role,
		ticketsAssigned: staff.ticketsAssigned,
		ticketsResolved: staff.ticketsResolved,
		resolutionRate: staff.resolutionRate,
		projectsAssigned: staff.projectsAssigned,
		totalReplies: staff.totalReplies,
		avgResponseTime: staff.avgResponseTime || 'N/A'
	}));
	
	const csv = generateCSV(data, [
		'name',
		'email',
		'role',
		'ticketsAssigned',
		'ticketsResolved',
		'resolutionRate',
		'projectsAssigned',
		'totalReplies',
		'avgResponseTime'
	]);
	
	const timestamp = new Date().toISOString().split('T')[0];
	downloadCSV(csv, `staff-performance-${timestamp}.csv`);
}

/**
 * Generate and download invoice metrics CSV
 */
export function exportInvoiceMetricsCSV(metrics: any) {
	const data = [
		{ metric: 'Total Revenue', value: `$${metrics.totalRevenue?.toFixed(2) || '0.00'}` },
		{ metric: 'Total Invoices', value: metrics.total },
		{ metric: 'Paid Invoices', value: metrics.byStatus.paid || 0 },
		{ metric: 'Pending Invoices', value: metrics.byStatus.pending || 0 },
		{ metric: 'Overdue Invoices', value: metrics.byStatus.overdue || 0 },
		{ metric: 'Cancelled Invoices', value: metrics.byStatus.cancelled || 0 },
		{ metric: 'Collection Rate', value: `${metrics.collectionRate?.toFixed(1) || '0.0'}%` }
	];
	
	const csv = generateCSV(data, ['metric', 'value']);
	const timestamp = new Date().toISOString().split('T')[0];
	downloadCSV(csv, `invoice-metrics-${timestamp}.csv`);
}

/**
 * Generate PDF report (client-side using jsPDF)
 * This is a basic implementation - you may want to enhance it
 */
export async function generatePDFReport(title: string, sections: { heading: string; data: any[] }[]) {
	// Dynamic import to reduce bundle size
	const { jsPDF } = await import('jspdf');
	const doc = new jsPDF();
	
	let yPosition = 20;
	
	// Title
	doc.setFontSize(18);
	doc.text(title, 20, yPosition);
	yPosition += 10;
	
	// Date
	doc.setFontSize(10);
	doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPosition);
	yPosition += 15;
	
	// Sections
	sections.forEach(section => {
		// Section heading
		doc.setFontSize(14);
		doc.text(section.heading, 20, yPosition);
		yPosition += 8;
		
		// Section data
		doc.setFontSize(10);
		section.data.forEach(item => {
			const line = `${item.label}: ${item.value}`;
			doc.text(line, 25, yPosition);
			yPosition += 6;
			
			// Add new page if needed
			if (yPosition > 280) {
				doc.addPage();
				yPosition = 20;
			}
		});
		
		yPosition += 8;
	});
	
	const timestamp = new Date().toISOString().split('T')[0];
	doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.pdf`);
}

/**
 * Export comprehensive report to PDF
 */
export async function exportComprehensiveReportPDF(data: {
	ticketMetrics: any;
	projectMetrics: any;
	invoiceMetrics: any;
	staffPerformance: any[];
}) {
	const sections = [
		{
			heading: 'Ticket Metrics',
			data: [
				{ label: 'Total Tickets', value: data.ticketMetrics.total },
				{ label: 'Open', value: data.ticketMetrics.byStatus.open || 0 },
				{ label: 'In Progress', value: data.ticketMetrics.byStatus.in_progress || 0 },
				{ label: 'Resolved', value: data.ticketMetrics.byStatus.resolved || 0 },
				{ label: 'Closed', value: data.ticketMetrics.byStatus.closed || 0 }
			]
		},
		{
			heading: 'Project Metrics',
			data: [
				{ label: 'Total Projects', value: data.projectMetrics.total },
				{ label: 'In Building', value: data.projectMetrics.byPhase.building || 0 },
				{ label: 'Completed', value: data.projectMetrics.byPhase.completed || 0 }
			]
		},
		{
			heading: 'Invoice Metrics',
			data: [
				{ label: 'Total Revenue', value: `$${data.invoiceMetrics.totalRevenue?.toFixed(2) || '0.00'}` },
				{ label: 'Paid Invoices', value: data.invoiceMetrics.byStatus.paid || 0 },
				{ label: 'Pending Invoices', value: data.invoiceMetrics.byStatus.pending || 0 },
				{ label: 'Collection Rate', value: `${data.invoiceMetrics.collectionRate?.toFixed(1) || '0.0'}%` }
			]
		}
	];
	
	await generatePDFReport('System Reports', sections);
}
