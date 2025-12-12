<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * GridContainer - 12-column grid with border separator
	 * The signature layout pattern used across the entire application.
	 * 
	 * Features:
	 * - 12-column grid system
	 * - gap-px for 1px borders
	 * - bg-border for separator effect
	 * - Optional top border
	 * 
	 * Usage:
	 * Children should be divs with col-span-* classes and bg-background/bg-card
	 */
	
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Whether to add top border */
		border?: boolean;
		/** Optional scroll animation */
		animate?: boolean;
		children: Snippet;
	}

	let { border = false, animate = false, children, class: className, ...rest }: Props = $props();
</script>

<div 
	class="grid grid-cols-12 gap-px bg-border {border ? 'border-t border-border' : ''} {className ?? ''}"
	{...rest}
>
	{@render children()}
</div>
