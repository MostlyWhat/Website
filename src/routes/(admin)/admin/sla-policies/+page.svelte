<script lang="ts">
	import { enhance } from '$app/forms';
	import { Plus, Edit2, Trash2, Clock, Star, AlertCircle, Check } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data, form } = $props();

	let showCreateModal = $state(false);
	let editingPolicy = $state<typeof data.policies[0] | null>(null);
	let deleteConfirm = $state<string | null>(null);

	// Form state
	let formName = $state('');
	let formDescription = $state('');
	let formUrgentResponse = $state(1);
	let formUrgentResolution = $state(4);
	let formHighResponse = $state(4);
	let formHighResolution = $state(8);
	let formMediumResponse = $state(8);
	let formMediumResolution = $state(24);
	let formLowResponse = $state(24);
	let formLowResolution = $state(72);
	let formBusinessHoursOnly = $state(true);
	let formBusinessStart = $state(9);
	let formBusinessEnd = $state(17);
	let formIsDefault = $state(false);
	let formIsActive = $state(true);

	function resetForm() {
		formName = '';
		formDescription = '';
		formUrgentResponse = 1;
		formUrgentResolution = 4;
		formHighResponse = 4;
		formHighResolution = 8;
		formMediumResponse = 8;
		formMediumResolution = 24;
		formLowResponse = 24;
		formLowResolution = 72;
		formBusinessHoursOnly = true;
		formBusinessStart = 9;
		formBusinessEnd = 17;
		formIsDefault = false;
		formIsActive = true;
	}

	function openEditModal(policy: typeof data.policies[0]) {
		editingPolicy = policy;
		formName = policy.name;
		formDescription = policy.description ?? '';
		formUrgentResponse = policy.urgentResponseHours;
		formUrgentResolution = policy.urgentResolutionHours;
		formHighResponse = policy.highResponseHours;
		formHighResolution = policy.highResolutionHours;
		formMediumResponse = policy.mediumResponseHours;
		formMediumResolution = policy.mediumResolutionHours;
		formLowResponse = policy.lowResponseHours;
		formLowResolution = policy.lowResolutionHours;
		formBusinessHoursOnly = policy.businessHoursOnly;
		formBusinessStart = policy.businessHoursStart;
		formBusinessEnd = policy.businessHoursEnd;
		formIsDefault = policy.isDefault;
		formIsActive = policy.isActive;
	}

	function closeModal() {
		showCreateModal = false;
		editingPolicy = null;
		deleteConfirm = null;
		resetForm();
	}

	function formatHours(hours: number): string {
		if (hours < 24) return `${hours}h`;
		const days = hours / 24;
		return days === 1 ? '1 day' : `${days} days`;
	}
</script>

<svelte:head>
	<title>SLA Policies | Admin</title>
</svelte:head>

<div class="min-h-screen bg-muted/30">
	<!-- Header -->
	<div class="border-b border-border bg-background">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="font-display text-2xl font-medium text-foreground">SLA Policies</h1>
					<p class="mt-1 text-sm text-muted-foreground">
						Define service level agreements for ticket response and resolution times
					</p>
				</div>
				<Button onclick={() => { resetForm(); showCreateModal = true; }}>
					<Plus class="mr-2 h-4 w-4" />
					New Policy
				</Button>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if form?.error}
			<div class="mb-6 flex items-center gap-2 border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
				<AlertCircle class="h-4 w-4" />
				{form.error}
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-6 flex items-center gap-2 border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">
				<Check class="h-4 w-4" />
				{form.message}
			</div>
		{/if}

		{#if data.policies.length === 0}
			<div class="border border-border bg-background p-12 text-center">
				<Clock class="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
				<h3 class="mt-4 text-lg font-medium text-foreground">No SLA Policies</h3>
				<p class="mt-2 text-sm text-muted-foreground">
					Create your first SLA policy to define response and resolution time targets.
				</p>
				<Button onclick={() => showCreateModal = true} class="mt-4">
					<Plus class="mr-2 h-4 w-4" />
					Create Policy
				</Button>
			</div>
		{:else}
			<div class="grid gap-6 lg:grid-cols-2">
				{#each data.policies as policy}
					<div class="border border-border bg-background {!policy.isActive ? 'opacity-60' : ''}">
						<div class="flex items-start justify-between border-b border-border p-4">
							<div>
								<div class="flex items-center gap-2">
									<h3 class="font-medium text-foreground">{policy.name}</h3>
									{#if policy.isDefault}
										<span class="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary border border-primary/30">
											<Star class="h-3 w-3" />
											DEFAULT
										</span>
									{/if}
									{#if !policy.isActive}
										<span class="px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground border border-border">
											INACTIVE
										</span>
									{/if}
								</div>
								{#if policy.description}
									<p class="mt-1 text-sm text-muted-foreground">{policy.description}</p>
								{/if}
							</div>
							<div class="flex items-center gap-2">
								<button
									type="button"
									onclick={() => openEditModal(policy)}
									class="p-1 text-muted-foreground hover:text-foreground transition-colors"
									title="Edit"
								>
									<Edit2 class="h-4 w-4" />
								</button>
								<button
									type="button"
									onclick={() => deleteConfirm = policy.id}
									class="p-1 text-muted-foreground hover:text-destructive transition-colors"
									title="Delete"
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						</div>

						<div class="p-4">
							<table class="w-full text-sm">
								<thead>
									<tr class="text-left text-muted-foreground">
										<th class="pb-2 font-mono text-[10px] tracking-widest">PRIORITY</th>
										<th class="pb-2 font-mono text-[10px] tracking-widest">RESPONSE</th>
										<th class="pb-2 font-mono text-[10px] tracking-widest">RESOLUTION</th>
									</tr>
								</thead>
								<tbody class="divide-y divide-border">
									<tr>
										<td class="py-2">
											<span class="px-1.5 py-0.5 text-xs bg-red-500/10 text-red-500 border border-red-500/30">Urgent</span>
										</td>
										<td class="py-2 text-foreground">{formatHours(policy.urgentResponseHours)}</td>
										<td class="py-2 text-foreground">{formatHours(policy.urgentResolutionHours)}</td>
									</tr>
									<tr>
										<td class="py-2">
											<span class="px-1.5 py-0.5 text-xs bg-orange-500/10 text-orange-500 border border-orange-500/30">High</span>
										</td>
										<td class="py-2 text-foreground">{formatHours(policy.highResponseHours)}</td>
										<td class="py-2 text-foreground">{formatHours(policy.highResolutionHours)}</td>
									</tr>
									<tr>
										<td class="py-2">
											<span class="px-1.5 py-0.5 text-xs bg-yellow-500/10 text-yellow-500 border border-yellow-500/30">Medium</span>
										</td>
										<td class="py-2 text-foreground">{formatHours(policy.mediumResponseHours)}</td>
										<td class="py-2 text-foreground">{formatHours(policy.mediumResolutionHours)}</td>
									</tr>
									<tr>
										<td class="py-2">
											<span class="px-1.5 py-0.5 text-xs bg-green-500/10 text-green-500 border border-green-500/30">Low</span>
										</td>
										<td class="py-2 text-foreground">{formatHours(policy.lowResponseHours)}</td>
										<td class="py-2 text-foreground">{formatHours(policy.lowResolutionHours)}</td>
									</tr>
								</tbody>
							</table>

							<div class="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
								{#if policy.businessHoursOnly}
									<span>Business hours only: {policy.businessHoursStart}:00 - {policy.businessHoursEnd}:00</span>
								{:else}
									<span>24/7 support</span>
								{/if}
							</div>
						</div>

						{#if !policy.isDefault}
							<div class="border-t border-border p-4">
								<form method="POST" action="?/setDefault" use:enhance>
									<input type="hidden" name="id" value={policy.id} />
									<Button type="submit" variant="outline" size="sm">
										<Star class="mr-2 h-3 w-3" />
										Set as Default
									</Button>
								</form>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<!-- Create/Edit Modal -->
{#if showCreateModal || editingPolicy}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border bg-background shadow-xl">
			<div class="sticky top-0 z-10 border-b border-border bg-background px-6 py-4">
				<h2 class="font-display text-lg font-medium text-foreground">
					{editingPolicy ? 'Edit SLA Policy' : 'Create SLA Policy'}
				</h2>
			</div>

			<form 
				method="POST" 
				action={editingPolicy ? '?/update' : '?/create'} 
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						closeModal();
					};
				}}
			>
				{#if editingPolicy}
					<input type="hidden" name="id" value={editingPolicy.id} />
				{/if}

				<div class="p-6 space-y-6">
					<!-- Basic Info -->
					<div class="space-y-4">
						<div>
							<label for="name" class="block font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
								POLICY NAME *
							</label>
							<input
								type="text"
								id="name"
								name="name"
								bind:value={formName}
								required
								class="w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
								placeholder="e.g., Standard Support, Premium Support"
							/>
						</div>

						<div>
							<label for="description" class="block font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
								DESCRIPTION
							</label>
							<input
								type="text"
								id="description"
								name="description"
								bind:value={formDescription}
								class="w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
								placeholder="Brief description of this SLA policy"
							/>
						</div>
					</div>

					<!-- Response Times -->
					<div>
						<h3 class="font-mono text-[10px] tracking-widest text-muted-foreground mb-3">RESPONSE TIME TARGETS (hours)</h3>
						<div class="grid grid-cols-4 gap-4">
							<div>
								<label for="urgentResponse" class="block text-xs text-red-500 mb-1">Urgent</label>
								<input
									type="number"
									id="urgentResponse"
									name="urgentResponseHours"
									bind:value={formUrgentResponse}
									min="1"
									class="w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
								/>
							</div>
							<div>
								<label for="highResponse" class="block text-xs text-orange-500 mb-1">High</label>
								<input
									type="number"
									id="highResponse"
									name="highResponseHours"
									bind:value={formHighResponse}
									min="1"
									class="w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
								/>
							</div>
							<div>
								<label for="mediumResponse" class="block text-xs text-yellow-500 mb-1">Medium</label>
								<input
									type="number"
									id="mediumResponse"
									name="mediumResponseHours"
									bind:value={formMediumResponse}
									min="1"
									class="w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
								/>
							</div>
							<div>
								<label for="lowResponse" class="block text-xs text-green-500 mb-1">Low</label>
								<input
									type="number"
									id="lowResponse"
									name="lowResponseHours"
									bind:value={formLowResponse}
									min="1"
									class="w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
								/>
							</div>
						</div>
					</div>

					<!-- Resolution Times -->
					<div>
						<h3 class="font-mono text-[10px] tracking-widest text-muted-foreground mb-3">RESOLUTION TIME TARGETS (hours)</h3>
						<div class="grid grid-cols-4 gap-4">
							<div>
								<label for="urgentResolution" class="block text-xs text-red-500 mb-1">Urgent</label>
								<input
									type="number"
									id="urgentResolution"
									name="urgentResolutionHours"
									bind:value={formUrgentResolution}
									min="1"
									class="w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
								/>
							</div>
							<div>
								<label for="highResolution" class="block text-xs text-orange-500 mb-1">High</label>
								<input
									type="number"
									id="highResolution"
									name="highResolutionHours"
									bind:value={formHighResolution}
									min="1"
									class="w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
								/>
							</div>
							<div>
								<label for="mediumResolution" class="block text-xs text-yellow-500 mb-1">Medium</label>
								<input
									type="number"
									id="mediumResolution"
									name="mediumResolutionHours"
									bind:value={formMediumResolution}
									min="1"
									class="w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
								/>
							</div>
							<div>
								<label for="lowResolution" class="block text-xs text-green-500 mb-1">Low</label>
								<input
									type="number"
									id="lowResolution"
									name="lowResolutionHours"
									bind:value={formLowResolution}
									min="1"
									class="w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
								/>
							</div>
						</div>
					</div>

					<!-- Business Hours -->
					<div>
						<h3 class="font-mono text-[10px] tracking-widest text-muted-foreground mb-3">BUSINESS HOURS</h3>
						<div class="space-y-3">
							<label class="flex items-center gap-2 text-sm cursor-pointer">
								<input 
									type="checkbox" 
									bind:checked={formBusinessHoursOnly}
									class="h-4 w-4 rounded border-border"
								/>
								<input type="hidden" name="businessHoursOnly" value={formBusinessHoursOnly.toString()} />
								<span class="text-foreground">Count business hours only (exclude nights/weekends)</span>
							</label>

							{#if formBusinessHoursOnly}
								<div class="flex items-center gap-4 pl-6">
									<div class="flex items-center gap-2">
										<label for="businessStart" class="text-xs text-muted-foreground">Start:</label>
										<select
											id="businessStart"
											name="businessHoursStart"
											bind:value={formBusinessStart}
											class="border border-border bg-card px-2 py-1 text-sm focus:border-primary focus:outline-none"
										>
											{#each Array(24) as _, i}
												<option value={i}>{i.toString().padStart(2, '0')}:00</option>
											{/each}
										</select>
									</div>
									<div class="flex items-center gap-2">
										<label for="businessEnd" class="text-xs text-muted-foreground">End:</label>
										<select
											id="businessEnd"
											name="businessHoursEnd"
											bind:value={formBusinessEnd}
											class="border border-border bg-card px-2 py-1 text-sm focus:border-primary focus:outline-none"
										>
											{#each Array(24) as _, i}
												<option value={i}>{i.toString().padStart(2, '0')}:00</option>
											{/each}
										</select>
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- Options -->
					<div class="space-y-3">
						<label class="flex items-center gap-2 text-sm cursor-pointer">
							<input 
								type="checkbox" 
								bind:checked={formIsDefault}
								class="h-4 w-4 rounded border-border"
							/>
							<input type="hidden" name="isDefault" value={formIsDefault.toString()} />
							<span class="text-foreground">Set as default policy for new tickets</span>
						</label>

						{#if editingPolicy}
							<label class="flex items-center gap-2 text-sm cursor-pointer">
								<input 
									type="checkbox" 
									bind:checked={formIsActive}
									class="h-4 w-4 rounded border-border"
								/>
								<input type="hidden" name="isActive" value={formIsActive.toString()} />
								<span class="text-foreground">Policy is active</span>
							</label>
						{/if}
					</div>
				</div>

				<div class="sticky bottom-0 flex items-center justify-end gap-3 border-t border-border bg-background px-6 py-4">
					<Button type="button" variant="outline" onclick={closeModal}>Cancel</Button>
					<Button type="submit">
						{editingPolicy ? 'Update Policy' : 'Create Policy'}
					</Button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Delete Confirmation -->
{#if deleteConfirm}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="w-full max-w-md border border-border bg-background p-6 shadow-xl">
			<h2 class="font-display text-lg font-medium text-foreground">Delete SLA Policy?</h2>
			<p class="mt-2 text-sm text-muted-foreground">
				This action cannot be undone. Tickets using this policy will continue to use their current SLA targets.
			</p>
			<div class="mt-6 flex items-center justify-end gap-3">
				<Button type="button" variant="outline" onclick={() => deleteConfirm = null}>Cancel</Button>
				<form method="POST" action="?/delete" use:enhance={() => {
					return async ({ update }) => {
						await update();
						deleteConfirm = null;
					};
				}}>
					<input type="hidden" name="id" value={deleteConfirm} />
					<Button type="submit" variant="destructive">Delete</Button>
				</form>
			</div>
		</div>
	</div>
{/if}
