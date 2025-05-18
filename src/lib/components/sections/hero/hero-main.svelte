<script lang="ts">
	import { onMount } from 'svelte';

	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	let title = $state('MOSTLYWHAT');

	function animate() {
		const target = title;

		let iteration = 0;

		const interval = setInterval(() => {
			title = target
				.split('')
				.map((letter, index) => {
					if (index < iteration) {
						return target[index];
					}
					return letters[Math.floor(Math.random() * 26)];
				})
				.join('');

			if (iteration >= target.length) {
				clearInterval(interval);
			}

			iteration += 1 / 3;
		}, 50);
	}

	onMount(() => {
		setTimeout(() => {
			animate();
		}, 500);

	});
</script>

<section class="relative min-h-screen w-full overflow-hidden">
	<!-- Video background -->
	<video autoplay class="absolute inset-0 z-[-1] h-full w-full object-cover video-background" loop muted>
		<source
			src="https://www.marathonthegame.com/content/dam/goliath/marathon/videos/33850_BNG_GO_BASE_TR_GP-REVEAL_V1_LF_4K_16x9_TL_NR_AGN_NA_NoSound.mp4"
			type="video/mp4"
		/>
		Your browser does not support the video tag.
	</video>

	<!-- Subtitle and Logo at bottom left -->
	<div class="absolute bottom-4 left-4 flex flex-col items-start">
		<p class="mb-2 font-mono text-xs sm:text-sm uppercase">// Design. Develop. Deploy.</p>
		<p class="-m-1 font-sans text-5xl sm:text-6xl md:text-8xl font-black uppercase">{title}</p>
	</div>
</section>

<style>
    .video-background {
        view-transition-name: hero-video;
    }
</style>