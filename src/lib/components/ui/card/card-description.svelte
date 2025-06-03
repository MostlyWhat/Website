<script lang="ts">
	import type { WithElementRef } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLParagraphElement>> = $props();
</script>

<p {...restProps} bind:this={ref} class={cn('text-sm text-muted-foreground', className)}>
	{@render children?.()}
</p>
