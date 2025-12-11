<script lang="ts">
	import type { Component } from 'svelte';
	import { TrendingUp, TrendingDown, Minus } from '@lucide/svelte';

	interface Props {
		/** Card title/label */
		label: string;
		/** Main value to display */
		value: string | number;
		/** Icon component from lucide-svelte */
		icon?: Component;
		/** Trend direction */
		trend?: 'up' | 'down' | 'neutral';
		/** Trend percentage or text */
		trendValue?: string;
		/** Description text */
		description?: string;
		/** Custom class for card */
		class?: string;
		/** Click handler */
		onclick?: () => void;
	}

	let {
		label,
		value,
		icon: Icon,
		trend,
		trendValue,
		description,
		class: className = '',
		onclick
	}: Props = $props();

	const TrendIcon = $derived(
		trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus
	);

	const trendColor = $derived(
		trend === 'up'
			? 'text-green-500'
			: trend === 'down'
				? 'text-red-500'
				: 'text-muted-foreground'
	);

	const isClickable = !!onclick;
</script>

{#if isClickable}
	<button
		type="button"
		class="w-full border border-border bg-card p-6 text-left transition-colors hover:bg-muted/50 {className}"
		{onclick}
	>
		<div class="flex items-start justify-between">
			<div class="flex-1">
				<p class="font-mono text-[10px] tracking-widest text-muted-foreground">
					{label.toUpperCase()}
				</p>
				<p class="font-display mt-2 text-3xl font-bold">
					{value}
				</p>
				{#if description}
					<p class="font-body mt-1 text-xs text-muted-foreground">
						{description}
					</p>
				{/if}
			</div>
			{#if Icon}
				<div class="rounded-full bg-primary/10 p-3">
					<Icon class="h-5 w-5 text-primary" />
				</div>
			{/if}
		</div>

		{#if trend && trendValue}
			<div class="mt-4 flex items-center gap-1 text-sm">
				<TrendIcon class="h-4 w-4 {trendColor}" />
				<span class="{trendColor} font-medium">{trendValue}</span>
				<span class="text-muted-foreground">vs last period</span>
			</div>
		{/if}
	</button>
{:else}
	<div class="border border-border bg-card p-6 transition-colors {className}">
		<div class="flex items-start justify-between">
			<div class="flex-1">
				<p class="font-mono text-[10px] tracking-widest text-muted-foreground">
					{label.toUpperCase()}
				</p>
				<p class="font-display mt-2 text-3xl font-bold">
					{value}
				</p>
				{#if description}
					<p class="font-body mt-1 text-xs text-muted-foreground">
						{description}
					</p>
				{/if}
			</div>
			{#if Icon}
				<div class="rounded-full bg-primary/10 p-3">
					<Icon class="h-5 w-5 text-primary" />
				</div>
			{/if}
		</div>

		{#if trend && trendValue}
			<div class="mt-4 flex items-center gap-1 text-sm">
				<TrendIcon class="h-4 w-4 {trendColor}" />
				<span class="{trendColor} font-medium">{trendValue}</span>
				<span class="text-muted-foreground">vs last period</span>
			</div>
		{/if}
	</div>
{/if}
