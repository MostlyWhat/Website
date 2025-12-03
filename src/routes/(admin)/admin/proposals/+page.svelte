<script lang="ts">
	/**
	 * Admin Proposals List Page
	 */
	import { 
		FileText, Search, Plus, Building2, FolderKanban, Calendar, 
		ChevronRight, Filter, Clock, CheckCircle, Eye, X, Send
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
	
	let searchQuery = $state('');
	let statusFilter = $state<string>('all');

	// Placeholder data
	const proposals = [
		{ id: '1', title: 'Website Redesign Proposal v2', project: 'Website Redesign', organization: 'Acme Corporation', status: 'sent', total: 15000, sentAt: '2024-11-28', expiresAt: '2024-12-28', viewedAt: '2024-11-29' },
		{ id: '2', title: 'Mobile App Development', project: 'Mobile App Development', organization: 'Acme Corporation', status: 'draft', total: 45000, sentAt: null, expiresAt: null, viewedAt: null },
		{ id: '3', title: 'CRM Integration Services', project: 'CRM Integration', organization: 'Global Industries', status: 'viewed', total: 8500, sentAt: '2024-11-25', expiresAt: '2024-12-25', viewedAt: '2024-11-26' },
		{ id: '4', title: 'E-commerce Platform Build', project: 'E-commerce Platform', organization: 'StartupXYZ', status: 'accepted', total: 25000, sentAt: '2024-07-15', expiresAt: '2024-08-15', viewedAt: '2024-07-16' },
		{ id: '5', title: 'Analytics Dashboard Phase 1', project: 'Analytics Dashboard', organization: 'Global Industries', status: 'rejected', total: 12000, sentAt: '2024-09-01', expiresAt: '2024-10-01', viewedAt: '2024-09-05' }
	];

	const filteredProposals = $derived(
		proposals.filter(proposal => {
			const matchesSearch = searchQuery === '' || 
				proposal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
				proposal.organization.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || proposal.status === statusFilter;
			return matchesSearch && matchesStatus;
		})
	);

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
			day: 'numeric' 
		});
	}

	function getStatusConfig(status: string): { icon: typeof Clock; class: string; label: string } {
		switch (status) {
			case 'draft': return { icon: Clock, class: 'bg-muted text-muted-foreground', label: 'Draft' };
			case 'sent': return { icon: Send, class: 'bg-blue-500/10 text-blue-500', label: 'Sent' };
			case 'viewed': return { icon: Eye, class: 'bg-purple-500/10 text-purple-500', label: 'Viewed' };
			case 'accepted': return { icon: CheckCircle, class: 'bg-green-500/10 text-green-500', label: 'Accepted' };
			case 'rejected': return { icon: X, class: 'bg-red-500/10 text-red-500', label: 'Rejected' };
			case 'expired': return { icon: Clock, class: 'bg-orange-500/10 text-orange-500', label: 'Expired' };
			default: return { icon: Clock, class: 'bg-muted text-muted-foreground', label: status };
		}
	}
</script>

<svelte:head>
	<title>Proposals | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// PROPOSAL MANAGEMENT</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Proposals</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Create and manage project proposals for clients.
				</p>
			</div>
			<Button href="/admin/proposals/new" size="sm" class="font-ui text-xs tracking-wider">
				<Plus class="mr-2 h-4 w-4" />
				NEW PROPOSAL
			</Button>
		</div>
	</section>

	<!-- Filters Bar -->
	<section class="border-b border-border bg-card">
		<div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
			<div class="relative flex-1 md:max-w-sm">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search proposals..."
					bind:value={searchQuery}
					class="font-body h-10 w-full rounded-none border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
			
			<div class="flex items-center gap-3">
				<Filter class="h-4 w-4 text-muted-foreground" />
				<select
					bind:value={statusFilter}
					class="font-mono h-10 rounded-none border border-border bg-background px-4 text-xs tracking-wider focus:border-primary focus:outline-none"
				>
					<option value="all">ALL STATUS</option>
					<option value="draft">DRAFT</option>
					<option value="sent">SENT</option>
					<option value="viewed">VIEWED</option>
					<option value="accepted">ACCEPTED</option>
					<option value="rejected">REJECTED</option>
					<option value="expired">EXPIRED</option>
				</select>
			</div>
		</div>
	</section>

	<!-- Stats Bar -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-3 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-primary">{proposals.length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-blue-500">{proposals.filter(p => ['sent', 'viewed'].includes(p.status)).length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">PENDING</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-green-500">{proposals.filter(p => p.status === 'accepted').length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">ACCEPTED</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-foreground">{formatCurrency(proposals.filter(p => p.status === 'accepted').reduce((sum, p) => sum + p.total, 0))}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">WON</p>
			</div>
		</div>
	</section>

	<!-- Proposals List -->
	<section class="border-b border-border bg-background">
		{#if filteredProposals.length > 0}
			<div class="divide-y divide-border">
				{#each filteredProposals as proposal}
					{@const statusConfig = getStatusConfig(proposal.status)}
					{@const StatusIcon = statusConfig.icon}
					<a
						href="/admin/proposals/{proposal.id}"
						class="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-card md:px-12 lg:px-16"
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
									<StatusIcon class="h-3 w-3" />
									<span class="font-mono text-[10px] tracking-wider uppercase">{statusConfig.label}</span>
								</span>
							</div>
							<div class="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
								<span class="flex items-center gap-1">
									<Building2 class="h-3 w-3" />
									{proposal.organization}
								</span>
								<span class="hidden items-center gap-1 sm:flex">
									<FolderKanban class="h-3 w-3" />
									{proposal.project}
								</span>
							</div>
						</div>

						<!-- Amount & Dates -->
						<div class="hidden items-center gap-6 lg:flex">
							<div class="text-right">
								<span class="font-display text-lg font-bold text-foreground">{formatCurrency(proposal.total)}</span>
								<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL</p>
							</div>
							<div class="text-right">
								<div class="flex items-center gap-1 justify-end">
									<Calendar class="h-3 w-3 text-muted-foreground" />
									<span class="font-body text-xs">
										{proposal.sentAt ? `Sent ${formatDate(proposal.sentAt)}` : 'Not sent'}
									</span>
								</div>
								{#if proposal.expiresAt}
									<p class="font-mono text-[10px] tracking-wider text-muted-foreground">
										Expires {formatDate(proposal.expiresAt)}
									</p>
								{/if}
							</div>
						</div>

						<!-- Arrow -->
						<ChevronRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
					</a>
				{/each}
			</div>
		{:else}
			<div class="flex flex-col items-center justify-center py-16">
				<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
					<FileText class="h-8 w-8 text-muted-foreground/50" />
				</div>
				<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO PROPOSALS FOUND</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					{searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Start by creating your first proposal.'}
				</p>
				{#if !searchQuery && statusFilter === 'all'}
					<Button href="/admin/proposals/new" class="mt-6 font-ui text-xs tracking-wider">
						<Plus class="mr-2 h-4 w-4" />
						NEW PROPOSAL
					</Button>
				{/if}
			</div>
		{/if}
	</section>
</div>
