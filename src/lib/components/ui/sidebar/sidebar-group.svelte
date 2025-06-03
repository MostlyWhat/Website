<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '$lib/utils';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<div
	{...restProps}
	bind:this={ref}
	class={cn('relative flex w-full min-w-0 flex-col p-2', className)}
	data-sidebar="group"
>
	{@render children?.()}
</div>
