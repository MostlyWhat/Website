<script lang="ts">
	// Components
	import HeroMain from '$lib/components/sections/hero/hero-main.svelte';
	import InfoMain from '$lib/components/sections/info/info-main.svelte';
	import FeatureImage from '$lib/components/sections/feature/feature-image.svelte';
	import CtaFull from '$lib/components/sections/cta/cta-full.svelte';

	// Sections
	import News from '$lib/components/sections/news/news.svelte';
	import Button from '../lib/components/ui/button/button.svelte';
</script>

<HeroMain />
<InfoMain />
<FeatureImage
	image_url="https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=1436&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
	<p class="mb-2 font-chakra text-xs uppercase">// Core Directive No.1</p>
	<h3 class="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase">Performant Solutions</h3>
	<p class="mt-3 text-sm text-muted-foreground max-w-md">
		Performance is at the core of everything we build at MostlyWhat Systems. Our solutions are engineered to deliver
		exceptional speed and reliability, ensuring that your applications run smoothly even under the heaviest loads. We
		leverage the latest technologies and best practices to optimize performance, providing you with robust and efficient
		systems that scale with your needs.
	</p>
	<Button class="mt-4" size="lg">
		Learn More
	</Button>
</FeatureImage>
<FeatureImage
	image_url="https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=1436&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
	<p class="mb-2 font-chakra text-xs uppercase">// Core Directive No.2</p>
	<h3 class="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase">Minimalist Design</h3>
	<p class="mt-3 text-sm text-muted-foreground max-w-md">
		At MostlyWhat Systems, we believe in the power of simplicity. Our minimalist design approach ensures that your
		digital presence is not only aesthetically pleasing but also user-friendly. By focusing on clean lines, intuitive
		navigation, and essential features, we create interfaces that offer a seamless and engaging experience for your
		users.
	</p>
	<Button class="mt-4" size="lg">
		Learn More
	</Button>
</FeatureImage>
<FeatureImage
	image_url="https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=1436&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D">
	<p class="mb-2 font-chakra text-xs uppercase">// Core Directive No.3</p>
	<h3 class="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase">Secure Development</h3>
	<p class="mt-3 text-sm text-muted-foreground max-w-md">
		Security is paramount in today’s digital landscape, and at MostlyWhat Systems, we prioritize it from the ground up.
		Our development practices incorporate the latest security protocols and standards to protect your data and
		applications. With a focus on building securely, we ensure that your systems are resilient against threats, giving
		you peace of mind and confidence in your digital infrastructure.
	</p>
	<Button class="mt-4" size="lg">
		Learn More
	</Button>
</FeatureImage>
<News />
<CtaFull />