<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ArrowLeft, AlertCircle, CheckCircle } from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { InfoCard } from '$lib/components/ui/data-display';
	import { Breadcrumbs } from '$lib/components/ui/navigation';

	/**
	 * CreatePageLayout - Standardized layout for creating new entities
	 * 
	 * Features:
	 * - Consistent header with back navigation
	 * - Main content area (8 cols) + Optional sidebar (4 cols)
	 * - Automatic error/success message display
	 * - Responsive mobile stacking
	 * - Standard spacing and typography
	 * - Uses ui components for consistency
	 * 
	 * @example
	 * <CreatePageLayout
	 *   title="Create Ticket"
	 *   description="Create a new support ticket"
	 *   backHref="/admin/tickets"
	 * >
	 *   {#snippet main()}
	 *     <form>...</form>
	 *   {/snippet}
	 *   {#snippet sidebar()}
	 *     <Card.Root>...</Card.Root>
	 *   {/snippet}
	 * </CreatePageLayout>
	 */
	interface Props {
		/** Page title */
		title: string;
		/** Optional description below title */
		description?: string;
		/** Back button link */
		backHref: string;
		/** Back button label (default: auto-generated from href) */
		backLabel?: string;
		/** Breadcrumbs for navigation */
		breadcrumbs?: Array<{ label: string; href: string }>;
		/** Show sidebar column (default: true) */
		showSidebar?: boolean;
		/** Error message to display */
		errorMessage?: string;
		/** Success message to display */
		successMessage?: string;
		/** Main content area */
		children: Snippet;
		/** Sidebar content (optional) */
		sidebar?: Snippet;
		/** Custom header class */
		class?: string;
	}

	let {
		title,
		description,
		backHref,
		backLabel,
		breadcrumbs,
		showSidebar = true,
		errorMessage,
		successMessage,
		children,
		sidebar,
		class: className = ''
	}: Props = $props();

	// Auto-generate back label from href if not provided
	const autoBackLabel = $derived(() => {
		if (backLabel) return backLabel;
		const parts = backHref.split('/').filter(Boolean);
		const lastPart = parts[parts.length - 1];
		return `Back to ${lastPart.charAt(0).toUpperCase() + lastPart.slice(1)}`;
	});
</script>

<div class="min-h-[calc(100dvh-4rem)] {className}">
	<!-- Header Section -->
	<header class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<!-- Breadcrumbs or Back Button -->
		{#if breadcrumbs}
			<Breadcrumbs items={breadcrumbs} showBackButton class="mb-4" />
		{:else}
			<Button
				href={backHref}
				variant="ghost"
				size="sm"
				class="mb-4 gap-2"
			>
				<ArrowLeft class="h-4 w-4" />
				{autoBackLabel()}
			</Button>
		{/if}

		<div class="space-y-2">
			<h1 class="font-display text-3xl font-bold uppercase md:text-4xl">{title}</h1>
			{#if description}
				<p class="text-muted-foreground">{description}</p>
			{/if}
		</div>
	</header>

	<!-- Main Content Grid -->
	<div class="container mx-auto px-6 py-8 md:px-12 lg:px-16">
		<!-- Messages -->
		{#if errorMessage}
			<InfoCard
				variant="error"
				title="Error"
				description={errorMessage}
				class="mb-6"
			/>
		{/if}
		{#if successMessage}
			<InfoCard
				variant="success"
				title="Success"
				description={successMessage}
				class="mb-6"
			/>
		{/if}

		<div class="grid gap-6 lg:grid-cols-12">
			<!-- Main Content -->
			<div class="lg:col-span-{showSidebar ? '8' : '12'}">
				{@render children()}
			</div>

			<!-- Sidebar -->
			{#if showSidebar && sidebar}
				<aside class="lg:col-span-4">
					{@render sidebar()}
				</aside>
			{/if}
		</div>
	</div>
</div>
