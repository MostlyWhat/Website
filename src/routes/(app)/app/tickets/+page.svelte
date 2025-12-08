<script lang="ts">
	/**
	 * Customer Tickets Page
	 */
	import { Ticket, Plus, Clock, CheckCircle, MessageSquare, ChevronRight, AlertTriangle, User } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Skeleton } from '$lib/components/ui/skeleton';

	let { data } = $props();

	// Access streamed data
	const streamedTickets = $derived((data as any).streamed?.tickets as Promise<Array<any>>);

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
			case 'awaiting_customer': return { icon: MessageSquare, class: 'bg-purple-500/10 text-purple-500', label: 'Your Response Needed' };
			case 'awaiting_staff': return { icon: MessageSquare, class: 'bg-orange-500/10 text-orange-500', label: 'Awaiting Response' };
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
	<title>Support Tickets | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// SUPPORT</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Support Tickets</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Get help with your projects and services.
				</p>
			</div>
			<Button href="/app/tickets/new" size="sm" class="font-ui text-xs tracking-wider">
				<Plus class="mr-2 h-4 w-4" />
				NEW TICKET
			</Button>
		</div>
	</section>

	<!-- Response Needed Alert -->
	{#await streamedTickets}
		<!-- Skeleton Loading State -->
		<section class="border-b border-border bg-background">
			<div class="divide-y divide-border">
				{#each Array(5) as _}
					<div class="flex items-center gap-4 px-6 py-6 md:px-12 lg:px-16">
						<div class="relative">
							<Skeleton class="h-12 w-12 rounded" />
						</div>
						<div class="min-w-0 flex-1 space-y-2">
							<div class="flex items-center gap-3 flex-wrap">
								<Skeleton class="h-3 w-20 rounded" />
								<Skeleton class="h-5 w-24 rounded" />
								<Skeleton class="h-5 w-16 rounded" />
							</div>
							<Skeleton class="h-4 w-64 rounded" />
							<div class="flex items-center gap-4">
								<Skeleton class="h-3 w-20 rounded" />
								<Skeleton class="h-3 w-24 rounded" />
							</div>
						</div>
						<div class="hidden md:flex items-center gap-6">
							<div class="space-y-1">
								<Skeleton class="h-3 w-16 rounded" />
								<Skeleton class="h-2 w-20 rounded" />
							</div>
							<Skeleton class="h-5 w-5 rounded" />
						</div>
					</div>
				{/each}
			</div>
		</section>
	{:then tickets}
		{@const awaitingResponse = tickets.filter(t => t.status === 'awaiting_customer')}
		
		<!-- Response Needed Alert -->
		{#if awaitingResponse.length > 0}
			<section class="border-b border-border bg-purple-500/5">
				<div class="flex items-center gap-4 px-6 py-4 md:px-12 lg:px-16">
					<div class="flex h-10 w-10 items-center justify-center border border-purple-500/30 bg-purple-500/10">
						<MessageSquare class="h-4 w-4 text-purple-500" />
					</div>
					<div class="flex-1">
						<p class="font-ui text-sm font-semibold tracking-wider">
							{awaitingResponse.length} TICKET{awaitingResponse.length > 1 ? 'S' : ''} NEED{awaitingResponse.length === 1 ? 'S' : ''} YOUR RESPONSE
						</p>
						<p class="font-body text-xs text-muted-foreground">Our team is waiting for additional information from you.</p>
					</div>
				</div>
			</section>
		{/if}

		<!-- Tickets List -->
		<section class="border-b border-border bg-background">
			{#if tickets.length > 0}
				<div class="divide-y divide-border">
					{#each tickets as ticket}
						{@const statusConfig = getStatusConfig(ticket.status)}
						{@const priorityConfig = getPriorityConfig(ticket.priority)}
						<a
							href="/app/tickets/{ticket.id}"
							class="group flex items-center gap-4 px-6 py-6 transition-colors hover:bg-card md:px-12 lg:px-16"
						>
							<!-- Priority Indicator + Icon -->
							<div class="relative">
								<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
									<Ticket class="h-5 w-5 text-primary" />
								</div>
								{#if ticket.priority === 'urgent' || ticket.priority === 'high'}
									<div class="absolute -right-1 -top-1">
										<AlertTriangle class="h-4 w-4 text-{ticket.priority === 'urgent' ? 'red' : 'orange'}-500" />
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
										<User class="h-3 w-3" />
										{ticket.assignedTo}
									</span>
									<span class="flex items-center gap-1">
										<MessageSquare class="h-3 w-3" />
										{ticket.responseCount} responses
									</span>
								</div>
							</div>

							<!-- Time & Action -->
							<div class="flex items-center gap-6">
								<div class="text-right hidden md:block">
									<div class="flex items-center gap-1 justify-end">
										<Clock class="h-3 w-3 text-muted-foreground" />
										<span class="font-body text-xs">{formatTimeAgo(ticket.updatedAt)}</span>
									</div>
									<p class="font-mono text-[10px] tracking-wider text-muted-foreground">LAST UPDATE</p>
								</div>
								
								{#if ticket.status === 'awaiting_customer'}
									<Button size="sm" class="font-ui text-xs tracking-wider">
										RESPOND
									</Button>
								{:else}
									<ChevronRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
								{/if}
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-16">
					<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
						<Ticket class="h-8 w-8 text-muted-foreground/50" />
					</div>
					<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO TICKETS YET</h3>
					<p class="font-body mt-2 text-sm text-muted-foreground">
						Need help? Create a support ticket.
					</p>
					<Button href="/app/tickets/new" class="mt-6 font-ui text-xs tracking-wider">
						<Plus class="mr-2 h-4 w-4" />
						NEW TICKET
					</Button>
				</div>
			{/if}
		</section>
	{/await}
</div>
