<script lang="ts">
	/**
	 * Help Center Page
	 * 
	 * Knowledge base for users with articles organized by category.
	 */
	import { localizeHref } from '$lib/paraglide/runtime';
	import { BookOpen, Search, HelpCircle, FileText, Rocket, CreditCard, Settings, MessageCircle, ArrowRight, ExternalLink } from '@lucide/svelte';

	let { data } = $props();

	let searchQuery = $state('');

	// Default categories with icons if no articles exist yet
	const defaultCategories = [
		{ 
			name: 'getting-started', 
			label: 'Getting Started', 
			icon: Rocket, 
			description: 'Learn the basics and get up to speed quickly' 
		},
		{ 
			name: 'projects', 
			label: 'Projects', 
			icon: FileText, 
			description: 'Managing projects, requests, and proposals' 
		},
		{ 
			name: 'billing', 
			label: 'Billing & Payments', 
			icon: CreditCard, 
			description: 'Invoices, payments, and subscription info' 
		},
		{ 
			name: 'account', 
			label: 'Account Settings', 
			icon: Settings, 
			description: 'Profile, preferences, and security settings' 
		}
	];

	// Get unique categories from articles or use defaults
	const categories = $derived(() => {
		if (data.categories && data.categories.length > 0) {
			return data.categories.map((cat: { name: string; articles: unknown[] }) => {
				const defaultCat = defaultCategories.find(d => d.name === cat.name);
				return {
					...cat,
					label: defaultCat?.label ?? cat.name.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()),
					icon: defaultCat?.icon ?? FileText,
					description: defaultCat?.description ?? ''
				};
			});
		}
		return defaultCategories.map(cat => ({ ...cat, articles: [] }));
	});

	// Filter articles by search
	const filteredArticles = $derived(() => {
		if (!searchQuery.trim()) return data.articles ?? [];
		const query = searchQuery.toLowerCase();
		return (data.articles ?? []).filter((article: { title: string; excerpt: string | null }) => 
			article.title.toLowerCase().includes(query) ||
			(article.excerpt?.toLowerCase().includes(query))
		);
	});

	const hasArticles = $derived((data.articles?.length ?? 0) > 0);
</script>

<svelte:head>
	<title>Help Center | MostlyWhat Systems</title>
</svelte:head>

<!-- Help Center Container -->
<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-12 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// HELP CENTER</span>
		<h1 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">
			How can we help?
		</h1>
		<p class="font-body mt-2 text-muted-foreground">
			Browse our knowledge base or search for answers to your questions.
		</p>

		<!-- Search Bar -->
		<div class="relative mt-6 max-w-lg">
			<Search class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<input
				type="text"
				bind:value={searchQuery}
				placeholder="Search articles..."
				class="font-ui w-full border border-border bg-card py-3 pl-12 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
			/>
		</div>
	</section>

	{#if searchQuery.trim()}
		<!-- Search Results -->
		<section class="border-b border-border">
			<div class="px-6 py-4 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
					SEARCH RESULTS ({filteredArticles().length})
				</span>
			</div>
			<div class="px-6 pb-8 md:px-12 lg:px-16">
				{#if filteredArticles().length > 0}
					<div class="grid gap-4 md:grid-cols-2">
						{#each filteredArticles() as article}
							<a
								href={localizeHref(`/app/help/${article.slug}`)}
								class="group border border-border bg-card p-6 transition-colors hover:bg-card/80"
							>
								<div class="flex items-start gap-4">
									<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-background">
										<FileText class="h-4 w-4 text-primary" />
									</div>
									<div class="flex-1 min-w-0">
										<h3 class="font-ui text-sm font-semibold tracking-wider group-hover:text-primary">{article.title}</h3>
										{#if article.excerpt}
											<p class="font-body mt-1 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
										{/if}
										<span class="font-mono mt-2 inline-block text-[10px] tracking-wider text-muted-foreground uppercase">{article.category}</span>
									</div>
								</div>
							</a>
						{/each}
					</div>
				{:else}
					<div class="flex flex-col items-center justify-center py-12 text-center">
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
							<Search class="h-5 w-5 text-muted-foreground" />
						</div>
						<p class="font-body mt-4 text-sm text-muted-foreground">No articles found matching "{searchQuery}"</p>
					</div>
				{/if}
			</div>
		</section>
	{:else}
		<!-- Categories Grid -->
		<section class="border-b border-border">
			<div class="grid grid-cols-12 gap-px bg-border">
				{#each categories() as category}
					{@const Icon = category.icon}
					<a
						href={localizeHref(`/app/help?category=${category.name}`)}
						class="group col-span-6 flex flex-col bg-background px-6 py-8 transition-colors hover:bg-card md:col-span-3 md:px-12 lg:px-16"
					>
						<div class="flex h-12 w-12 items-center justify-center border border-border bg-card transition-colors group-hover:border-primary">
							<Icon class="h-5 w-5 text-primary" />
						</div>
						<span class="font-ui mt-6 text-sm font-semibold tracking-wider">{category.label}</span>
						<span class="font-body mt-1 text-sm text-muted-foreground">{category.description}</span>
						{#if category.articles?.length > 0}
							<span class="font-mono mt-2 text-[10px] tracking-wider text-muted-foreground">
								{category.articles.length} ARTICLE{category.articles.length !== 1 ? 'S' : ''}
							</span>
						{/if}
					</a>
				{/each}
			</div>
		</section>

		{#if hasArticles}
			<!-- Featured / Recent Articles -->
			<section class="border-b border-border">
				<div class="px-6 py-4 md:px-12 lg:px-16">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">01 — RECENT ARTICLES</span>
				</div>
				<div class="px-6 pb-8 md:px-12 lg:px-16">
					<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{#each (data.articles ?? []).slice(0, 6) as article}
							<a
								href={localizeHref(`/app/help/${article.slug}`)}
								class="group border border-border bg-card p-6 transition-colors hover:bg-card/80"
							>
								<h3 class="font-ui text-sm font-semibold tracking-wider group-hover:text-primary">{article.title}</h3>
								{#if article.excerpt}
									<p class="font-body mt-2 text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
								{/if}
								<div class="mt-4 flex items-center gap-2 text-muted-foreground">
									<ArrowRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
									<span class="font-mono text-[10px] tracking-wider">READ MORE</span>
								</div>
							</a>
						{/each}
					</div>
				</div>
			</section>
		{:else}
			<!-- No Articles Yet -->
			<section class="border-b border-border">
				<div class="px-6 py-16 md:px-12 lg:px-16">
					<div class="flex flex-col items-center justify-center text-center">
						<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
							<BookOpen class="h-8 w-8 text-muted-foreground" />
						</div>
						<h2 class="font-display mt-6 text-lg font-bold uppercase">Knowledge Base Coming Soon</h2>
						<p class="font-body mt-2 max-w-md text-sm text-muted-foreground">
							We're building out our help center with guides and tutorials. In the meantime, feel free to reach out to our support team.
						</p>
					</div>
				</div>
			</section>
		{/if}
	{/if}

	<!-- Contact Support Section -->
	<section class="bg-background">
		<div class="px-6 py-4 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">02 — NEED MORE HELP?</span>
		</div>
		<div class="px-6 pb-12 md:px-12 lg:px-16">
			<div class="grid gap-4 md:grid-cols-2">
				<!-- Submit Ticket -->
				<a
					href={localizeHref('/app/tickets/new')}
					class="group flex flex-col items-start border border-border bg-card p-6 transition-colors hover:bg-card/80"
				>
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
						<MessageCircle class="h-4 w-4 text-primary" />
					</div>
					<span class="font-ui mt-4 text-sm font-semibold tracking-wider">SUBMIT A TICKET</span>
					<span class="font-body mt-1 text-sm text-muted-foreground">
						Get help from our support team
					</span>
					<ArrowRight class="mt-4 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
				</a>

				<!-- Contact Page -->
				<a
					href={localizeHref('/contact')}
					class="group flex flex-col items-start border border-border bg-card p-6 transition-colors hover:bg-card/80"
				>
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
						<ExternalLink class="h-4 w-4 text-primary" />
					</div>
					<span class="font-ui mt-4 text-sm font-semibold tracking-wider">CONTACT US</span>
					<span class="font-body mt-1 text-sm text-muted-foreground">
						Reach out for sales or general inquiries
					</span>
					<ArrowRight class="mt-4 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
				</a>
			</div>
		</div>
	</section>
</div>
