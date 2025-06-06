<script lang="ts">
	import { cn, type WithElementRef } from '$lib/utils.js';
	import type { HTMLAttributes } from 'svelte/elements';

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
	class={cn('flex flex-col-reverse sm:flex-row sm:justify-end', className)}
	data-slot="alert-dialog-footer"
>
	{@render children?.()}
</div>
