<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { 
		Mail, MessageSquare, FileText, Headphones, 
		MoreVertical, Ticket, Trash, AlertTriangle,
		Clock, CheckCircle, Reply, Archive, Eye,
		Building, Filter
	} from '@lucide/svelte';
	import type { PageData, ActionData } from './$types';
	
	let { data, form }: { data: PageData; form: ActionData } = $props();
	
	let selectedSubmission = $state<typeof data.submissions[0] | null>(null);
	let showConvertDialog = $state(false);
	let selectedOrgId = $state<string>('');
	let selectedPriority = $state<string>('medium');
	
	const topicIcons: Record<string, typeof Mail> = {
		quote: FileText,
		support: Headphones,
		general: MessageSquare,
		partnership: Building,
		feedback: MessageSquare
	};
	
	const statusColors: Record<string, string> = {
		new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
		read: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
		replied: 'bg-green-500/10 text-green-500 border-green-500/20',
		archived: 'bg-muted text-muted-foreground border-border',
		spam: 'bg-red-500/10 text-red-500 border-red-500/20'
	};
	
	const topicColors: Record<string, string> = {
		quote: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
		support: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
		general: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
		partnership: 'bg-green-500/10 text-green-500 border-green-500/20',
		feedback: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
	};
	
	function formatDate(date: Date | string | null) {
		if (!date) return 'N/A';
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
	
	function openConvertDialog(submission: typeof data.submissions[0]) {
		selectedSubmission = submission;
		showConvertDialog = true;
	}
</script>

<svelte:head>
	<title>Messages — Admin</title>
</svelte:head>

<div class="container mx-auto max-w-7xl p-6 space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="font-display text-3xl font-bold tracking-tight">Messages</h1>
			<p class="text-muted-foreground mt-1">Manage contact form submissions and inquiries</p>
		</div>
	</div>

	<!-- Stats -->
	<div class="grid gap-4 md:grid-cols-6">
		<Card.Root>
			<Card.Content class="pt-6">
				<div class="text-center">
					<p class="font-display text-3xl font-bold tabular-nums">{data.stats?.total || 0}</p>
					<p class="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Total</p>
				</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Content class="pt-6">
				<div class="text-center">
					<p class="font-display text-3xl font-bold tabular-nums text-blue-500">{data.stats?.new || 0}</p>
					<p class="text-xs text-muted-foreground mt-1 uppercase tracking-wider">New</p>
				</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Content class="pt-6">
				<div class="text-center">
					<p class="font-display text-3xl font-bold tabular-nums text-yellow-500">{data.stats?.read || 0}</p>
					<p class="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Read</p>
				</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Content class="pt-6">
				<div class="text-center">
					<p class="font-display text-3xl font-bold tabular-nums text-green-500">{data.stats?.replied || 0}</p>
					<p class="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Replied</p>
				</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Content class="pt-6">
				<div class="text-center">
					<p class="font-display text-3xl font-bold tabular-nums text-orange-500">{data.stats?.support || 0}</p>
					<p class="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Support</p>
				</div>
			</Card.Content>
		</Card.Root>
		<Card.Root>
			<Card.Content class="pt-6">
				<div class="text-center">
					<p class="font-display text-3xl font-bold tabular-nums text-purple-500">{data.stats?.quote || 0}</p>
					<p class="text-xs text-muted-foreground mt-1 uppercase tracking-wider">Quotes</p>
				</div>
			</Card.Content>
		</Card.Root>
	</div>

	<!-- Filters -->
	<Card.Root>
		<Card.Content class="p-4">
			<form method="GET" class="flex flex-wrap gap-4">
				<div class="flex items-center gap-2">
					<Filter class="h-4 w-4 text-muted-foreground" />
					<span class="text-sm font-medium">Filters:</span>
				</div>
				<select 
					name="status" 
					class="rounded-md border border-input bg-background px-3 py-1 text-sm"
					onchange={(e) => e.currentTarget.form?.submit()}
				>
					<option value="all" selected={data.filters.status === 'all'}>All Status</option>
					<option value="new" selected={data.filters.status === 'new'}>New</option>
					<option value="read" selected={data.filters.status === 'read'}>Read</option>
					<option value="replied" selected={data.filters.status === 'replied'}>Replied</option>
					<option value="archived" selected={data.filters.status === 'archived'}>Archived</option>
					<option value="spam" selected={data.filters.status === 'spam'}>Spam</option>
				</select>
				<select 
					name="topic" 
					class="rounded-md border border-input bg-background px-3 py-1 text-sm"
					onchange={(e) => e.currentTarget.form?.submit()}
				>
					<option value="all" selected={data.filters.topic === 'all'}>All Topics</option>
					<option value="quote" selected={data.filters.topic === 'quote'}>Quote Requests</option>
					<option value="support" selected={data.filters.topic === 'support'}>Support</option>
					<option value="general" selected={data.filters.topic === 'general'}>General</option>
					<option value="partnership" selected={data.filters.topic === 'partnership'}>Partnership</option>
					<option value="feedback" selected={data.filters.topic === 'feedback'}>Feedback</option>
				</select>
			</form>
		</Card.Content>
	</Card.Root>

	<!-- Messages List -->
	<div class="space-y-3">
		{#each data.submissions as submission (submission.id)}
			{@const TopicIcon = topicIcons[submission.topic] || MessageSquare}
			<Card.Root class="overflow-hidden {submission.status === 'new' ? 'border-l-4 border-l-blue-500' : ''}">
				<Card.Content class="p-0">
					<div class="flex flex-col gap-4 p-4 md:flex-row md:items-start">
						<!-- Icon & Topic -->
						<div class="flex items-start gap-3">
							<div class="rounded-lg bg-muted p-2">
								<TopicIcon class="h-5 w-5 text-muted-foreground" />
							</div>
							<div class="min-w-0 flex-1">
								<div class="flex flex-wrap items-center gap-2">
									<span class="font-semibold">{submission.name}</span>
									<Badge variant="outline" class="font-ui {topicColors[submission.topic]}">
										{submission.topic.toUpperCase()}
									</Badge>
									<Badge variant="outline" class="font-ui {statusColors[submission.status]}">
										{submission.status.toUpperCase()}
									</Badge>
									{#if submission.ticketId}
										<Badge variant="outline" class="font-ui bg-green-500/10 text-green-500 border-green-500/20">
											<Ticket class="mr-1 h-3 w-3" />
											TICKET
										</Badge>
									{/if}
								</div>
								<p class="text-sm text-muted-foreground">{submission.email}</p>
								{#if submission.company}
									<p class="text-xs text-muted-foreground">{submission.company}</p>
								{/if}
							</div>
						</div>
						
						<!-- Message Preview -->
						<div class="flex-1 min-w-0">
							{#if submission.subject}
								<p class="font-medium text-sm mb-1">{submission.subject}</p>
							{/if}
							<p class="text-sm text-muted-foreground line-clamp-2">{submission.message}</p>
							
							<!-- Extra info for quotes/support -->
							{#if submission.topic === 'quote' && (submission.projectType || submission.budget)}
								<div class="mt-2 flex flex-wrap gap-2 text-xs">
									{#if submission.projectType}
										<span class="rounded bg-muted px-2 py-0.5">Type: {submission.projectType}</span>
									{/if}
									{#if submission.budget}
										<span class="rounded bg-muted px-2 py-0.5">Budget: {submission.budget}</span>
									{/if}
									{#if submission.timeline}
										<span class="rounded bg-muted px-2 py-0.5">Timeline: {submission.timeline}</span>
									{/if}
								</div>
							{/if}
							{#if submission.topic === 'support' && (submission.orderId || submission.urgency)}
								<div class="mt-2 flex flex-wrap gap-2 text-xs">
									{#if submission.orderId}
										<span class="rounded bg-muted px-2 py-0.5">Order: {submission.orderId}</span>
									{/if}
									{#if submission.urgency}
										<span class="rounded bg-muted px-2 py-0.5">Urgency: {submission.urgency}</span>
									{/if}
								</div>
							{/if}
						</div>
						
						<!-- Time & Actions -->
						<div class="flex items-center gap-2">
							<span class="text-xs text-muted-foreground whitespace-nowrap">
								<Clock class="inline h-3 w-3 mr-1" />
								{formatDate(submission.createdAt)}
							</span>
							
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Button variant="ghost" size="icon" class="h-8 w-8">
										<MoreVertical class="h-4 w-4" />
									</Button>
								</DropdownMenu.Trigger>
								<DropdownMenu.Content align="end">
									{#if submission.status === 'new'}
										<form method="POST" action="?/updateStatus" use:enhance>
											<input type="hidden" name="id" value={submission.id} />
											<input type="hidden" name="status" value="read" />
											<DropdownMenu.Item>
												<button type="submit" class="flex w-full items-center gap-2">
													<Eye class="h-4 w-4" />
													Mark as Read
												</button>
											</DropdownMenu.Item>
										</form>
									{/if}
									{#if submission.status !== 'replied'}
										<form method="POST" action="?/updateStatus" use:enhance>
											<input type="hidden" name="id" value={submission.id} />
											<input type="hidden" name="status" value="replied" />
											<DropdownMenu.Item>
												<button type="submit" class="flex w-full items-center gap-2">
													<Reply class="h-4 w-4" />
													Mark as Replied
												</button>
											</DropdownMenu.Item>
										</form>
									{/if}
									{#if !submission.ticketId}
										<DropdownMenu.Item onclick={() => openConvertDialog(submission)}>
											<Ticket class="h-4 w-4 mr-2" />
											Convert to Ticket
										</DropdownMenu.Item>
									{/if}
									<DropdownMenu.Separator />
									<form method="POST" action="?/updateStatus" use:enhance>
										<input type="hidden" name="id" value={submission.id} />
										<input type="hidden" name="status" value="archived" />
										<DropdownMenu.Item>
											<button type="submit" class="flex w-full items-center gap-2">
												<Archive class="h-4 w-4" />
												Archive
											</button>
										</DropdownMenu.Item>
									</form>
									<form method="POST" action="?/markAsSpam" use:enhance>
										<input type="hidden" name="id" value={submission.id} />
										<DropdownMenu.Item class="text-yellow-500">
											<button type="submit" class="flex w-full items-center gap-2">
												<AlertTriangle class="h-4 w-4" />
												Mark as Spam
											</button>
										</DropdownMenu.Item>
									</form>
									<DropdownMenu.Separator />
									<form method="POST" action="?/delete" use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') {
												invalidateAll();
											}
										};
									}}>
										<input type="hidden" name="id" value={submission.id} />
										<DropdownMenu.Item class="text-destructive">
											<button type="submit" class="flex w-full items-center gap-2">
												<Trash class="h-4 w-4" />
												Delete
											</button>
										</DropdownMenu.Item>
									</form>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{:else}
			<Card.Root>
				<Card.Content class="flex flex-col items-center justify-center py-12 text-center">
					<Mail class="h-12 w-12 text-muted-foreground/50" />
					<h3 class="mt-4 font-semibold">No messages</h3>
					<p class="mt-2 text-sm text-muted-foreground">
						Contact form submissions will appear here.
					</p>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>

<!-- Convert to Ticket Dialog -->
<Dialog.Root bind:open={showConvertDialog}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Convert to Ticket</Dialog.Title>
			<Dialog.Description>
				Create a support ticket from this contact submission.
			</Dialog.Description>
		</Dialog.Header>
		
		{#if selectedSubmission}
			<form method="POST" action="?/convertToTicket" use:enhance={() => {
				return async ({ result }) => {
					if (result.type === 'success') {
						showConvertDialog = false;
						toast.success('Contact converted to ticket successfully');
						invalidateAll();
					} else if (result.type === 'failure') {
						const message = (result.data as { message?: string })?.message ?? 'Failed to convert to ticket';
						toast.error(message);
					}
				};
			}}>
				<input type="hidden" name="submissionId" value={selectedSubmission.id} />
				
				<Dialog.Body class="space-y-4">
					<div class="rounded-lg bg-muted p-3">
						<p class="text-sm font-medium">{selectedSubmission.name}</p>
						<p class="text-xs text-muted-foreground">{selectedSubmission.email}</p>
						<p class="mt-2 text-sm line-clamp-3">{selectedSubmission.message}</p>
					</div>
					
					<div class="space-y-2">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label class="text-sm font-medium">Organization *</label>
						<select 
							name="organizationId" 
							bind:value={selectedOrgId}
							required
							class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
						>
							<option value="">Select organization...</option>
							{#each data.organizations as org}
								<option value={org.id}>{org.name}</option>
							{/each}
						</select>
						<p class="text-xs text-muted-foreground">
							The ticket will be assigned to this organization.
						</p>
					</div>
					
					<div class="space-y-2">
						<!-- svelte-ignore a11y_label_has_associated_control -->
						<label class="text-sm font-medium">Priority</label>
						<select 
							name="priority" 
							bind:value={selectedPriority}
							class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
						>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
							<option value="urgent">Urgent</option>
						</select>
					</div>
				</Dialog.Body>
				
				<Dialog.Footer>
					<Button type="button" variant="outline" onclick={() => showConvertDialog = false}>
						Cancel
					</Button>
					<Button type="submit" disabled={!selectedOrgId}>
						<Ticket class="mr-2 h-4 w-4" />
						Create Ticket
					</Button>
				</Dialog.Footer>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>
