<script lang="ts">
	import Header from '$lib/components/common/header/header.svelte';
	import Footer from '$lib/components/common/footer/footer.svelte';

	let { children } = $props();
</script>

<Header />
{@render children()}
<Footer />
