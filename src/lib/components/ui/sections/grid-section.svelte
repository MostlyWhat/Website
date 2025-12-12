<script lang="ts">
	/**
	 * GridSection - Standardized grid layout section
	 * Common pattern for displaying cards/items in a grid
	 */
	interface Props {
		/** Number of columns (responsive) */
		cols?: '1' | '2' | '3' | '4';
		/** Gap size */
		gap?: 'sm' | 'md' | 'lg';
		/** Content */
		children: any;
		/** Custom class */
		class?: string;
	}

	let {
		cols = '3',
		gap = 'md',
		children,
		class: className = ''
	}: Props = $props();

	const colsClasses = {
		'1': 'grid-cols-1',
		'2': 'grid-cols-1 md:grid-cols-2',
		'3': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
		'4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
	};

	const gapClasses = {
		sm: 'gap-4',
		md: 'gap-6',
		lg: 'gap-8'
	};
</script>

<div class="grid {colsClasses[cols]} {gapClasses[gap]} {className}">
	{@render children()}
</div>
