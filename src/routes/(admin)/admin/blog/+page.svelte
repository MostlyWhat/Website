<script lang="ts">
	/**
	 * Admin Blog Management
	 * 
	 * Manage blog posts for the marketing site.
	 */
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { 
		Plus, 
		Search, 
		FileText, 
		Eye, 
		EyeOff, 
		Edit, 
		Trash2, 
		Star,
		StarOff,
		Filter,
		Calendar,
		BarChart3
	} from '@lucide/svelte';
	import { PageHeader, EmptyState } from '$lib/components/ui/layouts';

	let { data } = $props();

	let searchQuery = $state('');
	let selectedStatus = $state(data.filters?.status ?? 'all');
	let selectedCategory = $state(data.filters?.category ?? '');

	// Filter posts by search
	const filteredPosts = $derived.by(() => {
		let posts = data.posts ?? [];
		
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			posts = posts.filter((post: { title: string; excerpt: string | null }) => 
				post.title.toLowerCase().includes(query) ||
				(post.excerpt?.toLowerCase().includes(query))
			);
		}

		return posts;
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
		const posts = data.posts ?? [];
		return {
			total: posts.length,
			published: posts.filter((p: { status: string }) => p.status === 'published').length,
			draft: posts.filter((p: { status: string }) => p.status === 'draft').length,
			featured: posts.filter((p: { isFeatured: boolean }) => p.isFeatured).length
		};
	});
</script>

<svelte:head>
	<title>Blog Posts | Admin | MostlyWhat Systems</title>
</svelte:head>

<!-- Page Container -->
<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// CONTENT MANAGEMENT</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">
					Blog Posts
				</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					Manage blog posts for the marketing site
				</p>
			</div>
			<a
				href={localizeHref('/admin/blog/new')}
				class="inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
			>
				<Plus class="h-4 w-4" />
				<span class="font-mono text-xs tracking-wider">NEW POST</span>
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
					placeholder="Search posts..."
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

	<!-- Posts Table -->
	<section>
		{#if filteredPosts.length === 0}
			<div class="flex flex-col items-center justify-center px-6 py-16 text-center">
				<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
					<FileText class="h-8 w-8 text-muted-foreground" />
				</div>
				<h2 class="font-display mt-6 text-lg font-bold uppercase">No blog posts yet</h2>
				<p class="font-body mt-2 max-w-md text-sm text-muted-foreground">
					Create your first blog post to share updates, tutorials, and insights.
				</p>
				<a
					href={localizeHref('/admin/blog/new')}
					class="mt-6 inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
				>
					<Plus class="h-4 w-4" />
					<span class="font-mono text-xs tracking-wider">CREATE POST</span>
				</a>
			</div>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full">
					<thead>
						<tr class="border-b border-border bg-card/50">
							<th class="px-6 py-3 text-left">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground">POST</span>
							</th>
							<th class="hidden px-6 py-3 text-left md:table-cell">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CATEGORY</span>
							</th>
							<th class="hidden px-6 py-3 text-left lg:table-cell">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground">STATUS</span>
							</th>
							<th class="hidden px-6 py-3 text-left xl:table-cell">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PUBLISHED</span>
							</th>
							<th class="hidden px-6 py-3 text-right xl:table-cell">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground">VIEWS</span>
							</th>
							<th class="px-6 py-3 text-right">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ACTIONS</span>
							</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-border">
						{#each filteredPosts as post}
							<tr class="group transition-colors hover:bg-card/50">
								<td class="px-6 py-4">
									<div class="flex items-start gap-3">
										<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card">
											<FileText class="h-4 w-4 text-primary" />
										</div>
										<div class="min-w-0 flex-1">
											<div class="flex items-center gap-2">
												<a
													href={localizeHref(`/admin/blog/${post.id}`)}
													class="font-ui text-sm font-medium hover:text-primary"
												>
													{post.title}
												</a>
												{#if post.isFeatured}
													<Star class="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
												{/if}
											</div>
											{#if post.excerpt}
												<p class="font-body mt-1 text-xs text-muted-foreground line-clamp-1">{post.excerpt}</p>
											{/if}
											<span class="font-mono mt-1 text-[10px] text-muted-foreground">{post.readTime}</span>
										</div>
									</div>
								</td>
								<td class="hidden px-6 py-4 md:table-cell">
									<span class="font-mono text-xs uppercase text-muted-foreground">{post.category}</span>
								</td>
								<td class="hidden px-6 py-4 lg:table-cell">
									{#if post.status === 'published'}
										<span class="inline-flex items-center gap-1.5 bg-green-500/10 px-2 py-1 text-xs text-green-500">
											<Eye class="h-3 w-3" />
											Published
										</span>
									{:else if post.status === 'draft'}
										<span class="inline-flex items-center gap-1.5 bg-yellow-500/10 px-2 py-1 text-xs text-yellow-500">
											<EyeOff class="h-3 w-3" />
											Draft
										</span>
									{:else}
										<span class="inline-flex items-center gap-1.5 bg-muted px-2 py-1 text-xs text-muted-foreground">
											Archived
										</span>
									{/if}
								</td>
								<td class="hidden px-6 py-4 xl:table-cell">
									<div class="flex items-center gap-2 text-muted-foreground">
										<Calendar class="h-3.5 w-3.5" />
										<span class="font-mono text-xs">{formatDate(post.publishedAt)}</span>
									</div>
								</td>
								<td class="hidden px-6 py-4 text-right xl:table-cell">
									<div class="flex items-center justify-end gap-2 text-muted-foreground">
										<BarChart3 class="h-3.5 w-3.5" />
										<span class="font-mono text-xs">{post.viewCount}</span>
									</div>
								</td>
								<td class="px-6 py-4">
									<div class="flex items-center justify-end gap-1">
										<!-- Toggle Featured -->
										<form method="POST" action="?/toggleFeatured" use:enhance={() => {
											return async ({ result }) => {
												if (result.type === 'success') {
													invalidateAll();
												}
											};
										}}>
											<input type="hidden" name="id" value={post.id} />
											<input type="hidden" name="isFeatured" value={post.isFeatured} />
											<button
												type="submit"
												class="p-2 text-muted-foreground transition-colors hover:text-yellow-500"
												title={post.isFeatured ? 'Remove from featured' : 'Mark as featured'}
											>
												{#if post.isFeatured}
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
											<input type="hidden" name="id" value={post.id} />
											<input type="hidden" name="status" value={post.status} />
											<button
												type="submit"
												class="p-2 text-muted-foreground transition-colors hover:text-primary"
												title={post.status === 'published' ? 'Unpublish' : 'Publish'}
											>
												{#if post.status === 'published'}
													<EyeOff class="h-4 w-4" />
												{:else}
													<Eye class="h-4 w-4" />
												{/if}
											</button>
										</form>

										<!-- Edit -->
										<a
											href={localizeHref(`/admin/blog/${post.id}`)}
											class="p-2 text-muted-foreground transition-colors hover:text-primary"
											title="Edit post"
										>
											<Edit class="h-4 w-4" />
										</a>

										<!-- Delete -->
										{#if deleteConfirm === post.id}
											<form method="POST" action="?/delete" use:enhance={() => {
												return async ({ result }) => {
													deleteConfirm = null;
													if (result.type === 'success') {
														invalidateAll();
													}
												};
											}}>
												<input type="hidden" name="id" value={post.id} />
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
												onclick={() => deleteConfirm = post.id}
												class="p-2 text-muted-foreground transition-colors hover:text-red-500"
												title="Delete post"
											>
												<Trash2 class="h-4 w-4" />
											</button>
										{/if}
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</div>
