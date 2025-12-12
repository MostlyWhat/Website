<script lang="ts">
	/**
	 * Admin New Project Page - Refactored with standardized components
	 */
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { FolderKanban, Save, Loader2, Building2, User, Calendar, DollarSign } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { CreatePageLayout } from '$lib/components/layout';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { TextField, TextareaField } from '$lib/components/ui/form-fields';
	import { NativeSelect, NativeSelectOption } from '$lib/components/ui/native-select';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';

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

	$effect(() => {
		if (form?.success && form?.message) {
			toast.success(form.message);
			setTimeout(() => goto('/admin/projects'), 1500);
		}
	});
</script>

<svelte:head>
	<title>New Project | Admin</title>
</svelte:head>

<CreatePageLayout
	title="New Project"
	description="Create a new project for an organization"
	backHref="/admin/projects"
	breadcrumbs={[
		{ label: 'Admin', href: '/admin' },
		{ label: 'Projects', href: '/admin/projects' },
		{ label: 'New', href: '/admin/projects/new' }
	]}
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
			class="space-y-6"
		>
			<Card.Root>
				<Card.Header>
					<div class="flex items-center gap-3">
						<FolderKanban class="h-5 w-5 text-primary" />
						<div>
							<Card.Title>Basic Information</Card.Title>
							<Card.Description>Enter the project details</Card.Description>
						</div>
					</div>
				</Card.Header>
				<Card.Content class="space-y-4">
					<TextField
						name="name"
						label="Project Name"
						bind:value={name}
						placeholder="e.g., Website Redesign"
						required
					/>
					<TextareaField
						name="description"
						label="Description"
						bind:value={description}
						placeholder="Describe the project scope..."
						rows={4}
					/>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<div class="flex items-center gap-3">
						<DollarSign class="h-5 w-5 text-primary" />
						<Card.Title>Budget</Card.Title>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="space-y-2">
						<Label for="estimatedBudget">Estimated Budget</Label>
						<Input
							id="estimatedBudget"
							name="estimatedBudget"
							type="number"
							step="0.01"
							bind:value={estimatedBudget}
							placeholder="0.00"
						/>
					</div>
				</Card.Content>
			</Card.Root>

			<div class="flex gap-4">
				<Button type="submit" disabled={isSubmitting}>
					{#if isSubmitting}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Creating...
					{:else}
						<Save class="mr-2 h-4 w-4" />
						Create
					{/if}
				</Button>
				<Button href="/admin/projects" variant="outline">Cancel</Button>
			</div>
		</form>
	{/snippet}

	{#snippet sidebar()}
		<div class="space-y-6">
			<Card.Root>
				<Card.Header>
					<div class="flex items-center gap-3">
						<Building2 class="h-5 w-5 text-primary" />
						<Card.Title>Organization</Card.Title>
					</div>
				</Card.Header>
				<Card.Content>
					<div class="space-y-2">
						<Label for="organizationId">Organization *</Label>
						<NativeSelect id="organizationId" name="organizationId" bind:value={organizationId} required>
							<NativeSelectOption value="">Select...</NativeSelectOption>
							{#each data.organizations as org}
								<NativeSelectOption value={org.id}>{org.name}</NativeSelectOption>
							{/each}
						</NativeSelect>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Status & Assignment</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-4">
					<div class="space-y-2">
						<Label for="status">Status</Label>
						<NativeSelect id="status" name="status" bind:value={status}>
							{#each statusOptions as option}
								<NativeSelectOption value={option.value}>{option.label}</NativeSelectOption>
							{/each}
						</NativeSelect>
					</div>
					<div class="space-y-2">
						<Label for="assignedToId">Assigned To</Label>
						<NativeSelect id="assignedToId" name="assignedToId" bind:value={assignedToId}>
							<NativeSelectOption value="">Unassigned</NativeSelectOption>
							{#each data.staff as member}
								<NativeSelectOption value={member.id}>
									{member.displayName || 'Unknown'}
								</NativeSelectOption>
							{/each}
						</NativeSelect>
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Calendar class="h-5 w-5 text-primary" />
					<Card.Title>Timeline</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-4">
					<div class="space-y-2">
						<Label for="startDate">Start Date</Label>
						<Input id="startDate" name="startDate" type="date" bind:value={startDate} />
					</div>
					<div class="space-y-2">
						<Label for="endDate">End Date</Label>
						<Input id="endDate" name="endDate" type="date" bind:value={endDate} />
					</div>
				</Card.Content>
			</Card.Root>

			<Card.Root>
				<Card.Header>
					<Card.Title>Currency</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="space-y-2">
						<Label for="currency">Currency</Label>
						<NativeSelect id="currency" name="currency" bind:value={currency}>
							{#each currencyOptions as curr}
								<NativeSelectOption value={curr}>{curr}</NativeSelectOption>
							{/each}
						</NativeSelect>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{/snippet}
</CreatePageLayout>
