<script lang="ts">
	import HeroPage from '$lib/components/sections/hero/hero-page.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
</script>

<HeroPage />

<!-- Contact grid aligned to the new visual language -->
<section class="relative overflow-hidden py-16 sm:py-24">
	<div class="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]"></div>
	<div class="relative mx-auto max-w-7xl px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
			<!-- Form -->
			<div class="lg:col-span-7">
				<div class="rounded-md border bg-card/80 p-6 sm:p-8">
					<p class="font-chakra text-xs uppercase text-muted-foreground">// Start a project</p>
					<h2 class="mt-2 text-2xl font-bold sm:text-3xl">Tell us about your idea</h2>
					<form class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div class="sm:col-span-1">
							<Label for="name">Name</Label>
							<Input id="name" name="name" placeholder="Ada Lovelace" class="mt-2" />
						</div>
						<div class="sm:col-span-1">
							<Label for="email">Email</Label>
							<Input id="email" name="email" type="email" placeholder="you@company.com" class="mt-2" />
						</div>
						<div class="sm:col-span-1">
							<Label for="company">Company</Label>
							<Input id="company" name="company" placeholder="Acme Inc." class="mt-2" />
						</div>
						<div class="sm:col-span-1">
							<Label for="budget">Budget (optional)</Label>
							<Input id="budget" name="budget" placeholder="$10k–$50k" class="mt-2" />
						</div>
						<div class="sm:col-span-2">
							<Label for="message">Project details</Label>
							<Textarea id="message" name="message" rows="6" placeholder="Scope, timeline, goals…" class="mt-2" />
						</div>
						<div class="sm:col-span-2 flex items-center justify-between gap-4">
							<div class="text-xs text-muted-foreground">We reply within 24 hours on weekdays.</div>
							<Button size="lg" class="px-8">Send message</Button>
						</div>
					</form>
				</div>
			</div>

			<!-- Details -->
			<div class="lg:col-span-5">
				<div class="grid gap-6">
					<div class="rounded-md border p-6">
						<p class="font-chakra text-xs uppercase text-muted-foreground">// Contact</p>
						<div class="mt-3 grid grid-cols-1 gap-4">
							<div>
								<p class="text-xs text-muted-foreground">Email</p>
								<p class="mt-1 font-medium">hello@mostlywhat.com</p>
							</div>
							<div>
								<p class="text-xs text-muted-foreground">Hours</p>
								<p class="mt-1 font-medium">Mon–Fri, 9am–5pm UTC</p>
							</div>
							<div>
								<p class="text-xs text-muted-foreground">Response time</p>
								<p class="mt-1 font-medium"><span class="text-primary">~</span> 24 hours</p>
							</div>
						</div>
					</div>
					<div class="rounded-md border p-6">
						<p class="font-chakra text-xs uppercase text-muted-foreground">// Social</p>
						<ul class="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
							<li>Twitter</li>
							<li>LinkedIn</li>
							<li>GitHub</li>
							<li>Discord</li>
							<li>Instagram</li>
							<li>Dribbble</li>
						</ul>
					</div>
					<div class="rounded-md border p-6">
						<p class="font-chakra text-xs uppercase text-muted-foreground">// Status</p>
						<div class="mt-3 grid grid-cols-3 gap-3 text-xs">
							<div class="border p-3">
								<p>New slots</p>
								<p class="mt-1 font-medium text-foreground">2 openings</p>
							</div>
							<div class="border p-3">
								<p>Lead time</p>
								<p class="mt-1 font-medium text-foreground">1–2 weeks</p>
							</div>
							<div class="border p-3">
								<p>Timezone</p>
								<p class="mt-1 font-medium text-foreground">UTC±0</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
