<script lang="ts">
	/**
	 * Customer Projects Page
	 */
	import { FolderKanban, Clock, CheckCircle, Calendar, User, ChevronRight, AlertCircle, Pause } from '@lucide/svelte';

	let { data } = $props();

	// Placeholder data - will be replaced with real data from database
	const projects = [
		{ id: '1', name: 'Website Redesign', description: 'Complete website overhaul with new branding', status: 'in_progress', progress: 65, startDate: '2024-11-01', endDate: '2024-12-31', assignedTo: 'John Staff' },
		{ id: '2', name: 'Mobile App Development', description: 'Native iOS and Android application', status: 'proposal_sent', progress: 0, startDate: null, endDate: null, assignedTo: 'Jane Staff' },
		{ id: '3', name: 'E-commerce Platform', description: 'Online store with payment integration', status: 'completed', progress: 100, startDate: '2024-08-01', endDate: '2024-10-31', assignedTo: 'John Staff' }
	];

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return 'TBD';
		return new Date(dateStr).toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric', 
			year: 'numeric' 
		});
	}

	function getStatusConfig(status: string): { icon: typeof Clock; class: string; label: string } {
		switch (status) {
			case 'draft': return { icon: Clock, class: 'bg-muted text-muted-foreground', label: 'Draft' };
			case 'proposal_sent': return { icon: AlertCircle, class: 'bg-blue-500/10 text-blue-500', label: 'Proposal Sent' };
			case 'proposal_accepted': return { icon: CheckCircle, class: 'bg-green-500/10 text-green-500', label: 'Accepted' };
			case 'in_progress': return { icon: Clock, class: 'bg-yellow-500/10 text-yellow-500', label: 'In Progress' };
			case 'on_hold': return { icon: Pause, class: 'bg-orange-500/10 text-orange-500', label: 'On Hold' };
			case 'completed': return { icon: CheckCircle, class: 'bg-green-500/10 text-green-500', label: 'Completed' };
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
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// YOUR PROJECTS</span>
		<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Projects</h1>
		<p class="font-body mt-1 text-sm text-muted-foreground">
			View and track all your active and completed projects.
		</p>
	</section>

	<!-- Projects List -->
	<section class="border-b border-border bg-background">
		{#if projects.length > 0}
			<div class="divide-y divide-border">
				{#each projects as project}
					{@const statusConfig = getStatusConfig(project.status)}
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
							<div class="flex items-center gap-3">
								<h3 class="font-ui text-sm font-semibold tracking-wider truncate">{project.name}</h3>
								<span class="inline-flex items-center gap-1 px-2 py-0.5 {statusConfig.class}">
									<svelte:component this={statusConfig.icon} class="h-3 w-3" />
									<span class="font-mono text-[10px] tracking-wider uppercase">{statusConfig.label}</span>
								</span>
							</div>
							<p class="font-body mt-1 text-xs text-muted-foreground truncate">{project.description}</p>
							
							<!-- Progress Bar -->
							{#if project.status === 'in_progress'}
								<div class="mt-3 flex items-center gap-3">
									<div class="h-1 flex-1 bg-border">
										<div class="h-full bg-primary" style="width: {project.progress}%"></div>
									</div>
									<span class="font-mono text-[10px] tracking-wider text-muted-foreground">{project.progress}%</span>
								</div>
							{/if}
						</div>

						<!-- Timeline & Assignee -->
						<div class="hidden items-center gap-6 lg:flex">
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
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Your projects will appear here once they're created.
				</p>
			</div>
		{/if}
	</section>
</div>
