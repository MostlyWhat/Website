<script>
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Card, CardContent } from '$lib/components/ui/card/index.js';
</script>

<section class="py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<Badge class="mb-6" variant="secondary">Selected work</Badge>
			<h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
				Recent projects
			</h2>
			<p class="mt-6 text-lg leading-8 text-muted-foreground">
				A rotating grid of case studies. Replace images and copy with real projects later.
			</p>
		</div>

		<div class="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
			<!-- Tall feature -->
			<Card class="lg:col-span-7 relative overflow-hidden">
				<CardContent class="p-0">
					<div class="aspect-[16/10] bg-muted/30 grid place-items-center">
						<div class="size-24 rounded-xl bg-gradient-to-tr from-primary/60 to-primary/30"></div>
					</div>
					<div class="p-6">
						<h3 class="text-lg font-semibold">E‑commerce redesign</h3>
						<p class="text-sm text-muted-foreground mt-1">Conversion‑focused storefront using SvelteKit.</p>
					</div>
				</CardContent>
			<div class="pointer-events-none absolute inset-0 bg-grid-white/[0.03] bg-[size:40px_40px]"></div>
			</Card>

			<!-- Two stack -->
			<div class="lg:col-span-5 grid gap-6">
				<Card class="relative overflow-hidden">
					<CardContent class="p-0">
						<div class="aspect-[16/9] bg-muted/30 grid place-items-center">
							<div class="size-16 rounded-lg bg-gradient-to-tr from-blue-500/50 to-blue-500/20"></div>
						</div>
						<div class="p-6">
							<h3 class="text-lg font-semibold">SaaS marketing site</h3>
							<p class="text-sm text-muted-foreground mt-1">High‑performance landing pages and blog.</p>
						</div>
					</CardContent>
					  <div class="pointer-events-none absolute inset-0 bg-grid-white/[0.03] bg-[size:40px_40px]"></div>
				</Card>

				<Card class="relative overflow-hidden">
					<CardContent class="p-0">
						<div class="aspect-[16/9] bg-muted/30 grid place-items-center">
							<div class="size-16 rounded-lg bg-gradient-to-tr from-green-500/50 to-green-500/20"></div>
						</div>
						<div class="p-6">
							<h3 class="text-lg font-semibold">Design system</h3>
							<p class="text-sm text-muted-foreground mt-1">Shadcn/ui tailored for product teams.</p>
						</div>
					</CardContent>
					  <div class="pointer-events-none absolute inset-0 bg-grid-white/[0.03] bg-[size:40px_40px]"></div>
				</Card>
			</div>
		</div>
	</div>
</section>
