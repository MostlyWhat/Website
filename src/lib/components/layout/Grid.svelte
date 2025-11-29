<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		/**
		 * Number of columns at large screens
		 */
		cols?: 1 | 2 | 3 | 4;
		/**
		 * Gap between grid items
		 */
		gap?: 'sm' | 'md' | 'lg';
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Grid content
		 */
		children: Snippet;
	}

	let {
		cols = 3,
		gap = 'md',
		class: className = '',
		children
	}: Props = $props();

	const gapClasses = {
		sm: 'gap-2',
		md: 'gap-4',
		lg: 'gap-6'
	};

	const colClasses = {
		1: 'grid-cols-1',
		2: 'grid-cols-1 sm:grid-cols-2',
		3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
		4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
	};
</script>

<div class="grid {colClasses[cols]} {gapClasses[gap]} {className}">
	{@render children()}
</div>
