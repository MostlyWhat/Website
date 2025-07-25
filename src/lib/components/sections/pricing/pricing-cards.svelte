<script>
	import { Button } from '$lib/components/ui/button/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
</script>

<section class="py-24 sm:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-4xl text-center">
			<Badge class="mb-6" variant="outline">
				Pricing
			</Badge>
			<h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
				Simple, transparent pricing
			</h2>
			<p class="mt-6 text-lg leading-8 text-muted-foreground">
				Start free, scale as you grow. No hidden fees or surprise charges.
			</p>
		</div>

		<div
			class="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-0">
			<!-- Free Tier -->
			<Card class="flex flex-col justify-between">
				<CardHeader>
					<div class="flex items-center justify-between">
						<CardTitle class="text-lg font-semibold">Starter</CardTitle>
					</div>
					<CardDescription class="mt-4">
						Perfect for personal projects and learning
					</CardDescription>
					<p class="mt-6 flex items-baseline gap-x-1">
						<span class="text-4xl font-bold tracking-tight text-foreground">$0</span>
						<span class="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
					</p>
				</CardHeader>
				<CardContent class="flex flex-1 flex-col">
					<ul class="mt-8 space-y-3 text-sm leading-6 text-muted-foreground flex-1">
						<li class="flex gap-x-3">
							<span class="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-none"></span>
							500 build minutes/month
						</li>
						<li class="flex gap-x-3">
							<span class="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-none"></span>
							100GB bandwidth
						</li>
						<li class="flex gap-x-3">
							<span class="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-none"></span>
							Static sites & web services
						</li>
						<li class="flex gap-x-3">
							<span class="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-none"></span>
							Community support
						</li>
					</ul>
					<Button class="mt-8" variant="outline">
						Get started
					</Button>
				</CardContent>
			</Card>

			<!-- Pro Tier -->
			<Card class="flex flex-col justify-between border-primary shadow-lg">
				<CardHeader>
					<div class="flex items-center justify-between">
						<CardTitle class="text-lg font-semibold">Pro</CardTitle>
						<Badge>Most popular</Badge>
					</div>
					<CardDescription class="mt-4">
						For growing teams and production apps
					</CardDescription>
					<p class="mt-6 flex items-baseline gap-x-1">
						<span class="text-4xl font-bold tracking-tight text-foreground">$20</span>
						<span class="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
					</p>
				</CardHeader>
				<CardContent class="flex flex-1 flex-col">
					<ul class="mt-8 space-y-3 text-sm leading-6 text-muted-foreground flex-1">
						<li class="flex gap-x-3">
							<span class="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-none"></span>
							2,000 build minutes/month
						</li>
						<li class="flex gap-x-3">
							<span class="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-none"></span>
							1TB bandwidth
						</li>
						<li class="flex gap-x-3">
							<span class="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-none"></span>
							PostgreSQL databases
						</li>
						<li class="flex gap-x-3">
							<span class="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-none"></span>
							Priority support
						</li>
						<li class="flex gap-x-3">
							<span class="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-none"></span>
							Team collaboration
						</li>
					</ul>
					<Button class="mt-8">
						Start free trial
					</Button>
				</CardContent>
			</Card>

			<!-- Team Tier -->
			<Card class="flex flex-col justify-between">
				<CardHeader>
					<div class="flex items-center justify-between">
						<CardTitle class="text-lg font-semibold">Team</CardTitle>
					</div>
					<CardDescription class="mt-4">
						For larger teams with advanced needs
					</CardDescription>
					<p class="mt-6 flex items-baseline gap-x-1">
						<span class="text-4xl font-bold tracking-tight text-foreground">$100</span>
						<span class="text-sm font-semibold leading-6 text-muted-foreground">/month</span>
					</p>
				</CardHeader>
				<CardContent class="flex flex-1 flex-col">
					<ul class="mt-8 space-y-3 text-sm leading-6 text-muted-foreground flex-1">
						<li class="flex gap-x-3">
							<span class="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-none"></span>
							Unlimited build minutes
						</li>
						<li class="flex gap-x-3">
							<span class="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-none"></span>
							10TB bandwidth
						</li>
						<li class="flex gap-x-3">
							<span class="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-none"></span>
							Advanced security
						</li>
						<li class="flex gap-x-3">
							<span class="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-none"></span>
							24/7 dedicated support
						</li>
						<li class="flex gap-x-3">
							<span class="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-none"></span>
							SSO & compliance
						</li>
					</ul>
					<Button class="mt-8" variant="outline">
						Contact sales
					</Button>
				</CardContent>
			</Card>
		</div>
	</div>
</section>
