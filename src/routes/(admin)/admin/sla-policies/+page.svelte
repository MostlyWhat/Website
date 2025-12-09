<script lang="ts">
	/**
	 * Admin SLA Policies Page
	 * Manage Service Level Agreement policies with customer type and category rules
	 */
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { 
		Plus, Edit2, Trash2, Clock, Star, AlertCircle, Check, 
		Building2, Users, Tag, ChevronDown, ChevronUp, Settings2,
		Bell, Shield, Calendar
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data, form } = $props();

	$effect(() => {
		if (form?.success && form?.message) {
			toast.success(form.message);
			window.scrollTo({ top: 0, behavior: 'smooth' });
			showCreateModal = false;
			resetForm();
		}
	});

	let showCreateModal = $state(false);
	let editingPolicy = $state<typeof data.policies[0] | null>(null);
	let deleteConfirm = $state<string | null>(null);
	let expandedPolicies = $state<Set<string>>(new Set());
	let activeTab = $state<'policies' | 'categories' | 'assignments'>('policies');

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
	let formBusinessDays = $state([1, 2, 3, 4, 5]);
	let formIsDefault = $state(false);
	let formIsActive = $state(true);
	let formCustomerTypes = $state<string[]>([]);
	let formCategories = $state<string[]>([]);
	let formPriorityOrder = $state(0);
	let formEscalationEnabled = $state(false);
	let formEscalationAfterHours = $state(24);

	const customerTypeOptions = [
		{ value: 'personal', label: 'Personal', color: 'text-blue-500' },
		{ value: 'business', label: 'Business', color: 'text-green-500' },
		{ value: 'enterprise', label: 'Enterprise', color: 'text-purple-500' }
	];

	const dayOptions = [
		{ value: 0, label: 'Sun' },
		{ value: 1, label: 'Mon' },
		{ value: 2, label: 'Tue' },
		{ value: 3, label: 'Wed' },
		{ value: 4, label: 'Thu' },
		{ value: 5, label: 'Fri' },
		{ value: 6, label: 'Sat' }
	];

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
		formBusinessDays = [1, 2, 3, 4, 5];
		formIsDefault = false;
		formIsActive = true;
		formCustomerTypes = [];
		formCategories = [];
		formPriorityOrder = 0;
		formEscalationEnabled = false;
		formEscalationAfterHours = 24;
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
		formBusinessDays = policy.businessDays ?? [1, 2, 3, 4, 5];
		formIsDefault = policy.isDefault;
		formIsActive = policy.isActive;
		formCustomerTypes = policy.appliesToCustomerTypes ?? [];
		formCategories = policy.appliesToCategories ?? [];
		formPriorityOrder = policy.priorityOrder ?? 0;
		formEscalationEnabled = policy.escalationEnabled ?? false;
		formEscalationAfterHours = policy.escalationAfterHours ?? 24;
	}

	function closeModal() {
		showCreateModal = false;
		editingPolicy = null;
		deleteConfirm = null;
		resetForm();
	}

	function formatHours(hours: number): string {
		if (hours < 1) return `${Math.round(hours * 60)}m`;
		if (hours < 24) return `${hours}h`;
		const days = hours / 24;
		return days === 1 ? '1 day' : `${days} days`;
	}

	function toggleExpand(id: string) {
		const newSet = new Set(expandedPolicies);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		expandedPolicies = newSet;
	}

	function toggleCustomerType(type: string) {
		if (formCustomerTypes.includes(type)) {
			formCustomerTypes = formCustomerTypes.filter(t => t !== type);
		} else {
			formCustomerTypes = [...formCustomerTypes, type];
		}
	}

	function toggleCategory(slug: string) {
		if (formCategories.includes(slug)) {
			formCategories = formCategories.filter(c => c !== slug);
		} else {
			formCategories = [...formCategories, slug];
		}
	}

	function toggleBusinessDay(day: number) {
		if (formBusinessDays.includes(day)) {
			formBusinessDays = formBusinessDays.filter(d => d !== day);
		} else {
			formBusinessDays = [...formBusinessDays, day].sort((a, b) => a - b);
		}
	}

	// Computed stats
	const activeCount = $derived(data.policies.filter(p => p.isActive).length);
	const defaultPolicy = $derived(data.policies.find(p => p.isDefault));
</script>

<svelte:head>
	<title>SLA Policies | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// SUPPORT CONFIGURATION</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">SLA Policies</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Define service level agreements for ticket response and resolution times.
				</p>
			</div>
			<Button onclick={() => { resetForm(); showCreateModal = true; }} size="sm" class="font-ui text-xs tracking-wider">
				<Plus class="mr-2 h-4 w-4" />
				NEW POLICY
			</Button>
		</div>
	</section>

	<!-- Tabs -->
	<section class="border-b border-border bg-card">
		<div class="flex px-6 md:px-12 lg:px-16">
			<button
				onclick={() => activeTab = 'policies'}
				class="relative flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-wider transition-colors {activeTab === 'policies' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}"
			>
				<Shield class="h-4 w-4" />
				POLICIES
				<span class="font-display text-sm font-bold">{data.policies.length}</span>
				{#if activeTab === 'policies'}
					<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
				{/if}
			</button>
			<button
				onclick={() => activeTab = 'categories'}
				class="relative flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-wider transition-colors {activeTab === 'categories' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}"
			>
				<Tag class="h-4 w-4" />
				CATEGORIES
				<span class="font-display text-sm font-bold">{data.categories.length}</span>
				{#if activeTab === 'categories'}
					<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
				{/if}
			</button>
			<button
				onclick={() => activeTab = 'assignments'}
				class="relative flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-wider transition-colors {activeTab === 'assignments' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}"
			>
				<Building2 class="h-4 w-4" />
				ORG ASSIGNMENTS
				<span class="font-display text-sm font-bold">{data.assignments.length}</span>
				{#if activeTab === 'assignments'}
					<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
				{/if}
			</button>
		</div>
	</section>

	<!-- Stats Bar -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-3 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-primary">{data.policies.length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL POLICIES</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-green-500">{activeCount}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">ACTIVE</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-blue-500">{data.categories.length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">CATEGORIES</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-purple-500">{data.assignments.length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">ORG ASSIGNMENTS</p>
			</div>
		</div>
	</section>

	{#if form?.error}
		<div class="mx-6 mt-6 flex items-center gap-2 border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive md:mx-12 lg:mx-16">
			<AlertCircle class="h-4 w-4" />
			{form.error}
		</div>
	{/if}

	{#if form?.success}
		<div class="mx-6 mt-6 flex items-center gap-2 border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500 md:mx-12 lg:mx-16">
			<Check class="h-4 w-4" />
			{form.message}
		</div>
	{/if}

	<!-- Content -->
	<div class="px-6 py-8 md:px-12 lg:px-16">
		{#if activeTab === 'policies'}
			<!-- Policies List -->
			{#if data.policies.length === 0}
				<div class="border border-border bg-card p-12 text-center">
					<Shield class="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
					<h3 class="mt-4 text-lg font-medium text-foreground">No SLA Policies</h3>
					<p class="mt-2 text-sm text-muted-foreground">
						Create your first SLA policy to define response and resolution time targets.
					</p>
					<div class="mt-6 flex flex-col items-center gap-3">
						<Button onclick={() => showCreateModal = true}>
							<Plus class="mr-2 h-4 w-4" />
							Create Policy
						</Button>
						<p class="mt-1 max-w-xs text-xs text-muted-foreground">
							Or run the database seed script to set up Standard, Priority, and Enterprise SLA policies with recommended settings.
						</p>
					</div>
				</div>
			{:else}
				<div class="space-y-4">
					{#each data.policies as policy (policy.id)}
						<div class="border border-border bg-card {!policy.isActive ? 'opacity-60' : ''}">
							<!-- Policy Header -->
							<div class="flex items-start justify-between p-4">
								<div class="flex-1">
									<div class="flex flex-wrap items-center gap-2">
										<h3 class="font-ui text-base font-semibold tracking-wider">{policy.name}</h3>
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
										{#if policy.escalationEnabled}
											<span class="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-orange-500/10 text-orange-500 border border-orange-500/30">
												<Bell class="h-3 w-3" />
												ESCALATION
											</span>
										{/if}
									</div>
									{#if policy.description}
										<p class="mt-1 text-sm text-muted-foreground">{policy.description}</p>
									{/if}

									<!-- Applicability Tags -->
									<div class="mt-3 flex flex-wrap gap-2">
										{#if policy.appliesToCustomerTypes && policy.appliesToCustomerTypes.length > 0}
											{#each policy.appliesToCustomerTypes as type}
												<span class="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono tracking-wider bg-card border border-border">
													<Users class="h-3 w-3" />
													{type.toUpperCase()}
												</span>
											{/each}
										{/if}
										{#if policy.appliesToCategories && policy.appliesToCategories.length > 0}
											{#each policy.appliesToCategories as cat}
												<span class="flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono tracking-wider bg-card border border-border">
													<Tag class="h-3 w-3" />
													{cat.toUpperCase()}
												</span>
											{/each}
										{/if}
										{#if (!policy.appliesToCustomerTypes || policy.appliesToCustomerTypes.length === 0) && (!policy.appliesToCategories || policy.appliesToCategories.length === 0)}
											<span class="text-[10px] font-mono tracking-wider text-muted-foreground">
												Applies to: ALL (no restrictions)
											</span>
										{/if}
									</div>
								</div>

								<div class="flex items-center gap-2">
									<button
										type="button"
										onclick={() => toggleExpand(policy.id)}
										class="p-1 text-muted-foreground hover:text-foreground transition-colors"
										title={expandedPolicies.has(policy.id) ? 'Collapse' : 'Expand'}
									>
										{#if expandedPolicies.has(policy.id)}
											<ChevronUp class="h-4 w-4" />
										{:else}
											<ChevronDown class="h-4 w-4" />
										{/if}
									</button>
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

							<!-- Compact SLA Table (always visible) -->
							<div class="border-t border-border px-4 py-3">
								<div class="flex gap-4 text-xs">
									<div class="flex items-center gap-2">
										<span class="px-1.5 py-0.5 bg-red-500/10 text-red-500 border border-red-500/30 font-mono text-[10px]">URG</span>
										<span class="text-foreground">{formatHours(policy.urgentResponseHours)} / {formatHours(policy.urgentResolutionHours)}</span>
									</div>
									<div class="flex items-center gap-2">
										<span class="px-1.5 py-0.5 bg-orange-500/10 text-orange-500 border border-orange-500/30 font-mono text-[10px]">HIGH</span>
										<span class="text-foreground">{formatHours(policy.highResponseHours)} / {formatHours(policy.highResolutionHours)}</span>
									</div>
									<div class="flex items-center gap-2">
										<span class="px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 font-mono text-[10px]">MED</span>
										<span class="text-foreground">{formatHours(policy.mediumResponseHours)} / {formatHours(policy.mediumResolutionHours)}</span>
									</div>
									<div class="flex items-center gap-2">
										<span class="px-1.5 py-0.5 bg-green-500/10 text-green-500 border border-green-500/30 font-mono text-[10px]">LOW</span>
										<span class="text-foreground">{formatHours(policy.lowResponseHours)} / {formatHours(policy.lowResolutionHours)}</span>
									</div>
									<div class="ml-auto text-muted-foreground">
										{#if policy.businessHoursOnly}
											<span class="flex items-center gap-1">
												<Calendar class="h-3 w-3" />
												{policy.businessHoursStart}:00-{policy.businessHoursEnd}:00
											</span>
										{:else}
											<span class="text-primary">24/7</span>
										{/if}
									</div>
								</div>
							</div>

							<!-- Expanded Details -->
							{#if expandedPolicies.has(policy.id)}
								<div class="border-t border-border p-4 bg-muted/30">
									<div class="grid grid-cols-12 gap-6">
										<!-- Full SLA Table -->
										<div class="col-span-12 md:col-span-6">
											<h4 class="font-mono text-[10px] tracking-widest text-muted-foreground mb-3">RESPONSE & RESOLUTION TIMES</h4>
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
										</div>

										<!-- Business Hours & Settings -->
										<div class="col-span-12 md:col-span-6">
											<h4 class="font-mono text-[10px] tracking-widest text-muted-foreground mb-3">SETTINGS</h4>
											<div class="space-y-3 text-sm">
												<div class="flex justify-between">
													<span class="text-muted-foreground">Business Hours</span>
													<span class="text-foreground">
														{#if policy.businessHoursOnly}
															{policy.businessHoursStart}:00 - {policy.businessHoursEnd}:00
														{:else}
															24/7 (All hours)
														{/if}
													</span>
												</div>
												<div class="flex justify-between">
													<span class="text-muted-foreground">Business Days</span>
													<span class="text-foreground">
														{#if policy.businessDays}
															{policy.businessDays.map(d => dayOptions.find(o => o.value === d)?.label).join(', ')}
														{:else}
															Mon-Fri
														{/if}
													</span>
												</div>
												<div class="flex justify-between">
													<span class="text-muted-foreground">Priority Order</span>
													<span class="text-foreground">{policy.priorityOrder ?? 0}</span>
												</div>
												{#if policy.escalationEnabled}
													<div class="flex justify-between">
														<span class="text-muted-foreground">Escalate After</span>
														<span class="text-foreground">{policy.escalationAfterHours ?? 24} hours</span>
													</div>
												{/if}
											</div>

											{#if !policy.isDefault}
												<div class="mt-4 pt-4 border-t border-border">
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
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			{/if}

		{:else if activeTab === 'categories'}
			<!-- Categories List -->
			<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each data.categories as category (category.id)}
					<div class="border border-border bg-card p-4">
						<div class="flex items-start gap-3">
							<div 
								class="flex h-10 w-10 items-center justify-center border border-border"
								style="background-color: {category.color}20; color: {category.color}"
							>
								<Tag class="h-5 w-5" />
							</div>
							<div class="flex-1">
								<h3 class="font-ui text-sm font-semibold tracking-wider">{category.name}</h3>
								<p class="mt-1 text-xs text-muted-foreground">{category.description}</p>
								<div class="mt-2 flex items-center gap-2">
									<span class="font-mono text-[10px] tracking-wider text-muted-foreground">
										SLUG: {category.slug}
									</span>
									{#if !category.isActive}
										<span class="px-1.5 py-0.5 text-[10px] font-medium bg-muted text-muted-foreground border border-border">
											INACTIVE
										</span>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<p class="mt-4 text-xs text-muted-foreground">
				Note: Categories are managed via database seed. Contact admin to add new categories.
			</p>

		{:else if activeTab === 'assignments'}
			<!-- Organization Assignments -->
			{#if data.assignments.length === 0}
				<div class="border border-border bg-card p-12 text-center">
					<Building2 class="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
					<h3 class="mt-4 text-lg font-medium text-foreground">No Organization Assignments</h3>
					<p class="mt-2 text-sm text-muted-foreground">
						Organization-specific SLA assignments will appear here. Assign policies to organizations for custom support levels.
					</p>
				</div>
			{:else}
				<div class="space-y-3">
					{#each data.assignments as assignment (assignment.id)}
						<div class="flex items-center justify-between border border-border bg-card p-4">
							<div class="flex items-center gap-4">
								<div class="flex h-10 w-10 items-center justify-center border border-border bg-muted">
									<Building2 class="h-5 w-5 text-muted-foreground" />
								</div>
								<div>
									<h3 class="font-ui text-sm font-semibold">{assignment.organizationName}</h3>
									<p class="text-xs text-muted-foreground">
										Policy: <span class="text-primary">{assignment.policyName}</span>
									</p>
								</div>
							</div>
							{#if assignment.notes}
								<p class="text-xs text-muted-foreground max-w-xs truncate">{assignment.notes}</p>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
		{/if}
	</div>
</div>

<!-- Create/Edit Modal -->
{#if showCreateModal || editingPolicy}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-border bg-background shadow-xl">
			<div class="sticky top-0 z-10 border-b border-border bg-background px-6 py-4">
				<h2 class="font-display text-lg font-bold uppercase">
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
					<div class="grid grid-cols-12 gap-4">
						<div class="col-span-12 md:col-span-8">
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
								placeholder="e.g., Standard Support, Priority Support"
							/>
						</div>
						<div class="col-span-12 md:col-span-4">
							<label for="priorityOrder" class="block font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
								PRIORITY ORDER
							</label>
							<input
								type="number"
								id="priorityOrder"
								name="priorityOrder"
								bind:value={formPriorityOrder}
								min="0"
								class="w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
							/>
							<p class="mt-1 text-[10px] text-muted-foreground">Higher = checked first</p>
						</div>

						<div class="col-span-12">
							<label for="description" class="block font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
								DESCRIPTION
							</label>
							<textarea
								id="description"
								name="description"
								bind:value={formDescription}
								rows="2"
								class="w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none"
								placeholder="Brief description of this SLA policy and when it applies"
							></textarea>
						</div>
					</div>

					<!-- Applicability Rules -->
					<div class="border-t border-border pt-6">
						<h3 class="font-mono text-[10px] tracking-widest text-muted-foreground mb-4">APPLICABILITY RULES</h3>
						
						<div class="grid grid-cols-12 gap-4">
							<!-- Customer Types -->
							<div class="col-span-12 md:col-span-6">
								<span class="block font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
									CUSTOMER TYPES
								</span>
								<div class="flex flex-wrap gap-2">
									{#each customerTypeOptions as option}
										<button
											type="button"
											onclick={() => toggleCustomerType(option.value)}
											class="px-3 py-1.5 text-xs font-mono tracking-wider border transition-colors {formCustomerTypes.includes(option.value) ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border text-muted-foreground hover:border-foreground'}"
										>
											{option.label.toUpperCase()}
										</button>
									{/each}
								</div>
								<input type="hidden" name="appliesToCustomerTypes" value={JSON.stringify(formCustomerTypes)} />
								<p class="mt-1 text-[10px] text-muted-foreground">Leave empty to apply to all</p>
							</div>

							<!-- Categories -->
							<div class="col-span-12 md:col-span-6">
								<span class="block font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
									TICKET CATEGORIES
								</span>
								<div class="flex flex-wrap gap-2">
									{#each data.categories as category}
										<button
											type="button"
											onclick={() => toggleCategory(category.slug)}
											class="px-3 py-1.5 text-xs font-mono tracking-wider border transition-colors {formCategories.includes(category.slug) ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border text-muted-foreground hover:border-foreground'}"
										>
											{category.slug.toUpperCase()}
										</button>
									{/each}
								</div>
								<input type="hidden" name="appliesToCategories" value={JSON.stringify(formCategories)} />
								<p class="mt-1 text-[10px] text-muted-foreground">Leave empty to apply to all</p>
							</div>
						</div>
					</div>

					<!-- Response Times -->
					<div class="border-t border-border pt-6">
						<h3 class="font-mono text-[10px] tracking-widest text-muted-foreground mb-4">RESPONSE TIME TARGETS (hours)</h3>
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
						<h3 class="font-mono text-[10px] tracking-widest text-muted-foreground mb-4">RESOLUTION TIME TARGETS (hours)</h3>
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
					<div class="border-t border-border pt-6">
						<h3 class="font-mono text-[10px] tracking-widest text-muted-foreground mb-4">BUSINESS HOURS</h3>
						<div class="space-y-4">
							<label class="flex items-center gap-2 text-sm cursor-pointer">
								<input 
									type="checkbox" 
									bind:checked={formBusinessHoursOnly}
									class="h-4 w-4 rounded border-border"
								/>
								<input type="hidden" name="businessHoursOnly" value={formBusinessHoursOnly.toString()} />
								<span class="text-foreground">Count business hours only (exclude off-hours)</span>
							</label>

							{#if formBusinessHoursOnly}
								<div class="grid grid-cols-12 gap-4 pl-6">
									<div class="col-span-6 md:col-span-3">
										<label for="businessStart" class="block text-xs text-muted-foreground mb-1">Start Time</label>
										<select
											id="businessStart"
											name="businessHoursStart"
											bind:value={formBusinessStart}
											class="w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
										>
											{#each Array(24) as _, i}
												<option value={i}>{i.toString().padStart(2, '0')}:00</option>
											{/each}
										</select>
									</div>
									<div class="col-span-6 md:col-span-3">
										<label for="businessEnd" class="block text-xs text-muted-foreground mb-1">End Time</label>
										<select
											id="businessEnd"
											name="businessHoursEnd"
											bind:value={formBusinessEnd}
											class="w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
										>
											{#each Array(24) as _, i}
												<option value={i}>{i.toString().padStart(2, '0')}:00</option>
											{/each}
										</select>
									</div>
									<div class="col-span-12 md:col-span-6">
										<span class="block text-xs text-muted-foreground mb-1">Business Days</span>
										<div class="flex gap-1">
											{#each dayOptions as day}
												<button
													type="button"
													onclick={() => toggleBusinessDay(day.value)}
													class="w-10 h-8 text-xs font-mono border transition-colors {formBusinessDays.includes(day.value) ? 'bg-primary/10 border-primary text-primary' : 'bg-card border-border text-muted-foreground hover:border-foreground'}"
												>
													{day.label}
												</button>
											{/each}
										</div>
										<input type="hidden" name="businessDays" value={JSON.stringify(formBusinessDays)} />
									</div>
								</div>
							{/if}
						</div>
					</div>

					<!-- Escalation Settings -->
					<div class="border-t border-border pt-6">
						<h3 class="font-mono text-[10px] tracking-widest text-muted-foreground mb-4">ESCALATION</h3>
						<div class="space-y-4">
							<label class="flex items-center gap-2 text-sm cursor-pointer">
								<input 
									type="checkbox" 
									bind:checked={formEscalationEnabled}
									class="h-4 w-4 rounded border-border"
								/>
								<input type="hidden" name="escalationEnabled" value={formEscalationEnabled.toString()} />
								<span class="text-foreground">Enable automatic escalation for overdue tickets</span>
							</label>

							{#if formEscalationEnabled}
								<div class="pl-6">
									<label for="escalationAfterHours" class="block text-xs text-muted-foreground mb-1">
										Escalate after (hours past due)
									</label>
									<input
										type="number"
										id="escalationAfterHours"
										name="escalationAfterHours"
										bind:value={formEscalationAfterHours}
										min="1"
										class="w-32 border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
									/>
								</div>
							{/if}
						</div>
					</div>

					<!-- Options -->
					<div class="border-t border-border pt-6 space-y-3">
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
			<h2 class="font-display text-lg font-bold uppercase">Delete SLA Policy?</h2>
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
