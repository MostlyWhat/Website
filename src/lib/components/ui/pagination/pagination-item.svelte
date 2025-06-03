<script lang="ts">
	import type { HTMLLiAttributes } from 'svelte/elements';
	import type { WithElementRef } from '$lib/utils';

	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithElementRef<HTMLLiAttributes> = $props();
</script>

<li {...restProps} bind:this={ref}>
	{@render children?.()}
</li>
