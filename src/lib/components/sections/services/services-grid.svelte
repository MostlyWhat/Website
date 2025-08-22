<script>
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Card, CardContent } from '$lib/components/ui/card/index.js';
</script>

<section class="py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<Badge class="mb-6" variant="outline">Services</Badge>
			<h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
				Strategy, Design, and Engineering
			</h2>
			<p class="mt-6 text-lg leading-8 text-muted-foreground">
				A balanced stack of capabilities to plan, prototype, and ship high‑quality digital products.
			</p>
		</div>

		<div class="mx-auto mt-12 max-w-2xl lg:mt-16 lg:max-w-none">
			<div class="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3 border">
				{#each [
					{ title: 'Product Strategy', desc: 'Discovery, roadmapping, and measurable outcomes.' },
					{ title: 'Brand & Visual', desc: 'Identity systems, design language, and art direction.' },
					{ title: 'UX & Prototyping', desc: 'Flows, wireframes, and interactive prototypes.' },
					{ title: 'Web Engineering', desc: 'SvelteKit, TypeScript, and performant delivery.' },
					{ title: 'Platforms', desc: 'Headless CMS, e‑commerce, and third‑party integrations.' },
					{ title: 'Growth', desc: 'Analytics, SEO, experimentation, and iteration.' }
				] as item, i}
					<Card class="relative overflow-hidden rounded-none border-0">
						<CardContent class="p-6">
							<div class="flex items-start justify-between">
								<h3 class="text-lg font-semibold">{item.title}</h3>
								<span class="text-xs text-muted-foreground">0{i + 1}</span>
							</div>
							<p class="mt-3 text-sm text-muted-foreground">{item.desc}</p>
						</CardContent>
						<div class="pointer-events-none absolute inset-0 bg-grid-white/[0.025] bg-[size:40px_40px]"></div>
					</Card>
				{/each}
			</div>
		</div>
	</div>
</section>
