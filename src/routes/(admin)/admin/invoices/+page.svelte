<script lang="ts">
	/**
	 * Admin Invoices List Page
	 */
	import { 
		Receipt, Search, Plus, Building2, Calendar, 
		ChevronRight, Filter, Clock, CheckCircle, AlertCircle, Send, DollarSign, RefreshCw
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { PageHeader, EmptyState } from '$lib/components/ui/layouts';

	let { data } = $props();
	
	let searchQuery = $state('');
	let statusFilter = $state<string>('all');

	// Use real data from server
	const invoices = data.invoices;

	const filteredInvoices = $derived(
		invoices.filter(invoice => {
			const matchesSearch = searchQuery === '' || 
				(invoice.invoiceNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
				(invoice.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
				(invoice.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
			const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
			return matchesSearch && matchesStatus;
		})
	);

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(date: Date | string | null): string {
		if (!date) return '-';
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric' 
		});
	}

	function getStatusConfig(status: string): { icon: typeof Clock; class: string; label: string } {
		switch (status) {
			case 'draft': return { icon: Clock, class: 'bg-muted text-muted-foreground', label: 'Draft' };
			case 'sent': return { icon: Send, class: 'bg-blue-500/10 text-blue-500', label: 'Sent' };
			case 'viewed': return { icon: AlertCircle, class: 'bg-purple-500/10 text-purple-500', label: 'Viewed' };
			case 'paid': return { icon: CheckCircle, class: 'bg-green-500/10 text-green-500', label: 'Paid' };
			case 'partially_paid': return { icon: DollarSign, class: 'bg-yellow-500/10 text-yellow-500', label: 'Partial' };
			case 'overdue': return { icon: AlertCircle, class: 'bg-red-500/10 text-red-500', label: 'Overdue' };
			case 'cancelled': return { icon: AlertCircle, class: 'bg-muted text-muted-foreground', label: 'Cancelled' };
			default: return { icon: Clock, class: 'bg-muted text-muted-foreground', label: status };
		}
	}

	function getRecurringLabel(interval: string | null): string {
		switch (interval) {
			case 'weekly': return 'Weekly';
			case 'bi_weekly': return 'Bi-Weekly';
			case 'monthly': return 'Monthly';
			case 'quarterly': return 'Quarterly';
			case 'yearly': return 'Yearly';
			default: return 'Recurring';
		}
	}

	const totalOutstanding = $derived(invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled').reduce((sum, i) => sum + i.amountDue, 0));
	const totalPaid = $derived(invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.total, 0));
	const totalRecurring = $derived(invoices.filter(i => i.isRecurring).length);
</script>

<svelte:head>
	<title>Invoices | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// INVOICE MANAGEMENT</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Invoices</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Create, send, and track client invoices.
				</p>
			</div>
			<Button href="/admin/invoices/new" size="sm" class="font-ui text-xs tracking-wider">
				<Plus class="mr-2 h-4 w-4" />
				NEW INVOICE
			</Button>
		</div>
	</section>

	<!-- Filters Bar -->
	<section class="border-b border-border bg-card">
		<div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
			<div class="relative flex-1 md:max-w-sm">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search invoices..."
					bind:value={searchQuery}
					class="font-body h-10 w-full rounded-none border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			
			<div class="flex items-center gap-3">
				<Filter class="h-4 w-4 text-muted-foreground" />
				<select
					bind:value={statusFilter}
					class="font-mono h-10 rounded-none border border-border bg-background px-4 text-xs tracking-wider focus:border-primary focus:outline-none"
				>
					<option value="all">ALL STATUS</option>
					<option value="draft">DRAFT</option>
					<option value="sent">SENT</option>
					<option value="viewed">VIEWED</option>
					<option value="paid">PAID</option>
					<option value="partially_paid">PARTIALLY PAID</option>
					<option value="overdue">OVERDUE</option>
				</select>
			</div>
		</div>
	</section>

	<!-- Stats Bar -->
	<section class="border-b border-border">
		<div class="grid grid-cols-10 gap-px bg-border">
			<div class="col-span-2 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-primary">{invoices.length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL</p>
			</div>
			<div class="col-span-2 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-red-500">{invoices.filter(i => i.status === 'overdue').length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">OVERDUE</p>
			</div>
			<div class="col-span-2 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-primary">{totalRecurring}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">RECURRING</p>
			</div>
			<div class="col-span-2 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-yellow-500">{formatCurrency(totalOutstanding)}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">OUTSTANDING</p>
			</div>
			<div class="col-span-2 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-green-500">{formatCurrency(totalPaid)}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">COLLECTED</p>
			</div>
		</div>
	</section>

	<!-- Invoices List -->
	<section class="border-b border-border bg-background">
		{#if filteredInvoices.length > 0}
			<div class="divide-y divide-border">
				{#each filteredInvoices as invoice}
					{@const statusConfig = getStatusConfig(invoice.status)}
					{@const StatusIcon = statusConfig.icon}
					<a
						href="/admin/invoices/{invoice.id}"
						class="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-card md:px-12 lg:px-16"
					>
						<!-- Icon -->
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
							<Receipt class="h-5 w-5 text-primary" />
						</div>

						<!-- Invoice Info -->
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-3 flex-wrap">
								<h3 class="font-mono text-sm font-bold tracking-wider">{invoice.invoiceNumber}</h3>
								<span class="inline-flex items-center gap-1 px-2 py-0.5 {statusConfig.class}">
									<StatusIcon class="h-3 w-3" />
									<span class="font-mono text-[10px] tracking-wider uppercase">{statusConfig.label}</span>
								</span>
								{#if invoice.isRecurring}
									<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary">
										<RefreshCw class="h-3 w-3" />
										<span class="font-mono text-[10px] tracking-wider uppercase">{getRecurringLabel(invoice.recurringInterval)}</span>
									</span>
								{/if}
							</div>
							<p class="font-ui mt-0.5 text-xs tracking-wider truncate">{invoice.title}</p>
							<div class="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
								<span class="flex items-center gap-1">
									<Building2 class="h-3 w-3" />
									{invoice.organization}
								</span>
								{#if invoice.isRecurring && invoice.recurringCount && invoice.recurringCount > 1}
									<span class="flex items-center gap-1 text-primary">
										<span class="font-mono text-[10px]">#{invoice.recurringCount}</span>
									</span>
								{/if}
							</div>
						</div>

						<!-- Amount & Dates -->
						<div class="hidden items-center gap-6 lg:flex">
							<div class="text-right">
								<span class="font-display text-lg font-bold {invoice.status === 'paid' ? 'text-green-500' : invoice.status === 'overdue' ? 'text-red-500' : 'text-foreground'}">{formatCurrency(invoice.total)}</span>
								{#if invoice.amountDue > 0 && invoice.amountDue < invoice.total}
									<p class="font-mono text-[10px] tracking-wider text-muted-foreground">
										{formatCurrency(invoice.amountDue)} DUE
									</p>
								{/if}
							</div>
							<div class="text-right">
								<div class="flex items-center gap-1 justify-end">
									<Calendar class="h-3 w-3 text-muted-foreground" />
									<span class="font-body text-xs">Due {formatDate(invoice.dueDate)}</span>
								</div>
								<p class="font-mono text-[10px] tracking-wider text-muted-foreground">
									Issued {formatDate(invoice.issueDate)}
								</p>
							</div>
						</div>

						<!-- Arrow -->
						<ChevronRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
					</a>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-16">
				<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
					<Receipt class="h-8 w-8 text-muted-foreground/50" />
				</div>
				<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO INVOICES FOUND</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					{searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Start by creating your first invoice.'}
				</p>
				{#if !searchQuery && statusFilter === 'all'}
					<Button href="/admin/invoices/new" class="mt-6 font-ui text-xs tracking-wider">
						<Plus class="mr-2 h-4 w-4" />
						NEW INVOICE
					</Button>
				{/if}
			</div>
		{/if}
	</section>
</div>
