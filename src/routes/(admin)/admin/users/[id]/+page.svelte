<script lang="ts">
	/**
	 * Admin User Detail Page
	 * 
	 * Displays user profile, organization memberships, stats, and activity.
	 */
	import { enhance } from '$app/forms';
	import { 
		ArrowLeft, User as UserIcon, Shield, Mail, Phone, Clock, 
		Building2, Ticket, FolderKanban, Activity, Edit2, Save, X,
		Trash2, AlertCircle, CheckCircle
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { NativeSelect } from '$lib/components/ui/native-select';
	import { PageHeader, PageSection, ActionButtons } from '$lib/components/ui/layouts';

	let { data, form } = $props();

	let isEditingProfile = $state(false);
	let isEditingRole = $state(false);
	let editedFirstName = $state(data.user.firstName ?? '');
	let editedLastName = $state(data.user.lastName ?? '');
	let editedPhone = $state(data.user.phone ?? '');
	let selectedRole = $state(data.user.role);

	// Sync edited values when data changes
	$effect(() => {
		editedFirstName = data.user.firstName ?? '';
		editedLastName = data.user.lastName ?? '';
		editedPhone = data.user.phone ?? '';
		selectedRole = data.user.role;
	});

	function formatDate(dateStr: string | Date | null): string {
		if (!dateStr) return 'Never';
		return new Date(dateStr).toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric', 
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatRelativeTime(dateStr: string | Date | null): string {
		if (!dateStr) return 'Never';
		const date = new Date(dateStr);
		const now = new Date();
		const diff = now.getTime() - date.getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);
		
		if (minutes < 1) return 'Just now';
		if (minutes < 60) return `${minutes}m ago`;
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		return formatDate(dateStr);
	}

	function getRoleBadgeClass(role: string): string {
		switch (role) {
			case 'super_admin': return 'bg-red-500/10 text-red-500 border-red-500/30';
			case 'admin': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
			case 'staff': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
			default: return 'bg-primary/10 text-primary border-primary/30';
		}
	}

	function getOrgRoleBadgeClass(role: string): string {
		switch (role) {
			case 'owner': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
			case 'admin': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
			default: return 'bg-muted text-muted-foreground border-border';
		}
	}

	function getActivityIcon(activityType: string) {
		switch (activityType) {
			case 'created':
			case 'updated':
				return Ticket;
			case 'status_changed':
				return FolderKanban;
			case 'comment_added':
				return Activity;
			default:
				return Activity;
		}
	}

	function cancelProfileEdit() {
		isEditingProfile = false;
		editedFirstName = data.user.firstName ?? '';
		editedLastName = data.user.lastName ?? '';
		editedPhone = data.user.phone ?? '';
	}

	function cancelRoleEdit() {
		isEditingRole = false;
		selectedRole = data.user.role;
	}
</script>

<svelte:head>
	<title>{data.user.displayName || data.user.email} | Users | Admin</title>
</svelte:head>

<div class="min-h-screen bg-muted/30">
	<!-- Header -->
	<div class="border-b border-border bg-background">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div class="flex items-center gap-4">
				<a href="/admin/users" class="text-muted-foreground hover:text-foreground transition-colors">
					<ArrowLeft class="h-5 w-5" />
				</a>
				<div class="flex h-14 w-14 items-center justify-center border border-border bg-card">
					{#if data.user.avatarUrl}
						<img src={data.user.avatarUrl} alt="" class="h-full w-full object-cover" />
					{:else}
						<UserIcon class="h-7 w-7 text-primary" />
					{/if}
				</div>
				<div class="flex-1">
					<div class="flex items-center gap-3">
						<h1 class="font-display text-2xl font-bold">
							{data.user.displayName || `${data.user.firstName ?? ''} ${data.user.lastName ?? ''}`.trim() || 'Unnamed User'}
						</h1>
						<span class="flex items-center gap-1 border px-2 py-0.5 {getRoleBadgeClass(data.user.role)}">
							<Shield class="h-3 w-3" />
							<span class="font-mono text-[10px] tracking-wider uppercase">{data.user.role}</span>
						</span>
					</div>
					<p class="font-body mt-1 text-sm text-muted-foreground">{data.user.email}</p>
				</div>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		<!-- Form Messages -->
		{#if form?.error}
			<div class="mb-6 flex items-center gap-2 border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
				<AlertCircle class="h-4 w-4" />
				{form.error}
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-6 flex items-center gap-2 border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">
				<CheckCircle class="h-4 w-4" />
				{form.message}
			</div>
		{/if}

		<!-- Stats Bar -->
		<div class="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
			<div class="border border-border bg-background p-4">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center bg-blue-500/10">
						<Ticket class="h-5 w-5 text-blue-500" />
					</div>
					<div>
						<span class="font-display text-2xl font-bold">{data.stats.ticketsCreated}</span>
						<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TICKETS CREATED</p>
					</div>
				</div>
			</div>
			<div class="border border-border bg-background p-4">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center bg-green-500/10">
						<Ticket class="h-5 w-5 text-green-500" />
					</div>
					<div>
						<span class="font-display text-2xl font-bold">{data.stats.ticketsAssigned}</span>
						<p class="font-mono text-[10px] tracking-wider text-muted-foreground">ASSIGNED TICKETS</p>
					</div>
				</div>
			</div>
			<div class="border border-border bg-background p-4">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center bg-purple-500/10">
						<FolderKanban class="h-5 w-5 text-purple-500" />
					</div>
					<div>
						<span class="font-display text-2xl font-bold">{data.stats.projectsAssigned}</span>
						<p class="font-mono text-[10px] tracking-wider text-muted-foreground">PROJECTS</p>
					</div>
				</div>
			</div>
			<div class="border border-border bg-background p-4">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center bg-amber-500/10">
						<Building2 class="h-5 w-5 text-amber-500" />
					</div>
					<div>
						<span class="font-display text-2xl font-bold">{data.stats.organizationCount}</span>
						<p class="font-mono text-[10px] tracking-wider text-muted-foreground">ORGANIZATIONS</p>
					</div>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Main Content -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Profile Information -->
				<div class="border border-border bg-background">
					<div class="flex items-center justify-between border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">PROFILE INFORMATION</h2>
						{#if !isEditingProfile}
							<Button 
								variant="ghost" 
								size="sm" 
								onclick={() => isEditingProfile = true}
								class="font-mono text-[10px] tracking-wider"
							>
								<Edit2 class="mr-1 h-3 w-3" />
								EDIT
							</Button>
						{/if}
					</div>
					
					{#if isEditingProfile}
						<form method="POST" action="?/updateProfile" use:enhance={() => {
							return async ({ update }) => {
								await update();
								isEditingProfile = false;
							};
						}}>
							<div class="grid gap-4 p-6">
								<div class="grid grid-cols-2 gap-4">
									<div>
										<Label for="firstName" class="font-mono text-[10px] tracking-wider text-muted-foreground">FIRST NAME</Label>
										<Input 
											id="firstName"
											type="text" 
											name="firstName"
											bind:value={editedFirstName}
											class="mt-1"
										/>
									</div>
									<div>
										<Label for="lastName" class="font-mono text-[10px] tracking-wider text-muted-foreground">LAST NAME</Label>
										<Input 
											id="lastName"
											type="text" 
											name="lastName"
											bind:value={editedLastName}
											class="mt-1"
										/>
									</div>
								</div>
								<div>
									<Label for="phone" class="font-mono text-[10px] tracking-wider text-muted-foreground">PHONE</Label>
									<Input 
										id="phone"
										type="tel" 
										name="phone"
										bind:value={editedPhone}
										class="mt-1"
									/>
								</div>
								<div class="flex justify-end gap-2">
									<Button type="button" variant="outline" size="sm" onclick={cancelProfileEdit}>
										<X class="mr-1 h-3 w-3" />
										Cancel
									</Button>
									<Button type="submit" size="sm">
										<Save class="mr-1 h-3 w-3" />
										Save
									</Button>
								</div>
							</div>
						</form>
					{:else}
						<div class="grid gap-4 p-6">
							<div class="grid grid-cols-2 gap-4">
								<div>
									<p class="font-mono text-[10px] tracking-wider text-muted-foreground">FIRST NAME</p>
									<p class="mt-1 text-sm">{data.user.firstName || '—'}</p>
								</div>
								<div>
									<p class="font-mono text-[10px] tracking-wider text-muted-foreground">LAST NAME</p>
									<p class="mt-1 text-sm">{data.user.lastName || '—'}</p>
								</div>
							</div>
							<div>
								<p class="font-mono text-[10px] tracking-wider text-muted-foreground">EMAIL</p>
								<p class="mt-1 flex items-center gap-2 text-sm">
									<Mail class="h-4 w-4 text-muted-foreground" />
									{data.user.email}
								</p>
							</div>
							<div>
								<p class="font-mono text-[10px] tracking-wider text-muted-foreground">PHONE</p>
								<p class="mt-1 flex items-center gap-2 text-sm">
									<Phone class="h-4 w-4 text-muted-foreground" />
									{data.user.phone || '—'}
								</p>
							</div>
						</div>
					{/if}
				</div>

				<!-- Organization Memberships -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">
							ORGANIZATIONS ({data.memberships.length})
						</h2>
					</div>
					
					{#if data.memberships.length === 0}
						<div class="p-6 text-center text-muted-foreground">
							<Building2 class="mx-auto h-8 w-8 opacity-50" />
							<p class="mt-2 text-sm">No organization memberships</p>
						</div>
					{:else}
						<div class="divide-y divide-border">
							{#each data.memberships as membership}
								<div class="flex items-center justify-between p-4">
									<div class="flex items-center gap-3">
										<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
											{#if membership.organizationLogoUrl}
												<img src={membership.organizationLogoUrl} alt="" class="h-full w-full object-cover" />
											{:else}
												<Building2 class="h-5 w-5 text-muted-foreground" />
											{/if}
										</div>
										<div>
											<a href="/admin/organizations/{membership.organizationId}" class="font-medium hover:text-primary transition-colors">
												{membership.organizationName}
											</a>
											<div class="flex items-center gap-2 mt-0.5">
												<span class="text-xs text-muted-foreground">@{membership.organizationSlug}</span>
												<span class="flex items-center gap-1 border px-1.5 py-0.5 {getOrgRoleBadgeClass(membership.role)}">
													<span class="font-mono text-[9px] tracking-wider uppercase">{membership.role}</span>
												</span>
											</div>
										</div>
									</div>
									<form method="POST" action="?/removeFromOrganization" use:enhance>
										<input type="hidden" name="organizationId" value={membership.organizationId} />
										<Button 
											type="submit" 
											variant="ghost" 
											size="sm" 
											class="text-muted-foreground hover:text-destructive"
											title="Remove from organization"
										>
											<Trash2 class="h-4 w-4" />
										</Button>
									</form>
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Recent Activity -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">
							RECENT ACTIVITY ({data.recentActivity.length})
						</h2>
					</div>
					
					{#if data.recentActivity.length === 0}
						<div class="p-6 text-center text-muted-foreground">
							<Activity class="mx-auto h-8 w-8 opacity-50" />
							<p class="mt-2 text-sm">No recent activity</p>
						</div>
					{:else}
						<div class="divide-y divide-border">
							{#each data.recentActivity as activity}
								{@const Icon = getActivityIcon(activity.activityType)}
								<div class="flex items-start gap-3 p-4">
									<div class="flex h-8 w-8 items-center justify-center bg-muted">
										<Icon class="h-4 w-4 text-muted-foreground" />
									</div>
									<div class="flex-1 min-w-0">
										<p class="text-sm">
											<span class="font-medium">{activity.activityType.replace(/_/g, ' ')}</span>
											{#if activity.entityType && activity.entityId}
												<span class="text-muted-foreground"> on {activity.entityType}</span>
											{/if}
										</p>
										{#if activity.description}
											<p class="mt-0.5 text-xs text-muted-foreground truncate">
												{activity.description}
											</p>
										{/if}
									</div>
									<span class="text-xs text-muted-foreground whitespace-nowrap">
										{formatRelativeTime(activity.createdAt)}
									</span>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Account Status -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">ACCOUNT STATUS</h2>
					</div>
					<div class="p-6 space-y-4">
						<div>
							<p class="font-mono text-[10px] tracking-wider text-muted-foreground">ONBOARDING</p>
							<p class="mt-1 flex items-center gap-2 text-sm">
								{#if data.user.onboardingCompleted}
									<CheckCircle class="h-4 w-4 text-green-500" />
									<span class="text-green-500">Completed</span>
								{:else}
									<Clock class="h-4 w-4 text-yellow-500" />
									<span class="text-yellow-500">Pending</span>
								{/if}
							</p>
						</div>
						<div>
							<p class="font-mono text-[10px] tracking-wider text-muted-foreground">CREATED</p>
							<p class="mt-1 flex items-center gap-2 text-sm">
								<Clock class="h-4 w-4 text-muted-foreground" />
								{formatDate(data.user.createdAt)}
							</p>
						</div>
						<div>
							<p class="font-mono text-[10px] tracking-wider text-muted-foreground">LAST LOGIN</p>
							<p class="mt-1 flex items-center gap-2 text-sm">
								<Clock class="h-4 w-4 text-muted-foreground" />
								{formatDate(data.user.lastLoginAt)}
							</p>
						</div>
						<div>
							<p class="font-mono text-[10px] tracking-wider text-muted-foreground">LAST UPDATED</p>
							<p class="mt-1 flex items-center gap-2 text-sm">
								<Clock class="h-4 w-4 text-muted-foreground" />
								{formatDate(data.user.updatedAt)}
							</p>
						</div>
					</div>
				</div>

				<!-- Role Management -->
				<div class="border border-border bg-background">
					<div class="flex items-center justify-between border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">ROLE</h2>
						{#if !isEditingRole}
							<Button 
								variant="ghost" 
								size="sm" 
								onclick={() => isEditingRole = true}
								class="font-mono text-[10px] tracking-wider"
							>
								<Edit2 class="mr-1 h-3 w-3" />
								CHANGE
							</Button>
						{/if}
					</div>
					
					{#if isEditingRole}
						<form method="POST" action="?/updateRole" use:enhance={() => {
							return async ({ update }) => {
								await update();
								isEditingRole = false;
							};
						}}>
						<div class="p-6 space-y-4">
							<NativeSelect 
								name="role"
								bind:value={selectedRole}
								class="w-full"
							>
								<option value="customer">CUSTOMER</option>
								<option value="staff">STAFF</option>
								<option value="admin">ADMIN</option>
								<option value="super_admin">SUPER ADMIN</option>
							</NativeSelect>
								<div class="flex justify-end gap-2">
									<Button type="button" variant="outline" size="sm" onclick={cancelRoleEdit}>
										<X class="mr-1 h-3 w-3" />
										Cancel
									</Button>
									<Button type="submit" size="sm">
										<Save class="mr-1 h-3 w-3" />
										Save
									</Button>
								</div>
							</div>
						</form>
					{:else}
						<div class="p-6">
							<span class="flex items-center gap-2 border px-3 py-2 {getRoleBadgeClass(data.user.role)}">
								<Shield class="h-4 w-4" />
								<span class="font-mono text-xs tracking-wider uppercase">{data.user.role}</span>
							</span>
							<p class="mt-3 text-xs text-muted-foreground">
								{#if data.user.role === 'super_admin'}
									Full system access with all permissions.
								{:else if data.user.role === 'admin'}
									Administrative access to most features.
								{:else if data.user.role === 'staff'}
									Staff access for support and projects.
								{:else}
									Standard customer account.
								{/if}
							</p>
						</div>
					{/if}
				</div>

				<!-- Danger Zone -->
				<div class="border border-destructive/30 bg-destructive/5">
					<div class="border-b border-destructive/30 px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-destructive">DANGER ZONE</h2>
					</div>
					<div class="p-6 space-y-4">
						<p class="text-xs text-muted-foreground">
							These actions are irreversible. Please be certain.
						</p>
						<Button 
							variant="outline" 
							size="sm" 
							class="w-full border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground"
							disabled
						>
							<Trash2 class="mr-2 h-4 w-4" />
							DELETE USER
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
