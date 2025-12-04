<script lang="ts">
	/**
	 * Create Proposal Page
	 * 
	 * Form for admins to create new proposals for projects.
	 */
	import { enhance } from '$app/forms';
	import { 
		ArrowLeft, FileText, Plus, Trash2, Loader2, 
		DollarSign, Calendar, Building2, FolderKanban
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Select from '$lib/components/ui/select';

	let { data, form } = $props();

	let loading = $state(false);

	// Form state - use preselected project if provided
	let projectId = $state(data.preselectedProjectId ?? '');
	let title = $state('');
	let summary = $state('');
	let expiresAt = $state('');

	// Line items for pricing
	let lineItems = $state<Array<{ description: string; quantity: number; unitPrice: number }>>([
		{ description: '', quantity: 1, unitPrice: 0 }
	]);

	// Proposal sections
	let sections = $state<Array<{ title: string; content: string }>>([
		{ title: 'Project Overview', content: '' }
	]);

	// Tax and discount
	let taxRate = $state(0);
	let discount = $state(0);

	// Computed totals
	const subtotal = $derived(
		lineItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0)
	);
	const taxAmount = $derived(subtotal * (taxRate / 100));
	const total = $derived(subtotal + taxAmount - discount);

	// Line items with computed totals for the hidden input
	const lineItemsWithTotals = $derived(
		lineItems.map(item => ({
			...item,
			total: item.quantity * item.unitPrice
		}))
	);

	// Sections with order for the hidden input
	const sectionsWithOrder = $derived(
		sections.map((section, i) => ({
			...section,
			order: i + 1
		}))
	);

	function addLineItem() {
		lineItems = [...lineItems, { description: '', quantity: 1, unitPrice: 0 }];
	}

	function removeLineItem(index: number) {
		lineItems = lineItems.filter((_, i) => i !== index);
	}

	function addSection() {
		sections = [...sections, { title: '', content: '' }];
	}

	function removeSection(index: number) {
		sections = sections.filter((_, i) => i !== index);
	}

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 2
		}).format(amount);
	}

	// Get selected project info
	const selectedProject = $derived(
		data.projects.find(p => p.id === projectId)
	);
</script>

<svelte:head>
	<title>New Proposal | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<a
			href="/admin/proposals"
			class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			<span class="font-mono text-[10px] tracking-widest">BACK TO PROPOSALS</span>
		</a>
		<div class="mt-6 flex items-center gap-4">
			<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
				<FileText class="h-5 w-5 text-primary" />
			</div>
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CREATE</span>
				<h1 class="font-display text-2xl font-bold uppercase md:text-3xl">New Proposal</h1>
			</div>
		</div>
	</section>

	<!-- Error Message -->
	{#if form?.error}
		<div class="border-b border-destructive/30 bg-destructive/10 px-6 py-4 md:px-12 lg:px-16">
			<p class="font-body text-sm text-destructive">{form.error}</p>
		</div>
	{/if}

	<!-- Form -->
	<form
		method="POST"
		action="?/create"
		use:enhance={({ cancel }) => {
			if (loading) {
				cancel();
				return;
			}
			loading = true;
			return async ({ result, update }) => {
				if (result.type === 'redirect') {
					// Let the redirect happen naturally
					return;
				}
				loading = false;
				await update();
			};
		}}
	>
		<!-- Hidden fields for complex data -->
		<input type="hidden" name="lineItems" value={JSON.stringify(lineItemsWithTotals)} />
		<input type="hidden" name="sections" value={JSON.stringify(sectionsWithOrder)} />
		<input type="hidden" name="subtotal" value={subtotal} />

		<section class="border-b border-border bg-background">
			<div class="grid grid-cols-12 gap-px bg-border">
				<!-- Main Form -->
				<div class="col-span-12 bg-background px-6 py-8 lg:col-span-8 md:px-12 lg:px-16">
					<!-- Project Selection -->
					<div class="space-y-6">
						<div>
							<label for="projectId" class="font-mono text-[10px] tracking-widest text-muted-foreground">
								PROJECT <span class="text-destructive">*</span>
							</label>
							<select
								id="projectId"
								name="projectId"
								bind:value={projectId}
								required
								class="font-body mt-2 h-12 w-full border border-border bg-card px-4 text-sm focus:border-primary focus:outline-none"
							>
								<option value="">Select a project...</option>
								{#each data.projects as project}
									<option value={project.id}>
										{project.name} ({project.organization})
									</option>
								{/each}
							</select>
						</div>

						<!-- Title -->
						<div>
							<label for="title" class="font-mono text-[10px] tracking-widest text-muted-foreground">
								PROPOSAL TITLE <span class="text-destructive">*</span>
							</label>
							<Input
								id="title"
								name="title"
								type="text"
								bind:value={title}
								required
								placeholder="e.g., Website Redesign Proposal"
								class="mt-2 h-12 border-border bg-card px-4 font-body"
							/>
						</div>

						<!-- Summary -->
						<div>
							<label for="summary" class="font-mono text-[10px] tracking-widest text-muted-foreground">
								EXECUTIVE SUMMARY
							</label>
							<textarea
								id="summary"
								name="summary"
								bind:value={summary}
								rows="4"
								placeholder="Brief overview of the proposal..."
								class="font-body mt-2 w-full resize-none border border-border bg-card p-4 text-sm focus:border-primary focus:outline-none"
							></textarea>
						</div>

						<!-- Expiry Date -->
						<div>
							<label for="expiresAt" class="font-mono text-[10px] tracking-widest text-muted-foreground">
								VALID UNTIL
							</label>
							<Input
								id="expiresAt"
								name="expiresAt"
								type="date"
								bind:value={expiresAt}
								class="mt-2 h-12 border-border bg-card px-4 font-body"
							/>
						</div>
					</div>

					<!-- Content Sections -->
					<div class="mt-10">
						<div class="flex items-center justify-between">
							<h2 class="font-ui text-sm font-semibold tracking-wider">PROPOSAL SECTIONS</h2>
							<Button type="button" variant="outline" size="sm" onclick={addSection} class="font-ui text-xs tracking-wider">
								<Plus class="mr-2 h-3 w-3" />
								ADD SECTION
							</Button>
						</div>

						<div class="mt-6 space-y-6">
							{#each sections as section, i}
								<div class="border border-border p-6">
									<div class="flex items-center justify-between mb-4">
										<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SECTION {i + 1}</span>
										{#if sections.length > 1}
											<button type="button" onclick={() => removeSection(i)} class="text-muted-foreground hover:text-destructive">
												<Trash2 class="h-4 w-4" />
											</button>
										{/if}
									</div>
									<Input
										type="text"
										bind:value={section.title}
										placeholder="Section title"
										class="h-10 border-border bg-card px-4 font-body text-sm"
									/>
									<textarea
										bind:value={section.content}
										rows="4"
										placeholder="Section content..."
										class="font-body mt-3 w-full resize-none border border-border bg-card p-4 text-sm focus:border-primary focus:outline-none"
									></textarea>
								</div>
							{/each}
						</div>
					</div>

					<!-- Line Items -->
					<div class="mt-10">
						<div class="flex items-center justify-between">
							<h2 class="font-ui text-sm font-semibold tracking-wider">LINE ITEMS</h2>
							<Button type="button" variant="outline" size="sm" onclick={addLineItem} class="font-ui text-xs tracking-wider">
								<Plus class="mr-2 h-3 w-3" />
								ADD ITEM
							</Button>
						</div>

						<!-- Line Items Table -->
						<div class="mt-6 border border-border">
							<!-- Table Header -->
							<div class="grid grid-cols-12 gap-2 border-b border-border bg-muted/30 px-4 py-3">
								<span class="col-span-5 font-mono text-[10px] tracking-widest text-muted-foreground">DESCRIPTION</span>
								<span class="col-span-2 font-mono text-[10px] tracking-widest text-muted-foreground text-center">QTY</span>
								<span class="col-span-2 font-mono text-[10px] tracking-widest text-muted-foreground text-right">UNIT PRICE</span>
								<span class="col-span-2 font-mono text-[10px] tracking-widest text-muted-foreground text-right">TOTAL</span>
								<span class="col-span-1"></span>
							</div>
							<!-- Table Body -->
							{#each lineItems as item, i}
								<div class="grid grid-cols-12 gap-2 items-center border-b border-border last:border-b-0 px-4 py-3">
									<div class="col-span-5">
										<Input
											type="text"
											bind:value={item.description}
											placeholder="Item description"
											class="h-9 border-border bg-card px-3 font-body text-sm"
										/>
									</div>
									<div class="col-span-2">
										<Input
											type="number"
											bind:value={item.quantity}
											min="1"
											placeholder="1"
											class="h-9 border-border bg-card px-3 font-mono text-sm text-center"
										/>
									</div>
									<div class="col-span-2">
										<Input
											type="number"
											bind:value={item.unitPrice}
											min="0"
											step="0.01"
											placeholder="0.00"
											class="h-9 border-border bg-card px-3 font-mono text-sm text-right"
										/>
									</div>
									<div class="col-span-2 text-right">
										<span class="font-mono text-sm">{formatCurrency(item.quantity * item.unitPrice)}</span>
									</div>
									<div class="col-span-1 flex justify-end">
										{#if lineItems.length > 1}
											<button type="button" onclick={() => removeLineItem(i)} class="text-muted-foreground hover:text-destructive p-1">
												<Trash2 class="h-4 w-4" />
											</button>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<!-- Sidebar Summary -->
				<div class="col-span-12 bg-background px-6 py-8 lg:col-span-4 lg:border-l lg:border-border md:px-12 lg:px-8">
					<!-- Project Info -->
					{#if selectedProject}
						<div class="border border-border p-6">
							<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SELECTED PROJECT</span>
							<div class="mt-4 space-y-3">
								<div class="flex items-center gap-3">
									<FolderKanban class="h-4 w-4 text-muted-foreground" />
									<span class="font-body text-sm">{selectedProject.name}</span>
								</div>
								<div class="flex items-center gap-3">
									<Building2 class="h-4 w-4 text-muted-foreground" />
									<span class="font-body text-sm">{selectedProject.organization}</span>
								</div>
							</div>
						</div>
					{/if}

					<!-- Pricing Summary -->
					<div class="mt-6 border border-border p-6">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PRICING</span>
						
						<div class="mt-6 space-y-4">
							<div class="flex justify-between">
								<span class="font-body text-sm text-muted-foreground">Subtotal</span>
								<span class="font-mono text-sm">{formatCurrency(subtotal)}</span>
							</div>
							
							<div class="flex items-center gap-2">
								<span class="font-body text-sm text-muted-foreground flex-1">Tax Rate (%)</span>
								<Input
									type="number"
									name="taxRate"
									bind:value={taxRate}
									min="0"
									max="100"
									step="0.01"
									class="h-8 w-20 border-border bg-card px-2 font-mono text-sm text-right"
								/>
							</div>
							
							<div class="flex justify-between text-sm text-muted-foreground">
								<span class="font-body">Tax Amount</span>
								<span class="font-mono">{formatCurrency(taxAmount)}</span>
							</div>

							<div class="flex items-center gap-2">
								<span class="font-body text-sm text-muted-foreground flex-1">Discount ($)</span>
								<Input
									type="number"
									name="discount"
									bind:value={discount}
									min="0"
									step="0.01"
									class="h-8 w-24 border-border bg-card px-2 font-mono text-sm text-right"
								/>
							</div>

							<div class="border-t border-border pt-4">
								<div class="flex justify-between">
									<span class="font-ui text-sm font-semibold">Total</span>
									<span class="font-mono text-lg font-semibold text-primary">{formatCurrency(total)}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Actions -->
					<div class="mt-6 space-y-3">
						<Button type="submit" disabled={loading || !projectId || !title} class="font-ui w-full text-xs tracking-wider">
							{#if loading}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								CREATING...
							{:else}
								<FileText class="mr-2 h-4 w-4" />
								CREATE PROPOSAL
							{/if}
						</Button>
						<Button type="submit" formaction="?/saveDraft" variant="outline" disabled={loading || !projectId || !title} class="font-ui w-full text-xs tracking-wider">
							SAVE AS DRAFT
						</Button>
					</div>

					<!-- Help -->
					<div class="mt-6 border border-border p-6">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">TIPS</span>
						<ul class="mt-4 space-y-2 text-sm text-muted-foreground">
							<li class="flex items-start gap-2">
								<span class="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground"></span>
								<span class="font-body">Add detailed line items for clear pricing</span>
							</li>
							<li class="flex items-start gap-2">
								<span class="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground"></span>
								<span class="font-body">Set an expiry date to create urgency</span>
							</li>
							<li class="flex items-start gap-2">
								<span class="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-muted-foreground"></span>
								<span class="font-body">Include sections for scope, timeline, and terms</span>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</section>
	</form>
</div>
