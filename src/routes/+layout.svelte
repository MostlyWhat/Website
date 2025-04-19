<script lang="ts">
	// Components
	import Header from '$lib/components/common/header/header.svelte';
	import Footer from '$lib/components/common/footer/footer.svelte';

	// Plugins
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';

	// Fonts
	import '@fontsource-variable/jetbrains-mono'; // Supports weights 100-800
	import '@fontsource-variable/plus-jakarta-sans'; // Supports weights 200-800

	// Styles
	import '../app.css';

	// Imports
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<Header />
	{@render children()}
	<Footer />
</ParaglideJS>
