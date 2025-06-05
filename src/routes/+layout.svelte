<script lang="ts">
	// Styles
	import '../app.css';

	// Modules
	import { onNavigate } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner';
	import Metadata from '$lib/components/common/utilities/metadata.svelte';
	import Header from '$lib/components/common/header/header.svelte';
	import Footer from '$lib/components/common/footer/footer.svelte';
	import Announcement from '$lib/components/common/utilities/announcement.svelte';

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
<Announcement />
<Header />
<main class="min-h-dvh">
	{@render children?.()}
</main>
<Footer />
