<script lang="ts">
	/**
	 * Organizations Settings Page
	 *
	 * View and manage organization memberships
	 */
	import { goto } from '$app/navigation';
	import { Building2, Users, FolderKanban, Ticket, Crown, Shield, User as UserIcon, Plus, ChevronRight, Link2, Loader2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { PageSection, EmptyState } from '$lib/components/ui/layouts';

	let { data } = $props();

	let showJoinForm = $state(false);
	let inviteCode = $state('');
	let isJoining = $state(false);

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

	async function handleJoinWithCode() {
		if (!inviteCode.trim()) return;
		isJoining = true;
		await goto(`/join/${inviteCode.trim()}`);
	}
</script>

<svelte:head>
	<title>Organizations | Settings | MostlyWhat Systems</title>
</svelte:head>

<div class="px-6 py-8 md:px-12 lg:px-16">
	<!-- Section Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
				<Building2 class="h-5 w-5 text-primary" />
			</div>
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SETTINGS</span>
				<h2 class="font-ui text-lg font-semibold tracking-wider">Organizations</h2>
			</div>
		</div>
		<div class="flex items-center gap-3">
			<Button onclick={() => (showJoinForm = !showJoinForm)} variant="outline" size="sm" class="font-ui text-xs tracking-wider">
				<Link2 class="mr-2 h-4 w-4" />
				JOIN
			</Button>
			<Button href="/app/settings/organizations/new" size="sm" class="font-ui text-xs tracking-wider">
				<Plus class="mr-2 h-4 w-4" />
				NEW
			</Button>
		</div>
	</div>

	<p class="mt-4 font-body text-sm text-muted-foreground">
		View and manage your organization memberships. Organization owners can manage members and
		settings.
	</p>

	<!-- Join with Code Form -->
	{#if showJoinForm}
		<div class="mt-6 border border-border bg-card p-6">
			<h3 class="font-ui text-sm font-semibold tracking-wider">Join with Invite Code</h3>
			<p class="mt-1 font-body text-sm text-muted-foreground">
				Enter an invite code to join an existing organization.
			</p>
			<div class="mt-4 flex items-end gap-3">
				<div class="flex-1">
					<Input
						type="text"
						bind:value={inviteCode}
						placeholder="Enter invite code"
						class="h-10 border-border bg-background px-4 font-mono"
					/>
				</div>
				<Button onclick={handleJoinWithCode} disabled={isJoining || !inviteCode.trim()} class="font-ui text-xs tracking-wider">
					{#if isJoining}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						JOINING...
					{:else}
						JOIN
					{/if}
				</Button>
				<Button variant="outline" onclick={() => { showJoinForm = false; inviteCode = ''; }} class="font-ui text-xs tracking-wider">
					CANCEL
				</Button>
			</div>
		</div>
	{/if}

	<!-- Organizations List -->
	<div class="mt-8 space-y-4">
		{#if data.organizations.length === 0}
			<div class="flex flex-col items-center justify-center border border-dashed border-border p-12 text-center">
				<Building2 class="h-12 w-12 text-muted-foreground/30" />
				<h3 class="mt-4 font-ui text-sm font-semibold tracking-wider">NO ORGANIZATIONS</h3>
				<p class="mt-2 max-w-sm font-body text-sm text-muted-foreground">
					You're not a member of any organizations yet. Create one or ask to be invited.
				</p>
				<Button
					href="/app/settings/organizations/new"
					class="mt-6 font-ui text-xs tracking-wider"
				>
					<Plus class="mr-2 h-4 w-4" />
					CREATE ORGANIZATION
				</Button>
			</div>
		{:else}
			{#each data.organizations as org}
				{@const RoleIcon = getRoleIcon(org.memberRole)}
				<div class="border border-border bg-card transition-colors hover:border-primary/50">
					<div class="flex items-start justify-between p-6">
						<div class="flex items-start gap-4">
							{#if org.logoUrl}
								<img
									src={org.logoUrl}
									alt={org.name}
									class="h-12 w-12 border border-border object-cover"
								/>
							{:else}
								<div
									class="flex h-12 w-12 items-center justify-center border border-border bg-background"
								>
									<Building2 class="h-5 w-5 text-muted-foreground" />
								</div>
							{/if}
							<div>
								<h3 class="font-ui text-sm font-semibold tracking-wider">{org.name}</h3>
								<p class="mt-1 font-mono text-[10px] tracking-wider text-muted-foreground">
									{org.orgNumber}
								</p>
								<div class="mt-2 flex items-center gap-2">
									<span
										class="inline-flex items-center gap-1 px-2 py-0.5 text-xs
										{org.memberRole === 'owner' ? 'bg-yellow-500/10 text-yellow-600' : org.memberRole === 'admin' ? 'bg-blue-500/10 text-blue-500' : 'bg-muted text-muted-foreground'}"
									>
										<RoleIcon class="h-3 w-3" />
										{getRoleName(org.memberRole)}
									</span>
									<span class="font-body text-xs text-muted-foreground">
										since {formatDate(org.joinedAt)}
									</span>
								</div>
							</div>
						</div>
						{#if org.memberRole === 'owner' || org.memberRole === 'admin'}
							<Button
								href="/app/settings/organizations/{org.id}"
								variant="outline"
								size="sm"
								class="font-ui text-xs tracking-wider"
							>
								MANAGE
								<ChevronRight class="ml-2 h-3 w-3" />
							</Button>
						{/if}
					</div>

					<!-- Stats -->
					<div class="grid grid-cols-3 gap-px border-t border-border bg-border">
						<div class="flex items-center gap-2 bg-background px-6 py-3">
							<Users class="h-4 w-4 text-muted-foreground" />
							<span class="font-mono text-sm">{org.memberCount}</span>
							<span class="font-body text-xs text-muted-foreground">members</span>
						</div>
						<div class="flex items-center gap-2 bg-background px-6 py-3">
							<FolderKanban class="h-4 w-4 text-muted-foreground" />
							<span class="font-mono text-sm">{org.projectCount}</span>
							<span class="font-body text-xs text-muted-foreground">projects</span>
						</div>
						<div class="flex items-center gap-2 bg-background px-6 py-3">
							<Ticket class="h-4 w-4 text-muted-foreground" />
							<span class="font-mono text-sm">{org.openTickets}</span>
							<span class="font-body text-xs text-muted-foreground">open tickets</span>
						</div>
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
