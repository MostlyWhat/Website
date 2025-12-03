<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { ArrowLeft, User, Clock, Tag, AlertCircle, MessageSquare, Send, Trash2, Lock, AlertTriangle, MessageSquareText, ChevronDown, X, Plus, Paperclip } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import FileUploader from '$lib/components/ui/FileUploader.svelte';

	let { data, form } = $props();

	let newComment = $state('');
	let isInternal = $state(false);
	let isSubmitting = $state(false);
	let showCannedResponses = $state(false);
	let cannedFilter = $state('');
	let newTag = $state('');
	let showAddTag = $state(false);
	let showAttachments = $state(false);

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

	function insertCannedResponse(content: string) {
		newComment = content;
		showCannedResponses = false;
		cannedFilter = '';
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
							<span>{data.ticket.createdBy.name}</span>
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
															onclick={() => insertCannedResponse(response.content)}
															class="w-full text-left px-3 py-2 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
														>
															<div class="flex items-center gap-2">
																{#if response.shortcut}
																	<span class="font-mono text-xs bg-muted px-1.5 py-0.5">{response.shortcut}</span>
																{/if}
																<span class="text-sm font-medium text-foreground truncate">{response.title}</span>
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
						<form method="POST" action="?/assign" use:enhance>
							<label for="assignedToId" class="block font-mono text-[10px] tracking-widest text-muted-foreground mb-2">
								ASSIGNED TO
							</label>
							<select
								id="assignedToId"
								name="assignedToId"
								class="font-body h-10 w-full border border-border bg-card px-3 text-sm focus:border-primary focus:outline-none"
								value={data.ticket.assignedTo?.id ?? ''}
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
							<p class="font-medium text-foreground">{data.ticket.createdBy.name}</p>
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
			</div>
		</div>
	</div>
</div>
