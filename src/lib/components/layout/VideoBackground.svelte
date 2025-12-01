<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { getVideoState, setVideoElement, syncVideoTime, setVideoState, getVideoElement } from '$lib/stores/video.svelte';
	import { getIsNavigating } from '$lib/stores/navigation.svelte';
	import TransmissionLoader from './TransmissionLoader.svelte';

	interface Props {
		src: string;
		poster?: string;
		class?: string;
	}

	let { src, poster = '', class: className = '' }: Props = $props();

	let videoRef = $state<HTMLVideoElement | null>(null);
	let hasError = $state(false);
	let isLoaded = $state(false);

	// Get navigation state from global store
	let isNavigating = $derived(getIsNavigating());

	onMount(() => {
		if (!videoRef) return;

		const state = getVideoState();
		const existingVideo = getVideoElement();

		// If there's an existing video with the same source, sync immediately
		if (existingVideo && state.src === src && state.currentTime > 0) {
			videoRef.currentTime = state.currentTime;
			isLoaded = true; // Show immediately to reduce stutter
		}

		// Set up the video element in the store
		setVideoElement(videoRef);
		setVideoState({ src });

		// Track time updates for persistence
		const handleTimeUpdate = () => {
			if (videoRef) {
				syncVideoTime(videoRef.currentTime);
			}
		};

		const handleCanPlay = () => {
			isLoaded = true;
			videoRef?.play().catch(() => {});
		};

		const handleLoadedData = () => {
			// Restore position after loaded
			const currentState = getVideoState();
			if (currentState.currentTime > 0 && currentState.src === src) {
				videoRef!.currentTime = currentState.currentTime;
			}
			isLoaded = true;
		};

		const handleError = () => {
			hasError = true;
		};

		videoRef.addEventListener('timeupdate', handleTimeUpdate);
		videoRef.addEventListener('canplay', handleCanPlay);
		videoRef.addEventListener('loadeddata', handleLoadedData);
		videoRef.addEventListener('error', handleError);

		// Start playing immediately
		videoRef.play().catch(() => {});

		return () => {
			if (videoRef) {
				videoRef.removeEventListener('timeupdate', handleTimeUpdate);
				videoRef.removeEventListener('canplay', handleCanPlay);
				videoRef.removeEventListener('loadeddata', handleLoadedData);
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
			preload="auto"
			class="h-full w-full object-cover transition-opacity duration-700 {isLoaded ? 'opacity-100' : 'opacity-0'}"
			style={isLoaded ? '' : 'filter: blur(10px);'}
		>
			<track kind="captions" src="" label="No captions" />
		</video>
	{:else if poster}
		<img 
			src={poster}
			alt=""
			class="h-full w-full object-cover"
		/>
	{/if}
	
	<!-- Glitch overlay effect on load -->
	{#if !isLoaded}
		<div class="absolute inset-0 animate-pulse bg-gradient-to-b from-primary/5 to-transparent"></div>
	{/if}
	
	<!-- Transmission loader during navigation -->
	<TransmissionLoader visible={isNavigating} />
	
	<!-- Grid overlay -->
	<div 
		class="absolute inset-0 opacity-[0.08]" 
		style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"
	></div>
</div>
