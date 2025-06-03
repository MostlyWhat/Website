<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { WithElementRef } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLUListElement>> = $props();
</script>

<ul
	{...restProps}
	bind:this={ref}
	class={cn(
		'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
		'group-data-[collapsible=icon]:hidden',
		className
	)}
	data-sidebar="menu-sub"
>
	{@render children?.()}
</ul>
