<script lang="ts">
	/**
	 * Admin New Project Page
	 * 
	 * Create a new project for an organization.
	 */
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { 
		FolderKanban, ArrowLeft, Save, Loader2, Building2, User,
		Calendar, DollarSign, AlertCircle
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card';
	import { toast } from 'svelte-sonner';

	let { data, form } = $props();
	
	let isSubmitting = $state(false);
	let name = $state('');
	let description = $state('');
	let organizationId = $state('');
	let assignedToId = $state('');
	let status = $state('draft');
	let startDate = $state('');
	let endDate = $state('');
	let estimatedBudget = $state('');
	let currency = $state('USD');

	const statusOptions = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'proposal_sent', label: 'Proposal Sent' },
		{ value: 'proposal_accepted', label: 'Proposal Accepted' },
		{ value: 'in_progress', label: 'In Progress' },
		{ value: 'on_hold', label: 'On Hold' }
	];

	const currencyOptions = ['USD', 'EUR', 'GBP', 'THB', 'JPY'];

	// Handle success toast and redirect
	$effect(() => {
		if (form?.success && form?.message) {
			toast.success(form.message);
			window.scrollTo({ top: 0, behavior: 'smooth' });
			setTimeout(() => goto('/admin/projects'), 1500);
		}
	});
</script>

<svelte:head>
	<title>New Project | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div class="flex items-center gap-4">
				<Button href="/admin/projects" variant="outline" size="sm">
					<ArrowLeft class="h-4 w-4" />
				</Button>
				<div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// CREATE NEW</span>
					<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">New Project</h1>
				</div>
			</div>
		</div>
	</section>

	<!-- Form Section -->
	<section class="px-6 py-8 md:px-12 lg:px-16">
		<div class="max-w-3xl">
			{#if form?.error}
				<div class="mb-6 flex items-center gap-2 border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-500">
					<AlertCircle class="h-4 w-4" />
					<span class="text-sm">{form.error}</span>
				</div>
			{/if}

			<form
				method="POST"
				use:enhance={() => {
					isSubmitting = true;
					return async ({ update }) => {
						isSubmitting = false;
						await update();
					};
				}}
			>
				<div class="space-y-8">
					<!-- Basic Information -->
					<Card.Root class="border-border">
						<Card.Header>
							<Card.Title class="font-display uppercase flex items-center gap-2">
								<FolderKanban class="h-4 w-4" />
								Basic Information
							</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-6">
							<div>
								<label for="name" class="font-mono text-[10px] tracking-widest text-muted-foreground">
									PROJECT NAME *
								</label>
								<Input
									id="name"
									name="name"
									type="text"
									bind:value={name}
									placeholder="e.g., Website Redesign"
									required
									class="mt-2"
								/>
							</div>

							<div>
								<label for="description" class="font-mono text-[10px] tracking-widest text-muted-foreground">
									DESCRIPTION
								</label>
								<Textarea
									id="description"
									name="description"
									bind:value={description}
									placeholder="Brief description of the project scope and goals..."
									rows={4}
									class="mt-2"
								/>
							</div>

							<div>
								<label for="organizationId" class="font-mono text-[10px] tracking-widest text-muted-foreground flex items-center gap-2">
									<Building2 class="h-3 w-3" />
									ORGANIZATION *
								</label>
								<select
									id="organizationId"
									name="organizationId"
									bind:value={organizationId}
									required
									class="mt-2 w-full px-4 py-2 border border-border bg-background text-foreground focus:border-primary focus:outline-none"
								>
									<option value="">Select organization...</option>
									{#each data.organizations as org}
										<option value={org.id}>{org.name}</option>
									{/each}
								</select>
							</div>

							<div>
								<label for="status" class="font-mono text-[10px] tracking-widest text-muted-foreground">
									STATUS
								</label>
								<select
									id="status"
									name="status"
									bind:value={status}
									class="mt-2 w-full px-4 py-2 border border-border bg-background text-foreground focus:border-primary focus:outline-none"
								>
									{#each statusOptions as option}
										<option value={option.value}>{option.label}</option>
									{/each}
								</select>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Assignment -->
					<Card.Root class="border-border">
						<Card.Header>
							<Card.Title class="font-display uppercase flex items-center gap-2">
								<User class="h-4 w-4" />
								Assignment
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<div>
								<label for="assignedToId" class="font-mono text-[10px] tracking-widest text-muted-foreground">
									ASSIGNED TO
								</label>
								<select
									id="assignedToId"
									name="assignedToId"
									bind:value={assignedToId}
									class="mt-2 w-full px-4 py-2 border border-border bg-background text-foreground focus:border-primary focus:outline-none"
								>
									<option value="">Unassigned</option>
									{#each data.staff as member}
										<option value={member.id}>
											{member.displayName || `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim() || 'Unknown'}
											({member.role})
										</option>
									{/each}
								</select>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Timeline -->
					<Card.Root class="border-border">
						<Card.Header>
							<Card.Title class="font-display uppercase flex items-center gap-2">
								<Calendar class="h-4 w-4" />
								Timeline
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label for="startDate" class="font-mono text-[10px] tracking-widest text-muted-foreground">
										START DATE
									</label>
									<Input
										id="startDate"
										name="startDate"
										type="date"
										bind:value={startDate}
										class="mt-2"
									/>
								</div>
								<div>
									<label for="endDate" class="font-mono text-[10px] tracking-widest text-muted-foreground">
										END DATE
									</label>
									<Input
										id="endDate"
										name="endDate"
										type="date"
										bind:value={endDate}
										class="mt-2"
									/>
								</div>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Budget -->
					<Card.Root class="border-border">
						<Card.Header>
							<Card.Title class="font-display uppercase flex items-center gap-2">
								<DollarSign class="h-4 w-4" />
								Budget
							</Card.Title>
						</Card.Header>
						<Card.Content>
							<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label for="estimatedBudget" class="font-mono text-[10px] tracking-widest text-muted-foreground">
										ESTIMATED BUDGET
									</label>
									<Input
										id="estimatedBudget"
										name="estimatedBudget"
										type="number"
										step="0.01"
										min="0"
										bind:value={estimatedBudget}
										placeholder="0.00"
										class="mt-2"
									/>
								</div>
								<div>
									<label for="currency" class="font-mono text-[10px] tracking-widest text-muted-foreground">
										CURRENCY
									</label>
									<select
										id="currency"
										name="currency"
										bind:value={currency}
										class="mt-2 w-full px-4 py-2 border border-border bg-background text-foreground focus:border-primary focus:outline-none"
									>
										{#each currencyOptions as curr}
											<option value={curr}>{curr}</option>
										{/each}
									</select>
								</div>
							</div>
						</Card.Content>
					</Card.Root>

					<!-- Actions -->
					<div class="flex items-center gap-4">
						<Button type="submit" disabled={isSubmitting} size="lg">
							{#if isSubmitting}
								<Loader2 class="mr-2 h-4 w-4 animate-spin" />
								Creating...
							{:else}
								<Save class="mr-2 h-4 w-4" />
								Create Project
							{/if}
						</Button>
						<Button href="/admin/projects" variant="outline" size="lg">
							Cancel
						</Button>
					</div>
				</div>
			</form>
		</div>
	</section>
</div>
