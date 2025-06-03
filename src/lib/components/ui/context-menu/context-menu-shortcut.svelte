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
	bind:this={ref}
	class={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
>
	{@render children?.()}
</span>
