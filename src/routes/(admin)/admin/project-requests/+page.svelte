<script lang="ts">
	/**
	 * Admin Project Requests Page
	 * 
	 * View and manage client project requests.
	 */
	import { enhance } from '$app/forms';
	import {
		FileText, Clock, Eye, CheckCircle, X, FolderKanban,
		Building2, User, Calendar, DollarSign, Timer, ChevronRight,
		ArrowUpRight, Loader2, AlertTriangle
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data, form } = $props();

	let loading = $state(false);
	let selectedRequest = $state<string | null>(null);
	let showRejected = $state(false);

	// Separate requests into active and rejected/failed
	const activeRequests = $derived(
		data.requests.filter(r => !['rejected', 'cancelled', 'failed'].includes(r.status))
	);
	const rejectedRequests = $derived(
		data.requests.filter(r => ['rejected', 'cancelled', 'failed'].includes(r.status))
	);

	function formatDate(date: Date | string | null): string {
		if (!date) return '-';
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric',
			year: 'numeric'
		});
	}

	function getStatusConfig(status: string): { icon: typeof Clock; class: string; label: string } {
		switch (status) {
			case 'pending': return { icon: Clock, class: 'bg-yellow-500/10 text-yellow-500', label: 'PENDING' };
			case 'under_review': return { icon: Eye, class: 'bg-blue-500/10 text-blue-500', label: 'UNDER REVIEW' };
			case 'approved': return { icon: CheckCircle, class: 'bg-green-500/10 text-green-500', label: 'APPROVED' };
			case 'rejected': return { icon: X, class: 'bg-red-500/10 text-red-500', label: 'REJECTED' };
			case 'cancelled': return { icon: X, class: 'bg-muted text-muted-foreground', label: 'CANCELLED' };
			case 'failed': return { icon: AlertTriangle, class: 'bg-red-500/10 text-red-500', label: 'FAILED' };
			case 'converted': return { icon: FolderKanban, class: 'bg-primary/10 text-primary', label: 'CONVERTED' };
			default: return { icon: Clock, class: 'bg-muted text-muted-foreground', label: status.toUpperCase() };
		}
	}

	function getBudgetLabel(budget: string | null): string {
		if (!budget) return '-';
		const labels: Record<string, string> = {
			'under_5k': '< $5K',
			'5k_15k': '$5-15K',
			'15k_50k': '$15-50K',
			'50k_100k': '$50-100K',
			'over_100k': '> $100K',
			'not_sure': 'TBD'
		};
		return labels[budget] ?? budget;
	}

	function getTimelineLabel(timeline: string | null): string {
		if (!timeline) return '-';
		const labels: Record<string, string> = {
			'asap': 'ASAP',
			'1_month': '1 month',
			'1_3_months': '1-3 months',
			'3_6_months': '3-6 months',
			'flexible': 'Flexible'
		};
		return labels[timeline] ?? timeline;
	}

	function getTypeLabel(type: string): string {
		const labels: Record<string, string> = {
			'website': 'Website',
			'web_app': 'Web App',
			'mobile_app': 'Mobile',
			'design': 'Design',
			'backend': 'Backend',
			'other': 'Other'
		};
		return labels[type] ?? type;
	}
</script>

<svelte:head>
	<title>Project Requests | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// CLIENT REQUESTS</span>
		<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Project Requests</h1>
		<p class="font-body mt-1 text-sm text-muted-foreground">
			Review and process project requests submitted by clients.
		</p>
	</section>

	<!-- Stats -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-3 bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-2xl font-bold text-yellow-500">{String(data.stats.pending).padStart(2, '0')}</span>
				<p class="font-mono text-[10px] tracking-widest text-muted-foreground">PENDING</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-6">
				<span class="font-display text-2xl font-bold text-blue-500">{String(data.stats.underReview).padStart(2, '0')}</span>
				<p class="font-mono text-[10px] tracking-widest text-muted-foreground">UNDER REVIEW</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-6">
				<span class="font-display text-2xl font-bold text-green-500">{String(data.stats.approved).padStart(2, '0')}</span>
				<p class="font-mono text-[10px] tracking-widest text-muted-foreground">APPROVED</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-6">
				<span class="font-display text-2xl font-bold">{String(data.stats.total).padStart(2, '0')}</span>
				<p class="font-mono text-[10px] tracking-widest text-muted-foreground">TOTAL</p>
			</div>
		</div>
	</section>

	<!-- Messages -->
	{#if form?.success}
		<div class="border-b border-green-500/30 bg-green-500/10 px-6 py-4 md:px-12 lg:px-16">
			<p class="font-body text-sm text-green-500">{form.message ?? 'Action completed successfully'}</p>
		</div>
	{/if}
	{#if form?.error}
		<div class="border-b border-destructive/30 bg-destructive/10 px-6 py-4 md:px-12 lg:px-16">
			<p class="font-body text-sm text-destructive">{form.error}</p>
		</div>
	{/if}

	<!-- Active Requests List -->
	<section class="border-b border-border bg-background">
		<div class="border-b border-border px-6 py-4 md:px-12 lg:px-16 flex items-center justify-between">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ACTIVE REQUESTS</span>
			{#if rejectedRequests.length > 0}
				<button 
					onclick={() => showRejected = !showRejected}
					class="font-mono text-[10px] tracking-widest text-muted-foreground hover:text-foreground transition-colors"
				>
					{showRejected ? 'HIDE' : 'SHOW'} REJECTED ({rejectedRequests.length})
				</button>
			{/if}
		</div>
		{#if activeRequests.length > 0}
			<div class="divide-y divide-border">
				{#each activeRequests as request}
					{@const statusConfig = getStatusConfig(request.status)}
					{@const StatusIcon = statusConfig.icon}
					<div class="px-6 py-6 md:px-12 lg:px-16">
						<div class="flex items-start gap-4">
							<!-- Icon -->
							<div class="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-border bg-card">
								<FileText class="h-5 w-5 text-primary" />
							</div>

							<!-- Request Info -->
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-3">
									<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{request.requestNumber}</span>
									<span class="inline-flex items-center gap-1 px-2 py-0.5 {statusConfig.class}">
										<StatusIcon class="h-3 w-3" />
										<span class="font-mono text-[10px] tracking-wider">{statusConfig.label}</span>
									</span>
								</div>
								<h3 class="font-ui mt-1 text-sm font-semibold tracking-wider">{request.title}</h3>
								
								<div class="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
									<span class="inline-flex items-center gap-1">
										<Building2 class="h-3 w-3" />
										{request.organizationName}
									</span>
									<span class="inline-flex items-center gap-1">
										<User class="h-3 w-3" />
										{request.requestedByName}
									</span>
									<span class="inline-flex items-center gap-1">
										<Calendar class="h-3 w-3" />
										{formatDate(request.createdAt)}
									</span>
								</div>

								<div class="mt-3 flex flex-wrap items-center gap-4">
									<span class="inline-flex items-center gap-1 border border-border px-2 py-1">
										<span class="font-mono text-[10px] tracking-wider text-muted-foreground">TYPE:</span>
										<span class="font-mono text-[10px] tracking-wider">{getTypeLabel(request.projectType)}</span>
									</span>
									<span class="inline-flex items-center gap-1 border border-border px-2 py-1">
										<DollarSign class="h-3 w-3 text-muted-foreground" />
										<span class="font-mono text-[10px] tracking-wider">{getBudgetLabel(request.budgetRange)}</span>
									</span>
									<span class="inline-flex items-center gap-1 border border-border px-2 py-1">
										<Timer class="h-3 w-3 text-muted-foreground" />
										<span class="font-mono text-[10px] tracking-wider">{getTimelineLabel(request.timeline)}</span>
									</span>
								</div>
							</div>

							<!-- Actions -->
							<div class="flex flex-shrink-0 items-center gap-2">
								<Button href="/admin/project-requests/{request.id}" variant="outline" size="sm" class="font-ui text-xs tracking-wider">
									VIEW
									<ArrowUpRight class="ml-1 h-3 w-3" />
								</Button>

								{#if request.status === 'pending'}
									<form method="POST" action="?/updateStatus" use:enhance={() => {
										loading = true;
										selectedRequest = request.id;
										return async ({ update }) => {
											loading = false;
											selectedRequest = null;
											await update();
										};
									}}>
										<input type="hidden" name="requestId" value={request.id} />
										<input type="hidden" name="status" value="under_review" />
										<Button type="submit" size="sm" disabled={loading && selectedRequest === request.id} class="font-ui text-xs tracking-wider">
											{#if loading && selectedRequest === request.id}
												<Loader2 class="mr-1 h-3 w-3 animate-spin" />
											{:else}
												<Eye class="mr-1 h-3 w-3" />
											{/if}
											START REVIEW
										</Button>
									</form>
								{:else if request.status === 'approved'}
									<form method="POST" action="?/convertToProject" use:enhance={() => {
										loading = true;
										selectedRequest = request.id;
										return async ({ update }) => {
											loading = false;
											selectedRequest = null;
											await update();
										};
									}}>
										<input type="hidden" name="requestId" value={request.id} />
										<Button type="submit" size="sm" disabled={loading && selectedRequest === request.id} class="font-ui text-xs tracking-wider">
											{#if loading && selectedRequest === request.id}
												<Loader2 class="mr-1 h-3 w-3 animate-spin" />
											{:else}
												<FolderKanban class="mr-1 h-3 w-3" />
											{/if}
											CONVERT
										</Button>
									</form>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-16">
				<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
					<FileText class="h-8 w-8 text-muted-foreground/50" />
				</div>
				<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO ACTIVE REQUESTS</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Client project requests will appear here.
				</p>
			</div>
		{/if}
	</section>

	<!-- Rejected/Cancelled Requests (Collapsed by default) -->
	{#if showRejected && rejectedRequests.length > 0}
		<section class="border-b border-border bg-muted/30">
			<div class="border-b border-border px-6 py-4 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">REJECTED / CANCELLED REQUESTS</span>
			</div>
			<div class="divide-y divide-border">
				{#each rejectedRequests as request}
					{@const statusConfig = getStatusConfig(request.status)}
					{@const StatusIcon = statusConfig.icon}
					<div class="px-6 py-6 md:px-12 lg:px-16 opacity-60 hover:opacity-100 transition-opacity">
						<div class="flex items-start gap-4">
							<!-- Icon -->
							<div class="flex h-12 w-12 flex-shrink-0 items-center justify-center border border-border bg-card">
								<FileText class="h-5 w-5 text-muted-foreground" />
							</div>

							<!-- Request Info -->
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-3">
									<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{request.requestNumber}</span>
									<span class="inline-flex items-center gap-1 px-2 py-0.5 {statusConfig.class}">
										<StatusIcon class="h-3 w-3" />
										<span class="font-mono text-[10px] tracking-wider">{statusConfig.label}</span>
									</span>
								</div>
								<h3 class="font-ui mt-1 text-sm font-semibold tracking-wider">{request.title}</h3>
								
								<div class="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
									<span class="inline-flex items-center gap-1">
										<Building2 class="h-3 w-3" />
										{request.organizationName}
									</span>
									<span class="inline-flex items-center gap-1">
										<User class="h-3 w-3" />
										{request.requestedByName}
									</span>
									<span class="inline-flex items-center gap-1">
										<Calendar class="h-3 w-3" />
										{formatDate(request.createdAt)}
									</span>
								</div>
							</div>

							<!-- Actions -->
							<div class="flex flex-shrink-0 items-center gap-2">
								<Button href="/admin/project-requests/{request.id}" variant="outline" size="sm" class="font-ui text-xs tracking-wider">
									VIEW
									<ArrowUpRight class="ml-1 h-3 w-3" />
								</Button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</section>
	{/if}
</div>
