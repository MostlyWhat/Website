<script>
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<section class="py-16 sm:py-20 bg-muted/20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<Badge class="mb-6" variant="outline">Capabilities</Badge>
			<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">What we bring to the table</h2>
			<p class="mt-6 text-lg leading-8 text-muted-foreground">
				Full‑stack expertise across product, design, and engineering to take you from zero to one—and beyond.
			</p>
		</div>

		<div class="mx-auto mt-12 max-w-4xl">
			<dl class="grid grid-cols-1 sm:grid-cols-2 border gap-px">
				{#each [
					{ k: 'Speed', v: 'Rapid prototyping and delivery' },
					{ k: 'Quality', v: 'A11y, performance, and reliability' },
					{ k: 'Process', v: 'Transparent, iterative, collaborative' },
					{ k: 'Support', v: 'Launch, measure, and improve' }
				] as row}
					<div class="bg-card p-6">
						<dt class="text-sm text-muted-foreground">{row.k}</dt>
						<dd class="mt-2 text-lg font-medium">{row.v}</dd>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</section>
