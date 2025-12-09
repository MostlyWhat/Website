/**
 * Mobile Responsive Container Component
 * 
 * Provides a consistent, mobile-friendly container for pages
 */

<script lang="ts">
	interface Props {
		class?: string;
		padding?: 'none' | 'sm' | 'md' | 'lg';
		maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
	}

	let { class: className = '', padding = 'md', maxWidth = '2xl', children }: Props & { children: any } = $props();

	const paddingClasses = {
		none: '',
		sm: 'p-2 sm:p-4',
		md: 'p-4 sm:p-6 lg:p-8',
		lg: 'p-6 sm:p-8 lg:p-12'
	};

	const maxWidthClasses = {
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-lg',
		xl: 'max-w-xl',
		'2xl': 'max-w-2xl',
		full: 'max-w-full'
	};
</script>

<div class="responsive-container {paddingClasses[padding]} {maxWidthClasses[maxWidth]} {className}">
	{@render children()}
</div>

<style>
	.responsive-container {
		width: 100%;
		margin-left: auto;
		margin-right: auto;
	}
</style>
