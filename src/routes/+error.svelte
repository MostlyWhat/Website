<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
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

	<!-- Error content -->
	<div class="absolute inset-0 flex items-center justify-center px-4 md:justify-start md:px-8">
		<div class="max-w-3xl">
			<p class="mb-8 font-mono text-xs sm:text-sm uppercase">
				<span class="bg-destructive p-4">
					// An Error has Occurred
				</span>
			</p>
			<p class="-m-1 font-sans text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black uppercase">
				{page.status} {page.error?.message || 'SYSTEM FAILURE'}
			</p>
			<div class="mt-12 flex flex-col sm:flex-row gap-4">
				<Button href="/" size="lg">Go to Home</Button>
				<Button href="/contact" size="lg" variant="secondary">Contact Us</Button>
			</div>
		</div>
	</div>
</section>