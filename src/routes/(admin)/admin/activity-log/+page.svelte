<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Activity, Search, Filter, ChevronLeft, ChevronRight, Calendar, User, FileText, Clock, ArrowRight, ExternalLink } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

	let search = $state(data.filters.search);
	let entityType = $state(data.filters.entityType);
	let activityType = $state(data.filters.activityType);
	let startDate = $state(data.filters.startDate);
	let endDate = $state(data.filters.endDate);

	const activityTypes = [
		{ value: '', label: 'All Activities' },
		{ value: 'created', label: 'Created' },
		{ value: 'updated', label: 'Updated' },
		{ value: 'status_changed', label: 'Status Changed' },
		{ value: 'comment_added', label: 'Comment Added' },
		{ value: 'file_uploaded', label: 'File Uploaded' },
		{ value: 'email_sent', label: 'Email Sent' },
		{ value: 'payment_received', label: 'Payment Received' },
		{ value: 'assigned', label: 'Assigned' },
		{ value: 'approved', label: 'Approved' },
		{ value: 'rejected', label: 'Rejected' }
	];

	function applyFilters() {
		const params = new URLSearchParams();
		if (search) params.set('search', search);
		if (entityType) params.set('entityType', entityType);
		if (activityType) params.set('activityType', activityType);
		if (startDate) params.set('startDate', startDate);
		if (endDate) params.set('endDate', endDate);
		goto(`?${params.toString()}`);
	}

	function clearFilters() {
		search = '';
		entityType = '';
		activityType = '';
		startDate = '';
		endDate = '';
		goto('/admin/activity-log');
	}

	function goToPage(pageNum: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', pageNum.toString());
		goto(`?${params.toString()}`);
	}

	function getActivityTypeColor(type: string) {
		switch (type) {
			case 'created':
				return 'bg-green-500/10 text-green-500 border-green-500/30';
			case 'updated':
				return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
			case 'status_changed':
				return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
			case 'comment_added':
				return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
			case 'assigned':
				return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30';
			case 'file_uploaded':
				return 'bg-cyan-500/10 text-cyan-500 border-cyan-500/30';
			case 'approved':
				return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
			case 'rejected':
				return 'bg-red-500/10 text-red-500 border-red-500/30';
			default:
				return 'bg-muted text-muted-foreground border-border';
		}
	}

	function getEntityLink(entityType: string, entityId: string): string | null {
		switch (entityType) {
			case 'ticket':
				return `/admin/tickets/${entityId}`;
			case 'user':
				return `/admin/users/${entityId}`;
			case 'organization':
				return `/admin/organizations/${entityId}`;
			case 'project':
				return `/admin/projects/${entityId}`;
			case 'proposal':
				return `/admin/proposals/${entityId}`;
			case 'invoice':
				return `/admin/invoices/${entityId}`;
			default:
				return null;
		}
	}

	function formatTimestamp(date: Date | string) {
		const d = new Date(date);
		return d.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatRelativeTime(date: Date | string) {
		const d = new Date(date);
		const now = new Date();
		const diffMs = now.getTime() - d.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMins / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffMins < 1) return 'Just now';
		if (diffMins < 60) return `${diffMins}m ago`;
		if (diffHours < 24) return `${diffHours}h ago`;
		if (diffDays < 7) return `${diffDays}d ago`;
		return formatTimestamp(date);
	}

	$effect(() => {
		// Reset local state when data changes (e.g., after navigation)
		search = data.filters.search;
		entityType = data.filters.entityType;
		activityType = data.filters.activityType;
		startDate = data.filters.startDate;
		endDate = data.filters.endDate;
	});
</script>

<svelte:head>
	<title>Activity Log | Admin</title>
</svelte:head>

<div class="container max-w-7xl mx-auto px-4 py-12">
	<!-- Header -->
	<div class="mb-8">
		<h1 class="font-mono text-2xl md:text-3xl tracking-tight text-foreground mb-2">
			Activity Log
		</h1>
		<p class="text-muted-foreground">
			View and search all system activities
		</p>
	</div>

	<!-- Filters -->
	<div class="border border-border bg-background mb-8">
		<div class="border-b border-border px-6 py-4">
			<div class="flex items-center gap-2">
				<Filter class="h-4 w-4 text-muted-foreground" />
				<h2 class="font-mono text-xs tracking-widest text-muted-foreground">FILTERS</h2>
			</div>
		</div>
		<div class="p-6">
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
				<!-- Search -->
				<div class="lg:col-span-2">
					<label for="search-input" class="block text-sm font-medium text-muted-foreground mb-1">Search</label>
					<div class="relative">
						<Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<input
							id="search-input"
							type="text"
							bind:value={search}
							placeholder="Search descriptions..."
							class="w-full pl-10 pr-4 py-2 border border-border bg-card text-foreground focus:border-primary focus:outline-none"
							onkeydown={(e) => e.key === 'Enter' && applyFilters()}
						/>
					</div>
				</div>

				<!-- Entity Type -->
				<div>
					<label for="entity-type-select" class="block text-sm font-medium text-muted-foreground mb-1">Entity Type</label>
					<select
						id="entity-type-select"
						bind:value={entityType}
						class="w-full px-3 py-2 border border-border bg-card text-foreground focus:border-primary focus:outline-none"
					>
						<option value="">All Entities</option>
						{#each data.entityTypes as type}
							<option value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
						{/each}
					</select>
				</div>

				<!-- Activity Type -->
				<div>
					<label for="activity-type-select" class="block text-sm font-medium text-muted-foreground mb-1">Activity Type</label>
					<select
						id="activity-type-select"
						bind:value={activityType}
						class="w-full px-3 py-2 border border-border bg-card text-foreground focus:border-primary focus:outline-none"
					>
						{#each activityTypes as type}
							<option value={type.value}>{type.label}</option>
						{/each}
					</select>
				</div>

				<!-- Date Range -->
				<div class="lg:col-span-2 grid grid-cols-2 gap-4">
					<div>
						<label for="start-date-input" class="block text-sm font-medium text-muted-foreground mb-1">Start Date</label>
						<input
							id="start-date-input"
							type="date"
							bind:value={startDate}
							class="w-full px-3 py-2 border border-border bg-card text-foreground focus:border-primary focus:outline-none"
						/>
					</div>
					<div>
						<label for="end-date-input" class="block text-sm font-medium text-muted-foreground mb-1">End Date</label>
						<input
							id="end-date-input"
							type="date"
							bind:value={endDate}
							class="w-full px-3 py-2 border border-border bg-card text-foreground focus:border-primary focus:outline-none"
						/>
					</div>
				</div>

				<!-- Buttons -->
				<div class="lg:col-span-3 flex items-end gap-2">
					<Button onclick={applyFilters}>
						<Search class="h-4 w-4 mr-2" />
						Apply Filters
					</Button>
					<Button variant="outline" onclick={clearFilters}>
						Clear
					</Button>
				</div>
			</div>
		</div>
	</div>

	<!-- Activity List -->
	<div class="border border-border bg-background">
		<div class="border-b border-border px-6 py-4 flex items-center justify-between">
			<div class="flex items-center gap-2">
				<Activity class="h-4 w-4 text-muted-foreground" />
				<h2 class="font-mono text-xs tracking-widest text-muted-foreground">ACTIVITIES</h2>
			</div>
			<span class="text-sm text-muted-foreground">
				{data.pagination.total} total
			</span>
		</div>

		{#if data.activities.length === 0}
			<div class="p-12 text-center">
				<Activity class="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
				<p class="text-muted-foreground">No activities found</p>
				<p class="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
			</div>
		{:else}
			<div class="divide-y divide-border">
				{#each data.activities as activity}
					{@const entityLink = getEntityLink(activity.entityType, activity.entityId)}
					<div class="p-6 hover:bg-muted/50 transition-colors">
						<div class="flex items-start gap-4">
							<!-- Activity Icon -->
							<div class="flex-shrink-0 mt-1">
								<div class="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
									{#if activity.activityType === 'created'}
										<FileText class="h-4 w-4 text-green-500" />
									{:else if activity.activityType === 'status_changed'}
										<ArrowRight class="h-4 w-4 text-yellow-500" />
									{:else if activity.activityType === 'assigned'}
										<User class="h-4 w-4 text-indigo-500" />
									{:else if activity.activityType === 'comment_added'}
										<FileText class="h-4 w-4 text-purple-500" />
									{:else}
										<Activity class="h-4 w-4 text-muted-foreground" />
									{/if}
								</div>
							</div>

							<!-- Activity Content -->
							<div class="flex-1 min-w-0">
								<div class="flex items-start justify-between gap-4">
									<div>
										<p class="text-foreground">
											{activity.description}
										</p>
										<div class="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
											<!-- Performer -->
											{#if activity.performerName}
												<span class="flex items-center gap-1">
													<User class="h-3 w-3" />
													{activity.performerName}
												</span>
											{/if}

											<!-- Entity Type -->
											<span class="flex items-center gap-1">
												<FileText class="h-3 w-3" />
												{activity.entityType}
											</span>

											<!-- Timestamp -->
											<span class="flex items-center gap-1" title={formatTimestamp(activity.createdAt)}>
												<Clock class="h-3 w-3" />
												{formatRelativeTime(activity.createdAt)}
											</span>

											<!-- IP Address -->
											{#if activity.ipAddress}
												<span class="text-xs font-mono">
													{activity.ipAddress}
												</span>
											{/if}
										</div>
									</div>

									<div class="flex items-center gap-2 flex-shrink-0">
										<!-- Activity Type Badge -->
										<span class="px-2 py-1 text-xs border {getActivityTypeColor(activity.activityType)}">
											{activity.activityType.replace('_', ' ')}
										</span>

										<!-- Link to Entity -->
										{#if entityLink}
											<a
												href={entityLink}
												class="p-1.5 text-muted-foreground hover:text-primary transition-colors"
												title="View {activity.entityType}"
											>
												<ExternalLink class="h-4 w-4" />
											</a>
										{/if}
									</div>
								</div>

								<!-- Changes (if any) -->
								{#if activity.previousValues || activity.newValues}
									<div class="mt-3 p-3 bg-muted/50 border border-border text-sm">
										<div class="grid grid-cols-2 gap-4">
											{#if activity.previousValues}
												<div>
													<span class="font-mono text-xs text-muted-foreground">Before:</span>
													<pre class="mt-1 text-xs overflow-x-auto">{JSON.stringify(activity.previousValues, null, 2)}</pre>
												</div>
											{/if}
											{#if activity.newValues}
												<div>
													<span class="font-mono text-xs text-muted-foreground">After:</span>
													<pre class="mt-1 text-xs overflow-x-auto">{JSON.stringify(activity.newValues, null, 2)}</pre>
												</div>
											{/if}
										</div>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Pagination -->
			{#if data.pagination.totalPages > 1}
				<div class="border-t border-border px-6 py-4 flex items-center justify-between">
					<p class="text-sm text-muted-foreground">
						Showing {(data.pagination.page - 1) * data.pagination.limit + 1} - {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of {data.pagination.total}
					</p>
					<div class="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							disabled={data.pagination.page <= 1}
							onclick={() => goToPage(data.pagination.page - 1)}
						>
							<ChevronLeft class="h-4 w-4" />
						</Button>
						<span class="text-sm text-muted-foreground px-2">
							Page {data.pagination.page} of {data.pagination.totalPages}
						</span>
						<Button
							variant="outline"
							size="sm"
							disabled={data.pagination.page >= data.pagination.totalPages}
							onclick={() => goToPage(data.pagination.page + 1)}
						>
							<ChevronRight class="h-4 w-4" />
						</Button>
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>
