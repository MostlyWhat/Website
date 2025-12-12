<script lang="ts">
	/**
	 * Root Layout
	 * 
	 * Minimal root layout that just passes through to children.
	 * Route groups handle their own layouts:
	 * - (marketing): Public pages with header/footer
	 * - (auth): Auth pages with minimal layout
	 * - (app): Customer portal with app layout
	 * - (admin): Admin dashboard with admin layout
	 */
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="theme-color" content="#000814" />
</svelte:head>

{@render children()}
