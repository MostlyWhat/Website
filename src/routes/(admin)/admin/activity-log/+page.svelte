<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Activity, Search, Filter, ChevronLeft, ChevronRight, Calendar, User, FileText, Clock, ArrowRight, ExternalLink, Users, ChevronDown, ChevronUp, Upload, Trash2, Check, X, Edit, UserPlus } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { PageHeader, EmptyState } from '$lib/components/ui/layouts';

	let { data } = $props();

	let search = $state(data.filters.search);
	let entityType = $state(data.filters.entityType);
	let activityType = $state(data.filters.activityType);
	let startDate = $state(data.filters.startDate);
	let endDate = $state(data.filters.endDate);
	let performerId = $state(data.filters.performerId);
	let expandedIds = $state<Set<string>>(new Set());

	const activityTypes = [
		{ value: '', label: 'All Activities' },
		{ value: 'created', label: 'Created' },
		{ value: 'updated', label: 'Updated' },
		{ value: 'deleted', label: 'Deleted' },
		{ value: 'status_changed', label: 'Status Changed' },
		{ value: 'comment_added', label: 'Comment Added' },
		{ value: 'file_uploaded', label: 'File Uploaded' },
		{ value: 'email_sent', label: 'Email Sent' },
		{ value: 'payment_received', label: 'Payment Received' },
		{ value: 'assigned', label: 'Assigned' },
		{ value: 'approved', label: 'Approved' },
		{ value: 'rejected', label: 'Rejected' }
	];

	function toggleExpanded(id: string) {
		const newSet = new Set(expandedIds);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		expandedIds = newSet;
	}

	function applyFilters() {
		const params = new URLSearchParams();
		if (search) params.set('search', search);
		if (entityType) params.set('entityType', entityType);
		if (activityType) params.set('activityType', activityType);
		if (startDate) params.set('startDate', startDate);
		if (endDate) params.set('endDate', endDate);
		if (performerId) params.set('performerId', performerId);
		goto(`?${params.toString()}`);
	}

	function clearFilters() {
		search = '';
		entityType = '';
		activityType = '';
		startDate = '';
		endDate = '';
		performerId = '';
		goto('/admin/activity-log');
	}

	function goToPage(pageNum: number) {
		const params = new URLSearchParams($page.url.searchParams);
		params.set('page', pageNum.toString());
		goto(`?${params.toString()}`);
	}

	function getActivityIcon(type: string) {
		switch (type) {
			case 'created':
				return { icon: FileText, color: 'text-green-500' };
			case 'updated':
				return { icon: Edit, color: 'text-blue-500' };
			case 'deleted':
				return { icon: Trash2, color: 'text-red-500' };
			case 'status_changed':
				return { icon: ArrowRight, color: 'text-yellow-500' };
			case 'comment_added':
				return { icon: FileText, color: 'text-purple-500' };
			case 'assigned':
				return { icon: UserPlus, color: 'text-indigo-500' };
			case 'file_uploaded':
				return { icon: Upload, color: 'text-cyan-500' };
			case 'approved':
				return { icon: Check, color: 'text-emerald-500' };
			case 'rejected':
				return { icon: X, color: 'text-red-500' };
			default:
				return { icon: Activity, color: 'text-muted-foreground' };
		}
	}

	function getActivityTypeColor(type: string) {
		switch (type) {
			case 'created':
				return 'bg-green-500/10 text-green-500 border-green-500/30';
			case 'updated':
				return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
			case 'deleted':
				return 'bg-red-500/10 text-red-500 border-red-500/30';
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

	function hasDetails(activity: { previousValues?: Record<string, unknown> | null; newValues?: Record<string, unknown> | null; ipAddress?: string | null }) {
		return activity.previousValues || activity.newValues || activity.ipAddress;
	}

	$effect(() => {
		// Reset local state when data changes (e.g., after navigation)
		search = data.filters.search;
		entityType = data.filters.entityType;
		activityType = data.filters.activityType;
		startDate = data.filters.startDate;
		endDate = data.filters.endDate;
		performerId = data.filters.performerId;
	});
</script>

<svelte:head>
	<title>Activity Log | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ADMIN.ACTIVITY</span>
		<h1 class="font-display mt-2 text-2xl font-bold uppercase tracking-tight md:text-3xl">
			Activity Log
		</h1>
		<p class="font-body mt-2 text-sm text-muted-foreground">
			View and search all system activities and audit trail
		</p>
	</section>

	<!-- Filters Section -->
	<section class="border-b border-border bg-background px-6 py-6 md:px-12 lg:px-16">
		<div class="flex items-center gap-2 mb-6">
			<Filter class="h-4 w-4 text-muted-foreground" />
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">FILTERS</span>
		</div>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			<!-- Search -->
			<div class="lg:col-span-2">
				<label for="search-input" class="font-mono mb-2 block text-[10px] tracking-widest text-muted-foreground">SEARCH</label>
				<div class="relative">
					<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<input
						id="search-input"
						type="text"
						bind:value={search}
						placeholder="Search descriptions..."
						class="font-body h-10 w-full border border-border bg-card py-2 pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
						onkeydown={(e) => e.key === 'Enter' && applyFilters()}
					/>
				</div>
			</div>

			<!-- Performer (User) Filter -->
			<div>
				<label for="performer-select" class="font-mono mb-2 block text-[10px] tracking-widest text-muted-foreground">PERFORMED BY</label>
				<select
					id="performer-select"
					bind:value={performerId}
					class="font-body h-10 w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
				>
					<option value="">All Users</option>
					{#each data.performers as performer}
						<option value={performer.id}>{performer.displayName || performer.email}</option>
					{/each}
				</select>
			</div>

			<!-- Entity Type -->
			<div>
				<label for="entity-type-select" class="font-mono mb-2 block text-[10px] tracking-widest text-muted-foreground">ENTITY TYPE</label>
				<select
					id="entity-type-select"
					bind:value={entityType}
					class="font-body h-10 w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
				>
					<option value="">All Entities</option>
					{#each data.entityTypes as type}
						<option value={type}>{type.replace('_', ' ').toUpperCase()}</option>
					{/each}
				</select>
			</div>

			<!-- Activity Type -->
			<div>
				<label for="activity-type-select" class="font-mono mb-2 block text-[10px] tracking-widest text-muted-foreground">ACTIVITY TYPE</label>
				<select
					id="activity-type-select"
					bind:value={activityType}
					class="font-body h-10 w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
				>
					{#each activityTypes as type}
						<option value={type.value}>{type.label}</option>
					{/each}
				</select>
			</div>

			<!-- Date Range -->
			<div>
				<label for="start-date-input" class="font-mono mb-2 block text-[10px] tracking-widest text-muted-foreground">START DATE</label>
				<input
					id="start-date-input"
					type="date"
					bind:value={startDate}
					class="font-body h-10 w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			<div>
				<label for="end-date-input" class="font-mono mb-2 block text-[10px] tracking-widest text-muted-foreground">END DATE</label>
				<input
					id="end-date-input"
					type="date"
					bind:value={endDate}
					class="font-body h-10 w-full border border-border bg-card px-3 py-2 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
		</div>

		<!-- Filter Buttons -->
		<div class="mt-6 flex items-center gap-3">
			<Button onclick={applyFilters} class="font-ui text-xs tracking-wider">
				<Search class="mr-2 h-4 w-4" />
				APPLY FILTERS
			</Button>
			<Button variant="outline" onclick={clearFilters} class="font-ui text-xs tracking-wider">
				CLEAR
			</Button>
		</div>
	</section>

	<!-- Activity List Section -->
	<section class="border-b border-border bg-background">
		<div class="flex items-center justify-between border-b border-border px-6 py-4 md:px-12 lg:px-16">
			<div class="flex items-center gap-2">
				<Activity class="h-4 w-4 text-muted-foreground" />
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ACTIVITIES</span>
			</div>
			<span class="font-mono text-xs text-muted-foreground">
				{data.pagination.total} total
			</span>
		</div>

		{#if data.activities.length === 0}
			<div class="px-6 py-16 text-center md:px-12 lg:px-16">
				<div class="flex h-16 w-16 items-center justify-center border border-border bg-card mx-auto">
					<Activity class="h-8 w-8 text-muted-foreground/50" />
				</div>
				<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO ACTIVITIES FOUND</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground">Try adjusting your filters</p>
			</div>
		{:else}
			<div class="divide-y divide-border">
				{#each data.activities as activity}
					{@const entityLink = getEntityLink(activity.entityType, activity.entityId)}
					{@const activityIcon = getActivityIcon(activity.activityType)}
					{@const isExpanded = expandedIds.has(activity.id)}
					{@const showExpandButton = hasDetails(activity as {previousValues?: Record<string, unknown> | null, newValues?: Record<string, unknown> | null, ipAddress?: string | null})}
					<div class="group">
						<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
						<!-- Compact Row - use a wrapper div with click handler -->
						<div 
							class="flex items-center gap-3 px-6 py-3 transition-colors hover:bg-card/50 md:px-12 lg:px-16 {showExpandButton ? 'cursor-pointer' : ''}"
							onclick={() => { if (showExpandButton) toggleExpanded(activity.id); }}
							onkeydown={(e) => { if (e.key === 'Enter' && showExpandButton) toggleExpanded(activity.id); }}
							role={showExpandButton ? 'button' : 'presentation'}
							tabindex={showExpandButton ? 0 : -1}
						>
							<!-- Icon -->
							<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-border bg-card">
								<activityIcon.icon class="h-4 w-4 {activityIcon.color}" />
							</div>

							<!-- Content -->
							<div class="min-w-0 flex-1">
								<p class="font-body text-sm text-foreground line-clamp-1">
									{activity.description}
								</p>
								<div class="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
									{#if activity.performerName}
										<span class="font-mono">{activity.performerName}</span>
									{/if}
									<span class="font-mono uppercase">{activity.entityType.replace('_', ' ')}</span>
									<span class="font-mono" title={formatTimestamp(activity.createdAt)}>{formatRelativeTime(activity.createdAt)}</span>
								</div>
							</div>

							<!-- Actions -->
							<div class="flex flex-shrink-0 items-center gap-2">
								<span class="hidden border px-1.5 py-0.5 font-mono text-[9px] tracking-wider sm:inline-flex {getActivityTypeColor(activity.activityType)}">
									{activity.activityType.replace('_', ' ').toUpperCase()}
								</span>
								{#if entityLink}
									<a
										href={entityLink}
										class="p-1 text-muted-foreground transition-colors hover:text-primary"
										title="View {activity.entityType}"
										onclick={(e) => e.stopPropagation()}
									>
										<ExternalLink class="h-3.5 w-3.5" />
									</a>
								{/if}
								{#if showExpandButton}
									<span class="p-1 text-muted-foreground transition-colors hover:text-foreground">
										{#if isExpanded}
											<ChevronUp class="h-4 w-4" />
										{:else}
											<ChevronDown class="h-4 w-4" />
										{/if}
									</span>
								{/if}
							</div>
						</div>

						<!-- Expanded Details -->
						{#if isExpanded && showExpandButton}
							<div class="border-t border-border bg-card/30 px-6 py-4 md:px-12 lg:px-16">
								<div class="ml-11 grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-3">
									<!-- Timestamp -->
									<div>
										<span class="font-mono text-[10px] tracking-widest text-muted-foreground">TIMESTAMP</span>
										<p class="mt-1 font-mono text-xs">{formatTimestamp(activity.createdAt)}</p>
									</div>

									<!-- IP Address -->
									{#if activity.ipAddress}
										<div>
											<span class="font-mono text-[10px] tracking-widest text-muted-foreground">IP ADDRESS</span>
											<p class="mt-1 font-mono text-xs">{activity.ipAddress}</p>
										</div>
									{/if}

									<!-- Entity ID -->
									<div>
										<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ENTITY ID</span>
										<p class="mt-1 font-mono text-xs truncate" title={activity.entityId}>{activity.entityId}</p>
									</div>

									<!-- Changes -->
									{#if activity.previousValues || activity.newValues}
										<div class="col-span-full">
											<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CHANGES</span>
											<div class="mt-2 grid gap-4 md:grid-cols-2">
												{#if activity.previousValues}
													<div class="border border-border bg-background p-3">
														<span class="font-mono text-[9px] tracking-widest text-red-400">BEFORE</span>
														<pre class="mt-1 overflow-x-auto font-mono text-xs text-muted-foreground">{JSON.stringify(activity.previousValues, null, 2)}</pre>
													</div>
												{/if}
												{#if activity.newValues}
													<div class="border border-border bg-background p-3">
														<span class="font-mono text-[9px] tracking-widest text-green-400">AFTER</span>
														<pre class="mt-1 overflow-x-auto font-mono text-xs text-foreground">{JSON.stringify(activity.newValues, null, 2)}</pre>
													</div>
												{/if}
											</div>
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</div>
				{/each}
			</div>

			<!-- Pagination -->
			{#if data.pagination.totalPages > 1}
				<div class="flex items-center justify-between border-t border-border px-6 py-4 md:px-12 lg:px-16">
					<p class="font-mono text-xs text-muted-foreground">
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
						<span class="px-2 font-mono text-xs text-muted-foreground">
							{data.pagination.page} / {data.pagination.totalPages}
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
	</section>
</div>
