<script lang="ts">
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

<li {...restProps} bind:this={ref} class={cn('inline-flex items-center gap-1.5', className)}>
	{@render children?.()}
</li>
