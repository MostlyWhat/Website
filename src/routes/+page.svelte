<script lang="ts">
	// Components
	import HeroMain from '$lib/components/sections/hero/hero-main.svelte';
	import InfoMain from '$lib/components/sections/info/info-main.svelte';
	import FeatureImage from '$lib/components/sections/feature/feature-image.svelte';
	import CTA from '$lib/components/sections/cta/cta.svelte';

	// Sections
	import News from '$lib/components/sections/news/news.svelte';
</script>

<HeroMain />
<InfoMain />
<News />
<FeatureImage
	image_url="https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=1436&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
	1
</FeatureImage>
<FeatureImage
	image_url="https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=1436&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
	2
</FeatureImage>
<FeatureImage
	image_url="https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=1436&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
	3
</FeatureImage>
<CTA />