<script lang="ts">
	// Components
	import Header from '$lib/components/common/header/header.svelte';
	import Footer from '$lib/components/common/footer/footer.svelte';

	// Plugins
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { onNavigate } from '$app/navigation';

	// Fonts
	import '@fontsource-variable/jetbrains-mono'; // Supports weights 100-800
	import '@fontsource-variable/hubot-sans'; // Supports weights 200-900
	import '@fontsource/chakra-petch';
	import '@fontsource/tourney/900.css';

	// Styles
	import '../app.css';

	// View Transition
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	// Imports
	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<Header />
	{@render children()}
	<Footer />
</ParaglideJS>