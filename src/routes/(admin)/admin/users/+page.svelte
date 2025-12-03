<script lang="ts">
	/**
	 * Admin Users List Page
	 * 
	 * Manages all users with role-based filtering and search.
	 */
	import { 
		Users, Search, Plus, MoreVertical, Filter, Download, 
		Mail, Shield, CheckCircle, Clock, ChevronRight, User as UserIcon
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	let { data } = $props();
	
	let searchQuery = $state('');
	let roleFilter = $state<string>('all');

	// Placeholder data - will be replaced with real data from database
	const users = [
		{ id: '1', email: 'admin@mostlywhat.systems', firstName: 'Admin', lastName: 'User', role: 'admin', status: 'active', lastLogin: '2024-12-01T10:30:00Z', createdAt: '2024-01-15T00:00:00Z' },
		{ id: '2', email: 'staff@mostlywhat.systems', firstName: 'Staff', lastName: 'Member', role: 'staff', status: 'active', lastLogin: '2024-12-01T09:00:00Z', createdAt: '2024-03-20T00:00:00Z' },
		{ id: '3', email: 'john@acme.com', firstName: 'John', lastName: 'Doe', role: 'customer', status: 'active', lastLogin: '2024-11-30T14:00:00Z', createdAt: '2024-06-10T00:00:00Z' },
		{ id: '4', email: 'jane@global.com', firstName: 'Jane', lastName: 'Smith', role: 'customer', status: 'pending', lastLogin: null, createdAt: '2024-12-01T08:00:00Z' },
		{ id: '5', email: 'bob@startup.com', firstName: 'Bob', lastName: 'Wilson', role: 'customer', status: 'inactive', lastLogin: '2024-10-15T00:00:00Z', createdAt: '2024-02-28T00:00:00Z' }
	];

	const filteredUsers = $derived(
		users.filter(user => {
			const matchesSearch = searchQuery === '' || 
				user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
				`${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesRole = roleFilter === 'all' || user.role === roleFilter;
			return matchesSearch && matchesRole;
		})
	);

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return 'Never';
		return new Date(dateStr).toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric', 
			year: 'numeric' 
		});
	}

	function getRoleBadgeClass(role: string): string {
		switch (role) {
			case 'super_admin': return 'bg-red-500/10 text-red-500 border-red-500/30';
			case 'admin': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
			case 'staff': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
			default: return 'bg-primary/10 text-primary border-primary/30';
		}
	}

	function getStatusBadge(status: string): { class: string; label: string } {
		switch (status) {
			case 'active': return { class: 'bg-green-500/10 text-green-500', label: 'Active' };
			case 'pending': return { class: 'bg-yellow-500/10 text-yellow-500', label: 'Pending' };
			case 'inactive': return { class: 'bg-muted text-muted-foreground', label: 'Inactive' };
			default: return { class: 'bg-muted text-muted-foreground', label: status };
		}
	}
</script>

<svelte:head>
	<title>Users | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// USER MANAGEMENT</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Users</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Manage user accounts, roles, and permissions.
				</p>
			</div>
			<div class="flex items-center gap-3">
				<Button variant="outline" size="sm" class="font-ui text-xs tracking-wider">
					<Download class="mr-2 h-4 w-4" />
					EXPORT
				</Button>
				<Button href="/admin/users/new" size="sm" class="font-ui text-xs tracking-wider">
					<Plus class="mr-2 h-4 w-4" />
					ADD USER
				</Button>
			</div>
		</div>
	</section>

	<!-- Filters Bar -->
	<section class="border-b border-border bg-card">
		<div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
			<!-- Search -->
			<div class="relative flex-1 md:max-w-sm">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search users..."
					bind:value={searchQuery}
					class="font-body h-10 w-full rounded-none border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			
			<!-- Role Filter -->
			<div class="flex items-center gap-3">
				<Filter class="h-4 w-4 text-muted-foreground" />
				<select
					bind:value={roleFilter}
					class="font-mono h-10 rounded-none border border-border bg-background px-4 text-xs tracking-wider focus:border-primary focus:outline-none"
				>
					<option value="all">ALL ROLES</option>
					<option value="super_admin">SUPER ADMIN</option>
					<option value="admin">ADMIN</option>
					<option value="staff">STAFF</option>
					<option value="customer">CUSTOMER</option>
				</select>
			</div>
		</div>
	</section>

	<!-- Stats Bar -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-3 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-primary">{users.length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL USERS</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-green-500">{users.filter(u => u.status === 'active').length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">ACTIVE</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-yellow-500">{users.filter(u => u.status === 'pending').length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">PENDING</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-blue-500">{users.filter(u => u.role !== 'customer').length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">STAFF</p>
			</div>
		</div>
	</section>

	<!-- Users List -->
	<section class="border-b border-border bg-background">
		{#if filteredUsers.length > 0}
			<div class="divide-y divide-border">
				{#each filteredUsers as user}
					{@const status = getStatusBadge(user.status)}
					<a
						href="/admin/users/{user.id}"
						class="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-card md:px-12 lg:px-16"
					>
						<!-- Avatar -->
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
							<UserIcon class="h-5 w-5 text-primary" />
						</div>

						<!-- User Info -->
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-3">
								<h3 class="font-ui text-sm font-semibold tracking-wider truncate">
									{user.firstName} {user.lastName}
								</h3>
								<span class="flex items-center gap-1 border px-2 py-0.5 {getRoleBadgeClass(user.role)}">
									<Shield class="h-3 w-3" />
									<span class="font-mono text-[10px] tracking-wider uppercase">{user.role}</span>
								</span>
							</div>
							<p class="font-body mt-1 text-xs text-muted-foreground truncate">{user.email}</p>
						</div>

						<!-- Status -->
						<div class="hidden md:block">
							<span class="inline-flex items-center gap-1 px-2 py-1 {status.class}">
								<CheckCircle class="h-3 w-3" />
								<span class="font-mono text-[10px] tracking-wider">{status.label}</span>
							</span>
						</div>

						<!-- Last Login -->
						<div class="hidden text-right lg:block">
							<p class="font-mono text-[10px] tracking-wider text-muted-foreground">LAST LOGIN</p>
							<p class="font-body text-xs">{formatDate(user.lastLogin)}</p>
						</div>

						<!-- Arrow -->
						<ChevronRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
					</a>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-16">
				<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
					<Users class="h-8 w-8 text-muted-foreground/50" />
				</div>
				<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO USERS FOUND</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					{searchQuery || roleFilter !== 'all' ? 'Try adjusting your filters.' : 'Start by adding your first user.'}
				</p>
				{#if !searchQuery && roleFilter === 'all'}
					<Button href="/admin/users/new" class="mt-6 font-ui text-xs tracking-wider">
						<Plus class="mr-2 h-4 w-4" />
						ADD USER
					</Button>
				{/if}
			</div>
		{/if}
	</section>
</div>
