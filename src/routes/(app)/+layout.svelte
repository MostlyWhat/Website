<script lang="ts">
	import HeaderOld from '$lib/components/common/header/header.svelte';
	import Footer from '$lib/components/common/footer/footer.svelte';

	let { children } = $props();
</script>

<div class="flex flex-1 flex-col">
	<HeaderOld />
	<main class="flex flex-1 flex-col">
		{@render children()}
	</main>
	<Footer />
</div>