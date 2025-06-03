<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '$lib/utils';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	{...restProps}
	bind:this={ref}
	class={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}
>
	{@render children?.()}
</div>
