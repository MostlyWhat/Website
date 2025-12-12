<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	
	interface Props {
		/** Page title */
		title: string;
		/** Optional subtitle/description */
		description?: string;
		/** Action buttons slot */
		actions?: Snippet;
		/** Breadcrumb slot */
		breadcrumb?: Snippet;
		/** Additional CSS classes */
		class?: string;
	}
	
	let {
		title,
		description,
		actions,
		breadcrumb,
		class: className = ''
	}: Props = $props();
</script>

<div class={cn('mb-8', className)}>
	{#if breadcrumb}
		<div class="mb-4">
			{@render breadcrumb()}
		</div>
	{/if}
	
	<div class="flex items-start justify-between gap-4">
		<div class="flex-1">
			<h1 class="font-ui text-3xl font-bold tracking-tight">
				{title}
			</h1>
			
			{#if description}
				<p class="font-body mt-2 text-muted-foreground">
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
</div>
