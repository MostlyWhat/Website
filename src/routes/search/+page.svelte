<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { dev } from '$app/environment';
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Search, ArrowRight, FileText, Briefcase, BookOpen, HelpCircle, Filter, Loader2, X } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import DescriptionSection from '$lib/components/layout/DescriptionSection.svelte';
	import { pagefindStub } from '$lib/pagefind-stub';

	// Pagefind types
	interface PagefindResult {
		id: string;
		data: () => Promise<PagefindResultData>;
	}

	interface PagefindResultData {
		url: string;
		content: string;
		word_count: number;
		excerpt: string;
		meta: {
			title?: string;
			image?: string;
			[key: string]: string | undefined;
		};
	}

	interface PagefindSearchResponse {
		results: PagefindResult[];
	}

	interface Pagefind {
		init: () => Promise<void>;
		search: (query: string) => Promise<PagefindSearchResponse>;
	}

	// Helper to load pagefind dynamically - path constructed at runtime to avoid Vite analysis
	async function loadPagefind(): Promise<Pagefind | null> {
		try {
			const path = ['', 'pagefind', 'pagefind.js'].join('/');
			const res = await fetch(path, { method: 'HEAD' });
			if (!res.ok) return null;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const pf = await (Function('return import("' + path + '")')() as Promise<any>);
			await pf.init();
			return pf as Pagefind;
		} catch {
			return null;
		}
	}

	let searchQuery = $state('');
	let activeFilter = $state<'all' | 'support' | 'projects' | 'blog'>('all');
	let searchResults = $state<Array<{
		title: string;
		excerpt: string;
		url: string;
		type: 'support' | 'project' | 'blog' | 'page';
	}>>([]);
	let isSearching = $state(false);
	let hasSearched = $state(false);
	let pagefindLoaded = $state(false);
	let isDevMode = $state(false);
	let pagefind: Pagefind | null = $state(null);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;
	let inputElement: HTMLInputElement | null = $state(null);
	let isMobileSearchOpen = $state(false);

	const filters = [
		{ id: 'all' as const, label: 'ALL', icon: Filter },
		{ id: 'support' as const, label: 'SUPPORT', icon: HelpCircle },
		{ id: 'projects' as const, label: 'PROJECTS', icon: Briefcase },
		{ id: 'blog' as const, label: 'CONTENT', icon: BookOpen }
	];

	function getTypeFromUrl(url: string): 'support' | 'project' | 'blog' | 'page' {
		if (url.includes('/support/')) return 'support';
		if (url.includes('/projects/')) return 'project';
		if (url.includes('/blog/')) return 'blog';
		return 'page';
	}

	function matchesFilter(type: string): boolean {
		if (activeFilter === 'all') return true;
		if (activeFilter === 'support') return type === 'support';
		if (activeFilter === 'projects') return type === 'project';
		if (activeFilter === 'blog') return type === 'blog' || type === 'page';
		return true;
	}

	async function performSearch(query: string) {
		if (!query.trim()) {
			searchResults = [];
			hasSearched = false;
			return;
		}

		if (!pagefind) {
			hasSearched = true;
			searchResults = [];
			return;
		}

		isSearching = true;
		
		try {
			const response = await pagefind.search(query);
			const resultData = await Promise.all(
				response.results.slice(0, 20).map(r => r.data())
			);
			
			searchResults = resultData
				.map(data => ({
					title: data.meta.title || 'Untitled',
					excerpt: data.excerpt,
					url: data.url,
					type: getTypeFromUrl(data.url)
				}))
				.filter(r => matchesFilter(r.type));
			
		} catch (error) {
			console.error('Pagefind search error:', error);
			searchResults = [];
		}
		
		isSearching = false;
		hasSearched = true;

		// Update URL without scrolling
		const url = new URL(window.location.href);
		url.searchParams.set('q', query);
		goto(url.toString(), { replaceState: true, noScroll: true });
	}

	// Debounced search handler
	function handleSearchInput() {
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}
		
		debounceTimer = setTimeout(() => {
			performSearch(searchQuery);
		}, 300);
	}

	function clearSearch() {
		searchQuery = '';
		searchResults = [];
		hasSearched = false;
		const url = new URL(window.location.href);
		url.searchParams.delete('q');
		goto(url.toString(), { replaceState: true, noScroll: true });
	}

	function openMobileSearch() {
		isMobileSearchOpen = true;
		// Focus input after DOM update
		setTimeout(() => inputElement?.focus(), 100);
	}

	function closeMobileSearch() {
		isMobileSearchOpen = false;
	}

	function setFilter(filter: typeof activeFilter) {
		activeFilter = filter;
		if (searchQuery && hasSearched) {
			performSearch(searchQuery);
		}
	}

	onMount(async () => {
		// In development, use the stub; in production, load real Pagefind
		if (dev) {
			console.log('[Search] Using Pagefind development stub');
			await pagefindStub.init();
			pagefind = pagefindStub;
			pagefindLoaded = true;
			isDevMode = true;
		} else {
			const pf = await loadPagefind();
			if (pf) {
				pagefind = pf;
				pagefindLoaded = true;
			}
		}
		
		const urlQuery = page.url.searchParams.get('q');
		if (urlQuery) {
			searchQuery = urlQuery;
			if (pagefindLoaded) {
				performSearch(urlQuery);
			} else {
				hasSearched = true;
			}
		}
	});

	const typeLabels: Record<string, { label: string; icon: typeof FileText }> = {
		support: { label: 'SUPPORT', icon: HelpCircle },
		project: { label: 'PROJECT', icon: Briefcase },
		blog: { label: 'BLOG', icon: BookOpen },
		page: { label: 'PAGE', icon: FileText }
	};
</script>

<svelte:head>
	<title>Search — {m.site_name()}</title>
	<meta name="description" content="Search across all MostlyWhat content, documentation, and support articles." />
</svelte:head>

<!-- Hero Section - Full Screen -->
<HeroSection
	label="// SITE.SEARCH"
	title="SEARCH"
	description="Find what you need across our entire site."
/>

<!-- Description Section -->
<DescriptionSection
	description="Search through help articles, project documentation, blog posts, and more. Use filters to narrow down your results."
	stats={[
		{ value: 'DOCS', label: 'ARTICLES' },
		{ value: 'WORK', label: 'PROJECTS' },
		{ value: 'BLOG', label: 'CONTENT' }
	]}
/>

<!-- Search Bar Section -->
<section class="border-b border-border bg-card">
	<div class="px-6 py-8 md:px-12 lg:px-16">
		<div class="mx-auto max-w-3xl">
			<!-- Desktop Search Bar -->
			<div class="relative hidden md:block">
				<Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					bind:value={searchQuery}
					bind:this={inputElement}
					oninput={handleSearchInput}
					placeholder="Search for help articles, projects, documentation..."
					class="font-body h-14 w-full border border-border bg-background pl-12 pr-12 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:text-base"
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={clearSearch}
						class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					>
						<X class="h-5 w-5" />
					</button>
				{:else if isSearching}
					<Loader2 class="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-primary" />
				{/if}
			</div>

			<!-- Mobile Search Trigger -->
			<button
				onclick={openMobileSearch}
				class="flex h-14 w-full items-center gap-3 border border-border bg-background px-4 text-muted-foreground md:hidden"
			>
				<Search class="h-5 w-5" />
				<span class="font-body text-sm">{searchQuery || 'Search...'}</span>
			</button>

			<!-- Filters -->
			<div class="mt-4 flex flex-wrap gap-2">
				{#each filters as filter (filter.id)}
					{@const FilterIcon = filter.icon}
					<button
						onclick={() => setFilter(filter.id)}
						class="font-mono flex items-center gap-2 border px-3 py-1.5 text-[10px] tracking-wider transition-colors {activeFilter === filter.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary hover:text-primary'}"
					>
						<FilterIcon class="h-3 w-3" />
						{filter.label}
					</button>
				{/each}
			</div>

			{#if isDevMode}
				<p class="font-mono mt-4 text-[10px] tracking-wider text-amber-500">
					[DEV MODE] Using mock search results. Build for production search.
				</p>
			{:else if !pagefindLoaded && hasSearched}
				<p class="font-mono mt-4 text-[10px] tracking-wider text-amber-500">
					Search index not available. Run `pnpm build` to generate the search index.
				</p>
			{/if}
		</div>
	</div>
</section>

<!-- Search Results -->
<section class="border-b border-border">
	<div class="px-6 py-8 md:px-12 lg:px-16">
		{#if hasSearched}
			<div class="mb-6">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
					{searchResults.length} {searchResults.length === 1 ? 'RESULT' : 'RESULTS'} FOR "{searchQuery.toUpperCase()}"
				</span>
			</div>
		{/if}

		{#if isSearching}
			<div class="py-12 text-center">
				<Loader2 class="mx-auto h-8 w-8 animate-spin text-primary" />
				<p class="font-mono mt-4 text-[10px] tracking-widest text-muted-foreground">SEARCHING...</p>
			</div>
		{:else if hasSearched && searchResults.length === 0}
			<div class="py-12 text-center" use:scrollAnimate={{ animation: 'fade' }}>
				<Search class="mx-auto h-12 w-12 text-muted-foreground/50" />
				<h2 class="font-display mt-4 text-xl font-bold uppercase">NO RESULTS FOUND</h2>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Try different keywords or browse our content below.
				</p>
				<div class="mt-6 flex flex-wrap justify-center gap-4">
					<a href={localizeHref('/support')} class="font-mono inline-flex items-center gap-2 text-xs tracking-wider text-primary hover:underline">
						BROWSE SUPPORT <ArrowRight class="h-3 w-3" />
					</a>
					<a href={localizeHref('/projects')} class="font-mono inline-flex items-center gap-2 text-xs tracking-wider text-primary hover:underline">
						VIEW PROJECTS <ArrowRight class="h-3 w-3" />
					</a>
				</div>
			</div>
		{:else if hasSearched}
			<div class="grid gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
				{#each searchResults as result (result.url)}
					{@const typeInfo = typeLabels[result.type]}
					{@const TypeIcon = typeInfo.icon}
					<a href={localizeHref(result.url)} class="flex items-start gap-4 bg-background p-6 transition-colors hover:bg-card">
						<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
							<TypeIcon class="h-5 w-5 text-primary" />
						</div>
						<div class="flex-1">
							<div class="flex flex-wrap items-center gap-2">
								<h3 class="font-ui text-sm font-semibold tracking-wider">{result.title}</h3>
								<span class="font-mono text-[9px] tracking-widest text-muted-foreground bg-card px-2 py-0.5 border border-border">{typeInfo.label}</span>
							</div>
							<p class="font-body mt-2 text-sm text-muted-foreground line-clamp-2 [&>mark]:bg-primary/20 [&>mark]:text-foreground [&>mark]:px-0.5">
								{@html result.excerpt}
							</p>
							<span class="font-mono mt-3 inline-flex items-center gap-1 text-[10px] tracking-wider text-primary">
								VIEW <ArrowRight class="h-2.5 w-2.5" />
							</span>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<div class="mb-6">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// START.EXPLORING</span>
			</div>
			<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
				<a href={localizeHref('/support')} class="col-span-12 flex flex-col gap-2 bg-background p-6 transition-colors hover:bg-card sm:col-span-6 lg:col-span-4">
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<HelpCircle class="h-5 w-5 text-primary" />
					</div>
					<h3 class="font-ui mt-2 text-sm font-semibold tracking-wider">SUPPORT CENTER</h3>
					<p class="font-body text-sm text-muted-foreground">Browse help articles and documentation</p>
					<span class="font-mono mt-auto inline-flex items-center gap-1 pt-2 text-[10px] tracking-wider text-primary">
						BROWSE <ArrowRight class="h-2.5 w-2.5" />
					</span>
				</a>
				<a href={localizeHref('/projects')} class="col-span-12 flex flex-col gap-2 bg-background p-6 transition-colors hover:bg-card sm:col-span-6 lg:col-span-4">
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<Briefcase class="h-5 w-5 text-primary" />
					</div>
					<h3 class="font-ui mt-2 text-sm font-semibold tracking-wider">PROJECTS</h3>
					<p class="font-body text-sm text-muted-foreground">View our portfolio and case studies</p>
					<span class="font-mono mt-auto inline-flex items-center gap-1 pt-2 text-[10px] tracking-wider text-primary">
						VIEW <ArrowRight class="h-2.5 w-2.5" />
					</span>
				</a>
				<a href={localizeHref('/blog')} class="col-span-12 flex flex-col gap-2 bg-background p-6 transition-colors hover:bg-card sm:col-span-6 lg:col-span-4">
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<BookOpen class="h-5 w-5 text-primary" />
					</div>
					<h3 class="font-ui mt-2 text-sm font-semibold tracking-wider">BLOG</h3>
					<p class="font-body text-sm text-muted-foreground">Read our latest articles and insights</p>
					<span class="font-mono mt-auto inline-flex items-center gap-1 pt-2 text-[10px] tracking-wider text-primary">
						READ <ArrowRight class="h-2.5 w-2.5" />
					</span>
				</a>
			</div>
		{/if}
	</div>
</section>

<!-- Quick Links -->
<section class="border-b border-border bg-card">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-card px-6 py-6 md:col-span-4 md:px-12 lg:px-16">
			<a href={localizeHref('/support')} class="group flex items-center justify-between">
				<div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SUPPORT</span>
					<p class="font-ui mt-1 text-xs tracking-wider group-hover:text-primary">Help Center & Documentation</p>
				</div>
				<ArrowRight class="h-4 w-4 text-muted-foreground group-hover:text-primary" />
			</a>
		</div>
		<div class="col-span-12 bg-card px-6 py-6 md:col-span-4 md:px-12 lg:px-16">
			<a href={localizeHref('/projects')} class="group flex items-center justify-between">
				<div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROJECTS</span>
					<p class="font-ui mt-1 text-xs tracking-wider group-hover:text-primary">Browse Our Portfolio</p>
				</div>
				<ArrowRight class="h-4 w-4 text-muted-foreground group-hover:text-primary" />
			</a>
		</div>
		<div class="col-span-12 bg-card px-6 py-6 md:col-span-4 md:px-12 lg:px-16">
			<a href={localizeHref('/contact')} class="group flex items-center justify-between">
				<div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTACT</span>
					<p class="font-ui mt-1 text-xs tracking-wider group-hover:text-primary">Get In Touch</p>
				</div>
				<ArrowRight class="h-4 w-4 text-muted-foreground group-hover:text-primary" />
			</a>
		</div>
	</div>
</section>

<!-- Mobile Fullscreen Search -->
{#if isMobileSearchOpen}
	<div class="fixed inset-0 z-50 flex flex-col bg-background md:hidden">
		<!-- Mobile Search Header -->
		<div class="flex h-16 items-center justify-between border-b border-border px-4">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// SEARCH</span>
			<button 
				onclick={closeMobileSearch}
				class="flex h-10 w-10 items-center justify-center text-muted-foreground hover:text-foreground"
			>
				<X class="h-5 w-5" />
			</button>
		</div>

		<!-- Mobile Search Input -->
		<div class="border-b border-border p-4">
			<div class="relative">
				<Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
				<input
					type="text"
					bind:value={searchQuery}
					bind:this={inputElement}
					oninput={handleSearchInput}
					placeholder="Search..."
					class="font-body h-14 w-full border border-border bg-card pl-12 pr-12 text-base transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none"
				/>
				{#if searchQuery}
					<button
						type="button"
						onclick={clearSearch}
						class="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					>
						<X class="h-5 w-5" />
					</button>
				{:else if isSearching}
					<Loader2 class="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-primary" />
				{/if}
			</div>

			<!-- Filters in Mobile -->
			<div class="mt-3 flex flex-wrap gap-2">
				{#each filters as filter (filter.id)}
					{@const FilterIcon = filter.icon}
					<button
						onclick={() => setFilter(filter.id)}
						class="font-mono flex items-center gap-2 border px-3 py-1.5 text-[10px] tracking-wider transition-colors {activeFilter === filter.id ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}"
					>
						<FilterIcon class="h-3 w-3" />
						{filter.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- Mobile Search Results -->
		<div class="flex-1 overflow-y-auto">
			{#if isSearching}
				<div class="py-12 text-center">
					<Loader2 class="mx-auto h-8 w-8 animate-spin text-primary" />
					<p class="font-mono mt-4 text-[10px] tracking-widest text-muted-foreground">SEARCHING...</p>
				</div>
			{:else if hasSearched && searchResults.length === 0}
				<div class="p-6 text-center">
					<Search class="mx-auto h-10 w-10 text-muted-foreground/50" />
					<p class="font-display mt-4 text-lg font-bold uppercase">NO RESULTS</p>
					<p class="font-body mt-2 text-sm text-muted-foreground">Try different keywords</p>
				</div>
			{:else if hasSearched}
				<div class="divide-y divide-border">
					{#each searchResults as result (result.url)}
						{@const typeInfo = typeLabels[result.type]}
						{@const TypeIcon = typeInfo.icon}
						<a 
							href={localizeHref(result.url)} 
							class="flex items-start gap-3 p-4 transition-colors hover:bg-card"
							onclick={closeMobileSearch}
						>
							<div class="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-border bg-card">
								<TypeIcon class="h-4 w-4 text-primary" />
							</div>
							<div class="flex-1 min-w-0">
								<h3 class="font-ui text-sm font-semibold tracking-wider truncate">{result.title}</h3>
								<p class="font-body mt-1 text-xs text-muted-foreground line-clamp-2 [&>mark]:bg-primary/20 [&>mark]:text-foreground">
									{@html result.excerpt}
								</p>
							</div>
							<ArrowRight class="h-4 w-4 flex-shrink-0 text-muted-foreground" />
						</a>
					{/each}
				</div>
			{:else}
				<div class="p-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK LINKS</span>
					<div class="mt-4 space-y-2">
						<a href={localizeHref('/support')} class="flex items-center gap-3 p-3 transition-colors hover:bg-card" onclick={closeMobileSearch}>
							<HelpCircle class="h-5 w-5 text-primary" />
							<span class="font-ui text-sm tracking-wider">Support Center</span>
						</a>
						<a href={localizeHref('/projects')} class="flex items-center gap-3 p-3 transition-colors hover:bg-card" onclick={closeMobileSearch}>
							<Briefcase class="h-5 w-5 text-primary" />
							<span class="font-ui text-sm tracking-wider">Projects</span>
						</a>
						<a href={localizeHref('/blog')} class="flex items-center gap-3 p-3 transition-colors hover:bg-card" onclick={closeMobileSearch}>
							<BookOpen class="h-5 w-5 text-primary" />
							<span class="font-ui text-sm tracking-wider">Blog</span>
						</a>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}
