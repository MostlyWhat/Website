<script lang="ts">
	/**
	 * Admin Reports Page
	 * 
	 * Analytics dashboard with key metrics and charts.
	 */
	import { goto } from '$app/navigation';
	import { 
		BarChart3, Ticket, FolderKanban, Receipt, Users, Building2,
		TrendingUp, TrendingDown, Calendar, Filter, ArrowUpRight, UserCog, MessageSquare
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { PageHeader } from '$lib/components/ui/layouts';

	let { data } = $props();
	
	let startDate = $state(data.dateRange.startDate);
	let endDate = $state(data.dateRange.endDate);

	function applyDateFilter() {
		const params = new URLSearchParams();
		if (startDate) params.set('startDate', startDate);
		if (endDate) params.set('endDate', endDate);
		goto(`?${params.toString()}`);
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatNumber(num: number): string {
		return new Intl.NumberFormat('en-US').format(num);
	}

	function getPriorityColor(priority: string): string {
		switch (priority) {
			case 'urgent': return 'bg-red-500';
			case 'high': return 'bg-orange-500';
			case 'medium': return 'bg-yellow-500';
			case 'low': return 'bg-green-500';
			default: return 'bg-muted';
		}
	}

	// Calculate percentages
	const ticketResolutionRate = $derived(
		data.tickets.stats.total > 0
			? Math.round(((data.tickets.stats.resolved + data.tickets.stats.closed) / data.tickets.stats.total) * 100)
			: 0
	);

	const invoiceCollectionRate = $derived(
		data.invoices.stats.totalAmount > 0
			? Math.round((data.invoices.stats.paidAmount / data.invoices.stats.totalAmount) * 100)
			: 0
	);

	// Generate chart bars for tickets by day
	const maxTicketsPerDay = $derived(
		Math.max(...(data.tickets.byDay.map((d: { count: number }) => d.count) || [1]), 1)
	);
</script>

<svelte:head>
	<title>Reports | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ANALYTICS & INSIGHTS</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Reports</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Key metrics and performance overview.
				</p>
			</div>
			<div class="flex items-center gap-3">
				<div class="flex items-center gap-2 border border-border bg-card px-3 py-2">
					<Calendar class="h-4 w-4 text-muted-foreground" />
					<label for="start-date" class="sr-only">Start date</label>
					<input
						id="start-date"
						type="date"
						bind:value={startDate}
						class="bg-transparent text-sm focus:outline-none"
					/>
					<span class="text-muted-foreground">to</span>
					<label for="end-date" class="sr-only">End date</label>
					<input
						id="end-date"
						type="date"
						bind:value={endDate}
						class="bg-transparent text-sm focus:outline-none"
					/>
				</div>
				<Button onclick={applyDateFilter} size="sm" variant="outline">
					<Filter class="h-4 w-4 mr-2" />
					Apply
				</Button>
			</div>
		</div>
	</section>

	<!-- Overview Cards -->
	<section class="px-6 py-8 md:px-12 lg:px-16">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Tickets Card -->
			<Card.Root class="border-border">
				<Card.Content class="p-6">
					<div class="flex items-center justify-between">
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-primary/10">
							<Ticket class="h-5 w-5 text-primary" />
						</div>
						<span class="flex items-center gap-1 text-sm {ticketResolutionRate >= 80 ? 'text-green-500' : 'text-yellow-500'}">
							{ticketResolutionRate}%
							{#if ticketResolutionRate >= 80}
								<TrendingUp class="h-4 w-4" />
							{:else}
								<TrendingDown class="h-4 w-4" />
							{/if}
						</span>
					</div>
					<div class="mt-4">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">TICKETS</span>
						<p class="font-display text-3xl font-bold">{formatNumber(data.tickets.stats.total)}</p>
						<div class="mt-2 flex gap-2 text-xs text-muted-foreground">
							<span class="text-yellow-500">{data.tickets.stats.open} open</span>
							<span>•</span>
							<span class="text-green-500">{data.tickets.stats.resolved} resolved</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Projects Card -->
			<Card.Root class="border-border">
				<Card.Content class="p-6">
					<div class="flex items-center justify-between">
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-blue-500/10">
							<FolderKanban class="h-5 w-5 text-blue-500" />
						</div>
					</div>
					<div class="mt-4">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECTS</span>
						<p class="font-display text-3xl font-bold">{formatNumber(data.projects.stats.total)}</p>
						<div class="mt-2 flex gap-2 text-xs text-muted-foreground">
							<span class="text-yellow-500">{data.projects.stats.inProgress} active</span>
							<span>•</span>
							<span class="text-green-500">{data.projects.stats.completed} completed</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Revenue Card -->
			<Card.Root class="border-border">
				<Card.Content class="p-6">
					<div class="flex items-center justify-between">
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-green-500/10">
							<Receipt class="h-5 w-5 text-green-500" />
						</div>
						<span class="flex items-center gap-1 text-sm {invoiceCollectionRate >= 70 ? 'text-green-500' : 'text-yellow-500'}">
							{invoiceCollectionRate}% collected
						</span>
					</div>
					<div class="mt-4">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">INVOICED</span>
						<p class="font-display text-3xl font-bold">{formatCurrency(data.invoices.stats.totalAmount)}</p>
						<div class="mt-2 flex gap-2 text-xs text-muted-foreground">
							<span class="text-green-500">{formatCurrency(data.invoices.stats.paidAmount)} paid</span>
							<span>•</span>
							<span class="text-red-500">{data.invoices.stats.overdue} overdue</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>

			<!-- Users Card -->
			<Card.Root class="border-border">
				<Card.Content class="p-6">
					<div class="flex items-center justify-between">
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-purple-500/10">
							<Users class="h-5 w-5 text-purple-500" />
						</div>
					</div>
					<div class="mt-4">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">USERS</span>
						<p class="font-display text-3xl font-bold">{formatNumber(data.users.stats.total)}</p>
						<div class="mt-2 flex gap-2 text-xs text-muted-foreground">
							<span>{data.users.stats.customers} customers</span>
							<span>•</span>
							<span>{data.users.stats.staff + data.users.stats.admins} staff</span>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</section>

	<!-- Charts Row -->
	<section class="px-6 pb-8 md:px-12 lg:px-16">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
			<!-- Tickets Over Time -->
			<Card.Root class="border-border">
				<Card.Header class="pb-4">
					<div class="flex items-center justify-between">
						<div>
							<Card.Title class="font-display text-lg uppercase">Tickets Over Time</Card.Title>
							<Card.Description>Daily ticket volume</Card.Description>
						</div>
						<BarChart3 class="h-5 w-5 text-muted-foreground" />
					</div>
				</Card.Header>
				<Card.Content>
					{#if data.tickets.byDay.length > 0}
						<div class="h-48 flex items-end gap-1">
							{#each data.tickets.byDay as day}
								{@const height = (day.count / maxTicketsPerDay) * 100}
								<div 
									class="flex-1 bg-primary/20 hover:bg-primary/40 transition-colors relative group"
									style="height: {Math.max(height, 4)}%"
								>
									<div class="absolute -top-8 left-1/2 -translate-x-1/2 bg-card border border-border px-2 py-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
										{day.count} tickets
									</div>
								</div>
							{/each}
						</div>
						<div class="flex justify-between mt-2 text-xs text-muted-foreground">
							<span>{data.dateRange.startDate}</span>
							<span>{data.dateRange.endDate}</span>
						</div>
					{:else}
						<div class="h-48 flex items-center justify-center text-muted-foreground">
							No data for selected period
						</div>
					{/if}
				</Card.Content>
			</Card.Root>

			<!-- Tickets by Priority -->
			<Card.Root class="border-border">
				<Card.Header class="pb-4">
					<div class="flex items-center justify-between">
						<div>
							<Card.Title class="font-display text-lg uppercase">Tickets by Priority</Card.Title>
							<Card.Description>Distribution of ticket priorities</Card.Description>
						</div>
						<Ticket class="h-5 w-5 text-muted-foreground" />
					</div>
				</Card.Header>
				<Card.Content>
					{#if data.tickets.byPriority.length > 0}
						<div class="space-y-4">
							{#each ['urgent', 'high', 'medium', 'low'] as priority}
								{@const item = data.tickets.byPriority.find((p: { priority: string; count: number }) => p.priority === priority)}
								{@const count = item?.count ?? 0}
								{@const percentage = data.tickets.stats.total > 0 ? (count / data.tickets.stats.total) * 100 : 0}
								<div>
									<div class="flex justify-between items-center mb-1">
										<span class="text-sm capitalize">{priority}</span>
										<span class="text-sm text-muted-foreground">{count}</span>
									</div>
									<div class="h-2 bg-muted overflow-hidden">
										<div 
											class="{getPriorityColor(priority)} h-full transition-all duration-500"
											style="width: {percentage}%"
										></div>
									</div>
								</div>
							{/each}
						</div>
					{:else}
						<div class="h-48 flex items-center justify-center text-muted-foreground">
							No tickets in selected period
						</div>
					{/if}
				</Card.Content>
			</Card.Root>
		</div>
	</section>

	<!-- Bottom Row -->
	<section class="px-6 pb-8 md:px-12 lg:px-16">
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
			<!-- Top Organizations -->
			<Card.Root class="border-border lg:col-span-2">
				<Card.Header class="pb-4">
					<div class="flex items-center justify-between">
						<div>
							<Card.Title class="font-display text-lg uppercase">Top Organizations</Card.Title>
							<Card.Description>By ticket volume in selected period</Card.Description>
						</div>
						<Building2 class="h-5 w-5 text-muted-foreground" />
					</div>
				</Card.Header>
				<Card.Content>
					{#if data.topOrgsByTickets.length > 0}
						<div class="space-y-4">
							{#each data.topOrgsByTickets as org, i}
								<a 
									href="/admin/organizations/{org.organizationId}"
									class="flex items-center gap-4 p-4 border border-border hover:border-primary/50 transition-colors group"
								>
									<span class="font-mono text-2xl text-muted-foreground w-8">{i + 1}</span>
									<div class="flex-1">
										<p class="font-semibold group-hover:text-primary transition-colors">{org.organizationName}</p>
									</div>
									<div class="text-right">
										<p class="font-display text-xl font-bold">{org.count}</p>
										<p class="text-xs text-muted-foreground">tickets</p>
									</div>
									<ArrowUpRight class="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
								</a>
							{/each}
						</div>
					{:else}
						<div class="py-8 text-center text-muted-foreground">
							No organizations with tickets in selected period
						</div>
					{/if}
				</Card.Content>
			</Card.Root>

			<!-- Quick Stats -->
			<Card.Root class="border-border">
				<Card.Header class="pb-4">
					<Card.Title class="font-display text-lg uppercase">Quick Stats</Card.Title>
					<Card.Description>Organization overview</Card.Description>
				</Card.Header>
				<Card.Content class="space-y-6">
					<div class="flex items-center justify-between p-4 border border-border">
						<div>
							<p class="font-mono text-[10px] tracking-widest text-muted-foreground">TOTAL ORGS</p>
							<p class="font-display text-2xl font-bold">{data.organizations.total}</p>
						</div>
						<Building2 class="h-8 w-8 text-muted-foreground" />
					</div>
					
					<div class="flex items-center justify-between p-4 border border-border">
						<div>
							<p class="font-mono text-[10px] tracking-widest text-muted-foreground">NEW IN PERIOD</p>
							<p class="font-display text-2xl font-bold text-green-500">+{data.organizations.newInPeriod}</p>
						</div>
						<TrendingUp class="h-8 w-8 text-green-500" />
					</div>

					<div class="flex items-center justify-between p-4 border border-border">
						<div>
							<p class="font-mono text-[10px] tracking-widest text-muted-foreground">INVOICES SENT</p>
							<p class="font-display text-2xl font-bold">{data.invoices.stats.sent}</p>
						</div>
						<Receipt class="h-8 w-8 text-muted-foreground" />
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	</section>

	<!-- Staff Performance Section -->
	<section class="px-6 pb-8 md:px-12 lg:px-16">
		<Card.Root class="border-border">
			<Card.Header class="pb-4">
				<div class="flex items-center justify-between">
					<div>
						<Card.Title class="font-display text-lg uppercase">Staff Performance</Card.Title>
						<Card.Description>Workload and metrics for team members</Card.Description>
					</div>
					<UserCog class="h-5 w-5 text-muted-foreground" />
				</div>
			</Card.Header>
			<Card.Content>
				{#if data.staffPerformance && data.staffPerformance.length > 0}
					<div class="overflow-x-auto">
						<table class="w-full text-sm">
							<thead>
								<tr class="border-b border-border">
									<th class="text-left py-3 px-4 font-mono text-[10px] tracking-widest text-muted-foreground">STAFF MEMBER</th>
									<th class="text-center py-3 px-4 font-mono text-[10px] tracking-widest text-muted-foreground">ROLE</th>
									<th class="text-center py-3 px-4 font-mono text-[10px] tracking-widest text-muted-foreground">TICKETS ASSIGNED</th>
									<th class="text-center py-3 px-4 font-mono text-[10px] tracking-widest text-muted-foreground">RESOLVED</th>
									<th class="text-center py-3 px-4 font-mono text-[10px] tracking-widest text-muted-foreground">RESOLUTION RATE</th>
									<th class="text-center py-3 px-4 font-mono text-[10px] tracking-widest text-muted-foreground">PROJECTS</th>
									<th class="text-center py-3 px-4 font-mono text-[10px] tracking-widest text-muted-foreground">REPLIES</th>
									<th class="text-center py-3 px-4 font-mono text-[10px] tracking-widest text-muted-foreground">AVG RESPONSE</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-border">
								{#each data.staffPerformance as staff (staff.id)}
									{@const resolutionRate = staff.ticketsAssigned > 0 
										? Math.round((staff.ticketsResolved / staff.ticketsAssigned) * 100) 
										: 0}
									{@const resolutionColor = resolutionRate >= 80 ? 'text-green-500' : resolutionRate >= 50 ? 'text-yellow-500' : 'text-red-500'}
									<tr class="hover:bg-muted/50 transition-colors">
										<td class="py-4 px-4">
											<div class="flex items-center gap-3">
												<div class="h-8 w-8 flex items-center justify-center border border-border bg-muted font-mono text-xs uppercase">
													{(staff.name ?? 'U').charAt(0)}
												</div>
												<span class="font-medium">{staff.name ?? 'Unknown'}</span>
											</div>
										</td>
										<td class="text-center py-4 px-4">
											<span class="px-2 py-0.5 text-xs font-medium border border-border bg-muted">
												{staff.role?.replace('_', ' ').toUpperCase()}
											</span>
										</td>
										<td class="text-center py-4 px-4 font-display text-lg">{staff.ticketsAssigned}</td>
										<td class="text-center py-4 px-4 font-display text-lg text-green-500">{staff.ticketsResolved}</td>
										<td class="text-center py-4 px-4">
											<div class="flex items-center justify-center gap-2">
												<div class="w-16 h-2 bg-muted overflow-hidden">
													<div 
														class="h-full transition-all duration-300 {resolutionColor === 'text-green-500' ? 'bg-green-500' : resolutionColor === 'text-yellow-500' ? 'bg-yellow-500' : 'bg-red-500'}"
														style="width: {resolutionRate}%"
													></div>
												</div>
												<span class="font-mono text-sm {resolutionColor}">{resolutionRate}%</span>
											</div>
										</td>
										<td class="text-center py-4 px-4 font-display text-lg">{staff.projectsAssigned}</td>
										<td class="text-center py-4 px-4">
											<div class="flex items-center justify-center gap-1 text-muted-foreground">
												<MessageSquare class="h-4 w-4" />
												<span>{staff.ticketReplies}</span>
											</div>
										</td>
										<td class="text-center py-4 px-4">
											{#if staff.avgResponseTime !== null}
												<span class="font-mono text-sm {staff.avgResponseTime <= 4 ? 'text-green-500' : staff.avgResponseTime <= 24 ? 'text-yellow-500' : 'text-red-500'}">
													{staff.avgResponseTime.toFixed(1)}h
												</span>
											{:else}
												<span class="text-muted-foreground">—</span>
											{/if}
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>

					<!-- Summary Stats -->
					{#if data.staffPerformance.length > 0}
						{@const totalAssigned = data.staffPerformance.reduce((sum: number, s: typeof data.staffPerformance[0]) => sum + s.ticketsAssigned, 0)}
						{@const totalResolved = data.staffPerformance.reduce((sum: number, s: typeof data.staffPerformance[0]) => sum + s.ticketsResolved, 0)}
						{@const totalReplies = data.staffPerformance.reduce((sum: number, s: typeof data.staffPerformance[0]) => sum + s.ticketReplies, 0)}
						{@const avgResolutionRate = totalAssigned > 0 ? Math.round((totalResolved / totalAssigned) * 100) : 0}
						<div class="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
							<div class="p-4 border border-border">
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">TEAM SIZE</p>
								<p class="font-display text-2xl font-bold">{data.staffPerformance.length}</p>
							</div>
							<div class="p-4 border border-border">
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">TOTAL TICKETS HANDLED</p>
								<p class="font-display text-2xl font-bold">{totalAssigned}</p>
							</div>
							<div class="p-4 border border-border">
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">TEAM RESOLUTION RATE</p>
								<p class="font-display text-2xl font-bold {avgResolutionRate >= 80 ? 'text-green-500' : avgResolutionRate >= 50 ? 'text-yellow-500' : 'text-red-500'}">{avgResolutionRate}%</p>
							</div>
							<div class="p-4 border border-border">
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">TOTAL REPLIES</p>
								<p class="font-display text-2xl font-bold">{totalReplies}</p>
							</div>
						</div>
					{/if}
				{:else}
					<div class="py-12 text-center text-muted-foreground">
						<UserCog class="mx-auto h-12 w-12 opacity-50 mb-4" />
						<p>No staff members found</p>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
	</section>
</div>
