<script lang="ts">
	/**
	 * Admin - New Invoice
	 * 
	 * Create a new invoice with line items and calculations.
	 */
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Save, Plus, Trash2, DollarSign, Calendar, RefreshCw } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { CreatePageLayout } from '$lib/components/layout';
	import { ActionButtons } from '$lib/components/ui/layouts';

	let { data, form } = $props();

	// Form state
	let organizationId = $state('');
	let projectId = $state('');
	let dueDate = $state('');
	let notes = $state('');
	let taxRate = $state('10');
	let discountAmount = $state('0');
	
	// Recurring invoice settings
	let isRecurring = $state(false);
	let recurringInterval = $state<'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
	let recurringEndDate = $state('');

	// Line items
	type LineItem = {
		id: string;
		description: string;
		quantity: string;
		unitPrice: string;
	};

	let lineItems = $state<LineItem[]>([
		{ id: crypto.randomUUID(), description: '', quantity: '1', unitPrice: '0' }
	]);

	let isSubmitting = $state(false);

	// Add new line item
	function addLineItem() {
		lineItems = [...lineItems, { 
			id: crypto.randomUUID(), 
			description: '', 
			quantity: '1', 
			unitPrice: '0' 
		}];
	}

	// Remove line item
	function removeLineItem(id: string) {
		if (lineItems.length > 1) {
			lineItems = lineItems.filter(item => item.id !== id);
		}
	}

	// Calculate line item total
	function calculateLineTotal(item: LineItem): number {
		const qty = parseFloat(item.quantity) || 0;
		const price = parseFloat(item.unitPrice) || 0;
		return qty * price;
	}

	// Calculate subtotal
	const subtotal = $derived(() => {
		return lineItems.reduce((sum, item) => sum + calculateLineTotal(item), 0);
	});

	// Calculate tax
	const taxAmount = $derived(() => {
		const rate = parseFloat(taxRate) || 0;
		return (subtotal() * rate) / 100;
	});

	// Calculate discount
	const discount = $derived(() => {
		return parseFloat(discountAmount) || 0;
	});

	// Calculate total
	const total = $derived(() => {
		return subtotal() + taxAmount() - discount();
	});

	// Format currency
	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}

	// Handle success toast and redirect
	$effect(() => {
		if (form?.success && form?.message) {
			toast.success(form.message);
			window.scrollTo({ top: 0, behavior: 'smooth' });
			setTimeout(() => goto('/admin/invoices'), 1500);
		}
	});
</script>

<svelte:head>
	<title>New Invoice | Admin | MostlyWhat Systems</title>
</svelte:head>

<CreatePageLayout
	title="Create Invoice"
	description="Generate a new invoice for a client or project."
	backHref={localizeHref('/admin/invoices')}
	errorMessage={form?.error}
	successMessage={form?.success ? form.message : undefined}
>
	{#snippet children()}
		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ result, update }) => {
					await update();
					isSubmitting = false;
					if (result.type === 'failure') {
						window.scrollTo({ top: 0, behavior: 'smooth' });
					}
				};
			}}
			class="space-y-8"
		>
			<!-- Organization -->
			<div class="space-y-2">
				<label for="organizationId" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					ORGANIZATION *
				</label>
				<select
					id="organizationId"
					name="organizationId"
					bind:value={organizationId}
					required
					class="font-ui w-full border border-border bg-card px-4 py-3 focus:border-primary focus:outline-none"
				>
					<option value="">Select an organization...</option>
					{#each data.organizations ?? [] as org}
						<option value={org.id}>{org.name}</option>
					{/each}
				</select>
			</div>

			<!-- Project (Optional) -->
			<div class="space-y-2">
				<label for="projectId" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					PROJECT (optional)
				</label>
				<select
					id="projectId"
					name="projectId"
					bind:value={projectId}
					class="font-ui w-full border border-border bg-card px-4 py-3 focus:border-primary focus:outline-none"
				>
					<option value="">No project</option>
					{#each data.projects ?? [] as project}
						<option value={project.id}>{project.name}</option>
					{/each}
				</select>
			</div>

			<!-- Due Date -->
			<div class="space-y-2">
				<label for="dueDate" class="font-mono text-[10px] tracking-widest text-muted-foreground flex items-center gap-1">
					<Calendar class="h-3 w-3" />
					DUE DATE *
				</label>
				<input
					type="date"
					id="dueDate"
					name="dueDate"
					bind:value={dueDate}
					required
					class="font-ui w-full border border-border bg-card px-4 py-3 focus:border-primary focus:outline-none"
				/>
			</div>

			<!-- Line Items -->
			<div class="space-y-4">
				<div class="flex items-center justify-between">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
						LINE ITEMS *
					</span>
					<button
						type="button"
						onclick={addLineItem}
						class="inline-flex items-center gap-1 border border-border bg-background px-3 py-1.5 text-xs hover:bg-card"
					>
						<Plus class="h-3 w-3" />
						<span class="font-mono tracking-wider">ADD ITEM</span>
					</button>
				</div>

				<div class="overflow-x-auto border border-border">
					<table class="w-full min-w-[600px]">
						<thead class="bg-muted/30">
							<tr class="border-b border-border">
								<th class="px-4 py-3 text-left font-mono text-[10px] tracking-widest text-muted-foreground">
									DESCRIPTION
								</th>
								<th class="w-24 px-4 py-3 text-left font-mono text-[10px] tracking-widest text-muted-foreground">
									QTY
								</th>
								<th class="w-32 px-4 py-3 text-left font-mono text-[10px] tracking-widest text-muted-foreground">
									UNIT PRICE
								</th>
								<th class="w-32 px-4 py-3 text-right font-mono text-[10px] tracking-widest text-muted-foreground">
									TOTAL
								</th>
								<th class="w-16 px-4 py-3"></th>
							</tr>
						</thead>
						<tbody>
							{#each lineItems as item, index (item.id)}
								<tr class="border-b border-border bg-card">
									<td class="px-4 py-2">
										<input
											type="text"
											name="lineItems[{index}][description]"
											bind:value={item.description}
											required
											class="font-ui w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
											placeholder="Service or product description"
										/>
									</td>
									<td class="px-4 py-2">
										<input
											type="number"
											name="lineItems[{index}][quantity]"
											bind:value={item.quantity}
											min="0"
											step="0.01"
											required
											class="font-ui w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
										/>
									</td>
									<td class="px-4 py-2">
										<div class="relative">
											<span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
											<input
												type="number"
												name="lineItems[{index}][unitPrice]"
												bind:value={item.unitPrice}
												min="0"
												step="0.01"
												required
												class="font-ui w-full border border-border bg-background pl-7 pr-3 py-2 text-sm focus:border-primary focus:outline-none"
											/>
										</div>
									</td>
									<td class="px-4 py-2 text-right">
										<span class="font-ui text-sm font-semibold">
											{formatCurrency(calculateLineTotal(item))}
										</span>
									</td>
									<td class="px-4 py-2 text-center">
										{#if lineItems.length > 1}
											<button
												type="button"
												onclick={() => removeLineItem(item.id)}
												class="text-destructive hover:text-destructive/80 transition-colors"
											>
												<Trash2 class="h-4 w-4" />
											</button>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>

			<!-- Pricing Adjustments -->
			<div class="grid gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<label for="taxRate" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						TAX RATE (%)
					</label>
					<input
						type="number"
						id="taxRate"
						name="taxRate"
						bind:value={taxRate}
						min="0"
						step="0.01"
						class="font-ui w-full border border-border bg-card px-4 py-3 focus:border-primary focus:outline-none"
					/>
				</div>

				<div class="space-y-2">
					<label for="discountAmount" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						DISCOUNT ($)
					</label>
					<div class="relative">
						<span class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
						<input
							type="number"
							id="discountAmount"
							name="discountAmount"
							bind:value={discountAmount}
							min="0"
							step="0.01"
							class="font-ui w-full border border-border bg-card pl-8 pr-4 py-3 focus:border-primary focus:outline-none"
						/>
					</div>
				</div>
			</div>

			<!-- Total Summary -->
			<div class="space-y-3 border border-border bg-muted/20 p-6">
				<div class="flex items-center justify-between text-sm">
					<span class="font-ui text-muted-foreground">Subtotal:</span>
					<span class="font-ui font-medium">{formatCurrency(subtotal())}</span>
				</div>
				<div class="flex items-center justify-between text-sm">
					<span class="font-ui text-muted-foreground">Tax ({taxRate}%):</span>
					<span class="font-ui font-medium">{formatCurrency(taxAmount())}</span>
				</div>
				{#if discount() > 0}
					<div class="flex items-center justify-between text-sm">
						<span class="font-ui text-muted-foreground">Discount:</span>
						<span class="font-ui font-medium text-destructive">-{formatCurrency(discount())}</span>
					</div>
				{/if}
				<div class="flex items-center justify-between border-t border-border pt-3">
					<span class="font-mono text-sm tracking-wider text-foreground">TOTAL:</span>
					<span class="text-2xl font-bold text-primary">{formatCurrency(total())}</span>
				</div>
			</div>

			<!-- Notes -->
			<div class="space-y-2">
				<label for="notes" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					NOTES (optional)
				</label>
				<textarea
					id="notes"
					name="notes"
					bind:value={notes}
					rows="3"
					class="font-body w-full resize-none border border-border bg-card px-4 py-3 text-sm focus:border-primary focus:outline-none"
					placeholder="Additional notes or payment instructions..."
				></textarea>
			</div>

			<!-- Actions -->
			<div class="flex items-center gap-4 border-t border-border pt-8">
				<button
					type="submit"
					disabled={isSubmitting}
					class="inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
				>
					<Save class="h-4 w-4" />
					<span class="font-mono text-xs tracking-wider">
						{isSubmitting ? 'CREATING...' : 'CREATE INVOICE'}
					</span>
				</button>
				<a
					href={localizeHref('/admin/invoices')}
					class="inline-flex items-center gap-2 border border-border bg-background px-6 py-3 text-sm text-muted-foreground transition-colors hover:bg-card"
				>
					<span class="font-mono text-xs tracking-wider">CANCEL</span>
				</a>
			</div>
		</form>
	{/snippet}

	{#snippet sidebar()}
		<div class="space-y-6">
			<!-- Summary -->
			<div>
				<div class="flex items-center gap-2 mb-3">
					<DollarSign class="h-4 w-4 text-primary" />
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">INVOICE SUMMARY</span>
				</div>

				<div class="space-y-3 rounded border border-border bg-card p-4">
					<div class="flex items-center justify-between">
						<span class="font-ui text-xs text-muted-foreground">Items:</span>
						<span class="font-ui text-sm font-medium">{lineItems.length}</span>
					</div>
					<div class="flex items-center justify-between">
						<span class="font-ui text-xs text-muted-foreground">Subtotal:</span>
						<span class="font-ui text-sm font-medium">{formatCurrency(subtotal())}</span>
					</div>
					<div class="flex items-center justify-between border-t border-border pt-2">
						<span class="font-mono text-xs tracking-wider">TOTAL:</span>
						<span class="text-lg font-bold text-primary">{formatCurrency(total())}</span>
					</div>
				</div>
			</div>

			<!-- Recurring Invoice -->
			<div class="border-t border-border pt-6">
				<div class="flex items-center gap-2 mb-3">
					<RefreshCw class="h-4 w-4 text-primary" />
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">RECURRING INVOICE</span>
				</div>

				<div class="space-y-4">
					<label class="flex items-center gap-3">
						<input
							type="checkbox"
							name="isRecurring"
							value="true"
							bind:checked={isRecurring}
							class="h-4 w-4 border border-border bg-background text-primary focus:ring-primary"
						/>
						<span class="font-ui text-sm">Enable recurring billing</span>
					</label>

					{#if isRecurring}
						<div class="space-y-4 pl-7">
							<div class="space-y-2">
								<label for="recurringInterval" class="font-mono text-[10px] tracking-widest text-muted-foreground">
									INTERVAL
								</label>
								<select
									id="recurringInterval"
									name="recurringInterval"
									bind:value={recurringInterval}
									class="font-ui w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
								>
									<option value="weekly">Weekly</option>
									<option value="monthly">Monthly</option>
									<option value="quarterly">Quarterly</option>
									<option value="yearly">Yearly</option>
								</select>
							</div>

							<div class="space-y-2">
								<label for="recurringEndDate" class="font-mono text-[10px] tracking-widest text-muted-foreground">
									END DATE (optional)
								</label>
								<input
									type="date"
									id="recurringEndDate"
									name="recurringEndDate"
									bind:value={recurringEndDate}
									class="font-ui w-full border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
								/>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Quick Reference -->
			<div class="border-t border-border pt-6">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK REFERENCE</span>
				<div class="mt-3 space-y-2">
					<div class="rounded bg-muted/30 p-3">
						<div class="font-ui text-xs font-semibold">Line Items</div>
						<p class="font-body text-xs text-muted-foreground mt-1">Add multiple items with quantity and price. Totals calculate automatically.</p>
					</div>
					<div class="rounded bg-muted/30 p-3">
						<div class="font-ui text-xs font-semibold">Tax & Discounts</div>
						<p class="font-body text-xs text-muted-foreground mt-1">Tax is calculated as a percentage. Discount is a flat amount.</p>
					</div>
					<div class="rounded bg-muted/30 p-3">
						<div class="font-ui text-xs font-semibold">Recurring</div>
						<p class="font-body text-xs text-muted-foreground mt-1">Enable for subscription or retainer invoices.</p>
					</div>
				</div>
			</div>
		</div>
	{/snippet}
</CreatePageLayout>
