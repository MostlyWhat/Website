<script>
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<section class="bg-muted/30 py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<Badge class="mb-6" variant="outline">Recognition</Badge>
			<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Awards & press</h2>
			<p class="mt-6 text-lg leading-8 text-muted-foreground">
				A few nice things people have said. Drop in real logos and quotes when ready.
			</p>
		</div>

		<div class="mx-auto mt-16 max-w-4xl grid grid-cols-2 gap-6 sm:grid-cols-4">
			{#each Array(8) as _, i}
				<div class="border p-6 text-center">
					<div class="h-10 bg-muted"></div>
					<p class="mt-3 text-xs text-muted-foreground">Award {i + 1}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
