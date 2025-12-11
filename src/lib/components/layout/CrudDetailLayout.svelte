<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ArrowLeft } from '@lucide/svelte';

	/**
	 * CrudDetailLayout - Standardized layout for viewing entity details
	 * 
	 * Features:
	 * - Flexible header area with custom content
	 * - Main content + Sidebar layout
	 * - Responsive stacking
	 * - Consistent spacing
	 * 
	 * @example
	 * <CrudDetailLayout
	 *   title="Ticket #1234"
	 *   backHref="/admin/tickets"
	 * >
	 *   {#snippet header()}
	 *     <div>Status badges, breadcrumbs, etc.</div>
	 *   {/snippet}
	 *   {#snippet main()}
	 *     <div>Ticket details...</div>
	 *   {/snippet}
	 *   {#snippet sidebar()}
	 *     <SidebarSection title="Metadata">...</SidebarSection>
	 *   {/snippet}
	 * </CrudDetailLayout>
	 */
	interface Props {
		/** Page title */
		title: string;
		/** Back button link */
		backHref: string;
		/** Back button label */
		backLabel?: string;
		/** Show sidebar (default: true) */
		showSidebar?: boolean;
		/** Custom header content (badges, breadcrumbs, etc.) */
		header?: Snippet;
		/** Main content area */
		children: Snippet;
		/** Sidebar content */
		sidebar?: Snippet;
		/** Custom class */
		class?: string;
	}

	let {
		title,
		backHref,
		backLabel,
		showSidebar = true,
		header,
		children,
		sidebar,
		class: className = ''
	}: Props = $props();

	const autoBackLabel = $derived(() => {
		if (backLabel) return backLabel;
		const parts = backHref.split('/').filter(Boolean);
		const lastPart = parts[parts.length - 1];
		// Handle dynamic segments like [id]
		if (lastPart.match(/^\d+$/) || lastPart.match(/^[a-f0-9-]{36}$/i)) {
			return 'Back';
		}
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
		
		{#if header}
			<div class="mt-4">
				{@render header()}
			</div>
		{/if}
	</header>

	<!-- Main Content + Sidebar Grid -->
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Main Content Area -->
		<div class="col-span-12 bg-background px-6 py-8 md:px-12 {showSidebar ? 'lg:col-span-8' : ''} lg:px-16">
			{@render children()}
		</div>

		<!-- Sidebar Area -->
		{#if showSidebar && sidebar}
			<div class="col-span-12 space-y-px bg-card lg:col-span-4">
				{@render sidebar()}
			</div>
		{/if}
	</div>
</div>
