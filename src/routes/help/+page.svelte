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

<!-- Hero Section - Full Viewport -->
<section class="relative flex h-[calc(100dvh-6rem)] flex-col border-b border-border">
	<!-- Image Background -->
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<img 
			src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
			alt="" 
			class="h-full w-full object-cover brightness-[0.15]"
		/>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content - Positioned at Bottom -->
	<div class="flex flex-1 flex-col justify-end px-6 pb-8 md:px-8 lg:px-12" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid grid-cols-12 gap-4">
			<div class="col-span-12 lg:col-span-8">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">KNOWLEDGE BASE</span>
				<h1 class="font-display mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
					HOW CAN WE HELP?
				</h1>
			</div>
			<div class="col-span-12 flex flex-col justify-end lg:col-span-4">
				<p class="font-body text-muted-foreground">
					Browse our knowledge base or search for specific topics.
				</p>
			</div>
		</div>
	</div>

	<!-- Search Bar -->
	<div class="border-t border-border bg-card/80 p-4 backdrop-blur-sm md:p-6">
		<div class="relative">
			<Search class="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
			<Input 
				type="search" 
				bind:value={searchQuery} 
				placeholder="Search help articles..." 
				class="font-body h-12 pl-12 text-base"
			/>
		</div>
	</div>

	<!-- Stats Bar -->
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
		{#each stats as { value, label } (label)}
			<div class="col-span-4 bg-card/80 p-4 backdrop-blur-sm">
				<span class="font-display text-lg font-bold text-primary md:text-2xl">{value}</span>
				<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
			</div>
		{/each}
	</div>
</section>

<!-- Categories Grid -->
<section class="border-b border-border">
	<div class="grid grid-cols-2 gap-px bg-border md:grid-cols-3 lg:grid-cols-6" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each categories as { id, icon: Icon, title, desc, count } (id)}
			<button
				type="button"
				onclick={() => selectedCategory = selectedCategory === id ? null : id}
				class="group flex flex-col bg-background p-4 text-left transition-colors hover:bg-card md:p-6 {selectedCategory === id ? 'bg-primary/10 ring-1 ring-primary' : ''}"
			>
				<Icon class="mb-3 h-5 w-5 text-primary" />
				<h3 class="font-ui text-[11px] font-semibold tracking-wider">{title}</h3>
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
		<div class="col-span-12 bg-background p-4 md:p-6 lg:col-span-3 lg:p-8" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">
				{selectedCategory ? 'FILTERED BY' : 'SHOWING'}
			</span>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase">
				{selectedCategory ? categories.find(c => c.id === selectedCategory)?.title : 'POPULAR'}
			</h2>
			
			{#if selectedCategory}
				<Button variant="outline" class="font-ui mt-4 tracking-wider" onclick={() => selectedCategory = null}>
					CLEAR FILTER
				</Button>
			{/if}

			<!-- Quick Links -->
			<div class="mt-8">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK LINKS</span>
				<div class="mt-3 space-y-1">
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
							class="group flex flex-col bg-background p-4 transition-colors hover:bg-card md:p-6"
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
				<div class="flex min-h-[300px] flex-col items-center justify-center bg-background p-8 text-center">
					<HelpCircle class="mb-4 h-8 w-8 text-muted-foreground" />
					<p class="font-ui text-sm text-muted-foreground">No articles found</p>
					<Button variant="outline" class="font-ui mt-4 tracking-wider" onclick={() => { searchQuery = ''; selectedCategory = null; }}>
						CLEAR FILTERS
					</Button>
				</div>
			{/if}
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-1 gap-px bg-border lg:grid-cols-2" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="bg-background p-6 md:p-8 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">STILL NEED HELP?</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase">CONTACT OUR TEAM</h2>
			<p class="font-body mt-4 text-muted-foreground">
				Can't find what you're looking for? Our team is here to help.
			</p>
			<div class="mt-6 flex gap-2">
				<Button href={localizeHref('/contact')} class="font-ui tracking-wider">
					GET IN TOUCH
					<ArrowRight class="ml-2 h-4 w-4" />
				</Button>
				<Button href={localizeHref('/support')} variant="outline" class="font-ui tracking-wider">
					SUPPORT
				</Button>
			</div>
		</div>
		<div class="grid grid-cols-2 gap-px bg-border">
			<div class="bg-card p-4 md:p-6">
				<span class="font-display text-2xl font-bold text-primary">24H</span>
				<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">AVG. RESPONSE</p>
			</div>
			<div class="bg-card p-4 md:p-6">
				<span class="font-display text-2xl font-bold text-primary">100%</span>
				<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">SATISFACTION</p>
			</div>
			<div class="bg-card p-4 md:p-6">
				<span class="font-display text-2xl font-bold text-primary">50+</span>
				<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">HELP ARTICLES</p>
			</div>
			<div class="bg-card p-4 md:p-6">
				<span class="font-display text-2xl font-bold text-primary">6</span>
				<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">CATEGORIES</p>
			</div>
		</div>
	</div>
</section>
