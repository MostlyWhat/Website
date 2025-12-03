<script lang="ts">
	/**
	 * Auth Layout
	 * 
	 * Layout for authentication pages using the main site header.
	 */
	import Header from '$lib/components/layout/Header.svelte';
	import { localizeHref } from '$lib/paraglide/runtime';

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col bg-background">
	<!-- Use the main marketing header -->
	<Header />

	<!-- Main content with top padding for fixed header -->
	<main class="flex-1 pt-[calc(4rem+1px)]">
		{@render children()}
	</main>

	<!-- Simple footer -->
	<footer class="border-t border-border bg-card">
		<div class="px-6 py-4 md:px-12 lg:px-16">
			<p class="font-mono text-center text-[10px] tracking-wider text-muted-foreground">
				&copy; {new Date().getFullYear()} MOSTLYWHAT SYSTEMS. ALL RIGHTS RESERVED.
			</p>
		</div>
	</footer>
</div>
