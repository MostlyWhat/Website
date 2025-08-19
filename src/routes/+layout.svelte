<script lang="ts">
	import '../app.css';
	import '@fontsource-variable/tourney'; // 200-900
	import '@fontsource-variable/hubot-sans'; // 200-900
	import '@fontsource/chakra-petch'; // 200-900
	import '@fontsource-variable/jetbrains-mono'; // 100-800
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
