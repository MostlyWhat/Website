<script lang="ts">
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import type { Component } from 'svelte';

	interface Capability {
		icon: Component;
		title: string;
		desc: string;
	}

	interface Props {
		/** Section label (e.g., "02 — WHY CHOOSE US") */
		label?: string;
		/** Main heading */
		title?: string;
		/** Description text */
		description?: string;
		/** Array of capabilities to display */
		capabilities: Capability[];
		/** Number of columns on large screens (3 or 4) */
		columns?: 3 | 4;
	}

	let {
		label = '02 — WHY CHOOSE US',
		title = 'BUILD WITH CONFIDENCE',
		description = 'We combine technical excellence with strategic thinking to deliver results that matter.',
		capabilities,
		columns = 4
	}: Props = $props();

	const columnClass = columns === 3 ? 'lg:col-span-4' : 'lg:col-span-3';
</script>

<section class="border-b border-border">
	<div class="px-6 py-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
		<div class="max-w-2xl">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{label}</span>
			<h2 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">{title}</h2>
			<p class="font-body mt-6 text-lg text-muted-foreground">{description}</p>
		</div>
	</div>

	<div class="grid grid-cols-12 gap-px border-t border-border bg-border" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each capabilities as { icon: Icon, title: capTitle, desc } (capTitle)}
			<div class="col-span-12 flex flex-col bg-background px-6 py-10 sm:col-span-6 md:px-12 {columnClass} lg:px-16">
				<div class="mb-6 flex h-12 w-12 items-center justify-center border border-border bg-card">
					<Icon class="h-5 w-5 text-primary" />
				</div>
				<h3 class="font-ui text-base font-semibold uppercase tracking-wider">{capTitle}</h3>
				<p class="font-body mt-3 flex-1 text-sm text-muted-foreground">{desc}</p>
			</div>
		{/each}
	</div>
</section>
