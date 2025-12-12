<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLHeadingElement>> = $props();
</script>

<h3
	bind:this={ref}
	data-slot="dialog-heading"
	class={cn("text-lg font-display font-semibold tracking-tight text-foreground", className)}
	{...restProps}
>
	{@render children?.()}
</h3>
