/**
 * Analytics Dashboard
 * 
 * Comprehensive analytics and reporting dashboard
 */

<script lang="ts">
	import Chart from '$lib/components/analytics/Chart.svelte';

	interface Props {
		ticketMetrics?: {
			total: number;
			byStatus: Record<string, number>;
			byPriority: Record<string, number>;
			avgResolutionTime: number;
			trend: Array<{ date: string; count: number }>;
		};
		projectMetrics?: {
			total: number;
			byPhase: Record<string, number>;
			completionRate: number;
			avgDuration: number;
		};
		revenueMetrics?: {
			totalRevenue: number;
			paidInvoices: number;
			pendingInvoices: number;
			overdueInvoices: number;
			monthlyRevenue: Array<{ month: string; amount: number }>;
		};
		staffMetrics?: {
			totalStaff: number;
			avgTicketsPerStaff: number;
			topPerformers: Array<{
				name: string;
				ticketsResolved: number;
				avgResolutionTime: number;
			}>;
		};
	}

	let {
		ticketMetrics,
		projectMetrics,
		revenueMetrics,
		staffMetrics
	}: Props = $props();

	// Ticket status chart data
	const ticketStatusData = $derived(
		ticketMetrics
			? {
					labels: Object.keys(ticketMetrics.byStatus),
					datasets: [
						{
							label: 'Tickets by Status',
							data: Object.values(ticketMetrics.byStatus),
							backgroundColor: [
								'#3b82f6', // blue
								'#10b981', // green
								'#f59e0b', // yellow
								'#ef4444', // red
								'#6b7280' // gray
							]
						}
					]
				}
			: null
	);

	// Ticket priority chart data
	const ticketPriorityData = $derived(
		ticketMetrics
			? {
					labels: Object.keys(ticketMetrics.byPriority),
					datasets: [
						{
							label: 'Tickets by Priority',
							data: Object.values(ticketMetrics.byPriority),
							backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981']
						}
					]
				}
			: null
	);

	// Ticket trend chart data
	const ticketTrendData = $derived(
		ticketMetrics
			? {
					labels: ticketMetrics.trend.map((t) => t.date),
					datasets: [
						{
							label: 'Tickets Created',
							data: ticketMetrics.trend.map((t) => t.count),
							borderColor: '#3b82f6',
							backgroundColor: 'rgba(59, 130, 246, 0.1)',
							fill: true,
							tension: 0.4
						}
					]
				}
			: null
	);

	// Project phase chart data
	const projectPhaseData = $derived(
		projectMetrics
			? {
					labels: Object.keys(projectMetrics.byPhase),
					datasets: [
						{
							label: 'Projects by Phase',
							data: Object.values(projectMetrics.byPhase),
							backgroundColor: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']
						}
					]
				}
			: null
	);

	// Revenue trend chart data
	const revenueTrendData = $derived(
		revenueMetrics
			? {
					labels: revenueMetrics.monthlyRevenue.map((m) => m.month),
					datasets: [
						{
							label: 'Monthly Revenue',
							data: revenueMetrics.monthlyRevenue.map((m) => m.amount),
							borderColor: '#10b981',
							backgroundColor: 'rgba(16, 185, 129, 0.1)',
							fill: true
						}
					]
				}
			: null
	);

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}

	function formatDuration(hours: number): string {
		if (hours < 24) {
			return `${hours.toFixed(1)}h`;
		}
		const days = Math.floor(hours / 24);
		return `${days}d`;
	}
</script>

<div class="analytics-dashboard">
	<h1>Analytics Dashboard</h1>

	<!-- Ticket Metrics -->
	{#if ticketMetrics}
		<section class="metrics-section">
			<h2>Ticket Metrics</h2>

			<div class="metric-cards">
				<div class="metric-card">
					<div class="metric-value">{ticketMetrics.total}</div>
					<div class="metric-label">Total Tickets</div>
				</div>
				<div class="metric-card">
					<div class="metric-value">{formatDuration(ticketMetrics.avgResolutionTime)}</div>
					<div class="metric-label">Avg Resolution Time</div>
				</div>
			</div>

			<div class="charts-grid">
				<div class="chart-card">
					<h3>Tickets by Status</h3>
					{#if ticketStatusData}
						<Chart type="doughnut" data={ticketStatusData} height={250} />
					{/if}
				</div>

				<div class="chart-card">
					<h3>Tickets by Priority</h3>
					{#if ticketPriorityData}
						<Chart type="bar" data={ticketPriorityData} height={250} />
					{/if}
				</div>

				<div class="chart-card full-width">
					<h3>Ticket Trend</h3>
					{#if ticketTrendData}
						<Chart type="line" data={ticketTrendData} height={250} />
					{/if}
				</div>
			</div>
		</section>
	{/if}

	<!-- Project Metrics -->
	{#if projectMetrics}
		<section class="metrics-section">
			<h2>Project Metrics</h2>

			<div class="metric-cards">
				<div class="metric-card">
					<div class="metric-value">{projectMetrics.total}</div>
					<div class="metric-label">Total Projects</div>
				</div>
				<div class="metric-card">
					<div class="metric-value">{projectMetrics.completionRate.toFixed(1)}%</div>
					<div class="metric-label">Completion Rate</div>
				</div>
				<div class="metric-card">
					<div class="metric-value">{formatDuration(projectMetrics.avgDuration)}</div>
					<div class="metric-label">Avg Duration</div>
				</div>
			</div>

			<div class="charts-grid">
				<div class="chart-card">
					<h3>Projects by Phase</h3>
					{#if projectPhaseData}
						<Chart type="pie" data={projectPhaseData} height={250} />
					{/if}
				</div>
			</div>
		</section>
	{/if}

	<!-- Revenue Metrics -->
	{#if revenueMetrics}
		<section class="metrics-section">
			<h2>Revenue Metrics</h2>

			<div class="metric-cards">
				<div class="metric-card">
					<div class="metric-value">{formatCurrency(revenueMetrics.totalRevenue)}</div>
					<div class="metric-label">Total Revenue</div>
				</div>
				<div class="metric-card">
					<div class="metric-value">{revenueMetrics.paidInvoices}</div>
					<div class="metric-label">Paid Invoices</div>
				</div>
				<div class="metric-card">
					<div class="metric-value">{revenueMetrics.pendingInvoices}</div>
					<div class="metric-label">Pending Invoices</div>
				</div>
				<div class="metric-card warning">
					<div class="metric-value">{revenueMetrics.overdueInvoices}</div>
					<div class="metric-label">Overdue Invoices</div>
				</div>
			</div>

			<div class="charts-grid">
				<div class="chart-card full-width">
					<h3>Monthly Revenue</h3>
					{#if revenueTrendData}
						<Chart type="line" data={revenueTrendData} height={250} />
					{/if}
				</div>
			</div>
		</section>
	{/if}

	<!-- Staff Performance -->
	{#if staffMetrics}
		<section class="metrics-section">
			<h2>Staff Performance</h2>

			<div class="metric-cards">
				<div class="metric-card">
					<div class="metric-value">{staffMetrics.totalStaff}</div>
					<div class="metric-label">Total Staff</div>
				</div>
				<div class="metric-card">
					<div class="metric-value">{staffMetrics.avgTicketsPerStaff.toFixed(1)}</div>
					<div class="metric-label">Avg Tickets/Staff</div>
				</div>
			</div>

			<div class="top-performers">
				<h3>Top Performers</h3>
				<div class="performers-list">
					{#each staffMetrics.topPerformers as performer}
						<div class="performer-card">
							<div class="performer-name">{performer.name}</div>
							<div class="performer-stats">
								<span>{performer.ticketsResolved} tickets</span>
								<span class="separator">•</span>
								<span>{formatDuration(performer.avgResolutionTime)} avg time</span>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</section>
	{/if}
</div>

<style>
	.analytics-dashboard {
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

	h1 {
		font-size: 2rem;
		font-weight: 700;
		margin-bottom: 2rem;
		color: #111827;
	}

	.metrics-section {
		margin-bottom: 3rem;
	}

	.metrics-section h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1.5rem;
		color: #374151;
	}

	.metric-cards {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1rem;
		margin-bottom: 2rem;
	}

	.metric-card {
		background: white;
		border-radius: 0.5rem;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.metric-card.warning {
		background: #fef3c7;
	}

	.metric-value {
		font-size: 2rem;
		font-weight: 700;
		color: #111827;
		margin-bottom: 0.5rem;
	}

	.metric-label {
		font-size: 0.875rem;
		color: #6b7280;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.charts-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
		gap: 1.5rem;
	}

	.chart-card {
		background: white;
		border-radius: 0.5rem;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.chart-card.full-width {
		grid-column: 1 / -1;
	}

	.chart-card h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #374151;
	}

	.top-performers {
		background: white;
		border-radius: 0.5rem;
		padding: 1.5rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.top-performers h3 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #374151;
	}

	.performers-list {
		display: grid;
		gap: 1rem;
	}

	.performer-card {
		padding: 1rem;
		background: #f9fafb;
		border-radius: 0.375rem;
		border-left: 4px solid #3b82f6;
	}

	.performer-name {
		font-weight: 600;
		color: #111827;
		margin-bottom: 0.5rem;
	}

	.performer-stats {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.separator {
		margin: 0 0.5rem;
	}

	@media (max-width: 768px) {
		.analytics-dashboard {
			padding: 1rem;
		}

		.charts-grid {
			grid-template-columns: 1fr;
		}

		.metric-cards {
			grid-template-columns: 1fr;
		}
	}
</style>
