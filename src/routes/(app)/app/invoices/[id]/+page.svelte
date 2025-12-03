<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft, Download, CreditCard, Check, Clock, AlertTriangle } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	// Sample invoice data
	let invoice = $state({
		id: 'INV-2024-0042',
		status: 'pending',
		project: 'E-Commerce Platform',
		organization: 'TechCorp Solutions',
		amount: 15000,
		currency: 'THB',
		issued_at: '2024-01-15',
		due_date: '2024-02-15',
		paid_at: null,
		items: [
			{ description: 'UI/UX Design Phase', quantity: 1, unit_price: 5000, total: 5000 },
			{ description: 'Frontend Development', quantity: 40, unit_price: 200, total: 8000 },
			{ description: 'API Integration', quantity: 10, unit_price: 200, total: 2000 }
		],
		notes: 'Payment is due within 30 days of invoice date. Please include the invoice number in your payment reference.'
	});

	let isPastDue = $derived(new Date(invoice.due_date) < new Date() && invoice.status !== 'paid');

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
	}

	function formatDate(date: string): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getStatusBadge(status: string) {
		switch (status) {
			case 'paid':
				return { bg: 'bg-green-500/10', text: 'text-green-500', label: 'PAID' };
			case 'pending':
				return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'PENDING' };
			case 'overdue':
				return { bg: 'bg-red-500/10', text: 'text-red-500', label: 'OVERDUE' };
			default:
				return { bg: 'bg-muted', text: 'text-muted-foreground', label: status.toUpperCase() };
		}
	}

	let status = $derived(isPastDue ? getStatusBadge('overdue') : getStatusBadge(invoice.status));
</script>

<svelte:head>
	<title>Invoice {invoice.id} | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<a
					href="/app/invoices"
					class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
					<span class="font-mono text-[10px] tracking-widest">BACK TO INVOICES</span>
				</a>
				<h1 class="font-display mt-6 text-2xl font-bold uppercase md:text-3xl">{invoice.id}</h1>
				<p class="font-body mt-2 text-muted-foreground">{invoice.project}</p>
			</div>

			<div class="flex items-center gap-4">
				<span class="font-mono text-[10px] tracking-widest px-3 py-1 {status.bg} {status.text}">
					{#if isPastDue}
						<AlertTriangle class="mr-1 inline h-3 w-3" />
					{:else if invoice.status === 'paid'}
						<Check class="mr-1 inline h-3 w-3" />
					{:else}
						<Clock class="mr-1 inline h-3 w-3" />
					{/if}
					{status.label}
				</span>
			</div>
		</div>
	</section>

	<!-- Invoice Content -->
	<section class="border-b border-border bg-background">
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Main Invoice -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-8 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — INVOICE DETAILS</span>

				<!-- Invoice Header Info -->
				<div class="mt-6 grid grid-cols-2 gap-6 border border-border p-6">
					<div>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">BILLED TO</span>
						<p class="font-ui mt-2 text-sm font-semibold">{invoice.organization}</p>
					</div>
					<div class="text-right">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">INVOICE DATE</span>
						<p class="font-body mt-2 text-sm">{formatDate(invoice.issued_at)}</p>
					</div>
					<div>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT</span>
						<p class="font-body mt-2 text-sm">{invoice.project}</p>
					</div>
					<div class="text-right">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">DUE DATE</span>
						<p class="font-body mt-2 text-sm {isPastDue ? 'text-red-500 font-semibold' : ''}">{formatDate(invoice.due_date)}</p>
					</div>
				</div>

				<!-- Line Items -->
				<div class="mt-8">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — LINE ITEMS</span>
					
					<div class="mt-4 border border-border">
						<!-- Table Header -->
						<div class="grid grid-cols-12 gap-4 bg-card px-4 py-3">
							<div class="col-span-6">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground">DESCRIPTION</span>
							</div>
							<div class="col-span-2 text-right">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QTY</span>
							</div>
							<div class="col-span-2 text-right">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground">RATE</span>
							</div>
							<div class="col-span-2 text-right">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground">TOTAL</span>
							</div>
						</div>

						<!-- Line Items -->
						{#each invoice.items as item}
							<div class="grid grid-cols-12 gap-4 border-t border-border px-4 py-4">
								<div class="col-span-6">
									<span class="font-body text-sm">{item.description}</span>
								</div>
								<div class="col-span-2 text-right">
									<span class="font-mono text-sm">{item.quantity}</span>
								</div>
								<div class="col-span-2 text-right">
									<span class="font-body text-sm">{formatCurrency(item.unit_price)}</span>
								</div>
								<div class="col-span-2 text-right">
									<span class="font-body text-sm font-medium">{formatCurrency(item.total)}</span>
								</div>
							</div>
						{/each}

						<!-- Total -->
						<div class="grid grid-cols-12 gap-4 border-t border-border bg-card px-4 py-4">
							<div class="col-span-10 text-right">
								<span class="font-ui text-sm font-semibold tracking-wider">TOTAL</span>
							</div>
							<div class="col-span-2 text-right">
								<span class="font-display text-lg font-bold">{formatCurrency(invoice.amount)}</span>
							</div>
						</div>
					</div>
				</div>

				<!-- Notes -->
				{#if invoice.notes}
					<div class="mt-8">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">03 — NOTES</span>
						<p class="font-body mt-4 text-sm text-muted-foreground">{invoice.notes}</p>
					</div>
				{/if}
			</div>

			<!-- Sidebar -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-4 lg:border-l lg:border-border md:px-12 lg:px-8">
				<!-- Amount Due Card -->
				<div class="border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">AMOUNT DUE</span>
					<p class="font-display mt-4 text-3xl font-bold">{formatCurrency(invoice.amount)}</p>
					
					{#if invoice.status !== 'paid'}
						<div class="mt-6 space-y-3">
							<Button class="font-ui w-full text-xs tracking-wider">
								<CreditCard class="mr-2 h-4 w-4" />
								PAY NOW
							</Button>
							<Button variant="outline" class="font-ui w-full text-xs tracking-wider">
								<Download class="mr-2 h-4 w-4" />
								DOWNLOAD PDF
							</Button>
						</div>

						{#if isPastDue}
							<div class="mt-4 border border-red-500/20 bg-red-500/10 p-4">
								<div class="flex items-start gap-3">
									<AlertTriangle class="h-5 w-5 flex-shrink-0 text-red-500" />
									<div>
										<p class="font-ui text-xs font-semibold text-red-500">PAST DUE</p>
										<p class="font-body mt-1 text-xs text-muted-foreground">
											This invoice is past the due date. Please pay as soon as possible to avoid service interruption.
										</p>
									</div>
								</div>
							</div>
						{/if}
					{:else}
						<div class="mt-4 border border-green-500/20 bg-green-500/10 p-4">
							<div class="flex items-start gap-3">
								<Check class="h-5 w-5 flex-shrink-0 text-green-500" />
								<div>
									<p class="font-ui text-xs font-semibold text-green-500">PAID</p>
									<p class="font-body mt-1 text-xs text-muted-foreground">
										Thank you for your payment on {invoice.paid_at ? formatDate(invoice.paid_at) : 'N/A'}.
									</p>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Payment Methods -->
				<div class="mt-6 border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ACCEPTED PAYMENT METHODS</span>
					<div class="mt-4 space-y-2">
						{#each ['Credit / Debit Card', 'Bank Transfer', 'PromptPay'] as method}
							<div class="flex items-center gap-2">
								<div class="h-1.5 w-1.5 bg-primary"></div>
								<span class="font-body text-sm">{method}</span>
							</div>
						{/each}
					</div>
				</div>

				<!-- Need Help -->
				<div class="mt-6 border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NEED HELP?</span>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						If you have any questions about this invoice, please contact our billing team.
					</p>
					<Button variant="outline" href="/app/tickets/new" class="font-ui mt-4 w-full text-xs tracking-wider">
						CONTACT SUPPORT
					</Button>
				</div>
			</div>
		</div>
	</section>
</div>
