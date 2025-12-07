<script lang="ts">
	/**
	 * Admin Portfolio Management
	 * 
	 * Manage portfolio/showcase projects for the marketing site.
	 */
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { 
		Plus, 
		Search, 
		Briefcase, 
		Eye, 
		EyeOff, 
		Edit, 
		Trash2, 
		Star,
		StarOff,
		Filter,
		Calendar,
		Building2,
		ExternalLink
	} from '@lucide/svelte';

	let { data } = $props();

	let searchQuery = $state('');
	let selectedStatus = $state(data.filters?.status ?? 'all');
	let selectedCategory = $state(data.filters?.category ?? '');

	// Filter projects by search
	const filteredProjects = $derived.by(() => {
		let projects = data.projects ?? [];
		
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			projects = projects.filter((project: { title: string; client: string; description: string | null }) => 
				project.title.toLowerCase().includes(query) ||
				project.client.toLowerCase().includes(query) ||
				(project.description?.toLowerCase().includes(query))
			);
		}

		return projects;
	});

	// Format date
	function formatDate(dateStr: string | Date | null): string {
		if (!dateStr) return '-';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { 
			month: 'short', 
			day: 'numeric',
			year: 'numeric'
		});
	}

	// Handle filter changes
	function updateFilters() {
		const url = new URL(window.location.href);
		if (selectedStatus !== 'all') {
			url.searchParams.set('status', selectedStatus);
		} else {
			url.searchParams.delete('status');
		}
		if (selectedCategory) {
			url.searchParams.set('category', selectedCategory);
		} else {
			url.searchParams.delete('category');
		}
		window.location.href = url.toString();
	}

	// Handle delete confirmation
	let deleteConfirm = $state<string | null>(null);

	// Stats
	const stats = $derived.by(() => {
		const projects = data.projects ?? [];
		return {
			total: projects.length,
			published: projects.filter((p: { status: string }) => p.status === 'published').length,
			draft: projects.filter((p: { status: string }) => p.status === 'draft').length,
			featured: projects.filter((p: { isFeatured: boolean }) => p.isFeatured).length
		};
	});
</script>

<svelte:head>
	<title>Portfolio | Admin | MostlyWhat Systems</title>
</svelte:head>

<!-- Page Container -->
<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// CONTENT MANAGEMENT</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">
					Portfolio Projects
				</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Showcase projects for the marketing site
				</p>
			</div>
			<a
				href={localizeHref('/admin/portfolio/new')}
				class="inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
			>
				<Plus class="h-4 w-4" />
				<span class="font-mono text-xs tracking-wider">NEW PROJECT</span>
			</a>
		</div>
	</section>

	<!-- Stats Grid -->
	<section class="border-b border-border">
		<div class="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
			<div class="flex flex-col bg-background px-6 py-4">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">TOTAL</span>
				<span class="font-display mt-1 text-2xl font-bold">{stats.total}</span>
			</div>
			<div class="flex flex-col bg-background px-6 py-4">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PUBLISHED</span>
				<span class="font-display mt-1 text-2xl font-bold text-green-500">{stats.published}</span>
			</div>
			<div class="flex flex-col bg-background px-6 py-4">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">DRAFT</span>
				<span class="font-display mt-1 text-2xl font-bold text-yellow-500">{stats.draft}</span>
			</div>
			<div class="flex flex-col bg-background px-6 py-4">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">FEATURED</span>
				<span class="font-display mt-1 text-2xl font-bold text-primary">{stats.featured}</span>
			</div>
		</div>
	</section>

	<!-- Filters & Search -->
	<section class="border-b border-border bg-card/50">
		<div class="flex flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:px-12">
			<!-- Search -->
			<div class="relative flex-1">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search projects..."
					class="font-ui w-full border border-border bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
				/>
			</div>

			<!-- Status Filter -->
			<div class="flex items-center gap-2">
				<Filter class="h-4 w-4 text-muted-foreground" />
				<select
					bind:value={selectedStatus}
					onchange={updateFilters}
					class="font-ui border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
				>
					<option value="all">All Status</option>
					<option value="published">Published</option>
					<option value="draft">Draft</option>
					<option value="archived">Archived</option>
				</select>
			</div>

			<!-- Category Filter -->
			{#if data.categories && data.categories.length > 0}
				<select
					bind:value={selectedCategory}
					onchange={updateFilters}
					class="font-ui border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
				>
					<option value="">All Categories</option>
					{#each data.categories as category}
						<option value={category}>{category}</option>
					{/each}
				</select>
			{/if}
		</div>
	</section>

	<!-- Projects Grid -->
	<section class="p-6 md:p-12">
		{#if filteredProjects.length === 0}
			<div class="flex flex-col items-center justify-center py-16 text-center">
				<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
					<Briefcase class="h-8 w-8 text-muted-foreground" />
				</div>
				<h2 class="font-display mt-6 text-lg font-bold uppercase">No portfolio projects yet</h2>
				<p class="font-body mt-2 max-w-md text-sm text-muted-foreground">
					Add showcase projects to display your work on the marketing site.
				</p>
				<a
					href={localizeHref('/admin/portfolio/new')}
					class="mt-6 inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
				>
					<Plus class="h-4 w-4" />
					<span class="font-mono text-xs tracking-wider">ADD PROJECT</span>
				</a>
			</div>
		{:else}
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each filteredProjects as project}
					<div class="group flex flex-col border border-border bg-card transition-colors hover:bg-card/80">
						<!-- Thumbnail -->
						<div class="relative aspect-video border-b border-border bg-background">
							{#if project.featuredImage}
								<img 
									src={project.featuredImage} 
									alt={project.title}
									class="h-full w-full object-cover"
								/>
							{:else}
								<div class="flex h-full w-full items-center justify-center">
									<Briefcase class="h-8 w-8 text-muted-foreground/30" />
								</div>
							{/if}

							<!-- Status Badge -->
							<div class="absolute left-2 top-2">
								{#if project.status === 'published'}
									<span class="inline-flex items-center gap-1 bg-green-500/90 px-2 py-0.5 text-[10px] font-medium text-white">
										<Eye class="h-3 w-3" />
										LIVE
									</span>
								{:else if project.status === 'draft'}
									<span class="inline-flex items-center gap-1 bg-yellow-500/90 px-2 py-0.5 text-[10px] font-medium text-white">
										<EyeOff class="h-3 w-3" />
										DRAFT
									</span>
								{:else}
									<span class="inline-flex items-center gap-1 bg-muted px-2 py-0.5 text-[10px] font-medium">
										ARCHIVED
									</span>
								{/if}
							</div>

							<!-- Featured Badge -->
							{#if project.isFeatured}
								<div class="absolute right-2 top-2">
									<Star class="h-5 w-5 fill-yellow-500 text-yellow-500" />
								</div>
							{/if}
						</div>

						<!-- Content -->
						<div class="flex flex-1 flex-col p-4">
							<div class="flex items-start justify-between gap-2">
								<div class="min-w-0 flex-1">
									<h3 class="font-ui truncate text-sm font-semibold">{project.title}</h3>
									<div class="mt-1 flex items-center gap-2 text-muted-foreground">
										<Building2 class="h-3 w-3" />
										<span class="font-body truncate text-xs">{project.client}</span>
									</div>
								</div>
								{#if project.year}
									<span class="font-mono text-xs text-muted-foreground">{project.year}</span>
								{/if}
							</div>

							{#if project.description}
								<p class="font-body mt-2 text-xs text-muted-foreground line-clamp-2">{project.description}</p>
							{/if}

							<div class="mt-3">
								<span class="font-mono text-[10px] uppercase text-muted-foreground">{project.category}</span>
							</div>

							<!-- Actions -->
							<div class="mt-4 flex items-center justify-between border-t border-border pt-4">
								<div class="flex items-center gap-1">
									<!-- Toggle Featured -->
									<form method="POST" action="?/toggleFeatured" use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') {
												invalidateAll();
											}
										};
									}}>
										<input type="hidden" name="id" value={project.id} />
										<input type="hidden" name="isFeatured" value={project.isFeatured} />
										<button
											type="submit"
											class="p-2 text-muted-foreground transition-colors hover:text-yellow-500"
											title={project.isFeatured ? 'Remove from featured' : 'Mark as featured'}
										>
											{#if project.isFeatured}
												<StarOff class="h-4 w-4" />
											{:else}
												<Star class="h-4 w-4" />
											{/if}
										</button>
									</form>

									<!-- Toggle Status -->
									<form method="POST" action="?/toggleStatus" use:enhance={() => {
										return async ({ result }) => {
											if (result.type === 'success') {
												invalidateAll();
											}
										};
									}}>
										<input type="hidden" name="id" value={project.id} />
										<input type="hidden" name="status" value={project.status} />
										<button
											type="submit"
											class="p-2 text-muted-foreground transition-colors hover:text-primary"
											title={project.status === 'published' ? 'Unpublish' : 'Publish'}
										>
											{#if project.status === 'published'}
												<EyeOff class="h-4 w-4" />
											{:else}
												<Eye class="h-4 w-4" />
											{/if}
										</button>
									</form>
								</div>

								<div class="flex items-center gap-1">
									<!-- Edit -->
									<a
										href={localizeHref(`/admin/portfolio/${project.id}`)}
										class="p-2 text-muted-foreground transition-colors hover:text-primary"
										title="Edit project"
									>
										<Edit class="h-4 w-4" />
									</a>

									<!-- Delete -->
									{#if deleteConfirm === project.id}
										<form method="POST" action="?/delete" use:enhance={() => {
											return async ({ result }) => {
												deleteConfirm = null;
												if (result.type === 'success') {
													invalidateAll();
												}
											};
										}}>
											<input type="hidden" name="id" value={project.id} />
											<button
												type="submit"
												class="p-2 text-red-500 transition-colors hover:text-red-400"
												title="Confirm delete"
											>
												<Trash2 class="h-4 w-4" />
											</button>
										</form>
									{:else}
										<button
											type="button"
											onclick={() => deleteConfirm = project.id}
											class="p-2 text-muted-foreground transition-colors hover:text-red-500"
											title="Delete project"
										>
											<Trash2 class="h-4 w-4" />
										</button>
									{/if}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</section>
</div>
