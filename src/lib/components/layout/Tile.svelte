<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/**
		 * Make tile interactive (adds hover effects)
		 */
		interactive?: boolean;
		/**
		 * Tile variant
		 */
		variant?: 'default' | 'outline' | 'ghost';
		/**
		 * Padding size
		 */
		padding?: 'sm' | 'md' | 'lg';
		/**
		 * Link href (makes entire tile clickable)
		 */
		href?: string;
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Tile content
		 */
		children: Snippet;
	}

	let {
		interactive = false,
		variant = 'default',
		padding = 'md',
		href,
		class: className = '',
		children
	}: Props = $props();

	const baseClasses = 'block transition-all duration-200';
	
	const variantClasses = {
		default: 'bg-card border border-border',
		outline: 'border border-border bg-transparent',
		ghost: 'bg-transparent'
	};

	const paddingClasses = {
		sm: 'p-3',
		md: 'p-4',
		lg: 'p-6'
	};

	const interactiveClasses = interactive || href
		? 'cursor-pointer hover:border-primary hover:bg-secondary/50'
		: '';

	const allClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${interactiveClasses} ${className}`;
</script>

{#if href}
	<a {href} class={allClasses}>
		{@render children()}
	</a>
{:else}
	<div class={allClasses}>
		{@render children()}
	</div>
{/if}
