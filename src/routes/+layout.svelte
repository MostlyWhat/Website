<script lang="ts">
	import './layout.css';
	import { beforeNavigate, afterNavigate, onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import CookieConsent from '$lib/components/layout/CookieConsent.svelte';
	import { setNavigating, getRandomDelay } from '$lib/stores/navigation.svelte';
	
	let { children } = $props();

	// Check if navigation involves docs routes (for reduced animations)
	function isDocsNavigation(currentPath: string, targetPath?: string): boolean {
		return currentPath.startsWith('/docs') || (targetPath?.startsWith('/docs') ?? false);
	}

	// Track navigation state globally for TransmissionLoader
	beforeNavigate((navigation) => {
		// Only show loader for actual page changes, not hash links
		const currentPath = page.url.pathname;
		const targetPath = navigation.to?.url.pathname;
		if (currentPath !== targetPath) {
			setNavigating(true);
		}
	});

	afterNavigate(() => {
		// Random delay (400-800ms) for more realistic transition effect
		const delay = getRandomDelay(400, 800);
		setTimeout(() => {
			setNavigating(false);
		}, delay);
	});

	// View Transitions API - skip for same-page navigation (hash links)
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		
		// Skip view transition if navigating within same page (hash links)
		const currentPath = page.url.pathname;
		const targetPath = navigation.to?.url.pathname;
		if (currentPath === targetPath) return;

		// Add class for reduced animations in docs
		const isDocsRoute = isDocsNavigation(currentPath, targetPath);
		if (isDocsRoute) {
			document.documentElement.classList.add('docs-transition');
		}

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
				// Remove class after transition
				document.documentElement.classList.remove('docs-transition');
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
