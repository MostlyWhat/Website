<script lang="ts">
	/**
	 * Create New Invoice Page
	 * 
	 * Admin form to create new invoices with line items.
	 * Supports one-time and recurring invoices.
	 */
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Plus, Trash2, Receipt, Loader2, RefreshCw } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Select from '$lib/components/ui/select';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { toast } from 'svelte-sonner';

	let { data, form } = $props();

	let isLoading = $state(false);
	let selectedOrgId = $state<string>(data.preselectedOrgId ?? '');
	let selectedProjectId = $state<string>(data.preselectedProjectId ?? '');

	// Get display names for selections
	let selectedOrg = $derived(data.organizations.find(o => o.id === selectedOrgId));
	let selectedProject = $derived(data.projects.find(p => p.id === selectedProjectId));

	// Line items
	let lineItems = $state<Array<{ description: string; quantity: number; unitPrice: number; total: number }>>([
		{ description: '', quantity: 1, unitPrice: 0, total: 0 }
	]);

	// Pricing
	let taxRate = $state(0);
	let discount = $state(0);

	// Recurring invoice settings
	let isRecurring = $state(false);
	let recurringInterval = $state<string>('monthly');
	let recurringEndDate = $state<string>('');

	// Computed values
	let subtotal = $derived(lineItems.reduce((sum, item) => sum + item.total, 0));
	let taxAmount = $derived(subtotal * (taxRate / 100));
	let total = $derived(subtotal + taxAmount - discount);

	// Filter projects by selected organization
	let filteredProjects = $derived(
		selectedOrgId 
			? data.projects.filter(p => p.organizationId === selectedOrgId)
			: data.projects
	);

	// Recurring interval display names
	const intervalOptions = [
		{ value: 'weekly', label: 'Weekly' },
		{ value: 'bi_weekly', label: 'Bi-Weekly' },
		{ value: 'monthly', label: 'Monthly' },
		{ value: 'quarterly', label: 'Quarterly' },
		{ value: 'yearly', label: 'Yearly' }
	];

	let selectedIntervalLabel = $derived(
		intervalOptions.find(i => i.value === recurringInterval)?.label ?? 'Monthly'
	);

	function addLineItem() {
		lineItems = [...lineItems, { description: '', quantity: 1, unitPrice: 0, total: 0 }];
	}

	function removeLineItem(index: number) {
		lineItems = lineItems.filter((_, i) => i !== index);
	}

	function updateLineItem(index: number, field: string, value: string | number) {
		const item = { ...lineItems[index] };
		
		if (field === 'description') {
			item.description = value as string;
		} else if (field === 'quantity') {
			item.quantity = parseFloat(value as string) || 0;
		} else if (field === 'unitPrice') {
			item.unitPrice = parseFloat(value as string) || 0;
		}
		
		item.total = item.quantity * item.unitPrice;
		lineItems[index] = item;
		lineItems = [...lineItems]; // Trigger reactivity
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}

	function handleSubmit() {
		isLoading = true;
		return async ({ update }: { update: () => Promise<void> }) => {
			isLoading = false;
			await update();
		};
	}

	// Handle success toast and redirect
	$effect(() => {
		if (form?.success && form?.message) {
			toast.success(form.message);
			window.scrollTo({ top: 0, behavior: 'smooth' });
			setTimeout(() => goto('/admin/invoices'), 1500);
		}
	});

	// Default due date to 30 days from now
	let defaultDueDate = $derived(() => {
		const date = new Date();
		date.setDate(date.getDate() + 30);
		return date.toISOString().split('T')[0];
	});
</script>

<svelte:head>
	<title>Create Invoice | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<a
			href="/admin/invoices"
			class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			<span class="font-mono text-[10px] tracking-widest">BACK TO INVOICES</span>
		</a>
		<h1 class="font-display mt-6 text-2xl font-bold uppercase md:text-3xl">Create Invoice</h1>
		<p class="font-body mt-2 text-sm text-muted-foreground">
			Create a new invoice for a client organization.
		</p>
	</section>

	<!-- Form Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		{#if form?.error}
			<div class="mb-6 max-w-4xl border border-destructive/50 bg-destructive/10 px-6 py-4">
				<p class="font-mono text-sm text-destructive">{form.error}</p>
			</div>
		{/if}

		<form method="POST" use:enhance={handleSubmit} class="max-w-4xl space-y-8">
			<input type="hidden" name="lineItems" value={JSON.stringify(lineItems.filter(i => i.description))} />
			<input type="hidden" name="isRecurring" value={isRecurring.toString()} />
			<input type="hidden" name="recurringInterval" value={isRecurring ? recurringInterval : ''} />
			<input type="hidden" name="recurringEndDate" value={isRecurring ? recurringEndDate : ''} />

			<!-- Client & Project -->
			<div class="space-y-6">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<Receipt class="h-5 w-5 text-primary" />
					</div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">INVOICE DETAILS</span>
				</div>

				<div class="grid gap-6 md:grid-cols-2">
					<div class="space-y-2">
						<Label for="organizationId" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							ORGANIZATION *
						</Label>
						<input type="hidden" name="organizationId" value={selectedOrgId} />
						<Select.Root type="single" bind:value={selectedOrgId} onValueChange={() => selectedProjectId = ''}>
							<Select.Trigger class="h-12 border-border bg-card px-4 font-body">
								{selectedOrg?.name ?? 'Select organization'}
							</Select.Trigger>
							<Select.Content>
								{#each data.organizations as org}
									<Select.Item value={org.id}>{org.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<div class="space-y-2">
						<Label for="projectId" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							PROJECT (OPTIONAL)
						</Label>
						<input type="hidden" name="projectId" value={selectedProjectId} />
						<Select.Root type="single" bind:value={selectedProjectId} disabled={!selectedOrgId}>
							<Select.Trigger class="h-12 border-border bg-card px-4 font-body">
								{selectedProject?.name ?? 'Select project (optional)'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="">No project</Select.Item>
								{#each filteredProjects as project}
									<Select.Item value={project.id}>{project.name}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<div class="space-y-2 md:col-span-2">
						<Label for="title" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							INVOICE TITLE
						</Label>
						<Input
							id="title"
							name="title"
							placeholder="Website Development - Phase 1"
							class="h-12 border-border bg-card px-4 font-body"
						/>
					</div>

					<div class="space-y-2 md:col-span-2">
						<Label for="description" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							DESCRIPTION
						</Label>
						<Textarea
							id="description"
							name="description"
							rows={2}
							placeholder="Brief description of the invoice..."
							class="border-border bg-card px-4 py-3 font-body"
						/>
					</div>

					<div class="space-y-2">
						<Label for="dueDate" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							DUE DATE *
						</Label>
						<Input
							id="dueDate"
							name="dueDate"
							type="date"
							required
							value={defaultDueDate()}
							class="h-12 border-border bg-card px-4 font-body"
						/>
					</div>
				</div>
			</div>

			<!-- Recurring Invoice Options -->
			<div class="space-y-6 border-t border-border pt-8">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<RefreshCw class="h-5 w-5 text-primary" />
					</div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">RECURRING INVOICE</span>
				</div>

				<div class="space-y-4">
					<div class="flex items-center gap-3">
						<Checkbox 
							id="isRecurring" 
							bind:checked={isRecurring}
							class="h-5 w-5"
						/>
						<Label for="isRecurring" class="font-body text-sm cursor-pointer">
							Make this a recurring invoice
						</Label>
					</div>

					{#if isRecurring}
						<div class="ml-8 grid gap-6 md:grid-cols-2 border-l-2 border-primary/20 pl-6">
							<div class="space-y-2">
								<Label for="recurringInterval" class="font-mono text-[10px] tracking-widest text-muted-foreground">
									BILLING CYCLE *
								</Label>
								<Select.Root type="single" bind:value={recurringInterval}>
									<Select.Trigger class="h-12 border-border bg-card px-4 font-body">
										{selectedIntervalLabel}
									</Select.Trigger>
									<Select.Content>
										{#each intervalOptions as option}
											<Select.Item value={option.value}>{option.label}</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
							</div>

							<div class="space-y-2">
								<Label for="recurringEndDate" class="font-mono text-[10px] tracking-widest text-muted-foreground">
									END DATE (OPTIONAL)
								</Label>
								<Input
									id="recurringEndDate"
									type="date"
									bind:value={recurringEndDate}
									class="h-12 border-border bg-card px-4 font-body"
								/>
								<p class="font-body text-xs text-muted-foreground">
									Leave empty for indefinite recurring invoices
								</p>
							</div>

							<div class="md:col-span-2">
								<div class="border border-border bg-card/50 p-4">
									<p class="font-body text-sm text-muted-foreground">
										<strong class="text-foreground">How it works:</strong> When this invoice is fully paid, 
										a new invoice will automatically be generated for the next billing cycle. You'll be 
										notified when each new invoice is created.
									</p>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- Line Items -->
			<div class="space-y-6 border-t border-border pt-8">
				<div class="flex items-center justify-between">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LINE ITEMS</span>
					<Button type="button" variant="outline" size="sm" onclick={addLineItem} class="font-ui text-xs tracking-wider">
						<Plus class="mr-1 h-4 w-4" />
						ADD ITEM
					</Button>
				</div>

				<div class="space-y-4">
					<!-- Header -->
					<div class="hidden sm:grid grid-cols-12 gap-4 px-2">
						<span class="col-span-6 font-mono text-[10px] tracking-widest text-muted-foreground">DESCRIPTION</span>
						<span class="col-span-2 font-mono text-[10px] tracking-widest text-muted-foreground">QTY</span>
						<span class="col-span-2 font-mono text-[10px] tracking-widest text-muted-foreground">UNIT PRICE</span>
						<span class="col-span-2 font-mono text-[10px] tracking-widest text-muted-foreground">TOTAL</span>
					</div>

					{#each lineItems as item, i}
						<div class="grid grid-cols-12 gap-4 items-center border border-border p-4 sm:border-0 sm:p-0">
							<div class="col-span-12 sm:col-span-6">
								<Input
									placeholder="Item description"
									value={item.description}
									oninput={(e) => updateLineItem(i, 'description', e.currentTarget.value)}
									class="h-10 border-border bg-card"
								/>
							</div>
							<div class="col-span-4 sm:col-span-2">
								<Input
									type="number"
									min="0"
									step="1"
									value={item.quantity.toString()}
									oninput={(e) => updateLineItem(i, 'quantity', e.currentTarget.value)}
									class="h-10 border-border bg-card text-right font-mono"
								/>
							</div>
							<div class="col-span-4 sm:col-span-2">
								<Input
									type="number"
									min="0"
									step="0.01"
									value={item.unitPrice.toString()}
									oninput={(e) => updateLineItem(i, 'unitPrice', e.currentTarget.value)}
									class="h-10 border-border bg-card text-right font-mono"
								/>
							</div>
							<div class="col-span-3 sm:col-span-1 flex items-center justify-end">
								<span class="font-mono text-sm">{formatCurrency(item.total)}</span>
							</div>
							<div class="col-span-1 flex justify-end">
								<Button 
									type="button" 
									variant="ghost" 
									size="sm" 
									onclick={() => removeLineItem(i)}
									disabled={lineItems.length === 1}
									class="h-10 w-10 p-0 text-muted-foreground hover:text-destructive"
								>
									<Trash2 class="h-4 w-4" />
								</Button>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Totals -->
			<div class="space-y-4 border-t border-border pt-8">
				<div class="ml-auto max-w-sm space-y-4">
					<div class="flex items-center justify-between">
						<span class="font-body text-sm">Subtotal</span>
						<span class="font-mono text-sm">{formatCurrency(subtotal)}</span>
					</div>

					<div class="flex items-center justify-between gap-4">
						<Label for="taxRate" class="font-body text-sm">Tax Rate (%)</Label>
						<Input
							id="taxRate"
							name="taxRate"
							type="number"
							min="0"
							step="0.01"
							bind:value={taxRate}
							class="h-10 w-24 border-border bg-card text-right font-mono"
						/>
					</div>

					<div class="flex items-center justify-between">
						<span class="font-body text-sm">Tax Amount</span>
						<span class="font-mono text-sm">{formatCurrency(taxAmount)}</span>
					</div>

					<div class="flex items-center justify-between gap-4">
						<Label for="discount" class="font-body text-sm">Discount</Label>
						<Input
							id="discount"
							name="discount"
							type="number"
							min="0"
							step="0.01"
							bind:value={discount}
							class="h-10 w-24 border-border bg-card text-right font-mono"
						/>
					</div>

					<div class="flex items-center justify-between border-t border-border pt-4">
						<span class="font-ui text-sm font-semibold tracking-wider">TOTAL</span>
						<span class="font-display text-xl font-bold">{formatCurrency(total)}</span>
					</div>
				</div>
			</div>

			<!-- Notes -->
			<div class="space-y-4 border-t border-border pt-8">
				<Label for="notes" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					NOTES (VISIBLE TO CLIENT)
				</Label>
				<Textarea
					id="notes"
					name="notes"
					rows={3}
					placeholder="Payment terms, bank details, or other notes for the client..."
					class="border-border bg-card px-4 py-3 font-body"
				/>
			</div>

			<!-- Actions -->
			<div class="flex items-center gap-4 border-t border-border pt-8">
				<Button type="submit" disabled={isLoading || !selectedOrgId} class="font-ui tracking-wider">
					{#if isLoading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						CREATING...
					{:else}
						CREATE INVOICE
					{/if}
				</Button>
				<Button variant="outline" href="/admin/invoices" class="font-ui tracking-wider">
					CANCEL
				</Button>
			</div>
		</form>
	</section>
</div>
