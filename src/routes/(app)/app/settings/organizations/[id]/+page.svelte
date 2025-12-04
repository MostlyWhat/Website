<script lang="ts">
	/**
	 * Organization Management Page
	 *
	 * Manage organization details, members, and invites
	 */
	import { enhance } from '$app/forms';
	import {
		ArrowLeft,
		Building2,
		Users,
		FolderKanban,
		Ticket,
		Crown,
		Shield,
		User as UserIcon,
		UserPlus,
		Copy,
		Trash2,
		Loader2,
		Check,
		AlertCircle,
		Mail,
		Link
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	let { data, form } = $props();

	let loading = $state(false);
	let inviteLoading = $state(false);
	let showInviteForm = $state(false);
	let copiedCode = $state<string | null>(null);

	// Form state
	let name = $state(data.organization.name);
	let email = $state(data.organization.email ?? '');
	let phone = $state(data.organization.phone ?? '');
	let website = $state(data.organization.website ?? '');

	// Invite form
	let inviteEmail = $state('');
	let inviteRole = $state('member');
	let inviteMaxUses = $state(1);

	function getRoleIcon(role: string) {
		switch (role) {
			case 'owner':
				return Crown;
			case 'admin':
				return Shield;
			default:
				return UserIcon;
		}
	}

	function getRoleName(role: string) {
		switch (role) {
			case 'owner':
				return 'Owner';
			case 'admin':
				return 'Admin';
			default:
				return 'Member';
		}
	}

	function formatDate(date: Date | string | null): string {
		if (!date) return '-';
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	async function copyToClipboard(code: string) {
		try {
			const inviteUrl = `${window.location.origin}/join/${code}`;
			await navigator.clipboard.writeText(inviteUrl);
			copiedCode = code;
			setTimeout(() => {
				copiedCode = null;
			}, 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}
</script>

<svelte:head>
	<title>{data.organization.name} | Settings | MostlyWhat Systems</title>
</svelte:head>

<div class="px-6 py-8 md:px-12 lg:px-16">
	<!-- Back Link -->
	<a
		href="/app/settings/organizations"
		class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
	>
		<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
		<span class="font-mono text-[10px] tracking-widest">BACK TO ORGANIZATIONS</span>
	</a>

	<!-- Section Header -->
	<div class="mt-6 flex items-start justify-between">
		<div class="flex items-center gap-4">
			<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
				<Building2 class="h-5 w-5 text-primary" />
			</div>
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground"
					>{data.organization.orgNumber}</span
				>
				<h2 class="font-ui text-lg font-semibold tracking-wider">{data.organization.name}</h2>
			</div>
		</div>
		<span
			class="inline-flex items-center gap-1 px-2 py-1 text-xs
			{data.userRole === 'owner' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-blue-500/10 text-blue-500'}"
		>
			{#if data.userRole === 'owner'}
				<Crown class="h-3 w-3" />
			{:else if data.userRole === 'admin'}
				<Shield class="h-3 w-3" />
			{:else}
				<UserIcon class="h-3 w-3" />
			{/if}
			{getRoleName(data.userRole)}
		</span>
	</div>

	<!-- Stats -->
	<div class="mt-6 grid grid-cols-3 gap-4">
		<div class="border border-border p-4">
			<div class="flex items-center gap-2">
				<Users class="h-4 w-4 text-muted-foreground" />
				<span class="font-mono text-2xl font-bold">{data.stats.memberCount}</span>
			</div>
			<p class="mt-1 font-body text-xs text-muted-foreground">members</p>
		</div>
		<div class="border border-border p-4">
			<div class="flex items-center gap-2">
				<FolderKanban class="h-4 w-4 text-muted-foreground" />
				<span class="font-mono text-2xl font-bold">{data.stats.projectCount}</span>
			</div>
			<p class="mt-1 font-body text-xs text-muted-foreground">projects</p>
		</div>
		<div class="border border-border p-4">
			<div class="flex items-center gap-2">
				<Ticket class="h-4 w-4 text-muted-foreground" />
				<span class="font-mono text-2xl font-bold">{data.stats.openTickets}</span>
			</div>
			<p class="mt-1 font-body text-xs text-muted-foreground">open tickets</p>
		</div>
	</div>

	<!-- Messages -->
	{#if form?.success}
		<div class="mt-6 flex items-center gap-3 border border-green-500/30 bg-green-500/10 px-4 py-3">
			<Check class="h-5 w-5 text-green-500" />
			<p class="font-body text-sm text-green-500">{form.message}</p>
		</div>
	{/if}
	{#if form?.error}
		<div class="mt-6 flex items-center gap-3 border border-destructive/30 bg-destructive/10 px-4 py-3">
			<AlertCircle class="h-5 w-5 text-destructive" />
			<p class="font-body text-sm text-destructive">{form.error}</p>
		</div>
	{/if}

	<!-- Organization Details (Owner only) -->
	{#if data.userRole === 'owner'}
		<div class="mt-8 border-t border-border pt-8">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground"
				>ORGANIZATION DETAILS</span
			>

			<form
				method="POST"
				action="?/updateOrg"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						await update();
						loading = false;
					};
				}}
				class="mt-4 max-w-xl space-y-4"
			>
				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<label for="name" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							NAME <span class="text-destructive">*</span>
						</label>
						<Input
							id="name"
							name="name"
							type="text"
							bind:value={name}
							required
							class="h-10 border-border bg-card px-3 font-body text-sm"
						/>
					</div>
					<div class="space-y-2">
						<label for="email" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							EMAIL
						</label>
						<Input
							id="email"
							name="email"
							type="email"
							bind:value={email}
							class="h-10 border-border bg-card px-3 font-body text-sm"
						/>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-4">
					<div class="space-y-2">
						<label for="phone" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							PHONE
						</label>
						<Input
							id="phone"
							name="phone"
							type="tel"
							bind:value={phone}
							class="h-10 border-border bg-card px-3 font-body text-sm"
						/>
					</div>
					<div class="space-y-2">
						<label
							for="website"
							class="font-mono text-[10px] tracking-widest text-muted-foreground"
						>
							WEBSITE
						</label>
						<Input
							id="website"
							name="website"
							type="url"
							bind:value={website}
							class="h-10 border-border bg-card px-3 font-body text-sm"
						/>
					</div>
				</div>
				<Button type="submit" disabled={loading} size="sm" class="font-ui text-xs tracking-wider">
					{#if loading}
						<Loader2 class="mr-2 h-3 w-3 animate-spin" />
						SAVING...
					{:else}
						SAVE CHANGES
					{/if}
				</Button>
			</form>
		</div>
	{/if}

	<!-- Members Section -->
	<div class="mt-8 border-t border-border pt-8">
		<div class="flex items-center justify-between">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">MEMBERS</span>
			<Button
				variant="outline"
				size="sm"
				onclick={() => (showInviteForm = !showInviteForm)}
				class="font-ui text-xs tracking-wider"
			>
				<UserPlus class="mr-2 h-3 w-3" />
				INVITE MEMBER
			</Button>
		</div>

		<!-- Invite Form -->
		{#if showInviteForm}
			<form
				method="POST"
				action="?/createInvite"
				use:enhance={() => {
					inviteLoading = true;
					return async ({ update }) => {
						await update();
						inviteLoading = false;
						inviteEmail = '';
					};
				}}
				class="mt-4 border border-border bg-card p-4"
			>
				<div class="grid grid-cols-3 gap-4">
					<div class="space-y-2">
						<label
							for="inviteEmail"
							class="font-mono text-[10px] tracking-widest text-muted-foreground"
						>
							EMAIL (OPTIONAL)
						</label>
						<Input
							id="inviteEmail"
							name="email"
							type="email"
							bind:value={inviteEmail}
							placeholder="user@example.com"
							class="h-10 border-border bg-background px-3 font-body text-sm"
						/>
					</div>
					<div class="space-y-2">
						<label
							for="inviteRole"
							class="font-mono text-[10px] tracking-widest text-muted-foreground"
						>
							ROLE
						</label>
						<select
							id="inviteRole"
							name="role"
							bind:value={inviteRole}
							class="h-10 w-full border border-border bg-background px-3 font-body text-sm focus:border-primary focus:outline-none"
						>
							<option value="member">Member</option>
							<option value="admin">Admin</option>
						</select>
					</div>
					<div class="space-y-2">
						<label
							for="maxUses"
							class="font-mono text-[10px] tracking-widest text-muted-foreground"
						>
							MAX USES
						</label>
						<Input
							id="maxUses"
							name="maxUses"
							type="number"
							bind:value={inviteMaxUses}
							min="1"
							max="100"
							class="h-10 border-border bg-background px-3 font-body text-sm"
						/>
					</div>
				</div>
				<div class="mt-4 flex items-center gap-2">
					<Button type="submit" disabled={inviteLoading} size="sm" class="font-ui text-xs tracking-wider">
						{#if inviteLoading}
							<Loader2 class="mr-2 h-3 w-3 animate-spin" />
						{:else}
							<Link class="mr-2 h-3 w-3" />
						{/if}
						CREATE INVITE
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onclick={() => (showInviteForm = false)}
						class="font-ui text-xs tracking-wider"
					>
						CANCEL
					</Button>
				</div>
			</form>
		{/if}

		<!-- Active Invites -->
		{#if data.invites.length > 0}
			<div class="mt-4">
				<p class="font-body text-xs text-muted-foreground">Active Invites</p>
				<div class="mt-2 space-y-2">
					{#each data.invites as invite}
						<div
							class="flex items-center justify-between border border-dashed border-border bg-card/50 px-4 py-2"
						>
							<div class="flex items-center gap-4">
								<code class="font-mono text-sm text-primary">{invite.code}</code>
								{#if invite.email}
									<span class="flex items-center gap-1 text-xs text-muted-foreground">
										<Mail class="h-3 w-3" />
										{invite.email}
									</span>
								{/if}
								<span class="font-body text-xs text-muted-foreground">
									{invite.usedCount}/{invite.maxUses} uses
								</span>
								<span class="font-body text-xs text-muted-foreground">
									expires {formatDate(invite.expiresAt)}
								</span>
							</div>
							<div class="flex items-center gap-2">
								<Button
									variant="ghost"
									size="sm"
									onclick={() => copyToClipboard(invite.code)}
									class="h-8 w-8 p-0"
								>
									{#if copiedCode === invite.code}
										<Check class="h-4 w-4 text-green-500" />
									{:else}
										<Copy class="h-4 w-4" />
									{/if}
								</Button>
								<form method="POST" action="?/deleteInvite" use:enhance>
									<input type="hidden" name="inviteId" value={invite.id} />
									<Button
										type="submit"
										variant="ghost"
										size="sm"
										class="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
									>
										<Trash2 class="h-4 w-4" />
									</Button>
								</form>
							</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Members List -->
		<div class="mt-4 space-y-2">
			{#each data.members as member}
				{@const MemberRoleIcon = getRoleIcon(member.role)}
				<div class="flex items-center justify-between border border-border p-4">
					<div class="flex items-center gap-4">
						{#if member.avatarUrl}
							<img
								src={member.avatarUrl}
								alt={member.displayName ?? 'Member'}
								class="h-10 w-10 rounded-full border border-border"
							/>
						{:else}
							<div
								class="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted"
							>
								<UserIcon class="h-4 w-4 text-muted-foreground" />
							</div>
						{/if}
						<div>
							<p class="font-ui text-sm font-medium">{member.displayName ?? 'Unknown'}</p>
							<p class="font-body text-xs text-muted-foreground">{member.email}</p>
						</div>
					</div>
					<div class="flex items-center gap-4">
						<span
							class="inline-flex items-center gap-1 px-2 py-0.5 text-xs
							{member.role === 'owner' ? 'bg-yellow-500/10 text-yellow-600' : member.role === 'admin' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'}"
						>
							<MemberRoleIcon class="h-3 w-3" />
							{getRoleName(member.role)}
						</span>
						{#if data.userRole === 'owner' && member.role !== 'owner'}
							<form method="POST" action="?/updateMemberRole" use:enhance class="flex items-center gap-2">
								<input type="hidden" name="memberId" value={member.profileId} />
								<select
									name="role"
									class="h-8 border border-border bg-card px-2 font-body text-xs focus:border-primary focus:outline-none"
									value={member.role}
									onchange={(e) => e.currentTarget.form?.requestSubmit()}
								>
									<option value="member">Member</option>
									<option value="admin">Admin</option>
								</select>
							</form>
							<form method="POST" action="?/removeMember" use:enhance>
								<input type="hidden" name="memberId" value={member.profileId} />
								<Button
									type="submit"
									variant="ghost"
									size="sm"
									class="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
								>
									<Trash2 class="h-4 w-4" />
								</Button>
							</form>
						{/if}
					</div>
				</div>
			{/each}
		</div>
	</div>

	<!-- Danger Zone (Owner only) -->
	{#if data.userRole === 'owner'}
		<div class="mt-8 border-t border-destructive/30 pt-8">
			<span class="font-mono text-[10px] tracking-widest text-destructive">DANGER ZONE</span>
			
			<div class="mt-4 border border-destructive/30 bg-destructive/5 p-6">
				<h3 class="font-ui text-sm font-semibold tracking-wider text-destructive">DELETE ORGANIZATION</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Once you delete an organization, there is no going back. All data will be permanently removed.
					This action cannot be undone.
				</p>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Before deleting, ensure:
				</p>
				<ul class="font-body mt-1 ml-4 list-disc text-sm text-muted-foreground">
					<li>All projects have been deleted or transferred</li>
					<li>All open tickets have been closed</li>
					<li>All outstanding invoices have been settled</li>
				</ul>
				<form 
					method="POST" 
					action="?/deleteOrganization" 
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'redirect') {
								window.location.href = result.location;
							}
						};
					}}
					onsubmit={(e) => {
						const confirmed = confirm(
							`Are you sure you want to delete "${data.organization.name}"?\n\nThis action CANNOT be undone. All organization data will be permanently deleted.`
						);
						if (!confirmed) {
							e.preventDefault();
						}
					}}
				>
					<Button
						type="submit"
						variant="destructive"
						size="sm"
						class="mt-4 font-ui text-xs tracking-wider"
					>
						<Trash2 class="mr-2 h-4 w-4" />
						DELETE ORGANIZATION
					</Button>
				</form>
			</div>
		</div>
	{/if}
</div>
