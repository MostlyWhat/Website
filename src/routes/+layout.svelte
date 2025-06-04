<script lang="ts">
	// Modules
	import { Toaster } from '$lib/components/ui/sonner';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Metadata from '$lib/components/common/utilities/metadata.svelte';

	// Fonts
	import '@fontsource-variable/jetbrains-mono'; // Supports weights 100-800
	import '@fontsource-variable/hubot-sans'; // Supports weights 200-900
	import '@fontsource/chakra-petch';
	import '@fontsource/tourney/900.css';

	// Styles
	import '../app.css';

	let { children } = $props();
</script>

<Metadata />
<Toaster />
<Tooltip.Provider>
	<div class="bg-background relative flex min-h-dvh flex-col">
		{@render children?.()}
	</div>
</Tooltip.Provider>