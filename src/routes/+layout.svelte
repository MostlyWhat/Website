<script lang="ts">
	// Styles
	import '../app.css';

	// Modules
	import { onNavigate } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner';
	import Metadata from '$lib/components/common/utilities/metadata.svelte';

	// Fonts
	import '@fontsource-variable/jetbrains-mono'; // Supports weights 100-800
	import '@fontsource-variable/hubot-sans'; // Supports weights 200-900
	import '@fontsource/chakra-petch';
	import '@fontsource/tourney/900.css';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let { children } = $props();
</script>

<Metadata />
<Toaster />
<div class="min-h-dvh">
    {@render children?.()}
</div>
