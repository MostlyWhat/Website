<script lang="ts">
	/**
	 * Admin Knowledge Base Management
	 * 
	 * Manage support articles for users and admins.
	 */
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { 
		Plus, 
		Search, 
		BookOpen, 
		FileText, 
		Eye, 
		EyeOff, 
		Edit, 
		Trash2, 
		Users, 
		Shield,
		ThumbsUp,
		ThumbsDown,
		Filter
	} from '@lucide/svelte';

	let { data } = $props();

	let searchQuery = $state('');
	let selectedAudience = $state(data.filters?.audience ?? 'all');
	let selectedCategory = $state(data.filters?.category ?? '');

	// Filter articles by search
	const filteredArticles = $derived.by(() => {
		let articles = data.articles ?? [];
		
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			articles = articles.filter((article: { title: string; excerpt: string | null }) => 
				article.title.toLowerCase().includes(query) ||
				(article.excerpt?.toLowerCase().includes(query))
			);
		}

		return articles;
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
		if (selectedAudience !== 'all') {
			url.searchParams.set('audience', selectedAudience);
		} else {
			url.searchParams.delete('audience');
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
</script>

<svelte:head>
	<title>Knowledge Base | Admin | MostlyWhat Systems</title>
</svelte:head>

<!-- Page Container -->
<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// KNOWLEDGE BASE</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">
					Support Articles
				</h1>
			</div>
			<a
				href={localizeHref('/admin/knowledge-base/new')}
				class="inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
			>
				<Plus class="h-4 w-4" />
				<span class="font-mono text-xs tracking-wider">NEW ARTICLE</span>
			</a>
		</div>
	</section>

	<!-- Stats -->
	<section class="border-b border-border">
		<div class="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
			<div class="flex flex-col bg-background px-6 py-4">
				<span class="font-display text-2xl font-bold text-primary">{String(data.stats?.total ?? 0).padStart(2, '0')}</span>
				<span class="font-mono text-[10px] tracking-wider text-muted-foreground">TOTAL ARTICLES</span>
			</div>
			<div class="flex flex-col bg-background px-6 py-4">
				<span class="font-display text-2xl font-bold text-green-500">{String(data.stats?.published ?? 0).padStart(2, '0')}</span>
				<span class="font-mono text-[10px] tracking-wider text-muted-foreground">PUBLISHED</span>
			</div>
			<div class="flex flex-col bg-background px-6 py-4">
				<span class="font-display text-2xl font-bold">{String(data.stats?.userArticles ?? 0).padStart(2, '0')}</span>
				<span class="font-mono text-[10px] tracking-wider text-muted-foreground">USER ARTICLES</span>
			</div>
			<div class="flex flex-col bg-background px-6 py-4">
				<span class="font-display text-2xl font-bold">{String(data.stats?.adminArticles ?? 0).padStart(2, '0')}</span>
				<span class="font-mono text-[10px] tracking-wider text-muted-foreground">ADMIN ARTICLES</span>
			</div>
		</div>
	</section>

	<!-- Filters -->
	<section class="border-b border-border bg-card px-6 py-4">
		<div class="flex flex-wrap items-center gap-4">
			<!-- Search -->
			<div class="relative flex-1 min-w-[200px] max-w-md">
				<Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search articles..."
					class="font-ui w-full border border-border bg-background py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
				/>
			</div>

			<!-- Audience Filter -->
			<div class="flex items-center gap-2">
				<Filter class="h-4 w-4 text-muted-foreground" />
				<select
					bind:value={selectedAudience}
					onchange={updateFilters}
					class="font-mono border border-border bg-background px-3 py-2 text-xs tracking-wider focus:border-primary focus:outline-none"
				>
					<option value="all">ALL AUDIENCES</option>
					<option value="user">USER</option>
					<option value="admin">ADMIN</option>
				</select>
			</div>

			<!-- Category Filter -->
			{#if data.categories && data.categories.length > 0}
				<select
					bind:value={selectedCategory}
					onchange={updateFilters}
					class="font-mono border border-border bg-background px-3 py-2 text-xs tracking-wider focus:border-primary focus:outline-none"
				>
					<option value="">ALL CATEGORIES</option>
					{#each data.categories as category}
						<option value={category}>{category.toUpperCase().replace(/-/g, ' ')}</option>
					{/each}
				</select>
			{/if}
		</div>
	</section>

	<!-- Articles List -->
	<section>
		{#if filteredArticles.length > 0}
			<div class="divide-y divide-border">
				{#each filteredArticles as article}
					<div class="flex items-center gap-4 bg-background px-6 py-4 transition-colors hover:bg-card">
						<!-- Icon -->
						<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card">
							<FileText class="h-4 w-4 text-primary" />
						</div>

						<!-- Content -->
						<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2">
								<h3 class="font-ui text-sm font-semibold tracking-wider truncate">{article.title}</h3>
								{#if !article.isPublished}
									<span class="flex items-center gap-1 border border-yellow-500/30 bg-yellow-500/10 px-1.5 py-0.5">
										<EyeOff class="h-2.5 w-2.5 text-yellow-500" />
										<span class="font-mono text-[9px] tracking-wider text-yellow-500">DRAFT</span>
									</span>
								{/if}
							</div>
							<div class="mt-1 flex flex-wrap items-center gap-3 text-muted-foreground">
								<!-- Audience Badge -->
								<span class="inline-flex items-center gap-1">
									{#if article.audience === 'admin'}
										<Shield class="h-3 w-3" />
									{:else}
										<Users class="h-3 w-3" />
									{/if}
									<span class="font-mono text-[10px] tracking-wider uppercase">{article.audience}</span>
								</span>
								<!-- Category -->
								<span class="font-mono text-[10px] tracking-wider uppercase">{article.category}</span>
								<!-- Stats -->
								<span class="flex items-center gap-1">
									<Eye class="h-3 w-3" />
									<span class="font-mono text-[10px] tracking-wider">{article.viewCount}</span>
								</span>
								<span class="flex items-center gap-1 text-green-500">
									<ThumbsUp class="h-3 w-3" />
									<span class="font-mono text-[10px] tracking-wider">{article.helpfulCount}</span>
								</span>
								<span class="flex items-center gap-1 text-red-500">
									<ThumbsDown class="h-3 w-3" />
									<span class="font-mono text-[10px] tracking-wider">{article.notHelpfulCount}</span>
								</span>
								<!-- Date -->
								<span class="font-mono text-[10px] tracking-wider">{formatDate(article.updatedAt)}</span>
							</div>
						</div>

						<!-- Actions -->
						<div class="flex items-center gap-2">
							<!-- Toggle Publish -->
							<form method="POST" action="?/togglePublish" use:enhance={() => {
								return async ({ update }) => {
									await update();
									invalidateAll();
								};
							}}>
								<input type="hidden" name="articleId" value={article.id} />
								<input type="hidden" name="isPublished" value={String(article.isPublished)} />
								<button
									type="submit"
									class="flex h-8 w-8 items-center justify-center border border-border bg-card transition-colors hover:bg-card/80"
									title={article.isPublished ? 'Unpublish' : 'Publish'}
								>
									{#if article.isPublished}
										<Eye class="h-3.5 w-3.5 text-green-500" />
									{:else}
										<EyeOff class="h-3.5 w-3.5 text-muted-foreground" />
									{/if}
								</button>
							</form>

							<!-- Edit -->
							<a
								href={localizeHref(`/admin/knowledge-base/${article.id}/edit`)}
								class="flex h-8 w-8 items-center justify-center border border-border bg-card transition-colors hover:bg-card/80"
								title="Edit"
							>
								<Edit class="h-3.5 w-3.5" />
							</a>

							<!-- Delete -->
							{#if deleteConfirm === article.id}
								<form method="POST" action="?/delete" use:enhance={() => {
									return async ({ update }) => {
										await update();
										deleteConfirm = null;
										invalidateAll();
									};
								}}>
									<input type="hidden" name="articleId" value={article.id} />
									<button
										type="submit"
										class="flex h-8 items-center gap-1 border border-red-500 bg-red-500/10 px-2 text-red-500 transition-colors hover:bg-red-500/20"
									>
										<span class="font-mono text-[9px] tracking-wider">CONFIRM</span>
									</button>
								</form>
								<button
									onclick={() => deleteConfirm = null}
									class="flex h-8 w-8 items-center justify-center border border-border bg-card transition-colors hover:bg-card/80"
								>
									<span class="font-mono text-[9px]">✕</span>
								</button>
							{:else}
								<button
									onclick={() => deleteConfirm = article.id}
									class="flex h-8 w-8 items-center justify-center border border-border bg-card transition-colors hover:bg-card/80 hover:border-red-500 hover:text-red-500"
									title="Delete"
								>
									<Trash2 class="h-3.5 w-3.5" />
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<!-- Empty State -->
			<div class="flex flex-col items-center justify-center px-6 py-24 text-center">
				<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
					<BookOpen class="h-8 w-8 text-muted-foreground" />
				</div>
				<h2 class="font-display mt-6 text-lg font-bold uppercase">No Articles Found</h2>
				<p class="font-body mt-2 max-w-md text-sm text-muted-foreground">
					{#if searchQuery.trim()}
						No articles match your search. Try a different query.
					{:else}
						Start building your knowledge base by creating your first support article.
					{/if}
				</p>
				{#if !searchQuery.trim()}
					<a
						href={localizeHref('/admin/knowledge-base/new')}
						class="mt-6 inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
					>
						<Plus class="h-4 w-4" />
						<span class="font-mono text-xs tracking-wider">CREATE ARTICLE</span>
					</a>
				{/if}
			</div>
		{/if}
	</section>
</div>
