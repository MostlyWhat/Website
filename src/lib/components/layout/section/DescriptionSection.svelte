<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Stat {
		value: string;
		label: string;
	}

	interface Props {
		/** Main description text */
		description: string;
		/** Stats to display in grid (2 or 3 recommended) */
		stats?: Stat[];
		/** Variant: 'default' (50/50), 'wide' (66/33 description), 'stats-only' (33/66 stats) */
		variant?: 'default' | 'wide' | 'stats-only';
		/** Custom right side content slot */
		children?: Snippet;
	}

	let {
		description,
		stats = [],
		variant = 'default',
		children
	}: Props = $props();

	// Calculate column spans based on variant
	const leftCols = variant === 'wide' ? 'md:col-span-8' : variant === 'stats-only' ? 'md:col-span-4' : 'md:col-span-6';
	const rightCols = variant === 'wide' ? 'md:col-span-4' : variant === 'stats-only' ? 'md:col-span-8' : 'md:col-span-6';

	// Calculate stats grid columns
	const statsCols = stats.length === 2 ? 'grid-cols-2' : stats.length === 3 ? 'grid-cols-3' : stats.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2';
</script>

<section class="border-b border-border bg-background">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex items-center bg-background px-6 py-12 {leftCols} md:px-12 lg:px-16">
			<p class="font-body max-w-xl text-lg text-muted-foreground md:text-xl">{description}</p>
		</div>
		{#if children}
			<div class="col-span-12 {rightCols}">
				{@render children()}
			</div>
		{:else if stats.length > 0}
			<div class="col-span-12 grid {statsCols} items-center gap-px bg-border {rightCols}">
				{#each stats as { value, label } (label)}
					<div class="flex h-full flex-col justify-center bg-background px-6 py-6 md:px-8 lg:px-12">
						<span class="font-display text-lg font-bold text-primary md:text-xl">{value}</span>
						<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</section>
