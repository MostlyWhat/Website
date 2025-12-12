<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import type { Component } from 'svelte';

	/**
	 * PageHeader - Standardized page header with title, actions, and breadcrumbs
	 * Uses Card component from ui for consistent styling
	 */
	interface Breadcrumb {
		label: string;
		href: string;
	}

	interface Action {
		label: string;
		onclick?: () => void;
		href?: string;
		variant?: 'default' | 'secondary' | 'outline' | 'ghost';
		icon?: Component;
	}

	interface Props {
		/** Page title */
		title: string;
		/** Optional description */
		description?: string;
		/** Optional breadcrumbs */
		breadcrumbs?: Breadcrumb[];
		/** Primary action */
		action?: Action;
		/** Secondary actions */
		actions?: Action[];
		/** Custom content slot */
		children?: any;
		/** Custom class */
		class?: string;
	}

	let {
		title,
		description,
		breadcrumbs,
		action,
		actions = [],
		children,
		class: className = ''
	}: Props = $props();
</script>

<div class="space-y-6 {className}">
	{#if breadcrumbs && breadcrumbs.length > 0}
		<nav class="flex items-center gap-2 text-sm">
			{#each breadcrumbs as crumb, i}
				{#if i > 0}
					<span class="text-muted-foreground">/</span>
				{/if}
				<a
					href={crumb.href}
					class="font-mono text-[10px] tracking-widest uppercase transition-colors {i === breadcrumbs.length - 1 ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}"
				>
					{crumb.label}
				</a>
			{/each}
		</nav>
	{/if}

	<div class="flex items-start justify-between gap-4">
		<div class="space-y-2">
			<h1 class="font-display text-3xl font-bold uppercase md:text-4xl">{title}</h1>
			{#if description}
				<p class="text-muted-foreground">{description}</p>
			{/if}
		</div>

		{#if action || actions.length > 0}
			<div class="flex items-center gap-2">
				{#if action}
					<Button
						href={action.href}
						onclick={action.onclick}
						variant={action.variant || 'default'}
					>
						{#if action.icon}
							<action.icon class="mr-2 h-4 w-4" />
						{/if}
						{action.label}
					</Button>
				{/if}
				{#each actions as secondaryAction}
					<Button
						href={secondaryAction.href}
						onclick={secondaryAction.onclick}
						variant={secondaryAction.variant || 'outline'}
					>
						{#if secondaryAction.icon}
							<secondaryAction.icon class="mr-2 h-4 w-4" />
						{/if}
						{secondaryAction.label}
					</Button>
				{/each}
			</div>
		{/if}
	</div>

	{#if children}
		<div>
			{@render children()}
		</div>
	{/if}
</div>

<Separator class="my-6" />
