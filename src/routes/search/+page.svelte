<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Search, ArrowRight, FileText, Briefcase, BookOpen, HelpCircle, Filter } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';

	let searchQuery = $state('');
	let activeFilter = $state<'all' | 'support' | 'projects' | 'blog'>('all');
	let searchResults = $state<Array<{
		title: string;
		excerpt: string;
		url: string;
		type: 'support' | 'project' | 'blog';
		category?: string;
	}>>([]);
	let isSearching = $state(false);
	let hasSearched = $state(false);

	// Site-wide content index
	const siteContent = [
		// Support Articles
		{
			title: 'Getting Started with MostlyWhat',
			excerpt: 'Everything you need to know to start working with us. Initial consultation, project kickoff, and communication channels.',
			url: '/support/getting-started',
			type: 'support' as const,
			category: 'onboarding'
		},
		{
			title: 'How to Report a Bug',
			excerpt: 'Learn how to submit effective bug reports for faster resolution. Required information, steps to reproduce, and priority levels.',
			url: '/support/reporting-bugs',
			type: 'support' as const,
			category: 'troubleshooting'
		},
		{
			title: 'Support Response Times',
			excerpt: 'Understanding our support response times and SLAs. Priority definitions and escalation process.',
			url: '/support/response-times',
			type: 'support' as const,
			category: 'general'
		},
		{
			title: 'Browser Compatibility',
			excerpt: 'Supported browsers and how to troubleshoot compatibility issues. Common issues and testing process.',
			url: '/support/browser-compatibility',
			type: 'support' as const,
			category: 'troubleshooting'
		},
		{
			title: 'Requesting Project Updates',
			excerpt: 'How to request changes and updates to your existing projects. Types of updates and maintenance agreements.',
			url: '/support/project-updates',
			type: 'support' as const,
			category: 'general'
		},
		{
			title: 'Troubleshooting Guide',
			excerpt: 'Step-by-step guide to diagnose and resolve common issues. Website issues, account problems, and self-service solutions.',
			url: '/support/troubleshooting-guide',
			type: 'support' as const,
			category: 'troubleshooting'
		},
		{
			title: 'Billing & Payments',
			excerpt: 'Payment methods, invoicing, and billing questions answered. Refund policy and late payment information.',
			url: '/support/billing-payments',
			type: 'support' as const,
			category: 'billing'
		},
		{
			title: 'Project Handoff Guide',
			excerpt: 'What to expect when your project is completed and delivered. Documentation, training, and warranty period.',
			url: '/support/project-handoff',
			type: 'support' as const,
			category: 'onboarding'
		},
		// Pages
		{
			title: 'About MostlyWhat',
			excerpt: 'Learn about our team, mission, and approach to building digital products that make a difference.',
			url: '/about',
			type: 'blog' as const
		},
		{
			title: 'Contact Us',
			excerpt: 'Get in touch with our team for project inquiries, support requests, or general questions.',
			url: '/contact',
			type: 'blog' as const
		},
		{
			title: 'Our Projects',
			excerpt: 'Browse our portfolio of web applications, websites, and digital products we\'ve built for clients.',
			url: '/projects',
			type: 'project' as const
		},
		{
			title: 'Support Center',
			excerpt: 'Get help with your projects, find documentation, and submit support tickets.',
			url: '/support',
			type: 'support' as const
		}
	];

	const filters = [
		{ id: 'all' as const, label: 'ALL', icon: Filter },
		{ id: 'support' as const, label: 'SUPPORT', icon: HelpCircle },
		{ id: 'projects' as const, label: 'PROJECTS', icon: Briefcase },
		{ id: 'blog' as const, label: 'CONTENT', icon: BookOpen }
	];

	// Text-based search with filtering
	function performSearch(query: string) {
		if (!query.trim()) {
			searchResults = [];
			hasSearched = false;
			return;
		}

		isSearching = true;
		const lowerQuery = query.toLowerCase();
		
		// Filter content by search query and active filter
		let results = siteContent.filter(item => {
			const matchesQuery = 
				item.title.toLowerCase().includes(lowerQuery) ||
				item.excerpt.toLowerCase().includes(lowerQuery) ||
				(item.category && item.category.toLowerCase().includes(lowerQuery));
			
			const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
			
			return matchesQuery && matchesFilter;
		});
		
		searchResults = results;
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

	function setFilter(filter: typeof activeFilter) {
		activeFilter = filter;
		if (searchQuery) {
			performSearch(searchQuery);
		}
	}

	// Initialize from URL query param
	onMount(() => {
		const urlQuery = page.url.searchParams.get('q');
		if (urlQuery) {
			searchQuery = urlQuery;
			performSearch(urlQuery);
		}
	});

	const typeLabels: Record<string, { label: string; icon: typeof FileText }> = {
		support: { label: 'SUPPORT', icon: HelpCircle },
		project: { label: 'PROJECT', icon: Briefcase },
		blog: { label: 'CONTENT', icon: BookOpen }
	};

	const categoryLabels: Record<string, string> = {
		onboarding: 'ONBOARDING',
		troubleshooting: 'TROUBLESHOOTING',
		general: 'GENERAL',
		billing: 'BILLING'
	};
</script>

<svelte:head>
	<title>Search — {m.site_name()}</title>
	<meta name="description" content="Search across all MostlyWhat content, documentation, and support articles." />
</svelte:head>

<!-- Hero Section -->
<HeroSection
	label="// SITE.SEARCH"
	title="SEARCH"
	showVideo={false}
/>

<!-- Search Bar Section -->
<section class="border-b border-border bg-card">
	<div class="px-6 py-8 md:px-12 lg:px-16">
		<div class="mx-auto max-w-3xl">
			<!-- Search Bar -->
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
						class="absolute right-2 top-1/2 -translate-y-1/2 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
					>
						SEARCH
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
					Try different keywords or browse our content below.
				</p>
				<div class="mt-6 flex flex-wrap justify-center gap-4">
					<a
						href={localizeHref('/support')}
						class="font-mono inline-flex items-center gap-2 text-xs tracking-wider text-primary hover:underline"
					>
						BROWSE SUPPORT
						<ArrowRight class="h-3 w-3" />
					</a>
					<a
						href={localizeHref('/projects')}
						class="font-mono inline-flex items-center gap-2 text-xs tracking-wider text-primary hover:underline"
					>
						VIEW PROJECTS
						<ArrowRight class="h-3 w-3" />
					</a>
				</div>
			</div>
		{:else if hasSearched}
			<div class="grid gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
				{#each searchResults as result (result.url)}
					{@const typeInfo = typeLabels[result.type]}
					{@const TypeIcon = typeInfo.icon}
					<a
						href={localizeHref(result.url)}
						class="flex items-start gap-4 bg-background p-6 transition-colors hover:bg-card"
					>
						<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
							<TypeIcon class="h-5 w-5 text-primary" />
						</div>
						<div class="flex-1">
							<div class="flex flex-wrap items-center gap-2">
								<h3 class="font-ui text-sm font-semibold tracking-wider">{result.title}</h3>
								<span class="font-mono text-[9px] tracking-widest text-muted-foreground bg-card px-2 py-0.5 border border-border">
									{typeInfo.label}
								</span>
								{#if result.category}
									<span class="font-mono text-[9px] tracking-widest text-primary/70 bg-primary/5 px-2 py-0.5 border border-primary/20">
										{categoryLabels[result.category] || result.category.toUpperCase()}
									</span>
								{/if}
							</div>
							<p class="font-body mt-2 text-sm text-muted-foreground line-clamp-2">{result.excerpt}</p>
							<span class="font-mono mt-3 inline-flex items-center gap-1 text-[10px] tracking-wider text-primary">
								VIEW
								<ArrowRight class="h-2.5 w-2.5" />
							</span>
						</div>
					</a>
				{/each}
			</div>
		{:else}
			<!-- Default: Show popular/recent content -->
			<div class="mb-6">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
					POPULAR CONTENT
				</span>
			</div>
			<div class="grid gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
				{#each siteContent.slice(0, 8) as item (item.url)}
					{@const typeInfo = typeLabels[item.type]}
					{@const ItemIcon = typeInfo.icon}
					<a
						href={localizeHref(item.url)}
						class="flex items-start gap-4 bg-background p-6 transition-colors hover:bg-card"
					>
						<div class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-card">
							<ItemIcon class="h-5 w-5 text-primary" />
						</div>
						<div class="flex-1">
							<div class="flex flex-wrap items-center gap-2">
								<h3 class="font-ui text-sm font-semibold tracking-wider">{item.title}</h3>
								<span class="font-mono text-[9px] tracking-widest text-muted-foreground bg-card px-2 py-0.5 border border-border">
									{typeInfo.label}
								</span>
								{#if item.category}
									<span class="font-mono text-[9px] tracking-widest text-primary/70 bg-primary/5 px-2 py-0.5 border border-primary/20">
										{categoryLabels[item.category] || item.category.toUpperCase()}
									</span>
								{/if}
							</div>
							<p class="font-body mt-2 text-sm text-muted-foreground line-clamp-2">{item.excerpt}</p>
							<span class="font-mono mt-3 inline-flex items-center gap-1 text-[10px] tracking-wider text-primary">
								VIEW
								<ArrowRight class="h-2.5 w-2.5" />
							</span>
						</div>
					</a>
				{/each}
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
