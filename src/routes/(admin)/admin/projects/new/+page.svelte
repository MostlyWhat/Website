<script lang="ts">
	/**
	 * Admin New Project Page
	 * 
	 * Create a new project for an organization.
	 */
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { 
		FolderKanban, Save, Loader2, Building2, User,
		Calendar, DollarSign, AlertCircle
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { toast } from 'svelte-sonner';
	import CrudCreateLayout from '$lib/components/layout/CrudCreateLayout.svelte';

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

<CrudCreateLayout
	title="New Project"
	description="Create a new project for an organization."
	backHref="/admin/projects"
	errorMessage={form?.error}
	successMessage={form?.success ? form.message : undefined}
>
	{#snippet children()}
		<form
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					isSubmitting = false;
					await update();
				};
			}}
			class="space-y-8"
		>
			<!-- Basic Information -->
			<div class="space-y-6">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<FolderKanban class="h-5 w-5 text-primary" />
					</div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">BASIC INFORMATION</span>
				</div>

				<div class="space-y-6">
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
							class="mt-2 h-12 border-border bg-card"
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
						class="mt-2 border-border bg-card"
					/>
				</div>
				</div>
			</div>			<!-- Budget -->
			<div class="space-y-6 border-t border-border pt-8">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<DollarSign class="h-5 w-5 text-primary" />
					</div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">BUDGET</span>
				</div>

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
						class="mt-2 h-12 border-border bg-card"
					/>
				</div>
			</div>

			<!-- Actions -->
			<div class="flex items-center gap-4 border-t border-border pt-8">
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
		</form>
	{/snippet}

	{#snippet sidebar()}
		<div class="space-y-6">
			<!-- Organization -->
			<div>
				<label for="organizationId" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					ORGANIZATION *
				</label>
				<select
					id="organizationId"
					name="organizationId"
					bind:value={organizationId}
					required
					class="mt-2 w-full h-10 px-3 text-sm border border-border bg-background text-foreground focus:border-primary focus:outline-none"
				>
					<option value="">Select organization...</option>
					{#each data.organizations as org}
						<option value={org.id}>{org.name}</option>
					{/each}
				</select>
			</div>

			<!-- Status -->
			<div>
				<label for="status" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					STATUS
				</label>
				<select
					id="status"
					name="status"
					bind:value={status}
					class="mt-2 w-full h-10 px-3 text-sm border border-border bg-background text-foreground focus:border-primary focus:outline-none"
				>
					{#each statusOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</div>

			<!-- Assigned To -->
			<div>
				<label for="assignedToId" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					ASSIGNED TO
				</label>
				<select
					id="assignedToId"
					name="assignedToId"
					bind:value={assignedToId}
					class="mt-2 w-full h-10 px-3 text-sm border border-border bg-background text-foreground focus:border-primary focus:outline-none"
				>
					<option value="">Unassigned</option>
					{#each data.staff as member}
						<option value={member.id}>
							{member.displayName || `${member.firstName ?? ''} ${member.lastName ?? ''}`.trim() || 'Unknown'}
						</option>
					{/each}
				</select>
			</div>

			<!-- Timeline -->
			<div class="border-t border-border pt-6">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground mb-3 block">TIMELINE</span>
				<div class="space-y-4">
					<div>
						<label for="startDate" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							START DATE
						</label>
						<Input
							id="startDate"
							name="startDate"
							type="date"
							bind:value={startDate}
							class="mt-2 h-10 text-sm border-border bg-background"
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
							class="mt-2 h-10 text-sm border-border bg-background"
						/>
					</div>
				</div>
			</div>

			<!-- Currency -->
			<div class="border-t border-border pt-6">
				<label for="currency" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					CURRENCY
				</label>
				<select
					id="currency"
					name="currency"
					bind:value={currency}
					class="mt-2 w-full h-10 px-3 text-sm border border-border bg-background text-foreground focus:border-primary focus:outline-none"
				>
					{#each currencyOptions as curr}
						<option value={curr}>{curr}</option>
					{/each}
				</select>
			</div>
		</div>
	{/snippet}
</CrudCreateLayout>
