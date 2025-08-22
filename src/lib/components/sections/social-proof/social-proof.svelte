<script>
	import { Badge } from '$lib/components/ui/badge/index.js';
</script>

<section class="bg-muted/30 py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<Badge class="mb-6 rounded-none" variant="secondary">
				Trusted by thousands
			</Badge>
			<h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
				Powering the next generation of applications
			</h2>
			<p class="mt-6 text-lg leading-8 text-muted-foreground">
				Join thousands of developers and companies who trust our platform to deploy and scale their applications.
			</p>
		</div>

		<!-- Company Logos -->
		<div
			class="mx-auto mt-12 grid max-w-lg grid-cols-4 items-center border gap-px sm:max-w-xl sm:grid-cols-6 lg:mx-0 lg:max-w-none lg:grid-cols-5">
			{#each Array(10) as _, i}
				<div class="col-span-2 max-h-12 w-full lg:col-span-1">
					<div
						class="h-12 w-full bg-card flex items-center justify-center">
						<span class="text-xs font-medium text-muted-foreground">Company {i + 1}</span>
					</div>
				</div>
			{/each}
		</div>

		<!-- Stats -->
		<div class="mx-auto mt-12 max-w-2xl lg:mx-0 lg:max-w-none">
			<div class="grid grid-cols-1 gap-x-8 gap-y-12 text-center lg:grid-cols-4">
				<div class="mx-auto flex max-w-xs flex-col gap-y-4">
					<dt class="text-base leading-7 text-muted-foreground">Applications deployed</dt>
					<dd class="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
						1M+
					</dd>
				</div>
				<div class="mx-auto flex max-w-xs flex-col gap-y-4">
					<dt class="text-base leading-7 text-muted-foreground">Developers served</dt>
					<dd class="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
						50K+
					</dd>
				</div>
				<div class="mx-auto flex max-w-xs flex-col gap-y-4">
					<dt class="text-base leading-7 text-muted-foreground">Uptime guarantee</dt>
					<dd class="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
						99.9%
					</dd>
				</div>
				<div class="mx-auto flex max-w-xs flex-col gap-y-4">
					<dt class="text-base leading-7 text-muted-foreground">Global regions</dt>
					<dd class="order-first text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
						12
					</dd>
				</div>
			</div>
		</div>
	</div>
</section>
