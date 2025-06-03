<script lang="ts">
	import type { HTMLTdAttributes } from 'svelte/elements';
	import type { WithElementRef } from '$lib/utils';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLTdAttributes> = $props();
</script>

<td
	{...restProps}
	bind:this={ref}
	class={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
>
	{@render children?.()}
</td>
