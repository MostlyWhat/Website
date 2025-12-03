<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import MarkdownRenderer from '$lib/components/layout/MarkdownRenderer.svelte';
	import { loadDocPage } from '$lib/content';
	import { Settings, Code2, Search, Server } from '@lucide/svelte';

	// Load API overview doc
	const doc = loadDocPage('api', 'overview');
</script>

<svelte:head>
	<title>{doc?.title ?? 'API Reference'} — Documentation</title>
	<meta name="description" content={doc?.description ?? 'API documentation for MostlyWhat Systems.'} />
</svelte:head>

{#if doc}
	<!-- Header -->
	<section class="border-b border-border">
		<div class="px-6 py-12 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// API</span>
			<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">{doc.title.toUpperCase()}</h1>
			<p class="font-body mt-6 max-w-2xl text-muted-foreground">
				{doc.description}
			</p>
		</div>
		
		<!-- Quick Links -->
		<div class="border-t border-border px-6 py-8 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// EXPLORE</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase">ENDPOINTS</h2>
		</div>
		<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
			{#each [
				{ icon: Settings, title: 'Authentication', desc: 'API keys and security', href: '/docs/api/authentication' },
				{ icon: Code2, title: 'Contact API', desc: 'Form submission endpoint', href: '/docs/api/contact' },
				{ icon: Search, title: 'Search API', desc: 'Full-text search endpoint', href: '/docs/api/search' }
			] as item (item.title)}
				<a
					href={localizeHref(item.href)}
					class="col-span-12 flex items-center gap-4 bg-background px-6 py-6 text-left transition-colors hover:bg-card sm:col-span-6 md:px-12 lg:col-span-4 lg:px-16"
				>
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<item.icon class="h-5 w-5 text-primary" />
					</div>
					<div>
						<h3 class="font-ui text-sm font-semibold tracking-wider">{item.title}</h3>
						<p class="font-body mt-1 text-xs text-muted-foreground">{item.desc}</p>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- Content -->
	<section class="border-b border-border">
		<div class="px-6 py-8 md:px-12 lg:px-16">
			<MarkdownRenderer content={doc.content} class="max-w-4xl" />
		</div>
	</section>
{:else}
	<!-- Coming Soon -->
	<section class="border-b border-border">
		<div class="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ERROR.404</span>
			<h1 class="font-display mt-4 text-4xl font-bold uppercase">CONTENT NOT FOUND</h1>
			<p class="font-body mt-4 text-muted-foreground">This documentation page could not be loaded.</p>
		</div>
	</section>
{/if}
