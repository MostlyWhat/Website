<script>
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<section class="py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<Badge class="mb-6 rounded-none" variant="secondary">Team</Badge>
			<h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">A compact, senior team</h2>
			<p class="mt-6 text-lg leading-8 text-muted-foreground">
				Hands‑on partners across strategy, design, and code. No hand‑offs, no bloat.
			</p>
		</div>

		<div class="mt-12 grid grid-cols-2 border gap-px sm:grid-cols-3 lg:grid-cols-6">
			{#each Array(6) as _, i}
				<div class="bg-card p-4">
					<div class="aspect-square bg-muted/30"></div>
					<div class="mt-3">
						<p class="text-sm font-medium">Member {i + 1}</p>
						<p class="text-xs text-muted-foreground">Role</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>
