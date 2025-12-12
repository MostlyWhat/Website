<script lang="ts">
	import MarkdownRenderer from '$lib/components/layout/MarkdownRenderer.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const doc = $derived(data.doc);
</script>

<svelte:head>
	<title>{doc.title} — Documentation</title>
	<meta name="description" content={doc.description} />
</svelte:head>

<!-- Header -->
<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// FOUNDATION</span>
		<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">{doc.title.toUpperCase()}</h1>
		<p class="font-body mt-6 max-w-2xl text-muted-foreground">
			{doc.description}
		</p>
	</div>
</section>

<!-- Content -->
<section class="border-b border-border">
	<div class="px-6 py-8 md:px-12 lg:px-16">
		<MarkdownRenderer content={doc.content} class="max-w-4xl" />
	</div>
</section>
