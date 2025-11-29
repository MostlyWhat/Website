<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight, ChevronRight } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedCategory = $state('All');

	const filteredPosts = $derived(
		selectedCategory === 'All' 
			? data.posts 
			: data.posts.filter(p => p.category === selectedCategory)
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

<!-- Hero Section - Full Viewport -->
<section class="relative flex h-dvh flex-col border-b border-border">
	<!-- Image Background -->
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<img 
			src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop" 
			alt="" 
			class="h-full w-full object-cover brightness-[0.15]"
		/>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content - Positioned at Bottom -->
	<div class="flex flex-1 flex-col justify-end px-6 pb-8 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid grid-cols-12 gap-4 lg:gap-8">
			<div class="col-span-12 lg:col-span-8">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">INSIGHTS & UPDATES</span>
				<h1 class="font-display mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
					{m.blog_title()}
				</h1>
			</div>
			<div class="col-span-12 flex flex-col justify-end lg:col-span-4">
				<p class="font-body text-muted-foreground">{m.blog_subtitle()}</p>
			</div>
		</div>
	</div>

	<!-- Stats Bar -->
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
		<div class="col-span-4 bg-card/80 px-6 py-4 backdrop-blur-sm md:px-12 lg:px-16">
			<span class="font-display text-lg font-bold text-primary md:text-2xl">{data.posts.length}</span>
			<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">ARTICLES</p>
		</div>
		<div class="col-span-4 bg-card/80 px-6 py-4 backdrop-blur-sm md:px-12 lg:px-16">
			<span class="font-display text-lg font-bold text-primary md:text-2xl">{data.categories.length - 1}</span>
			<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">CATEGORIES</p>
		</div>
		<div class="col-span-4 bg-card/80 px-6 py-4 backdrop-blur-sm md:px-12 lg:px-16">
			<span class="font-display text-lg font-bold text-primary md:text-2xl">WEEKLY</span>
			<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">UPDATES</p>
		</div>
	</div>
</section>

<!-- Filter Bar -->
<section class="border-b border-border">
	<div class="flex">
		<!-- Filter Label -->
		<div class="flex w-24 shrink-0 items-center justify-center border-r border-border bg-card">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">FILTER</span>
		</div>
		<!-- Filter Options -->
		<div class="flex flex-1 overflow-x-auto">
			{#each data.categories as category (category)}
				<button
					type="button"
					onclick={() => selectedCategory = category}
					class="font-mono flex flex-1 items-center justify-center border-r border-border px-4 py-4 text-xs uppercase tracking-wider transition-colors last:border-r-0 {selectedCategory === category ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:bg-card hover:text-foreground'}"
				>
					{category}
				</button>
			{/each}
		</div>
	</div>
</section>

<!-- Posts Grid -->
<section class="min-h-dvh border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		{#each filteredPosts as post (post.slug)}
			<a 
				href={localizeHref(`/blog/${post.slug}`)} 
				class="group col-span-12 flex flex-col bg-background transition-colors hover:bg-card md:col-span-6 lg:col-span-4"
			>
				<!-- Image placeholder -->
				<div class="aspect-video border-b border-border bg-card">
					<div class="flex h-full items-center justify-center">
						<span class="font-mono text-xs uppercase text-muted-foreground">[ {post.category} ]</span>
					</div>
				</div>
				
				<div class="flex flex-1 flex-col px-6 py-6 md:px-12 lg:px-16">
					<div class="flex items-center gap-3 text-xs">
						<span class="font-mono uppercase text-primary">{post.category}</span>
						<span class="font-mono text-muted-foreground">{formatDate(post.date)}</span>
						<span class="font-mono text-muted-foreground">{post.readTime}</span>
					</div>
					
					<h2 class="font-ui mt-3 text-base font-semibold transition-colors group-hover:text-primary">
						{post.title}
					</h2>
					<p class="font-body mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
					
					<div class="font-mono mt-4 flex items-center gap-1 text-xs text-primary">
						{m.blog_read_more()}
						<ChevronRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
					</div>
				</div>
			</a>
		{:else}
			<div class="col-span-12 flex min-h-[40vh] items-center justify-center bg-background px-6 py-12 md:px-12 lg:px-16">
				<p class="font-body text-center text-muted-foreground">No posts found in this category.</p>
			</div>
		{/each}
	</div>
</section>

<!-- Newsletter CTA -->
<section class="min-h-dvh border-b border-border">
	<div class="grid h-full min-h-dvh grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-16 md:px-12 lg:col-span-6 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">STAY INFORMED</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl lg:text-5xl">NEWSLETTER</h2>
			<p class="font-body mt-4 max-w-md text-muted-foreground">Get notified when we publish new articles and insights.</p>
		</div>
		<div class="col-span-12 flex flex-col justify-center bg-card px-6 py-16 md:px-12 lg:col-span-6 lg:px-16">
			<div class="flex flex-col gap-4 sm:flex-row">
				<input 
					type="email" 
					placeholder="YOUR@EMAIL.COM"
					class="font-mono h-12 flex-1 border border-border bg-background px-4 text-xs uppercase tracking-wider placeholder:text-muted-foreground focus:border-primary focus:outline-none"
				/>
				<Button class="font-ui h-12 shrink-0 px-8 uppercase tracking-wider">
					SUBSCRIBE
					<ArrowRight class="ml-2 h-4 w-4" />
				</Button>
			</div>
		</div>
	</div>
</section>
