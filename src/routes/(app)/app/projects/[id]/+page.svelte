<script lang="ts">
	import { ArrowLeft, Calendar, Users, FileText, MessageSquare, CheckCircle2, Clock, AlertCircle, Target, Circle, Pause, XCircle } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { PhaseBadge, PhaseTimeline } from '$lib/components/ui/phase-badge';
	import { cn } from '$lib/utils';

	let { data } = $props();

	// Get project from server data
	const project = $derived(data.project);
	const recentActivity = $derived(data.recentActivity ?? []);
	const milestones = $derived(data.milestones ?? []);
	const progress = $derived(data.progress ?? { completedWeight: 0, totalWeight: 0, percent: 0 });

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', { style: 'currency', currency: project.currency ?? 'USD' }).format(amount);
	}

	function formatDate(date: Date | string | null): string {
		if (!date) return 'TBD';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function getStatusBadge(status: string) {
		switch (status) {
			case 'completed':
				return { bg: 'bg-green-500/10', text: 'text-green-500', label: 'COMPLETED' };
			case 'in_progress':
				return { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'IN PROGRESS' };
			case 'on_hold':
				return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'ON HOLD' };
			case 'pending':
			case 'draft':
				return { bg: 'bg-muted', text: 'text-muted-foreground', label: 'PENDING' };
			case 'proposal_sent':
				return { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'PROPOSAL SENT' };
			case 'proposal_accepted':
				return { bg: 'bg-green-500/10', text: 'text-green-500', label: 'ACCEPTED' };
			default:
				return { bg: 'bg-muted', text: 'text-muted-foreground', label: status.toUpperCase().replace('_', ' ') };
		}
	}

	function getMilestoneStatusColor(status: string) {
		switch (status) {
			case 'pending': return 'bg-muted text-muted-foreground border-muted';
			case 'in_progress': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
			case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/30';
			case 'on_hold': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
			case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/30';
			default: return 'bg-muted text-muted-foreground border-muted';
		}
	}

	function getMilestoneStatusIcon(status: string) {
		switch (status) {
			case 'pending': return Circle;
			case 'in_progress': return Clock;
			case 'completed': return CheckCircle2;
			case 'on_hold': return Pause;
			case 'cancelled': return XCircle;
			default: return Circle;
		}
	}

	function formatStatusLabel(status: string) {
		return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	let status = $derived(getStatusBadge(project.status));
</script>

<svelte:head>
	<title>{project.name} | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<a
					href="/app/projects"
					class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
					<span class="font-mono text-[10px] tracking-widest">BACK TO PROJECTS</span>
				</a>
				<h1 class="font-display mt-6 text-2xl font-bold uppercase md:text-3xl">{project.name}</h1>
				<p class="font-mono mt-2 text-xs tracking-widest text-muted-foreground">{project.organization}</p>
			</div>

			<PhaseBadge phase={project.phase} size="lg" />
		</div>
		
		<!-- Phase Timeline -->
		<div class="mt-8">
			<PhaseTimeline currentPhase={project.phase} />
		</div>
	</section>

	<!-- Project Content -->
	<section class="border-b border-border bg-background">
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Main Content -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-8 md:px-12 lg:px-16">
				<!-- Description -->
				<div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — PROJECT OVERVIEW</span>
					<p class="font-body mt-4 text-base leading-relaxed text-muted-foreground">{project.description ?? 'No description available.'}</p>
				</div>

				<!-- Recent Activity -->
				{#if recentActivity.length > 0}
					<div class="mt-12">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — RECENT ACTIVITY</span>
						
						<div class="mt-6 border border-border divide-y divide-border">
							{#each recentActivity as activity}
								<div class="flex items-start gap-4 px-4 py-4">
									<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-border bg-card">
										<span class="font-mono text-xs uppercase">{(activity.user ?? 'S').charAt(0)}</span>
									</div>
									<div class="flex-1">
										<p class="font-body text-sm">{activity.description}</p>
										<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">
											{activity.user} • {formatDate(activity.createdAt)}
										</p>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{:else}
					<div class="mt-12">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — RECENT ACTIVITY</span>
						<p class="font-body mt-4 text-sm text-muted-foreground">No recent activity.</p>
					</div>
				{/if}

				<!-- Milestones Section -->
				{#if milestones.length > 0}
					<div class="mt-12">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">03 — MILESTONES</span>

						<!-- Progress Bar -->
						<div class="mt-6 border border-border p-4">
							<div class="flex items-center justify-between mb-2">
								<span class="font-mono text-xs text-muted-foreground">Progress</span>
								<span class="font-mono text-sm text-foreground">{progress.percent}%</span>
							</div>
							<div class="h-2 bg-muted overflow-hidden">
								<div
									class="h-full bg-primary transition-all duration-300"
									style="width: {progress.percent}%"
								></div>
							</div>
							<p class="font-mono mt-2 text-[10px] tracking-widest text-muted-foreground">
								{progress.completedWeight} / {progress.totalWeight} weight completed
							</p>
						</div>

						<!-- Milestone List -->
						<div class="mt-4 border border-border divide-y divide-border">
							{#each milestones as milestone (milestone.id)}
								{@const StatusIcon = getMilestoneStatusIcon(milestone.status)}
								<div class="p-4">
									<div class="flex items-start gap-3">
										<div class={cn('mt-0.5 p-1.5 border', getMilestoneStatusColor(milestone.status))}>
											<StatusIcon class="h-4 w-4" />
										</div>
										<div class="flex-1">
											<div class="flex items-center gap-2 flex-wrap">
												<h3 class="font-body font-medium text-foreground">{milestone.title}</h3>
												<span class={cn('px-2 py-0.5 text-[10px] font-medium border', getMilestoneStatusColor(milestone.status))}>
													{formatStatusLabel(milestone.status).toUpperCase()}
												</span>
											</div>
											{#if milestone.description}
												<p class="font-body mt-1 text-sm text-muted-foreground">{milestone.description}</p>
											{/if}
											<div class="flex items-center gap-4 mt-2 font-mono text-[10px] tracking-widest text-muted-foreground">
												{#if milestone.dueDate}
													<span class="flex items-center gap-1">
														<Calendar class="h-3 w-3" />
														DUE: {formatDate(milestone.dueDate)}
													</span>
												{/if}
												{#if milestone.completedAt}
													<span class="text-green-500 flex items-center gap-1">
														<CheckCircle2 class="h-3 w-3" />
														COMPLETED: {formatDate(milestone.completedAt)}
													</span>
												{/if}
											</div>
											{#if milestone.deliverables && Array.isArray(milestone.deliverables) && milestone.deliverables.length > 0}
												<div class="mt-3 pl-4 border-l-2 border-border">
													<span class="font-mono text-[10px] tracking-widest text-muted-foreground">DELIVERABLES</span>
													<ul class="mt-1 space-y-1">
														{#each milestone.deliverables as deliverable}
															<li class="font-body text-sm text-foreground flex items-center gap-2">
																<span class="h-1 w-1 bg-muted-foreground rounded-full"></span>
																{deliverable}
															</li>
														{/each}
													</ul>
												</div>
											{/if}
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			<!-- Sidebar -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-4 lg:border-l lg:border-border md:px-12 lg:px-8">
				<!-- Project Details Card -->
				<div class="border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT DETAILS</span>
					
					<div class="mt-6 space-y-4">
						<div class="flex items-start gap-3">
							<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
								<Calendar class="h-5 w-5 text-muted-foreground" />
							</div>
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">TIMELINE</p>
								<p class="font-body text-sm">{formatDate(project.startDate)} — {formatDate(project.endDate)}</p>
							</div>
						</div>

						<div class="flex items-start gap-3">
							<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
								<FileText class="h-5 w-5 text-muted-foreground" />
							</div>
							<div>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">BUDGET</p>
								<p class="font-display text-lg font-bold">{formatCurrency(project.estimatedBudget)}</p>
							</div>
						</div>

						{#if project.assignedTo}
							<div class="flex items-start gap-3">
								<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
									<Users class="h-5 w-5 text-muted-foreground" />
								</div>
								<div>
									<p class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT LEAD</p>
									<p class="font-body text-sm">{project.assignedTo}</p>
								</div>
							</div>
						{/if}
					</div>
				</div>

				<!-- Quick Actions -->
				<div class="mt-6 space-y-3">
					<Button variant="outline" href="/app/tickets/new" class="font-ui w-full text-xs tracking-wider">
						<MessageSquare class="mr-2 h-4 w-4" />
						ASK A QUESTION
					</Button>
					<Button variant="outline" href="/app/invoices" class="font-ui w-full text-xs tracking-wider">
						<FileText class="mr-2 h-4 w-4" />
						VIEW INVOICES
					</Button>
				</div>

				<!-- Need Help -->
				<div class="mt-6 border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NEED HELP?</span>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						If you have any questions or concerns about your project, our team is here to help.
					</p>
					<Button variant="outline" href="/contact" class="font-ui mt-4 w-full text-xs tracking-wider">
						CONTACT SUPPORT
					</Button>
				</div>
			</div>
		</div>
	</section>
</div>
