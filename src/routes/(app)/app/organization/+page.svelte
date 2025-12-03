<script lang="ts">
	/**
	 * Organization Management Page
	 * 
	 * Allows users to view and manage their organizations,
	 * or create a new one if they don't have any.
	 */
	import { enhance } from '$app/forms';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Building2, Users, Globe, Mail, Phone, Plus, Crown, UserCircle, Loader2 } from '@lucide/svelte';

	let { data, form } = $props();

	let showCreateForm = $state(false);
	let isCreating = $state(false);

	// Form state
	let orgName = $state('');
	let orgDescription = $state('');
	let orgWebsite = $state('');

	function getRoleBadgeColor(role: string): string {
		switch (role) {
			case 'owner':
				return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
			case 'admin':
				return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
			default:
				return 'bg-muted text-muted-foreground border-border';
		}
	}
</script>

<svelte:head>
	<title>Organization | MostlyWhat Systems</title>
</svelte:head>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold uppercase tracking-wide">Organization</h1>
			<p class="font-body mt-1 text-sm text-muted-foreground">
				Manage your organization and team members
			</p>
		</div>
		{#if data.canCreateOrg && data.organizations.length > 0}
			<Button onclick={() => (showCreateForm = !showCreateForm)} class="font-ui tracking-wider">
				<Plus class="mr-2 h-4 w-4" />
				NEW ORGANIZATION
			</Button>
		{/if}
	</div>

	<!-- Error/Success Messages -->
	{#if form?.error}
		<div class="border border-destructive/50 bg-destructive/10 px-6 py-4">
			<p class="font-mono text-sm text-destructive">{form.error}</p>
		</div>
	{/if}

	{#if form?.success}
		<div class="border border-green-500/50 bg-green-500/10 px-6 py-4">
			<p class="font-mono text-sm text-green-500">Organization created successfully!</p>
		</div>
	{/if}

	<!-- No Organizations - Prompt to create -->
	{#if data.organizations.length === 0}
		<div class="border border-border bg-card">
			<div class="flex flex-col items-center justify-center px-8 py-16 text-center">
				<div class="flex h-16 w-16 items-center justify-center border border-border bg-background">
					<Building2 class="h-8 w-8 text-muted-foreground" />
				</div>
				<h2 class="font-display mt-6 text-xl font-bold uppercase">No Organization Yet</h2>
				<p class="font-body mt-2 max-w-md text-sm text-muted-foreground">
					Create an organization to manage projects as a team, invite members, and access business features.
				</p>
				<Button
					onclick={() => (showCreateForm = true)}
					class="mt-6 font-ui tracking-wider"
				>
					<Plus class="mr-2 h-4 w-4" />
					CREATE ORGANIZATION
				</Button>
			</div>
		</div>
	{/if}

	<!-- Create Organization Form -->
	{#if showCreateForm || (data.organizations.length === 0 && data.canCreateOrg)}
		<div class="border border-border bg-card">
			<div class="border-b border-border px-6 py-4">
				<h2 class="font-display text-lg font-bold uppercase">Create Organization</h2>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Set up a new organization for your team or business
				</p>
			</div>
			<form
				method="POST"
				action="?/createOrganization"
				use:enhance={() => {
					isCreating = true;
					return async ({ update }) => {
						isCreating = false;
						showCreateForm = false;
						orgName = '';
						orgDescription = '';
						orgWebsite = '';
						await update();
					};
				}}
				class="space-y-6 p-6"
			>
				<div class="space-y-2">
					<Label for="name" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						ORGANIZATION NAME *
					</Label>
					<Input
						id="name"
						name="name"
						type="text"
						required
						bind:value={orgName}
						placeholder="Acme Inc."
						class="h-12 border-border bg-background px-4 font-body placeholder:text-muted-foreground/50"
					/>
				</div>

				<div class="space-y-2">
					<Label for="description" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						DESCRIPTION <span class="text-muted-foreground/50">(OPTIONAL)</span>
					</Label>
					<Input
						id="description"
						name="description"
						type="text"
						bind:value={orgDescription}
						placeholder="A brief description of your organization"
						class="h-12 border-border bg-background px-4 font-body placeholder:text-muted-foreground/50"
					/>
				</div>

				<div class="space-y-2">
					<Label for="website" class="font-mono text-[10px] tracking-widest text-muted-foreground">
						WEBSITE <span class="text-muted-foreground/50">(OPTIONAL)</span>
					</Label>
					<Input
						id="website"
						name="website"
						type="url"
						bind:value={orgWebsite}
						placeholder="https://example.com"
						class="h-12 border-border bg-background px-4 font-body placeholder:text-muted-foreground/50"
					/>
				</div>

				<div class="flex justify-end gap-4 border-t border-border pt-6">
					{#if data.organizations.length > 0}
						<Button
							type="button"
							variant="outline"
							onclick={() => (showCreateForm = false)}
							class="font-ui tracking-wider"
						>
							CANCEL
						</Button>
					{/if}
					<Button type="submit" class="font-ui tracking-wider" disabled={isCreating || !orgName.trim()}>
						{#if isCreating}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							CREATING...
						{:else}
							CREATE ORGANIZATION
						{/if}
					</Button>
				</div>
			</form>
		</div>
	{/if}

	<!-- Organizations List -->
	{#if data.organizations.length > 0}
		<div class="space-y-6">
			{#each data.organizations as org (org.id)}
				<div class="border border-border bg-card">
					<!-- Org Header -->
					<div class="flex items-start justify-between border-b border-border px-6 py-4">
						<div class="flex items-center gap-4">
							<div class="flex h-14 w-14 items-center justify-center border border-border bg-background">
								{#if org.logoUrl}
									<img src={org.logoUrl} alt={org.name} class="h-14 w-14 object-cover" />
								{:else}
									<Building2 class="h-6 w-6 text-muted-foreground" />
								{/if}
							</div>
							<div>
								<div class="flex items-center gap-3">
									<h3 class="font-display text-lg font-bold">{org.name}</h3>
									<span class="font-mono text-[10px] tracking-wider text-muted-foreground">{org.orgNumber}</span>
								</div>
								<div class="mt-1 flex items-center gap-3">
									<span class="inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-medium uppercase tracking-wider {getRoleBadgeColor(org.memberRole)}">
										{#if org.memberRole === 'owner'}
											<Crown class="h-3 w-3" />
										{/if}
										{org.memberRole}
									</span>
									<span class="font-body text-sm text-muted-foreground capitalize">{org.customerType}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Org Details -->
					<div class="grid gap-px bg-border md:grid-cols-3">
						{#if org.website}
							<div class="flex items-center gap-3 bg-card px-6 py-4">
								<Globe class="h-4 w-4 text-muted-foreground" />
								<a href={org.website} target="_blank" rel="noopener noreferrer" class="font-body text-sm text-primary hover:underline">
									{org.website.replace(/^https?:\/\//, '')}
								</a>
							</div>
						{/if}
						{#if org.email}
							<div class="flex items-center gap-3 bg-card px-6 py-4">
								<Mail class="h-4 w-4 text-muted-foreground" />
								<span class="font-body text-sm">{org.email}</span>
							</div>
						{/if}
						{#if org.phone}
							<div class="flex items-center gap-3 bg-card px-6 py-4">
								<Phone class="h-4 w-4 text-muted-foreground" />
								<span class="font-body text-sm">{org.phone}</span>
							</div>
						{/if}
					</div>

					<!-- Members Section -->
					<div class="border-t border-border">
						<div class="flex items-center justify-between px-6 py-3">
							<div class="flex items-center gap-2">
								<Users class="h-4 w-4 text-muted-foreground" />
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground">TEAM MEMBERS</span>
							</div>
							<span class="font-mono text-xs text-muted-foreground">{org.memberCount} member{org.memberCount === 1 ? '' : 's'}</span>
						</div>
						<div class="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
							{#each org.members as member (member.id)}
								<div class="flex items-center gap-3 bg-card px-6 py-3">
									<div class="flex h-8 w-8 items-center justify-center border border-border bg-background">
										{#if member.avatarUrl}
											<img src={member.avatarUrl} alt="" class="h-8 w-8 object-cover" />
										{:else}
											<UserCircle class="h-4 w-4 text-muted-foreground" />
										{/if}
									</div>
									<div class="min-w-0 flex-1">
										<p class="font-ui truncate text-sm">
											{member.firstName} {member.lastName}
										</p>
										<p class="font-mono truncate text-[10px] text-muted-foreground">{member.email}</p>
									</div>
									<span class="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{member.role}</span>
								</div>
							{/each}
						</div>
					</div>

					<!-- Actions -->
					{#if org.memberRole === 'owner' || org.memberRole === 'admin'}
						<div class="flex items-center justify-end gap-4 border-t border-border px-6 py-4">
							<Button variant="outline" size="sm" class="font-ui text-xs tracking-wider">
								INVITE MEMBER
							</Button>
							<Button variant="outline" size="sm" class="font-ui text-xs tracking-wider">
								SETTINGS
							</Button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>
