<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import {
		ArrowLeft,
		User,
		Clock,
		Calendar,
		DollarSign,
		FileText,
		Ticket,
		Receipt,
		Edit2,
		Save,
		X,
		AlertCircle,
		Building2,
		Activity,
		Hammer,
		HeadphonesIcon,
		Plus
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Tabs from '$lib/components/ui/tabs';
	import { PhaseBadge, PhaseTimeline, PhaseActions } from '$lib/components/ui/phase-badge';
	import { RevisionList } from '$lib/components/ui/revision';
	import { cn } from '$lib/utils';

	let { data, form } = $props();

	let activeTab = $state('overview');
	let editingDescription = $state(false);
	let editingDetails = $state(false);
	let description = $state(data.project.description ?? '');
	let showNewRevisionForm = $state(false);
	let phaseActionLoading = $state(false);

	function handlePhaseAction(action: string) {
		phaseActionLoading = true;
		const form = document.createElement('form');
		form.method = 'POST';
		form.action = '?/updatePhase';
		
		const input = document.createElement('input');
		input.type = 'hidden';
		input.name = 'action';
		input.value = action;
		form.appendChild(input);
		
		document.body.appendChild(form);
		form.submit();
	}

	function formatDate(date: string | Date | null) {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatDateTime(date: string | Date | null) {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatDateInput(date: string | Date | null) {
		if (!date) return '';
		return new Date(date).toISOString().split('T')[0];
	}

	function formatCurrency(amount: string | number | null, currency: string = 'USD') {
		if (amount === null || amount === undefined) return 'N/A';
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency
		}).format(Number(amount));
	}

	function formatStatusLabel(status: string) {
		return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}

	function getProposalStatusColor(status: string) {
		switch (status) {
			case 'draft': return 'bg-muted text-muted-foreground border-muted';
			case 'sent': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
			case 'viewed': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
			case 'accepted': return 'bg-green-500/10 text-green-500 border-green-500/30';
			case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/30';
			default: return 'bg-muted text-muted-foreground border-muted';
		}
	}

	function getTicketStatusColor(status: string) {
		switch (status) {
			case 'open': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
			case 'in_progress': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
			case 'resolved': return 'bg-green-500/10 text-green-500 border-green-500/30';
			case 'closed': return 'bg-muted text-muted-foreground border-muted';
			default: return 'bg-muted text-muted-foreground border-muted';
		}
	}

	function getInvoiceStatusColor(status: string) {
		switch (status) {
			case 'draft': return 'bg-muted text-muted-foreground border-muted';
			case 'sent': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
			case 'paid': return 'bg-green-500/10 text-green-500 border-green-500/30';
			case 'overdue': return 'bg-red-500/10 text-red-500 border-red-500/30';
			default: return 'bg-muted text-muted-foreground border-muted';
		}
	}

	function getPriorityColor(priority: string) {
		switch (priority) {
			case 'urgent': return 'bg-red-500/10 text-red-500 border-red-500/30';
			case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
			case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
			case 'low': return 'bg-green-500/10 text-green-500 border-green-500/30';
			default: return 'bg-muted text-muted-foreground border-muted';
		}
	}
</script>

<svelte:head>
	<title>{data.project.name} | Admin</title>
</svelte:head>

<div class="min-h-screen bg-muted/30">
	<!-- Header -->
	<div class="border-b border-border bg-background">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div class="flex items-start justify-between gap-4">
				<div class="flex items-start gap-4">
					<a href="/admin/projects" class="mt-1 text-muted-foreground hover:text-foreground transition-colors">
						<ArrowLeft class="h-5 w-5" />
					</a>
					<div>
						<div class="flex items-center gap-3 mb-1">
							<span class="font-mono text-xs text-muted-foreground">{data.project.projectNumber}</span>
							<span class="text-muted-foreground">•</span>
							<a href="/admin/organizations/{data.project.organizationId}" class="font-mono text-xs text-muted-foreground hover:text-primary transition-colors">
								{data.project.orgNumber} — {data.project.organization}
							</a>
						</div>
						<h1 class="font-display text-2xl font-medium text-foreground">{data.project.name}</h1>
					</div>
				</div>
				<PhaseBadge phase={data.project.phase} size="lg" />
			</div>

			<!-- Phase Timeline -->
			<div class="mt-6">
				<PhaseTimeline currentPhase={data.project.phase} />
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if form?.error}
			<div class="mb-6 flex items-center gap-2 border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
				<AlertCircle class="h-4 w-4" />
				{form.error}
			</div>
		{/if}

		{#if form?.success}
			<div class="mb-6 flex items-center gap-2 border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">
				<AlertCircle class="h-4 w-4" />
				{form.message}
			</div>
		{/if}

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
			<!-- Main Content -->
			<div class="lg:col-span-3">
				<Tabs.Root bind:value={activeTab}>
					<Tabs.List class="w-full justify-start border-b border-border bg-transparent p-0">
						<Tabs.Trigger value="overview" class="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
							Overview
						</Tabs.Trigger>
						<Tabs.Trigger value="proposal" class="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
							Proposal & Scope
						</Tabs.Trigger>
						<Tabs.Trigger value="revisions" class="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
							Revisions ({data.revisions.length})
						</Tabs.Trigger>
						<Tabs.Trigger value="billing" class="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
							Billing ({data.invoices.length})
						</Tabs.Trigger>
						{#if data.project.phase === 'support'}
							<Tabs.Trigger value="support" class="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
								Support ({data.tickets.length})
							</Tabs.Trigger>
						{/if}
						<Tabs.Trigger value="activity" class="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
							Activity
						</Tabs.Trigger>
					</Tabs.List>

					<!-- Overview Tab -->
					<Tabs.Content value="overview" class="mt-6 space-y-6">
						<!-- Description -->
						<div class="border border-border bg-background">
							<div class="border-b border-border px-6 py-4 flex items-center justify-between">
								<h2 class="font-mono text-xs tracking-widest text-muted-foreground">DESCRIPTION</h2>
								{#if !editingDescription}
									<button
										onclick={() => (editingDescription = true)}
										class="p-1 text-muted-foreground hover:text-foreground transition-colors"
									>
										<Edit2 class="h-4 w-4" />
									</button>
								{/if}
							</div>
							<div class="p-6">
								{#if editingDescription}
									<form
										method="POST"
										action="?/updateDescription"
										use:enhance={() => {
											return async ({ update }) => {
												await update();
												editingDescription = false;
											};
										}}
									>
										<Textarea
											name="description"
											bind:value={description}
											rows={6}
											placeholder="Enter project description..."
											class="resize-none"
										/>
										<div class="mt-4 flex justify-end gap-2">
											<Button type="button" variant="outline" onclick={() => (editingDescription = false)}>
												<X class="mr-2 h-4 w-4" />
												Cancel
											</Button>
											<Button type="submit">
												<Save class="mr-2 h-4 w-4" />
												Save
											</Button>
										</div>
									</form>
								{:else}
									<p class="whitespace-pre-wrap text-foreground">
										{data.project.description || 'No description provided.'}
									</p>
								{/if}
							</div>
						</div>

						<!-- Key Dates -->
						<div class="border border-border bg-background">
							<div class="border-b border-border px-6 py-4 flex items-center justify-between">
								<h2 class="font-mono text-xs tracking-widest text-muted-foreground">KEY DATES</h2>
								{#if !editingDetails}
									<button
										onclick={() => (editingDetails = true)}
										class="p-1 text-muted-foreground hover:text-foreground transition-colors"
									>
										<Edit2 class="h-4 w-4" />
									</button>
								{/if}
							</div>
							<div class="p-6">
								{#if editingDetails}
									<form
										method="POST"
										action="?/updateDetails"
										use:enhance={() => {
											return async ({ update }) => {
												await update();
												editingDetails = false;
											};
										}}
										class="grid grid-cols-2 gap-4"
									>
										<div>
											<label for="startDate" class="block text-sm text-muted-foreground mb-1">Start Date</label>
											<Input id="startDate" type="date" name="startDate" value={formatDateInput(data.project.startDate)} />
										</div>
										<div>
											<label for="endDate" class="block text-sm text-muted-foreground mb-1">End Date</label>
											<Input id="endDate" type="date" name="endDate" value={formatDateInput(data.project.endDate)} />
										</div>
										<div>
											<label for="estimatedBudget" class="block text-sm text-muted-foreground mb-1">Estimated Budget</label>
											<Input id="estimatedBudget" type="number" name="estimatedBudget" step="0.01" value={data.project.estimatedBudget ?? ''} />
										</div>
										<div>
											<label for="actualBudget" class="block text-sm text-muted-foreground mb-1">Actual Budget</label>
											<Input id="actualBudget" type="number" name="actualBudget" step="0.01" value={data.project.actualBudget ?? ''} />
										</div>
										<div class="col-span-2 flex justify-end gap-2">
											<Button type="button" variant="outline" size="sm" onclick={() => (editingDetails = false)}>Cancel</Button>
											<Button type="submit" size="sm">Save</Button>
										</div>
									</form>
								{:else}
									<div class="grid grid-cols-2 gap-4 text-sm">
										<div class="flex items-center gap-2">
											<Calendar class="h-4 w-4 text-muted-foreground" />
											<span class="text-muted-foreground">Start:</span>
											<span class="text-foreground">{formatDate(data.project.startDate)}</span>
										</div>
										<div class="flex items-center gap-2">
											<Calendar class="h-4 w-4 text-muted-foreground" />
											<span class="text-muted-foreground">End:</span>
											<span class="text-foreground">{formatDate(data.project.endDate)}</span>
										</div>
										{#if data.project.completedAt}
											<div class="flex items-center gap-2">
												<Calendar class="h-4 w-4 text-green-500" />
												<span class="text-muted-foreground">Completed:</span>
												<span class="text-green-500">{formatDate(data.project.completedAt)}</span>
											</div>
										{/if}
									</div>
								{/if}
							</div>
						</div>

						<!-- Budget Overview -->
						<div class="border border-border bg-background">
							<div class="border-b border-border px-6 py-4">
								<h2 class="font-mono text-xs tracking-widest text-muted-foreground">BUDGET</h2>
							</div>
							<div class="p-6">
								<div class="grid grid-cols-2 gap-4 text-sm">
									<div>
										<span class="text-muted-foreground">Estimated</span>
										<p class="text-xl font-medium text-foreground">
											{formatCurrency(data.project.estimatedBudget, data.project.currency)}
										</p>
									</div>
									<div>
										<span class="text-muted-foreground">Actual</span>
										<p class="text-xl font-medium text-foreground">
											{formatCurrency(data.project.actualBudget, data.project.currency)}
										</p>
									</div>
								</div>
							</div>
						</div>
					</Tabs.Content>

					<!-- Proposal & Scope Tab -->
					<Tabs.Content value="proposal" class="mt-6 space-y-6">
						<div class="border border-border bg-background">
							<div class="border-b border-border px-6 py-4 flex items-center justify-between">
								<h2 class="font-mono text-xs tracking-widest text-muted-foreground">PROPOSALS ({data.proposals.length})</h2>
								<a href="/admin/proposals/new?projectId={data.project.id}" class="text-xs text-primary hover:text-primary/80 transition-colors">
									+ New Proposal
								</a>
							</div>
							{#if data.proposals.length === 0}
								<div class="p-6 text-center text-muted-foreground">
									<FileText class="mx-auto h-8 w-8 opacity-50" />
									<p class="mt-2">No proposals yet</p>
								</div>
							{:else}
								<div class="divide-y divide-border">
									{#each data.proposals as proposal (proposal.id)}
										<a href="/admin/proposals/{proposal.id}" class="block p-4 hover:bg-muted/50 transition-colors">
											<div class="flex items-center justify-between">
												<div>
													<div class="flex items-center gap-2 mb-1">
														<span class="font-mono text-xs text-muted-foreground">{proposal.proposalNumber}</span>
													</div>
													<p class="font-medium text-foreground">{proposal.title}</p>
													<p class="text-sm text-muted-foreground mt-1">
														{formatCurrency(proposal.total, proposal.currency)}
													</p>
												</div>
												<div class="text-right">
													<span class={cn('px-2 py-0.5 text-xs font-medium border', getProposalStatusColor(proposal.status))}>
														{formatStatusLabel(proposal.status)}
													</span>
													<p class="text-xs text-muted-foreground mt-1">{formatDate(proposal.createdAt)}</p>
												</div>
											</div>
										</a>
									{/each}
								</div>
							{/if}
						</div>

						<!-- Confirmation Status -->
						{#if data.project.proposalStatus}
							<div class="border border-border bg-background">
								<div class="border-b border-border px-6 py-4">
									<h2 class="font-mono text-xs tracking-widest text-muted-foreground">CONFIRMATION STATUS</h2>
								</div>
								<div class="p-6 space-y-3">
									<div class="flex items-center justify-between">
										<span class="text-muted-foreground">Proposal Status</span>
										<span class="font-medium">{formatStatusLabel(data.project.proposalStatus)}</span>
									</div>
									{#if data.project.clientAcceptedAt}
										<div class="flex items-center justify-between">
											<span class="text-muted-foreground">Client Accepted</span>
											<span class="text-green-500">{formatDateTime(data.project.clientAcceptedAt)}</span>
										</div>
									{/if}
									{#if data.project.adminConfirmedAt}
										<div class="flex items-center justify-between">
											<span class="text-muted-foreground">Admin Confirmed</span>
											<span class="text-green-500">{formatDateTime(data.project.adminConfirmedAt)}</span>
										</div>
									{/if}
								</div>
							</div>
						{/if}
					</Tabs.Content>

					<!-- Revisions Tab -->
					<Tabs.Content value="revisions" class="mt-6 space-y-6">
						{#if showNewRevisionForm}
							<div class="border border-border bg-background p-6">
								<h3 class="font-mono text-xs tracking-widest text-muted-foreground mb-4">NEW REVISION</h3>
								<form
									method="POST"
									action="?/createRevision"
									use:enhance={() => {
										return async ({ update }) => {
											await update();
											showNewRevisionForm = false;
										};
									}}
									class="space-y-4"
								>
									<div class="grid grid-cols-2 gap-4">
										<div>
											<label for="title" class="block text-sm text-muted-foreground mb-1">Title *</label>
											<Input id="title" name="title" required placeholder="Revision title..." />
										</div>
										<div>
											<label for="version" class="block text-sm text-muted-foreground mb-1">Version</label>
											<Input id="version" name="version" placeholder="e.g. v1.2" />
										</div>
									</div>
									<div>
										<label for="revision-description" class="block text-sm text-muted-foreground mb-1">Description</label>
										<Textarea id="revision-description" name="description" rows={3} placeholder="Describe the revision..." />
									</div>
									<div>
										<label for="priority" class="block text-sm text-muted-foreground mb-1">Priority</label>
										<select id="priority" name="priority" class="h-10 w-full border border-border bg-background px-3 text-sm">
											<option value="low">Low</option>
											<option value="medium" selected>Medium</option>
											<option value="high">High</option>
											<option value="urgent">Urgent</option>
										</select>
									</div>
									<div class="flex justify-end gap-2">
										<Button type="button" variant="outline" onclick={() => (showNewRevisionForm = false)}>Cancel</Button>
										<Button type="submit">Create Revision</Button>
									</div>
								</form>
							</div>
						{/if}

						<RevisionList
							revisions={data.revisions}
							onCreateClick={() => (showNewRevisionForm = true)}
							onRevisionClick={(id) => {
								// Could open a modal or navigate to revision detail
								console.log('Revision clicked:', id);
							}}
						/>
					</Tabs.Content>

					<!-- Billing Tab -->
					<Tabs.Content value="billing" class="mt-6 space-y-6">
						<div class="border border-border bg-background">
							<div class="border-b border-border px-6 py-4">
								<h2 class="font-mono text-xs tracking-widest text-muted-foreground">INVOICES ({data.invoices.length})</h2>
							</div>
							{#if data.invoices.length === 0}
								<div class="p-6 text-center text-muted-foreground">
									<Receipt class="mx-auto h-8 w-8 opacity-50" />
									<p class="mt-2">No invoices for this project</p>
								</div>
							{:else}
								<div class="divide-y divide-border">
									{#each data.invoices as invoice (invoice.id)}
										<a href="/admin/invoices/{invoice.id}" class="block p-4 hover:bg-muted/50 transition-colors">
											<div class="flex items-center justify-between">
												<div>
													<span class="font-mono text-xs text-muted-foreground">#{invoice.invoiceNumber}</span>
													<p class="font-medium text-foreground mt-1">
														{formatCurrency(invoice.total, invoice.currency)}
													</p>
												</div>
												<div class="text-right">
													<span class={cn('px-2 py-0.5 text-xs font-medium border', getInvoiceStatusColor(invoice.status))}>
														{formatStatusLabel(invoice.status)}
													</span>
													<p class="text-xs text-muted-foreground mt-1">Due: {formatDate(invoice.dueDate)}</p>
												</div>
											</div>
										</a>
									{/each}
								</div>
							{/if}
						</div>
					</Tabs.Content>

					<!-- Support Tab -->
					{#if data.project.phase === 'support'}
						<Tabs.Content value="support" class="mt-6 space-y-6">
							<!-- Support Contract -->
							<div class="border border-border bg-background">
								<div class="border-b border-border px-6 py-4">
									<h2 class="font-mono text-xs tracking-widest text-muted-foreground">SUPPORT CONTRACT</h2>
								</div>
								<div class="p-6 space-y-3 text-sm">
									<div class="flex items-center justify-between">
										<span class="text-muted-foreground">Started</span>
										<span class="text-foreground">{formatDate(data.project.supportStartedAt)}</span>
									</div>
									<div class="flex items-center justify-between">
										<span class="text-muted-foreground">Ends</span>
										<span class="text-foreground">{formatDate(data.project.supportEndsAt)}</span>
									</div>
								</div>
							</div>

							<!-- Tickets -->
							<div class="border border-border bg-background">
								<div class="border-b border-border px-6 py-4">
									<h2 class="font-mono text-xs tracking-widest text-muted-foreground">TICKETS ({data.tickets.length})</h2>
								</div>
								{#if data.tickets.length === 0}
									<div class="p-6 text-center text-muted-foreground">
										<Ticket class="mx-auto h-8 w-8 opacity-50" />
										<p class="mt-2">No tickets for this project</p>
									</div>
								{:else}
									<div class="divide-y divide-border">
										{#each data.tickets as ticket (ticket.id)}
											<a href="/admin/tickets/{ticket.id}" class="block p-4 hover:bg-muted/50 transition-colors">
												<div class="flex items-center justify-between">
													<div>
														<div class="flex items-center gap-2">
															<span class="font-mono text-xs text-muted-foreground">#{ticket.ticketNumber}</span>
															<span class={cn('px-1.5 py-0.5 text-[10px] font-medium border', getPriorityColor(ticket.priority))}>
																{ticket.priority.toUpperCase()}
															</span>
														</div>
														<p class="font-medium text-foreground mt-1">{ticket.subject}</p>
													</div>
													<div class="text-right">
														<span class={cn('px-2 py-0.5 text-xs font-medium border', getTicketStatusColor(ticket.status))}>
															{formatStatusLabel(ticket.status)}
														</span>
														<p class="text-xs text-muted-foreground mt-1">{formatDate(ticket.createdAt)}</p>
													</div>
												</div>
											</a>
										{/each}
									</div>
								{/if}
							</div>
						</Tabs.Content>
					{/if}

					<!-- Activity Tab -->
					<Tabs.Content value="activity" class="mt-6">
						<div class="border border-border bg-background">
							<div class="border-b border-border px-6 py-4">
								<h2 class="font-mono text-xs tracking-widest text-muted-foreground">ACTIVITY LOG</h2>
							</div>
							{#if data.activity.length === 0}
								<div class="p-6 text-center text-muted-foreground">
									<Activity class="mx-auto h-8 w-8 opacity-50" />
									<p class="mt-2">No activity yet</p>
								</div>
							{:else}
								<div class="divide-y divide-border">
									{#each data.activity as item (item.id)}
										<div class="p-4">
											<div class="flex items-start gap-3">
												<div class="mt-0.5 h-8 w-8 flex items-center justify-center border border-border bg-muted">
													<Activity class="h-4 w-4 text-muted-foreground" />
												</div>
												<div class="flex-1">
													<p class="text-sm text-foreground">{item.description}</p>
													<div class="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
														<span>{item.actorName ?? 'System'}</span>
														<span>•</span>
														<span>{formatDateTime(item.createdAt)}</span>
													</div>
												</div>
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>
					</Tabs.Content>
				</Tabs.Root>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Phase Actions -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">PHASE ACTIONS</h2>
					</div>
					<div class="p-6">
						<PhaseActions
							currentPhase={data.project.phase}
							proposalStatus={data.project.proposalStatus}
							onAction={handlePhaseAction}
							loading={phaseActionLoading}
						/>
					</div>
				</div>

				<!-- Assignment -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">ASSIGNMENT</h2>
					</div>
					<div class="p-6">
						<form method="POST" action="?/assign" use:enhance>
							<label for="assignedToId" class="block font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
								ASSIGNED TO
							</label>
							<select
								id="assignedToId"
								name="assignedToId"
								class="font-body h-10 w-full border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
								value={data.project.assignedTo?.id ?? ''}
								onchange={(e) => e.currentTarget.form?.requestSubmit()}
							>
								<option value="">Unassigned</option>
								{#each data.staffMembers as staff (staff.id)}
									<option value={staff.id}>
										{staff.displayName} ({staff.role})
									</option>
								{/each}
							</select>
						</form>
					</div>
				</div>

				<!-- Project Details -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">DETAILS</h2>
					</div>
					<div class="p-6 space-y-3 text-sm">
						<div>
							<span class="text-muted-foreground">Organization</span>
							<p class="font-medium text-foreground">{data.project.organization}</p>
						</div>
						<div>
							<span class="text-muted-foreground">Slug</span>
							<p class="font-mono text-foreground">{data.project.slug}</p>
						</div>
						<div>
							<span class="text-muted-foreground">Created</span>
							<p class="font-medium text-foreground">{formatDateTime(data.project.createdAt)}</p>
						</div>
						<div>
							<span class="text-muted-foreground">Last Updated</span>
							<p class="font-medium text-foreground">{formatDateTime(data.project.updatedAt)}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
