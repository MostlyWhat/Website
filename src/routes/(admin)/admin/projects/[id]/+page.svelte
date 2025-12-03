<script lang="ts">
	import { enhance } from '$app/forms';
	import { ArrowLeft, User, Clock, Calendar, DollarSign, FileText, Ticket, Receipt, Edit2, Save, X, AlertCircle } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';

	let { data, form } = $props();

	let editingDescription = $state(false);
	let editingDetails = $state(false);
	let description = $state(data.project.description ?? '');

	const statusOptions = [
		{ value: 'draft', label: 'Draft' },
		{ value: 'proposal_sent', label: 'Proposal Sent' },
		{ value: 'proposal_accepted', label: 'Proposal Accepted' },
		{ value: 'proposal_rejected', label: 'Proposal Rejected' },
		{ value: 'in_progress', label: 'In Progress' },
		{ value: 'on_hold', label: 'On Hold' },
		{ value: 'completed', label: 'Completed' },
		{ value: 'cancelled', label: 'Cancelled' }
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'draft': return 'bg-muted text-muted-foreground border-muted';
			case 'proposal_sent': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
			case 'proposal_accepted': return 'bg-green-500/10 text-green-500 border-green-500/30';
			case 'proposal_rejected': return 'bg-red-500/10 text-red-500 border-red-500/30';
			case 'in_progress': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
			case 'on_hold': return 'bg-orange-500/10 text-orange-500 border-orange-500/30';
			case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/30';
			case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/30';
			default: return 'bg-muted text-muted-foreground border-muted';
		}
	}

	function getProposalStatusColor(status: string) {
		switch (status) {
			case 'draft': return 'bg-muted text-muted-foreground border-muted';
			case 'sent': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
			case 'viewed': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
			case 'accepted': return 'bg-green-500/10 text-green-500 border-green-500/30';
			case 'rejected': return 'bg-red-500/10 text-red-500 border-red-500/30';
			case 'expired': return 'bg-muted text-muted-foreground border-muted';
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
			case 'viewed': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
			case 'paid': return 'bg-green-500/10 text-green-500 border-green-500/30';
			case 'overdue': return 'bg-red-500/10 text-red-500 border-red-500/30';
			case 'cancelled': return 'bg-muted text-muted-foreground border-muted';
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
		return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
	}
</script>

<svelte:head>
	<title>{data.project.name} | Admin</title>
</svelte:head>

<div class="min-h-screen bg-muted/30">
	<!-- Header -->
	<div class="border-b border-border bg-background">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div class="flex items-center gap-4">
				<a href="/admin/projects" class="text-muted-foreground hover:text-foreground transition-colors">
					<ArrowLeft class="h-5 w-5" />
				</a>
				<div class="flex-1">
					<div class="flex items-center gap-3">
						<span class="font-mono text-sm text-muted-foreground">{data.project.organization}</span>
						<span class={`px-2 py-0.5 text-xs font-medium border ${getStatusColor(data.project.status)}`}>
							{formatStatusLabel(data.project.status)}
						</span>
					</div>
					<h1 class="mt-1 font-display text-2xl font-medium text-foreground">{data.project.name}</h1>
				</div>
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

		<div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
			<!-- Main Content -->
			<div class="lg:col-span-2 space-y-6">
				<!-- Description -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4 flex items-center justify-between">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">DESCRIPTION</h2>
						{#if !editingDescription}
							<button 
								onclick={() => editingDescription = true}
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
									<Button type="button" variant="outline" onclick={() => editingDescription = false}>
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

				<!-- Proposals -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4 flex items-center justify-between">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">
							PROPOSALS ({data.proposals.length})
						</h2>
						<a 
							href="/admin/proposals/new?projectId={data.project.id}"
							class="text-xs text-primary hover:text-primary/80 transition-colors"
						>
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
							{#each data.proposals as proposal}
								<a href="/admin/proposals/{proposal.id}" class="block p-4 hover:bg-muted/50 transition-colors">
									<div class="flex items-center justify-between">
										<div>
											<p class="font-medium text-foreground">{proposal.title}</p>
											<p class="text-sm text-muted-foreground mt-1">
												{formatCurrency(proposal.total, proposal.currency)}
											</p>
										</div>
										<div class="text-right">
											<span class={`px-2 py-0.5 text-xs font-medium border ${getProposalStatusColor(proposal.status)}`}>
												{formatStatusLabel(proposal.status)}
											</span>
											<p class="text-xs text-muted-foreground mt-1">
												{formatDate(proposal.createdAt)}
											</p>
										</div>
									</div>
								</a>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Tickets -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">
							TICKETS ({data.tickets.length})
						</h2>
					</div>
					{#if data.tickets.length === 0}
						<div class="p-6 text-center text-muted-foreground">
							<Ticket class="mx-auto h-8 w-8 opacity-50" />
							<p class="mt-2">No tickets for this project</p>
						</div>
					{:else}
						<div class="divide-y divide-border">
							{#each data.tickets as ticket}
								<a href="/admin/tickets/{ticket.id}" class="block p-4 hover:bg-muted/50 transition-colors">
									<div class="flex items-center justify-between">
										<div>
											<div class="flex items-center gap-2">
												<span class="font-mono text-xs text-muted-foreground">#{ticket.ticketNumber}</span>
												<span class={`px-1.5 py-0.5 text-[10px] font-medium border ${getPriorityColor(ticket.priority)}`}>
													{ticket.priority.toUpperCase()}
												</span>
											</div>
											<p class="font-medium text-foreground mt-1">{ticket.subject}</p>
										</div>
										<div class="text-right">
											<span class={`px-2 py-0.5 text-xs font-medium border ${getTicketStatusColor(ticket.status)}`}>
												{formatStatusLabel(ticket.status)}
											</span>
											<p class="text-xs text-muted-foreground mt-1">
												{formatDate(ticket.createdAt)}
											</p>
										</div>
									</div>
								</a>
							{/each}
						</div>
					{/if}
				</div>

				<!-- Invoices -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">
							INVOICES ({data.invoices.length})
						</h2>
					</div>
					{#if data.invoices.length === 0}
						<div class="p-6 text-center text-muted-foreground">
							<Receipt class="mx-auto h-8 w-8 opacity-50" />
							<p class="mt-2">No invoices for this project</p>
						</div>
					{:else}
						<div class="divide-y divide-border">
							{#each data.invoices as invoice}
								<a href="/admin/invoices/{invoice.id}" class="block p-4 hover:bg-muted/50 transition-colors">
									<div class="flex items-center justify-between">
										<div>
											<span class="font-mono text-xs text-muted-foreground">#{invoice.invoiceNumber}</span>
											<p class="font-medium text-foreground mt-1">
												{formatCurrency(invoice.total, invoice.currency)}
											</p>
										</div>
										<div class="text-right">
											<span class={`px-2 py-0.5 text-xs font-medium border ${getInvoiceStatusColor(invoice.status)}`}>
												{formatStatusLabel(invoice.status)}
											</span>
											<p class="text-xs text-muted-foreground mt-1">
												Due: {formatDate(invoice.dueDate)}
											</p>
										</div>
									</div>
								</a>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<!-- Sidebar -->
			<div class="space-y-6">
				<!-- Quick Actions -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">QUICK ACTIONS</h2>
					</div>
					<div class="p-6 space-y-4">
						<!-- Status Update -->
						<form method="POST" action="?/updateStatus" use:enhance>
							<label for="status" class="block font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
								STATUS
							</label>
							<select
								id="status"
								name="status"
								class="font-body h-10 w-full border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
								value={data.project.status}
								onchange={(e) => e.currentTarget.form?.requestSubmit()}
							>
								{#each statusOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</form>

						<!-- Assignment -->
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
								{#each data.staffMembers as staff}
									<option value={staff.id}>
										{staff.displayName} ({staff.role})
									</option>
								{/each}
							</select>
						</form>
					</div>
				</div>

				<!-- Timeline -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4 flex items-center justify-between">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">TIMELINE</h2>
						{#if !editingDetails}
							<button 
								onclick={() => editingDetails = true}
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
								class="space-y-4"
							>
								<div>
									<label for="startDate" class="block text-sm text-muted-foreground mb-1">Start Date</label>
									<Input
										id="startDate"
										type="date"
										name="startDate"
										value={formatDateInput(data.project.startDate)}
									/>
								</div>
								<div>
									<label for="endDate" class="block text-sm text-muted-foreground mb-1">End Date</label>
									<Input
										id="endDate"
										type="date"
										name="endDate"
										value={formatDateInput(data.project.endDate)}
									/>
								</div>
								<div>
									<label for="estimatedBudget" class="block text-sm text-muted-foreground mb-1">Estimated Budget</label>
									<Input
										id="estimatedBudget"
										type="number"
										name="estimatedBudget"
										step="0.01"
										value={data.project.estimatedBudget ?? ''}
										placeholder="0.00"
									/>
								</div>
								<div>
									<label for="actualBudget" class="block text-sm text-muted-foreground mb-1">Actual Budget</label>
									<Input
										id="actualBudget"
										type="number"
										name="actualBudget"
										step="0.01"
										value={data.project.actualBudget ?? ''}
										placeholder="0.00"
									/>
								</div>
								<div class="flex justify-end gap-2">
									<Button type="button" variant="outline" size="sm" onclick={() => editingDetails = false}>
										Cancel
									</Button>
									<Button type="submit" size="sm">Save</Button>
								</div>
							</form>
						{:else}
							<div class="space-y-3 text-sm">
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

				<!-- Budget -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">BUDGET</h2>
					</div>
					<div class="p-6 space-y-3 text-sm">
						<div class="flex items-center justify-between">
							<span class="text-muted-foreground">Estimated</span>
							<span class="font-medium text-foreground">
								{formatCurrency(data.project.estimatedBudget, data.project.currency)}
							</span>
						</div>
						<div class="flex items-center justify-between">
							<span class="text-muted-foreground">Actual</span>
							<span class="font-medium text-foreground">
								{formatCurrency(data.project.actualBudget, data.project.currency)}
							</span>
						</div>
					</div>
				</div>

				<!-- Details -->
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
