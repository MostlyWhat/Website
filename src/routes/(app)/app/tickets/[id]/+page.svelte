<script lang="ts">
	import { page } from '$app/stores';
	import { ArrowLeft, Send, Loader2, Clock, CheckCircle2, AlertTriangle, Paperclip, AlertCircle } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	
	// Use real data from server
	let ticket = $derived(data.ticket);

	let newMessage = $state('');
	let sending = $state(false);

	function formatDateTime(date: string): string {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getStatusBadge(status: string) {
		switch (status) {
			case 'open':
				return { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'OPEN' };
			case 'in_progress':
				return { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'IN PROGRESS' };
			case 'awaiting_customer':
				return { bg: 'bg-purple-500/10', text: 'text-purple-500', label: 'AWAITING RESPONSE' };
			case 'awaiting_staff':
				return { bg: 'bg-orange-500/10', text: 'text-orange-500', label: 'AWAITING STAFF' };
			case 'resolved':
				return { bg: 'bg-green-500/10', text: 'text-green-500', label: 'RESOLVED' };
			case 'closed':
				return { bg: 'bg-muted', text: 'text-muted-foreground', label: 'CLOSED' };
			default:
				return { bg: 'bg-muted', text: 'text-muted-foreground', label: status.toUpperCase().replace('_', ' ') };
		}
	}

	function getPriorityBadge(priority: string) {
		switch (priority) {
			case 'low':
				return { bg: 'bg-muted', text: 'text-muted-foreground', label: 'LOW' };
			case 'medium':
				return { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'MEDIUM' };
			case 'high':
				return { bg: 'bg-orange-500/10', text: 'text-orange-500', label: 'HIGH' };
			case 'urgent':
				return { bg: 'bg-red-500/10', text: 'text-red-500', label: 'URGENT' };
			default:
				return { bg: 'bg-muted', text: 'text-muted-foreground', label: priority.toUpperCase() };
		}
	}

	let status = $derived(getStatusBadge(ticket.status));
	let priority = $derived(getPriorityBadge(ticket.priority));
</script>

<svelte:head>
	<title>Ticket: {ticket.subject} | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-wrap items-start justify-between gap-4">
			<div>
				<a
					href="/app/tickets"
					class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
					<span class="font-mono text-[10px] tracking-widest">BACK TO TICKETS</span>
				</a>
				<h1 class="font-display mt-6 text-xl font-bold md:text-2xl">{ticket.subject}</h1>
				<p class="font-mono mt-2 text-xs tracking-widest text-muted-foreground">{ticket.ticketNumber}</p>
			</div>

			<div class="flex items-center gap-2">
				<span class="font-mono text-[10px] tracking-widest px-3 py-1 {priority.bg} {priority.text}">
					{#if ticket.priority === 'urgent'}
						<AlertTriangle class="mr-1 inline h-3 w-3" />
					{/if}
					{priority.label}
				</span>
				<span class="font-mono text-[10px] tracking-widest px-3 py-1 {status.bg} {status.text}">
					{status.label}
				</span>
			</div>
		</div>
	</section>
	
	<!-- Error Messages -->
	{#if form?.error}
		<div class="border-b border-red-500/20 bg-red-500/5 px-6 py-4 md:px-12 lg:px-16">
			<div class="flex items-center gap-3">
				<AlertCircle class="h-5 w-5 text-red-500" />
				<p class="font-body text-sm text-red-500">{form.error}</p>
			</div>
		</div>
	{/if}

	<!-- Ticket Content -->
	<section class="border-b border-border bg-background">
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Messages -->
			<div class="col-span-12 bg-background lg:col-span-8">
				<div class="px-6 py-8 md:px-12 lg:px-16">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONVERSATION</span>
				</div>
				
				<div class="divide-y divide-border border-t border-border">
					{#each ticket.messages as message}
						<div class="px-6 py-6 md:px-12 lg:px-16 {message.is_staff ? 'bg-card' : ''}">
							<div class="flex items-start gap-4">
								<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border {message.is_staff ? 'bg-primary text-primary-foreground' : 'bg-background'}">
									<span class="font-mono text-xs uppercase">{message.author.split(' ').map(n => n[0]).join('')}</span>
								</div>
								<div class="flex-1">
									<div class="flex items-center gap-2">
										<span class="font-ui text-sm font-semibold">{message.author}</span>
										{#if message.is_staff}
											<span class="font-mono text-[10px] tracking-widest px-2 py-0.5 bg-primary/10 text-primary">SUPPORT</span>
										{/if}
									</div>
									<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">
										{formatDateTime(message.created_at)}
									</p>
									<div class="font-body mt-4 text-sm leading-relaxed whitespace-pre-line">
										{message.content}
									</div>
									{#if message.attachments.length > 0}
										<div class="mt-4 flex flex-wrap gap-2">
											{#each message.attachments as attachment}
												<div class="flex items-center gap-2 border border-border px-3 py-2 text-sm">
													<Paperclip class="h-4 w-4 text-muted-foreground" />
													<span class="font-body">{attachment}</span>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Reply Form -->
				{#if ticket.status !== 'closed'}
					<div class="border-t border-border px-6 py-6 md:px-12 lg:px-16">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">REPLY</span>
						<form 
							method="POST" 
							action="?/sendMessage"
							use:enhance={() => {
								sending = true;
								return async ({ update, result }) => {
									await update();
									sending = false;
									if (result.type === 'success') {
										newMessage = '';
									}
								};
							}}
							class="mt-4"
						>
							<textarea
								name="message"
								bind:value={newMessage}
								placeholder="Type your message..."
								rows="4"
								class="font-body w-full resize-none border border-border bg-card p-4 text-sm focus:border-primary focus:outline-none"
							></textarea>
							<div class="mt-4 flex items-center justify-between">
								<button type="button" class="font-mono text-[10px] tracking-widest text-muted-foreground hover:text-foreground">
									<Paperclip class="mr-1 inline h-4 w-4" />
									ATTACH FILE
								</button>
								<Button type="submit" disabled={sending || !newMessage.trim()} class="font-ui text-xs tracking-wider">
									{#if sending}
										<Loader2 class="mr-2 h-4 w-4 animate-spin" />
										SENDING...
									{:else}
										<Send class="mr-2 h-4 w-4" />
										SEND REPLY
									{/if}
								</Button>
							</div>
						</form>
					</div>
				{:else}
					<div class="border-t border-border px-6 py-6 md:px-12 lg:px-16">
						<div class="flex items-start gap-3 border border-muted bg-muted/10 p-4">
							<CheckCircle2 class="h-5 w-5 flex-shrink-0 text-muted-foreground" />
							<div>
								<p class="font-ui text-sm font-semibold">Ticket Closed</p>
								<p class="font-body mt-1 text-sm text-muted-foreground">
									This ticket has been closed. If you have additional questions, please open a new ticket.
								</p>
								<form method="POST" action="?/reopenTicket" class="mt-3">
									<Button type="submit" variant="outline" size="sm" class="font-ui text-xs tracking-wider">
										REOPEN TICKET
									</Button>
								</form>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Sidebar -->
			<div class="col-span-12 bg-background px-6 py-8 lg:col-span-4 lg:border-l lg:border-border md:px-12 lg:px-8">
				<!-- Ticket Info -->
				<div class="border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">TICKET INFORMATION</span>
					<div class="mt-6 space-y-4">
						<div>
							<p class="font-mono text-[10px] tracking-widest text-muted-foreground">STATUS</p>
							<span class="font-mono text-xs tracking-widest mt-1 inline-block px-2 py-0.5 {status.bg} {status.text}">
								{status.label}
							</span>
						</div>

						<div>
							<p class="font-mono text-[10px] tracking-widest text-muted-foreground">PRIORITY</p>
							<span class="font-mono text-xs tracking-widest mt-1 inline-block px-2 py-0.5 {priority.bg} {priority.text}">
								{priority.label}
							</span>
						</div>

						<div>
							<p class="font-mono text-[10px] tracking-widest text-muted-foreground">CATEGORY</p>
							<p class="font-body mt-1 text-sm capitalize">{ticket.category.replace('_', ' ')}</p>
						</div>

						<div>
							<p class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECT</p>
							<p class="font-body mt-1 text-sm">{ticket.project}</p>
						</div>

						<div>
							<p class="font-mono text-[10px] tracking-widest text-muted-foreground">CREATED</p>
							<p class="font-body mt-1 text-sm">{formatDateTime(ticket.created_at)}</p>
						</div>

						<div>
							<p class="font-mono text-[10px] tracking-widest text-muted-foreground">LAST UPDATED</p>
							<p class="font-body mt-1 text-sm">{formatDateTime(ticket.updated_at)}</p>
						</div>
					</div>
				</div>

				<!-- Assigned Agent -->
				{#if ticket.assigned_to}
					<div class="mt-6 border border-border p-6">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ASSIGNED TO</span>
						
						<div class="mt-4 flex items-center gap-3">
							<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
								<span class="font-mono text-sm uppercase">{ticket.assigned_to.name.split(' ').map((n: string) => n[0]).join('')}</span>
							</div>
							<div>
								<p class="font-ui text-sm font-semibold">{ticket.assigned_to.name}</p>
								<p class="font-mono text-[10px] tracking-widest text-muted-foreground">{ticket.assigned_to.role.toUpperCase()}</p>
							</div>
						</div>
					</div>
				{/if}

				<!-- Actions -->
				<div class="mt-6 space-y-3">
					{#if ticket.status === 'resolved'}
						<form method="POST" action="?/closeTicket">
							<Button type="submit" class="font-ui w-full text-xs tracking-wider">
								<CheckCircle2 class="mr-2 h-4 w-4" />
								CLOSE TICKET
							</Button>
						</form>
						<form method="POST" action="?/reopenTicket">
							<Button type="submit" variant="outline" class="font-ui w-full text-xs tracking-wider">
								REOPEN TICKET
							</Button>
						</form>
					{:else if ticket.status !== 'closed'}
						<form method="POST" action="?/markResolved">
							<Button type="submit" variant="outline" class="font-ui w-full text-xs tracking-wider">
								<CheckCircle2 class="mr-2 h-4 w-4" />
								MARK AS RESOLVED
							</Button>
						</form>
					{/if}
				</div>

				<!-- Help Card -->
				<div class="mt-6 border border-border p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">EXPECTED RESPONSE TIME</span>
					<div class="mt-4 flex items-start gap-3">
						<Clock class="h-5 w-5 flex-shrink-0 text-muted-foreground" />
						<div>
							<p class="font-body text-sm">
								{#if ticket.priority === 'urgent'}
									Within 2 hours
								{:else if ticket.priority === 'high'}
									Within 4 hours
								{:else if ticket.priority === 'medium'}
									Within 24 hours
								{:else}
									Within 48 hours
								{/if}
							</p>
							<p class="font-body mt-1 text-xs text-muted-foreground">
								Based on your ticket priority
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</div>
