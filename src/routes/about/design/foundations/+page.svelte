<script lang="ts">
	import DesignHero from '$lib/components/sections/hero/design-hero.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { ArrowLeft, Copy, Check, Palette, Type, Ruler, CornerDownLeft } from '@lucide/svelte/icons';

	let copiedToken = $state('');

	const copyToClipboard = async (text: string, token: string) => {
		try {
			await navigator.clipboard.writeText(text);
			copiedToken = token;
			setTimeout(() => copiedToken = '', 2000);
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	};

	const colorTokens = [
		{ name: 'Background', token: '--background', value: 'oklch(0.141 0.005 285.823)', usage: 'Main background color' },
		{ name: 'Foreground', token: '--foreground', value: 'oklch(0.985 0 0)', usage: 'Primary text color' },
		{ name: 'Primary', token: '--primary', value: 'oklch(0.546 0.245 262.881)', usage: 'Brand color, buttons, links' },
		{ name: 'Secondary', token: '--secondary', value: 'oklch(0.274 0.006 286.033)', usage: 'Secondary backgrounds' },
		{ name: 'Muted', token: '--muted', value: 'oklch(0.274 0.006 286.033)', usage: 'Subtle backgrounds' },
		{ name: 'Border', token: '--border', value: 'oklch(1 0 0 / 10%)', usage: 'Component borders' },
		{ name: 'Destructive', token: '--destructive', value: 'oklch(0.704 0.191 22.216)', usage: 'Error states, warnings' },
		{ name: 'Chart-1', token: '--chart-1', value: 'oklch(0.488 0.243 264.376)', usage: 'Data visualization' }
	];

	const typography = [
		{ name: 'Hubot Sans Variable', usage: 'Primary text, headings', weights: '200-900', class: 'font-sans', sample: 'The quick brown fox jumps over the lazy dog' },
		{ name: 'JetBrains Mono Variable', usage: 'Code, monospace text', weights: '100-800', class: 'font-mono', sample: 'console.log("Hello, World!");' },
		{ name: 'Chakra Petch', usage: 'Buttons, UI elements', weights: '400', class: 'font-chakra', sample: 'BUTTON TEXT - UI ELEMENTS' },
		{ name: 'Tourney', usage: 'Display, special headings', weights: '900', class: 'font-tourney', sample: 'DISPLAY HEADING' }
	];

	const spacing = [
		{ name: 'xs', value: '0.25rem', pixels: '4px', class: 'p-1' },
		{ name: 'sm', value: '0.5rem', pixels: '8px', class: 'p-2' },
		{ name: 'md', value: '1rem', pixels: '16px', class: 'p-4' },
		{ name: 'lg', value: '1.5rem', pixels: '24px', class: 'p-6' },
		{ name: 'xl', value: '2rem', pixels: '32px', class: 'p-8' },
		{ name: '2xl', value: '3rem', pixels: '48px', class: 'p-12' }
	];

	const borderRadius = [
		{ name: 'None', class: 'rounded-none', value: '0px' },
		{ name: 'Small', class: 'rounded-sm', value: '2px' },
		{ name: 'Medium', class: 'rounded-md', value: '6px' },
		{ name: 'Large', class: 'rounded-lg', value: '8px' },
		{ name: 'XL', class: 'rounded-xl', value: '12px' },
		{ name: 'Full', class: 'rounded-full', value: '9999px' }
	];
</script>

<DesignHero
	size="small"
	title="Foundations"
	subtitle="Design Tokens"
	description="The fundamental design tokens that define our visual language: colors, typography, spacing, and border radius."
	breadcrumbs={[
		{ label: 'About', href: '/about' },
		{ label: 'Design System', href: '/about/design' },
		{ label: 'Foundations' }
	]}
	accent="primary"
>
	{#snippet children()}
		<Button href="/about/design" variant="outline" class="font-chakra uppercase">
			<ArrowLeft class="mr-2 h-4 w-4" />
			Back to Design System
		</Button>
	{/snippet}
</DesignHero>

<!-- Main Content -->
<div class="container mx-auto px-4 py-16 space-y-24">

	<!-- Color System Section -->
	<section id="colors" class="space-y-8">
		<div class="space-y-4">
			<div class="flex items-center space-x-3">
				<Palette class="h-6 w-6 text-primary" />
				<Badge variant="outline" class="font-chakra text-xs uppercase tracking-wider">
					Color System
				</Badge>
			</div>
			<h2 class="font-heading text-3xl md:text-4xl font-black uppercase">
				OKLCH Color Space
			</h2>
			<p class="text-muted-foreground text-lg max-w-3xl">
				Our color system uses OKLCH color space for perceptual uniformity and better accessibility.
				All colors are defined as CSS custom properties for easy theming.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each colorTokens as color (color.token)}
				<div class="group relative">
					<!-- Color Preview -->
					<div class="aspect-video relative rounded-lg overflow-hidden border border-border/20">
						<div class="absolute inset-0" style="background-color: {color.value}"></div>

						<!-- Overlay Info -->
						<div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							<div class="absolute bottom-4 left-4 right-4">
								<h4 class="text-white font-heading text-lg font-bold uppercase mb-1">
									{color.name}
								</h4>
								<p class="text-white/80 text-sm">
									{color.usage}
								</p>
							</div>
						</div>
					</div>

					<!-- Token Details -->
					<div class="mt-4 space-y-3">
						<div class="flex items-center justify-between">
							<h4 class="font-heading text-lg font-bold uppercase">
								{color.name}
							</h4>
							<button
								class="inline-flex items-center px-3 py-1 bg-muted hover:bg-muted/80 rounded text-xs font-mono transition-colors"
								onclick={() => copyToClipboard(`var(${color.token})`, color.token)}
							>
								<span>var({color.token})</span>
								{#if copiedToken === color.token}
									<Check class="ml-2 h-3 w-3 text-green-500" />
								{:else}
									<Copy class="ml-2 h-3 w-3" />
								{/if}
							</button>
						</div>

						<p class="text-muted-foreground text-sm">
							{color.usage}
						</p>

						<div class="text-xs text-muted-foreground font-mono bg-muted/30 p-2 rounded">
							{color.value}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Typography Section -->
	<section id="typography" class="space-y-8">
		<div class="space-y-4">
			<div class="flex items-center space-x-3">
				<Type class="h-6 w-6 text-secondary" />
				<Badge variant="outline" class="font-chakra text-xs uppercase tracking-wider">
					Typography
				</Badge>
			</div>
			<h2 class="font-heading text-3xl md:text-4xl font-black uppercase">
				Variable Font System
			</h2>
			<p class="text-muted-foreground text-lg max-w-3xl">
				Our typography system uses variable fonts for optimal performance and flexible design control.
			</p>
		</div>

		<div class="space-y-8">
			{#each typography as font (font.name)}
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
					<!-- Font Info -->
					<div class="space-y-4">
						<div class="space-y-2">
							<h3 class="font-heading text-xl font-bold uppercase">
								{font.name}
							</h3>
							<p class="text-muted-foreground text-sm">
								{font.usage}
							</p>
						</div>

						<div class="space-y-2 text-sm">
							<div class="flex items-center space-x-2">
								<span class="font-chakra text-xs uppercase text-muted-foreground">Weights:</span>
								<span>{font.weights}</span>
							</div>
							<div class="flex items-center space-x-2">
								<span class="font-chakra text-xs uppercase text-muted-foreground">Class:</span>
								<code class="bg-muted px-2 py-1 rounded text-xs">{font.class}</code>
							</div>
						</div>
					</div>

					<!-- Font Sample -->
					<div class="space-y-4 p-6 bg-gradient-to-br from-card to-muted/20 rounded-lg border border-border/20">
						<div class="text-2xl {font.class} leading-tight">
							{font.sample}
						</div>
						<div class="text-xs {font.class} text-muted-foreground uppercase tracking-wider">
							ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789
						</div>
					</div>
				</div>
			{/each}
		</div>

		<!-- Type Scale -->
		<div class="space-y-6 p-8 bg-gradient-to-br from-secondary/5 to-secondary/10 rounded-lg border border-border/20">
			<h3 class="font-heading text-xl font-bold uppercase">
				Type Scale
			</h3>
			<div class="space-y-4">
				<div class="text-4xl font-bold">Heading 1 (text-4xl)</div>
				<div class="text-3xl font-bold">Heading 2 (text-3xl)</div>
				<div class="text-2xl font-semibold">Heading 3 (text-2xl)</div>
				<div class="text-xl font-semibold">Heading 4 (text-xl)</div>
				<div class="text-lg font-medium">Heading 5 (text-lg)</div>
				<div class="text-base">Body Large (text-base)</div>
				<div class="text-sm">Body (text-sm)</div>
				<div class="text-xs">Caption (text-xs)</div>
			</div>
		</div>
	</section>

	<!-- Spacing Section -->
	<section id="spacing" class="space-y-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
			<!-- Spacing System -->
			<div class="space-y-6">
				<div class="space-y-4">
					<div class="flex items-center space-x-3">
						<Ruler class="h-6 w-6 text-destructive" />
						<Badge variant="outline" class="font-chakra text-xs uppercase tracking-wider">
							Spacing System
						</Badge>
					</div>
					<h3 class="font-heading text-2xl md:text-3xl font-black uppercase">
						4px Grid Scale
					</h3>
					<p class="text-muted-foreground">
						Consistent spacing scale based on multiples of 4px for visual rhythm and alignment.
					</p>
				</div>

				<div class="space-y-4">
					{#each spacing as space (space.name)}
						<div class="flex items-center space-x-4 p-3 bg-card rounded border border-border/20">
							<div class="w-12 text-sm font-chakra uppercase">{space.name}</div>
							<div class="w-12 text-xs text-muted-foreground">{space.pixels}</div>
							<div class="flex-1">
								<div class="bg-destructive h-4 rounded transition-all duration-300 hover:h-6" style="width: {space.value}"></div>
							</div>
							<code class="text-xs bg-muted px-2 py-1 rounded">{space.class}</code>
						</div>
					{/each}
				</div>
			</div>

			<!-- Border Radius -->
			<div class="space-y-6">
				<div class="space-y-4">
					<div class="flex items-center space-x-3">
						<CornerDownLeft class="h-6 w-6 text-muted-foreground" />
						<Badge variant="outline" class="font-chakra text-xs uppercase tracking-wider">
							Border Radius
						</Badge>
					</div>
					<h3 class="font-heading text-2xl md:text-3xl font-black uppercase">
						Rounded Corners
					</h3>
					<p class="text-muted-foreground">
						Consistent border radius system for component styling.
					</p>
				</div>

				<div class="grid grid-cols-2 gap-4">
					{#each borderRadius as radius (radius.name)}
						<div class="text-center space-y-3 p-4 bg-card rounded border border-border/20">
							<div class="w-16 h-16 bg-primary mx-auto {radius.class} transition-all duration-300 hover:scale-110"></div>
							<div>
								<div class="text-sm font-medium">{radius.name}</div>
								<code class="text-xs text-muted-foreground">{radius.class}</code>
								<div class="text-xs text-muted-foreground mt-1">{radius.value}</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>
</div>
