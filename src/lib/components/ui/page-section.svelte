<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	
	interface Props {
		/** Section title */
		title?: string;
		/** Section description */
		description?: string;
		/** Whether to add card styling */
		card?: boolean;
		/** Action buttons slot */
		actions?: Snippet;
		/** Content slot */
		children: Snippet;
		/** Additional CSS classes */
		class?: string;
	}
	
	let {
		title,
		description,
		card = false,
		actions,
		children,
		class: className = ''
	}: Props = $props();
</script>

<div class={cn(
	'mb-6',
	card && 'border border-border bg-card p-6',
	className
)}>
	{#if title || actions}
		<div class="mb-4 flex items-start justify-between gap-4">
			<div class="flex-1">
				{#if title}
					<h2 class="font-ui text-xl font-semibold tracking-tight">
						{title}
					</h2>
				{/if}
				
				{#if description}
					<p class="font-body mt-1 text-sm text-muted-foreground">
						{description}
					</p>
				{/if}
			</div>
			
			{#if actions}
				<div class="flex items-center gap-2">
					{@render actions()}
				</div>
			{/if}
		</div>
	{/if}
	
	{@render children()}
</div>
