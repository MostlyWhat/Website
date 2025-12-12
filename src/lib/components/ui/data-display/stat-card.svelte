<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Component } from 'svelte';

	/**
	 * StatCard - Display key metrics and statistics
	 * Standardized component using Card from ui
	 */
	interface Props {
		/** Stat title */
		title: string;
		/** Stat value (number or string) */
		value: string | number;
		/** Optional description */
		description?: string;
		/** Optional icon */
		icon?: Component;
		/** Optional trend indicator */
		trend?: {
			value: string;
			direction: 'up' | 'down' | 'neutral';
		};
		/** Custom class */
		class?: string;
	}

	let {
		title,
		value,
		description,
		icon: Icon,
		trend,
		class: className = ''
	}: Props = $props();

	const trendColorClasses = {
		up: 'text-green-600',
		down: 'text-red-600',
		neutral: 'text-muted-foreground'
	};
</script>

<Card.Root class={className}>
	<Card.Header class="flex flex-row items-center justify-between pb-2">
		<Card.Title class="text-sm font-medium text-muted-foreground">{title}</Card.Title>
		{#if Icon}
			<Icon class="h-4 w-4 text-muted-foreground" />
		{/if}
	</Card.Header>
	<Card.Content>
		<div class="text-2xl font-bold">{value}</div>
		{#if description}
			<p class="text-xs text-muted-foreground mt-1">{description}</p>
		{/if}
		{#if trend}
			<p class="text-xs mt-2 {trendColorClasses[trend.direction]}">
				{trend.value}
			</p>
		{/if}
	</Card.Content>
</Card.Root>
