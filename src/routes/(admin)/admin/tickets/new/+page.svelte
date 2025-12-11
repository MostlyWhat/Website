<script lang="ts">
	/**
	 * Admin - Create New Ticket Page
	 */
	import { Send, Loader2, AlertTriangle, Flag } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { RichTextEditor } from '$lib/components/ui/rich-text-editor';
	import { toast } from 'svelte-sonner';
	import CrudCreateLayout from '$lib/components/layout/CrudCreateLayout.svelte';
	import type { PageData } from './$types';

	type FormReturn = {
		error?: string;
		subject?: string;
		description?: string;
		priority?: string;
		category?: string;
		projects?: Array<{ id: string; name: string }>;
		success?: boolean;
		message?: string;
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

	// Handle success toast and redirect
	$effect(() => {
		if (form?.success && form?.message) {
			toast.success(form.message);
			window.scrollTo({ top: 0, behavior: 'smooth' });
			setTimeout(() => goto('/admin/tickets'), 1500);
		}
	});
</script>

<svelte:head>
	<title>New Ticket | Admin</title>
</svelte:head>

<CrudCreateLayout
	title="Create Ticket"
	description="Create a new support ticket on behalf of a user."
	backHref="/admin/tickets"
	errorMessage={form?.error}
	successMessage={form?.success ? form.message : undefined}
>
	{#snippet children()}
		<form
			method="POST"
			action="?/createTicket"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
			class="space-y-8"
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
	{/snippet}

	{#snippet sidebar()}
		<div class="space-y-6">
			<!-- Priority Guide -->
			<div>
				<div class="flex items-center gap-2 mb-3">
					<Flag class="h-4 w-4 text-primary" />
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PRIORITY LEVELS</span>
				</div>
				<div class="space-y-3">
					<div class="space-y-1">
						<p class="font-ui text-xs font-semibold text-foreground">URGENT</p>
						<p class="font-body text-xs text-muted-foreground">Critical issues requiring immediate attention. System down, data loss, security breach.</p>
					</div>
					<div class="space-y-1">
						<p class="font-ui text-xs font-semibold text-foreground">HIGH</p>
						<p class="font-body text-xs text-muted-foreground">Major functionality affected. Work blocked but system operational.</p>
					</div>
					<div class="space-y-1">
						<p class="font-ui text-xs font-semibold text-foreground">MEDIUM</p>
						<p class="font-body text-xs text-muted-foreground">Non-critical issues. Minor functionality impact with workarounds available.</p>
					</div>
					<div class="space-y-1">
						<p class="font-ui text-xs font-semibold text-foreground">LOW</p>
						<p class="font-body text-xs text-muted-foreground">Cosmetic issues, questions, or minor enhancements.</p>
					</div>
				</div>
			</div>

			<!-- Category Guide -->
			<div class="border-t border-border pt-6">
				<div class="flex items-center gap-2 mb-3">
					<AlertTriangle class="h-4 w-4 text-primary" />
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CATEGORIES</span>
				</div>
				<ul class="font-body space-y-2 text-xs text-muted-foreground">
					<li><strong>General:</strong> Questions and general inquiries</li>
					<li><strong>Technical:</strong> Technical issues and errors</li>
					<li><strong>Billing:</strong> Payment and billing issues</li>
					<li><strong>Feature:</strong> Feature requests and suggestions</li>
					<li><strong>Bug:</strong> Software bugs and defects</li>
				</ul>
			</div>
		</div>
	{/snippet}
</CrudCreateLayout>
