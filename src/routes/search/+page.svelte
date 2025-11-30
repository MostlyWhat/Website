<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Search, ArrowRight, FileText, Clock, Tag } from '@lucide/svelte';
	import { onMount } from 'svelte';

	let searchQuery = $state('');
	let searchResults = $state<Array<{
		title: string;
		excerpt: string;
		url: string;
		category: string;
	}>>([]);
	let isSearching = $state(false);
	let hasSearched = $state(false);

	// All support articles for fallback search
	const supportArticles = [
		{
			title: 'Getting Started with MostlyWhat',
			excerpt: 'Everything you need to know to start working with us. Initial consultation, project kickoff, and communication channels.',
			url: '/support/getting-started',
			category: 'onboarding'
		},
		{
			title: 'How to Report a Bug',
			excerpt: 'Learn how to submit effective bug reports for faster resolution. Required information, steps to reproduce, and priority levels.',
			url: '/support/reporting-bugs',
			category: 'troubleshooting'
		},
		{
			title: 'Support Response Times',
			excerpt: 'Understanding our support response times and SLAs. Priority definitions and escalation process.',
			url: '/support/response-times',
			category: 'general'
		},
		{
			title: 'Browser Compatibility',
			excerpt: 'Supported browsers and how to troubleshoot compatibility issues. Common issues and testing process.',
			url: '/support/browser-compatibility',
			category: 'troubleshooting'
		},
		{
			title: 'Requesting Project Updates',
			excerpt: 'How to request changes and updates to your existing projects. Types of updates and maintenance agreements.',
			url: '/support/project-updates',
			category: 'general'
		},
		{
			title: 'Troubleshooting Guide',
			excerpt: 'Step-by-step guide to diagnose and resolve common issues. Website issues, account problems, and self-service solutions.',
			url: '/support/troubleshooting-guide',
			category: 'troubleshooting'
		},
		{
			title: 'Billing & Payments',
			excerpt: 'Payment methods, invoicing, and billing questions answered. Refund policy and late payment information.',
			url: '/support/billing-payments',
			category: 'billing'
		},
		{
			title: 'Project Handoff Guide',
			excerpt: 'What to expect when your project is completed and delivered. Documentation, training, and warranty period.',
			url: '/support/project-handoff',
			category: 'onboarding'
		}
	];

	// Simple text-based search
	function performSearch(query: string) {
		if (!query.trim()) {
			searchResults = [];
			hasSearched = false;
			return;
		}

		isSearching = true;
		const lowerQuery = query.toLowerCase();
		
		// Filter articles that match the query
		searchResults = supportArticles.filter(article => 
			article.title.toLowerCase().includes(lowerQuery) ||
			article.excerpt.toLowerCase().includes(lowerQuery) ||
			article.category.toLowerCase().includes(lowerQuery)
		);
		
		isSearching = false;
		hasSearched = true;
	}

	function handleSearch(e: Event) {
		e.preventDefault();
		performSearch(searchQuery);
		// Update URL with search query
		const url = new URL(window.location.href);
		url.searchParams.set('q', searchQuery);
		goto(url.toString(), { replaceState: true });
	}

	// Initialize from URL query param
	onMount(() => {
		const urlQuery = page.url.searchParams.get('q');
		if (urlQuery) {
			searchQuery = urlQuery;
			performSearch(urlQuery);
		}
	});

	const categoryLabels: Record<string, string> = {
		onboarding: 'ONBOARDING',
		troubleshooting: 'TROUBLESHOOTING',
		general: 'GENERAL',
		billing: 'BILLING'
	};
</script>

<svelte:head>
	<title>Search — {m.site_name()}</title>
	<meta name="description" content="Search the MostlyWhat help center and documentation." />
</svelte:head>

<!-- Hero Section -->
<section class="border-b border-border bg-card">
	<div class="px-6 py-16 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="mx-auto max-w-2xl text-center">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// SEARCH.DOCS</span>
			<h1 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">SEARCH HELP CENTER</h1>
			<p class="font-body mt-2 text-sm text-muted-foreground">
				Find answers in our documentation and support articles.
			</p>

			<!-- Search Bar -->
			<form class="mt-8" onsubmit={handleSearch}>
				<div class="relative">
					<Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search for help articles..."
						class="font-body h-14 w-full border border-border bg-background pl-12 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 md:text-base"
					/>
					<button
						type="submit"
						class="absolute right-2 top-1/2 -translate-y-1/2 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
					>
						SEARCH
					</button>
				</div>
			</form>
		</div>
	</div>
</section>

<!-- Search Results -->
<section class="border-b border-border">
	<div class="px-6 py-8 md:px-12 lg:px-16">
		{#if hasSearched}
			<div class="mb-6 flex items-center justify-between">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
					{searchResults.length} {searchResults.length === 1 ? 'RESULT' : 'RESULTS'} FOR "{searchQuery.toUpperCase()}"
				</span>
			</div>
		{/if}

		{#if isSearching}
			<div class="py-12 text-center">
				<div class="inline-block h-8 w-8 animate-spin border-2 border-primary border-t-transparent"></div>
				<p class="font-mono mt-4 text-[10px] tracking-widest text-muted-foreground">SEARCHING...</p>
			</div>
		{:else if hasSearched && searchResults.length === 0}
			<div class="py-12 text-center" use:scrollAnimate={{ animation: 'fade' }}>
				<Search class="mx-auto h-12 w-12 text-muted-foreground/50" />
				<h2 class="font-display mt-4 text-xl font-bold uppercase">NO RESULTS FOUND</h2>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Try different keywords or browse our help categories.
				</p>
				<a
					href={localizeHref('/support')}
					class="font-mono mt-6 inline-flex items-center gap-2 text-xs tracking-wider text-primary hover:underline"
				>
					BACK TO SUPPORT
					<ArrowRight class="h-3 w-3" />
				</a>
			</div>
		{:else if hasSearched}
			<div class="grid gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
				{#each searchResults as result (result.url)}
					<a
						href={localizeHref(result.url)}
						class="flex items-start gap-4 bg-background p-6 transition-colors hover:bg-card"
					>
						<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
							<FileText class="h-5 w-5 text-primary" />
						</div>
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<h3 class="font-ui text-sm font-semibold tracking-wider">{result.title}</h3>
								<span class="font-mono text-[9px] tracking-widest text-muted-foreground bg-card px-2 py-0.5 border border-border">
									{categoryLabels[result.category] || result.category.toUpperCase()}
								</span>
							</div>
							<p class="font-body mt-2 text-sm text-muted-foreground line-clamp-2">{result.excerpt}</p>
							<span class="font-mono mt-3 inline-flex items-center gap-1 text-[10px] tracking-wider text-primary">
								READ ARTICLE
								<ArrowRight class="h-2.5 w-2.5" />
							</span>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<!-- Default: Show all articles -->
			<div class="mb-6">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
					ALL SUPPORT ARTICLES
				</span>
			</div>
			<div class="grid gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
				{#each supportArticles as article (article.url)}
					<a
						href={localizeHref(article.url)}
						class="flex items-start gap-4 bg-background p-6 transition-colors hover:bg-card"
					>
						<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
							<FileText class="h-5 w-5 text-primary" />
						</div>
						<div class="flex-1">
							<div class="flex items-center gap-2">
								<h3 class="font-ui text-sm font-semibold tracking-wider">{article.title}</h3>
								<span class="font-mono text-[9px] tracking-widest text-muted-foreground bg-card px-2 py-0.5 border border-border">
									{categoryLabels[article.category] || article.category.toUpperCase()}
								</span>
							</div>
							<p class="font-body mt-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
							<span class="font-mono mt-3 inline-flex items-center gap-1 text-[10px] tracking-wider text-primary">
								READ ARTICLE
								<ArrowRight class="h-2.5 w-2.5" />
							</span>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</div>
</section>

<!-- Back to Support -->
<section class="border-b border-border bg-card">
	<div class="flex items-center justify-between px-6 py-6 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CAN'T FIND WHAT YOU'RE LOOKING FOR?</span>
		<a
			href={localizeHref('/support#ticket-form')}
			class="font-ui flex items-center gap-2 text-xs tracking-wider text-primary hover:underline"
		>
			SUBMIT A TICKET
			<ArrowRight class="h-3 w-3" />
		</a>
	</div>
</section>
