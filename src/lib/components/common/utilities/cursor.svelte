<script lang="ts">
	import { Spring } from 'svelte/motion';

	// Only outer circle uses spring for lag effect
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

	// Svelte 5 reactive state for inner cursor position (follows directly)
	let innerCursorPos = $state({ x: 0, y: 0 });

	// Reactive state for spring values
	let outerCursorPos = $state({ x: 0, y: 0 });
	let cursorSize = $state(10);

	let lastMove = 0;
	let intervalId: ReturnType<typeof setInterval> | null = null;

	$effect(() => {
		// Subscribe to changes in Spring.current values
		intervalId = setInterval(() => {
			outerCursorPos = { ...outerPos.current };
			cursorSize = size.current;
		}, 16);

		return () => {
			if (intervalId) clearInterval(intervalId);
		};
	});

	// Throttled mousemove handler
	function handleMouseMove(e: MouseEvent) {
		const now = performance.now();
		if (now - lastMove > 10) {
			// ~60fps
			// Inner cursor follows directly
			innerCursorPos = { x: e.clientX, y: e.clientY };
			// Outer cursor uses spring animation
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
	onmousedown={handleMouseDown}
	onmousemove={handleMouseMove}
	onmouseup={handleMouseUp}
/>

<svg class="cursor-container hidden lg:block">
	<circle
		cx={outerCursorPos.x}
		cy={outerCursorPos.y}
		fill-opacity="0"
		r={cursorSize}
		stroke="var(--color-secondary-foreground)"
		stroke-width="1"
	/>
	<circle
		cx={innerCursorPos.x}
		cy={innerCursorPos.y}
		fill="var(--color-primary-foreground)"
		r={cursorSize / 4}
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
