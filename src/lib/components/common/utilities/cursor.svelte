<script lang="ts">
	import { Spring } from 'svelte/motion';
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';

	// Create Springs for cursor positions - slower for outer circle
	const innerPos = new Spring(
		{ x: 0, y: 0 },
		{
			stiffness: 0.2,
			damping: 0.3
		}
	);

	const outerPos = new Spring(
		{ x: 0, y: 0 },
		{
			stiffness: 0.08, // Slower stiffness for lag effect
			damping: 0.4
		}
	);

	const size = new Spring(10, {
		stiffness: 0.2,
		damping: 0.4
	});

	// Create stores to track the current values
	const innerCursorPos = writable({ x: 0, y: 0 });
	const outerCursorPos = writable({ x: 0, y: 0 });
	const cursorSize = writable(10);

	let lastMove = 0;
	// Fix: Change the type to accommodate Timeout objects
	let intervalIds: ReturnType<typeof setInterval>[] = [];

	onMount(() => {
		// Subscribe to changes in Spring.current values
		intervalIds.push(setInterval(() => {
			innerCursorPos.set(innerPos.current);
			outerCursorPos.set(outerPos.current);
			cursorSize.set(size.current);
		}, 16));
	});

	onDestroy(() => {
		intervalIds.forEach(id => clearInterval(id));
	});

	// Throttled mousemove handler
	function handleMouseMove(e: MouseEvent) {
		const now = performance.now();
		if (now - lastMove > 10) { // ~60fps
			// Update both positions with the same target, but they'll move at different speeds
			innerPos.set({ x: e.clientX, y: e.clientY });
			outerPos.set({ x: e.clientX, y: e.clientY });
			lastMove = now;
		}
	}

	function handleMouseDown() {
		size.set(30);
	}

	function handleMouseUp() {
		size.set(10);
	}
</script>

<svelte:window
	on:mousedown={handleMouseDown}
	on:mousemove={handleMouseMove}
	on:mouseup={handleMouseUp}
/>

<svg class="cursor-container hidden lg:block">
	<circle
		cx={$outerCursorPos.x}
		cy={$outerCursorPos.y}
		fill-opacity="0"
		r={$cursorSize}
		stroke="var(--color-secondary-foreground)"
		stroke-width="1"
	/>
	<circle
		cx={$innerCursorPos.x}
		cy={$innerCursorPos.y}
		fill="var(--color-primary-foreground)"
		r={$cursorSize/4}
	/>
</svg>

<style>
    .cursor-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
    }
</style>