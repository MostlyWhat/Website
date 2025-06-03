<script lang="ts">
	import { cn } from '$lib/utils.js';
	import type { WithElementRef } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLLIElement>, HTMLLIElement> = $props();
</script>

<li
	{...restProps}
	bind:this={ref}
	class={cn('group/menu-item relative', className)}
	data-sidebar="menu-item"
>
	{@render children?.()}
</li>
