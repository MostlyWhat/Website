<script lang="ts">
	/**
	 * Help Article Page
	 * 
	 * Displays a single support article with markdown content.
	 */
	import { localizeHref } from '$lib/paraglide/runtime';
	import { renderStyledMarkdown } from '$lib/utils/markdown';
	import { ArrowLeft, ThumbsUp, ThumbsDown, Clock, FileText, ArrowRight, Tag } from '@lucide/svelte';

	let { data } = $props();

	// Format date
	function formatDate(dateStr: string | Date | null): string {
		if (!dateStr) return 'Unknown';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { 
			year: 'numeric', 
			month: 'long', 
			day: 'numeric' 
		});
	}

	// Render markdown content
	const renderedContent = $derived(
		data.article?.content 
			? renderStyledMarkdown(data.article.content, { stripTitle: false, prefixH2: false })
			: ''
	);

	// Feedback state
	let feedbackGiven = $state<'helpful' | 'not-helpful' | null>(null);

	async function submitFeedback(helpful: boolean) {
		if (feedbackGiven) return;
		
		// In a real app, this would call an API endpoint
		feedbackGiven = helpful ? 'helpful' : 'not-helpful';
	}
</script>

<svelte:head>
	<title>{data.article?.title ?? 'Article'} | Help Center | MostlyWhat Systems</title>
</svelte:head>

<!-- Article Container -->
<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Back Navigation -->
	<section class="border-b border-border bg-background px-6 py-4 md:px-12 lg:px-16">
		<a 
			href={localizeHref('/app/help')} 
			class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			<span class="font-mono text-xs tracking-wider">BACK TO HELP CENTER</span>
		</a>
	</section>

	{#if data.article}
		<!-- Article Header -->
		<section class="border-b border-border bg-background px-6 py-12 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
				// {data.article.category.replace(/-/g, ' ')}
			</span>
			<h1 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl lg:text-4xl">
				{data.article.title}
			</h1>
			{#if data.article.excerpt}
				<p class="font-body mt-4 max-w-2xl text-muted-foreground">
					{data.article.excerpt}
				</p>
			{/if}
			<div class="mt-6 flex flex-wrap items-center gap-4 text-muted-foreground">
				<div class="flex items-center gap-2">
					<Clock class="h-3 w-3" />
					<span class="font-mono text-[10px] tracking-wider">
						{formatDate(data.article.publishedAt ?? data.article.createdAt)}
					</span>
				</div>
				{#if data.article.authorName}
					<span class="font-mono text-[10px] tracking-wider">
						BY {data.article.authorName.toUpperCase()}
					</span>
				{/if}
			</div>
		</section>

		<!-- Article Content -->
		<section class="border-b border-border">
			<div class="grid grid-cols-12 gap-px bg-border">
				<!-- Main Content -->
				<div class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-8 lg:px-16">
					<article class="prose prose-neutral dark:prose-invert max-w-none">
						{@html renderedContent}
					</article>

					<!-- Tags -->
					{#if data.article.tags && data.article.tags.length > 0}
						<div class="mt-12 border-t border-border pt-8">
							<div class="flex flex-wrap items-center gap-2">
								<Tag class="h-4 w-4 text-muted-foreground" />
								{#each data.article.tags as tag}
									<span class="font-mono text-[10px] tracking-wider text-muted-foreground uppercase border border-border px-2 py-1">
										{tag}
									</span>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Feedback Section -->
					<div class="mt-12 border-t border-border pt-8">
						<p class="font-ui text-sm">Was this article helpful?</p>
						<div class="mt-4 flex items-center gap-4">
							<button
								onclick={() => submitFeedback(true)}
								disabled={feedbackGiven !== null}
								class="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-50 {feedbackGiven === 'helpful' ? 'border-green-500 bg-green-500/10 text-green-500' : ''}"
							>
								<ThumbsUp class="h-4 w-4" />
								<span class="font-mono text-xs tracking-wider">YES</span>
							</button>
							<button
								onclick={() => submitFeedback(false)}
								disabled={feedbackGiven !== null}
								class="inline-flex items-center gap-2 border border-border px-4 py-2 text-sm transition-colors hover:bg-card disabled:cursor-not-allowed disabled:opacity-50 {feedbackGiven === 'not-helpful' ? 'border-red-500 bg-red-500/10 text-red-500' : ''}"
							>
								<ThumbsDown class="h-4 w-4" />
								<span class="font-mono text-xs tracking-wider">NO</span>
							</button>
						</div>
						{#if feedbackGiven}
							<p class="font-body mt-4 text-sm text-muted-foreground">
								Thanks for your feedback!
							</p>
						{/if}
					</div>
				</div>

				<!-- Sidebar -->
				<div class="col-span-12 bg-card lg:col-span-4">
					<!-- Related Articles -->
					{#if data.relatedArticles && data.relatedArticles.length > 0}
						<div class="border-b border-border px-6 py-4 md:px-8">
							<span class="font-mono text-[10px] tracking-widest text-muted-foreground">RELATED ARTICLES</span>
						</div>
						<div class="px-6 py-6 md:px-8">
							<div class="space-y-4">
								{#each data.relatedArticles as related}
									<a
										href={localizeHref(`/app/help/${related.slug}`)}
										class="group block border-b border-border pb-4 last:border-0 last:pb-0"
									>
										<h4 class="font-ui text-sm font-medium transition-colors group-hover:text-primary">{related.title}</h4>
										{#if related.excerpt}
											<p class="font-body mt-1 text-xs text-muted-foreground line-clamp-2">{related.excerpt}</p>
										{/if}
									</a>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Need More Help -->
					<div class="border-t border-border px-6 py-6 md:px-8">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NEED MORE HELP?</span>
						<div class="mt-4 space-y-3">
							<a
								href={localizeHref('/app/tickets/new')}
								class="group flex items-center gap-2 text-sm transition-colors hover:text-primary"
							>
								<ArrowRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
								<span class="font-ui">Submit a support ticket</span>
							</a>
							<a
								href={localizeHref('/contact')}
								class="group flex items-center gap-2 text-sm transition-colors hover:text-primary"
							>
								<ArrowRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
								<span class="font-ui">Contact us</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</section>
	{:else}
		<!-- Article Not Found -->
		<section class="px-6 py-24 md:px-12 lg:px-16">
			<div class="flex flex-col items-center justify-center text-center">
				<div class="flex h-16 w-16 items-center justify-center border border-border bg-card">
					<FileText class="h-8 w-8 text-muted-foreground" />
				</div>
				<h2 class="font-display mt-6 text-lg font-bold uppercase">Article Not Found</h2>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					The article you're looking for doesn't exist or has been removed.
				</p>
				<a
					href={localizeHref('/app/help')}
					class="mt-6 inline-flex items-center gap-2 border border-border px-4 py-2 text-sm transition-colors hover:bg-card"
				>
					<ArrowLeft class="h-4 w-4" />
					<span class="font-mono text-xs tracking-wider">BACK TO HELP CENTER</span>
				</a>
			</div>
		</section>
	{/if}
</div>
