<script lang="ts">
	/**
	 * RevisionCard - Display a single project revision
	 */
	import type { RevisionStatus, TicketPriority } from '$lib/server/db/schema';
	import { cn } from '$lib/utils';
	import { Clock, User, AlertCircle, CheckCircle2, XCircle, Loader2 } from '@lucide/svelte';

	interface Props {
		id: string;
		version?: string | null;
		title: string;
		description?: string | null;
		status: RevisionStatus;
		priority: TicketPriority;
		requestedBy?: { name: string; } | null;
		assignedTo?: { name: string; } | null;
		createdAt: Date | string;
		resolvedAt?: Date | string | null;
		resolutionNotes?: string | null;
		onclick?: () => void;
		class?: string;
	}

	let {
		id,
		version,
		title,
		description,
		status,
		priority,
		requestedBy,
		assignedTo,
		createdAt,
		resolvedAt,
		resolutionNotes,
		onclick,
		class: className = ''
	}: Props = $props();

	const statusConfig: Record<RevisionStatus, { label: string; color: string; icon: typeof Clock }> = {
		pending: { label: 'Pending', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30', icon: Clock },
		in_progress: { label: 'In Progress', color: 'text-blue-500 bg-blue-500/10 border-blue-500/30', icon: Loader2 },
		resolved: { label: 'Resolved', color: 'text-green-500 bg-green-500/10 border-green-500/30', icon: CheckCircle2 },
		declined: { label: 'Declined', color: 'text-red-500 bg-red-500/10 border-red-500/30', icon: XCircle }
	};

	const priorityConfig: Record<TicketPriority, { label: string; color: string }> = {
		low: { label: 'Low', color: 'text-green-500 bg-green-500/10 border-green-500/30' },
		medium: { label: 'Medium', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30' },
		high: { label: 'High', color: 'text-orange-500 bg-orange-500/10 border-orange-500/30' },
		urgent: { label: 'Urgent', color: 'text-red-500 bg-red-500/10 border-red-500/30' }
	};

	const statusInfo = $derived(statusConfig[status]);
	const priorityInfo = $derived(priorityConfig[priority]);
	const StatusIcon = $derived(statusInfo.icon);

	function formatDate(date: Date | string) {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<button
	type="button"
	class={cn(
		'block w-full text-left border border-border bg-background p-4 transition-colors hover:bg-muted/50',
		onclick && 'cursor-pointer',
		className
	)}
	onclick={onclick}
	disabled={!onclick}
>
	<div class="flex items-start justify-between gap-4">
		<div class="flex-1 min-w-0">
			<!-- Header -->
			<div class="flex items-center gap-2 mb-1">
				{#if version}
					<span class="font-mono text-xs text-muted-foreground">{version}</span>
				{/if}
				<span class={cn('px-1.5 py-0.5 text-[10px] font-medium border', priorityInfo.color)}>
					{priorityInfo.label.toUpperCase()}
				</span>
			</div>

			<!-- Title -->
			<h4 class="font-medium text-foreground truncate">{title}</h4>

			<!-- Description -->
			{#if description}
				<p class="mt-1 text-sm text-muted-foreground line-clamp-2">{description}</p>
			{/if}

			<!-- Meta -->
			<div class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
				{#if requestedBy}
					<span class="flex items-center gap-1">
						<User class="h-3 w-3" />
						{requestedBy.name}
					</span>
				{/if}
				<span class="flex items-center gap-1">
					<Clock class="h-3 w-3" />
					{formatDate(createdAt)}
				</span>
				{#if assignedTo}
					<span>→ {assignedTo.name}</span>
				{/if}
			</div>
		</div>

		<!-- Status -->
		<div class={cn('flex items-center gap-1.5 px-2 py-1 text-xs font-medium border', statusInfo.color)}>
			<StatusIcon class="h-3.5 w-3.5" />
			{statusInfo.label}
		</div>
	</div>

	<!-- Resolution Notes -->
	{#if resolvedAt && resolutionNotes}
		<div class="mt-3 pt-3 border-t border-border">
			<p class="text-xs text-muted-foreground">
				<span class="font-medium">Resolution:</span> {resolutionNotes}
			</p>
		</div>
	{/if}
</button>
