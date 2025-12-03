<script lang="ts">
	/**
	 * Customer Proposals Page
	 */
	import { FileText, Clock, CheckCircle, Eye, X, Calendar, ChevronRight, FolderKanban } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();

	// Placeholder data - will be replaced with real data from database
	const proposals = [
		{ id: '1', title: 'Website Redesign Proposal v2', project: 'Website Redesign', status: 'sent', total: 15000, sentAt: '2024-11-28', expiresAt: '2024-12-28', viewedAt: null },
		{ id: '2', title: 'Mobile App Development', project: 'Mobile App Development', status: 'viewed', total: 45000, sentAt: '2024-11-25', expiresAt: '2024-12-25', viewedAt: '2024-11-26' },
		{ id: '3', title: 'E-commerce Platform Build', project: 'E-commerce Platform', status: 'accepted', total: 25000, sentAt: '2024-07-15', expiresAt: '2024-08-15', viewedAt: '2024-07-16' }
	];

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(amount);
	}

	function formatDate(dateStr: string | null): string {
		if (!dateStr) return '-';
		return new Date(dateStr).toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric',
			year: 'numeric'
		});
	}

	function getStatusConfig(status: string): { icon: typeof Clock; class: string; label: string; actionLabel?: string } {
		switch (status) {
			case 'sent': return { icon: Clock, class: 'bg-blue-500/10 text-blue-500', label: 'Pending Review', actionLabel: 'Review' };
			case 'viewed': return { icon: Eye, class: 'bg-purple-500/10 text-purple-500', label: 'Viewed', actionLabel: 'Respond' };
			case 'accepted': return { icon: CheckCircle, class: 'bg-green-500/10 text-green-500', label: 'Accepted' };
			case 'rejected': return { icon: X, class: 'bg-red-500/10 text-red-500', label: 'Rejected' };
			case 'expired': return { icon: Clock, class: 'bg-orange-500/10 text-orange-500', label: 'Expired' };
			default: return { icon: Clock, class: 'bg-muted text-muted-foreground', label: status };
		}
	}

	const pendingProposals = $derived(proposals.filter(p => ['sent', 'viewed'].includes(p.status)));
</script>

<svelte:head>
	<title>Proposals | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// PROJECT PROPOSALS</span>
		<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Proposals</h1>
		<p class="font-body mt-1 text-sm text-muted-foreground">
			Review and approve project proposals from our team.
		</p>
	</section>

	<!-- Pending Alert -->
	{#if pendingProposals.length > 0}
		<section class="border-b border-border bg-primary/5">
			<div class="flex items-center gap-4 px-6 py-4 md:px-12 lg:px-16">
				<div class="flex h-10 w-10 items-center justify-center border border-primary/30 bg-primary/10">
					<Clock class="h-4 w-4 text-primary" />
				</div>
				<div class="flex-1">
					<p class="font-ui text-sm font-semibold tracking-wider">
						{pendingProposals.length} PROPOSAL{pendingProposals.length > 1 ? 'S' : ''} AWAITING YOUR REVIEW
					</p>
					<p class="font-body text-xs text-muted-foreground">Please review and respond before the expiration date.</p>
				</div>
			</div>
		</section>
	{/if}

	<!-- Proposals List -->
	<section class="border-b border-border bg-background">
		{#if proposals.length > 0}
			<div class="divide-y divide-border">
				{#each proposals as proposal}
					{@const statusConfig = getStatusConfig(proposal.status)}
					<a
						href="/app/proposals/{proposal.id}"
						class="group flex items-center gap-4 px-6 py-6 transition-colors hover:bg-card md:px-12 lg:px-16"
					>
						<!-- Icon -->
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
							<FileText class="h-5 w-5 text-primary" />
						</div>

						<!-- Proposal Info -->
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-3">
								<h3 class="font-ui text-sm font-semibold tracking-wider truncate">{proposal.title}</h3>
								<span class="inline-flex items-center gap-1 px-2 py-0.5 {statusConfig.class}">
									<svelte:component this={statusConfig.icon} class="h-3 w-3" />
									<span class="font-mono text-[10px] tracking-wider uppercase">{statusConfig.label}</span>
								</span>
							</div>
							<div class="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
								<span class="flex items-center gap-1">
									<FolderKanban class="h-3 w-3" />
									{proposal.project}
								</span>
								<span class="flex items-center gap-1">
									<Calendar class="h-3 w-3" />
									Expires {formatDate(proposal.expiresAt)}
								</span>
							</div>
						</div>

						<!-- Amount & Action -->
						<div class="flex items-center gap-6">
							<div class="text-right">
								<span class="font-display text-xl font-bold text-foreground">{formatCurrency(proposal.total)}</span>
								<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL</p>
							</div>
							
							{#if statusConfig.actionLabel}
								<Button size="sm" class="font-ui text-xs tracking-wider">
									{statusConfig.actionLabel}
								</Button>
							{:else}
								<ChevronRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
							{/if}
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-16">
				<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
					<FileText class="h-8 w-8 text-muted-foreground/50" />
				</div>
				<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO PROPOSALS YET</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Proposals will appear here when they're ready for your review.
				</p>
			</div>
		{/if}
	</section>
</div>
