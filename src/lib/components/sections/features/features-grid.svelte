<script>
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Card, CardContent } from '$lib/components/ui/card/index.js';
</script>

<section class="py-16 sm:py-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<Badge class="mb-6 rounded-none" variant="outline">
				Platform Features
			</Badge>
			<h2 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
				Everything you need to ship faster
			</h2>
			<p class="mt-6 text-lg leading-8 text-muted-foreground">
				Built for developers who want to focus on building great products, not managing infrastructure.
			</p>
		</div>

		<div class="mx-auto mt-12 max-w-2xl lg:max-w-none">
			<dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-12 lg:max-w-none lg:grid-cols-3">
				<div class="flex flex-col">
					<dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
						<div class="h-5 w-5 flex-none bg-primary/10 p-1">
							<div class="h-full w-full bg-primary"></div>
						</div>
						Instant Deployments
					</dt>
					<dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
						<p class="flex-auto">
							Deploy from Git in seconds. No complex configuration files or lengthy setup processes required.
						</p>
					</dd>
				</div>

				<div class="flex flex-col">
					<dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
						<div class="h-5 w-5 flex-none bg-green-500/10 p-1">
							<div class="h-full w-full bg-green-500"></div>
						</div>
						Auto-Scaling
					</dt>
					<dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
						<p class="flex-auto">
							Automatically scale your applications based on traffic. Handle spikes without manual intervention.
						</p>
					</dd>
				</div>

				<div class="flex flex-col">
					<dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
						<div class="h-5 w-5 flex-none bg-blue-500/10 p-1">
							<div class="h-full w-full bg-blue-500"></div>
						</div>
						Global CDN
					</dt>
					<dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
						<p class="flex-auto">
							Lightning-fast content delivery worldwide with our global edge network and smart caching.
						</p>
					</dd>
				</div>

				<div class="flex flex-col">
					<dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
						<div class="h-5 w-5 flex-none bg-purple-500/10 p-1">
							<div class="h-full w-full bg-purple-500"></div>
						</div>
						Database Integration
					</dt>
					<dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
						<p class="flex-auto">
							Managed PostgreSQL, Redis, and more. Automatic backups and high availability included.
						</p>
					</dd>
				</div>

				<div class="flex flex-col">
					<dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
						<div class="h-5 w-5 flex-none bg-orange-500/10 p-1">
							<div class="h-full w-full bg-orange-500"></div>
						</div>
						Team Collaboration
					</dt>
					<dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
						<p class="flex-auto">
							Built-in team management, review apps, and environment controls for seamless collaboration.
						</p>
					</dd>
				</div>

				<div class="flex flex-col">
					<dt class="flex items-center gap-x-3 text-base font-semibold leading-7 text-foreground">
						<div class="h-5 w-5 flex-none bg-red-500/10 p-1">
							<div class="h-full w-full bg-red-500"></div>
						</div>
						24/7 Monitoring
					</dt>
					<dd class="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
						<p class="flex-auto">
							Real-time monitoring, alerts, and detailed analytics to keep your applications running smoothly.
						</p>
					</dd>
				</div>
			</dl>
		</div>
	</div>
</section>
