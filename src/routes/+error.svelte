<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Section from '$lib/components/layout/Section.svelte';
	import Tile from '$lib/components/layout/Tile.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Home, ArrowLeft, Search, FileQuestion } from '@lucide/svelte';
</script>

<svelte:head>
	<title>{m.error_404_title()} — {m.site_name()}</title>
</svelte:head>

<Section padding="xl" class="min-h-[60vh] flex items-center justify-center">
	<div class="text-center" use:scrollAnimate={{ animation: 'scale', startVisible: true }}>
		<!-- 404 Display -->
		<div class="relative mb-8">
			<div class="font-display text-[12rem] leading-none text-primary/10 md:text-[16rem]">404</div>
			<div class="absolute inset-0 flex items-center justify-center">
				<div class="border border-border bg-background p-6">
					<FileQuestion class="h-16 w-16 text-primary" />
				</div>
			</div>
		</div>

		<!-- Error Message -->
		<h1 class="font-display mb-4 text-3xl md:text-4xl">{m.error_404_title()}</h1>
		<p class="font-body mx-auto mb-8 max-w-md text-lg text-muted-foreground">
			{m.error_404_subtitle()}
		</p>

		<!-- Actions -->
		<div class="flex flex-wrap justify-center gap-4">
			<Button href="/" size="lg" class="font-ui">
				<Home class="mr-2 h-5 w-5" />
				{m.error_404_button()}
			</Button>
			<Button variant="outline" size="lg" class="font-ui" onclick={() => history.back()}>
				<ArrowLeft class="mr-2 h-5 w-5" />
				Go Back
			</Button>
		</div>

		<!-- Helpful Links -->
		<div class="mt-12 grid gap-4 text-left sm:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
			<a href="/" class="group">
				<Tile interactive padding="md">
					<h3 class="font-ui font-semibold group-hover:text-primary transition-colors">Home</h3>
					<p class="font-body text-sm text-muted-foreground">Return to the homepage</p>
				</Tile>
			</a>
			<a href="/projects" class="group">
				<Tile interactive padding="md">
					<h3 class="font-ui font-semibold group-hover:text-primary transition-colors">Projects</h3>
					<p class="font-body text-sm text-muted-foreground">View our work</p>
				</Tile>
			</a>
			<a href="/contact" class="group">
				<Tile interactive padding="md">
					<h3 class="font-ui font-semibold group-hover:text-primary transition-colors">Contact</h3>
					<p class="font-body text-sm text-muted-foreground">Get in touch</p>
				</Tile>
			</a>
		</div>

		<!-- Terminal-style message -->
		<div class="mx-auto mt-12 max-w-lg border border-border bg-card p-4 text-left" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="font-mono text-sm">
				<p class="text-muted-foreground">$ <span class="text-primary">curl</span> {'{'}current_url{'}'}</p>
				<p class="mt-2 text-red-400">Error: 404 Not Found</p>
				<p class="text-muted-foreground">The requested resource could not be located.</p>
				<p class="mt-2 text-muted-foreground">$ <span class="animate-pulse">_</span></p>
			</div>
		</div>
	</div>
</Section>
