<script lang="ts">
	/**
	 * Organizations Settings Page
	 * 
	 * Manage organization memberships
	 */
	import { Building2, Users, Crown, UserPlus, LogOut, Copy, Check, Plus } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	let { data } = $props();

	let inviteCode = $state('');
	let copied = $state(false);

	function copyInviteCode(code: string) {
		navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}

	function getRoleBadge(role: string) {
		switch (role) {
			case 'owner':
				return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', icon: Crown };
			case 'admin':
				return { bg: 'bg-blue-500/10', text: 'text-blue-500', icon: Users };
			default:
				return { bg: 'bg-muted', text: 'text-muted-foreground', icon: Users };
		}
	}
</script>

<svelte:head>
	<title>Organizations | MostlyWhat Systems</title>
</svelte:head>

<div class="px-6 py-8 md:px-12 lg:px-16">
	<!-- Section Header -->
	<div class="flex items-center gap-4">
		<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
			<Building2 class="h-5 w-5 text-primary" />
		</div>
		<div>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SETTINGS</span>
			<h2 class="font-ui text-lg font-semibold tracking-wider">Organizations</h2>
		</div>
	</div>

	<p class="font-body mt-4 text-sm text-muted-foreground">
		Manage your organization memberships and team settings.
	</p>

	<!-- Your Organizations -->
	<div class="mt-8">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">YOUR ORGANIZATIONS</span>
		
		{#if data.organizations && data.organizations.length > 0}
			<div class="mt-4 space-y-4">
				{#each data.organizations as org}
					{@const roleBadge = getRoleBadge(org.role)}
					<div class="border border-border p-6">
						<div class="flex items-start justify-between gap-4">
							<div class="flex items-center gap-4">
								<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
									{#if org.logoUrl}
										<img src={org.logoUrl} alt={org.name} class="h-12 w-12 object-cover" />
									{:else}
										<Building2 class="h-5 w-5 text-muted-foreground" />
									{/if}
								</div>
								<div>
									<h3 class="font-ui text-sm font-semibold tracking-wider">{org.name}</h3>
									<div class="mt-1 flex items-center gap-2">
										<span class="font-mono text-[10px] tracking-wider px-2 py-0.5 {roleBadge.bg} {roleBadge.text}">
											{org.role.toUpperCase()}
										</span>
										<span class="font-mono text-[10px] text-muted-foreground">
											{org.memberCount} {org.memberCount === 1 ? 'member' : 'members'}
										</span>
									</div>
								</div>
							</div>
							
							<div class="flex items-center gap-2">
								{#if org.role === 'owner' || org.role === 'admin'}
									<Button variant="outline" size="sm" class="font-ui text-[10px] tracking-wider">
										<UserPlus class="mr-1 h-3 w-3" />
										INVITE
									</Button>
								{/if}
								{#if org.role !== 'owner'}
									<Button variant="outline" size="sm" class="font-ui text-[10px] tracking-wider text-destructive hover:bg-destructive hover:text-destructive-foreground">
										<LogOut class="mr-1 h-3 w-3" />
										LEAVE
									</Button>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="mt-4 border border-border p-8 text-center">
				<Building2 class="mx-auto h-10 w-10 text-muted-foreground" />
				<p class="font-body mt-4 text-sm text-muted-foreground">
					You're not a member of any organization yet.
				</p>
			</div>
		{/if}
	</div>

	<!-- Join Organization -->
	<div class="mt-8 border-t border-border pt-8">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">JOIN AN ORGANIZATION</span>
		<p class="font-body mt-2 text-sm text-muted-foreground">
			Enter an invite code to join an existing organization.
		</p>

		<form method="POST" action="?/joinOrganization" class="mt-4 flex gap-4">
			<Input
				name="inviteCode"
				type="text"
				bind:value={inviteCode}
				placeholder="Enter invite code..."
				class="h-12 max-w-xs border-border bg-card px-4 font-mono tracking-wider"
			/>
			<Button type="submit" disabled={!inviteCode} class="font-ui text-xs tracking-wider">
				JOIN
			</Button>
		</form>
	</div>

	<!-- Create Organization -->
	<div class="mt-8 border-t border-border pt-8">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CREATE NEW ORGANIZATION</span>
		<p class="font-body mt-2 text-sm text-muted-foreground">
			Start a new organization and invite team members.
		</p>

		<Button href="/app/settings/organizations/new" variant="outline" class="font-ui mt-4 text-xs tracking-wider">
			<Plus class="mr-2 h-4 w-4" />
			CREATE ORGANIZATION
		</Button>
	</div>
</div>
