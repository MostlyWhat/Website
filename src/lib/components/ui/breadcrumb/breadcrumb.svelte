<script lang="ts">
	import type { WithElementRef } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		ref = $bindable(),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<nav {...restProps} aria-label="breadcrumb" bind:this={ref} class={className}>
	{@render children?.()}
</nav>
