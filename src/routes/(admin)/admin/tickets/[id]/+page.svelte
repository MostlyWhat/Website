<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { ArrowLeft, User, Clock, Tag, AlertCircle, MessageSquare, Send, Trash2, Lock, AlertTriangle, MessageSquareText, ChevronDown, X, Plus, Paperclip, GitMerge, Search, Link2, Unlink, Star, ThumbsUp, ThumbsDown } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import FileUploader from '$lib/components/ui/FileUploader.svelte';
	import { StaffAssignmentSelect } from '$lib/components/ui/staff-select';
	import { PageHeader, ActionButtons } from '$lib/components/ui/layouts';

	let { data, form } = $props();

	let newComment = $state('');
	let isInternal = $state(false);
	let isSubmitting = $state(false);
	let showCannedResponses = $state(false);
	let cannedFilter = $state('');
	let newTag = $state('');
	let showAddTag = $state(false);
	let showAttachments = $state(false);
	let assignedStaffId = $state(data.ticket.assignedTo?.id ?? '');
	
	// Merge dialog state
	let showMergeDialog = $state(false);
	let mergeQuery = $state('');
	let searchResults = $state<Array<{id: string; ticketNumber: string; subject: string; status: string; priority: string; createdAt: string | null; createdByName: string}>>([]);
	let selectedTargetTicket = $state<{id: string; ticketNumber: string; subject: string} | null>(null);
	let transferComments = $state(true);
	let transferTags = $state(true);
	let isSearching = $state(false);
	
	// Parent ticket dialog state
	let showParentDialog = $state(false);
	let parentQuery = $state('');
	let parentSearchResults = $state<Array<{id: string; ticketNumber: string; subject: string; status: string; priority: string; createdAt: string | null; createdByName: string}>>([]);
	let selectedParentTicket = $state<{id: string; ticketNumber: string; subject: string} | null>(null);
	let isSearchingParent = $state(false);

	// Local state for attachments that can be modified by FileUploader
	let attachmentFiles = $state<Array<{
		id?: string;
		name: string;
		type: string;
		size: number;
		url?: string;
		createdAt?: string;
		uploadedBy?: string;
		status?: 'pending' | 'uploading' | 'complete' | 'error';
	}>>([]);

	// Sync attachments from server data
	$effect(() => {
		if (data.attachments) {
			attachmentFiles = data.attachments.map(a => ({
				id: a.id,
				name: a.name,
				type: a.type,
				size: a.size,
				url: a.url ?? undefined,
				createdAt: a.createdAt?.toISOString() ?? undefined,
				uploadedBy: a.uploadedBy ?? undefined,
				status: 'complete' as const
			}));
		}
	});

	const statusOptions = [
		{ value: 'open', label: 'Open' },
		{ value: 'in_progress', label: 'In Progress' },
		{ value: 'waiting_on_customer', label: 'Waiting on Customer' },
		{ value: 'resolved', label: 'Resolved' },
		{ value: 'closed', label: 'Closed' }
	];

	const priorityOptions = [
		{ value: 'low', label: 'Low' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'high', label: 'High' },
		{ value: 'urgent', label: 'Urgent' }
	];

	const categoryOptions = [
		{ value: '', label: 'No Category' },
		{ value: 'general', label: 'General Support' },
		{ value: 'billing', label: 'Billing & Payments' },
		{ value: 'technical', label: 'Technical Issue' },
		{ value: 'feature', label: 'Feature Request' },
		{ value: 'bug', label: 'Bug Report' },
		{ value: 'account', label: 'Account Issues' },
		{ value: 'security', label: 'Security Concern' }
	];

	function getStatusColor(status: string) {
		switch (status) {
			case 'open': return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
			case 'in_progress': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
			case 'waiting_on_customer': return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
			case 'resolved': return 'bg-green-500/10 text-green-500 border-green-500/30';
			case 'closed': return 'bg-muted text-muted-foreground border-muted';
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
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function formatStatusLabel(status: string) {
		return status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
	}

	// Filter canned responses by shortcut or title
	const filteredCannedResponses = $derived(
		data.cannedResponses.filter(r => 
			!cannedFilter || 
			(r.shortcut && r.shortcut.toLowerCase().includes(cannedFilter.toLowerCase())) ||
			r.title.toLowerCase().includes(cannedFilter.toLowerCase())
		)
	);

	function insertCannedResponse(content: string, supportsVariables: boolean = false) {
		if (supportsVariables) {
			// Expand variables using ticket context
			let expanded = content;
			
			// Ticket variables
			expanded = expanded.replace(/\{\{ticket\.number\}\}/g, data.ticket.ticketNumber);
			expanded = expanded.replace(/\{\{ticket\.subject\}\}/g, data.ticket.subject);
			expanded = expanded.replace(/\{\{ticket\.category\}\}/g, data.ticket.category || 'general');
			expanded = expanded.replace(/\{\{ticket\.priority\}\}/g, data.ticket.priority);
			expanded = expanded.replace(/\{\{ticket\.status\}\}/g, data.ticket.status);
			
			// Customer variables
			if (data.ticket.createdBy) {
				expanded = expanded.replace(/\{\{customer\.name\}\}/g, data.ticket.createdBy.displayName || '');
				expanded = expanded.replace(/\{\{customer\.email\}\}/g, data.ticket.createdBy.email || '');
				expanded = expanded.replace(/\{\{customer\.firstName\}\}/g, data.ticket.createdBy.firstName || '');
				expanded = expanded.replace(/\{\{customer\.lastName\}\}/g, data.ticket.createdBy.lastName || '');
			}
			
			// Assignee variables
			if (data.ticket.assignedTo) {
				expanded = expanded.replace(/\{\{assignee\.name\}\}/g, data.ticket.assignedTo.displayName || '');
				expanded = expanded.replace(/\{\{assignee\.email\}\}/g, data.ticket.assignedTo.email || '');
			}
			
			// Organization variables
			if (data.ticket.organization) {
				expanded = expanded.replace(/\{\{organization\.name\}\}/g, data.ticket.organization.name);
			}
			
			// Project variables
			if (data.ticket.project) {
				expanded = expanded.replace(/\{\{project\.name\}\}/g, data.ticket.project.name);
			}
			
			newComment = expanded;
		} else {
			newComment = content;
		}
		
		showCannedResponses = false;
		cannedFilter = '';
	}
	
	async function searchTickets() {
		if (mergeQuery.length < 2) {
			searchResults = [];
			return;
		}
		
		isSearching = true;
		const formData = new FormData();
		formData.append('query', mergeQuery);
		
		const response = await fetch('?/searchTickets', {
			method: 'POST',
			body: formData
		});
		
		const result = (await response.json()) as { data?: { tickets?: any[] } };
		searchResults = result.data?.tickets ?? [];
		isSearching = false;
	}
	
	function selectTargetTicket(ticket: {id: string; ticketNumber: string; subject: string}) {
		selectedTargetTicket = ticket;
		mergeQuery = '';
		searchResults = [];
	}
	
	function openMergeDialog() {
		showMergeDialog = true;
		selectedTargetTicket = null;
		mergeQuery = '';
		searchResults = [];
		transferComments = true;
		transferTags = true;
	}
	
	async function searchParentTickets() {
		if (parentQuery.length < 2) {
			parentSearchResults = [];
			return;
		}
		
		isSearchingParent = true;
		const formData = new FormData();
		formData.append('query', parentQuery);
		
		const response = await fetch('?/searchTickets', {
			method: 'POST',
			body: formData
		});
		
		const result = (await response.json()) as { data?: { tickets?: any[] } };
		parentSearchResults = result.data?.tickets ?? [];
		isSearchingParent = false;
	}
	
	function selectParentTicket(ticket: {id: string; ticketNumber: string; subject: string}) {
		selectedParentTicket = ticket;
		parentQuery = '';
		parentSearchResults = [];
	}
	
	function openParentDialog() {
		showParentDialog = true;
		selectedParentTicket = null;
		parentQuery = '';
		parentSearchResults = [];
	}
</script>

<svelte:head>
	<title>Ticket #{data.ticket.ticketNumber} | Admin</title>
</svelte:head>

<div class="min-h-screen bg-muted/30">
	<!-- Header -->
	<div class="border-b border-border bg-background">
		<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
			<div class="flex items-center gap-4">
				<a href="/admin/tickets" class="text-muted-foreground hover:text-foreground transition-colors">
					<ArrowLeft class="h-5 w-5" />
				</a>
				<div class="flex-1">
					<div class="flex items-center gap-3">
						<span class="font-mono text-sm text-muted-foreground">#{data.ticket.ticketNumber}</span>
						<span class={`px-2 py-0.5 text-xs font-medium border ${getStatusColor(data.ticket.status)}`}>
							{formatStatusLabel(data.ticket.status)}
						</span>
						<span class={`px-2 py-0.5 text-xs font-medium border ${getPriorityColor(data.ticket.priority)}`}>
							{data.ticket.priority.toUpperCase()}
						</span>
					</div>
					<h1 class="mt-1 font-display text-2xl font-medium text-foreground">{data.ticket.subject}</h1>
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
				<!-- Original Issue -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">ORIGINAL ISSUE</h2>
					</div>
					<div class="p-6">
						<div class="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
							<User class="h-4 w-4" />
							<span>{data.ticket.createdBy.displayName}</span>
							<span>•</span>
							<Clock class="h-4 w-4" />
							<span>{formatDate(data.ticket.createdAt)}</span>
						</div>
						<div class="prose prose-sm max-w-none text-foreground">
							<p class="whitespace-pre-wrap">{data.ticket.description}</p>
						</div>
					</div>
				</div>

				<!-- Comments Section -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">
							CONVERSATION ({data.comments.length})
						</h2>
					</div>
					
					{#if data.comments.length === 0}
						<div class="p-6 text-center text-muted-foreground">
							<MessageSquare class="mx-auto h-8 w-8 opacity-50" />
							<p class="mt-2">No comments yet</p>
						</div>
					{:else}
						<div class="divide-y divide-border">
							{#each data.comments as comment}
								<div class="p-6 {comment.isInternal ? 'bg-yellow-500/5' : ''}">
									<div class="flex items-start justify-between gap-4">
										<div class="flex items-center gap-3">
											<div class="flex h-8 w-8 items-center justify-center bg-muted text-xs font-medium">
												{comment.author.name?.charAt(0).toUpperCase() ?? '?'}
											</div>
											<div>
												<div class="flex items-center gap-2">
													<span class="font-medium text-foreground">{comment.author.name}</span>
													{#if comment.author.isStaff}
														<span class="px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 text-primary border border-primary/30">
															STAFF
														</span>
													{/if}
													{#if comment.isInternal}
														<span class="flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/30">
															<Lock class="h-3 w-3" />
															INTERNAL
														</span>
													{/if}
												</div>
												<span class="text-xs text-muted-foreground">{formatDate(comment.createdAt)}</span>
											</div>
										</div>
										<form method="POST" action="?/deleteComment" use:enhance>
											<input type="hidden" name="commentId" value={comment.id} />
											<button 
												type="submit" 
												class="p-1 text-muted-foreground hover:text-destructive transition-colors"
												title="Delete comment"
											>
												<Trash2 class="h-4 w-4" />
											</button>
										</form>
									</div>
									<div class="mt-3 pl-11 text-sm text-foreground whitespace-pre-wrap">
										{comment.content}
									</div>
								</div>
							{/each}
						</div>
					{/if}

					<!-- Add Comment Form -->
					<div class="border-t border-border p-6">
						<form 
							method="POST" 
							action="?/addComment" 
							use:enhance={() => {
								isSubmitting = true;
								return async ({ update }) => {
									await update();
									isSubmitting = false;
									newComment = '';
								};
							}}
						>
							<div class="space-y-4">
								<!-- Canned Responses -->
								{#if data.cannedResponses.length > 0}
									<div class="relative">
										<button
											type="button"
											onclick={() => showCannedResponses = !showCannedResponses}
											class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											<MessageSquareText class="h-4 w-4" />
											Insert canned response
											<ChevronDown class="h-3 w-3 {showCannedResponses ? 'rotate-180' : ''} transition-transform" />
										</button>
										
										{#if showCannedResponses}
											<div class="absolute left-0 top-full z-10 mt-2 w-80 max-h-64 overflow-y-auto border border-border bg-background shadow-lg">
												<div class="sticky top-0 border-b border-border bg-background p-2">
													<input
														type="text"
														placeholder="Search by shortcut or title..."
														bind:value={cannedFilter}
														class="w-full px-2 py-1 text-sm border border-border bg-muted/30 focus:outline-none focus:border-primary"
													/>
												</div>
												{#if filteredCannedResponses.length === 0}
													<div class="p-3 text-sm text-muted-foreground text-center">
														No canned responses found
													</div>
												{:else}
													{#each filteredCannedResponses as response}
														<button
															type="button"
															onclick={() => insertCannedResponse(response.content, response.supportsVariables ?? false)}
															class="w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
														>
															<div class="flex items-center gap-2">
																{#if response.shortcut}
																	<span class="font-mono text-xs bg-muted px-1.5 py-0.5">{response.shortcut}</span>
																{/if}
																<span class="text-sm font-medium text-foreground truncate">{response.title}</span>
																{#if response.supportsVariables}
																	<span class="ml-auto text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 border border-primary/30">MACRO</span>
																{/if}
															</div>
															<p class="mt-1 text-xs text-muted-foreground line-clamp-2">{response.content}</p>
														</button>
													{/each}
												{/if}
											</div>
										{/if}
									</div>
								{/if}

								<Textarea
									name="content"
									bind:value={newComment}
									placeholder="Write a reply..."
									rows={4}
									class="resize-none"
								/>
								<input type="hidden" name="isInternal" value={isInternal.toString()} />
								<div class="flex items-center justify-between">
									<label class="flex items-center gap-2 text-sm cursor-pointer">
										<input 
											type="checkbox" 
											bind:checked={isInternal}
											class="h-4 w-4 rounded border-border"
										/>
										<span class="flex items-center gap-1 text-yellow-500">
											<Lock class="h-3 w-3" />
											Internal note (not visible to customer)
										</span>
									</label>
									<Button type="submit" disabled={isSubmitting || !newComment.trim()}>
										<Send class="mr-2 h-4 w-4" />
										{isSubmitting ? 'Sending...' : 'Send Reply'}
									</Button>
								</div>
							</div>
						</form>
					</div>
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
								value={data.ticket.status}
								onchange={(e) => e.currentTarget.form?.requestSubmit()}
							>
								{#each statusOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</form>

						<!-- Priority Update -->
						<form method="POST" action="?/updatePriority" use:enhance>
							<label for="priority" class="block font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
								PRIORITY
							</label>
							<select
								id="priority"
								name="priority"
								class="font-body h-10 w-full border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
								value={data.ticket.priority}
								onchange={(e) => e.currentTarget.form?.requestSubmit()}
							>
								{#each priorityOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</form>

						<!-- Category Update -->
						<form method="POST" action="?/updateCategory" use:enhance>
							<label for="category" class="block font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
								CATEGORY
							</label>
							<select
								id="category"
								name="category"
								class="font-body h-10 w-full border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
								value={data.ticket.category ?? ''}
								onchange={(e) => e.currentTarget.form?.requestSubmit()}
							>
								{#each categoryOptions as option}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</form>

						<!-- Assignment -->
						<form method="POST" action="?/assign" use:enhance id="assignForm">
							<label for="assignedToId" class="block font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
								ASSIGNED TO
							</label>
							<input type="hidden" name="assignedToId" value={assignedStaffId} />
							<StaffAssignmentSelect
								value={assignedStaffId}
								staffMembers={data.staffMembers}
								onchange={(staffId) => {
									assignedStaffId = staffId;
									// Submit form after selection
									const form = document.getElementById('assignForm') as HTMLFormElement;
									form?.requestSubmit();
								}}
							/>
						</form>
					</div>
				</div>

				<!-- Details -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">DETAILS</h2>
					</div>
					<div class="p-6 space-y-4 text-sm">
						<div>
							<span class="text-muted-foreground">Organization</span>
							<p class="font-medium text-foreground">{data.ticket.organization}</p>
						</div>
						<div>
							<span class="text-muted-foreground">Created By</span>
							<p class="font-medium text-foreground">{data.ticket.createdBy.displayName}</p>
							{#if data.ticket.createdBy.email}
								<p class="text-xs text-muted-foreground">{data.ticket.createdBy.email}</p>
							{/if}
						</div>
						{#if data.project}
							<div>
								<span class="text-muted-foreground">Related Project</span>
								<p class="font-medium text-foreground">
									<a href="/admin/projects/{data.project.id}" class="hover:text-primary transition-colors">
										{data.project.name}
									</a>
								</p>
							</div>
						{/if}
						{#if data.ticket.category}
							<div>
								<span class="text-muted-foreground">Category</span>
								<p class="font-medium text-foreground">{data.ticket.category}</p>
							</div>
						{/if}
						<div>
							<span class="text-muted-foreground">Created</span>
							<p class="font-medium text-foreground">{formatDate(data.ticket.createdAt)}</p>
						</div>
						<div>
							<span class="text-muted-foreground">Last Updated</span>
							<p class="font-medium text-foreground">{formatDate(data.ticket.updatedAt)}</p>
						</div>
						{#if data.ticket.resolvedAt}
							<div>
								<span class="text-muted-foreground">Resolved</span>
								<p class="font-medium text-foreground">{formatDate(data.ticket.resolvedAt)}</p>
							</div>
						{/if}
						{#if data.ticket.closedAt}
							<div>
								<span class="text-muted-foreground">Closed</span>
								<p class="font-medium text-foreground">{formatDate(data.ticket.closedAt)}</p>
							</div>
						{/if}
					</div>
				</div>

				<!-- Tags -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4 flex items-center justify-between">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">TAGS</h2>
						<button
							type="button"
							onclick={() => showAddTag = !showAddTag}
							class="p-1 text-muted-foreground hover:text-primary transition-colors"
							title="Add tag"
						>
							<Plus class="h-4 w-4" />
						</button>
					</div>
					<div class="p-6">
						{#if showAddTag}
							<form 
								method="POST" 
								action="?/addTag" 
								use:enhance={() => {
									return async ({ update }) => {
										await update();
										newTag = '';
										showAddTag = false;
									};
								}}
								class="mb-4"
							>
								<div class="flex gap-2">
									<input
										type="text"
										name="tag"
										bind:value={newTag}
										placeholder="Enter tag..."
										class="flex-1 h-8 border border-border bg-card px-2 text-sm focus:border-primary focus:outline-none"
									/>
									<Button type="submit" size="sm" disabled={!newTag.trim()}>
										Add
									</Button>
									<Button type="button" variant="ghost" size="sm" onclick={() => showAddTag = false}>
										<X class="h-4 w-4" />
									</Button>
								</div>
							</form>
						{/if}
						{#if data.ticket.tags && data.ticket.tags.length > 0}
							<div class="flex flex-wrap gap-2">
								{#each data.ticket.tags as tag}
									<span class="group flex items-center gap-1 px-2 py-1 text-xs bg-muted text-muted-foreground border border-border">
										<Tag class="h-3 w-3" />
										{tag}
										<form method="POST" action="?/removeTag" use:enhance class="inline">
											<input type="hidden" name="tag" value={tag} />
											<button 
												type="submit" 
												class="ml-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
												title="Remove tag"
											>
												<X class="h-3 w-3" />
											</button>
										</form>
									</span>
								{/each}
							</div>
						{:else if !showAddTag}
							<p class="text-sm text-muted-foreground">No tags added</p>
						{/if}
					</div>
				</div>

				<!-- Attachments -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4 flex items-center justify-between">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">ATTACHMENTS</h2>
						<button
							type="button"
							onclick={() => showAttachments = !showAttachments}
							class="p-1 text-muted-foreground hover:text-primary transition-colors"
							title={showAttachments ? 'Hide uploader' : 'Upload files'}
						>
							<Paperclip class="h-4 w-4" />
						</button>
					</div>
					<div class="p-6">
						{#if showAttachments}
							<FileUploader
								entityType="ticket"
								entityId={data.ticket.id}
								bind:files={attachmentFiles}
								onUpload={() => invalidateAll()}
								onDelete={() => invalidateAll()}
							/>
						{:else if attachmentFiles.length > 0}
							<div class="space-y-2">
								{#each attachmentFiles as file}
									<a 
										href={file.url} 
										target="_blank" 
										rel="noopener noreferrer"
										class="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										<Paperclip class="h-4 w-4" />
										<span class="truncate">{file.name}</span>
									</a>
								{/each}
							</div>
						{:else}
							<p class="text-sm text-muted-foreground">No attachments</p>
						{/if}
					</div>
				</div>

				<!-- Merged Tickets -->
				{#if data.mergedTickets && data.mergedTickets.length > 0}
					<div class="border border-border bg-background">
						<div class="border-b border-border px-6 py-4">
							<h2 class="font-mono text-xs tracking-widest text-muted-foreground">MERGED TICKETS</h2>
						</div>
						<div class="p-6">
							<div class="space-y-2">
								{#each data.mergedTickets as mergedTicket}
									<div class="text-sm">
										<a 
											href="/admin/tickets/{mergedTicket.id}" 
											class="text-primary hover:underline font-mono"
										>
											#{mergedTicket.ticketNumber}
										</a>
										<p class="text-xs text-muted-foreground mt-1">
											Merged {formatDate(mergedTicket.mergedAt)} by {mergedTicket.mergedByName}
										</p>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- Parent Ticket -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4 flex items-center justify-between">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">PARENT TICKET</h2>
						{#if data.parentHierarchy.length > 0}
							<form method="POST" action="?/removeParent" use:enhance>
								<button
									type="submit"
									class="p-1 text-muted-foreground hover:text-destructive transition-colors"
									title="Remove parent"
								>
									<Unlink class="h-4 w-4" />
								</button>
							</form>
						{:else}
							<button
								type="button"
								onclick={openParentDialog}
								class="p-1 text-muted-foreground hover:text-primary transition-colors"
								title="Set parent"
							>
								<Link2 class="h-4 w-4" />
							</button>
						{/if}
					</div>
					<div class="p-6">
						{#if data.parentHierarchy.length > 0}
							<div class="space-y-2">
								{#each data.parentHierarchy as parent, index}
									<div class="flex items-center gap-2 text-sm">
										{#if index > 0}
											<span class="text-muted-foreground">↑</span>
										{/if}
										<a 
											href="/admin/tickets/{parent.id}" 
											class="text-primary hover:underline font-mono"
										>
											#{parent.ticketNumber}
										</a>
										<span class="text-foreground truncate">{parent.subject}</span>
									</div>
								{/each}
							</div>
						{:else}
							<p class="text-sm text-muted-foreground">No parent ticket</p>
						{/if}
					</div>
				</div>

				<!-- Child Tickets -->
				{#if data.childTickets && data.childTickets.length > 0}
					<div class="border border-border bg-background">
						<div class="border-b border-border px-6 py-4">
							<h2 class="font-mono text-xs tracking-widest text-muted-foreground">
								CHILD TICKETS ({data.childTickets.length})
							</h2>
						</div>
						<div class="p-6">
							<div class="space-y-3">
								{#each data.childTickets as child}
									<div class="border-l-2 border-muted pl-3">
										<div class="flex items-center gap-2">
											<a 
												href="/admin/tickets/{child.id}" 
												class="text-primary hover:underline font-mono text-sm"
											>
												#{child.ticketNumber}
											</a>
											<span class={`px-1.5 py-0.5 text-xs border ${getStatusColor(child.status)}`}>
												{formatStatusLabel(child.status)}
											</span>
										</div>
										<p class="text-sm text-foreground mt-1">{child.subject}</p>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- Satisfaction Survey Results -->
				{#if data.satisfactionSurvey}
					<div class="border border-border bg-background">
						<div class="border-b border-border px-6 py-4">
							<h2 class="font-mono text-xs tracking-widest text-muted-foreground">CUSTOMER FEEDBACK</h2>
						</div>
						<div class="p-6 space-y-4">
							{#if data.satisfactionSurvey.respondedAt}
								<!-- Overall Rating -->
								<div>
									<span class="block text-xs text-muted-foreground mb-1">Overall Satisfaction</span>
									<div class="flex items-center gap-1">
										{#each [1, 2, 3, 4, 5] as value}
											<Star 
												class={`h-5 w-5 ${
													value <= (data.satisfactionSurvey.rating ?? 0)
														? 'fill-yellow-400 text-yellow-400' 
														: 'text-muted-foreground'
												}`}
											/>
										{/each}
										<span class="ml-2 text-sm font-medium">{data.satisfactionSurvey.rating}/5</span>
									</div>
								</div>

								<!-- Detailed Ratings -->
								{#if data.satisfactionSurvey.responseTimeRating || data.satisfactionSurvey.resolutionQualityRating || data.satisfactionSurvey.staffProfessionalismRating}
									<div class="border-t border-border pt-4 space-y-2">
										{#if data.satisfactionSurvey.responseTimeRating}
											<div class="text-sm">
												<span class="text-muted-foreground">Response Time:</span>
												<span class="ml-2 font-medium">{data.satisfactionSurvey.responseTimeRating}/5</span>
											</div>
										{/if}
										{#if data.satisfactionSurvey.resolutionQualityRating}
											<div class="text-sm">
												<span class="text-muted-foreground">Resolution Quality:</span>
												<span class="ml-2 font-medium">{data.satisfactionSurvey.resolutionQualityRating}/5</span>
											</div>
										{/if}
										{#if data.satisfactionSurvey.staffProfessionalismRating}
											<div class="text-sm">
												<span class="text-muted-foreground">Staff Professionalism:</span>
												<span class="ml-2 font-medium">{data.satisfactionSurvey.staffProfessionalismRating}/5</span>
											</div>
										{/if}
									</div>
								{/if}

								<!-- Would Recommend -->
								{#if data.satisfactionSurvey.wouldRecommend !== null}
									<div class="border-t border-border pt-4">
										<span class="block text-xs text-muted-foreground mb-1">Would Recommend</span>
										<span class={`inline-flex items-center gap-1 text-sm font-medium ${
											data.satisfactionSurvey.wouldRecommend ? 'text-green-600' : 'text-red-600'
										}`}>
											{#if data.satisfactionSurvey.wouldRecommend}
												<ThumbsUp class="h-4 w-4" />
												Yes
											{:else}
												<ThumbsDown class="h-4 w-4" />
												No
											{/if}
										</span>
									</div>
								{/if}

								<!-- Feedback -->
								{#if data.satisfactionSurvey.feedback}
									<div class="border-t border-border pt-4">
										<span class="block text-xs text-muted-foreground mb-2">Comments</span>
										<p class="text-sm text-foreground whitespace-pre-wrap">{data.satisfactionSurvey.feedback}</p>
									</div>
								{/if}

								<div class="border-t border-border pt-4">
									<p class="text-xs text-muted-foreground">
										Responded {formatDate(data.satisfactionSurvey.respondedAt)}
									</p>
								</div>
							{:else}
								<div class="text-sm text-muted-foreground">
									<p>Survey sent {formatDate(data.satisfactionSurvey.surveySentAt)}</p>
									<p class="mt-1 text-xs">Awaiting customer response</p>
								</div>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Admin Actions -->
				<div class="border border-border bg-background">
					<div class="border-b border-border px-6 py-4">
						<h2 class="font-mono text-xs tracking-widest text-muted-foreground">ADMIN ACTIONS</h2>
					</div>
					<div class="p-6 space-y-2">
						<Button 
							variant="outline" 
							size="sm" 
							class="w-full justify-start gap-2" 
							onclick={openMergeDialog}
							disabled={data.ticket.status === 'closed'}
						>
							<GitMerge class="h-4 w-4" />
							Merge Into Another Ticket
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<!-- Merge Dialog -->
{#if showMergeDialog}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-2xl border border-border bg-background shadow-lg">
			<div class="border-b border-border px-6 py-4">
				<h2 class="font-display text-xl font-medium">Merge Ticket</h2>
			</div>
			<div class="p-6 space-y-4">
				<div class="border border-orange-500/30 bg-orange-500/10 px-4 py-3 text-sm text-orange-600">
					<div class="flex gap-2">
						<AlertTriangle class="h-4 w-4 flex-shrink-0 mt-0.5" />
						<div>
							<p class="font-medium">Warning: This action cannot be undone!</p>
							<p class="text-xs mt-1 text-orange-600/80">
								Merging will close ticket #{data.ticket.ticketNumber} and mark it as merged into the target ticket. 
								All activity will be preserved.
							</p>
						</div>
					</div>
				</div>

				{#if !selectedTargetTicket}
					<div>
						<label for="mergeQuery" class="block font-mono text-xs tracking-widest text-muted-foreground mb-2">
							SEARCH FOR TARGET TICKET
						</label>
						<div class="relative">
							<input
								id="mergeQuery"
								type="text"
								bind:value={mergeQuery}
								oninput={searchTickets}
								placeholder="Enter ticket number or subject..."
								class="w-full border border-border bg-card px-3 py-2 pr-10 text-sm focus:border-primary focus:outline-none"
							/>
							<Search class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						</div>

						{#if isSearching}
							<p class="mt-2 text-sm text-muted-foreground">Searching...</p>
						{:else if searchResults.length > 0}
							<div class="mt-2 border border-border bg-card divide-y divide-border max-h-60 overflow-y-auto">
								{#each searchResults as result}
									<button
										type="button"
										onclick={() => selectTargetTicket(result)}
										class="w-full px-3 py-2 text-left hover:bg-muted/50 transition-colors"
									>
										<div class="flex items-center gap-2">
											<span class="font-mono text-sm font-medium">#{result.ticketNumber}</span>
											<span class={`px-1.5 py-0.5 text-xs border ${getStatusColor(result.status)}`}>
												{formatStatusLabel(result.status)}
											</span>
											<span class={`px-1.5 py-0.5 text-xs border ${getPriorityColor(result.priority)}`}>
												{result.priority.toUpperCase()}
											</span>
										</div>
										<p class="text-sm text-foreground mt-1">{result.subject}</p>
										<p class="text-xs text-muted-foreground mt-1">
											By {result.createdByName} • {formatDate(result.createdAt)}
										</p>
									</button>
								{/each}
							</div>
						{:else if mergeQuery.length >= 2}
							<p class="mt-2 text-sm text-muted-foreground">No tickets found matching "{mergeQuery}"</p>
						{/if}
					</div>
				{:else}
					<div>
						<div class="block font-mono text-xs tracking-widest text-muted-foreground mb-2">TARGET TICKET</div>
						<div class="border border-border bg-muted/30 px-4 py-3">
							<div class="flex items-center justify-between">
								<div>
									<span class="font-mono text-sm font-medium">#{selectedTargetTicket.ticketNumber}</span>
									<p class="text-sm text-foreground mt-1">{selectedTargetTicket.subject}</p>
								</div>
								<button
									type="button"
									onclick={() => selectedTargetTicket = null}
									class="text-muted-foreground hover:text-destructive transition-colors"
								>
									<X class="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>

					<div class="space-y-2">
						<label class="flex items-center gap-2">
							<input
								type="checkbox"
								bind:checked={transferComments}
								class="h-4 w-4 border border-border text-primary focus:ring-primary"
							/>
							<span class="text-sm text-foreground">Transfer all comments to target ticket</span>
						</label>

						<label class="flex items-center gap-2">
							<input
								type="checkbox"
								bind:checked={transferTags}
								class="h-4 w-4 border border-border text-primary focus:ring-primary"
							/>
							<span class="text-sm text-foreground">Merge tags with target ticket</span>
						</label>
					</div>
				{/if}
			</div>
			<div class="border-t border-border px-6 py-4 flex justify-end gap-3">
				<Button variant="outline" onclick={() => showMergeDialog = false}>
					Cancel
				</Button>
				{#if selectedTargetTicket}
					<form method="POST" action="?/merge" use:enhance>
						<input type="hidden" name="targetTicketId" value={selectedTargetTicket.id} />
						<input type="hidden" name="transferComments" value={transferComments.toString()} />
						<input type="hidden" name="transferTags" value={transferTags.toString()} />
						<Button type="submit" variant="destructive">
							<GitMerge class="h-4 w-4 mr-2" />
							Merge Tickets
						</Button>
					</form>
				{/if}
			</div>
		</div>
	</div>
{/if}

<!-- Parent Ticket Dialog -->
{#if showParentDialog}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
		<div class="w-full max-w-2xl border border-border bg-background shadow-lg">
			<div class="border-b border-border px-6 py-4">
				<h2 class="font-display text-xl font-medium">Set Parent Ticket</h2>
			</div>
			<div class="p-6 space-y-4">
				<div class="border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-600">
					<div class="flex gap-2">
						<AlertCircle class="h-4 w-4 flex-shrink-0 mt-0.5" />
						<div>
							<p>Select a parent ticket to create a relationship hierarchy.</p>
							<p class="text-xs mt-1 text-blue-600/80">
								This ticket will be marked as a child of the selected parent ticket.
							</p>
						</div>
					</div>
				</div>

				{#if !selectedParentTicket}
					<div>
						<label for="parentQuery" class="block font-mono text-xs tracking-widest text-muted-foreground mb-2">
							SEARCH FOR PARENT TICKET
						</label>
						<div class="relative">
							<input
								id="parentQuery"
								type="text"
								bind:value={parentQuery}
								oninput={searchParentTickets}
								placeholder="Enter ticket number or subject..."
								class="w-full border border-border bg-card px-3 py-2 pr-10 text-sm focus:border-primary focus:outline-none"
							/>
							<Search class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						</div>

						{#if isSearchingParent}
							<p class="mt-2 text-sm text-muted-foreground">Searching...</p>
						{:else if parentSearchResults.length > 0}
							<div class="mt-2 border border-border bg-card divide-y divide-border max-h-60 overflow-y-auto">
								{#each parentSearchResults as result}
									<button
										type="button"
										onclick={() => selectParentTicket(result)}
										class="w-full px-3 py-2 text-left hover:bg-muted/50 transition-colors"
									>
										<div class="flex items-center gap-2">
											<span class="font-mono text-sm font-medium">#{result.ticketNumber}</span>
											<span class={`px-1.5 py-0.5 text-xs border ${getStatusColor(result.status)}`}>
												{formatStatusLabel(result.status)}
											</span>
											<span class={`px-1.5 py-0.5 text-xs border ${getPriorityColor(result.priority)}`}>
												{result.priority.toUpperCase()}
											</span>
										</div>
										<p class="text-sm text-foreground mt-1">{result.subject}</p>
										<p class="text-xs text-muted-foreground mt-1">
											By {result.createdByName} • {formatDate(result.createdAt)}
										</p>
									</button>
								{/each}
							</div>
						{:else if parentQuery.length >= 2}
							<p class="mt-2 text-sm text-muted-foreground">No tickets found matching "{parentQuery}"</p>
						{/if}
					</div>
				{:else}
					<div>
						<div class="block font-mono text-xs tracking-widest text-muted-foreground mb-2">PARENT TICKET</div>
						<div class="border border-border bg-muted/30 px-4 py-3">
							<div class="flex items-center justify-between">
								<div>
									<span class="font-mono text-sm font-medium">#{selectedParentTicket.ticketNumber}</span>
									<p class="text-sm text-foreground mt-1">{selectedParentTicket.subject}</p>
								</div>
								<button
									type="button"
									onclick={() => selectedParentTicket = null}
									class="text-muted-foreground hover:text-destructive transition-colors"
								>
									<X class="h-4 w-4" />
								</button>
							</div>
						</div>
					</div>
				{/if}
			</div>
			<div class="border-t border-border px-6 py-4 flex justify-end gap-3">
				<Button variant="outline" onclick={() => showParentDialog = false}>
					Cancel
				</Button>
				{#if selectedParentTicket}
					<form method="POST" action="?/setParent" use:enhance={() => {
						return async ({ update }) => {
							await update();
							showParentDialog = false;
						};
					}}>
						<input type="hidden" name="parentTicketId" value={selectedParentTicket.id} />
						<Button type="submit">
							<Link2 class="h-4 w-4 mr-2" />
							Set as Parent
						</Button>
					</form>
				{/if}
			</div>
		</div>
	</div>
{/if}



