<script lang="ts">
	/**
	 * Organization Management Page
	 * 
	 * Comprehensive organization management with tabs for overview, members, invites, and settings.
	 */
	import { enhance } from '$app/forms';
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { 
		Building2, Users, Globe, Mail, Phone, Plus, Crown, UserCircle, Loader2, Link2, 
		UserPlus, RefreshCw, FolderKanban, Ticket, Shield, Copy, Trash2, Check,
		AlertCircle, ChevronRight
	} from '@lucide/svelte';

	let { data, form } = $props();

	// Tab state
	let activeTab = $state<'overview' | 'members' | 'invites' | 'settings'>('overview');
	
	// UI state
	let showCreateForm = $state(false);
	let showJoinForm = $state(false);
	let isCreating = $state(false);
	let isJoining = $state(false);
	let isRefreshing = $state(false);
	let inviteLoading = $state(false);
	let copiedCode = $state<string | null>(null);
	let loadingAction = $state<string | null>(null);

	// Form state
	let orgName = $state('');
	let orgDescription = $state('');
	let orgWebsite = $state('');
	let inviteCode = $state('');

	// Invite form state
	let inviteEmail = $state('');
	let inviteRole = $state('member');
	let inviteMaxUses = $state(1);

	// Edit form state (for settings)
	let editName = $state(data.selectedOrg?.name ?? '');
	let editEmail = $state(data.selectedOrg?.email ?? '');
	let editPhone = $state(data.selectedOrg?.phone ?? '');
	let editWebsite = $state(data.selectedOrg?.website ?? '');

	// Update edit form when org changes
	$effect(() => {
		if (data.selectedOrg) {
			editName = data.selectedOrg.name;
			editEmail = data.selectedOrg.email ?? '';
			editPhone = data.selectedOrg.phone ?? '';
			editWebsite = data.selectedOrg.website ?? '';
		}
	});

	function getRoleBadgeColor(role: string): string {
		switch (role) {
			case 'owner': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
			case 'admin': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
			default: return 'bg-muted text-muted-foreground border-border';
		}
	}

	function getRoleIcon(role: string) {
		switch (role) {
			case 'owner': return Crown;
			case 'admin': return Shield;
			default: return UserCircle;
		}
	}

	function formatDate(date: Date | string | null): string {
		if (!date) return '-';
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
	}

	async function handleJoinWithCode() {
		if (!inviteCode.trim()) return;
		isJoining = true;
		await goto(`/join/${inviteCode.trim()}`);
	}

	async function handleRefresh() {
		isRefreshing = true;
		await invalidateAll();
		isRefreshing = false;
	}

	async function copyToClipboard(code: string) {
		try {
			const inviteUrl = `${window.location.origin}/join/${code}`;
			await navigator.clipboard.writeText(inviteUrl);
			copiedCode = code;
			setTimeout(() => copiedCode = null, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	function selectOrganization(orgId: string) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('org', orgId);
		goto(`?${params.toString()}`, { keepFocus: true });
	}

	const selectedOrg = $derived(data.selectedOrg);
	const isOwner = $derived(selectedOrg?.memberRole === 'owner');
	const isAdmin = $derived(selectedOrg?.memberRole === 'admin' || isOwner);
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
				<Button onclick={handleRefresh} variant="outline" size="sm" class="font-ui text-xs tracking-wider" disabled={isRefreshing}>
					<RefreshCw class="mr-2 h-4 w-4 {isRefreshing ? 'animate-spin' : ''}" />
					REFRESH
				</Button>
				{#if data.organizations.length > 0}
					<Button onclick={() => showJoinForm = !showJoinForm} variant="outline" size="sm" class="font-ui text-xs tracking-wider">
						<Link2 class="mr-2 h-4 w-4" />
						JOIN
					</Button>
				{/if}
				{#if data.canCreateOrg}
					<Button onclick={() => showCreateForm = !showCreateForm} size="sm" class="font-ui text-xs tracking-wider">
						<Plus class="mr-2 h-4 w-4" />
						NEW
					</Button>
				{/if}
			</div>
		</div>
	</section>

	<!-- Content -->
	<section class="border-b border-border bg-background">
		<div class="px-6 py-8 md:px-12 lg:px-16 space-y-6">
			<!-- Messages -->
			{#if form?.error}
				<div class="flex items-center gap-3 border border-destructive/50 bg-destructive/10 px-4 py-3">
					<AlertCircle class="h-5 w-5 text-destructive flex-shrink-0" />
					<p class="font-mono text-sm text-destructive">{form.error}</p>
				</div>
			{/if}
			{#if form?.success}
				<div class="flex items-center gap-3 border border-green-500/50 bg-green-500/10 px-4 py-3">
					<Check class="h-5 w-5 text-green-500 flex-shrink-0" />
					<p class="font-mono text-sm text-green-500">{form.message || 'Operation successful!'}</p>
				</div>
			{/if}

			<!-- No Organizations -->
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
						<div class="mt-8 flex items-center gap-4">
							<Button onclick={() => showCreateForm = true} class="font-ui tracking-wider">
								<Plus class="mr-2 h-4 w-4" />
								CREATE NEW
							</Button>
							<Button onclick={() => showJoinForm = true} variant="outline" class="font-ui tracking-wider">
								<Link2 class="mr-2 h-4 w-4" />
								JOIN WITH CODE
							</Button>
						</div>
					</div>
				</div>
			{/if}

			<!-- Join Form -->
			{#if showJoinForm}
				<div class="border border-border bg-card">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-display text-lg font-bold uppercase">Join Organization</h2>
					</div>
					<div class="space-y-4 p-6">
						<div class="space-y-2">
							<Label class="font-mono text-[10px] tracking-widest text-muted-foreground">INVITE CODE</Label>
							<Input type="text" bind:value={inviteCode} placeholder="Enter invite code" class="h-10" />
						</div>
						<div class="flex justify-end gap-3">
							<Button variant="outline" onclick={() => { showJoinForm = false; inviteCode = ''; }}>CANCEL</Button>
							<Button onclick={handleJoinWithCode} disabled={isJoining || !inviteCode.trim()}>
								{#if isJoining}<Loader2 class="mr-2 h-4 w-4 animate-spin" />{/if}
								JOIN
							</Button>
						</div>
					</div>
				</div>
			{/if}

			<!-- Create Form -->
			{#if showCreateForm && data.canCreateOrg}
				<div class="border border-border bg-card">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-display text-lg font-bold uppercase">Create Organization</h2>
					</div>
					<form method="POST" action="?/createOrganization" use:enhance={() => {
						isCreating = true;
						return async ({ result, update }) => {
							if (result.type === 'success') {
								showCreateForm = false;
								orgName = ''; orgDescription = ''; orgWebsite = '';
							}
							isCreating = false;
							await update();
						};
					}} class="space-y-4 p-6">
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
						<div class="flex justify-end gap-3 border-t border-border pt-4">
							<Button type="button" variant="outline" onclick={() => showCreateForm = false}>CANCEL</Button>
							<Button type="submit" disabled={isCreating || !orgName.trim()}>
								{#if isCreating}<Loader2 class="mr-2 h-4 w-4 animate-spin" />{/if}
								CREATE
							</Button>
						</div>
					</form>
				</div>
			{/if}

			<!-- Organization Selector & Content -->
			{#if data.organizations.length > 0}
				<div class="flex flex-col gap-6 lg:flex-row">
					<!-- Org Selector Sidebar -->
					<div class="lg:w-64 flex-shrink-0 space-y-2">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">YOUR ORGANIZATIONS</span>
						<div class="space-y-1">
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

					<!-- Main Content -->
					{#if selectedOrg}
						<div class="flex-1 min-w-0">
							<!-- Tabs -->
							<div class="flex border-b border-border overflow-x-auto">
								<button
									onclick={() => activeTab = 'overview'}
									class="px-4 py-3 font-mono text-xs tracking-wider transition-colors whitespace-nowrap {activeTab === 'overview' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}"
								>OVERVIEW</button>
								<button
									onclick={() => activeTab = 'members'}
									class="px-4 py-3 font-mono text-xs tracking-wider transition-colors whitespace-nowrap {activeTab === 'members' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}"
								>MEMBERS ({selectedOrg.memberCount})</button>
								{#if isAdmin}
									<button
										onclick={() => activeTab = 'invites'}
										class="px-4 py-3 font-mono text-xs tracking-wider transition-colors whitespace-nowrap {activeTab === 'invites' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}"
									>INVITES ({selectedOrg.invites?.length ?? 0})</button>
								{/if}
								{#if isOwner}
									<button
										onclick={() => activeTab = 'settings'}
										class="px-4 py-3 font-mono text-xs tracking-wider transition-colors whitespace-nowrap {activeTab === 'settings' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}"
									>SETTINGS</button>
								{/if}
							</div>

							<!-- Tab Content -->
							<div class="border border-t-0 border-border bg-card">
								<!-- Overview Tab -->
								{#if activeTab === 'overview'}
									<div class="p-6 space-y-6">
										<!-- Header -->
										<div class="flex items-start gap-4">
											<div class="flex h-16 w-16 items-center justify-center border border-border bg-background flex-shrink-0">
												{#if selectedOrg.logoUrl}
													<img src={selectedOrg.logoUrl} alt="" class="h-16 w-16 object-cover" />
												{:else}
													<Building2 class="h-8 w-8 text-muted-foreground" />
												{/if}
											</div>
											<div class="min-w-0">
												<h3 class="font-display text-xl font-bold">{selectedOrg.name}</h3>
												<p class="font-mono text-xs text-muted-foreground">{selectedOrg.orgNumber}</p>
												<div class="mt-2 flex flex-wrap items-center gap-2">
													<span class="inline-flex items-center gap-1.5 border px-2 py-0.5 text-xs font-medium uppercase tracking-wider {getRoleBadgeColor(selectedOrg.memberRole)}">
														{#if selectedOrg.memberRole === 'owner'}<Crown class="h-3 w-3" />{/if}
														{#if selectedOrg.memberRole === 'admin'}<Shield class="h-3 w-3" />{/if}
														{selectedOrg.memberRole}
													</span>
													<span class="font-body text-sm text-muted-foreground capitalize">{selectedOrg.customerType}</span>
												</div>
											</div>
										</div>

										<!-- Stats -->
										<div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
											<div class="border border-border p-4">
												<div class="flex items-center gap-2">
													<Users class="h-4 w-4 text-muted-foreground" />
													<span class="font-mono text-2xl font-bold">{selectedOrg.memberCount}</span>
												</div>
												<p class="mt-1 font-body text-xs text-muted-foreground">members</p>
											</div>
											<div class="border border-border p-4">
												<div class="flex items-center gap-2">
													<FolderKanban class="h-4 w-4 text-muted-foreground" />
													<span class="font-mono text-2xl font-bold">{selectedOrg.projectCount}</span>
												</div>
												<p class="mt-1 font-body text-xs text-muted-foreground">projects</p>
											</div>
											<div class="border border-border p-4">
												<div class="flex items-center gap-2">
													<Ticket class="h-4 w-4 text-muted-foreground" />
													<span class="font-mono text-2xl font-bold">{selectedOrg.openTickets}</span>
												</div>
												<p class="mt-1 font-body text-xs text-muted-foreground">open tickets</p>
											</div>
										</div>

										<!-- Contact Info -->
										<div class="space-y-3">
											<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTACT INFORMATION</span>
											<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
												{#if selectedOrg.website}
													<div class="flex items-center gap-3 border border-border p-3">
														<Globe class="h-4 w-4 text-muted-foreground flex-shrink-0" />
														<a href={selectedOrg.website} target="_blank" rel="noopener noreferrer" class="font-body text-sm text-primary hover:underline truncate">
															{selectedOrg.website.replace(/^https?:\/\//, '')}
														</a>
													</div>
												{/if}
												{#if selectedOrg.email}
													<div class="flex items-center gap-3 border border-border p-3">
														<Mail class="h-4 w-4 text-muted-foreground flex-shrink-0" />
														<span class="font-body text-sm truncate">{selectedOrg.email}</span>
													</div>
												{/if}
												{#if selectedOrg.phone}
													<div class="flex items-center gap-3 border border-border p-3">
														<Phone class="h-4 w-4 text-muted-foreground flex-shrink-0" />
														<span class="font-body text-sm">{selectedOrg.phone}</span>
													</div>
												{/if}
												{#if !selectedOrg.website && !selectedOrg.email && !selectedOrg.phone}
													<p class="font-body text-sm text-muted-foreground col-span-full">No contact information added yet.</p>
												{/if}
											</div>
										</div>

										<!-- Quick Links -->
										<div class="space-y-3">
											<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK LINKS</span>
											<div class="flex flex-wrap gap-2">
												<Button href="/app/projects" variant="outline" size="sm" class="font-ui text-xs">
													<FolderKanban class="mr-2 h-3 w-3" />
													VIEW PROJECTS
													<ChevronRight class="ml-1 h-3 w-3" />
												</Button>
												<Button href="/app/support" variant="outline" size="sm" class="font-ui text-xs">
													<Ticket class="mr-2 h-3 w-3" />
													VIEW TICKETS
													<ChevronRight class="ml-1 h-3 w-3" />
												</Button>
											</div>
										</div>
									</div>
								{/if}

								<!-- Members Tab -->
								{#if activeTab === 'members'}
									<div class="divide-y divide-border">
										{#each selectedOrg.members as member (member.id)}
											{@const RoleIcon = getRoleIcon(member.role)}
											<div class="flex items-center justify-between px-6 py-4">
												<div class="flex items-center gap-3">
													<div class="flex h-10 w-10 items-center justify-center border border-border bg-background flex-shrink-0">
														{#if member.avatarUrl}
															<img src={member.avatarUrl} alt="" class="h-10 w-10 object-cover" />
														{:else}
															<UserCircle class="h-5 w-5 text-muted-foreground" />
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
															<input type="hidden" name="orgId" value={selectedOrg.id} />
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
										{#if selectedOrg.members.length === 0}
											<div class="p-8 text-center">
												<p class="font-body text-sm text-muted-foreground">No members found.</p>
											</div>
										{/if}
									</div>
								{/if}

								<!-- Invites Tab -->
								{#if activeTab === 'invites' && isAdmin}
									<div class="p-6 space-y-6">
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
											<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CREATE INVITE</span>
											<input type="hidden" name="orgId" value={selectedOrg.id} />
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
										{#if !selectedOrg.invites || selectedOrg.invites.length === 0}
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
																<input type="hidden" name="orgId" value={selectedOrg.id} />
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
									</div>
								{/if}

								<!-- Settings Tab -->
								{#if activeTab === 'settings' && isOwner}
									<form method="POST" action="?/updateOrganization" use:enhance={() => {
										loadingAction = 'update-org';
										return async ({ update }) => { loadingAction = null; await update(); };
									}} class="p-6 space-y-6">
										<input type="hidden" name="orgId" value={selectedOrg.id} />
										<div class="grid gap-4 sm:grid-cols-2">
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
										</div>
										<div class="flex justify-end border-t border-border pt-4">
											<Button type="submit" disabled={loadingAction === 'update-org'}>
												{#if loadingAction === 'update-org'}<Loader2 class="mr-2 h-4 w-4 animate-spin" />{/if}
												SAVE CHANGES
											</Button>
										</div>
									</form>
								{/if}
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</section>
</div>
