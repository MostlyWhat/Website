<script lang="ts">
	/**
	 * RevisionList - Display a list of project revisions with filtering
	 */
	import type { RevisionStatus, TicketPriority } from '$lib/server/db/schema';
	import { cn } from '$lib/utils';
	import { Plus, Filter } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import RevisionCard from './RevisionCard.svelte';

	interface Revision {
		id: string;
		version?: string | null;
		title: string;
		description?: string | null;
		status: RevisionStatus;
		priority: TicketPriority;
		requestedBy?: { name: string } | null;
		assignedTo?: { name: string } | null;
		createdAt: Date | string;
		resolvedAt?: Date | string | null;
		resolutionNotes?: string | null;
	}

	interface Props {
		revisions: Revision[];
		onRevisionClick?: (id: string) => void;
		onCreateClick?: () => void;
		showFilters?: boolean;
		class?: string;
	}

	let {
		revisions,
		onRevisionClick,
		onCreateClick,
		showFilters = true,
		class: className = ''
	}: Props = $props();

	let statusFilter = $state<RevisionStatus | 'all'>('all');

	const filteredRevisions = $derived(
		statusFilter === 'all'
			? revisions
			: revisions.filter((r) => r.status === statusFilter)
	);

	const activeCount = $derived(revisions.filter((r) => r.status === 'pending' || r.status === 'in_progress').length);
	const resolvedCount = $derived(revisions.filter((r) => r.status === 'resolved').length);
</script>

<div class={cn('space-y-4', className)}>
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<h3 class="font-mono text-xs tracking-widest text-muted-foreground">
				REVISIONS ({filteredRevisions.length})
			</h3>
			{#if showFilters}
				<div class="flex items-center gap-1">
					<button
						type="button"
						class={cn(
							'px-2 py-1 text-xs transition-colors',
							statusFilter === 'all' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
						)}
						onclick={() => (statusFilter = 'all')}
					>
						All
					</button>
					<button
						type="button"
						class={cn(
							'px-2 py-1 text-xs transition-colors',
							statusFilter === 'pending' || statusFilter === 'in_progress'
								? 'bg-primary/10 text-primary'
								: 'text-muted-foreground hover:text-foreground'
						)}
						onclick={() => (statusFilter = 'pending')}
					>
						Active ({activeCount})
					</button>
					<button
						type="button"
						class={cn(
							'px-2 py-1 text-xs transition-colors',
							statusFilter === 'resolved' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'
						)}
						onclick={() => (statusFilter = 'resolved')}
					>
						Resolved ({resolvedCount})
					</button>
				</div>
			{/if}
		</div>

		{#if onCreateClick}
			<Button size="sm" onclick={onCreateClick}>
				<Plus class="mr-1.5 h-3.5 w-3.5" />
				New Revision
			</Button>
		{/if}
	</div>

	<!-- List -->
	{#if filteredRevisions.length === 0}
		<div class="border border-border bg-background p-8 text-center">
			<p class="text-muted-foreground">No revisions found</p>
		</div>
	{:else}
		<div class="space-y-2">
			{#each filteredRevisions as revision (revision.id)}
				<RevisionCard
					{...revision}
					onclick={onRevisionClick ? () => onRevisionClick(revision.id) : undefined}
				/>
			{/each}
		</div>
	{/if}
</div>
