<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ArrowLeft, ArrowRight, Calendar, Clock } from '@lucide/svelte';
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
		<div class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-8 lg:px-16 lg:py-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
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
		<div class="col-span-12 flex flex-col justify-between bg-card px-6 py-12 md:px-12 lg:col-span-4 lg:px-16 lg:py-16">
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
		<!-- Sticky Sidebar - Left -->
		<div class="col-span-12 border-b border-border bg-card lg:col-span-3 lg:border-b-0 lg:border-r lg:border-border">
			<div class="flex h-full flex-col">
				<div class="flex-1 px-6 py-8 md:px-12 lg:px-16 lg:py-12">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTENTS</span>
					<nav class="mt-4 flex flex-col gap-3">
						{#each post.sections as section, i (section.id)}
							<a 
								href="#{section.id}" 
								class="font-ui group flex items-start gap-3 text-xs tracking-wider text-muted-foreground transition-colors hover:text-primary"
							>
								<span class="font-mono text-[10px] text-primary/50 group-hover:text-primary">{String(i + 1).padStart(2, '0')}</span>
								<span class="border-b border-transparent group-hover:border-primary">{section.title}</span>
							</a>
						{/each}
					</nav>
				</div>
				<!-- Back link sticky at bottom of column -->
				<div class="sticky bottom-0 border-t border-border bg-card">
					<a href={localizeHref('/blog')} class="font-ui flex items-center gap-2 px-6 py-4 text-xs tracking-wider text-muted-foreground hover:bg-background hover:text-primary md:px-12 lg:px-16">
						<ArrowLeft class="h-3 w-3" />
						BACK TO BLOG
					</a>
				</div>
			</div>
		</div>

		<!-- Article Body - Right -->
		<article class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-9 lg:px-16 lg:py-16">
			<div class="max-w-3xl">
				{@html post.content}
			</div>
		</article>
	</div>
</section>

<!-- Next Article CTA - 75/25 ratio -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-8 md:px-12 lg:col-span-9 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTINUE READING</span>
			<h2 class="font-display mt-2 text-xl font-bold uppercase md:text-2xl">EXPLORE MORE ARTICLES</h2>
			<p class="font-body mt-2 text-sm text-muted-foreground">Check out our other articles and insights.</p>
		</div>
		<a 
			href={localizeHref('/blog')}
			class="col-span-12 flex items-center justify-center gap-2 bg-card px-6 py-8 transition-colors hover:bg-primary hover:text-primary-foreground md:px-12 lg:col-span-3 lg:px-16"
		>
			<span class="font-ui text-xs tracking-wider">VIEW ALL</span>
			<ArrowRight class="h-4 w-4" />
		</a>
	</div>
</section>
