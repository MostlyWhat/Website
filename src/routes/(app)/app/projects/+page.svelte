<script lang="ts">
	/**
	 * Customer Projects Page
	 */
	import { FolderKanban, Clock, CheckCircle, Calendar, User, ChevronRight, AlertCircle, Pause, Plus, FileText, Eye, X } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { PhaseBadge, PhaseTimeline } from '$lib/components/ui/phase-badge';

	let { data } = $props();

	// Get projects from server data
	const projects = $derived(data.projects ?? []);
	const requests = $derived(data.requests ?? []);

	function formatDate(dateStr: string | Date | null): string {
		if (!dateStr) return 'TBD';
		return new Date(dateStr).toLocaleDateString('en-US', { 
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
			default: return { icon: Clock, class: 'bg-muted text-muted-foreground', label: status };
		}
	}
</script>

<svelte:head>
	<title>Projects | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex items-start justify-between gap-4">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// YOUR PROJECTS</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Projects</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					View and track all your active and completed projects.
				</p>
			</div>
			<Button href="/app/projects/new" class="font-ui text-xs tracking-wider">
				<Plus class="mr-2 h-4 w-4" />
				REQUEST PROJECT
			</Button>
		</div>
	</section>

	<!-- Project Requests (if any) -->
	{#if requests.length > 0}
		<section class="border-b border-border bg-background">
			<div class="border-b border-border px-6 py-4 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PENDING REQUESTS</span>
			</div>
			<div class="divide-y divide-border">
				{#each requests as request}
					{@const statusConfig = getRequestStatusConfig(request.status)}
					{@const StatusIcon = statusConfig.icon}
					<a
						href="/app/projects/requests/{request.id}"
						class="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-card md:px-12 lg:px-16"
					>
						<!-- Icon -->
						<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
							<FileText class="h-4 w-4 text-muted-foreground" />
						</div>

						<!-- Request Info -->
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-3">
								<h3 class="font-ui text-sm font-semibold tracking-wider truncate">{request.title}</h3>
								<span class="inline-flex items-center gap-1 px-2 py-0.5 {statusConfig.class}">
									<StatusIcon class="h-3 w-3" />
									<span class="font-mono text-[10px] tracking-wider uppercase">{statusConfig.label}</span>
								</span>
							</div>
							<p class="font-mono mt-1 text-[10px] tracking-wider text-muted-foreground">
								{request.requestNumber} • Submitted {formatDate(request.createdAt)}
							</p>
						</div>

						<!-- Arrow -->
						<ChevronRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
					</a>
				{/each}
			</div>
		</section>
	{/if}

	<!-- Projects List -->
	<section class="border-b border-border bg-background">
		{#if requests.length > 0}
			<div class="border-b border-border px-6 py-4 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ACTIVE PROJECTS</span>
			</div>
		{/if}
		{#if projects.length > 0}
			<div class="divide-y divide-border">
				{#each projects as project}
					<a
						href="/app/projects/{project.id}"
						class="group flex items-center gap-4 px-6 py-6 transition-colors hover:bg-card md:px-12 lg:px-16"
					>
						<!-- Icon -->
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
							<FolderKanban class="h-5 w-5 text-primary" />
						</div>

						<!-- Project Info -->
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-3 flex-wrap">
								<span class="font-mono text-[10px] text-muted-foreground">{project.projectNumber}</span>
								<h3 class="font-ui text-sm font-semibold tracking-wider truncate">{project.name}</h3>
								<PhaseBadge phase={project.phase} size="sm" />
							</div>
							<p class="font-body mt-1 text-xs text-muted-foreground truncate">{project.description ?? 'No description'}</p>
							<!-- Phase Timeline for mobile -->
							<div class="mt-2 lg:hidden">
								<PhaseTimeline currentPhase={project.phase} compact />
							</div>
						</div>

						<!-- Phase Timeline & Info -->
						<div class="hidden items-center gap-6 lg:flex">
							<PhaseTimeline currentPhase={project.phase} compact />
							<div class="text-right">
								<div class="flex items-center gap-1 justify-end">
									<Calendar class="h-3 w-3 text-muted-foreground" />
									<span class="font-body text-xs">{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
								</div>
								<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TIMELINE</p>
							</div>
							<div class="text-right">
								<div class="flex items-center gap-1 justify-end">
									<User class="h-3 w-3 text-muted-foreground" />
									<span class="font-body text-xs">{project.assignedTo}</span>
								</div>
								<p class="font-mono text-[10px] tracking-wider text-muted-foreground">PROJECT LEAD</p>
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
					<FolderKanban class="h-8 w-8 text-muted-foreground/50" />
				</div>
				<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO PROJECTS YET</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground text-center max-w-sm">
					Ready to start something new? Request a project and we'll get back to you with a proposal.
				</p>
				<Button href="/app/projects/new" class="font-ui mt-6 text-xs tracking-wider">
					<Plus class="mr-2 h-4 w-4" />
					REQUEST A PROJECT
				</Button>
			</div>
		{/if}
	</section>
</div>
