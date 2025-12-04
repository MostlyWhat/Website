<script lang="ts">
	/**
	 * Admin Projects List Page
	 */
	import { 
		FolderKanban, Search, Plus, Building2, User, Calendar, 
		ChevronRight, Filter, Clock, CheckCircle, AlertCircle, Pause,
		Inbox, Eye, X, FileText
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { PhaseBadge, PhaseTimeline, PHASES_ORDER, getPhaseConfig } from '$lib/components/ui/phase-badge';
	import type { ProjectPhase } from '$lib/server/db/schema';

	let { data } = $props();
	
	let searchQuery = $state('');
	let phaseFilter = $state<string>('all');
	let activeTab = $state<'projects' | 'requests'>('projects');

	// Use real data from server
	const projects = data.projects;
	const requests = $derived(data.requests ?? []);

	const filteredProjects = $derived(
		projects.filter(project => {
			const matchesSearch = searchQuery === '' || 
				project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(project.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
				(project.projectNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
				(project.orgNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
			const matchesPhase = phaseFilter === 'all' || project.phase === phaseFilter;
			return matchesSearch && matchesPhase;
		})
	);

	const filteredRequests = $derived(
		requests.filter(request => {
			const matchesSearch = searchQuery === '' || 
				request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(request.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
				(request.requestNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
				(request.orgNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
			const matchesStatus = phaseFilter === 'all' || request.status === phaseFilter;
			return matchesSearch && matchesStatus;
		})
	);

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(date: Date | string | null): string {
		if (!date) return 'TBD';
		const d = typeof date === 'string' ? new Date(date) : date;
		return d.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric', 
			year: 'numeric' 
		});
	}

	function getRequestStatusConfig(status: string): { icon: typeof Clock; class: string; label: string } {
		switch (status) {
			case 'pending': return { icon: Clock, class: 'bg-yellow-500/10 text-yellow-500', label: 'Pending' };
			case 'under_review': return { icon: Eye, class: 'bg-blue-500/10 text-blue-500', label: 'Under Review' };
			case 'approved': return { icon: CheckCircle, class: 'bg-green-500/10 text-green-500', label: 'Approved' };
			case 'rejected': return { icon: X, class: 'bg-red-500/10 text-red-500', label: 'Declined' };
			case 'converted': return { icon: FolderKanban, class: 'bg-primary/10 text-primary', label: 'Converted' };
			default: return { icon: Clock, class: 'bg-muted text-muted-foreground', label: status };
		}
	}

	// Phase-based stats
	const phaseStats = $derived({
		request: projects.filter(p => p.phase === 'request' || p.phase === 'review').length,
		active: projects.filter(p => ['proposal', 'confirmed', 'building'].includes(p.phase)).length,
		completed: projects.filter(p => p.phase === 'completed' || p.phase === 'support').length
	});

	// Request stats
	const pendingCount = $derived(requests.filter(r => r.status === 'pending').length);
	const reviewCount = $derived(requests.filter(r => r.status === 'under_review').length);
</script>

<svelte:head>
	<title>Projects | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// PROJECT MANAGEMENT</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Projects</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Manage all client projects, requests, and track progress.
				</p>
			</div>
			<Button href="/admin/projects/new" size="sm" class="font-ui text-xs tracking-wider">
				<Plus class="mr-2 h-4 w-4" />
				NEW PROJECT
			</Button>
		</div>
	</section>

	<!-- Tabs -->
	<section class="border-b border-border bg-card">
		<div class="flex px-6 md:px-12 lg:px-16">
			<button
				onclick={() => { activeTab = 'projects'; phaseFilter = 'all'; }}
				class="relative flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-wider transition-colors {activeTab === 'projects' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}"
			>
				<FolderKanban class="h-4 w-4" />
				PROJECTS
				<span class="font-display text-sm font-bold">{projects.length}</span>
				{#if activeTab === 'projects'}
					<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
				{/if}
			</button>
			<button
				onclick={() => { activeTab = 'requests'; phaseFilter = 'all'; }}
				class="relative flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-wider transition-colors {activeTab === 'requests' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}"
			>
				<Inbox class="h-4 w-4" />
				REQUESTS
				{#if pendingCount + reviewCount > 0}
					<span class="flex h-5 min-w-5 items-center justify-center bg-yellow-500/20 px-1.5 font-display text-xs font-bold text-yellow-500">
						{pendingCount + reviewCount}
					</span>
				{:else}
					<span class="font-display text-sm font-bold">{requests.length}</span>
				{/if}
				{#if activeTab === 'requests'}
					<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
				{/if}
			</button>
		</div>
	</section>

	<!-- Filters Bar -->
	<section class="border-b border-border bg-card">
		<div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
			<div class="relative flex-1 md:max-w-sm">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					placeholder={activeTab === 'projects' ? 'Search projects...' : 'Search requests...'}
					bind:value={searchQuery}
					class="font-body h-10 w-full rounded-none border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			
			<div class="flex items-center gap-3">
				<Filter class="h-4 w-4 text-muted-foreground" />
				{#if activeTab === 'projects'}
					<select
						bind:value={phaseFilter}
						class="font-mono h-10 rounded-none border border-border bg-background px-4 text-xs tracking-wider focus:border-primary focus:outline-none"
					>
						<option value="all">ALL PHASES</option>
						<option value="request">01 - REQUEST</option>
						<option value="review">02 - REVIEW</option>
						<option value="proposal">03 - PROPOSAL</option>
						<option value="confirmed">04 - CONFIRMED</option>
						<option value="building">05 - BUILDING</option>
						<option value="completed">06 - COMPLETED</option>
						<option value="support">07 - SUPPORT</option>
					</select>
				{:else}
					<select
						bind:value={phaseFilter}
						class="font-mono h-10 rounded-none border border-border bg-background px-4 text-xs tracking-wider focus:border-primary focus:outline-none"
					>
						<option value="all">ALL STATUS</option>
						<option value="pending">PENDING</option>
						<option value="under_review">UNDER REVIEW</option>
						<option value="approved">APPROVED</option>
						<option value="rejected">REJECTED</option>
						<option value="converted">CONVERTED</option>
					</select>
				{/if}
			</div>
		</div>
	</section>

	<!-- Stats Bar -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			{#if activeTab === 'projects'}
				<div class="col-span-3 bg-background px-6 py-4 md:px-12 lg:px-16">
					<span class="font-display text-xl font-bold text-primary">{projects.length}</span>
					<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL</p>
				</div>
				<div class="col-span-3 bg-background px-6 py-4">
					<span class="font-display text-xl font-bold text-blue-500">{phaseStats.request}</span>
					<p class="font-mono text-[10px] tracking-wider text-muted-foreground">REQUESTS</p>
				</div>
				<div class="col-span-3 bg-background px-6 py-4">
					<span class="font-display text-xl font-bold text-yellow-500">{phaseStats.active}</span>
					<p class="font-mono text-[10px] tracking-wider text-muted-foreground">ACTIVE</p>
				</div>
				<div class="col-span-3 bg-background px-6 py-4 md:px-12 lg:px-16">
					<span class="font-display text-xl font-bold text-green-500">{phaseStats.completed}</span>
					<p class="font-mono text-[10px] tracking-wider text-muted-foreground">COMPLETED</p>
				</div>
			{:else}
				<div class="col-span-3 bg-background px-6 py-4 md:px-12 lg:px-16">
					<span class="font-display text-xl font-bold text-primary">{requests.length}</span>
					<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL</p>
				</div>
				<div class="col-span-3 bg-background px-6 py-4">
					<span class="font-display text-xl font-bold text-yellow-500">{pendingCount}</span>
					<p class="font-mono text-[10px] tracking-wider text-muted-foreground">PENDING</p>
				</div>
				<div class="col-span-3 bg-background px-6 py-4">
					<span class="font-display text-xl font-bold text-blue-500">{reviewCount}</span>
					<p class="font-mono text-[10px] tracking-wider text-muted-foreground">IN REVIEW</p>
				</div>
				<div class="col-span-3 bg-background px-6 py-4 md:px-12 lg:px-16">
					<span class="font-display text-xl font-bold text-green-500">{requests.filter(r => r.status === 'approved' || r.status === 'converted').length}</span>
					<p class="font-mono text-[10px] tracking-wider text-muted-foreground">APPROVED</p>
				</div>
			{/if}
		</div>
	</section>

	<!-- Projects List -->
	<section class="border-b border-border bg-background">
		{#if activeTab === 'projects'}
			{#if filteredProjects.length > 0}
				<!-- Grid Header -->
				<div class="hidden border-b border-border bg-muted/30 lg:block">
					<div class="grid grid-cols-12 gap-4 px-6 py-2 md:px-12 lg:px-16">
						<div class="col-span-1 font-mono text-[10px] tracking-wider text-muted-foreground">ID</div>
						<div class="col-span-3 font-mono text-[10px] tracking-wider text-muted-foreground">PROJECT</div>
						<div class="col-span-2 font-mono text-[10px] tracking-wider text-muted-foreground">ORGANIZATION</div>
						<div class="col-span-2 font-mono text-[10px] tracking-wider text-muted-foreground">PHASE</div>
						<div class="col-span-2 font-mono text-[10px] tracking-wider text-muted-foreground">TIMELINE</div>
						<div class="col-span-1 font-mono text-[10px] tracking-wider text-muted-foreground">ASSIGNED</div>
						<div class="col-span-1"></div>
					</div>
				</div>
				<div class="divide-y divide-border">
					{#each filteredProjects as project}
						<a
							href="/admin/projects/{project.id}"
							class="group block transition-colors hover:bg-card"
						>
							<!-- Desktop Grid View -->
							<div class="hidden lg:grid grid-cols-12 gap-4 items-center px-6 py-4 md:px-12 lg:px-16">
								<!-- Project Number -->
								<div class="col-span-1">
									<span class="font-mono text-xs text-muted-foreground">{project.projectNumber}</span>
								</div>
								<!-- Project Name -->
								<div class="col-span-3">
									<h3 class="font-ui text-sm font-semibold tracking-wider truncate">{project.name}</h3>
								</div>
								<!-- Organization -->
								<div class="col-span-2 flex items-center gap-2">
									<Building2 class="h-3.5 w-3.5 text-muted-foreground" />
									<div class="min-w-0">
										{#if project.orgNumber}
											<span class="font-mono text-[10px] text-muted-foreground">{project.orgNumber}</span>
										{/if}
										<span class="block truncate text-xs">{project.organization}</span>
									</div>
								</div>
								<!-- Phase -->
								<div class="col-span-2">
									<PhaseBadge phase={project.phase} size="sm" />
								</div>
								<!-- Timeline -->
								<div class="col-span-2">
									<div class="flex items-center gap-1 text-xs">
										<Calendar class="h-3 w-3 text-muted-foreground" />
										<span>{formatDate(project.startDate)}</span>
										<span class="text-muted-foreground">→</span>
										<span>{formatDate(project.endDate)}</span>
									</div>
								</div>
								<!-- Assigned To -->
								<div class="col-span-1">
									{#if project.assignedTo}
										<div class="flex items-center gap-1">
											<User class="h-3 w-3 text-muted-foreground" />
											<span class="truncate text-xs">{project.assignedTo}</span>
										</div>
									{:else}
										<span class="text-xs text-muted-foreground">—</span>
									{/if}
								</div>
								<!-- Arrow -->
								<div class="col-span-1 flex justify-end">
									<ChevronRight class="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
								</div>
							</div>

							<!-- Mobile Card View -->
							<div class="flex items-center gap-4 px-6 py-4 md:px-12 lg:hidden">
								<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
									<FolderKanban class="h-5 w-5 text-primary" />
								</div>
								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-3 flex-wrap">
										<span class="font-mono text-[10px] text-muted-foreground">{project.projectNumber}</span>
										<h3 class="font-ui text-sm font-semibold tracking-wider truncate">{project.name}</h3>
									</div>
									<div class="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
										<span class="flex items-center gap-1">
											<Building2 class="h-3 w-3" />
											{project.organization}
										</span>
									</div>
									<div class="mt-2">
										<PhaseBadge phase={project.phase} size="sm" />
									</div>
								</div>
								<ChevronRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-16">
					<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
						<FolderKanban class="h-8 w-8 text-muted-foreground/50" />
					</div>
					<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO PROJECTS FOUND</h3>
					<p class="font-body mt-2 text-sm text-muted-foreground">
						{searchQuery || phaseFilter !== 'all' ? 'Try adjusting your filters.' : 'Start by creating your first project.'}
					</p>
					{#if !searchQuery && phaseFilter === 'all'}
						<Button href="/admin/projects/new" class="mt-6 font-ui text-xs tracking-wider">
							<Plus class="mr-2 h-4 w-4" />
							NEW PROJECT
						</Button>
					{/if}
				</div>
			{/if}
		{:else}
			<!-- Requests List -->
			{#if filteredRequests.length > 0}
				<!-- Grid Header -->
				<div class="hidden border-b border-border bg-muted/30 lg:block">
					<div class="grid grid-cols-12 gap-4 px-6 py-2 md:px-12 lg:px-16">
						<div class="col-span-1 font-mono text-[10px] tracking-wider text-muted-foreground">ID</div>
						<div class="col-span-3 font-mono text-[10px] tracking-wider text-muted-foreground">TITLE</div>
						<div class="col-span-2 font-mono text-[10px] tracking-wider text-muted-foreground">ORGANIZATION</div>
						<div class="col-span-2 font-mono text-[10px] tracking-wider text-muted-foreground">TYPE</div>
						<div class="col-span-2 font-mono text-[10px] tracking-wider text-muted-foreground">STATUS</div>
						<div class="col-span-1 font-mono text-[10px] tracking-wider text-muted-foreground">SUBMITTED</div>
						<div class="col-span-1"></div>
					</div>
				</div>
				<div class="divide-y divide-border">
					{#each filteredRequests as request}
						{@const statusConfig = getRequestStatusConfig(request.status)}
						{@const StatusIcon = statusConfig.icon}
						<a
							href="/admin/project-requests/{request.id}"
							class="group block transition-colors hover:bg-card"
						>
							<!-- Desktop Grid View -->
							<div class="hidden lg:grid grid-cols-12 gap-4 items-center px-6 py-4 md:px-12 lg:px-16">
								<!-- Request Number -->
								<div class="col-span-1">
									<span class="font-mono text-xs text-muted-foreground">{request.requestNumber}</span>
								</div>
								<!-- Title -->
								<div class="col-span-3">
									<h3 class="font-ui text-sm font-semibold tracking-wider truncate">{request.title}</h3>
								</div>
								<!-- Organization -->
								<div class="col-span-2 flex items-center gap-2">
									<Building2 class="h-3.5 w-3.5 text-muted-foreground" />
									<div class="min-w-0">
										{#if request.orgNumber}
											<span class="font-mono text-[10px] text-muted-foreground">{request.orgNumber}</span>
										{/if}
										<span class="block truncate text-xs">{request.organization}</span>
									</div>
								</div>
								<!-- Type -->
								<div class="col-span-2">
									<span class="font-mono text-xs uppercase tracking-wider">{request.projectType.replace('_', ' ')}</span>
								</div>
								<!-- Status -->
								<div class="col-span-2">
									<span class="inline-flex items-center gap-1 px-2 py-0.5 {statusConfig.class}">
										<StatusIcon class="h-3 w-3" />
										<span class="font-mono text-[10px] tracking-wider uppercase">{statusConfig.label}</span>
									</span>
								</div>
								<!-- Date -->
								<div class="col-span-1">
									<span class="text-xs text-muted-foreground">{formatDate(request.createdAt)}</span>
								</div>
								<!-- Arrow -->
								<div class="col-span-1 flex justify-end">
									<ChevronRight class="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
								</div>
							</div>

							<!-- Mobile Card View -->
							<div class="flex items-center gap-4 px-6 py-4 md:px-12 lg:hidden">
								<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
									<FileText class="h-5 w-5 text-muted-foreground" />
								</div>
								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-3">
										<span class="font-mono text-[10px] text-muted-foreground">{request.requestNumber}</span>
										<h3 class="font-ui text-sm font-semibold tracking-wider truncate">{request.title}</h3>
									</div>
									<div class="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
										<span class="flex items-center gap-1">
											<Building2 class="h-3 w-3" />
											{request.organization}
										</span>
									</div>
									<div class="mt-2">
										<span class="inline-flex items-center gap-1 px-2 py-0.5 {statusConfig.class}">
											<StatusIcon class="h-3 w-3" />
											<span class="font-mono text-[10px] tracking-wider uppercase">{statusConfig.label}</span>
										</span>
									</div>
								</div>
								<ChevronRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
							</div>
						</a>
					{/each}
				</div>
			{:else}
				<div class="flex flex-col items-center justify-center py-16">
					<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
						<Inbox class="h-8 w-8 text-muted-foreground/50" />
					</div>
					<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO REQUESTS FOUND</h3>
					<p class="font-body mt-2 text-sm text-muted-foreground">
						{searchQuery || phaseFilter !== 'all' ? 'Try adjusting your filters.' : 'No project requests have been submitted yet.'}
					</p>
				</div>
			{/if}
		{/if}
	</section>
</div>
