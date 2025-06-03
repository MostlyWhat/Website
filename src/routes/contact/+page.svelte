<script lang="ts">
	import HeroPage from '$lib/components/sections/hero/hero-page.svelte';
	import Button from '../../lib/components/ui/button/button.svelte';
	import CTASmall from '$lib/components/sections/cta/cta-small.svelte';
</script>

<HeroPage />
<section class="">
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
		<div class="col-span-1 md:col-span-2 min-h-80">
			<div class="h-full bg-card rounded-md shadow-xs p-4 flex flex-col justify-between">
				<div>
					<p class="mb-2 font-chakra text-xs uppercase">// Communicate</p>
					<h3 class="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase">Reach Out</h3>
					<p class="mt-3 text-sm text-muted-foreground max-w-md">
						There are many ways you can connect with us. We are here to assist you in every step of the way.
					</p>
				</div>
			</div>
		</div>

		<!-- Social Links Card -->
		<div class="col-span-1 min-h-80">
			<div class="h-full flex flex-col rounded-md shadow-xs bg-primary text-primary-foreground">
				<div class="p-4 border-b border-primary-foreground/20">
					<p class="font-chakra text-xs uppercase">&gt; Connect</p>
				</div>
				<div class="flex-1 p-4 flex flex-col justify-between">
					<p class="text-sm">Connect with us on social media</p>
					<div class="mt-auto pt-4">
						<ul class="font-chakra uppercase text-sm">
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
			<div class="h-full flex flex-col rounded-md shadow-xs bg-destructive text-secondary-foreground justify-between">
				<div class="p-4 border-b border-secondary-foreground/20">
					<p class="font-chakra text-xs uppercase">&gt; Important Notice</p>
				</div>
				<div class="flex-1 flex flex-col">
					<p class="text-sm p-4">Latest announcements and critical updates</p>
				</div>
				<Button class="self-end mt-auto bg-secondary-foreground text-secondary" size="lg" variant="outline">
					More Information
				</Button>
			</div>
		</div>
	</div>
	<div class="h-full bg-card rounded-md shadow-xs p-4 flex flex-col justify-between border-t">
		<div>
			<p class="mb-2 font-chakra text-xs uppercase">// Select a channel</p>
			<h3 class="font-heading text-3xl sm:text-4xl md:text-5xl font-black uppercase">Communication Channels</h3>
		</div>
	</div>
	<div
		class="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 bg-background border divide-x h-full">
		<div class="h-full flex flex-col justify-between">
			<div class="p-4">
				<p class="mb-2 font-chakra text-xs uppercase">// Option 1</p>
				<h3 class="font-heading text-2xl font-black uppercase">Product Support</h3>
				<p class="mt-4 text-sm text-muted-foreground max-w-md">Find information and resources to help you get
					started.</p>
			</div>
			<Button class="mt-8 self-end" size="lg" variant="secondary">Read more</Button>
		</div>
		<div class="h-full flex flex-col justify-between">
			<div class="p-4">
				<p class="mb-2 font-chakra text-xs uppercase">// Option 2</p>
				<h3 class="font-heading text-2xl font-black uppercase">Technical Support</h3>
				<p class="mt-4 text-sm text-muted-foreground max-w-md">Can't find what you're looking for? Get in touch
					with our support team.</p>
			</div>
			<Button class="mt-8 self-end" size="lg" variant="secondary">Read more</Button>
		</div>
		<div class="h-full flex flex-col justify-between">
			<div class="p-4">
				<p class="mb-2 font-chakra text-xs uppercase">// Option 3</p>
				<h3 class="font-heading text-2xl font-black uppercase">Feedback Form</h3>
				<p class="mt-4 text-sm text-muted-foreground max-w-md">Let us know how we can improve our services
					and products.</p>
			</div>
			<Button class="mt-8 self-end" size="lg" variant="secondary">Read more</Button>
		</div>
		<div class="h-full flex flex-col justify-between">
			<div class="p-4">
				<p class="mb-2 font-chakra text-xs uppercase">// Option 4</p>
				<h3 class="font-heading text-2xl font-black uppercase">Emergency Contact</h3>
				<p class="mt-4 text-sm text-muted-foreground max-w-md">Report critical issues or vulnerability that needs
					immediate attention.</p>
			</div>
			<Button class="mt-8 self-end" size="lg" variant="secondary">Read more</Button>
		</div>
	</div>
</section>
<CTASmall />