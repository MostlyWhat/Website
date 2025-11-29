<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Section from '$lib/components/layout/Section.svelte';
	import Tile from '$lib/components/layout/Tile.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, Tag, Calendar, Clock, ChevronRight } from '@lucide/svelte';

	// Sample blog posts - in production, these would come from MDX files or a CMS
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

	const featuredPosts = posts.filter(p => p.featured);

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{m.blog_title()} — {m.site_name()}</title>
	<meta name="description" content={m.blog_subtitle()} />
</svelte:head>

<!-- Hero Section -->
<Section padding="xl">
	<div class="mx-auto max-w-3xl text-center" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Blog</p>
		<h1 class="vt-title mb-6 text-4xl md:text-5xl lg:text-6xl">{m.blog_title()}</h1>
		<p class="font-body text-lg text-muted-foreground md:text-xl">{m.blog_subtitle()}</p>
	</div>
</Section>

<!-- Featured Posts -->
<Section background="card">
	<div class="mb-8" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui text-sm uppercase tracking-wider text-primary">Featured</p>
	</div>

	<div class="stagger-children grid gap-6 lg:grid-cols-2" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each featuredPosts as post}
			<a href="/blog/{post.slug}" class="group">
				<Tile interactive padding="none" class="flex h-full flex-col overflow-hidden">
					<!-- Post Image Placeholder -->
					<div class="aspect-video border-b border-border bg-muted">
						<div class="flex h-full items-center justify-center">
							<span class="font-mono text-sm text-muted-foreground">[ {post.category} ]</span>
						</div>
					</div>
					
					<div class="flex flex-1 flex-col p-6">
						<div class="mb-3 flex items-center gap-4">
							<span class="font-ui flex items-center gap-1 text-xs uppercase tracking-wider text-primary">
								<Tag class="h-3 w-3" />
								{post.category}
							</span>
							<span class="font-mono flex items-center gap-1 text-xs text-muted-foreground">
								<Calendar class="h-3 w-3" />
								{formatDate(post.date)}
							</span>
							<span class="font-mono flex items-center gap-1 text-xs text-muted-foreground">
								<Clock class="h-3 w-3" />
								{post.readTime}
							</span>
						</div>
						
						<h2 class="font-ui mb-2 text-xl font-semibold group-hover:text-primary transition-colors">
							{post.title}
						</h2>
						<p class="font-body text-muted-foreground">{post.excerpt}</p>
						
						<div class="font-ui mt-4 flex items-center gap-1 text-sm text-primary">
							{m.blog_read_more()}
							<ChevronRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</div>
					</div>
				</Tile>
			</a>
		{/each}
	</div>
</Section>

<!-- Category Filter -->
<Section padding="none" class="border-b border-border">
	<div class="flex flex-wrap gap-2 py-4" use:scrollAnimate={{ animation: 'fade' }}>
		{#each categories as category}
			<button
				type="button"
				onclick={() => selectedCategory = category}
				class="font-ui border px-4 py-2 text-sm transition-colors {selectedCategory === category ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background hover:bg-muted'}"
			>
				{category}
			</button>
		{/each}
	</div>
</Section>

<!-- All Posts -->
<Section>
	<div class="mb-8" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui text-sm uppercase tracking-wider text-primary">
			{selectedCategory === 'All' ? 'All Posts' : selectedCategory}
		</p>
	</div>

	{#if filteredPosts.length > 0}
		<div class="stagger-children space-y-4" use:scrollAnimate={{ animation: 'stagger' }}>
			{#each filteredPosts as post}
				<a href="/blog/{post.slug}" class="group block">
					<Tile interactive padding="lg" class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div class="flex-1">
							<div class="mb-2 flex flex-wrap items-center gap-4">
								<span class="font-ui flex items-center gap-1 text-xs uppercase tracking-wider text-primary">
									<Tag class="h-3 w-3" />
									{post.category}
								</span>
								<span class="font-mono flex items-center gap-1 text-xs text-muted-foreground">
									<Calendar class="h-3 w-3" />
									{formatDate(post.date)}
								</span>
								<span class="font-mono flex items-center gap-1 text-xs text-muted-foreground">
									<Clock class="h-3 w-3" />
									{post.readTime}
								</span>
							</div>
							
							<h3 class="font-ui mb-1 text-lg font-semibold group-hover:text-primary transition-colors">
								{post.title}
							</h3>
							<p class="font-body text-sm text-muted-foreground">{post.excerpt}</p>
						</div>
						
						<div class="shrink-0">
							<ChevronRight class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
						</div>
					</Tile>
				</a>
			{/each}
		</div>
	{:else}
		<Tile padding="xl" class="text-center">
			<p class="font-body text-muted-foreground">No posts found in this category.</p>
		</Tile>
	{/if}
</Section>

<!-- Newsletter CTA -->
<Section background="card" padding="xl">
	<div class="mx-auto max-w-2xl text-center" use:scrollAnimate={{ animation: 'scale' }}>
		<h2 class="font-display mb-4 text-3xl">Stay Updated</h2>
		<p class="font-body mb-6 text-muted-foreground">
			Get notified when we publish new articles, tutorials, and updates.
		</p>
		<div class="flex flex-col gap-4 sm:flex-row sm:justify-center">
			<input 
				type="email" 
				placeholder="your@email.com"
				class="font-body h-12 border border-border bg-background px-4 placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:w-64"
			/>
			<Button size="lg" class="font-ui">
				Subscribe
				<ArrowRight class="ml-2 h-5 w-5" />
			</Button>
		</div>
	</div>
</Section>
