<script lang="ts">
	import { page } from '$app/state';
	import { MARATHON_VIDEO } from '$lib/sources';
	import HeroVideo from './hero-video.svelte';

	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

	let page_name = $state('');
	let page_subtitle = $state('');

	// Grab the current URL
	const currentUrl = page.url;
	// Get the pathname
	const pathname = currentUrl.pathname;
	// Add a space between the slashes
	const formattedPathname = pathname.replace(/\//g, ' / ');
	// Get the last part of the pathname
	const lastPart = pathname.substring(pathname.lastIndexOf('/') + 1);
	// Check if the last part is empty
	const isEmpty = lastPart === '';
	// If it is empty, set the pathname to 'home'
	if (isEmpty) {
		currentUrl.pathname = '/ Home';
	}

	// Set Page Name
	if (lastPart === 'index' || lastPart === '') {
		page_name = 'MostlyWhat';
	} else {
		page_name = lastPart;
	}

	// Set Subtitle
	if (lastPart === 'index' || lastPart === '') {
		page_subtitle = '// Design. Develop. Deploy.';
	} else {
		page_subtitle = `Navigation ${formattedPathname}`;
	}


	function animate() {
		const target = page_name;

		let iteration = 0;

		const interval = setInterval(() => {
			page_name = target
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

	$effect(() => {
		setTimeout(() => {
			animate();
		}, 500);
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
