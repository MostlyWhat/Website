<script lang="ts">
	let { image_url, children } = $props();
</script>

<section class="sticky top-0 h-screen overflow-hidden bg-background">
	<!-- Background Image Embed -->
	<img
		alt="Background"
		class="absolute inset-0 z-[-1] h-full w-full object-cover"
		src={image_url}
	/>

	<!-- Grid Content on Top -->
	<div class="relative grid h-full grid-cols-4 grid-rows-2">
		<div class="col-span-4 md:col-span-2 md:col-start-3 row-start-2 bg-background p-4">
			{@render children()}
		</div>
	</div>
</section>