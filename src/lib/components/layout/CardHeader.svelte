<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	/**
	 * CardHeader - Standardized card/section header with border bottom
	 * Used in dialogs, cards, and content sections for consistent headers.
	 * 
	 * Features:
	 * - Border bottom separator
	 * - Consistent padding
	 * - Optional mono font styling
	 */
	
	interface Props extends HTMLAttributes<HTMLDivElement> {
		/** Header text */
		title: string;
		/** Optional subtitle/description */
		subtitle?: string;
		/** Whether to use mono font for title */
		mono?: boolean;
	}

	let { title, subtitle, mono = false, class: className, ...rest }: Props = $props();
</script>

<div 
	class="border-b border-border px-6 py-4 {className ?? ''}"
	{...rest}
>
	<div class="flex items-center justify-between">
		<div>
			<h3 class="{mono ? 'font-mono text-[10px] tracking-widest text-muted-foreground' : 'font-ui text-sm font-semibold'}">
				{mono ? title.toUpperCase() : title}
			</h3>
			{#if subtitle}
				<p class="font-body mt-1 text-xs text-muted-foreground">{subtitle}</p>
			{/if}
		</div>
	</div>
</div>
