<script lang="ts">
	import type { WithElementRef } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
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
	class={cn('rounded-lg border bg-card text-card-foreground shadow-xs', className)}
>
	{@render children?.()}
</div>
