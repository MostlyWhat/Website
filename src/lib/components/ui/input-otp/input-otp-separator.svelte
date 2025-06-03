<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { WithElementRef } from '$lib/utils';
	import Dot from '@lucide/svelte/icons/dot';

	let {
		ref = $bindable(null),
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div {...restProps} bind:this={ref} role="separator">
	{#if children}
		{@render children?.()}
	{:else}
		<Dot />
	{/if}
</div>
