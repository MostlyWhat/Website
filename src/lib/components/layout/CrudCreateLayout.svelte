<script lang="ts">
	import type { Snippet, Component } from 'svelte';
	import { ArrowLeft, AlertCircle, CheckCircle } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	/**
	 * CrudCreateLayout - Standardized layout for creating new entities
	 * 
	 * Features:
	 * - Consistent header with back navigation
	 * - Main content area (8 cols) + Optional sidebar (4 cols)
	 * - Automatic error/success message display
	 * - Responsive mobile stacking
	 * - Standard spacing and typography
	 * 
	 * @example
	 * <CrudCreateLayout
	 *   title="Create Ticket"
	 *   description="Create a new support ticket"
	 *   backHref="/admin/tickets"
	 * >
	 *   {#snippet main()}
	 *     <form>...</form>
	 *   {/snippet}
	 *   {#snippet sidebar()}
	 *     <SidebarSection title="Actions">...</SidebarSection>
	 *   {/snippet}
	 * </CrudCreateLayout>
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
		<a
			href={backHref}
			class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			<span class="font-mono text-[10px] tracking-widest uppercase">{autoBackLabel()}</span>
		</a>
		<h1 class="font-display mt-6 text-2xl font-bold uppercase md:text-3xl">{title}</h1>
		{#if description}
			<p class="font-body mt-2 text-sm text-muted-foreground">
				{description}
			</p>
		{/if}
	</header>

	<!-- Error/Success Messages -->
	{#if errorMessage}
		<div class="border-b border-red-500/20 bg-red-500/5 px-6 py-4 md:px-12 lg:px-16">
			<div class="flex items-center gap-3">
				<AlertCircle class="h-5 w-5 text-red-500" />
				<p class="font-body text-sm text-red-500">{errorMessage}</p>
			</div>
		</div>
	{/if}
	
	{#if successMessage}
		<div class="border-b border-green-500/20 bg-green-500/5 px-6 py-4 md:px-12 lg:px-16">
			<div class="flex items-center gap-3">
				<CheckCircle class="h-5 w-5 text-green-500" />
				<p class="font-body text-sm text-green-500">{successMessage}</p>
			</div>
		</div>
	{/if}

	<!-- Main Content + Sidebar Grid -->
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Main Content Area -->
		<div class="col-span-12 space-y-6 bg-background px-6 py-8 md:px-12 {showSidebar ? 'lg:col-span-8' : ''} lg:px-16">
			{@render children()}
		</div>

		<!-- Sidebar Area -->
		{#if showSidebar && sidebar}
			<div class="col-span-12 space-y-6 bg-card px-6 py-8 lg:col-span-4">
				{@render sidebar()}
			</div>
		{/if}
	</div>
</div>
