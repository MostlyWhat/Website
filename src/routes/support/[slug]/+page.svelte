<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, FileText, Clock, Tag } from '@lucide/svelte';
	import { marked } from 'marked';

	let { data }: { data: PageData } = $props();

	const categoryLabels: Record<string, string> = {
		onboarding: 'ONBOARDING',
		troubleshooting: 'TROUBLESHOOTING',
		general: 'GENERAL',
		billing: 'BILLING'
	};

	// Configure marked for rendering
	const renderedContent = $derived(marked(data.article.content));
</script>

<svelte:head>
	<title>{data.article.title} — {m.site_name()}</title>
	<meta name="description" content={data.article.summary} />
</svelte:head>

<!-- Article Header -->
<section class="border-b border-border bg-card">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="mx-auto max-w-3xl">
			<!-- Breadcrumb -->
			<nav class="font-mono mb-6 flex items-center gap-2 text-[10px] tracking-widest text-muted-foreground">
				<a href={localizeHref('/support')} class="hover:text-primary">SUPPORT</a>
				<ChevronRight class="h-3 w-3" />
				<span class="text-foreground">{categoryLabels[data.article.category] || data.article.category.toUpperCase()}</span>
			</nav>

			<h1 class="font-display text-3xl font-bold uppercase md:text-4xl">{data.article.title}</h1>
			
			<div class="mt-4 flex flex-wrap items-center gap-4">
				<span class="font-mono inline-flex items-center gap-1 text-[10px] tracking-widest text-muted-foreground">
					<Tag class="h-3 w-3" />
					{categoryLabels[data.article.category] || data.article.category.toUpperCase()}
				</span>
			</div>

			{#if data.article.summary}
				<p class="font-body mt-6 text-muted-foreground">{data.article.summary}</p>
			{/if}
		</div>
	</div>
</section>

<!-- Article Content -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Main Content -->
		<article class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-8 lg:px-16">
			<div class="prose-custom mx-auto max-w-3xl lg:mx-0">
				{@html renderedContent}
			</div>
		</article>

		<!-- Sidebar -->
		<aside class="col-span-12 bg-card px-6 py-12 md:px-12 lg:col-span-4 lg:px-8" use:scrollAnimate={{ animation: 'fade' }}>
			<!-- Related Articles -->
			{#if data.relatedArticles.length > 0}
				<div class="mb-8">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">RELATED ARTICLES</span>
					<div class="mt-4 space-y-3">
						{#each data.relatedArticles as related}
							<a
								href={localizeHref(`/support/${related.slug}`)}
								class="flex items-start gap-3 border border-border bg-background p-3 transition-colors hover:border-primary"
							>
								<FileText class="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
								<div>
									<p class="font-ui text-xs font-semibold tracking-wider">{related.title}</p>
									<p class="font-body mt-1 text-[11px] text-muted-foreground line-clamp-2">{related.summary}</p>
								</div>
							</a>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Need Help -->
			<div class="border border-primary/20 bg-primary/5 p-4">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NEED MORE HELP?</span>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					Can't find what you're looking for? Submit a support ticket.
				</p>
				<a
					href={localizeHref('/support#ticket-form')}
					class="font-mono mt-4 inline-flex items-center gap-2 text-[10px] tracking-wider text-primary hover:underline"
				>
					SUBMIT TICKET
					<ArrowRight class="h-3 w-3" />
				</a>
			</div>
		</aside>
	</div>
</section>

<!-- Navigation -->
<section class="border-b border-border">
	<div class="grid grid-cols-2 divide-x divide-border">
		<!-- Previous -->
		<div class="bg-background">
			{#if data.prevArticle}
				<a
					href={localizeHref(`/support/${data.prevArticle.slug}`)}
					class="flex h-full items-center gap-4 px-6 py-6 transition-colors hover:bg-card md:px-12 lg:px-16"
				>
					<ChevronLeft class="h-5 w-5 text-muted-foreground" />
					<div class="flex-1">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PREVIOUS</span>
						<p class="font-ui mt-1 text-xs font-semibold tracking-wider">{data.prevArticle.title}</p>
					</div>
				</a>
			{:else}
				<a
					href={localizeHref('/support')}
					class="flex h-full items-center gap-4 px-6 py-6 transition-colors hover:bg-card md:px-12 lg:px-16"
				>
					<ArrowLeft class="h-5 w-5 text-muted-foreground" />
					<div class="flex-1">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">BACK TO</span>
						<p class="font-ui mt-1 text-xs font-semibold tracking-wider">SUPPORT CENTER</p>
					</div>
				</a>
			{/if}
		</div>

		<!-- Next -->
		<div class="bg-background">
			{#if data.nextArticle}
				<a
					href={localizeHref(`/support/${data.nextArticle.slug}`)}
					class="flex h-full items-center justify-end gap-4 px-6 py-6 text-right transition-colors hover:bg-card md:px-12 lg:px-16"
				>
					<div class="flex-1">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NEXT</span>
						<p class="font-ui mt-1 text-xs font-semibold tracking-wider">{data.nextArticle.title}</p>
					</div>
					<ChevronRight class="h-5 w-5 text-muted-foreground" />
				</a>
			{:else}
				<a
					href={localizeHref('/search')}
					class="flex h-full items-center justify-end gap-4 px-6 py-6 text-right transition-colors hover:bg-card md:px-12 lg:px-16"
				>
					<div class="flex-1">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">BROWSE ALL</span>
						<p class="font-ui mt-1 text-xs font-semibold tracking-wider">SEARCH ARTICLES</p>
					</div>
					<ArrowRight class="h-5 w-5 text-muted-foreground" />
				</a>
			{/if}
		</div>
	</div>
</section>
