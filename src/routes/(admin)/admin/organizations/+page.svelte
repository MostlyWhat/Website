<script lang="ts">
	/**
	 * Admin Organizations List Page
	 */
	import { 
		Building2, Search, Plus, Users, FolderKanban, Receipt, 
		ChevronRight, Globe, Mail, Phone, Filter
	} from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import { PageHeader, EmptyState } from '$lib/components/ui/layouts';

	let { data } = $props();
	
	let searchQuery = $state('');

	// Use real data from server
	const organizations = data.organizations;

	const filteredOrgs = $derived(
		organizations.filter(org => 
			searchQuery === '' || 
			org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			org.orgNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
			(org.email?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
		)
	);

	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0
		}).format(amount);
	}
</script>

<svelte:head>
	<title>Organizations | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ORGANIZATION MANAGEMENT</span>
		<PageHeader
			title="Organizations"
			description="Manage client companies and their members."
			class="mt-2"
		>
			{#snippet actions()}
				<Button href="/admin/organizations/new" size="sm" class="font-ui text-xs tracking-wider">
					<Plus class="mr-2 h-4 w-4" />
					ADD ORGANIZATION
				</Button>
			{/snippet}
		</PageHeader>
	</section>

	<!-- Search Bar -->
	<section class="border-b border-border bg-card">
		<div class="px-6 py-4 md:px-12 lg:px-16">
			<div class="relative max-w-sm">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					placeholder="Search organizations..."
					bind:value={searchQuery}
					class="font-body h-10 w-full rounded-none border border-border bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none"
				/>
			</div>
		</div>
	</section>

	<!-- Stats Bar -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-4 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-primary">{organizations.length}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">ORGANIZATIONS</p>
			</div>
			<div class="col-span-4 bg-background px-6 py-4">
				<span class="font-display text-xl font-bold text-foreground">{organizations.reduce((sum, o) => sum + o.projectCount, 0)}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL PROJECTS</p>
			</div>
			<div class="col-span-4 bg-background px-6 py-4 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-green-500">{formatCurrency(organizations.reduce((sum, o) => sum + o.totalRevenue, 0))}</span>
				<p class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL REVENUE</p>
			</div>
		</div>
	</section>

	<!-- Organizations List -->
	<section class="border-b border-border bg-background">
		{#if filteredOrgs.length > 0}
			<div class="divide-y divide-border">
				{#each filteredOrgs as org}
					<a
						href="/admin/organizations/{org.id}"
						class="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-card md:px-12 lg:px-16"
					>
						<!-- Icon -->
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
							<Building2 class="h-5 w-5 text-primary" />
						</div>

						<!-- Org Info -->
						<div class="min-w-0 flex-1">
							<div class="flex items-center gap-2">
								<h3 class="font-ui text-sm font-semibold tracking-wider truncate">{org.name}</h3>
								<span class="font-mono text-[10px] text-muted-foreground">{org.orgNumber}</span>
								{#if org.customerType}
									<span class="font-mono text-[10px] px-1.5 py-0.5 {org.customerType === 'enterprise' ? 'bg-purple-500/10 text-purple-500' : org.customerType === 'business' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}">
										{org.customerType.toUpperCase()}
									</span>
								{/if}
							</div>
							<div class="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
								<span class="flex items-center gap-1">
									<Mail class="h-3 w-3" />
									{org.email}
								</span>
								{#if org.website}
									<span class="hidden items-center gap-1 sm:flex">
										<Globe class="h-3 w-3" />
										{org.website.replace('https://', '')}
									</span>
								{/if}
							</div>
						</div>

						<!-- Stats -->
						<div class="hidden items-center gap-6 md:flex">
							<div class="text-center">
								<div class="flex items-center gap-2 text-muted-foreground">
									<Users class="h-4 w-4" />
									<span class="font-display text-lg font-bold text-foreground">{org.memberCount}</span>
								</div>
								<p class="font-mono text-[10px] tracking-wider text-muted-foreground">MEMBERS</p>
							</div>
							<div class="text-center">
								<div class="flex items-center gap-2 text-muted-foreground">
									<FolderKanban class="h-4 w-4" />
									<span class="font-display text-lg font-bold text-foreground">{org.projectCount}</span>
								</div>
								<p class="font-mono text-[10px] tracking-wider text-muted-foreground">PROJECTS</p>
							</div>
							<div class="text-center">
								<div class="flex items-center gap-2 text-muted-foreground">
									<Receipt class="h-4 w-4" />
									<span class="font-display text-lg font-bold text-green-500">{formatCurrency(org.totalRevenue)}</span>
								</div>
								<p class="font-mono text-[10px] tracking-wider text-muted-foreground">REVENUE</p>
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
					<Building2 class="h-8 w-8 text-muted-foreground/50" />
				</div>
				<h3 class="font-ui mt-6 text-lg font-semibold tracking-wider">NO ORGANIZATIONS FOUND</h3>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					{searchQuery ? 'Try a different search term.' : 'Start by adding your first organization.'}
				</p>
				{#if !searchQuery}
					<Button href="/admin/organizations/new" class="mt-6 font-ui text-xs tracking-wider">
						<Plus class="mr-2 h-4 w-4" />
						ADD ORGANIZATION
					</Button>
				{/if}
			</div>
		{/if}
	</section>
</div>
