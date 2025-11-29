<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowLeft, ArrowRight, Calendar, Clock, Tag } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { post } = data;

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{post.title} — {m.site_name()}</title>
	<meta name="description" content={post.excerpt} />
</svelte:head>

<!-- Article Header -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background p-6 md:p-8 lg:col-span-8 lg:p-12" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
			<div class="flex items-center gap-4 text-xs">
				<span class="font-mono uppercase text-primary">{post.category}</span>
				<span class="font-mono flex items-center gap-1 text-muted-foreground">
					<Calendar class="h-3 w-3" />
					{formatDate(post.date)}
				</span>
				<span class="font-mono flex items-center gap-1 text-muted-foreground">
					<Clock class="h-3 w-3" />
					{post.readTime}
				</span>
			</div>
			<h1 class="font-display mt-4 text-3xl font-black uppercase leading-[0.95] tracking-tight md:text-4xl lg:text-5xl">
				{post.title}
			</h1>
			<p class="font-body mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
		</div>
		<div class="col-span-12 flex flex-col justify-between bg-card p-6 md:p-8 lg:col-span-4 lg:p-12">
			{#if post.author}
				<div>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">AUTHOR</span>
					<p class="font-ui mt-1 text-sm font-semibold">{post.author}</p>
				</div>
			{/if}
			{#if post.tags && post.tags.length > 0}
				<div class="mt-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">TAGS</span>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each post.tags as tag (tag)}
							<span class="font-mono border border-border px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground">{tag}</span>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	</div>
</section>

<!-- Article Content -->
<section class="border-b border-border">
	<div class="grid grid-cols-12">
		<!-- Sticky Sidebar -->
		<div class="col-span-12 border-b border-border bg-background lg:col-span-3 lg:border-b-0 lg:border-r">
			<div class="sticky top-24 p-6 md:p-8 lg:p-12">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NAVIGATION</span>
				<nav class="mt-4">
					<a href={localizeHref('/blog')} class="font-ui flex items-center gap-2 text-xs tracking-wider text-muted-foreground hover:text-primary">
						<ArrowLeft class="h-3 w-3" />
						BACK TO BLOG
					</a>
				</nav>
			</div>
		</div>
		
		<!-- Article Body -->
		<article class="col-span-12 bg-background p-6 md:p-8 lg:col-span-9 lg:p-12">
			<div class="prose prose-invert prose-sm max-w-3xl prose-headings:font-display prose-headings:font-bold prose-headings:uppercase prose-headings:tracking-wider prose-p:font-body prose-p:text-muted-foreground prose-a:text-primary prose-code:font-mono prose-code:text-sm">
				{@html post.content}
			</div>
		</article>
	</div>
</section>

<!-- Next Article CTA -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex flex-col justify-center bg-background p-6 md:p-8 lg:col-span-6 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTINUE READING</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">EXPLORE MORE</h2>
			<p class="font-body mt-4 text-muted-foreground">Check out our other articles and insights.</p>
		</div>
		<div class="col-span-12 flex items-center justify-center bg-card p-6 md:p-8 lg:col-span-6 lg:p-12">
			<Button href={localizeHref('/blog')} class="font-ui uppercase tracking-wider">
				VIEW ALL ARTICLES
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</div>
	</div>
</section>
