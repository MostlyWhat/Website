<script lang="ts">
	import { Button } from '$lib/components/ui/button';
</script>

<section class="relative h-screen overflow-hidden">
	<!-- Video background -->
	<video autoplay muted loop class="absolute inset-0 object-cover z-[-1]">
		<source src="https://www.marathonthegame.com/content/dam/goliath/marathon/videos/33850_BNG_GO_BASE_TR_GP-REVEAL_V1_LF_4K_16x9_TL_NR_AGN_NA_NoSound.mp4" type="video/mp4" />
		Your browser does not support the video tag.
	</video>

	<!-- Other page content can go here -->

	<!-- Subtitle and Logo at bottom left -->
	<div class="absolute bottom-4 left-4 flex flex-col items-start">
		<p class="mb-2 font-mono text-sm uppercase">Design. Develop. Deploy.</p>
		<p class="-m-1 font-sans font-black uppercase text-8xl">MostlyWhat</p>
	</div>
</section>
<section class="relative h-screen overflow-hidden">
	<div class="absolute w-1/2 top-1/2 left-4 transform -translate-y-1/2 flex flex-col">
		<p class="mb-2 font-mono text-sm uppercase">A creative studio based in Phuket, Thailand</p>
		<p class="-m-1 font-sans font-black uppercase text-8xl">
			Producing
			<span class="text-yellow-500">performant</span>,
			<span class="text-blue-500">minimalist,</span>
			<span class="text-red-500">secure</span>
			solutions.</p>
	</div>
</section>
<section class="relative h-screen overflow-hidden bg-background">
	<div class="grid grid-cols-4 grid-rows-3">
		<div class="col-span-2 h-80">
			<div>
				<div class="p-4">
					<p class="mb-2 font-mono text-sm uppercase">News</p>
					<p class="-m-1 font-sans font-black uppercase text-6xl">Latest Updates</p>
					<p class="mt-4 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
					<Button class="mt-4" variant="outline" size="lg">Read More</Button>
				</div>
			</div>
		</div>
		<div class="col-start-3 h-80">
			<div class="h-full w-full bg-primary text-primary-foreground">
				Social
			</div>
		</div>
		<div class="col-start-4 h-80">
			<div class="h-full w-full bg-secondary text-secondary-foreground">
			Social
		</div>
		</div>
		<div class="row-span-2 row-start-2 h-80">4</div>
		<div class="row-span-2 row-start-2 h-80">5</div>
		<div class="row-span-2 row-start-2 h-80">6</div>
		<div class="row-span-2 row-start-2 h-80">7</div>
	</div>
</section>
<section class="h-screen overflow-hidden sticky top-0 bg-background">
	<!-- Background Image Embed -->
	<img
		src="https://images.unsplash.com/photo-1459909633680-206dc5c67abb?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
		alt="Background"
		class="absolute inset-0 w-full h-full object-cover z-[-1]"
	/>

	<!-- Grid Content on Top -->
	<div class="relative grid grid-cols-4 grid-rows-2 h-full">
		<div class="col-span-2 col-start-3 row-start-2 bg-background p-2">
			1
		</div>
	</div>
</section>
<section class="h-screen overflow-hidden sticky top-0 bg-background">
	<!-- Background Image Embed -->
	<img
		src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
		alt="Background"
		class="absolute inset-0 w-full h-full object-cover z-[-1]"
	/>

	<!-- Grid Content on Top -->
	<div class="relative grid grid-cols-4 grid-rows-2 h-full">
		<div class="col-span-2 col-start-3 row-start-2 bg-background p-2">
			2
		</div>
	</div>
</section>
<section class="h-screen overflow-hidden sticky top-0 bg-background">
	<!-- Background Image Embed -->
	<img
		src="https://images.unsplash.com/photo-1447433865958-f402f562b843?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
		alt="Background"
		class="absolute inset-0 w-full h-full object-cover z-[-1]"
	/>

	<!-- Grid Content on Top -->
	<div class="relative grid grid-cols-4 grid-rows-2 h-full">
		<div class="col-span-2 col-start-3 row-start-2 bg-background p-2">
			3
		</div>
	</div>
</section>
<section class="relative h-screen overflow-hidden bg-background">
	<div class="grid grid-cols-4 grid-rows-3">
		<div class="col-span-2 h-80">
			<div>
				<div class="p-4">
					<p class="mb-2 font-mono text-sm uppercase">News</p>
					<p class="-m-1 font-sans font-black uppercase text-6xl">Latest Updates</p>
					<p class="mt-4 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
					<Button class="mt-4" variant="outline" size="lg">Read More</Button>
				</div>
			</div>
		</div>
		<div class="col-start-3 h-80">
			<div class="h-full w-full bg-primary text-primary-foreground">
				Social
			</div>
		</div>
		<div class="col-start-4 h-80">
			<div class="h-full w-full bg-secondary text-secondary-foreground">
				Social
			</div>
		</div>
		<div class="row-span-2 row-start-2 h-80">4</div>
		<div class="row-span-2 row-start-2 h-80">5</div>
		<div class="row-span-2 row-start-2 h-80">6</div>
		<div class="row-span-2 row-start-2 h-80">7</div>
	</div>
</section>
