<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		text: string;
		class?: string;
		/** Only animate on hover (default true) */
		hoverOnly?: boolean;
		/** Start scrambled and reveal text (for hero text) */
		scrambledStart?: boolean;
	}

	let { text, class: className = '', hoverOnly = true, scrambledStart = false }: Props = $props();

	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*<>[]{}/_';
	
	// Generate scrambled text
	function generateScrambled(str: string): string {
		return str.split('').map(char => char === ' ' || char === '\n' ? char : chars[Math.floor(Math.random() * chars.length)]).join('');
	}
	
	let displayText = $state(scrambledStart ? generateScrambled(text) : text);
	let isAnimating = $state(false);
	let hasRevealed = $state(false);
	let spanElement: HTMLSpanElement;
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
					if (char === ' ' || char === '\n') return char;
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
				hasRevealed = true;
			}

			iteration += 1 / 2;
		}, 30);
	}

	function handleMouseEnter() {
		if (hoverOnly && !scrambledStart) {
			startGlitch();
		} else if (scrambledStart && hasRevealed) {
			// Allow re-animation on hover after initial reveal
			startGlitch();
		}
	}

	onMount(() => {
		if (!hoverOnly || scrambledStart) {
			// Auto-play on mount with slight delay
			timeoutId = setTimeout(startGlitch, scrambledStart ? 300 : 500);
		}
		
		// Also listen to parent element hover for better button support
		if (hoverOnly && spanElement) {
			const parent = spanElement.closest('a, button, [role="button"]');
			if (parent) {
				const handleParentEnter = () => handleMouseEnter();
				parent.addEventListener('mouseenter', handleParentEnter);
				return () => {
					parent.removeEventListener('mouseenter', handleParentEnter);
					if (timeoutId) clearTimeout(timeoutId);
					if (intervalId) clearInterval(intervalId);
				};
			}
		}
		
		return () => {
			if (timeoutId) clearTimeout(timeoutId);
			if (intervalId) clearInterval(intervalId);
		};
	});

	// Reset display text when text prop changes (but not for scrambledStart until revealed)
	$effect(() => {
		if (!isAnimating && (!scrambledStart || hasRevealed)) {
			displayText = text;
		}
	});
</script>

<span 
	bind:this={spanElement}
	class="{className}"
	onmouseenter={handleMouseEnter}
	role="presentation"
>
	{displayText}
</span>
