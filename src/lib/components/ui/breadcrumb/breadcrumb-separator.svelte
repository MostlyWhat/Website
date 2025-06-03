<script lang="ts">
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import type { WithElementRef } from '$lib/utils';
	import type { HTMLLiAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLLiAttributes> = $props();
</script>

<li
	{...restProps}
	aria-hidden="true"
	bind:this={ref}
	class={cn('[&>svg]:size-3.5', className)}
	role="presentation"
>
	{#if children}
		{@render children?.()}
	{:else}
		<ChevronRight />
	{/if}
</li>
