<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * FormLayout - Standardized form layout with main content + sidebar
	 * Used across admin and app pages for consistent form presentations.
	 * 
	 * Features:
	 * - 12-column grid with border separator
	 * - 8-column main content area
	 * - 4-column sidebar area
	 * - Responsive stacking on mobile
	 */
	
	interface Props {
		/** Optional form element props (action, method, etc.) */
		action?: string;
		method?: 'GET' | 'POST';
		/** Main content slot */
		children: Snippet;
		/** Sidebar content slot */
		sidebar?: Snippet;
	}

	let { action, method = 'POST', children, sidebar }: Props = $props();
</script>

{#if action}
	<form {action} {method} class="grid grid-cols-12 gap-px bg-border">
		<!-- Main Content -->
		<div class="col-span-12 space-y-6 bg-background px-6 py-8 md:px-12 lg:col-span-8">
			{@render children()}
		</div>

		<!-- Sidebar -->
		{#if sidebar}
			<div class="col-span-12 bg-card lg:col-span-4">
				{@render sidebar()}
			</div>
		{/if}
	</form>
{:else}
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Main Content -->
		<div class="col-span-12 space-y-6 bg-background px-6 py-8 md:px-12 lg:col-span-8">
			{@render children()}
		</div>

		<!-- Sidebar -->
		{#if sidebar}
			<div class="col-span-12 bg-card lg:col-span-4">
				{@render sidebar()}
			</div>
		{/if}
	</div>
{/if}
