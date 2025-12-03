<script lang="ts">
	/**
	 * Admin Projects List Page
	 */
	import { 
		FolderKanban, Search, Plus, Building2, User, Calendar, 
		ChevronRight, Filter, Clock, CheckCircle, AlertCircle, Pause
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data } = $props();
	
	let searchQuery = $state('');
	let statusFilter = $state<string>('all');

	// Placeholder data
	const projects = [
		{ id: '1', name: 'Website Redesign', slug: 'website-redesign', organization: 'Acme Corporation', assignedTo: 'John Staff', status: 'in_progress', budget: 15000, startDate: '2024-11-01', endDate: '2024-12-31' },
		{ id: '2', name: 'Mobile App Development', slug: 'mobile-app', organization: 'Acme Corporation', assignedTo: 'Jane Staff', status: 'proposal_sent', budget: 45000, startDate: '2024-12-15', endDate: '2025-03-31' },
		{ id: '3', name: 'CRM Integration', slug: 'crm-integration', organization: 'Global Industries', assignedTo: null, status: 'draft', budget: 8000, startDate: null, endDate: null },
		{ id: '4', name: 'E-commerce Platform', slug: 'ecommerce', organization: 'StartupXYZ', assignedTo: 'John Staff', status: 'completed', budget: 25000, startDate: '2024-08-01', endDate: '2024-10-31' },
		{ id: '5', name: 'Analytics Dashboard', slug: 'analytics', organization: 'Global Industries', assignedTo: 'Jane Staff', status: 'on_hold', budget: 12000, startDate: '2024-10-01', endDate: '2024-12-15' }
	];

	const filteredProjects = $derived(
		projects.filter(project => {
			const matchesSearch = searchQuery === '' || 
				project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				project.organization.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
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
		if (!dateStr) return 'TBD';
		return new Date(dateStr).toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric', 
			year: 'numeric' 
		});
	}

	function getStatusConfig(status: string): { icon: typeof Clock; class: string; label: string } {
		switch (status) {
			case 'draft': return { icon: Clock, class: 'bg-muted text-muted-foreground', label: 'Draft' };
			case 'proposal_sent': return { icon: AlertCircle, class: 'bg-blue-500/10 text-blue-500', label: 'Proposal Sent' };
			case 'proposal_accepted': return { icon: CheckCircle, class: 'bg-green-500/10 text-green-500', label: 'Accepted' };
			case 'proposal_rejected': return { icon: AlertCircle, class: 'bg-red-500/10 text-red-500', label: 'Rejected' };
			case 'in_progress': return { icon: Clock, class: 'bg-yellow-500/10 text-yellow-500', label: 'In Progress' };
			case 'on_hold': return { icon: Pause, class: 'bg-orange-500/10 text-orange-500', label: 'On Hold' };
			case 'completed': return { icon: CheckCircle, class: 'bg-green-500/10 text-green-500', label: 'Completed' };
			case 'cancelled': return { icon: AlertCircle, class: 'bg-red-500/10 text-red-500', label: 'Cancelled' };
			default: return { icon: Clock, class: 'bg-muted text-muted-foreground', label: status };
		}
	}
</script>

<svelte:head>
	<title>Projects | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// PROJECT MANAGEMENT</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">Projects</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Manage all client projects and track progress.
				</p>
			</div>
			<Button href="/admin/projects/new" size="sm" class="font-ui text-xs tracking-wider">
				<Plus class="mr-2 h-4 w-4" />
				NEW PROJECT
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
					placeholder="Search projects..."
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
					<option value="proposal_sent">PROPOSAL SENT</option>
					<option value="in_progress">IN PROGRESS</option>
					<option value="on_hold">ON HOLD</option>
					<option value="completed">COMPLETED</option>
					<option value="cancelled">CANCELLED</option>
				</select>
			</div>
		</div>
	</section>

	<!-- Stats Bar -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-3 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-primary">{projects.length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-yellow-500">{projects.filter(p => p.status === 'in_progress').length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">ACTIVE</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-green-500">{projects.filter(p => p.status === 'completed').length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">COMPLETED</p>
			</div>
			<div class="col-span-3 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-foreground">{formatCurrency(projects.reduce((sum, p) => sum + p.budget, 0))}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL VALUE</p>
			</div>
		</div>
	</section>

	<!-- Projects List -->
	<section class="border-b border-border bg-background">
		{#if filteredProjects.length > 0}
			<div class="divide-y divide-border">
				{#each filteredProjects as project}
					{@const statusConfig = getStatusConfig(project.status)}
					<a
						href="/admin/projects/{project.id}"
						class="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-card md:px-12 lg:px-16"
					>
						<!-- Icon -->
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
							<FolderKanban class="h-5 w-5 text-primary" />
						</div>

						<!-- Project Info -->
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-3">
								<h3 class="font-ui text-sm font-semibold tracking-wider truncate">{project.name}</h3>
								<span class="inline-flex items-center gap-1 px-2 py-0.5 {statusConfig.class}">
									<svelte:component this={statusConfig.icon} class="h-3 w-3" />
									<span class="font-mono text-[10px] tracking-wider uppercase">{statusConfig.label}</span>
								</span>
							</div>
							<div class="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
								<span class="flex items-center gap-1">
									<Building2 class="h-3 w-3" />
									{project.organization}
								</span>
								{#if project.assignedTo}
									<span class="hidden items-center gap-1 sm:flex">
										<User class="h-3 w-3" />
										{project.assignedTo}
									</span>
								{/if}
							</div>
						</div>

						<!-- Budget & Dates -->
						<div class="hidden items-center gap-6 lg:flex">
							<div class="text-right">
								<span class="font-display text-lg font-bold text-foreground">{formatCurrency(project.budget)}</span>
								<p class="font-mono text-[10px] tracking-wider text-muted-foreground">BUDGET</p>
							</div>
							<div class="text-right">
								<div class="flex items-center gap-1">
									<Calendar class="h-3 w-3 text-muted-foreground" />
									<span class="font-body text-xs">{formatDate(project.startDate)} - {formatDate(project.endDate)}</span>
								</div>
								<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TIMELINE</p>
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
					<FolderKanban class="h-8 w-8 text-muted-foreground/50" />
				</div>
				<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO PROJECTS FOUND</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					{searchQuery || statusFilter !== 'all' ? 'Try adjusting your filters.' : 'Start by creating your first project.'}
				</p>
				{#if !searchQuery && statusFilter === 'all'}
					<Button href="/admin/projects/new" class="mt-6 font-ui text-xs tracking-wider">
						<Plus class="mr-2 h-4 w-4" />
						NEW PROJECT
					</Button>
				{/if}
			</div>
		{/if}
	</section>
</div>
