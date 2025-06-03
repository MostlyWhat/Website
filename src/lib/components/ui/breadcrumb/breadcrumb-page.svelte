<script lang="ts">
	import type { WithElementRef } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	{...restProps}
	aria-current="page"
	aria-disabled="true"
	bind:this={ref}
	class={cn('font-normal text-foreground', className)}
	role="link"
>
	{@render children?.()}
</span>
