<script lang="ts">
	import { page } from '$app/state';
	import { MARATHON_VIDEO } from '$lib/sources';
	import HeroVideo from './hero-video.svelte';

	// Constants
	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	// State variables
	let page_name = $state('');
	let page_subtitle = $state('');
	let targetName = '';

	// Process URL and set page information
	function setupPageContent() {
		const currentUrl = page.url;
		const pathname = currentUrl.pathname;
		const formattedPathname = pathname.replace(/\//g, ' / ');
		const lastPart = pathname.substring(pathname.lastIndexOf('/') + 1);
		const isEmpty = lastPart === '';

		// Handle empty path
		if (isEmpty) {
			currentUrl.pathname = '/ Home';
		}

		// Determine target name and subtitle based on path
		if (lastPart === 'index' || lastPart === '') {
			targetName = 'MostlyWhat';
			page_subtitle = '// Design. Develop. Deploy.';
		} else {
			targetName = lastPart;
			page_subtitle = `Navigation ${formattedPathname}`;
		}

		// Initialize with random text
		page_name = Array(targetName.length)
			.fill(0)
			.map(() => letters[Math.floor(Math.random() * 26)])
			.join('');
	}

	// Text scramble animation
	function animate() {
		let iteration = 0;

		const interval = setInterval(() => {
			page_name = targetName
				.split('')
				.map((letter, index) =>
					index < iteration
						? targetName[index]
						: letters[Math.floor(Math.random() * 26)]
				)
				.join('');

			if (iteration >= targetName.length) {
				clearInterval(interval);
			}

			iteration += 1 / 3;
		}, 50);
	}

	// Initialize page content
	setupPageContent();

	// Start animation with delay
	$effect(() => {
		setTimeout(animate, 500);
	});
</script>

<section class="hero relative min-h-screen w-full overflow-hidden">
	<!-- Video background -->
	<div class="video-container absolute inset-0 z-[-1]">
		<HeroVideo videoSrc={MARATHON_VIDEO} />
	</div>

	<!-- Subtitle and Logo at bottom left -->
	<div class="absolute bottom-4 left-4 flex flex-col items-start">
		<p class="font-chakra mb-2 text-xs uppercase sm:text-sm">{page_subtitle}</p>
		<p class="font-heading -m-1 text-6xl font-black uppercase md:text-8xl">{page_name}</p>
	</div>
</section>

<style>
    .hero .video-container {
        view-transition-name: hero-video;
    }
</style>