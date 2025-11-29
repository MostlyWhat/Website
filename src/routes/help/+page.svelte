<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { 
		Search, BookOpen, Zap, Shield, HelpCircle, Wrench, 
		ArrowRight, ExternalLink, FileText, MessageSquare
	} from '@lucide/svelte';

	let searchQuery = $state('');
	let selectedCategory = $state<string | null>(null);

	const stats = [
		{ value: '50+', label: 'ARTICLES' },
		{ value: '6', label: 'CATEGORIES' },
		{ value: '24H', label: 'RESPONSE' }
	];

	// Help categories
	const categories = [
		{ id: 'getting-started', icon: Zap, title: 'GETTING STARTED', desc: 'New to MostlyWhat? Start here', count: 8 },
		{ id: 'services', icon: BookOpen, title: 'SERVICES', desc: 'Learn about our offerings', count: 12 },
		{ id: 'process', icon: Wrench, title: 'PROCESS', desc: 'How we work together', count: 6 },
		{ id: 'technical', icon: Shield, title: 'TECHNICAL', desc: 'Tech stack and integrations', count: 10 },
		{ id: 'billing', icon: FileText, title: 'BILLING', desc: 'Payments and invoicing', count: 5 },
		{ id: 'support', icon: HelpCircle, title: 'SUPPORT', desc: 'Get help with issues', count: 7 }
	];

	// Help articles
	const articles = [
		{ 
			id: 'what-we-do',
			category: 'getting-started',
			title: 'What Does MostlyWhat Systems Do?',
			excerpt: 'An overview of our services, capabilities, and the types of projects we take on.',
			readTime: '3 min'
		},
		{ 
			id: 'project-process',
			category: 'getting-started',
			title: 'How Our Project Process Works',
			excerpt: 'From initial consultation to launch, here is what to expect when working with us.',
			readTime: '5 min'
		},
		{ 
			id: 'starting-project',
			category: 'getting-started',
			title: 'How to Start a Project',
			excerpt: 'Step-by-step guide to initiating a new project with our team.',
			readTime: '4 min'
		},
		{ 
			id: 'web-development',
			category: 'services',
			title: 'Web Development Services',
			excerpt: 'Full-stack web development with SvelteKit, React, and modern technologies.',
			readTime: '6 min'
		},
		{ 
			id: 'design-systems',
			category: 'services',
			title: 'Design Systems & Brand Identity',
			excerpt: 'Creating cohesive visual languages and scalable design systems.',
			readTime: '5 min'
		},
		{ 
			id: 'tech-stack',
			category: 'technical',
			title: 'Our Technology Stack',
			excerpt: 'SvelteKit, TypeScript, TailwindCSS, Cloudflare, and the tools we use.',
			readTime: '4 min'
		},
		{ 
			id: 'integrations',
			category: 'technical',
			title: 'Third-Party Integrations',
			excerpt: 'CMS, payment systems, analytics, and other integrations we support.',
			readTime: '5 min'
		},
		{ 
			id: 'timeline',
			category: 'process',
			title: 'Project Timelines',
			excerpt: 'Understanding typical project durations and delivery schedules.',
			readTime: '3 min'
		},
		{ 
			id: 'communication',
			category: 'process',
			title: 'Communication & Collaboration',
			excerpt: 'How we stay in touch and work together throughout the project.',
			readTime: '4 min'
		},
		{ 
			id: 'pricing',
			category: 'billing',
			title: 'Pricing & Estimates',
			excerpt: 'How we structure pricing and provide project estimates.',
			readTime: '4 min'
		},
		{ 
			id: 'invoicing',
			category: 'billing',
			title: 'Invoicing & Payment',
			excerpt: 'Payment terms, methods, and milestone-based billing.',
			readTime: '3 min'
		},
		{ 
			id: 'maintenance',
			category: 'support',
			title: 'Post-Launch Support',
			excerpt: 'Ongoing maintenance, updates, and support options.',
			readTime: '4 min'
		}
	];

	// Popular/featured articles
	const popularArticles = articles.slice(0, 4);

	// Filter articles
	const filteredArticles = $derived(() => {
		let result = articles;
		
		if (selectedCategory) {
			result = result.filter(a => a.category === selectedCategory);
		}
		
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			result = result.filter(a => 
				a.title.toLowerCase().includes(query) || 
				a.excerpt.toLowerCase().includes(query)
			);
		}
		
		return result;
	});
</script>

<svelte:head>
	<title>Help Center — {m.site_name()}</title>
	<meta name="description" content="Find answers to common questions about working with MostlyWhat Systems." />
</svelte:head>

<!-- Hero Section -->
<section class="relative flex min-h-[60vh] flex-col border-b border-border">
	<!-- Image Background -->
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<img 
			src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
			alt="" 
			class="h-full w-full object-cover brightness-[0.15]"
		/>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content -->
	<div class="flex flex-1 flex-col justify-end px-6 pb-8 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="mb-8 max-w-3xl">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">KNOWLEDGE BASE</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl">
				HOW CAN WE HELP?
			</h1>
			<p class="font-body mt-4 max-w-xl text-base text-muted-foreground">
				Browse our knowledge base or search for specific topics.
			</p>
		</div>
	</div>

	<!-- Search Bar -->
	<div class="border-t border-border bg-card/80 px-6 py-4 backdrop-blur-sm md:px-12 lg:px-16">
		<div class="relative">
			<Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
			<Input 
				type="search" 
				bind:value={searchQuery} 
				placeholder="Search help articles..." 
				class="font-body h-10 pl-12 text-sm"
			/>
		</div>
	</div>

	<!-- Stats Bar -->
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
		{#each stats as { value, label } (label)}
			<div class="col-span-4 bg-card/80 px-6 py-3 backdrop-blur-sm md:px-12 lg:px-16">
				<span class="font-display text-lg font-bold text-primary">{value}</span>
				<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Categories Grid -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each categories as { id, icon: Icon, title, desc, count } (id)}
			<button
				type="button"
				onclick={() => selectedCategory = selectedCategory === id ? null : id}
				class="group col-span-6 flex flex-col bg-background px-6 py-6 text-left transition-colors hover:bg-card md:col-span-4 md:px-8 lg:col-span-2 lg:px-6 {selectedCategory === id ? 'bg-primary/10 ring-1 ring-primary' : ''}"
			>
				<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
					<Icon class="h-4 w-4 text-primary" />
				</div>
				<h3 class="font-ui mt-3 text-[11px] font-semibold tracking-wider">{title}</h3>
				<p class="font-body mt-1 text-[10px] text-muted-foreground">{desc}</p>
				<span class="font-mono mt-2 text-[10px] tracking-wider text-muted-foreground">{count} ARTICLES</span>
			</button>
		{/each}
	</div>
</section>

<!-- Articles Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Sidebar -->
		<div class="col-span-12 bg-background px-6 py-8 md:px-12 lg:col-span-3 lg:px-16 lg:py-10" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
				{selectedCategory ? 'FILTERED BY' : 'SHOWING'}
			</span>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase">
				{selectedCategory ? categories.find(c => c.id === selectedCategory)?.title : 'POPULAR'}
			</h2>
			
			{#if selectedCategory}
				<Button variant="outline" size="lg" class="font-ui mt-4 tracking-wider" onclick={() => selectedCategory = null}>
					CLEAR FILTER
				</Button>
			{/if}

			<!-- Quick Links -->
			<div class="mt-6">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK LINKS</span>
				<div class="mt-3 space-y-2">
					<a href={localizeHref('/contact')} class="font-ui flex items-center gap-2 text-xs tracking-wider text-muted-foreground hover:text-primary">
						<MessageSquare class="h-3.5 w-3.5" />
						CONTACT SUPPORT
					</a>
					<a href={localizeHref('/docs')} class="font-ui flex items-center gap-2 text-xs tracking-wider text-muted-foreground hover:text-primary">
						<ExternalLink class="h-3.5 w-3.5" />
						DOCUMENTATION
					</a>
				</div>
			</div>
		</div>

		<!-- Articles Grid -->
		<div class="col-span-12 lg:col-span-9">
			{#if filteredArticles().length > 0}
				<div class="grid grid-cols-1 gap-px bg-border md:grid-cols-2" use:scrollAnimate={{ animation: 'stagger' }}>
					{#each filteredArticles() as { id, category, title, excerpt, readTime } (id)}
						<a
							href={localizeHref(`/help/${id}`)}
							class="group flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card md:px-12 lg:px-16"
						>
							<span class="font-mono text-[10px] tracking-widest text-primary">
								{categories.find(c => c.id === category)?.title}
							</span>
							<h3 class="font-ui mt-2 text-sm font-semibold tracking-wider group-hover:text-primary">{title}</h3>
							<p class="font-body mt-1 flex-1 text-[11px] text-muted-foreground">{excerpt}</p>
							<span class="font-mono mt-3 flex items-center gap-2 text-[10px] tracking-wider text-muted-foreground">
								{readTime} READ
								<ArrowRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
							</span>
						</a>
					{/each}
				</div>
			{:else}
				<div class="flex min-h-[300px] flex-col items-center justify-center bg-background px-6 py-12 text-center md:px-12 lg:px-16">
					<HelpCircle class="mb-4 h-8 w-8 text-muted-foreground" />
					<p class="font-ui text-sm text-muted-foreground">No articles found</p>
					<Button variant="outline" size="lg" class="font-ui mt-4 tracking-wider" onclick={() => { searchQuery = ''; selectedCategory = null; }}>
						CLEAR FILTERS
					</Button>
				</div>
			{/if}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-10 md:px-12 lg:col-span-6 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">STILL NEED HELP?</span>
			<h2 class="font-display mt-3 text-2xl font-bold uppercase md:text-3xl">CONTACT OUR TEAM</h2>
			<p class="font-body mt-3 text-sm text-muted-foreground">
				Can't find what you're looking for? Our team is here to help.
			</p>
			<div class="mt-6 flex flex-wrap gap-3">
				<Button href={localizeHref('/contact')} class="font-ui tracking-wider">
					GET IN TOUCH
					<ArrowRight class="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border lg:col-span-6">
			<div class="flex flex-col justify-center bg-card px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-primary">24H</span>
				<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">AVG. RESPONSE</p>
			</div>
			<div class="flex flex-col justify-center bg-card px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-primary">100%</span>
				<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">SATISFACTION</p>
			</div>
			<div class="flex flex-col justify-center bg-card px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-primary">50+</span>
				<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">HELP ARTICLES</p>
			</div>
			<div class="flex flex-col justify-center bg-card px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-xl font-bold text-primary">6</span>
				<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">CATEGORIES</p>
			</div>
		</div>
	</div>
</section>
