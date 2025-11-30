<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Search, ArrowRight, FileText, Rocket, Bug, Clock, CreditCard, Settings, FileText as FileTextIcon } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();

	let searchQuery = $state('');

	const categoryMeta: Record<string, { icon: typeof Rocket; label: string; desc: string }> = {
		onboarding: {
			icon: Rocket,
			label: 'ONBOARDING',
			desc: 'Getting started and project handoff guides'
		},
		troubleshooting: {
			icon: Bug,
			label: 'TROUBLESHOOTING',
			desc: 'Bug reports, browser issues, and common problems'
		},
		general: {
			icon: Clock,
			label: 'GENERAL',
			desc: 'Response times, project updates, and general info'
		},
		billing: {
			icon: CreditCard,
			label: 'BILLING',
			desc: 'Payment methods, invoicing, and refunds'
		}
	};

	function handleSearch(e: Event) {
		e.preventDefault();
		if (searchQuery.trim()) {
			window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
		}
	}

	// Filter articles based on search
	const filteredArticles = $derived(() => {
		if (!searchQuery.trim()) return data.articles;
		const query = searchQuery.toLowerCase();
		return data.articles.filter(
			a => a.title.toLowerCase().includes(query) || 
			     a.summary.toLowerCase().includes(query) ||
			     a.category.toLowerCase().includes(query)
		);
	});
</script>

<svelte:head>
	<title>Support Articles — {m.site_name()}</title>
	<meta name="description" content="Browse all support articles and documentation." />
</svelte:head>

<!-- Header -->
<section class="border-b border-border bg-card">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="mx-auto max-w-2xl text-center">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// DOCS.BROWSE</span>
			<h1 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">ALL ARTICLES</h1>
			<p class="font-body mt-2 text-sm text-muted-foreground">
				Browse our complete library of support documentation.
			</p>

			<!-- Search Bar -->
			<form class="mt-8" onsubmit={handleSearch}>
				<div class="relative">
					<Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
					<input
						type="text"
						bind:value={searchQuery}
						placeholder="Filter articles..."
						class="font-body h-12 w-full border border-border bg-background pl-12 pr-4 text-sm transition-colors placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
					/>
				</div>
			</form>
		</div>
	</div>
</section>

<!-- Articles by Category -->
<section class="border-b border-border">
	{#each Object.entries(data.categorizedArticles) as [category, articles] (category)}
		{@const meta = categoryMeta[category] || { icon: FileTextIcon, label: category.toUpperCase(), desc: '' }}
		{@const Icon = meta.icon}
		
		<div class="border-b border-border last:border-b-0">
			<!-- Category Header -->
			<div class="flex items-center gap-4 bg-card px-6 py-6 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
				<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
					<Icon class="h-5 w-5 text-primary" />
				</div>
				<div>
					<h2 class="font-ui text-sm font-semibold tracking-wider">{meta.label}</h2>
					<p class="font-body text-xs text-muted-foreground">{meta.desc}</p>
				</div>
				<span class="font-mono ml-auto text-[10px] tracking-widest text-muted-foreground">
					{articles.length} {articles.length === 1 ? 'ARTICLE' : 'ARTICLES'}
				</span>
			</div>

			<!-- Articles -->
			<div class="grid gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
				{#each articles as article (article.slug)}
					<a
						href={localizeHref(`/support/${article.slug}`)}
						class="flex items-start gap-4 bg-background px-6 py-5 transition-colors hover:bg-card md:px-12 lg:px-16"
					>
						<FileText class="mt-0.5 h-5 w-5 flex-shrink-0 text-muted-foreground" />
						<div class="flex-1">
							<h3 class="font-ui text-sm font-semibold tracking-wider">{article.title}</h3>
							<p class="font-body mt-1 text-sm text-muted-foreground line-clamp-2">{article.summary}</p>
						</div>
						<ArrowRight class="mt-1 h-4 w-4 flex-shrink-0 text-muted-foreground" />
					</a>
				{/each}
			</div>
		</div>
	{/each}
</section>

<!-- Back to Support -->
<section class="border-b border-border bg-card">
	<div class="flex items-center justify-between px-6 py-6 md:px-12 lg:px-16">
		<a
			href={localizeHref('/support')}
			class="font-mono flex items-center gap-2 text-[10px] tracking-widest text-muted-foreground hover:text-primary"
		>
			← BACK TO SUPPORT
		</a>
		<a
			href={localizeHref('/support#ticket-form')}
			class="font-ui flex items-center gap-2 text-xs tracking-wider text-primary hover:underline"
		>
			SUBMIT A TICKET
			<ArrowRight class="h-3 w-3" />
		</a>
	</div>
</section>
