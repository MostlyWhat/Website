<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { WithElementRef } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	import { getEmblaContext } from './context.js';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();

	const emblaCtx = getEmblaContext('<Carousel.Content/>');
</script>

<!-- svelte-ignore event_directive_deprecated -->
<div
	class="overflow-hidden"
	on:emblaInit={emblaCtx.onInit}
	use:emblaCarouselSvelte={{
		options: {
			container: '[data-embla-container]',
			slides: '[data-embla-slide]',
			...emblaCtx.options,
			axis: emblaCtx.orientation === 'horizontal' ? 'x' : 'y'
		},
		plugins: emblaCtx.plugins
	}}
>
	<div
		{...restProps}
		bind:this={ref}
		class={cn(
			'flex',
			emblaCtx.orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
			className
		)}
		data-embla-container=""
	>
		{@render children?.()}
	</div>
</div>
