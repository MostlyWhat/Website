<script lang="ts">
	import { scrollAnimate } from '$lib/actions/scroll-animate';

	interface Props {
		/** Section number (e.g., "01") */
		number?: string;
		/** Section label (e.g., "SERVICES", "FAQ") */
		label: string;
		/** Section title */
		title: string;
		/** Optional description */
		description?: string;
		/** Whether to animate on scroll (default: true) */
		animate?: boolean;
	}

	let { 
		number, 
		label, 
		title, 
		description,
		animate = true 
	}: Props = $props();

	const displayLabel = number ? `${number} — ${label}` : label;
</script>

{#if animate}
	<div 
		class="px-6 py-12 md:px-12 lg:px-16" 
		use:scrollAnimate={{ animation: 'fade' }}
	>
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{displayLabel}</span>
		<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">{title}</h2>
		{#if description}
			<p class="font-body mt-4 text-muted-foreground">{description}</p>
		{/if}
	</div>
{:else}
	<div class="px-6 py-12 md:px-12 lg:px-16">
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{displayLabel}</span>
		<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">{title}</h2>
		{#if description}
			<p class="font-body mt-4 text-muted-foreground">{description}</p>
		{/if}
	</div>
{/if}
