<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import WideNavSection from '$lib/components/layout/WideNavSection.svelte';
	import { ArrowLeft, ArrowRight, FileText } from '@lucide/svelte';
	import { marked } from 'marked';

	let { data }: { data: PageData } = $props();

	const categoryLabels: Record<string, string> = {
		onboarding: 'ONBOARDING',
		troubleshooting: 'TROUBLESHOOTING',
		general: 'GENERAL',
		billing: 'BILLING'
	};

	// Configure marked to add IDs to headings
	const renderer = new marked.Renderer();
	renderer.heading = ({ text, depth }) => {
		const id = text
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-');
		return `<h${depth} id="${id}">${text}</h${depth}>`;
	};
	marked.use({ renderer });

	const renderedContent = $derived(marked(data.article.content));
</script>

<svelte:head>
	<title>{data.article.title} — {m.site_name()}</title>
	<meta name="description" content={data.article.summary} />
</svelte:head>

<!-- Article Header -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-8 lg:px-16 lg:py-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
			<div class="flex items-center gap-4 text-xs">
				<span class="font-mono uppercase text-primary">{categoryLabels[data.article.category] || data.article.category.toUpperCase()}</span>
			</div>
			<h1 class="font-display mt-4 text-3xl font-black uppercase leading-[0.95] tracking-tight md:text-4xl lg:text-5xl">
				{data.article.title}
			</h1>
			{#if data.article.summary}
				<p class="font-body mt-4 text-lg text-muted-foreground">{data.article.summary}</p>
			{/if}
		</div>
		<div class="col-span-12 flex flex-col justify-between bg-card px-6 py-12 md:px-12 lg:col-span-4 lg:px-16 lg:py-16">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CATEGORY</span>
				<p class="font-ui mt-1 text-sm font-semibold">{categoryLabels[data.article.category] || data.article.category.toUpperCase()}</p>
			</div>
			{#if data.relatedArticles.length > 0}
				<div class="mt-6">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">RELATED</span>
					<div class="mt-2 flex flex-wrap gap-2">
						{#each data.relatedArticles.slice(0, 2) as related (related.slug)}
							<a href={localizeHref(`/support/${related.slug}`)} class="font-mono border border-border px-2 py-1 text-[10px] uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary hover:text-primary">{related.title.split(' ').slice(0, 3).join(' ')}</a>
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
		<div class="col-span-12 border-b border-border bg-background lg:col-span-3 lg:border-b-0 lg:border-r lg:border-border">
			<div class="lg:sticky lg:top-24">
				<!-- On This Page -->
				{#if data.article.sections && data.article.sections.length > 0}
					<div class="px-6 py-8 md:px-12 lg:px-16 lg:py-12" use:scrollAnimate={{ animation: 'fade' }}>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ON THIS PAGE</span>
						<nav class="mt-4 flex flex-col gap-3">
							{#each data.article.sections as section, i (section.id)}
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
				{/if}

				<!-- Related Articles -->
				{#if data.relatedArticles.length > 0}
					<div class="border-t border-border px-6 py-8 md:px-12 lg:px-16 lg:py-8" use:scrollAnimate={{ animation: 'fade' }}>
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">RELATED ARTICLES</span>
						<div class="mt-4 space-y-3">
							{#each data.relatedArticles as related (related.slug)}
								<a
									href={localizeHref(`/support/${related.slug}`)}
									class="group flex items-start gap-2 text-xs"
								>
									<FileText class="mt-0.5 h-3 w-3 flex-shrink-0 text-primary" />
									<span class="font-ui tracking-wider text-muted-foreground transition-colors group-hover:text-primary">{related.title}</span>
								</a>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Need Help CTA -->
				<div class="border-t border-border px-6 py-6 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
					<div class="border border-primary/20 bg-primary/5 p-4">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NEED HELP?</span>
						<p class="font-body mt-2 text-xs text-muted-foreground">
							Can't find what you need?
						</p>
						<a
							href={localizeHref('/support/submit-ticket')}
							class="font-mono mt-3 inline-flex items-center gap-2 text-[10px] tracking-wider text-primary hover:underline"
						>
							SUBMIT TICKET
							<ArrowRight class="h-3 w-3" />
						</a>
					</div>
				</div>

				<!-- Back link at bottom -->
				<div class="border-t border-border">
					<a href={localizeHref('/support')} class="font-ui flex items-center gap-2 px-6 py-4 text-xs tracking-wider text-muted-foreground hover:bg-card hover:text-primary md:px-12 lg:px-16">
						<ArrowLeft class="h-3 w-3" />
						BACK TO SUPPORT
					</a>
				</div>
			</div>
		</div>

		<!-- Article Body - Right -->
		<article class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-9 lg:px-16 lg:py-16">
			<div class="prose-custom max-w-3xl">
				{@html renderedContent}
			</div>
		</article>
	</div>
</section>

<!-- More Articles CTA -->
<WideNavSection
	label="SUPPORT CENTER"
	title="BROWSE ALL ARTICLES"
	description="Explore more help articles and documentation."
	buttonText="VIEW ALL ARTICLES"
	buttonHref="/support/articles"
/>
