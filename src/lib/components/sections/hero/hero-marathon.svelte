<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<!-- Marathon/Bungie inspired: bold grid, neon accents, technical UI motifs -->
<section class="relative overflow-hidden">
	<!-- Subtle grid background with vignette -->
	<div class="absolute inset-0 bg-grid-white/[0.03] bg-[size:60px_60px]"></div>
	<div class="absolute inset-0 pointer-events-none [background:radial-gradient(60%_50%_at_50%_30%,_oklch(0.24_0.02_285/_0.7),_transparent_60%)]"></div>
	<div class="absolute inset-0 pointer-events-none [background:linear-gradient(to_bottom,_transparent,_oklch(0.14_0.01_285/_0.6))]"></div>

	<div class="relative mx-auto max-w-7xl px-6 pt-24 pb-20 sm:pt-32 sm:pb-28 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
			<!-- Left copy -->
			<div class="lg:col-span-7">
				<Badge class="mb-6" variant="secondary">Creative engineering</Badge>
				<h1 class="text-4xl sm:text-6xl font-bold leading-tight tracking-tight">
					We design worlds for the web
				</h1>
				<p class="mt-6 text-lg text-muted-foreground max-w-xl">
					An independent studio building high‑fidelity websites, products, and design systems with a focus on speed,
					clarity, and a touch of sci‑fi industrial realism.
				</p>
				<div class="mt-10 flex items-center gap-4">
					<Button size="lg" class="px-8">Start a project</Button>
					<Button size="lg" variant="outline">View work</Button>
				</div>

				<!-- Meta strip -->
				<div class="mt-10 grid grid-cols-3 gap-4 text-xs text-muted-foreground">
					<div class="border p-3">
						<p>Response time</p>
						<p class="mt-1 font-medium text-foreground"><span class="text-primary">~</span>24h</p>
					</div>
					<div class="border p-3">
						<p>Locations</p>
						<p class="mt-1 font-medium text-foreground">Remote • Global</p>
					</div>
					<div class="border p-3">
						<p>Stack</p>
						<p class="mt-1 font-medium text-foreground">SvelteKit • TS</p>
					</div>
				</div>
			</div>

			<!-- Right panel: diegetic UI tile grid -->
			<div class="lg:col-span-5">
				<div class="grid grid-cols-2 gap-4">
					<div class="border p-4">
						<div class="aspect-[4/3] bg-muted/30 grid place-items-center">
							<div class="size-16 rounded-full border border-primary/60 shadow-[0_0_40px_theme(colors.primary/.25)]"></div>
						</div>
						<p class="mt-3 text-sm">Interfaces</p>
					</div>
					<div class="border p-4">
						<div class="aspect-[4/3] bg-muted/30 grid place-items-center">
							<div class="h-1.5 w-16 bg-primary"></div>
						</div>
						<p class="mt-3 text-sm">Motion</p>
					</div>
					<div class="border p-4">
						<div class="aspect-[4/3] bg-muted/30 grid place-items-center">
							<div class="size-10 rotate-45 border border-primary/60"></div>
						</div>
						<p class="mt-3 text-sm">Systems</p>
					</div>
					<div class="border p-4">
						<div class="aspect-[4/3] bg-muted/30 grid place-items-center">
							<div class="size-6 bg-primary/70"></div>
						</div>
						<p class="mt-3 text-sm">Prototypes</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
