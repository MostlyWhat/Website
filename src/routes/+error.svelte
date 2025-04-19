<script lang="ts">
	import { page } from '$app/state';
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
	<div class="absolute left-4 top-1/2 transform -translate-y-1/2 flex flex-col items-start">
		<p class="mb-2 font-mono text-sm uppercase">An Error has Occured</p>
		<p class="-m-1 font-sans font-black uppercase text-8xl">{page.status} {page.error.message}</p>
		<div class="flex flex-wrap justify-end gap-4">
			<Button class="mt-4" size="lg" href="/">Go to Home</Button>
			<Button class="mt-4" variant="secondary" size="lg" href="/contact">Contact Us</Button>
		</div>
	</div>
</section>