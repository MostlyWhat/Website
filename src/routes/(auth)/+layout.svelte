<script lang="ts">
	/**
	 * Auth Layout
	 * 
	 * Layout for authentication pages using the main site header.
	 * Full screen height with no scroll.
	 */
	import Header from '$lib/components/layout/Header.svelte';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { children } = $props();
</script>

<div class="flex h-screen flex-col overflow-hidden bg-background">
	<!-- Use the main marketing header -->
	<Header />

	<!-- Main content with top padding for fixed header -->
	<main class="flex-1 overflow-hidden pt-[calc(4rem+1px)]">
		{@render children()}
	</main>
</div>
