<script>
	import Button from '../../ui/button/button.svelte';
	import Facebook from '@lucide/svelte/icons/facebook';
</script>

<!--
  News Header Grid Layout
  - Mobile: Single column stacked layout
  - Tablet: 2-column layout with main header spanning 2 columns
  - Desktop: 4-column layout with distinct sections
-->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
	<!-- Main News Header - spans 2 columns on tablet+ -->
	<div class="col-span-1 md:col-span-2 min-h-80">
		<div class="h-full bg-card rounded-md shadow-sm p-4 flex flex-col justify-between">
			<div>
				<p class="mb-2 font-mono text-xs uppercase">// Communications</p>
				<h3 class="font-sans text-3xl sm:text-4xl md:text-5xl font-black uppercase">Latest Updates</h3>
				<p class="mt-3 text-sm text-muted-foreground max-w-md">
					Stay connected with the latest news, including upcoming releases, updates, and communications from the team.
				</p>
			</div>
			<Button class="mt-6 self-start" size="lg">
				See all news
			</Button>
		</div>
	</div>

	<!-- Social Links Card -->
	<div class="col-span-1 min-h-80">
		<div class="h-full flex flex-col rounded-md shadow-sm bg-primary text-primary-foreground">
			<div class="p-4 border-b border-primary-foreground/20">
				<p class="font-mono text-xs uppercase">&gt; Connect</p>
			</div>
			<div class="flex-1 p-4 flex flex-col justify-between">
				<p class="text-sm">Connect with us on social media</p>
				<div class="mt-auto pt-4">
					<ul class="font-mono uppercase text-sm">
						<li>[] Discord</li>
						<li>Twitter</li>
						<li>LinkedIn</li>
						<li>GitHub</li>
						<li>Reddit</li>
						<li class="flex flex-row items-center">[
							<Facebook class="w-3 h-3" />
							] Facebook
						</li>
						<li>Instagram</li>
						<li>Telegram</li>
					</ul>
				</div>
			</div>
		</div>
	</div>

	<!-- Important Notice Card -->
	<div class="col-span-1 min-h-80">
		<div class="h-full flex flex-col rounded-md shadow-sm bg-destructive text-secondary-foreground">
			<div class="p-4 border-b border-secondary-foreground/20">
				<p class="font-mono text-xs uppercase">&gt; Important Notice</p>
			</div>
			<div class="flex-1 flex flex-col">
				<p class="text-sm p-4">Latest announcements and critical updates</p>
				<Button class="mt-auto bg-secondary-foreground text-secondary" size="lg" variant="outline">
					More Information
				</Button>
			</div>
		</div>
	</div>
</div>