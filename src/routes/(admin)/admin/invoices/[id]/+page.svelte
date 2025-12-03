<script lang="ts">
	/**
	 * Invoice Detail Page
	 * 
	 * Admin view for invoice details, status management, and payment recording.
	 */
	import { enhance } from '$app/forms';
	import { 
		ArrowLeft, FileText, Building2, Calendar, DollarSign, 
		Check, Clock, Send, CreditCard, AlertCircle, Loader2,
		Banknote, Receipt
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card';

	let { data, form } = $props();

	const invoice = $derived(data.invoice);
	const payments = $derived(data.payments);

	let isUpdating = $state(false);
	let showPaymentForm = $state(false);

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: invoice.currency ?? 'USD'
		}).format(amount);
	}

	function formatDate(date: Date | string | null): string {
		if (!date) return '-';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function getStatusBadge(status: string) {
		switch (status) {
			case 'paid':
				return { bg: 'bg-green-500/10', text: 'text-green-500', icon: Check, label: 'PAID' };
			case 'sent':
				return { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: Send, label: 'SENT' };
			case 'viewed':
				return { bg: 'bg-purple-500/10', text: 'text-purple-500', icon: FileText, label: 'VIEWED' };
			case 'overdue':
				return { bg: 'bg-red-500/10', text: 'text-red-500', icon: AlertCircle, label: 'OVERDUE' };
			case 'cancelled':
				return { bg: 'bg-muted', text: 'text-muted-foreground', icon: AlertCircle, label: 'CANCELLED' };
			case 'draft':
			default:
				return { bg: 'bg-muted', text: 'text-muted-foreground', icon: Clock, label: 'DRAFT' };
		}
	}

	const statusInfo = $derived(getStatusBadge(invoice.status));

	function handleStatusUpdate() {
		isUpdating = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			isUpdating = false;
			await update();
		};
	}

	function handlePaymentSubmit() {
		return async ({ result, update }: { result: any; update: () => Promise<void> }) => {
			if (result.type === 'success') {
				showPaymentForm = false;
			}
			await update();
		};
	}
</script>

<svelte:head>
	<title>Invoice #{invoice.invoiceNumber} | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<a
					href="/admin/invoices"
					class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
					<span class="font-mono text-[10px] tracking-widest">BACK TO INVOICES</span>
				</a>
				<h1 class="font-display mt-6 text-2xl font-bold uppercase md:text-3xl">
					Invoice #{invoice.invoiceNumber}
				</h1>
				{#if invoice.title}
					<p class="font-body mt-2 text-muted-foreground">{invoice.title}</p>
				{/if}
			</div>

			<div class="flex items-center gap-3">
				{#if statusInfo}
					{@const StatusIcon = statusInfo.icon}
					<span class="font-mono text-[10px] tracking-widest px-3 py-2 {statusInfo.bg} {statusInfo.text} flex items-center gap-2">
						<StatusIcon class="h-4 w-4" />
						{statusInfo.label}
					</span>
				{/if}
			</div>
		</div>
	</section>

	<!-- Main Content -->
	<section class="border-b border-border bg-background">
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Invoice Details -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-8 md:px-12 lg:px-16">
				<!-- Client Info -->
				<div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — CLIENT</span>
					<div class="mt-4 flex items-start gap-4">
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
							<Building2 class="h-5 w-5 text-muted-foreground" />
						</div>
						<div>
							<p class="font-ui text-sm font-semibold">{invoice.organization}</p>
							{#if invoice.project}
								<p class="font-body text-sm text-muted-foreground">Project: {invoice.project}</p>
							{/if}
						</div>
					</div>
				</div>

				<!-- Line Items -->
				{#if invoice.lineItems?.length}
					<div class="mt-12">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — LINE ITEMS</span>
						<div class="mt-6 border border-border">
							<div class="hidden sm:grid grid-cols-12 border-b border-border bg-card px-4 py-3">
								<span class="col-span-6 font-mono text-[10px] tracking-widest text-muted-foreground">DESCRIPTION</span>
								<span class="col-span-2 font-mono text-[10px] tracking-widest text-muted-foreground text-right">QTY</span>
								<span class="col-span-2 font-mono text-[10px] tracking-widest text-muted-foreground text-right">UNIT PRICE</span>
								<span class="col-span-2 font-mono text-[10px] tracking-widest text-muted-foreground text-right">TOTAL</span>
							</div>
							{#each invoice.lineItems as item}
								<div class="grid grid-cols-12 border-b border-border px-4 py-4 last:border-b-0">
									<span class="col-span-12 sm:col-span-6 font-body text-sm">{item.description}</span>
									<span class="col-span-4 sm:col-span-2 font-mono text-sm text-right text-muted-foreground">{item.quantity}</span>
									<span class="col-span-4 sm:col-span-2 font-mono text-sm text-right text-muted-foreground">{formatCurrency(item.unitPrice)}</span>
									<span class="col-span-4 sm:col-span-2 font-mono text-sm text-right">{formatCurrency(item.total)}</span>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Totals -->
				<div class="mt-12">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{invoice.lineItems?.length ? '03' : '02'} — TOTALS</span>
					<div class="mt-6 border border-border">
						<div class="flex items-center justify-between border-b border-border px-4 py-4">
							<span class="font-body text-sm">Subtotal</span>
							<span class="font-mono text-sm">{formatCurrency(invoice.subtotal)}</span>
						</div>
						{#if invoice.discount > 0}
							<div class="flex items-center justify-between border-b border-border px-4 py-4">
								<span class="font-body text-sm">Discount</span>
								<span class="font-mono text-sm text-green-500">-{formatCurrency(invoice.discount)}</span>
							</div>
						{/if}
						{#if invoice.taxAmount > 0}
							<div class="flex items-center justify-between border-b border-border px-4 py-4">
								<span class="font-body text-sm">Tax ({invoice.taxRate}%)</span>
								<span class="font-mono text-sm">{formatCurrency(invoice.taxAmount)}</span>
							</div>
						{/if}
						<div class="flex items-center justify-between border-b border-border bg-card px-4 py-4">
							<span class="font-ui text-sm font-semibold tracking-wider">TOTAL</span>
							<span class="font-display text-xl font-bold">{formatCurrency(invoice.total)}</span>
						</div>
						<div class="flex items-center justify-between border-b border-border px-4 py-4">
							<span class="font-body text-sm">Amount Paid</span>
							<span class="font-mono text-sm text-green-500">{formatCurrency(invoice.amountPaid)}</span>
						</div>
						<div class="flex items-center justify-between bg-card px-4 py-4">
							<span class="font-ui text-sm font-semibold tracking-wider">AMOUNT DUE</span>
							<span class="font-display text-xl font-bold {invoice.amountDue > 0 ? 'text-red-500' : 'text-green-500'}">
								{formatCurrency(invoice.amountDue)}
							</span>
						</div>
					</div>
				</div>

				<!-- Payment History -->
				{#if payments.length > 0}
					<div class="mt-12">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PAYMENT HISTORY</span>
						<div class="mt-6 space-y-3">
							{#each payments as payment}
								<div class="flex items-center justify-between border border-border p-4">
									<div class="flex items-center gap-3">
										<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
											<CreditCard class="h-5 w-5 text-green-500" />
										</div>
										<div>
											<p class="font-mono text-sm font-semibold text-green-500">+{formatCurrency(payment.amount)}</p>
											<p class="font-mono text-[10px] text-muted-foreground">
												{payment.paymentMethod} {payment.paymentReference ? `• ${payment.paymentReference}` : ''}
											</p>
										</div>
									</div>
									<div class="text-right">
										<p class="font-mono text-[10px] text-muted-foreground">{formatDate(payment.paidAt)}</p>
										<p class="font-mono text-[10px] text-muted-foreground">by {payment.recordedBy}</p>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Notes -->
				{#if invoice.notes}
					<div class="mt-12">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CLIENT NOTES</span>
						<p class="font-body mt-4 text-sm text-muted-foreground">{invoice.notes}</p>
					</div>
				{/if}
			</div>

			<!-- Sidebar -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-4 lg:border-l lg:border-border md:px-12 lg:px-8">
				<!-- Key Dates -->
				<div class="border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">KEY DATES</span>
					
					<div class="mt-6 space-y-4">
						<div class="flex items-start gap-3">
							<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
								<Calendar class="h-5 w-5 text-muted-foreground" />
							</div>
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">ISSUE DATE</p>
								<p class="font-body text-sm">{formatDate(invoice.issueDate)}</p>
							</div>
						</div>

						<div class="flex items-start gap-3">
							<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
								<Clock class="h-5 w-5 text-muted-foreground" />
							</div>
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">DUE DATE</p>
								<p class="font-body text-sm {new Date(invoice.dueDate) < new Date() && invoice.status !== 'paid' ? 'text-red-500 font-semibold' : ''}">
									{formatDate(invoice.dueDate)}
								</p>
							</div>
						</div>

						{#if invoice.paidAt}
							<div class="flex items-start gap-3">
								<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
									<Check class="h-5 w-5 text-green-500" />
								</div>
								<div>
									<p class="font-mono text-[10px] tracking-widest text-muted-foreground">PAID DATE</p>
									<p class="font-body text-sm text-green-500">{formatDate(invoice.paidAt)}</p>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Actions -->
				{#if invoice.status !== 'paid' && invoice.status !== 'cancelled'}
					<div class="mt-6 space-y-3">
						{#if !showPaymentForm}
							<Button 
								class="font-ui w-full text-xs tracking-wider bg-green-600 hover:bg-green-700"
								onclick={() => showPaymentForm = true}
							>
								<Banknote class="mr-2 h-4 w-4" />
								RECORD PAYMENT
							</Button>
						{:else}
							<div class="border border-border p-6">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground">RECORD PAYMENT</span>
								
								<form method="POST" action="?/recordPayment" use:enhance={handlePaymentSubmit} class="mt-4 space-y-4">
									<div class="space-y-2">
										<Label for="amount" class="font-mono text-[10px] tracking-widest text-muted-foreground">
											AMOUNT *
										</Label>
										<Input
											id="amount"
											name="amount"
											type="number"
											step="0.01"
											required
											value={invoice.amountDue.toString()}
											class="h-10 border-border bg-card font-mono"
										/>
									</div>

									<div class="space-y-2">
										<Label for="method" class="font-mono text-[10px] tracking-widest text-muted-foreground">
											PAYMENT METHOD
										</Label>
										<Input
											id="method"
											name="method"
											placeholder="Bank Transfer, Credit Card, etc."
											class="h-10 border-border bg-card"
										/>
									</div>

									<div class="space-y-2">
										<Label for="reference" class="font-mono text-[10px] tracking-widest text-muted-foreground">
											REFERENCE NUMBER
										</Label>
										<Input
											id="reference"
											name="reference"
											placeholder="Transaction ID or reference"
											class="h-10 border-border bg-card"
										/>
									</div>

									<div class="space-y-2">
										<Label for="notes" class="font-mono text-[10px] tracking-widest text-muted-foreground">
											NOTES
										</Label>
										<Textarea
											id="notes"
											name="notes"
											rows={2}
											class="border-border bg-card"
										/>
									</div>

									<div class="flex gap-2">
										<Button type="submit" class="font-ui flex-1 text-xs tracking-wider">
											SAVE PAYMENT
										</Button>
										<Button 
											type="button" 
											variant="outline" 
											class="font-ui text-xs tracking-wider"
											onclick={() => showPaymentForm = false}
										>
											CANCEL
										</Button>
									</div>
								</form>
							</div>
						{/if}

						{#if invoice.status === 'draft'}
							<form method="POST" action="?/updateStatus" use:enhance={handleStatusUpdate}>
								<input type="hidden" name="status" value="sent" />
								<Button type="submit" variant="outline" class="font-ui w-full text-xs tracking-wider" disabled={isUpdating}>
									{#if isUpdating}
										<Loader2 class="mr-2 h-4 w-4 animate-spin" />
									{:else}
										<Send class="mr-2 h-4 w-4" />
									{/if}
									MARK AS SENT
								</Button>
							</form>
						{/if}
					</div>
				{/if}

				<!-- Internal Notes -->
				<div class="mt-6 border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">INTERNAL NOTES</span>
					<form method="POST" action="?/updateNotes" use:enhance class="mt-4">
						<Textarea
							name="internalNotes"
							rows={4}
							value={invoice.internalNotes ?? ''}
							placeholder="Add internal notes (not visible to client)..."
							class="border-border bg-card text-sm"
						/>
						<Button type="submit" variant="outline" size="sm" class="font-ui mt-3 text-xs tracking-wider">
							SAVE NOTES
						</Button>
					</form>
				</div>

				<!-- Meta Info -->
				<div class="mt-6 border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CREATED BY</span>
					<p class="font-body mt-2 text-sm">{invoice.createdBy}</p>
					<p class="font-mono mt-1 text-[10px] text-muted-foreground">{formatDate(invoice.createdAt)}</p>
				</div>
			</div>
		</div>
	</section>
</div>
