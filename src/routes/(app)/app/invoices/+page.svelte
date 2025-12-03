<script lang="ts">
	/**
	 * Customer Invoices Page
	 */
	import { Receipt, Clock, CheckCircle, AlertCircle, Calendar, ChevronRight, DollarSign, CreditCard } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

	// Get invoices from server data
	const invoices = $derived(data.invoices ?? []);

	function formatCurrency(amount: number | null): string {
		if (amount === null) return '$0';
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(dateStr: string | Date | null): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric',
			year: 'numeric'
		});
	}

	function getStatusConfig(status: string): { icon: typeof Clock; class: string; label: string } {
		switch (status) {
			case 'draft': return { icon: Clock, class: 'bg-muted text-muted-foreground', label: 'Draft' };
			case 'sent': return { icon: Clock, class: 'bg-blue-500/10 text-blue-500', label: 'Awaiting Payment' };
			case 'viewed': return { icon: Clock, class: 'bg-purple-500/10 text-purple-500', label: 'Viewed' };
			case 'paid': return { icon: CheckCircle, class: 'bg-green-500/10 text-green-500', label: 'Paid' };
			case 'partially_paid': return { icon: DollarSign, class: 'bg-yellow-500/10 text-yellow-500', label: 'Partial' };
			case 'overdue': return { icon: AlertCircle, class: 'bg-red-500/10 text-red-500', label: 'Overdue' };
			default: return { icon: Clock, class: 'bg-muted text-muted-foreground', label: status };
		}
	}

	const unpaidInvoices = $derived(invoices.filter(i => i.status !== 'paid' && i.status !== 'cancelled'));
	const totalDue = $derived(unpaidInvoices.reduce((sum, i) => sum + i.amountDue, 0));
</script>

<svelte:head>
	<title>Invoices | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// BILLING</span>
		<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Invoices</h1>
		<p class="font-body mt-1 text-sm text-muted-foreground">
			View and pay your invoices.
		</p>
	</section>

	<!-- Outstanding Balance Alert -->
	{#if totalDue > 0}
		<section class="border-b border-border bg-card">
			<div class="flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center border border-primary/30 bg-primary/10">
						<DollarSign class="h-5 w-5 text-primary" />
					</div>
					<div>
						<p class="font-mono text-[10px] tracking-widest text-muted-foreground">TOTAL OUTSTANDING</p>
						<p class="font-display text-2xl font-bold text-foreground">{formatCurrency(totalDue)}</p>
					</div>
				</div>
				<Button size="lg" class="font-ui text-xs tracking-wider">
					<CreditCard class="mr-2 h-4 w-4" />
					PAY ALL INVOICES
				</Button>
			</div>
		</section>
	{/if}

	<!-- Invoices List -->
	<section class="border-b border-border bg-background">
		{#if invoices.length > 0}
			<div class="divide-y divide-border">
				{#each invoices as invoice}
					{@const statusConfig = getStatusConfig(invoice.status)}
					{@const StatusIcon = statusConfig.icon}
					<a
						href="/app/invoices/{invoice.id}"
						class="group flex items-center gap-4 px-6 py-6 transition-colors hover:bg-card md:px-12 lg:px-16"
					>
						<!-- Icon -->
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
							<Receipt class="h-5 w-5 text-primary" />
						</div>

						<!-- Invoice Info -->
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-3">
								<span class="font-mono text-xs font-bold tracking-wider text-muted-foreground">{invoice.invoiceNumber}</span>
								<span class="inline-flex items-center gap-1 px-2 py-0.5 {statusConfig.class}">
									<StatusIcon class="h-3 w-3" />
									<span class="font-mono text-[10px] tracking-wider uppercase">{statusConfig.label}</span>
								</span>
							</div>
							<h3 class="font-ui mt-0.5 text-sm font-semibold tracking-wider truncate">{invoice.title}</h3>
							<div class="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
								<span class="flex items-center gap-1">
									<Calendar class="h-3 w-3" />
									Due {formatDate(invoice.dueDate)}
								</span>
							</div>
						</div>

						<!-- Amount & Action -->
						<div class="flex items-center gap-6">
							<div class="text-right">
								<span class="font-display text-xl font-bold {invoice.status === 'paid' ? 'text-green-500' : invoice.status === 'overdue' ? 'text-red-500' : 'text-foreground'}">{formatCurrency(invoice.total)}</span>
								{#if invoice.amountDue > 0 && invoice.amountDue < invoice.total}
									<p class="font-mono text-[10px] tracking-wider text-muted-foreground">
										{formatCurrency(invoice.amountDue)} DUE
									</p>
								{/if}
							</div>
							
							{#if invoice.status !== 'paid'}
								<Button size="sm" class="font-ui text-xs tracking-wider">
									PAY NOW
								</Button>
							{:else}
								<ChevronRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-16">
				<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
					<Receipt class="h-8 w-8 text-muted-foreground/50" />
				</div>
				<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO INVOICES YET</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Your invoices will appear here.
				</p>
			</div>
		{/if}
	</section>
</div>
