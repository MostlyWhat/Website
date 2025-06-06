<script lang="ts">
	import { onMount } from 'svelte';

	let { videoSrc } = $props();
	let video;

	// Store and restore video state
	onMount(() => {
		// Try to restore previous playback position
		const savedTime = sessionStorage.getItem('videoTime');
		if (savedTime && video) {
			video.currentTime = parseFloat(savedTime);
			video.play().catch((e) => console.error('Video autoplay failed:', e));
		}

		// Save video position before navigation
		return () => {
			if (video) {
				sessionStorage.setItem('videoTime', video.currentTime.toString());
			}
		};
	});
</script>

<video
	autoplay
	bind:this={video}
	class="h-full w-full object-cover"
	loop
	muted
	playsinline
	src={videoSrc}
	style="view-transition-name: hero-video;"
>
	Your browser does not support the video tag.
</video>
