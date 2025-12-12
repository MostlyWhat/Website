<script lang="ts">
	import type { Component } from 'svelte';
	import { FileQuestion } from '@lucide/svelte';

	interface Props {
		/** Icon component from lucide-svelte */
		icon?: Component;
		/** Icon size in pixels */
		iconSize?: number;
		/** Title text */
		title: string;
		/** Description text */
		description?: string;
		/** Action button text */
		actionText?: string;
		/** Action button click handler */
		onAction?: () => void;
		/** Custom class for container */
		class?: string;
	}

	let {
		icon: Icon = FileQuestion,
		iconSize = 48,
		title,
		description,
		actionText,
		onAction,
		class: className = ''
	}: Props = $props();
</script>

<div class="flex flex-col items-center justify-center py-12 text-center {className}">
	<div class="mb-4 rounded-full bg-muted p-4">
		<Icon size={iconSize} class="text-muted-foreground" />
	</div>
	
	<h3 class="font-ui mb-2 text-lg font-semibold tracking-wider">{title}</h3>
	
	{#if description}
		<p class="font-body mb-6 max-w-md text-sm text-muted-foreground">
			{description}
		</p>
	{/if}
	
	{#if actionText && onAction}
		<button
			type="button"
			onclick={onAction}
			class="inline-flex items-center gap-2 border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
		>
			{actionText}
		</button>
	{/if}
</div>
