<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import VideoBackground from '$lib/components/layout/VideoBackground.svelte';
	import CTASection from '$lib/components/layout/CTASection.svelte';
	import { GlitchText } from '$lib/components/ui/glitch-text';
	import { MARATHON_VIDEO } from '$lib/constants';
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

<!-- Hero Section -->
<section class="relative flex h-[calc(100dvh-4rem)] flex-col border-b border-border">
	<!-- Video Background -->
	<VideoBackground 
		src={MARATHON_VIDEO}
		class="brightness-[0.80]"
	/>
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content - Left-aligned, Bottom-positioned -->
	<div class="flex flex-1 flex-col items-start justify-end px-6 pb-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="mb-12 max-w-4xl text-left">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">INSIGHTS & UPDATES</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl">
				<GlitchText text={m.blog_title()} scrambledStart={true} />
			</h1>
		</div>
	</div>
</section>

<!-- Description Section -->
<section class="border-b border-border bg-background">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-12 md:col-span-6 md:px-12 lg:px-16">
			<p class="font-body max-w-xl text-lg text-muted-foreground md:text-xl">{m.blog_subtitle()}</p>
		</div>
		<div class="col-span-12 grid grid-cols-3 gap-px bg-border md:col-span-6">
			<div class="bg-background px-6 py-6 md:px-8 lg:px-12">
				<span class="font-display text-lg font-bold text-primary md:text-xl">{data.posts.length}</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">ARTICLES</p>
			</div>
			<div class="bg-background px-6 py-6 md:px-8 lg:px-12">
				<span class="font-display text-lg font-bold text-primary md:text-xl">{data.categories.length - 1}</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">CATEGORIES</p>
			</div>
			<div class="bg-background px-6 py-6 md:px-8 lg:px-12">
				<span class="font-display text-lg font-bold text-primary md:text-xl">WEEKLY</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">UPDATES</p>
			</div>
		</div>
	</div>
</section>

<!-- Filter Bar -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Sort By Label - Fixed 2/12 width -->
		<div class="col-span-2 flex items-center bg-card px-6 py-3 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SORT BY</span>
		</div>
		<!-- Filter Options - 10/12 width -->
		<div class="col-span-10 flex overflow-x-auto">
			{#each data.categories as category (category)}
				<button
					type="button"
					onclick={() => selectedCategory = category}
					class="font-mono flex flex-1 items-center justify-center border-l border-border bg-background px-3 py-3 text-[10px] uppercase tracking-wider transition-colors {selectedCategory === category ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground'}"
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
<CTASection
	variant="split"
	label="STAY INFORMED"
	title="NEWSLETTER"
	description="Get notified when we publish new articles and insights."
>
	{#snippet children()}
		<div class="flex w-full flex-col gap-4 sm:flex-row">
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
	{/snippet}
</CTASection>
