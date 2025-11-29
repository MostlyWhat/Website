<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, ArrowDown, Tag, Calendar, Clock, ChevronRight } from '@lucide/svelte';

	const posts = [
		{
			slug: 'introducing-our-design-system',
			title: 'Introducing Our Design System',
			excerpt: 'A deep dive into the design principles and component library powering our projects.',
			category: 'Design',
			date: '2024-01-15',
			readTime: '8 min',
			featured: true
		},
		{
			slug: 'sveltekit-cloudflare-workers',
			title: 'Deploying SvelteKit on Cloudflare Workers',
			excerpt: 'A comprehensive guide to deploying high-performance SvelteKit applications on the edge.',
			category: 'Engineering',
			date: '2024-01-10',
			readTime: '12 min',
			featured: true
		},
		{
			slug: 'accessibility-first-development',
			title: 'Accessibility-First Development',
			excerpt: 'Why we build with accessibility as a core requirement, not an afterthought.',
			category: 'Development',
			date: '2024-01-05',
			readTime: '6 min'
		},
		{
			slug: 'the-case-for-sveltekit',
			title: 'The Case for SvelteKit in 2024',
			excerpt: 'Why we chose SvelteKit as our primary framework and how it benefits our clients.',
			category: 'Engineering',
			date: '2023-12-20',
			readTime: '10 min'
		},
		{
			slug: 'design-system-documentation',
			title: 'Documenting Design Systems Effectively',
			excerpt: 'Best practices for creating design system documentation that teams actually use.',
			category: 'Design',
			date: '2023-12-15',
			readTime: '7 min'
		},
		{
			slug: 'performance-optimization-tips',
			title: 'Web Performance Optimization Tips',
			excerpt: 'Practical techniques to achieve perfect Core Web Vitals scores.',
			category: 'Performance',
			date: '2023-12-10',
			readTime: '9 min'
		}
	];

	const categories = ['All', 'Design', 'Engineering', 'Development', 'Performance'];
	let selectedCategory = $state('All');

	const filteredPosts = $derived(
		selectedCategory === 'All' 
			? posts 
			: posts.filter(p => p.category === selectedCategory)
	);

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{m.blog_title()} — {m.site_name()}</title>
	<meta name="description" content={m.blog_subtitle()} />
</svelte:head>

<!-- Hero Section - Full Screen -->
<section class="relative flex min-h-[calc(100dvh-4rem)] flex-col border-b border-border">
	<!-- Grid Background -->
	<div class="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-primary/5">
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content -->
	<div class="flex flex-1 items-end p-4 pb-12 md:p-6 lg:p-8" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid w-full gap-4 lg:grid-cols-12">
			<div class="lg:col-span-8">
				<p class="font-mono text-xs tracking-widest text-primary">// BLOG</p>
				<h1 class="font-display mt-2 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl">
					{m.blog_title()}
				</h1>
			</div>
			<div class="lg:col-span-4 lg:flex lg:flex-col lg:justify-end">
				<p class="font-body text-muted-foreground">{m.blog_subtitle()}</p>
			</div>
		</div>
	</div>

	<!-- Stats Bar -->
	<div class="grid grid-cols-3 gap-px border-t border-border bg-border">
		<div class="bg-card/80 p-3 backdrop-blur-sm md:p-4">
			<span class="font-display text-lg font-bold text-primary md:text-2xl">{posts.length}</span>
			<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:text-xs">ARTICLES</p>
		</div>
		<div class="bg-card/80 p-3 backdrop-blur-sm md:p-4">
			<span class="font-display text-lg font-bold text-primary md:text-2xl">{categories.length - 1}</span>
			<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:text-xs">CATEGORIES</p>
		</div>
		<div class="bg-card/80 p-3 backdrop-blur-sm md:p-4">
			<span class="font-display text-lg font-bold text-primary md:text-2xl">WEEKLY</span>
			<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:text-xs">UPDATES</p>
		</div>
	</div>

	<!-- Category Filter -->
	<div class="border-t border-border bg-card/50 backdrop-blur-sm">
		<div class="flex flex-wrap gap-px bg-border">
			{#each categories as category}
				<button
					type="button"
					onclick={() => selectedCategory = category}
					class="font-mono bg-background px-4 py-3 text-xs uppercase tracking-wider transition-colors {selectedCategory === category ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground'}"
				>
					{category}
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Posts Grid -->
<section class="border-b border-border">
	<div class="grid gap-px bg-border md:grid-cols-2 lg:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each filteredPosts as post}
			<a href="/blog/{post.slug}" class="stagger-children group flex flex-col bg-background transition-colors hover:bg-card">
				<!-- Image placeholder -->
				<div class="aspect-video border-b border-border bg-card">
					<div class="flex h-full items-center justify-center">
						<span class="font-mono text-xs uppercase text-muted-foreground">[ {post.category} ]</span>
					</div>
				</div>
				
				<div class="flex flex-1 flex-col p-4">
					<div class="flex items-center gap-3 text-xs">
						<span class="font-mono uppercase text-primary">{post.category}</span>
						<span class="font-mono text-muted-foreground">{formatDate(post.date)}</span>
						<span class="font-mono text-muted-foreground">{post.readTime}</span>
					</div>
					
					<h2 class="font-ui mt-2 text-sm font-semibold transition-colors group-hover:text-primary">
						{post.title}
					</h2>
					<p class="font-body mt-1 flex-1 text-xs text-muted-foreground">{post.excerpt}</p>
					
					<div class="font-mono mt-3 flex items-center gap-1 text-xs text-primary">
						{m.blog_read_more()}
						<ChevronRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
					</div>
				</div>
			</a>
		{:else}
			<div class="col-span-full bg-background p-8">
				<p class="font-body text-center text-muted-foreground">No posts found in this category.</p>
			</div>
		{/each}
	</div>
</section>

<!-- Newsletter CTA -->
<section class="border-b border-border">
	<div class="grid gap-px bg-border lg:grid-cols-2" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="bg-background p-4 md:p-6 lg:p-8">
			<p class="font-mono text-xs tracking-widest text-primary">// NEWSLETTER</p>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">STAY UPDATED</h2>
			<p class="font-body mt-2 text-sm text-muted-foreground">Get notified when we publish new articles.</p>
		</div>
		<div class="flex items-center gap-2 bg-card p-4 md:p-6 lg:p-8">
			<input 
				type="email" 
				placeholder="YOUR@EMAIL.COM"
				class="font-mono h-10 flex-1 border border-border bg-background px-3 text-xs uppercase tracking-wider placeholder:text-muted-foreground focus:border-primary focus:outline-none"
			/>
			<Button class="font-ui shrink-0 uppercase">
				SUBSCRIBE
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</div>
	</div>
</section>
