<script lang="ts">
	import type { Component } from 'svelte';
	import { Button } from '$lib/components/ui/button';
	import { ChevronRight } from '@lucide/svelte';

	/**
	 * PageHeader - Standardized header for list pages
	 * 
	 * Features:
	 * - Title and description
	 * - Optional breadcrumbs
	 * - Optional action button (primary CTA)
	 * - Optional back button
	 * - Consistent spacing and typography
	 * 
	 * @example
	 * <PageHeader
	 *   title="Tickets"
	 *   description="Manage support tickets"
	 *   action={{ label: "New Ticket", href: "/admin/tickets/new" }}
	 *   breadcrumbs={[
	 *     { label: "Home", href: "/" },
	 *     { label: "Admin", href: "/admin" }
	 *   ]}
	 * />
	 */
	interface Breadcrumb {
		label: string;
		href: string;
	}

	interface Action {
		label: string;
		href?: string;
		onclick?: () => void;
		variant?: 'default' | 'secondary' | 'outline';
		icon?: Component;
	}

	interface BackButton {
		href: string;
		label?: string;
	}

	interface Props {
		/** Page title */
		title: string;
		/** Optional description */
		description?: string;
		/** Breadcrumb navigation */
		breadcrumbs?: Breadcrumb[];
		/** Primary action button */
		action?: Action;
		/** Back button */
		backButton?: BackButton;
		/** Custom class */
		class?: string;
	}

	let {
		title,
		description,
		breadcrumbs,
		action,
		backButton,
		class: className = ''
	}: Props = $props();
</script>

<header class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16 {className}">
	<!-- Breadcrumbs -->
	{#if breadcrumbs && breadcrumbs.length > 0}
		<nav class="mb-4 flex items-center gap-2 text-sm">
			{#each breadcrumbs as crumb, i}
				<a
					href={crumb.href}
					class="font-mono text-[10px] tracking-widest text-muted-foreground transition-colors hover:text-foreground uppercase"
				>
					{crumb.label}
				</a>
				{#if i < breadcrumbs.length - 1}
					<ChevronRight class="h-3 w-3 text-muted-foreground" />
				{/if}
			{/each}
		</nav>
	{/if}

	<!-- Back Button -->
	{#if backButton}
		<a
			href={backButton.href}
			class="group mb-4 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
		>
			<svg
				class="h-4 w-4 transition-transform group-hover:-translate-x-1"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
			<span class="font-mono text-[10px] tracking-widest uppercase">
				{backButton.label || 'Back'}
			</span>
		</a>
	{/if}

	<!-- Title and Action -->
	<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
		<div>
			<h1 class="font-display text-2xl font-bold uppercase md:text-3xl">{title}</h1>
			{#if description}
				<p class="font-body mt-2 text-sm text-muted-foreground">
					{description}
				</p>
			{/if}
		</div>

		{#if action}
			{#if action.href}
				<Button
					href={action.href}
					variant={action.variant || 'default'}
					class="w-full md:w-auto"
				>
					{#if action.icon}
						{@const Icon = action.icon}
						<Icon class="mr-2 h-4 w-4" />
					{/if}
					{action.label}
				</Button>
			{:else if action.onclick}
				<Button
					onclick={action.onclick}
					variant={action.variant || 'default'}
					class="w-full md:w-auto"
				>
					{#if action.icon}
						{@const Icon = action.icon}
						<Icon class="mr-2 h-4 w-4" />
					{/if}
					{action.label}
				</Button>
			{/if}
		{/if}
	</div>
</header>
