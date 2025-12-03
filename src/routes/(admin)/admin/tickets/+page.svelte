<script lang="ts">
	/**
	 * Admin Tickets List Page
	 */
	import { 
		Ticket, Search, Plus, Building2, User, Calendar, 
		ChevronRight, Filter, Clock, CheckCircle, MessageSquare, AlertTriangle
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
	
	let searchQuery = $state('');
	let statusFilter = $state<string>('all');
	let priorityFilter = $state<string>('all');

	// Get tickets from server data
	const tickets = $derived(data.tickets ?? []);

	const filteredTickets = $derived(
		tickets.filter(ticket => {
			const matchesSearch = searchQuery === '' || 
				ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
				ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(ticket.organization ?? '').toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
			const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
			return matchesSearch && matchesStatus && matchesPriority;
		})
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
					placeholder="Search tickets..."
					bind:value={searchQuery}
					class="font-body h-10 w-full rounded-none border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			
			<div class="flex items-center gap-3">
				<Filter class="h-4 w-4 text-muted-foreground" />
				<select
					bind:value={statusFilter}
					class="font-mono h-10 rounded-none border border-border bg-background px-4 text-xs tracking-wider focus:border-primary focus:outline-none"
				>
					<option value="all">ALL STATUS</option>
					<option value="open">OPEN</option>
					<option value="in_progress">IN PROGRESS</option>
					<option value="awaiting_customer">AWAITING CUSTOMER</option>
					<option value="awaiting_staff">AWAITING STAFF</option>
					<option value="resolved">RESOLVED</option>
					<option value="closed">CLOSED</option>
				</select>
				<select
					bind:value={priorityFilter}
					class="font-mono h-10 rounded-none border border-border bg-background px-4 text-xs tracking-wider focus:border-primary focus:outline-none"
				>
					<option value="all">ALL PRIORITY</option>
					<option value="urgent">URGENT</option>
					<option value="high">HIGH</option>
					<option value="medium">MEDIUM</option>
					<option value="low">LOW</option>
				</select>
			</div>
		</div>
	</section>

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
		{#if filteredTickets.length > 0}
			<div class="divide-y divide-border">
				{#each filteredTickets as ticket}
					{@const statusConfig = getStatusConfig(ticket.status)}
					{@const priorityConfig = getPriorityConfig(ticket.priority)}
					<a
						href="/admin/tickets/{ticket.id}"
						class="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-card md:px-12 lg:px-16"
					>
						<!-- Priority Indicator + Icon -->
						<div class="relative">
							<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
								<Ticket class="h-5 w-5 text-primary" />
							</div>
							{#if ticket.priority === 'urgent'}
								<div class="absolute -right-1 -top-1">
									<AlertTriangle class="h-4 w-4 text-red-500" />
								</div>
							{/if}
						</div>

						<!-- Ticket Info -->
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-3 flex-wrap">
								<span class="font-mono text-xs font-bold tracking-wider text-muted-foreground">{ticket.ticketNumber}</span>
								<span class="inline-flex items-center gap-1 px-2 py-0.5 {statusConfig.class}">
									<statusConfig.icon class="h-3 w-3" />
									<span class="font-mono text-[10px] tracking-wider">{statusConfig.label}</span>
								</span>
								<span class="px-2 py-0.5 {priorityConfig.class}">
									<span class="font-mono text-[10px] tracking-wider">{priorityConfig.label}</span>
								</span>
							</div>
							<h3 class="font-ui mt-1 text-sm font-semibold tracking-wider truncate">{ticket.subject}</h3>
							<div class="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
								<span class="flex items-center gap-1">
									<Building2 class="h-3 w-3" />
									{ticket.organization}
								</span>
								<span class="flex items-center gap-1">
									<User class="h-3 w-3" />
									{ticket.createdBy}
								</span>
							</div>
						</div>

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

						<!-- Arrow -->
						<ChevronRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
					</a>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-16">
				<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
					<Ticket class="h-8 w-8 text-muted-foreground/50" />
				</div>
				<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO TICKETS FOUND</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					{searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' ? 'Try adjusting your filters.' : 'No support tickets yet.'}
				</p>
			</div>
		{/if}
	</section>
</div>
