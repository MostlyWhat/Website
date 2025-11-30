<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';

	interface Props {
		/** Small label above title */
		label?: string;
		/** Main heading */
		title: string;
		/** Description text */
		description?: string;
		/** Button text */
		buttonText: string;
		/** Button link (will be localized) */
		buttonHref: string;
		/** Arrow direction - 'left' for back links, 'right' for forward links */
		arrowDirection?: 'left' | 'right';
	}

	let { 
		label, 
		title, 
		description, 
		buttonText, 
		buttonHref,
		arrowDirection = 'left'
	}: Props = $props();
</script>

<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-8 md:px-12 lg:col-span-9 lg:px-16">
			{#if label}
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{label}</span>
			{/if}
			<h2 class="font-display {label ? 'mt-2' : ''} text-xl font-bold uppercase md:text-2xl">{title}</h2>
			{#if description}
				<p class="font-body mt-2 text-sm text-muted-foreground">{description}</p>
			{/if}
		</div>
		<a 
			href={localizeHref(buttonHref)}
			class="col-span-12 flex items-center justify-center gap-2 bg-card px-6 py-8 transition-colors hover:bg-background hover:text-primary md:px-12 lg:col-span-3 lg:px-16"
		>
			{#if arrowDirection === 'left'}
				<ArrowLeft class="h-3 w-3" />
			{/if}
			<span class="font-ui text-xs tracking-wider">{buttonText}</span>
			{#if arrowDirection === 'right'}
				<ArrowRight class="h-3 w-3" />
			{/if}
		</a>
	</div>
</section>
