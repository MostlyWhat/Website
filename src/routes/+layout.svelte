<script lang="ts">
	import './layout.css';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import CookieConsent from '$lib/components/layout/CookieConsent.svelte';
	
	let { children } = $props();

	// View Transitions API - skip for same-page navigation (hash links)
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		
		// Skip view transition if navigating within same page (hash links)
		const currentPath = page.url.pathname;
		const targetPath = navigation.to?.url.pathname;
		if (currentPath === targetPath) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#000814" />
</svelte:head>

<div class="flex min-h-screen flex-col">
	<Header />
	<main class="vt-main flex-1">
		{@render children()}
	</main>
	<Footer />
	<CookieConsent />
</div>
