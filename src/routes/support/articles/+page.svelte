<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { 
		Search, 
		ArrowRight, 
		ArrowLeft,
		FileText, 
		Rocket, 
		Bug, 
		Clock, 
		CreditCard, 
		Settings, 
		BookOpen,
		Filter,
		TicketPlus
	} from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');
	let activeFilter = $state<string | null>(null);

	const categoryMeta: Record<string, { icon: typeof Rocket; label: string; desc: string; color: string }> = {
		onboarding: {
			icon: Rocket,
			label: 'ONBOARDING',
			desc: 'Getting started and project handoff guides',
			color: 'text-emerald-400'
		},
		troubleshooting: {
			icon: Bug,
			label: 'TROUBLESHOOTING',
			desc: 'Bug reports, browser issues, and common problems',
			color: 'text-yellow-400'
		},
		general: {
			icon: Clock,
			label: 'GENERAL',
			desc: 'Response times, project updates, and general info',
			color: 'text-primary'
		},
		billing: {
			icon: CreditCard,
			label: 'BILLING',
			desc: 'Payment methods, invoicing, and refunds',
			color: 'text-purple-400'
		}
	};

	function handleSearch(e: Event) {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
		}
	}

	// Filter articles based on search and category
	const filteredArticles = $derived(() => {
		let articles = data.articles;
		
		// Filter by category
		if (activeFilter) {
			articles = articles.filter(a => a.category === activeFilter);
		}
		
		// Filter by search
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			articles = articles.filter(
				a => a.title.toLowerCase().includes(query) || 
				     a.summary.toLowerCase().includes(query) ||
				     a.category.toLowerCase().includes(query)
			);
		}
		
		return articles;
	});

	// Group filtered articles by category
	const groupedArticles = $derived(() => {
		const grouped: Record<string, typeof data.articles> = {};
		for (const article of filteredArticles()) {
			if (!grouped[article.category]) {
				grouped[article.category] = [];
			}
			grouped[article.category].push(article);
		}
		return grouped;
	});

	// Total article count
	const totalArticles = $derived(data.articles.length);
	const filteredCount = $derived(filteredArticles().length);
</script>

<svelte:head>
	<title>Support Articles — {m.site_name()}</title>
	<meta name="description" content="Browse all support articles and documentation for MostlyWhat." />
</svelte:head>

<!-- Hero Header -->
<section class="border-b border-border">
	<div class="px-6 py-16 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// KNOWLEDGE.BASE</span>
		<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">SUPPORT ARTICLES</h1>
		<p class="font-body mt-4 max-w-2xl text-lg text-muted-foreground">
			Browse our complete library of documentation, guides, and troubleshooting resources.
		</p>
	</div>
	
	<!-- Stats Bar -->
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
		<div class="col-span-4 bg-background px-6 py-6 md:px-12 lg:px-16">
			<span class="font-display text-2xl font-bold text-primary md:text-3xl">{totalArticles}</span>
			<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">TOTAL ARTICLES</p>
		</div>
		<div class="col-span-4 bg-background px-6 py-6 md:px-12 lg:px-16">
			<span class="font-display text-2xl font-bold text-primary md:text-3xl">{Object.keys(categoryMeta).length}</span>
			<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">CATEGORIES</p>
		</div>
		<div class="col-span-4 bg-background px-6 py-6 md:px-12 lg:px-16">
			<span class="font-display text-2xl font-bold text-primary md:text-3xl">24/7</span>
			<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">AVAILABLE</p>
		</div>
	</div>
</section>

<!-- Search & Filter Section -->
<section class="sticky top-0 z-10 border-b border-border bg-card">
	<div class="px-6 py-6 md:px-12 lg:px-16">
		<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
			<!-- Search Bar -->
			<form class="flex-1 lg:max-w-md" onsubmit={handleSearch}>
				<div class="relative">
					<Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Search articles..."
						class="font-body h-12 w-full border border-border bg-background pl-12 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
					/>
				</div>
			</form>
			
			<!-- Category Filters -->
			<div class="flex flex-wrap items-center gap-2">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground"><Filter class="inline h-3 w-3" /> FILTER:</span>
				<button
					type="button"
					onclick={() => activeFilter = null}
					class="font-ui px-3 py-1.5 text-xs tracking-wider transition-colors {activeFilter === null ? 'bg-primary text-primary-foreground' : 'border border-border bg-background text-muted-foreground hover:bg-card hover:text-foreground'}"
				>
					ALL
				</button>
				{#each Object.entries(categoryMeta) as [key, meta] (key)}
					<button
						type="button"
						onclick={() => activeFilter = activeFilter === key ? null : key}
						class="font-ui px-3 py-1.5 text-xs tracking-wider transition-colors {activeFilter === key ? 'bg-primary text-primary-foreground' : 'border border-border bg-background text-muted-foreground hover:bg-card hover:text-foreground'}"
					>
						{meta.label}
					</button>
				{/each}
			</div>
		</div>
		
		<!-- Results count -->
		{#if searchQuery || activeFilter}
			<p class="font-mono mt-4 text-[10px] tracking-widest text-muted-foreground">
				SHOWING {filteredCount} OF {totalArticles} ARTICLES
				{#if activeFilter}
					IN {categoryMeta[activeFilter]?.label}
				{/if}
			</p>
		{/if}
	</div>
</section>

<!-- Articles by Category -->
<section class="border-b border-border">
	{#if Object.keys(groupedArticles()).length === 0}
		<!-- No Results -->
		<div class="flex flex-col items-center justify-center px-6 py-24 text-center md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
				<Search class="h-8 w-8 text-muted-foreground" />
			</div>
			<h2 class="font-display mt-6 text-2xl font-bold uppercase">NO ARTICLES FOUND</h2>
			<p class="font-body mt-2 max-w-md text-muted-foreground">
				Try adjusting your search or filter criteria to find what you're looking for.
			</p>
			<Button onclick={() => { searchQuery = ''; activeFilter = null; }} variant="outline" class="font-ui mt-6 tracking-wider">
				CLEAR FILTERS
			</Button>
		</div>
	{:else}
		{#each Object.entries(groupedArticles()) as [category, articles] (category)}
			{@const meta = categoryMeta[category] || { icon: BookOpen, label: category.toUpperCase(), desc: '', color: 'text-primary' }}
			{@const Icon = meta.icon}
			
			<div class="border-b border-border last:border-b-0">
				<!-- Category Header -->
				<div class="flex items-center gap-4 bg-card px-6 py-6 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
						<Icon class="h-5 w-5 {meta.color}" />
					</div>
					<div class="flex-1">
						<h2 class="font-ui text-base font-semibold tracking-wider">{meta.label}</h2>
						<p class="font-body text-sm text-muted-foreground">{meta.desc}</p>
					</div>
					<div class="text-right">
						<span class="font-display text-2xl font-bold text-primary">{articles.length}</span>
						<p class="font-mono text-[10px] tracking-widest text-muted-foreground">ARTICLES</p>
					</div>
				</div>

				<!-- Articles Grid -->
				<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
					{#each articles as article (article.slug)}
						<a
							href={localizeHref(`/support/${article.slug}`)}
							class="col-span-12 flex items-start gap-4 bg-background px-6 py-6 transition-colors hover:bg-card md:col-span-6 md:px-12 lg:px-16"
						>
							<FileText class="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
							<div class="flex-1">
								<h3 class="font-ui text-sm font-semibold tracking-wider">{article.title}</h3>
								<p class="font-body mt-2 line-clamp-2 text-sm text-muted-foreground">{article.summary}</p>
							</div>
							<ArrowRight class="mt-1 h-4 w-4 flex-shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
						</a>
					{/each}
				</div>
			</div>
		{/each}
	{/if}
</section>

<!-- Bottom Navigation -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<a
			href={localizeHref('/support')}
			class="col-span-12 flex items-center gap-4 bg-background px-6 py-8 transition-colors hover:bg-card md:col-span-6 md:px-12 lg:px-16"
		>
			<ArrowLeft class="h-5 w-5 text-muted-foreground" />
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">← PREVIOUS</span>
				<h3 class="font-ui mt-1 text-sm font-semibold tracking-wider">BACK TO SUPPORT</h3>
			</div>
		</a>
		<a
			href={localizeHref('/support/submit-ticket')}
			class="col-span-12 flex items-center justify-between gap-4 bg-primary px-6 py-8 transition-colors hover:bg-primary/90 md:col-span-6 md:px-12 lg:px-16"
		>
			<div>
				<span class="font-mono text-[10px] tracking-widest text-primary-foreground/70">NEED MORE HELP?</span>
				<h3 class="font-ui mt-1 text-sm font-semibold tracking-wider text-primary-foreground">SUBMIT A TICKET</h3>
			</div>
			<TicketPlus class="h-6 w-6 text-primary-foreground" />
		</a>
	</div>
</section>
