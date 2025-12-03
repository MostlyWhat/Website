<script lang="ts">
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import ComponentDocRenderer from '$lib/components/layout/ComponentDocRenderer.svelte';
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
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// COMPONENTS</span>
		<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">{doc.title.toUpperCase()}</h1>
		<p class="font-body mt-6 max-w-2xl text-muted-foreground">
			{doc.description}
		</p>
	</div>
</section>

<!-- Component Documentation with Live Examples -->
<section class="border-b border-border">
	<div class="px-6 py-8 md:px-12 lg:px-16">
		<ComponentDocRenderer content={doc.content} slug={doc.slug} class="max-w-4xl" />
	</div>
</section>
