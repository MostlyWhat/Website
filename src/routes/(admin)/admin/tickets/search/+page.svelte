<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Search, Filter, X, FileText, MessageSquare } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { NativeSelect } from '$lib/components/ui/native-select';
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { PageHeader, EmptyState } from '$lib/components/ui/layouts';
	
	const { data } = $props();
	
	let searchInput = $state(data.query);
	let statusFilter = $state(data.filters?.status);
	let priorityFilter = $state(data.filters?.priority);
	let categoryFilter = $state(data.filters?.category);
	let showFilters = $state(false);
	
	function handleSearch(e: Event) {
		e.preventDefault();
		applyFilters();
	}
	
	function applyFilters() {
		const params = new URLSearchParams();
		if (searchInput) params.set('q', searchInput);
		if (statusFilter) params.set('status', statusFilter);
		if (priorityFilter) params.set('priority', priorityFilter);
		if (categoryFilter) params.set('category', categoryFilter);
		
		goto(`/admin/tickets/search?${params.toString()}`);
	}
	
	function clearFilters() {
		statusFilter = '';
		priorityFilter = '';
		categoryFilter = '';
		applyFilters();
	}
	
	function getStatusBadgeClass(status: string) {
		const classes = {
			open: 'bg-blue-100 text-blue-700 border-blue-300',
			in_progress: 'bg-yellow-100 text-yellow-700 border-yellow-300',
			waiting: 'bg-orange-100 text-orange-700 border-orange-300',
			resolved: 'bg-green-100 text-green-700 border-green-300',
			closed: 'bg-gray-100 text-gray-700 border-gray-300'
		};
		return classes[status as keyof typeof classes] || classes.open;
	}
	
	function getPriorityBadgeClass(priority: string) {
		const classes = {
			low: 'bg-gray-100 text-gray-700 border-gray-300',
			medium: 'bg-blue-100 text-blue-700 border-blue-300',
			high: 'bg-orange-100 text-orange-700 border-orange-300',
			urgent: 'bg-red-100 text-red-700 border-red-300'
		};
		return classes[priority as keyof typeof classes] || classes.medium;
	}
	
	function formatDate(date: Date) {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="px-6 py-8 md:px-12 lg:px-16">
	<!-- Page Header -->
	<div class="mb-8">
		<h1 class="text-3xl font-bold tracking-tight mb-2">Search Tickets</h1>
		<p class="text-muted-foreground">
			Search across ticket subjects, descriptions, and comments
		</p>
	</div>

	<!-- Search Form -->
	<div class="bg-background border border-border p-6 mb-8">
		<form onsubmit={handleSearch} class="space-y-4">
			<div class="flex gap-2">
				<div class="relative flex-1">
					<Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<input
						type="text"
						bind:value={searchInput}
						placeholder="Search tickets..."
						class="w-full pl-10 pr-4 py-2 bg-background border border-input focus:border-primary focus:outline-none"
					/>
				</div>
				<Button type="submit" class="px-6">
					Search
				</Button>
				<Button
					type="button"
					variant="outline"
					onclick={() => showFilters = !showFilters}
					class="px-4"
				>
					<Filter class="h-4 w-4 mr-2" />
					Filters
				</Button>
			</div>

		{#if showFilters}
			<div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
				<div>
					<Label class="block text-xs font-medium mb-2">STATUS</Label>
					<NativeSelect bind:value={statusFilter} onchange={applyFilters} class="w-full">
						<option value="">All Statuses</option>
						<option value="open">Open</option>
						<option value="in_progress">In Progress</option>
						<option value="waiting">Waiting</option>
						<option value="resolved">Resolved</option>
						<option value="closed">Closed</option>
					</NativeSelect>
				</div>

				<div>
					<Label class="block text-xs font-medium mb-2">PRIORITY</Label>
					<NativeSelect bind:value={priorityFilter} onchange={applyFilters} class="w-full">
						<option value="">All Priorities</option>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
						<option value="urgent">Urgent</option>
					</NativeSelect>
				</div>

				<div>
					<Label class="block text-xs font-medium mb-2">CATEGORY</Label>
					<NativeSelect bind:value={categoryFilter} onchange={applyFilters} class="w-full">
						<option value="">All Categories</option>
						{#each data.categories as category}
							<option value={category.id}>{category.name}</option>
						{/each}
					</NativeSelect>
				</div>
			</div>				{#if statusFilter || priorityFilter || categoryFilter}
					<div class="flex justify-end pt-2">
						<Button type="button" variant="ghost" onclick={clearFilters} class="text-sm">
							<X class="h-3 w-3 mr-1" />
							Clear Filters
						</Button>
					</div>
				{/if}
			{/if}
		</form>
	</div>

	<!-- Results -->
	{#if data.query}
		<div class="mb-4 text-sm text-muted-foreground">
			Found {data.totalResults} ticket{data.totalResults !== 1 ? 's' : ''} matching "{data.query}"
		</div>

		{#if data.tickets.length === 0}
			<div class="bg-background border border-border p-12 text-center">
				<FileText class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
				<h3 class="text-lg font-semibold mb-2">No tickets found</h3>
				<p class="text-muted-foreground">
					Try adjusting your search query or filters
				</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each data.tickets as ticket}
					<a
						href="/admin/tickets/{ticket.id}"
						class="block bg-background border border-border p-5 hover:border-primary transition-colors"
					>
						<div class="flex items-start justify-between gap-4 mb-3">
							<div class="flex-1">
								<div class="flex items-center gap-2 mb-2">
									<span class="font-mono text-sm text-muted-foreground">
										#{ticket.ticketNumber}
									</span>
									{#if ticket.matchedInComments}
										<span class="text-xs bg-purple-100 text-purple-700 border border-purple-300 px-2 py-0.5 inline-flex items-center gap-1">
											<MessageSquare class="h-3 w-3" />
											Matched in comments
										</span>
									{/if}
								</div>
								<h3 class="text-lg font-semibold mb-1">{ticket.subject}</h3>
								<p class="text-sm text-muted-foreground line-clamp-2">
									{ticket.description}
								</p>
							</div>
							
							<div class="flex flex-col items-end gap-2">
								<span class="px-3 py-1 text-xs font-medium border {getStatusBadgeClass(ticket.status)}">
									{ticket.status.replace('_', ' ').toUpperCase()}
								</span>
								<span class="px-3 py-1 text-xs font-medium border {getPriorityBadgeClass(ticket.priority)}">
									{ticket.priority.toUpperCase()}
								</span>
							</div>
						</div>

						<div class="flex items-center gap-6 text-xs text-muted-foreground">
							{#if ticket.categoryName}
								<div class="flex items-center gap-1">
									<span class="font-medium">Category:</span>
									<span>{ticket.categoryName}</span>
								</div>
							{/if}
							<div class="flex items-center gap-1">
								<span class="font-medium">Created by:</span>
								<span>{ticket.createdBy.name}</span>
							</div>
							{#if ticket.organizationName}
								<div class="flex items-center gap-1">
									<span class="font-medium">Organization:</span>
									<span>{ticket.organizationName}</span>
								</div>
							{/if}
							<div class="flex items-center gap-1">
								<span class="font-medium">Updated:</span>
								<span>{formatDate(ticket.updatedAt)}</span>
							</div>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	{:else}
		<div class="bg-background border border-border p-12 text-center">
			<Search class="h-12 w-12 text-muted-foreground mx-auto mb-4" />
			<h3 class="text-lg font-semibold mb-2">Enter a search query</h3>
			<p class="text-muted-foreground">
				Search for tickets by subject, description, or comment content
			</p>
		</div>
	{/if}
</div>



