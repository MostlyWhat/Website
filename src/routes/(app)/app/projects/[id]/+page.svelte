<script lang="ts">
	import { 
		ArrowLeft, Calendar, Users, FileText, MessageSquare, CheckCircle2, 
		Clock, AlertCircle, Target, Circle, Pause, XCircle, Receipt, 
		FileCheck, Inbox, DollarSign, ExternalLink
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { PhaseBadge, PhaseTimeline } from '$lib/components/ui/phase-badge';
	import { cn } from '$lib/utils';

	let { data } = $props();

	// Active tab state
	let activeTab = $state<'overview' | 'proposals' | 'invoices' | 'request'>('overview');

	// Get project from server data
	const project = $derived(data.project);
	const recentActivity = $derived(data.recentActivity ?? []);
	const milestones = $derived(data.milestones ?? []);
	const progress = $derived(data.progress ?? { completedWeight: 0, totalWeight: 0, percent: 0 });
	const proposals = $derived(data.proposals ?? []);
	const invoices = $derived(data.invoices ?? []);
	const originalRequest = $derived(data.originalRequest);

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

	function getProposalStatusBadge(status: string) {
		switch (status) {
			case 'draft': return { bg: 'bg-muted', text: 'text-muted-foreground', label: 'DRAFT' };
			case 'sent': return { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'SENT' };
			case 'viewed': return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'VIEWED' };
			case 'accepted': return { bg: 'bg-green-500/10', text: 'text-green-500', label: 'ACCEPTED' };
			case 'rejected': return { bg: 'bg-red-500/10', text: 'text-red-500', label: 'REJECTED' };
			case 'expired': return { bg: 'bg-muted', text: 'text-muted-foreground', label: 'EXPIRED' };
			default: return { bg: 'bg-muted', text: 'text-muted-foreground', label: status.toUpperCase() };
		}
	}

	function getInvoiceStatusBadge(status: string) {
		switch (status) {
			case 'draft': return { bg: 'bg-muted', text: 'text-muted-foreground', label: 'DRAFT' };
			case 'sent': return { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'SENT' };
			case 'viewed': return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'VIEWED' };
			case 'paid': return { bg: 'bg-green-500/10', text: 'text-green-500', label: 'PAID' };
			case 'partially_paid': return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'PARTIAL' };
			case 'overdue': return { bg: 'bg-red-500/10', text: 'text-red-500', label: 'OVERDUE' };
			case 'cancelled': return { bg: 'bg-muted', text: 'text-muted-foreground', label: 'CANCELLED' };
			default: return { bg: 'bg-muted', text: 'text-muted-foreground', label: status.toUpperCase() };
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

	<!-- Tabs -->
	<section class="border-b border-border bg-card">
		<div class="flex px-6 md:px-12 lg:px-16">
			<button
				onclick={() => activeTab = 'overview'}
				class="relative flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-wider transition-colors {activeTab === 'overview' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}"
			>
				<Target class="h-4 w-4" />
				OVERVIEW
				{#if activeTab === 'overview'}
					<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
				{/if}
			</button>
			<button
				onclick={() => activeTab = 'proposals'}
				class="relative flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-wider transition-colors {activeTab === 'proposals' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}"
			>
				<FileCheck class="h-4 w-4" />
				PROPOSALS
				{#if proposals.length > 0}
					<span class="font-display text-sm font-bold">{proposals.length}</span>
				{/if}
				{#if activeTab === 'proposals'}
					<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
				{/if}
			</button>
			<button
				onclick={() => activeTab = 'invoices'}
				class="relative flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-wider transition-colors {activeTab === 'invoices' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}"
			>
				<Receipt class="h-4 w-4" />
				INVOICES
				{#if invoices.length > 0}
					<span class="font-display text-sm font-bold">{invoices.length}</span>
				{/if}
				{#if activeTab === 'invoices'}
					<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
				{/if}
			</button>
			{#if originalRequest}
				<button
					onclick={() => activeTab = 'request'}
					class="relative flex items-center gap-2 px-4 py-3 font-mono text-xs tracking-wider transition-colors {activeTab === 'request' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}"
				>
					<Inbox class="h-4 w-4" />
					REQUEST
					{#if activeTab === 'request'}
						<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
					{/if}
				</button>
			{/if}
		</div>
	</section>

	<!-- Tab Content -->
	{#if activeTab === 'overview'}
	<!-- Overview Tab Content -->
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
								<DollarSign class="h-5 w-5 text-muted-foreground" />
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
					<Button variant="outline" onclick={() => activeTab = 'invoices'} class="font-ui w-full text-xs tracking-wider">
						<Receipt class="mr-2 h-4 w-4" />
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

	{:else if activeTab === 'proposals'}
	<!-- Proposals Tab Content -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT PROPOSALS</span>
		
		{#if proposals.length > 0}
			<div class="mt-6 border border-border divide-y divide-border">
				{#each proposals as proposal}
					{@const status = getProposalStatusBadge(proposal.status)}
					<a 
						href="/app/proposals/{proposal.id}" 
						class="flex items-center justify-between p-4 hover:bg-card transition-colors group"
					>
						<div class="flex items-start gap-4">
							<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
								<FileCheck class="h-5 w-5 text-primary" />
							</div>
							<div>
								<div class="flex items-center gap-2">
									<span class="font-mono text-xs text-muted-foreground">{proposal.proposalNumber}</span>
									<span class={cn('px-2 py-0.5 text-[10px] font-medium', status.bg, status.text)}>
										{status.label}
									</span>
								</div>
								<h3 class="font-body mt-1 font-medium">{proposal.title ?? 'Untitled Proposal'}</h3>
								<p class="font-mono mt-1 text-xs text-muted-foreground">
									Created {formatDate(proposal.createdAt)}
									{#if proposal.expiresAt}
										• Expires {formatDate(proposal.expiresAt)}
									{/if}
								</p>
							</div>
						</div>
						<div class="flex items-center gap-4">
							<span class="font-display text-lg font-bold">{formatCurrency(proposal.total)}</span>
							<ExternalLink class="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="mt-6 flex flex-col items-center justify-center border border-dashed border-border py-12">
				<FileCheck class="h-12 w-12 text-muted-foreground/30" />
				<h3 class="mt-4 font-ui text-sm font-semibold tracking-wider">NO PROPOSALS YET</h3>
				<p class="mt-2 max-w-sm text-center font-body text-sm text-muted-foreground">
					Proposals for this project will appear here once created.
				</p>
			</div>
		{/if}
	</section>

	{:else if activeTab === 'invoices'}
	<!-- Invoices Tab Content -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT INVOICES</span>
		
		{#if invoices.length > 0}
			<div class="mt-6 border border-border divide-y divide-border">
				{#each invoices as invoice}
					{@const status = getInvoiceStatusBadge(invoice.status)}
					<a 
						href="/app/invoices/{invoice.id}" 
						class="flex items-center justify-between p-4 hover:bg-card transition-colors group"
					>
						<div class="flex items-start gap-4">
							<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
								<Receipt class="h-5 w-5 text-primary" />
							</div>
							<div>
								<div class="flex items-center gap-2">
									<span class="font-mono text-xs text-muted-foreground">{invoice.invoiceNumber}</span>
									<span class={cn('px-2 py-0.5 text-[10px] font-medium', status.bg, status.text)}>
										{status.label}
									</span>
								</div>
								<h3 class="font-body mt-1 font-medium">{invoice.title ?? 'Untitled Invoice'}</h3>
								<p class="font-mono mt-1 text-xs text-muted-foreground">
									Due {formatDate(invoice.dueDate)}
								</p>
							</div>
						</div>
						<div class="flex flex-col items-end gap-1">
							<span class="font-display text-lg font-bold">{formatCurrency(invoice.total)}</span>
							{#if invoice.amountDue > 0}
								<span class="font-mono text-xs text-muted-foreground">Due: {formatCurrency(invoice.amountDue)}</span>
							{:else}
								<span class="font-mono text-xs text-green-500">Paid in full</span>
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="mt-6 flex flex-col items-center justify-center border border-dashed border-border py-12">
				<Receipt class="h-12 w-12 text-muted-foreground/30" />
				<h3 class="mt-4 font-ui text-sm font-semibold tracking-wider">NO INVOICES YET</h3>
				<p class="mt-2 max-w-sm text-center font-body text-sm text-muted-foreground">
					Invoices for this project will appear here once created.
				</p>
			</div>
		{/if}
	</section>

	{:else if activeTab === 'request' && originalRequest}
	<!-- Original Request Tab Content -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ORIGINAL PROJECT REQUEST</span>
		
		<div class="mt-6 border border-border p-6">
			<div class="flex items-center gap-3">
				<span class="font-mono text-xs text-muted-foreground">{originalRequest.requestNumber}</span>
				<span class="px-2 py-0.5 text-[10px] font-medium bg-green-500/10 text-green-500">
					CONVERTED
				</span>
			</div>
			
			<h3 class="font-display mt-4 text-xl font-bold">{originalRequest.title}</h3>
			
			<p class="font-body mt-4 text-muted-foreground">{originalRequest.description}</p>
			
			<div class="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
				<div>
					<p class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT TYPE</p>
					<p class="font-body mt-1 text-sm">{originalRequest.projectType ?? 'Not specified'}</p>
				</div>
				<div>
					<p class="font-mono text-[10px] tracking-widest text-muted-foreground">BUDGET RANGE</p>
					<p class="font-body mt-1 text-sm">{originalRequest.budgetRange ?? 'Not specified'}</p>
				</div>
				<div>
					<p class="font-mono text-[10px] tracking-widest text-muted-foreground">TIMELINE</p>
					<p class="font-body mt-1 text-sm">{originalRequest.timeline ?? 'Not specified'}</p>
				</div>
				<div>
					<p class="font-mono text-[10px] tracking-widest text-muted-foreground">SUBMITTED</p>
					<p class="font-body mt-1 text-sm">{formatDate(originalRequest.createdAt)}</p>
				</div>
			</div>
			
			{#if originalRequest.convertedAt}
				<div class="mt-6 flex items-center gap-2 border-t border-border pt-4">
					<CheckCircle2 class="h-4 w-4 text-green-500" />
					<span class="font-mono text-xs text-green-500">
						Converted to project on {formatDate(originalRequest.convertedAt)}
					</span>
				</div>
			{/if}
		</div>
	</section>
	{/if}
</div>
