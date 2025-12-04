<script lang="ts">
	/**
	 * Organization Management Page
	 * 
	 * Allows users to view and manage their organizations,
	 * create a new one, or join with an invite code.
	 */
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Building2, Users, Globe, Mail, Phone, Plus, Crown, UserCircle, Loader2, Link2, Settings, UserPlus, RefreshCw } from '@lucide/svelte';

	let { data, form } = $props();

	let activeTab = $state<'create' | 'join' | null>(null);
	let isCreating = $state(false);
	let isJoining = $state(false);
	let isRefreshing = $state(false);

	// Form state
	let orgName = $state('');
	let orgDescription = $state('');
	let orgWebsite = $state('');
	let inviteCode = $state('');

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

	async function handleJoinWithCode() {
		if (!inviteCode.trim()) return;
		isJoining = true;
		// Navigate to the join page with the code
		await goto(`/join/${inviteCode.trim()}`);
	}

	async function handleRefresh() {
		isRefreshing = true;
		await invalidateAll();
		isRefreshing = false;
	}
</script>

<svelte:head>
	<title>Organization | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// TEAM MANAGEMENT</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Organization</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Manage your organization, team members, and settings.
				</p>
			</div>
			<div class="flex items-center gap-3">
				{#if data.organizations.length > 0}
					<Button onclick={handleRefresh} variant="outline" size="sm" class="font-ui text-xs tracking-wider" disabled={isRefreshing}>
						{#if isRefreshing}
							<RefreshCw class="mr-2 h-4 w-4 animate-spin" />
						{:else}
							<RefreshCw class="mr-2 h-4 w-4" />
						{/if}
						REFRESH
					</Button>
				{/if}
				{#if data.canCreateOrg && data.organizations.length > 0}
					<Button onclick={() => (activeTab = activeTab === 'create' ? null : 'create')} size="sm" class="font-ui text-xs tracking-wider">
						<Plus class="mr-2 h-4 w-4" />
						NEW ORGANIZATION
					</Button>
				{/if}
			</div>
		</div>
	</section>

	<!-- Content -->
	<section class="border-b border-border bg-background">
		<div class="px-6 py-8 md:px-12 lg:px-16 space-y-8">
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

			<!-- No Organizations - Prompt to create or join -->
			{#if data.organizations.length === 0}
				<div class="border border-border bg-card">
					<div class="flex flex-col items-center justify-center px-8 py-12 text-center">
						<div class="flex h-16 w-16 items-center justify-center border border-border bg-background">
							<Building2 class="h-8 w-8 text-muted-foreground" />
						</div>
						<h2 class="font-display mt-6 text-xl font-bold uppercase">No Organization Yet</h2>
						<p class="font-body mt-2 max-w-md text-sm text-muted-foreground">
							Create a new organization or join an existing one with an invite code.
						</p>
						
						<!-- Action Tabs -->
						<div class="mt-8 flex items-center gap-4">
							<Button
								onclick={() => (activeTab = 'create')}
								variant={activeTab === 'create' ? 'default' : 'outline'}
								class="font-ui tracking-wider"
							>
								<Plus class="mr-2 h-4 w-4" />
								CREATE NEW
							</Button>
							<Button
								onclick={() => (activeTab = 'join')}
								variant={activeTab === 'join' ? 'default' : 'outline'}
								class="font-ui tracking-wider"
							>
								<Link2 class="mr-2 h-4 w-4" />
								JOIN WITH CODE
							</Button>
						</div>
					</div>
				</div>
			{/if}

			<!-- Join with Invite Code Form -->
			{#if activeTab === 'join'}
				<div class="border border-border bg-card">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-display text-lg font-bold uppercase">Join Organization</h2>
						<p class="font-body mt-1 text-sm text-muted-foreground">
							Enter an invite code to join an existing organization
						</p>
					</div>
					<div class="space-y-6 p-6">
						<div class="space-y-2">
							<Label for="inviteCode" class="font-mono text-[10px] tracking-widest text-muted-foreground">
								INVITE CODE *
							</Label>
							<Input
								id="inviteCode"
								type="text"
								bind:value={inviteCode}
								placeholder="Enter invite code (e.g., ABC123)"
								class="h-12 border-border bg-background px-4 font-mono placeholder:text-muted-foreground/50"
							/>
							<p class="font-body text-xs text-muted-foreground">
								Ask your organization admin for an invite code or use the full invite link.
							</p>
						</div>

						<div class="flex justify-end gap-4 border-t border-border pt-6">
							{#if data.organizations.length > 0}
								<Button
									type="button"
									variant="outline"
									onclick={() => (activeTab = null)}
									class="font-ui tracking-wider"
								>
									CANCEL
								</Button>
							{/if}
							<Button onclick={handleJoinWithCode} class="font-ui tracking-wider" disabled={isJoining || !inviteCode.trim()}>
								{#if isJoining}
									<Loader2 class="mr-2 h-4 w-4 animate-spin" />
									JOINING...
								{:else}
									<Link2 class="mr-2 h-4 w-4" />
									JOIN ORGANIZATION
								{/if}
							</Button>
						</div>
					</div>
				</div>
			{/if}

	<!-- Create Organization Form -->
	{#if activeTab === 'create' && data.canCreateOrg}
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
					return async ({ result, update }) => {
						if (result.type === 'success') {
							activeTab = null;
							orgName = '';
							orgDescription = '';
							orgWebsite = '';
						}
						isCreating = false;
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
							onclick={() => (activeTab = null)}
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

			{#if isCreating}
				<div class="border-t border-border bg-muted/30 px-6 py-4">
					<div class="flex items-center gap-3">
						<Loader2 class="h-4 w-4 animate-spin text-primary" />
						<p class="font-body text-sm text-muted-foreground">
							Setting up your organization... This may take a moment.
						</p>
					</div>
				</div>
			{/if}
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
							<Button href="/app/settings/organizations/{org.id}?tab=invites" variant="outline" size="sm" class="font-ui text-xs tracking-wider">
								<UserPlus class="mr-2 h-3 w-3" />
								INVITE MEMBER
							</Button>
							<Button href="/app/settings/organizations/{org.id}" variant="outline" size="sm" class="font-ui text-xs tracking-wider">
								<Settings class="mr-2 h-3 w-3" />
								SETTINGS
							</Button>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}
		</div>
	</section>
</div>
