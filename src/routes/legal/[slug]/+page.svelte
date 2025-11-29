<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ArrowLeft } from '@lucide/svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const { doc } = data;
</script>

<svelte:head>
	<title>{doc.title} — {m.site_name()}</title>
	<meta name="description" content="{doc.title} for MostlyWhat Systems" />
</svelte:head>

<!-- Hero Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background p-6 md:p-8 lg:col-span-8 lg:p-12" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LEGAL</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-5xl lg:text-6xl">
				{doc.title}
			</h1>
		</div>
		<div class="col-span-12 flex items-center bg-card p-6 md:p-8 lg:col-span-4 lg:p-12">
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
		<!-- Sticky Sidebar -->
		<div class="col-span-12 border-b border-border bg-background lg:col-span-3 lg:border-b-0 lg:border-r">
			<div class="sticky top-16 p-6 md:p-8 lg:p-12" use:scrollAnimate={{ animation: 'fade' }}>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTENTS</span>
				<nav class="mt-4 space-y-2">
					{#each doc.sections as section (section.id)}
						<a href="#{section.id}" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">
							{section.number} — {section.title}
						</a>
					{/each}
				</nav>
				<div class="mt-6 border-t border-border pt-4">
					<a href={localizeHref('/legal')} class="font-ui flex items-center gap-2 text-xs tracking-wider text-muted-foreground hover:text-primary">
						<ArrowLeft class="h-3 w-3" />
						BACK TO LEGAL
					</a>
				</div>
			</div>
		</div>

		<!-- Main Content -->
		<article class="col-span-12 bg-background p-6 md:p-8 lg:col-span-9 lg:p-12" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="max-w-3xl space-y-8">
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
			class="col-span-12 bg-background p-6 transition-colors hover:bg-card md:col-span-4 {doc.slug === 'privacy' ? 'border-l-2 border-l-primary' : ''}"
		>
			<h3 class="font-ui text-xs font-semibold tracking-wider">PRIVACY POLICY</h3>
			<p class="font-body mt-1 text-[11px] text-muted-foreground">How we handle your data</p>
		</a>
		<a 
			href={localizeHref('/legal/terms')} 
			class="col-span-12 bg-background p-6 transition-colors hover:bg-card md:col-span-4 {doc.slug === 'terms' ? 'border-l-2 border-l-primary' : ''}"
		>
			<h3 class="font-ui text-xs font-semibold tracking-wider">TERMS OF SERVICE</h3>
			<p class="font-body mt-1 text-[11px] text-muted-foreground">Service agreement terms</p>
		</a>
		<a 
			href={localizeHref('/legal/cookies')} 
			class="col-span-12 bg-background p-6 transition-colors hover:bg-card md:col-span-4 {doc.slug === 'cookies' ? 'border-l-2 border-l-primary' : ''}"
		>
			<h3 class="font-ui text-xs font-semibold tracking-wider">COOKIE POLICY</h3>
			<p class="font-body mt-1 text-[11px] text-muted-foreground">How we use cookies</p>
		</a>
	</div>
</section>
