/**
 * Persistent video store - maintains video playback state across page transitions
 * Uses Svelte 5 runes for reactivity
 */

interface VideoState {
	currentTime: number;
	isPlaying: boolean;
	src: string;
}

// Global state that persists across component instances
let videoState = $state<VideoState>({
	currentTime: 0,
	isPlaying: true,
	src: ''
});

// Reference to the actual video element (stored in layout)
let videoElement = $state<HTMLVideoElement | null>(null);

export function getVideoState() {
	return videoState;
}

export function setVideoState(state: Partial<VideoState>) {
	videoState = { ...videoState, ...state };
}

export function getVideoElement() {
	return videoElement;
}

export function setVideoElement(element: HTMLVideoElement | null) {
	videoElement = element;
}

export function syncVideoTime(time: number) {
	videoState.currentTime = time;
}

export function pauseVideo() {
	videoState.isPlaying = false;
	if (videoElement) {
		videoElement.pause();
	}
}

export function playVideo() {
	videoState.isPlaying = true;
	if (videoElement) {
		videoElement.play();
	}
}
