<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { dev } from '$app/environment';
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Search, ArrowRight, FileText, Briefcase, BookOpen, HelpCircle, Filter, Loader2 } from '@lucide/svelte';
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
	}

	function handleSearch(e: Event) {
		e.preventDefault();
		performSearch(searchQuery);
		const url = new URL(window.location.href);
		url.searchParams.set('q', searchQuery);
		goto(url.toString(), { replaceState: true });
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
			try {
				// Use fetch to check if pagefind exists, then dynamically import
				const res = await fetch('/pagefind/pagefind.js', { method: 'HEAD' });
				if (res.ok) {
					const pf = await import(/* @vite-ignore */ '/pagefind/pagefind.js');
					await pf.init();
					pagefind = pf;
					pagefindLoaded = true;
				}
			} catch {
				pagefindLoaded = false;
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
			<form onsubmit={handleSearch}>
				<div class="relative">
					<Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search for help articles, projects, documentation..."
						class="font-body h-14 w-full border border-border bg-background pl-12 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:text-base"
					/>
					<button
						type="submit"
						disabled={isSearching}
						class="absolute right-2 top-1/2 -translate-y-1/2 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
					>
						{#if isSearching}
							<Loader2 class="h-4 w-4 animate-spin" />
						{:else}
							SEARCH
						{/if}
					</button>
				</div>
			</form>

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
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">START EXPLORING</span>
			</div>
			<div class="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
				<a href={localizeHref('/support')} class="flex flex-col gap-2 bg-background p-6 transition-colors hover:bg-card">
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<HelpCircle class="h-5 w-5 text-primary" />
					</div>
					<h3 class="font-ui mt-2 text-sm font-semibold tracking-wider">SUPPORT CENTER</h3>
					<p class="font-body text-sm text-muted-foreground">Browse help articles and documentation</p>
				</a>
				<a href={localizeHref('/projects')} class="flex flex-col gap-2 bg-background p-6 transition-colors hover:bg-card">
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<Briefcase class="h-5 w-5 text-primary" />
					</div>
					<h3 class="font-ui mt-2 text-sm font-semibold tracking-wider">PROJECTS</h3>
					<p class="font-body text-sm text-muted-foreground">View our portfolio and case studies</p>
				</a>
				<a href={localizeHref('/blog')} class="flex flex-col gap-2 bg-background p-6 transition-colors hover:bg-card">
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<BookOpen class="h-5 w-5 text-primary" />
					</div>
					<h3 class="font-ui mt-2 text-sm font-semibold tracking-wider">BLOG</h3>
					<p class="font-body text-sm text-muted-foreground">Read our latest articles and insights</p>
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
