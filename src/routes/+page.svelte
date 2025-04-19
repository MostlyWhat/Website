<script lang="ts">
	// Components
	import { Button } from '$lib/components/ui/button';

	// Sections
	import News from '$lib/components/sections/news/news.svelte';
</script>

<section class="relative h-screen w-full overflow-hidden">
	<!-- Video background -->
	<video autoplay class="absolute inset-0 z-[-1] h-full w-full object-cover" loop muted>
		<source
			src="https://www.marathonthegame.com/content/dam/goliath/marathon/videos/33850_BNG_GO_BASE_TR_GP-REVEAL_V1_LF_4K_16x9_TL_NR_AGN_NA_NoSound.mp4"
			type="video/mp4"
		/>
		Your browser does not support the video tag.
	</video>

	<!-- Subtitle and Logo at bottom left -->
	<div class="absolute bottom-4 left-4 flex flex-col items-start">
		<p class="mb-2 font-mono text-xs sm:text-sm uppercase">// Design. Develop. Deploy.</p>
		<p class="-m-1 font-sans text-4xl sm:text-6xl md:text-8xl font-black uppercase">MostlyWhat</p>
	</div>
</section>

<section class="relative h-screen w-full overflow-hidden">
	<div class="absolute inset-0 flex items-center px-4 md:px-8">
		<div class="mx-auto md:mx-0 max-w-full md:max-w-[50%] md:text-left">
			<p class="mb-2 font-mono text-xs sm:text-sm uppercase">// A creative studio based in Phuket, Thailand</p>
			<p class="-m-1 font-sans text-3xl sm:text-5xl md:text-8xl font-black uppercase">
				Producing
				<span class="text-yellow-500">performant</span>,
				<span class="text-blue-500">minimalist,</span>
				<span class="text-red-500">secure</span>
				solutions.
			</p>
		</div>
	</div>
</section>

<News />

<section class="sticky top-0 h-screen overflow-hidden bg-background">
	<!-- Background Image Embed -->
	<img
		alt="Background"
		class="absolute inset-0 z-[-1] h-full w-full object-cover"
		src="https://images.unsplash.com/photo-1459909633680-206dc5c67abb?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
	/>

	<!-- Grid Content on Top -->
	<div class="relative grid h-full grid-cols-4 grid-rows-2">
		<div class="col-span-4 md:col-span-2 md:col-start-3 row-start-2 bg-background p-4">
			<p class="text-lg md:text-xl">1</p>
		</div>
	</div>
</section>

<section class="sticky top-0 h-screen overflow-hidden bg-background">
	<!-- Background Image Embed -->
	<img
		alt="Background"
		class="absolute inset-0 z-[-1] h-full w-full object-cover"
		src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
	/>

	<!-- Grid Content on Top -->
	<div class="relative grid h-full grid-cols-4 grid-rows-2">
		<div class="col-span-4 md:col-span-2 md:col-start-3 row-start-2 bg-background p-4">
			<p class="text-lg md:text-xl">2</p>
		</div>
	</div>
</section>

<section class="sticky top-0 h-screen overflow-hidden bg-background">
	<!-- Background Image Embed -->
	<img
		alt="Background"
		class="absolute inset-0 z-[-1] h-full w-full object-cover"
		src="https://images.unsplash.com/photo-1447433865958-f402f562b843?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
	/>

	<!-- Grid Content on Top -->
	<div class="relative grid h-full grid-cols-4 grid-rows-2">
		<div class="col-span-4 md:col-span-2 md:col-start-3 row-start-2 bg-background p-4">
			<p class="text-lg md:text-xl">3</p>
		</div>
	</div>
</section>

<section class="relative min-h-screen overflow-hidden bg-background py-8">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
		<div class="col-span-1 md:col-span-2">
			<div>
				<div class="p-4">
					<p class="mb-2 font-mono text-xs sm:text-sm uppercase">News</p>
					<p class="-m-1 font-sans text-4xl sm:text-5xl md:text-6xl font-black uppercase">Latest Updates</p>
					<p class="mt-4 text-sm">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
						incididunt ut labore et dolore magna aliqua.
					</p>
					<Button class="mt-4" size="lg" variant="outline">Read More</Button>
				</div>
			</div>
		</div>
		<div class="col-span-1">
			<div class="h-full w-full bg-primary text-primary-foreground p-4">Social</div>
		</div>
		<div class="col-span-1">
			<div class="h-full w-full bg-secondary text-secondary-foreground p-4">Social</div>
		</div>

		<!-- Converting row positioning to simpler grid for responsive -->
		<div class="col-span-1 h-auto md:h-80 p-4 bg-muted">4</div>
		<div class="col-span-1 h-auto md:h-80 p-4 bg-muted/50">5</div>
		<div class="col-span-1 h-auto md:h-80 p-4 bg-muted">6</div>
		<div class="col-span-1 h-auto md:h-80 p-4 bg-muted/50">7</div>
	</div>
</section>