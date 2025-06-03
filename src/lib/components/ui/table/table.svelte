<script lang="ts">
	import type { HTMLTableAttributes } from 'svelte/elements';
	import type { WithElementRef } from '$lib/utils';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLTableAttributes> = $props();
</script>

<div class="relative w-full overflow-auto">
	<table {...restProps} bind:this={ref} class={cn('w-full caption-bottom text-sm', className)}>
		{@render children?.()}
	</table>
</div>
