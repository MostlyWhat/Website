<script lang="ts">
	/**
	 * Admin - Create New Ticket Page
	 */
	import { ArrowLeft, Send, Loader2, AlertCircle } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { RichTextEditor } from '$lib/components/ui/rich-text-editor';
	import type { PageData } from './$types';

	type FormReturn = {
		error?: string;
		subject?: string;
		description?: string;
		priority?: string;
		category?: string;
		projects?: Array<{ id: string; name: string }>;
	} | null;

	type User = { id: string; displayName: string | null; email: string; role: string | null };
	type Project = { id: string; name: string; organizationId: string };

	let { data, form }: { data: PageData & { allProjects?: Project[] }; form: FormReturn } = $props();
	
	let loading = $state(false);
	let subject = $state(form?.subject || '');
	let description = $state(form?.description || '');
	let priority = $state(form?.priority || 'medium');
	let category = $state(form?.category || 'general');
	let organizationId = $state('');
	let createdById = $state('');
	let assignedToId = $state('');
	let projectId = $state('');

	// Filter projects based on selected organization
	const filteredProjects = $derived(
		(data.allProjects || []).filter((p: Project) => p.organizationId === organizationId)
	);

	// Reset project when organization changes
	$effect(() => {
		if (organizationId) {
			projectId = '';
		}
	});
</script>

<svelte:head>
	<title>New Ticket | Admin</title>
</svelte:head>

<div class="min-h-screen bg-background">
	<!-- Header -->
	<header class="border-b border-border bg-background px-6 py-6 lg:px-12">
		<a
			href="/admin/tickets"
			class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			<span class="font-mono text-[10px] tracking-widest">BACK TO TICKETS</span>
		</a>
		<h1 class="font-display mt-6 text-2xl font-bold uppercase md:text-3xl">Create Ticket</h1>
		<p class="font-body mt-2 text-muted-foreground">
			Create a new support ticket on behalf of a user.
		</p>
	</header>

	<!-- Error Messages -->
	{#if form?.error}
		<div class="border-b border-red-500/20 bg-red-500/5 px-6 py-4 lg:px-12">
			<div class="flex items-center gap-3">
				<AlertCircle class="h-5 w-5 text-red-500" />
				<p class="font-body text-sm text-red-500">{form.error}</p>
			</div>
		</div>
	{/if}

	<!-- Form -->
	<main class="px-6 py-8 lg:px-12">
		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
			class="max-w-4xl space-y-8"
		>
			<!-- Subject -->
			<div class="space-y-2">
				<label for="subject" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					SUBJECT *
				</label>
				<input
					type="text"
					id="subject"
					name="subject"
					bind:value={subject}
					required
					minlength="5"
					placeholder="Brief description of the issue"
					class="font-body w-full border-b border-border bg-transparent py-3 text-foreground placeholder:text-muted-foreground/50 focus:border-primary focus:outline-none"
				/>
			</div>

			<!-- Description -->
			<div class="space-y-2">
				<label for="description" class="font-mono text-[10px] tracking-widest text-muted-foreground">
					DESCRIPTION *
				</label>
				<input type="hidden" name="description" bind:value={description} />
				<RichTextEditor
					bind:value={description}
					placeholder="Detailed description of the issue..."
					rows={8}
				/>
			</div>

			<!-- Organization & Project Selection -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<label for="organizationId" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						ORGANIZATION *
					</label>
					<select
						id="organizationId"
						name="organizationId"
						bind:value={organizationId}
						required
						class="font-body w-full border-b border-border bg-transparent py-3 text-foreground focus:border-primary focus:outline-none"
					>
						<option value="">Select an organization</option>
						{#each data.organizations as org}
							<option value={org.id}>{org.name}</option>
						{/each}
					</select>
				</div>

				<div class="space-y-2">
					<label for="projectId" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						PROJECT
					</label>
					<select
						id="projectId"
						name="projectId"
						bind:value={projectId}
						disabled={!organizationId}
						class="font-body w-full border-b border-border bg-transparent py-3 text-foreground focus:border-primary focus:outline-none disabled:opacity-50"
					>
						<option value="">No project</option>
						{#each filteredProjects as project}
							<option value={project.id}>{project.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Created By & Assigned To -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<label for="createdById" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						CREATED BY
					</label>
					<select
						id="createdById"
						name="createdById"
						bind:value={createdById}
						class="font-body w-full border-b border-border bg-transparent py-3 text-foreground focus:border-primary focus:outline-none"
					>
						<option value="">Current user ({data.profile.displayName || data.profile.email})</option>
						{#each data.users as user}
							<option value={user.id}>{user.displayName || user.email}</option>
						{/each}
					</select>
				</div>

				<div class="space-y-2">
					<label for="assignedToId" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						ASSIGNED TO
					</label>
					<select
						id="assignedToId"
						name="assignedToId"
						bind:value={assignedToId}
						class="font-body w-full border-b border-border bg-transparent py-3 text-foreground focus:border-primary focus:outline-none"
					>
						<option value="">Unassigned</option>
						{#each data.users.filter((u: User) => ['admin', 'super_admin', 'staff'].includes(u.role ?? '')) as user}
							<option value={user.id}>{user.displayName || user.email}</option>
						{/each}
					</select>
				</div>
			</div>

			<!-- Priority & Category -->
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<label for="priority" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						PRIORITY
					</label>
					<select
						id="priority"
						name="priority"
						bind:value={priority}
						class="font-body w-full border-b border-border bg-transparent py-3 text-foreground focus:border-primary focus:outline-none"
					>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
						<option value="urgent">Urgent</option>
					</select>
				</div>

				<div class="space-y-2">
					<label for="category" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						CATEGORY
					</label>
					<select
						id="category"
						name="category"
						bind:value={category}
						class="font-body w-full border-b border-border bg-transparent py-3 text-foreground focus:border-primary focus:outline-none"
					>
						<option value="general">General</option>
						<option value="technical">Technical</option>
						<option value="billing">Billing</option>
						<option value="feature">Feature Request</option>
						<option value="bug">Bug Report</option>
					</select>
				</div>
			</div>

			<!-- Submit -->
			<div class="flex justify-end gap-4 border-t border-border pt-8">
				<Button href="/admin/tickets" variant="outline" class="font-ui text-xs tracking-wider">
					CANCEL
				</Button>
				<Button type="submit" disabled={loading} class="font-ui text-xs tracking-wider">
					{#if loading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						CREATING...
					{:else}
						<Send class="mr-2 h-4 w-4" />
						CREATE TICKET
					{/if}
				</Button>
			</div>
		</form>
	</main>
</div>
