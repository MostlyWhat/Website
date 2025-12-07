<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import { enhance } from '$app/forms';
	import { invalidateAll, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import {
		Building2, Users, FolderKanban, Ticket, Settings, UserPlus, Link2, Plus,
		Crown, Shield, User, Loader2, AlertCircle, Check, RefreshCw, ChevronRight,
		Copy, Trash2, Mail, Phone, Globe, LogOut, AlertTriangle
	} from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	// Dialog states
	let showCreateDialog = $state(false);
	let showJoinDialog = $state(false);
	let showInviteDialog = $state(false);
	let showMembersDialog = $state(false);
	let showSettingsDialog = $state(false);
	let showDeleteDialog = $state(false);

	// Form states
	let isCreating = $state(false);
	let isJoining = $state(false);
	let inviteCode = $state('');
	let orgName = $state('');
	let orgDescription = $state('');
	let orgWebsite = $state('');

	// Invite form
	let inviteEmail = $state('');
	let inviteRole = $state<'member' | 'admin'>('member');
	let inviteMaxUses = $state(1);
	let inviteLoading = $state(false);

	// Settings form
	let editName = $state('');
	let editEmail = $state('');
	let editPhone = $state('');
	let editWebsite = $state('');
	let loadingAction = $state<string | null>(null);

	// Delete confirmation
	let deleteConfirmName = $state('');
	let isDeleting = $state(false);

	// Copied state
	let copiedCode = $state<string | null>(null);

	// Derived
	let selectedOrg = $derived(data.selectedOrg);
	let isOwner = $derived(selectedOrg?.memberRole === 'owner');
	let isAdmin = $derived(selectedOrg?.memberRole === 'owner' || selectedOrg?.memberRole === 'admin');

	// Helpers
	function getRoleBadgeColor(role: string) {
		switch (role) {
			case 'owner': return 'border-amber-500/50 bg-amber-500/10 text-amber-500';
			case 'admin': return 'border-blue-500/50 bg-blue-500/10 text-blue-500';
			default: return 'border-border bg-muted/50 text-muted-foreground';
		}
	}

	function getRoleIcon(role: string) {
		switch (role) {
			case 'owner': return Crown;
			case 'admin': return Shield;
			default: return User;
		}
	}

	function formatDate(date: Date | null | string | undefined) {
		if (!date) return 'Never';
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}

	async function handleJoinWithCode() {
		if (!inviteCode.trim()) return;
		isJoining = true;
		try {
			await goto(`/join/${inviteCode.trim()}`);
		} catch {
			isJoining = false;
		}
	}

	async function copyToClipboard(code: string) {
		await navigator.clipboard.writeText(code);
		copiedCode = code;
		setTimeout(() => copiedCode = null, 2000);
	}

	function selectOrganization(orgId: string) {
		const url = new URL($page.url);
		url.searchParams.set('org', orgId);
		goto(url.toString(), { replaceState: true, invalidateAll: true });
	}

	function openSettingsDialog() {
		if (selectedOrg) {
			editName = selectedOrg.name;
			editEmail = selectedOrg.email || '';
			editPhone = selectedOrg.phone || '';
			editWebsite = selectedOrg.website || '';
		}
		showSettingsDialog = true;
	}
</script>

<svelte:head>
	<title>Organization — MostlyWhat Portal</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex items-start justify-between gap-4">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ORGANIZATION</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">
					{selectedOrg?.name ?? 'Your Organization'}
				</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Manage your organization, team members, and invites.
				</p>
			</div>
			<div class="flex items-center gap-2">
				<Button variant="outline" size="sm" onclick={() => invalidateAll()}>
					<RefreshCw class="h-4 w-4" />
				</Button>
				<Button variant="outline" size="sm" onclick={() => showJoinDialog = true}>
					<Link2 class="mr-2 h-4 w-4" />
					JOIN
				</Button>
				{#if data.canCreateOrg}
					<Button size="sm" onclick={() => showCreateDialog = true}>
						<Plus class="mr-2 h-4 w-4" />
						NEW
					</Button>
				{/if}
			</div>
		</div>
	</section>

	<!-- Messages -->
	{#if form?.error}
		<div class="border-b border-destructive/50 bg-destructive/10 px-6 py-3 md:px-12 lg:px-16">
			<div class="flex items-center gap-3">
				<AlertCircle class="h-5 w-5 text-destructive flex-shrink-0" />
				<p class="font-mono text-sm text-destructive">{form.error}</p>
			</div>
		</div>
	{/if}
	{#if form?.success}
		<div class="border-b border-green-500/50 bg-green-500/10 px-6 py-3 md:px-12 lg:px-16">
			<div class="flex items-center gap-3">
				<Check class="h-5 w-5 text-green-500 flex-shrink-0" />
				<p class="font-mono text-sm text-green-500">{form.message || 'Operation successful!'}</p>
			</div>
		</div>
	{/if}

	<!-- Content -->
	<section class="px-6 py-8 md:px-12 lg:px-16">
		{#if data.organizations.length === 0}
			<!-- No Organization State -->
			<div class="border border-border bg-card">
				<div class="flex flex-col items-center justify-center px-8 py-16 text-center">
					<div class="flex h-20 w-20 items-center justify-center border border-border bg-background">
						<Building2 class="h-10 w-10 text-muted-foreground" />
					</div>
					<h2 class="font-display mt-8 text-2xl font-bold uppercase">No Organization Yet</h2>
					<p class="font-body mt-3 max-w-md text-sm text-muted-foreground">
						Create a new organization to manage your team, projects, and support tickets. Or join an existing one with an invite code.
					</p>
					<div class="mt-8 flex items-center gap-4">
						<Button onclick={() => showCreateDialog = true} size="lg" class="font-ui tracking-wider">
							<Plus class="mr-2 h-4 w-4" />
							CREATE ORGANIZATION
						</Button>
						<Button onclick={() => showJoinDialog = true} variant="outline" size="lg" class="font-ui tracking-wider">
							<Link2 class="mr-2 h-4 w-4" />
							JOIN WITH CODE
						</Button>
					</div>
				</div>
			</div>
		{:else}
			<div class="flex flex-col gap-8 lg:flex-row">
				<!-- Sidebar: Organization Selector -->
				{#if data.organizations.length > 1}
					<div class="lg:w-72 flex-shrink-0">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">YOUR ORGANIZATIONS</span>
						<div class="mt-3 space-y-2">
							{#each data.organizations as org (org.id)}
								<button
									onclick={() => selectOrganization(org.id)}
									class="w-full flex items-center gap-3 border px-4 py-3 text-left transition-colors {selectedOrg?.id === org.id ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}"
								>
									<div class="flex h-10 w-10 items-center justify-center border border-border bg-background flex-shrink-0">
										{#if org.logoUrl}
											<img src={org.logoUrl} alt="" class="h-10 w-10 object-cover" />
										{:else}
											<Building2 class="h-4 w-4 text-muted-foreground" />
										{/if}
									</div>
									<div class="min-w-0 flex-1">
										<p class="font-ui text-sm font-medium truncate">{org.name}</p>
										<p class="font-mono text-[10px] text-muted-foreground">{org.memberCount} members</p>
									</div>
									{#if org.memberRole === 'owner'}
										<Crown class="h-4 w-4 text-amber-500 flex-shrink-0" />
									{:else if org.memberRole === 'admin'}
										<Shield class="h-4 w-4 text-blue-500 flex-shrink-0" />
									{/if}
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Main Content -->
				{#if selectedOrg}
					<div class="flex-1 min-w-0 space-y-6">
						<!-- Organization Header Card -->
						<div class="border border-border bg-card p-6">
							<div class="flex items-start gap-4">
								<div class="flex h-16 w-16 items-center justify-center border border-border bg-background flex-shrink-0">
									{#if selectedOrg.logoUrl}
										<img src={selectedOrg.logoUrl} alt="" class="h-16 w-16 object-cover" />
									{:else}
										<Building2 class="h-8 w-8 text-muted-foreground" />
									{/if}
								</div>
								<div class="flex-1 min-w-0">
									<div class="flex items-start justify-between gap-4">
										<div>
											<h2 class="font-display text-xl font-bold">{selectedOrg.name}</h2>
											<p class="font-mono text-xs text-muted-foreground mt-1">{selectedOrg.orgNumber}</p>
										</div>
										<span class="inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-medium uppercase tracking-wider {getRoleBadgeColor(selectedOrg.memberRole)}">
											{#if selectedOrg.memberRole === 'owner'}<Crown class="h-3 w-3" />{/if}
											{#if selectedOrg.memberRole === 'admin'}<Shield class="h-3 w-3" />{/if}
											{selectedOrg.memberRole}
										</span>
									</div>
									{#if selectedOrg.description}
										<p class="font-body text-sm text-muted-foreground mt-2">{selectedOrg.description}</p>
									{/if}
								</div>
							</div>

							<!-- Contact Info -->
							{#if selectedOrg.website || selectedOrg.email || selectedOrg.phone}
								<div class="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border">
									{#if selectedOrg.website}
										<a href={selectedOrg.website} target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
											<Globe class="h-4 w-4" />
											<span class="truncate">{selectedOrg.website.replace(/^https?:\/\//, '')}</span>
										</a>
									{/if}
									{#if selectedOrg.email}
										<div class="flex items-center gap-2 text-sm text-muted-foreground">
											<Mail class="h-4 w-4" />
											<span>{selectedOrg.email}</span>
										</div>
									{/if}
									{#if selectedOrg.phone}
										<div class="flex items-center gap-2 text-sm text-muted-foreground">
											<Phone class="h-4 w-4" />
											<span>{selectedOrg.phone}</span>
										</div>
									{/if}
								</div>
							{/if}
						</div>

						<!-- Stats Grid -->
						<div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
							<div class="border border-border bg-card p-4">
								<div class="flex items-center gap-3">
									<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
										<Users class="h-5 w-5 text-muted-foreground" />
									</div>
									<div>
										<p class="font-mono text-2xl font-bold">{selectedOrg.memberCount}</p>
										<p class="font-body text-xs text-muted-foreground">Members</p>
									</div>
								</div>
							</div>
							<div class="border border-border bg-card p-4">
								<div class="flex items-center gap-3">
									<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
										<FolderKanban class="h-5 w-5 text-muted-foreground" />
									</div>
									<div>
										<p class="font-mono text-2xl font-bold">{selectedOrg.projectCount}</p>
										<p class="font-body text-xs text-muted-foreground">Projects</p>
									</div>
								</div>
							</div>
							<div class="border border-border bg-card p-4">
								<div class="flex items-center gap-3">
									<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
										<Ticket class="h-5 w-5 text-muted-foreground" />
									</div>
									<div>
										<p class="font-mono text-2xl font-bold">{selectedOrg.openTickets}</p>
										<p class="font-body text-xs text-muted-foreground">Open Tickets</p>
									</div>
								</div>
							</div>
							<div class="border border-border bg-card p-4">
								<div class="flex items-center gap-3">
									<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
										<UserPlus class="h-5 w-5 text-muted-foreground" />
									</div>
									<div>
										<p class="font-mono text-2xl font-bold">{selectedOrg.invites?.length ?? 0}</p>
										<p class="font-body text-xs text-muted-foreground">Active Invites</p>
									</div>
								</div>
							</div>
						</div>

						<!-- Action Tiles -->
						<div>
							<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK ACTIONS</span>
							<div class="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								<!-- View Members Tile -->
								<button
									onclick={() => showMembersDialog = true}
									class="group border border-border bg-card p-6 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
								>
									<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
										<Users class="h-6 w-6 text-primary" />
									</div>
									<h3 class="font-ui mt-4 text-sm font-semibold tracking-wider">VIEW MEMBERS</h3>
									<p class="font-body mt-1 text-xs text-muted-foreground">
										See all {selectedOrg.memberCount} team members and their roles
									</p>
									<span class="font-mono mt-3 flex items-center gap-1 text-[10px] tracking-wider text-primary">
										OPEN
										<ChevronRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
									</span>
								</button>

								<!-- Manage Invites Tile (Admin Only) -->
								{#if isAdmin}
									<button
										onclick={() => showInviteDialog = true}
										class="group border border-border bg-card p-6 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
									>
										<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
											<UserPlus class="h-6 w-6 text-primary" />
										</div>
										<h3 class="font-ui mt-4 text-sm font-semibold tracking-wider">MANAGE INVITES</h3>
										<p class="font-body mt-1 text-xs text-muted-foreground">
											Create invite codes and manage pending invitations
										</p>
										<span class="font-mono mt-3 flex items-center gap-1 text-[10px] tracking-wider text-primary">
											OPEN
											<ChevronRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
										</span>
									</button>
								{/if}

								<!-- Settings Tile (Owner Only) -->
								{#if isOwner}
									<button
										onclick={openSettingsDialog}
										class="group border border-border bg-card p-6 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
									>
										<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
											<Settings class="h-6 w-6 text-primary" />
										</div>
										<h3 class="font-ui mt-4 text-sm font-semibold tracking-wider">SETTINGS</h3>
										<p class="font-body mt-1 text-xs text-muted-foreground">
											Update organization name, contact info, and preferences
										</p>
										<span class="font-mono mt-3 flex items-center gap-1 text-[10px] tracking-wider text-primary">
											OPEN
											<ChevronRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
										</span>
									</button>
								{/if}

								<!-- View Projects Tile -->
								<a
									href="/app/projects"
									class="group border border-border bg-card p-6 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
								>
									<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
										<FolderKanban class="h-6 w-6 text-primary" />
									</div>
									<h3 class="font-ui mt-4 text-sm font-semibold tracking-wider">VIEW PROJECTS</h3>
									<p class="font-body mt-1 text-xs text-muted-foreground">
										Browse and manage your organization's projects
									</p>
									<span class="font-mono mt-3 flex items-center gap-1 text-[10px] tracking-wider text-primary">
										GO TO PROJECTS
										<ChevronRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
									</span>
								</a>

								<!-- View Tickets Tile -->
								<a
									href="/app/support"
									class="group border border-border bg-card p-6 text-left transition-colors hover:border-primary/50 hover:bg-primary/5"
								>
									<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
										<Ticket class="h-6 w-6 text-primary" />
									</div>
									<h3 class="font-ui mt-4 text-sm font-semibold tracking-wider">VIEW TICKETS</h3>
									<p class="font-body mt-1 text-xs text-muted-foreground">
										Access support tickets and help requests
									</p>
									<span class="font-mono mt-3 flex items-center gap-1 text-[10px] tracking-wider text-primary">
										GO TO SUPPORT
										<ChevronRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
									</span>
								</a>

								<!-- Leave Organization (Non-Owner) -->
								{#if !isOwner}
									<form method="POST" action="?/leaveOrganization" use:enhance={() => {
										loadingAction = 'leave';
										return async ({ update }) => { loadingAction = null; await update(); };
									}} class="contents">
										<input type="hidden" name="orgId" value={selectedOrg.id} />
										<button
											type="submit"
											disabled={loadingAction === 'leave'}
											class="group border border-destructive/30 bg-card p-6 text-left transition-colors hover:border-destructive hover:bg-destructive/5"
										>
											<div class="flex h-12 w-12 items-center justify-center border border-destructive/30 bg-background">
												<LogOut class="h-6 w-6 text-destructive" />
											</div>
											<h3 class="font-ui mt-4 text-sm font-semibold tracking-wider text-destructive">LEAVE ORGANIZATION</h3>
											<p class="font-body mt-1 text-xs text-muted-foreground">
												Remove yourself from this organization
											</p>
											<span class="font-mono mt-3 flex items-center gap-1 text-[10px] tracking-wider text-destructive">
												{#if loadingAction === 'leave'}
													<Loader2 class="h-3 w-3 animate-spin" />
													LEAVING...
												{:else}
													CONFIRM
													<ChevronRight class="h-3 w-3" />
												{/if}
											</span>
										</button>
									</form>
								{/if}
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</section>
</div>

<!-- Create Organization Dialog -->
<Dialog.Root bind:open={showCreateDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="font-display uppercase">Create Organization</Dialog.Title>
			<Dialog.Description>Set up a new organization for your team.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/createOrganization" use:enhance={() => {
			isCreating = true;
			return async ({ result, update }) => {
				if (result.type === 'success') {
					showCreateDialog = false;
					orgName = ''; orgDescription = ''; orgWebsite = '';
				}
				isCreating = false;
				await update();
			};
		}}>
			<Dialog.Body class="space-y-4">
				<div class="space-y-2">
					<Label class="font-mono text-[10px] tracking-widest text-muted-foreground">NAME *</Label>
					<Input name="name" type="text" required bind:value={orgName} placeholder="Acme Inc." class="h-10" />
				</div>
				<div class="space-y-2">
					<Label class="font-mono text-[10px] tracking-widest text-muted-foreground">DESCRIPTION</Label>
					<Input name="description" type="text" bind:value={orgDescription} placeholder="Brief description" class="h-10" />
				</div>
				<div class="space-y-2">
					<Label class="font-mono text-[10px] tracking-widest text-muted-foreground">WEBSITE</Label>
					<Input name="website" type="url" bind:value={orgWebsite} placeholder="https://example.com" class="h-10" />
				</div>
			</Dialog.Body>
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => showCreateDialog = false}>CANCEL</Button>
				<Button type="submit" disabled={isCreating || !orgName.trim()}>
					{#if isCreating}<Loader2 class="mr-2 h-4 w-4 animate-spin" />{/if}
					CREATE
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Join Organization Dialog -->
<Dialog.Root bind:open={showJoinDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="font-display uppercase">Join Organization</Dialog.Title>
			<Dialog.Description>Enter an invite code to join an existing organization.</Dialog.Description>
		</Dialog.Header>
		<Dialog.Body class="space-y-4">
			<div class="space-y-2">
				<Label class="font-mono text-[10px] tracking-widest text-muted-foreground">INVITE CODE</Label>
				<Input type="text" bind:value={inviteCode} placeholder="Enter invite code" class="h-10" />
			</div>
		</Dialog.Body>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => { showJoinDialog = false; inviteCode = ''; }}>CANCEL</Button>
			<Button onclick={handleJoinWithCode} disabled={isJoining || !inviteCode.trim()}>
				{#if isJoining}<Loader2 class="mr-2 h-4 w-4 animate-spin" />{/if}
				JOIN
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Members Dialog -->
<Dialog.Root bind:open={showMembersDialog}>
	<Dialog.Content class="sm:max-w-lg max-h-[80vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="font-display uppercase">Team Members</Dialog.Title>
			<Dialog.Description>{selectedOrg?.memberCount ?? 0} members in {selectedOrg?.name}</Dialog.Description>
		</Dialog.Header>
		<Dialog.Body class="p-0">
			<div class="divide-y divide-border">
				{#each selectedOrg?.members ?? [] as member (member.id)}
					{@const RoleIcon = getRoleIcon(member.role)}
					<div class="flex items-center justify-between px-4 py-4">
						<div class="flex items-center gap-3">
							<div class="flex h-10 w-10 items-center justify-center border border-border bg-background flex-shrink-0">
								{#if member.avatarUrl}
									<img src={member.avatarUrl} alt="" class="h-10 w-10 object-cover" />
								{:else}
									<User class="h-5 w-5 text-muted-foreground" />
								{/if}
							</div>
							<div class="min-w-0">
								<p class="font-ui text-sm font-medium truncate">
								{member.displayName || `${member.firstName} ${member.lastName}`}
							</p>
							<p class="font-mono text-xs text-muted-foreground truncate">{member.email}</p>
						</div>
					</div>
					<div class="flex items-center gap-3 flex-shrink-0">
						<span class="inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-medium uppercase tracking-wider {getRoleBadgeColor(member.role)}">
							<RoleIcon class="h-3 w-3" />
							{member.role}
						</span>
						{#if isOwner && member.role !== 'owner'}
							<form method="POST" action="?/removeMember" use:enhance={() => {
								loadingAction = `remove-${member.id}`;
								return async ({ update }) => { loadingAction = null; await update(); };
							}}>
								<input type="hidden" name="orgId" value={selectedOrg?.id} />
								<input type="hidden" name="profileId" value={member.id} />
								<Button type="submit" variant="ghost" size="sm" class="text-destructive hover:text-destructive" disabled={loadingAction === `remove-${member.id}`}>
									{#if loadingAction === `remove-${member.id}`}
										<Loader2 class="h-4 w-4 animate-spin" />
									{:else}
										<Trash2 class="h-4 w-4" />
									{/if}
								</Button>
							</form>
						{/if}
					</div>
				</div>
			{/each}
			</div>
		</Dialog.Body>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => showMembersDialog = false}>CLOSE</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Invites Dialog -->
<Dialog.Root bind:open={showInviteDialog}>
	<Dialog.Content class="sm:max-w-lg max-h-[80vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="font-display uppercase">Manage Invites</Dialog.Title>
			<Dialog.Description>Create invite codes and manage pending invitations.</Dialog.Description>
		</Dialog.Header>
		<Dialog.Body class="space-y-4">
			<!-- Create Invite Form -->
			<form method="POST" action="?/createInvite" use:enhance={() => {
				inviteLoading = true;
				return async ({ result, update }) => {
					if (result.type === 'success') {
						inviteEmail = ''; inviteRole = 'member'; inviteMaxUses = 1;
					}
					inviteLoading = false;
					await update();
				};
			}} class="border border-border bg-background p-4 space-y-4">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CREATE NEW INVITE</span>
				<input type="hidden" name="orgId" value={selectedOrg?.id} />
				<div class="grid gap-4 sm:grid-cols-3">
					<div class="space-y-1">
						<Label class="font-mono text-[9px] tracking-widest text-muted-foreground">EMAIL (OPTIONAL)</Label>
						<Input name="email" type="email" bind:value={inviteEmail} placeholder="user@example.com" class="h-9 text-sm" />
					</div>
					<div class="space-y-1">
						<Label class="font-mono text-[9px] tracking-widest text-muted-foreground">ROLE</Label>
						<select name="role" bind:value={inviteRole} class="h-9 w-full border border-border bg-background px-3 text-sm">
							<option value="member">Member</option>
							<option value="admin">Admin</option>
						</select>
					</div>
					<div class="space-y-1">
						<Label class="font-mono text-[9px] tracking-widest text-muted-foreground">MAX USES</Label>
						<Input name="maxUses" type="number" min="1" bind:value={inviteMaxUses} class="h-9 text-sm" />
					</div>
				</div>
				<Button type="submit" size="sm" disabled={inviteLoading}>
					{#if inviteLoading}<Loader2 class="mr-2 h-4 w-4 animate-spin" />{/if}
					<UserPlus class="mr-2 h-4 w-4" />
					CREATE INVITE
				</Button>
			</form>

			<!-- Invite List -->
			{#if !selectedOrg?.invites || selectedOrg.invites.length === 0}
				<p class="text-center font-body text-sm text-muted-foreground py-8">No active invites</p>
			{:else}
				<div class="divide-y divide-border border border-border">
					{#each selectedOrg.invites as invite (invite.id)}
						<div class="flex items-center justify-between px-4 py-3">
							<div class="space-y-1 min-w-0">
								<div class="flex flex-wrap items-center gap-2">
									<code class="font-mono text-sm font-bold">{invite.code}</code>
									<span class="border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider {invite.role === 'admin' ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' : 'bg-muted text-muted-foreground border-border'}">{invite.role}</span>
								</div>
								<p class="font-mono text-xs text-muted-foreground">
									{invite.usedCount}/{invite.maxUses ?? '∞'} uses • Expires {formatDate(invite.expiresAt)}
									{#if invite.email} • {invite.email}{/if}
								</p>
							</div>
							<div class="flex items-center gap-2 flex-shrink-0">
								<Button variant="ghost" size="sm" onclick={() => copyToClipboard(invite.code)}>
									{#if copiedCode === invite.code}
										<Check class="h-4 w-4 text-green-500" />
									{:else}
										<Copy class="h-4 w-4" />
									{/if}
								</Button>
								<form method="POST" action="?/deleteInvite" use:enhance>
									<input type="hidden" name="orgId" value={selectedOrg?.id} />
									<input type="hidden" name="inviteId" value={invite.id} />
									<Button type="submit" variant="ghost" size="sm" class="text-destructive hover:text-destructive">
										<Trash2 class="h-4 w-4" />
									</Button>
								</form>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</Dialog.Body>
		<Dialog.Footer>
			<Button variant="outline" onclick={() => showInviteDialog = false}>CLOSE</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<!-- Settings Dialog -->
<Dialog.Root bind:open={showSettingsDialog}>
	<Dialog.Content class="sm:max-w-md max-h-[80vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="font-display uppercase">Organization Settings</Dialog.Title>
			<Dialog.Description>Update your organization's information.</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/updateOrganization" use:enhance={() => {
			loadingAction = 'update-org';
			return async ({ result, update }) => {
				if (result.type === 'success') {
					showSettingsDialog = false;
				}
				loadingAction = null;
				await update();
			};
		}}>
			<Dialog.Body class="space-y-4">
				<input type="hidden" name="orgId" value={selectedOrg?.id} />
				<div class="space-y-2">
					<Label class="font-mono text-[10px] tracking-widest text-muted-foreground">NAME *</Label>
					<Input name="name" type="text" required bind:value={editName} class="h-10" />
				</div>
				<div class="space-y-2">
					<Label class="font-mono text-[10px] tracking-widest text-muted-foreground">EMAIL</Label>
					<Input name="email" type="email" bind:value={editEmail} class="h-10" />
				</div>
				<div class="space-y-2">
					<Label class="font-mono text-[10px] tracking-widest text-muted-foreground">PHONE</Label>
					<Input name="phone" type="tel" bind:value={editPhone} class="h-10" />
				</div>
				<div class="space-y-2">
					<Label class="font-mono text-[10px] tracking-widest text-muted-foreground">WEBSITE</Label>
					<Input name="website" type="url" bind:value={editWebsite} class="h-10" />
				</div>

				<!-- Danger Zone -->
				<div class="mt-2 border-t border-destructive/20 pt-4">
					<div class="flex items-start gap-3">
						<AlertTriangle class="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
						<div class="flex-1">
							<h4 class="font-ui text-sm font-semibold text-destructive">DANGER ZONE</h4>
							<p class="font-body mt-1 text-xs text-muted-foreground">
								Permanently delete this organization and all associated data.
							</p>
							<Button 
								type="button"
								variant="outline" 
								size="sm" 
								class="mt-3 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
								onclick={() => { showSettingsDialog = false; showDeleteDialog = true; deleteConfirmName = ''; }}
							>
								<Trash2 class="mr-2 h-4 w-4" />
								DELETE ORGANIZATION
							</Button>
						</div>
					</div>
				</div>
			</Dialog.Body>
			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => showSettingsDialog = false}>CANCEL</Button>
				<Button type="submit" disabled={loadingAction === 'update-org'}>
					{#if loadingAction === 'update-org'}<Loader2 class="mr-2 h-4 w-4 animate-spin" />{/if}
					SAVE CHANGES
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- Delete Organization Dialog -->
<AlertDialog.Root bind:open={showDeleteDialog}>
	<AlertDialog.Content class="sm:max-w-md">
		<AlertDialog.Header>
			<AlertDialog.Title class="font-display uppercase text-destructive">Delete Organization</AlertDialog.Title>
			<AlertDialog.Description>
				This action cannot be undone. This will permanently delete <strong class="text-foreground">{selectedOrg?.name}</strong> and remove all associated data including members, invites, and settings.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<form method="POST" action="?/deleteOrganization" use:enhance={() => {
			isDeleting = true;
			return async ({ result, update }) => {
				if (result.type === 'success') {
					showDeleteDialog = false;
					deleteConfirmName = '';
				}
				isDeleting = false;
				await update();
			};
		}}>
			<div class="space-y-4 px-4 py-4">
				<input type="hidden" name="orgId" value={selectedOrg?.id} />
				<div class="space-y-2">
					<Label class="font-mono text-[10px] tracking-widest text-muted-foreground">
						TYPE "{selectedOrg?.name}" TO CONFIRM
					</Label>
					<Input 
						name="confirmName" 
						type="text" 
						bind:value={deleteConfirmName} 
						placeholder={selectedOrg?.name} 
						class="h-10 border-destructive/50 focus:border-destructive" 
					/>
				</div>
			</div>
			<AlertDialog.Footer>
				<AlertDialog.Cancel onclick={() => { deleteConfirmName = ''; }}>CANCEL</AlertDialog.Cancel>
				<Button 
					type="submit" 
					variant="destructive" 
					disabled={isDeleting || deleteConfirmName.toLowerCase() !== selectedOrg?.name.toLowerCase()}
				>
					{#if isDeleting}<Loader2 class="mr-2 h-4 w-4 animate-spin" />{/if}
					DELETE ORGANIZATION
				</Button>
			</AlertDialog.Footer>
		</form>
	</AlertDialog.Content>
</AlertDialog.Root>
