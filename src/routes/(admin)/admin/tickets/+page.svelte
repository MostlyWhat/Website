<script lang="ts">
	/**
	 * Admin Tickets List Page
	 */
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { enhance } from '$app/forms';
	import { 
		Ticket, Search, Plus, Building2, User, Calendar, 
		ChevronRight, Filter, Clock, CheckCircle, MessageSquare, AlertTriangle, Tag, X, 
		CheckSquare, Square, Trash2, UserPlus, AlertCircle
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data, form } = $props();
	
	// Get initial values from server data
	let searchQuery = $state(data.filters?.search ?? '');
	let statusFilter = $state<string>(data.filters?.status ?? 'all');
	let priorityFilter = $state<string>(data.filters?.priority ?? 'all');
	let categoryFilter = $state<string>(data.filters?.category ?? 'all');
	let assignedFilter = $state<string>(data.filters?.assignedTo ?? 'all');
	let searchTimeout: ReturnType<typeof setTimeout>;

	// Bulk selection state
	let selectedTickets = $state<Set<string>>(new Set());
	let showBulkActions = $state(false);

	// Get tickets from server data (already filtered server-side)
	const tickets = $derived(data.tickets ?? []);

	// Check if all visible tickets are selected
	const allSelected = $derived(
		tickets.length > 0 && selectedTickets.size === tickets.length
	);

	// Toggle single ticket selection
	function toggleTicket(id: string) {
		if (selectedTickets.has(id)) {
			selectedTickets.delete(id);
		} else {
			selectedTickets.add(id);
		}
		selectedTickets = new Set(selectedTickets); // trigger reactivity
	}

	// Toggle all tickets
	function toggleAll() {
		if (allSelected) {
			selectedTickets.clear();
		} else {
			tickets.forEach(t => selectedTickets.add(t.id));
		}
		selectedTickets = new Set(selectedTickets); // trigger reactivity
	}

	// Clear selection
	function clearSelection() {
		selectedTickets.clear();
		selectedTickets = new Set(selectedTickets);
	}

	// Get selected ticket IDs as comma-separated string
	const selectedIds = $derived(Array.from(selectedTickets).join(','));

	// Update URL when filters change
	function updateFilters() {
		clearSelection(); // Clear selection when filters change
		const params = new URLSearchParams();
		if (searchQuery) params.set('q', searchQuery);
		if (statusFilter !== 'all') params.set('status', statusFilter);
		if (priorityFilter !== 'all') params.set('priority', priorityFilter);
		if (categoryFilter !== 'all') params.set('category', categoryFilter);
		if (assignedFilter !== 'all') params.set('assigned', assignedFilter);
		
		const query = params.toString();
		goto(`/admin/tickets${query ? '?' + query : ''}`, { keepFocus: true });
	}

	// Debounce search input
	function handleSearchInput() {
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			updateFilters();
		}, 300);
	}

	// Reset all filters
	function clearFilters() {
		searchQuery = '';
		statusFilter = 'all';
		priorityFilter = 'all';
		categoryFilter = 'all';
		assignedFilter = 'all';
		clearSelection();
		goto('/admin/tickets');
	}

	// Check if any filters are active
	const hasActiveFilters = $derived(
		searchQuery !== '' || 
		statusFilter !== 'all' || 
		priorityFilter !== 'all' || 
		categoryFilter !== 'all' ||
		assignedFilter !== 'all'
	);

	function formatTimeAgo(dateStr: string | Date | null): string {
		if (!dateStr) return 'Unknown';
		const date = new Date(dateStr);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffDays > 0) return `${diffDays}d ago`;
		if (diffHours > 0) return `${diffHours}h ago`;
		if (diffMins > 0) return `${diffMins}m ago`;
		return 'Just now';
	}

	function getStatusConfig(status: string): { icon: typeof Clock; class: string; label: string } {
		switch (status) {
			case 'open': return { icon: Clock, class: 'bg-blue-500/10 text-blue-500', label: 'Open' };
			case 'in_progress': return { icon: Clock, class: 'bg-yellow-500/10 text-yellow-500', label: 'In Progress' };
			case 'awaiting_customer': return { icon: MessageSquare, class: 'bg-purple-500/10 text-purple-500', label: 'Awaiting Customer' };
			case 'awaiting_staff': return { icon: MessageSquare, class: 'bg-orange-500/10 text-orange-500', label: 'Awaiting Staff' };
			case 'resolved': return { icon: CheckCircle, class: 'bg-green-500/10 text-green-500', label: 'Resolved' };
			case 'closed': return { icon: CheckCircle, class: 'bg-muted text-muted-foreground', label: 'Closed' };
			default: return { icon: Clock, class: 'bg-muted text-muted-foreground', label: status };
		}
	}

	function getPriorityConfig(priority: string): { class: string; label: string } {
		switch (priority) {
			case 'urgent': return { class: 'bg-red-500 text-white', label: 'URGENT' };
			case 'high': return { class: 'bg-orange-500/10 text-orange-500 border border-orange-500/30', label: 'HIGH' };
			case 'medium': return { class: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30', label: 'MEDIUM' };
			case 'low': return { class: 'bg-muted text-muted-foreground border border-border', label: 'LOW' };
			default: return { class: 'bg-muted text-muted-foreground', label: priority };
		}
	}
</script>

<svelte:head>
	<title>Tickets | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// TICKET MANAGEMENT</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Tickets</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Manage support tickets and customer inquiries.
				</p>
			</div>
			<Button href="/admin/tickets/new" size="sm" class="font-ui text-xs tracking-wider">
				<Plus class="mr-2 h-4 w-4" />
				NEW TICKET
			</Button>
		</div>
	</section>

	<!-- Filters Bar -->
	<section class="border-b border-border bg-card">
		<div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
			<div class="relative flex-1 md:max-w-sm">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search tickets, customers, organizations..."
					bind:value={searchQuery}
					oninput={handleSearchInput}
					class="font-body h-10 w-full rounded-none border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			
			<div class="flex items-center gap-3 flex-wrap">
				<Filter class="h-4 w-4 text-muted-foreground" />
				<select
					bind:value={statusFilter}
					onchange={updateFilters}
					class="font-mono h-10 rounded-none border border-border bg-background px-4 text-xs tracking-wider focus:border-primary focus:outline-none"
				>
					<option value="all">ALL STATUS</option>
					<option value="open">OPEN</option>
					<option value="in_progress">IN PROGRESS</option>
					<option value="waiting_on_customer">WAITING ON CUSTOMER</option>
					<option value="resolved">RESOLVED</option>
					<option value="closed">CLOSED</option>
				</select>
				<select
					bind:value={priorityFilter}
					onchange={updateFilters}
					class="font-mono h-10 rounded-none border border-border bg-background px-4 text-xs tracking-wider focus:border-primary focus:outline-none"
				>
					<option value="all">ALL PRIORITY</option>
					<option value="urgent">URGENT</option>
					<option value="high">HIGH</option>
					<option value="medium">MEDIUM</option>
					<option value="low">LOW</option>
				</select>
				<select
					bind:value={categoryFilter}
					onchange={updateFilters}
					class="font-mono h-10 rounded-none border border-border bg-background px-4 text-xs tracking-wider focus:border-primary focus:outline-none"
				>
					<option value="all">ALL CATEGORIES</option>
					<option value="general">GENERAL</option>
					<option value="billing">BILLING</option>
					<option value="technical">TECHNICAL</option>
					<option value="feature">FEATURE</option>
					<option value="bug">BUG</option>
					<option value="account">ACCOUNT</option>
					<option value="security">SECURITY</option>
				</select>
				<select
					bind:value={assignedFilter}
					onchange={updateFilters}
					class="font-mono h-10 rounded-none border border-border bg-background px-4 text-xs tracking-wider focus:border-primary focus:outline-none"
				>
					<option value="all">ALL ASSIGNEES</option>
					<option value="me">ASSIGNED TO ME</option>
					<option value="unassigned">UNASSIGNED</option>
					{#each data.staffMembers ?? [] as staff}
						<option value={staff.id}>{staff.displayName}</option>
					{/each}
				</select>
				{#if hasActiveFilters}
					<button
						onclick={clearFilters}
						class="flex items-center gap-1 px-3 py-2 text-xs font-mono tracking-wider text-muted-foreground hover:text-foreground transition-colors"
					>
						<X class="h-3 w-3" />
						CLEAR
					</button>
				{/if}
			</div>
		</div>
	</section>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="border-b border-green-500/20 bg-green-500/5 px-6 py-3 md:px-12 lg:px-16">
			<div class="flex items-center gap-2 text-sm text-green-500">
				<CheckCircle class="h-4 w-4" />
				{form.message}
			</div>
		</div>
	{/if}
	{#if form?.error}
		<div class="border-b border-red-500/20 bg-red-500/5 px-6 py-3 md:px-12 lg:px-16">
			<div class="flex items-center gap-2 text-sm text-red-500">
				<AlertCircle class="h-4 w-4" />
				{form.error}
			</div>
		</div>
	{/if}

	<!-- Bulk Actions Bar -->
	{#if selectedTickets.size > 0}
		<section class="sticky top-0 z-10 border-b border-primary/30 bg-primary/5 backdrop-blur">
			<div class="flex items-center gap-4 px-6 py-3 md:px-12 lg:px-16">
				<div class="flex items-center gap-2">
					<CheckSquare class="h-4 w-4 text-primary" />
					<span class="font-mono text-xs tracking-wider text-primary">
						{selectedTickets.size} SELECTED
					</span>
					<button
						onclick={clearSelection}
						class="ml-2 text-muted-foreground hover:text-foreground"
					>
						<X class="h-4 w-4" />
					</button>
				</div>
				
				<div class="flex items-center gap-2 ml-auto">
					<!-- Bulk Status Update -->
					<form 
						method="POST" 
						action="?/bulkUpdateStatus" 
						use:enhance={() => {
							return async ({ update }) => {
								await update();
								clearSelection();
							};
						}}
						class="flex items-center gap-2"
					>
						<input type="hidden" name="ticketIds" value={selectedIds} />
						<select
							name="status"
							class="font-mono h-8 rounded-none border border-border bg-background px-3 text-[10px] tracking-wider focus:border-primary focus:outline-none"
							onchange={(e) => e.currentTarget.form?.requestSubmit()}
						>
							<option value="">SET STATUS</option>
							<option value="open">Open</option>
							<option value="in_progress">In Progress</option>
							<option value="waiting_on_customer">Waiting on Customer</option>
							<option value="resolved">Resolved</option>
							<option value="closed">Closed</option>
						</select>
					</form>

					<!-- Bulk Priority Update -->
					<form 
						method="POST" 
						action="?/bulkUpdatePriority" 
						use:enhance={() => {
							return async ({ update }) => {
								await update();
								clearSelection();
							};
						}}
						class="flex items-center gap-2"
					>
						<input type="hidden" name="ticketIds" value={selectedIds} />
						<select
							name="priority"
							class="font-mono h-8 rounded-none border border-border bg-background px-3 text-[10px] tracking-wider focus:border-primary focus:outline-none"
							onchange={(e) => e.currentTarget.form?.requestSubmit()}
						>
							<option value="">SET PRIORITY</option>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
							<option value="urgent">Urgent</option>
						</select>
					</form>

					<!-- Bulk Assign -->
					<form 
						method="POST" 
						action="?/bulkAssign" 
						use:enhance={() => {
							return async ({ update }) => {
								await update();
								clearSelection();
							};
						}}
						class="flex items-center gap-2"
					>
						<input type="hidden" name="ticketIds" value={selectedIds} />
						<select
							name="assignedToId"
							class="font-mono h-8 rounded-none border border-border bg-background px-3 text-[10px] tracking-wider focus:border-primary focus:outline-none"
							onchange={(e) => e.currentTarget.form?.requestSubmit()}
						>
							<option value="">ASSIGN TO</option>
							<option value="">Unassigned</option>
							{#each data.staffMembers ?? [] as staff}
								<option value={staff.id}>{staff.displayName}</option>
							{/each}
						</select>
					</form>

					<!-- Bulk Delete -->
					<form 
						method="POST" 
						action="?/bulkDelete" 
						use:enhance={() => {
							if (!confirm(`Are you sure you want to delete ${selectedTickets.size} ticket(s)? This cannot be undone.`)) {
								return () => {};
							}
							return async ({ update }) => {
								await update();
								clearSelection();
							};
						}}
					>
						<input type="hidden" name="ticketIds" value={selectedIds} />
						<Button type="submit" variant="destructive" size="sm" class="h-8 font-mono text-[10px] tracking-wider">
							<Trash2 class="mr-1 h-3 w-3" />
							DELETE
						</Button>
					</form>
				</div>
			</div>
		</section>
	{/if}

	<!-- Stats Bar -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-3 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-primary">{tickets.length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-blue-500">{tickets.filter(t => t.status === 'open').length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">OPEN</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-red-500">{tickets.filter(t => t.priority === 'urgent').length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">URGENT</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-orange-500">{tickets.filter(t => !t.assignedTo).length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">UNASSIGNED</p>
			</div>
		</div>
	</section>

	<!-- Tickets List -->
	<section class="border-b border-border bg-background">
		{#if tickets.length > 0}
			<!-- Select All Header -->
			<div class="flex items-center gap-4 px-6 py-3 border-b border-border bg-muted/30 md:px-12 lg:px-16">
				<button
					onclick={toggleAll}
					class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
				>
					{#if allSelected}
						<CheckSquare class="h-4 w-4 text-primary" />
					{:else}
						<Square class="h-4 w-4" />
					{/if}
					<span class="font-mono text-[10px] tracking-wider">
						{allSelected ? 'DESELECT ALL' : 'SELECT ALL'}
					</span>
				</button>
				<span class="font-mono text-[10px] tracking-wider text-muted-foreground">
					{tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
				</span>
			</div>
			<div class="divide-y divide-border">
				{#each tickets as ticket}
					{@const statusConfig = getStatusConfig(ticket.status)}
					{@const priorityConfig = getPriorityConfig(ticket.priority)}
					{@const isSelected = selectedTickets.has(ticket.id)}
					<div
						class="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-card md:px-12 lg:px-16 {isSelected ? 'bg-primary/5' : ''}"
					>
						<!-- Checkbox -->
						<button
							onclick={(e) => { e.stopPropagation(); toggleTicket(ticket.id); }}
							class="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
						>
							{#if isSelected}
								<CheckSquare class="h-5 w-5 text-primary" />
							{:else}
								<Square class="h-5 w-5" />
							{/if}
						</button>
						<!-- Priority Indicator + Icon -->
						<a href="/admin/tickets/{ticket.id}" class="relative">
							<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
								<Ticket class="h-5 w-5 text-primary" />
							</div>
							{#if ticket.priority === 'urgent'}
								<div class="absolute -right-1 -top-1">
									<AlertTriangle class="h-4 w-4 text-red-500" />
								</div>
							{/if}
						</a>

						<!-- Ticket Info -->
						<a href="/admin/tickets/{ticket.id}" class="min-w-0 flex-1">
							<div class="flex items-center gap-3 flex-wrap">
								<span class="font-mono text-xs font-bold tracking-wider text-muted-foreground">{ticket.ticketNumber}</span>
								<span class="inline-flex items-center gap-1 px-2 py-0.5 {statusConfig.class}">
									<statusConfig.icon class="h-3 w-3" />
									<span class="font-mono text-[10px] tracking-wider">{statusConfig.label}</span>
								</span>
								<span class="px-2 py-0.5 {priorityConfig.class}">
									<span class="font-mono text-[10px] tracking-wider">{priorityConfig.label}</span>
								</span>
								{#if ticket.category}
									<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-muted text-muted-foreground border border-border">
										<Tag class="h-3 w-3" />
										<span class="font-mono text-[10px] tracking-wider uppercase">{ticket.category}</span>
									</span>
								{/if}
							</div>
							<h3 class="font-ui mt-1 text-sm font-semibold tracking-wider truncate">{ticket.subject}</h3>
							<div class="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
								<span class="flex items-center gap-1">
									<Building2 class="h-3 w-3" />
									{#if ticket.orgNumber}
										<span class="font-mono text-[10px]">{ticket.orgNumber}</span>
									{/if}
									{ticket.organization}
								</span>
								<span class="flex items-center gap-1">
									<User class="h-3 w-3" />
									{ticket.createdBy}
								</span>
							</div>
						</a>

						<!-- Assignment & Time -->
						<div class="hidden items-center gap-6 lg:flex">
							<div class="text-right">
								{#if ticket.assignedTo}
									<div class="flex items-center gap-2">
										<User class="h-4 w-4 text-primary" />
										<span class="font-body text-sm">{ticket.assignedTo}</span>
									</div>
									<p class="font-mono text-[10px] tracking-wider text-muted-foreground">ASSIGNED</p>
								{:else}
									<div class="flex items-center gap-2">
										<User class="h-4 w-4 text-muted-foreground" />
										<span class="font-body text-sm text-muted-foreground">Unassigned</span>
									</div>
									<p class="font-mono text-[10px] tracking-wider text-orange-500">NEEDS ASSIGNMENT</p>
								{/if}
							</div>
							<div class="text-right">
								<div class="flex items-center gap-1 justify-end">
									<Clock class="h-3 w-3 text-muted-foreground" />
									<span class="font-body text-xs">{formatTimeAgo(ticket.updatedAt)}</span>
								</div>
								<p class="font-mono text-[10px] tracking-wider text-muted-foreground">UPDATED</p>
							</div>
						</div>

						<!-- Arrow Link -->
						<a href="/admin/tickets/{ticket.id}" class="block">
							<ChevronRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
						</a>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-16">
				<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
					<Ticket class="h-8 w-8 text-muted-foreground/50" />
				</div>
				<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO TICKETS FOUND</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					{hasActiveFilters ? 'Try adjusting your filters.' : 'No support tickets yet.'}
				</p>
				{#if hasActiveFilters}
					<button
						onclick={clearFilters}
						class="mt-4 text-sm text-primary hover:underline"
					>
						Clear all filters
					</button>
				{/if}
			</div>
		{/if}
	</section>
</div>
