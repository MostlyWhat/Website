<script lang="ts">
	import HeroPage from '$lib/components/sections/hero/hero-page.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
</script>

<HeroPage />
<section class="">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
		<div class="col-span-1 min-h-80 md:col-span-2">
			<div class="bg-card flex h-full flex-col justify-between rounded-md p-4 shadow-xs">
				<div>
					<p class="font-chakra mb-2 text-xs uppercase">// Communicate</p>
					<h3 class="font-heading text-3xl font-black uppercase sm:text-4xl md:text-5xl">
						Reach Out
					</h3>
					<p class="text-muted-foreground mt-3 max-w-md text-sm">
						There are many ways you can connect with us. We are here to assist you in every step of
						the way.
					</p>
				</div>
			</div>
		</div>

		<!-- Social Links Card -->
		<div class="col-span-1 min-h-80">
			<div class="bg-primary text-primary-foreground flex h-full flex-col rounded-md shadow-xs">
				<div class="border-primary-foreground/20 border-b p-4">
					<p class="font-chakra text-xs uppercase">&gt; Connect</p>
				</div>
				<div class="flex flex-1 flex-col justify-between p-4">
					<p class="text-sm">Connect with us on social media</p>
					<div class="mt-auto pt-4">
						<ul class="font-chakra text-sm uppercase">
							<li>Discord</li>
							<li>Twitter</li>
							<li>LinkedIn</li>
							<li>GitHub</li>
							<li>Reddit</li>
							<li>Facebook</li>
							<li>Instagram</li>
							<li>Telegram</li>
						</ul>
					</div>
				</div>
			</div>
		</div>

		<!-- Important Notice Card -->
		<div class="col-span-1 min-h-80">
			<div
				class="bg-destructive text-secondary-foreground flex h-full flex-col justify-between rounded-md shadow-xs"
			>
				<div class="border-secondary-foreground/20 border-b p-4">
					<p class="font-chakra text-xs uppercase">&gt; Important Notice</p>
				</div>
				<div class="flex flex-1 flex-col">
					<p class="p-4 text-sm">Latest announcements and critical updates</p>
				</div>
				<Button
					class="bg-secondary-foreground text-secondary mt-auto self-end"
					size="lg"
					variant="outline"
				>
					More Information
				</Button>
			</div>
		</div>
	</div>
	<div class="bg-card flex h-full flex-col justify-between rounded-md border-t p-4 shadow-xs">
		<div>
			<p class="font-chakra mb-2 text-xs uppercase">// Select a channel</p>
			<h3 class="font-heading text-3xl font-black uppercase sm:text-4xl md:text-5xl">
				Communication Channels
			</h3>
		</div>
	</div>
	<div
		class="bg-background relative grid h-full grid-cols-1 gap-0 divide-x border sm:grid-cols-2 lg:grid-cols-4"
	>
		<div class="flex h-full flex-col justify-between">
			<div class="p-4">
				<p class="font-chakra mb-2 text-xs uppercase">// Option 1</p>
				<h3 class="font-heading text-2xl font-black uppercase">Product Support</h3>
				<p class="text-muted-foreground mt-4 max-w-md text-sm">
					Find information and resources to help you get started.
				</p>
			</div>
			<Button class="mt-8 self-end" size="lg" variant="secondary">Read more</Button>
		</div>
		<div class="flex h-full flex-col justify-between">
			<div class="p-4">
				<p class="font-chakra mb-2 text-xs uppercase">// Option 2</p>
				<h3 class="font-heading text-2xl font-black uppercase">Technical Support</h3>
				<p class="text-muted-foreground mt-4 max-w-md text-sm">
					Can't find what you're looking for? Get in touch with our support team.
				</p>
			</div>
			<Button class="mt-8 self-end" size="lg" variant="secondary">Read more</Button>
		</div>
		<div class="flex h-full flex-col justify-between">
			<div class="p-4">
				<p class="font-chakra mb-2 text-xs uppercase">// Option 3</p>
				<h3 class="font-heading text-2xl font-black uppercase">Feedback Form</h3>
				<p class="text-muted-foreground mt-4 max-w-md text-sm">
					Let us know how we can improve our services and products.
				</p>
			</div>
			<Button class="mt-8 self-end" size="lg" variant="secondary">Read more</Button>
		</div>
		<div class="flex h-full flex-col justify-between">
			<div class="p-4">
				<p class="font-chakra mb-2 text-xs uppercase">// Option 4</p>
				<h3 class="font-heading text-2xl font-black uppercase">Emergency Contact</h3>
				<p class="text-muted-foreground mt-4 max-w-md text-sm">
					Report critical issues or vulnerability that needs immediate attention.
				</p>
			</div>
			<Button class="mt-8 self-end" size="lg" variant="secondary">Read more</Button>
		</div>
	</div>
</section>
