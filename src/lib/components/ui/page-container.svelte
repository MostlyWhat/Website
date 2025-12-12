<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	
	interface Props {
		/** Title for the container */
		title?: string;
		/** Description below title */
		description?: string;
		/** Content slot */
		children: Snippet;
		/** Maximum width constraint */
		maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
		/** Whether to center content */
		centered?: boolean;
		/** Additional CSS classes */
		class?: string;
	}
	
	let {
		title,
		description,
		children,
		maxWidth = '2xl',
		centered = false,
		class: className = ''
	}: Props = $props();
	
	const maxWidthClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		'2xl': 'max-w-2xl',
		full: 'max-w-full'
	};
</script>

<div class={cn(
	'container py-8',
	maxWidthClasses[maxWidth],
	centered && 'mx-auto',
	className
)}>
	{#if title || description}
		<div class="mb-6">
			{#if title}
				<h1 class="font-ui text-2xl font-bold tracking-tight">
					{title}
				</h1>
			{/if}
			
			{#if description}
				<p class="font-body mt-2 text-muted-foreground">
					{description}
				</p>
			{/if}
		</div>
	{/if}
	
	{@render children()}
</div>
