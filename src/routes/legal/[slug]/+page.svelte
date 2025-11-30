<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ArrowLeft } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	
	// Reactive doc that updates when data changes
	let doc = $derived(data.doc);
	
	// Scroll to top when document changes
	$effect(() => {
		doc.slug; // Track slug changes
		window.scrollTo({ top: 0, behavior: 'instant' });
	});
</script>

<svelte:head>
	<title>{doc.title} — {m.site_name()}</title>
	<meta name="description" content="{doc.title} for MostlyWhat Systems" />
</svelte:head>

<!-- Hero Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-8 lg:px-16 lg:py-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LEGAL</span>
			<h1 class="font-display mt-4 text-3xl font-black uppercase leading-[0.9] tracking-tight md:text-4xl lg:text-5xl">
				{doc.title}
			</h1>
		</div>
		<div class="col-span-12 flex items-center bg-card px-6 py-12 md:px-12 lg:col-span-4 lg:px-16 lg:py-16">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LAST UPDATED</span>
				<p class="font-display mt-1 text-sm font-bold md:text-base">{doc.lastUpdated.toUpperCase()}</p>
			</div>
		</div>
	</div>
</section>

<!-- Content Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12">
		<!-- Sticky Sidebar - Left -->
		<div class="col-span-12 border-b border-border bg-background lg:col-span-3 lg:border-b-0 lg:border-r lg:border-border">
			<div class="sticky top-24 px-6 py-8 md:px-12 lg:px-16 lg:py-12" use:scrollAnimate={{ animation: 'fade' }}>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTENTS</span>
				<nav class="mt-4 flex flex-col gap-3">
					{#each doc.sections as section, i (section.id)}
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
			<!-- Back link as full-width grid row -->
			<div class="border-t border-border">
				<a href={localizeHref('/legal')} class="font-ui flex items-center gap-2 px-6 py-4 text-xs tracking-wider text-muted-foreground hover:bg-card hover:text-primary md:px-12 lg:px-16">
					<ArrowLeft class="h-3 w-3" />
					BACK TO LEGAL
				</a>
			</div>
		</div>

		<!-- Main Content - Right -->
		<article class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-9 lg:px-16 lg:py-16" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="max-w-3xl">
				{@html doc.content}
			</div>
		</article>
	</div>
</section>

<!-- Related Documents -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex items-center justify-between bg-card p-6">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LEGAL DOCUMENTS</span>
		</div>
	</div>
	<div class="grid grid-cols-12 gap-px bg-border">
		<a 
			href={localizeHref('/legal/privacy')} 
			data-sveltekit-replacestate
			class="col-span-12 bg-background p-6 transition-colors hover:bg-card md:col-span-4 {doc.slug === 'privacy' ? 'border-l-2 border-l-primary' : ''}"
		>
			<h3 class="font-ui text-xs font-semibold tracking-wider">PRIVACY POLICY</h3>
			<p class="font-body mt-1 text-[11px] text-muted-foreground">How we handle your data</p>
		</a>
		<a 
			href={localizeHref('/legal/terms')} 
			data-sveltekit-replacestate
			class="col-span-12 bg-background p-6 transition-colors hover:bg-card md:col-span-4 {doc.slug === 'terms' ? 'border-l-2 border-l-primary' : ''}"
		>
			<h3 class="font-ui text-xs font-semibold tracking-wider">TERMS OF SERVICE</h3>
			<p class="font-body mt-1 text-[11px] text-muted-foreground">Service agreement terms</p>
		</a>
		<a 
			href={localizeHref('/legal/cookies')} 
			data-sveltekit-replacestate
			class="col-span-12 bg-background p-6 transition-colors hover:bg-card md:col-span-4 {doc.slug === 'cookies' ? 'border-l-2 border-l-primary' : ''}"
		>
			<h3 class="font-ui text-xs font-semibold tracking-wider">COOKIE POLICY</h3>
			<p class="font-body mt-1 text-[11px] text-muted-foreground">How we use cookies</p>
		</a>
	</div>
</section>
