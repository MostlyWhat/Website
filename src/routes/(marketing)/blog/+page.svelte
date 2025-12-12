<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { HeroSection, DescriptionSection, CTASection } from '$lib/components/layout';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import { ArrowRight, ChevronRight } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let selectedCategory = $state('All');
	let posts = $state<Array<{
		slug: string;
		title: string;
		category: string;
		excerpt: string | null;
		publishedAt: Date | null;
		readTime: string | null;
	}>>([]);
	let categories = $state<string[]>(['All']);

	// Load streamed data
	const streamedData = $derived(data.streamed.blogData);

	$effect(() => {
		streamedData.then(result => {
			posts = result.posts;
			categories = result.categories;
		}).catch(err => {
			console.error('Failed to load blog posts:', err);
		});
	});

	const filteredPosts = $derived(
		selectedCategory === 'All' 
			? posts 
			: posts.filter(p => p.category === selectedCategory)
	);

	function formatDate(dateStr: string | Date | null): string {
		if (!dateStr) return '';
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

<HeroSection label="// INSIGHTS.FEED" title={m.blog_title()} />

<!-- Description Section -->
{#await streamedData}
	<DescriptionSection
		description={m.blog_subtitle()}
		stats={[
			{ value: '...', label: 'ARTICLES' },
			{ value: '...', label: 'CATEGORIES' },
			{ value: 'WEEKLY', label: 'UPDATES' }
		]}
	/>
{:then result}
	<DescriptionSection
		description={m.blog_subtitle()}
		stats={[
			{ value: String(result.posts.length), label: 'ARTICLES' },
			{ value: String(result.categories.length - 1), label: 'CATEGORIES' },
			{ value: 'WEEKLY', label: 'UPDATES' }
		]}
	/>
{/await}

<!-- Filter Bar -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Sort By Label - Fixed 2/12 width -->
		<div class="col-span-2 flex items-center bg-card px-6 py-3 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SORT BY</span>
		</div>
		<!-- Filter Options - 10/12 width -->
		<div class="col-span-10 flex overflow-x-auto">
			{#await streamedData}
				<div class="flex flex-1 items-center justify-center border-l border-border bg-background px-3 py-3">
					<Skeleton class="h-4 w-20" />
				</div>
			{:then}
				{#each categories as category (category)}
					<button
						type="button"
						onclick={() => selectedCategory = category}
						class="font-mono flex flex-1 items-center justify-center border-l border-border bg-background px-3 py-3 text-[10px] uppercase tracking-wider transition-colors {selectedCategory === category ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-card hover:text-foreground'}"
					>
						{category}
					</button>
				{/each}
			{/await}
		</div>
	</div>
</section>

<!-- Posts Grid -->
<section class="min-h-dvh border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		{#await streamedData}
			<!-- Skeleton loading state -->
			{#each Array(6) as _, i}
				<div class="col-span-12 flex flex-col bg-background md:col-span-6 lg:col-span-4">
					<div class="aspect-video border-b border-border bg-card">
						<Skeleton class="h-full w-full" />
					</div>
					<div class="flex flex-1 flex-col px-6 py-6 md:px-12 lg:px-16">
						<div class="flex items-center gap-3">
							<Skeleton class="h-3 w-16" />
							<Skeleton class="h-3 w-20" />
							<Skeleton class="h-3 w-14" />
						</div>
						<Skeleton class="mt-3 h-5 w-3/4" />
						<Skeleton class="mt-2 h-4 w-full" />
						<Skeleton class="mt-1 h-4 w-2/3" />
						<Skeleton class="mt-4 h-3 w-24" />
					</div>
				</div>
			{/each}
		{:then}
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
							<span class="font-mono text-muted-foreground">{formatDate(post.publishedAt)}</span>
							<span class="font-mono text-muted-foreground">{post.readTime ?? '5 min read'}</span>
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
		{:catch error}
			<div class="col-span-12 flex min-h-[40vh] items-center justify-center bg-background px-6 py-12 md:px-12 lg:px-16">
				<p class="font-body text-center text-destructive">Failed to load blog posts.</p>
			</div>
		{/await}
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
