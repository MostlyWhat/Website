<script>
	import { spring } from 'svelte/motion';

	let coords1 = spring(
		{ x: 0, y: 0 },
		{
			stiffness: 0.05,
			damping: 0.25
		}
	);

	let coords2 = spring(
		{ x: 0, y: 0 },
		{
			stiffness: 0.1,
			damping: 0.35
		}
	);

	let size = spring(10);
</script>

<svelte:window
	on:mousedown={() => {
  size.set(30);
 }}
	on:mousemove={(e) => {
  coords1.set({ x: e.clientX, y: e.clientY })
  coords2.set({ x: e.clientX, y: e.clientY })
 }}
	on:mouseup={() => {
  size.set(10);
 }}
/>

<svg
	class="w-full h-full z-50"
>
	<circle cx={$coords1.x} cy={$coords1.y} fill-opacity="0" r={$size} stroke="lightgray" stroke-width="1" />
	<circle cx={$coords2.x} cy={$coords2.y} fill="white" r={$size/4} />
</svg>

<style>
    .w-full {
        width: 100vw;
    }

    .h-full {
        height: 100vh;
    }

    svg {
        position: fixed;
        top: 0;
        left: 0;
        pointer-events: none;
    }
</style>