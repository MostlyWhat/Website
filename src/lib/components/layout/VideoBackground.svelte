<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getVideoState, setVideoElement, syncVideoTime, setVideoState } from '$lib/stores/video.svelte';

	interface Props {
		src: string;
		poster?: string;
		class?: string;
	}

	let { src, poster = '', class: className = '' }: Props = $props();

	let videoRef = $state<HTMLVideoElement | null>(null);
	let hasError = $state(false);
	let isLoaded = $state(false);

	onMount(() => {
		if (!videoRef) return;

		const state = getVideoState();

		// Set up the video element in the store
		setVideoElement(videoRef);
		setVideoState({ src });

		// Restore playback position if we have one stored for the same video
		if (state.currentTime > 0) {
			videoRef.currentTime = state.currentTime;
		}

		// Track time updates for persistence
		const handleTimeUpdate = () => {
			if (videoRef) {
				syncVideoTime(videoRef.currentTime);
			}
		};

		const handleCanPlay = () => {
			isLoaded = true;
			// Always try to play
			videoRef?.play().catch(() => {
				// Autoplay blocked - that's ok
			});
		};

		const handleError = () => {
			hasError = true;
		};

		videoRef.addEventListener('timeupdate', handleTimeUpdate);
		videoRef.addEventListener('canplay', handleCanPlay);
		videoRef.addEventListener('error', handleError);

		// Start playing immediately
		videoRef.play().catch(() => {});

		return () => {
			if (videoRef) {
				videoRef.removeEventListener('timeupdate', handleTimeUpdate);
				videoRef.removeEventListener('canplay', handleCanPlay);
				videoRef.removeEventListener('error', handleError);
			}
		};
	});

	onDestroy(() => {
		// Don't clear the element so video continues playing
	});
</script>

<div class="absolute inset-0 -z-10 overflow-hidden {className}">
	{#if !hasError}
		<video
			bind:this={videoRef}
			{src}
			{poster}
			autoplay
			muted
			loop
			playsinline
			class="h-full w-full object-cover brightness-[0.15] transition-opacity duration-500"
			class:opacity-0={!isLoaded}
		>
			<track kind="captions" src="" label="No captions" />
		</video>
	{:else if poster}
		<img 
			src={poster}
			alt=""
			class="h-full w-full object-cover brightness-[0.15]"
		/>
	{/if}
	
	<!-- Grid overlay -->
	<div 
		class="absolute inset-0 opacity-[0.08]" 
		style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"
	></div>
</div>
