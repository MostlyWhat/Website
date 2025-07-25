<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<section class="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
	<div class="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
	<div class="relative mx-auto max-w-7xl px-6 pt-20 pb-24 sm:pt-24 sm:pb-32 lg:px-8 lg:pt-32">
		<div class="mx-auto max-w-2xl text-center">
			<Badge class="mb-6" variant="secondary">
				🚀 Now deploying faster than ever
			</Badge>
			<h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
				Build, Deploy, and Scale
				<span class="text-primary">Your Applications</span>
			</h1>
			<p class="mt-6 text-lg leading-8 text-muted-foreground">
				From idea to production in minutes. Deploy your web apps, APIs, and databases with zero configuration. Scale
				automatically and pay only for what you use.
			</p>
			<div class="mt-10 flex items-center justify-center gap-x-6">
				<Button class="px-8" size="lg">
					Get Started Free
				</Button>
				<Button size="lg" variant="outline">
					View Documentation
				</Button>
			</div>
			<div class="mt-8 flex items-center justify-center gap-x-8 text-sm text-muted-foreground">
				<div class="flex items-center gap-x-2">
					<div class="h-2 w-2 rounded-full bg-green-500" />
					No credit card required
				</div>
				<div class="flex items-center gap-x-2">
					<div class="h-2 w-2 rounded-full bg-blue-500" />
					Free tier included
				</div>
			</div>
		</div>

		<!-- Hero Image/Dashboard Preview -->
		<div class="mt-16 flow-root sm:mt-24">
			<div class="relative rounded-xl bg-muted/50 p-2 ring-1 ring-inset ring-border lg:rounded-2xl lg:p-4">
				<div class="aspect-[16/10] rounded-md bg-background ring-1 ring-border">
					<div class="flex h-full items-center justify-center">
						<div class="text-center">
							<div class="mx-auto h-32 w-32 rounded-xl bg-gradient-to-br from-primary to-primary/60" />
							<p class="mt-4 text-sm text-muted-foreground">Dashboard Preview</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
