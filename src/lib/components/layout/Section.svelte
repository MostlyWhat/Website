<script lang="ts">
	import { scrollAnimate, type AnimationType } from '$lib/actions/scroll-animate';
	import type { Snippet } from 'svelte';

	interface Props {
		/**
		 * Section ID for anchor links
		 */
		id?: string;
		/**
		 * Container width: 'narrow' (768px), 'default' (1200px), 'wide' (1440px), 'full'
		 */
		container?: 'narrow' | 'default' | 'wide' | 'full';
		/**
		 * Vertical padding size
		 */
		padding?: 'sm' | 'md' | 'lg' | 'xl';
		/**
		 * Background style
		 */
		background?: 'default' | 'card' | 'gradient' | 'none';
		/**
		 * Animation type for scroll reveal
		 */
		animate?: AnimationType | false;
		/**
		 * Additional CSS classes
		 */
		class?: string;
		/**
		 * Section content
		 */
		children: Snippet;
	}

	let {
		id,
		container = 'default',
		padding = 'lg',
		background = 'default',
		animate = 'fade',
		class: className = '',
		children
	}: Props = $props();

	const containerClasses = {
		narrow: 'max-w-3xl',
		default: 'max-w-7xl',
		wide: 'max-w-[1440px]',
		full: 'max-w-none'
	};

	const paddingClasses = {
		sm: 'py-8',
		md: 'py-12',
		lg: 'py-16 md:py-24',
		xl: 'py-24 md:py-32'
	};

	const backgroundClasses = {
		default: '',
		card: 'bg-card',
		gradient: 'bg-gradient-to-b from-background to-card',
		none: ''
	};
</script>

<section
	{id}
	class="{paddingClasses[padding]} {backgroundClasses[background]} {className}"
	use:scrollAnimate={animate ? { animation: animate } : undefined}
>
	<div class="{containerClasses[container]} mx-auto px-4">
		{@render children()}
	</div>
</section>
