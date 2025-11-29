<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		text: string;
		class?: string;
		hoverOnly?: boolean;
	}

	let { text, class: className = '', hoverOnly = true }: Props = $props();

	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
	let displayText = $state(text);
	let isAnimating = $state(false);
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let intervalId: ReturnType<typeof setInterval> | null = null;

	function startGlitch() {
		if (isAnimating) return;
		isAnimating = true;

		let iteration = 0;
		const originalText = text;

		// Clear any existing interval
		if (intervalId) clearInterval(intervalId);

		intervalId = setInterval(() => {
			displayText = originalText
				.split('')
				.map((char, index) => {
					if (char === ' ') return ' ';
					if (index < iteration) {
						return originalText[index];
					}
					return chars[Math.floor(Math.random() * chars.length)];
				})
				.join('');

			if (iteration >= originalText.length) {
				if (intervalId) clearInterval(intervalId);
				displayText = originalText;
				isAnimating = false;
			}

			iteration += 1 / 2;
		}, 30);
	}

	function stopGlitch() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
		displayText = text;
		isAnimating = false;
	}

	function handleMouseEnter() {
		if (hoverOnly) {
			startGlitch();
		}
	}

	function handleMouseLeave() {
		// Let animation complete naturally
	}

	onMount(() => {
		if (!hoverOnly) {
			// Auto-play on mount
			timeoutId = setTimeout(startGlitch, 500);
		}
		
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			if (intervalId) clearInterval(intervalId);
		};
	});

	// Reset display text when text prop changes
	$effect(() => {
		if (!isAnimating) {
			displayText = text;
		}
	});
</script>

<span 
	class="font-mono {className}"
	onmouseenter={handleMouseEnter}
	onmouseleave={handleMouseLeave}
	role="presentation"
>
	{displayText}
</span>
