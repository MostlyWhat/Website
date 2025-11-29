<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Section from '$lib/components/layout/Section.svelte';
	import Grid from '$lib/components/layout/Grid.svelte';
	import Tile from '$lib/components/layout/Tile.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { ArrowRight, Copy, Check, Palette, Type, Layout, Layers, Zap, Box } from '@lucide/svelte';

	let copiedItem = $state<string | null>(null);

	function copyToClipboard(text: string, id: string) {
		navigator.clipboard.writeText(text);
		copiedItem = id;
		setTimeout(() => copiedItem = null, 2000);
	}

	const colors = [
		{ name: 'Cobalt 500', var: '--cobalt-500', hex: '#00A3FF', class: 'bg-primary' },
		{ name: 'Yellow 500', var: '--yellow-500', hex: '#FFD500', class: 'bg-yellow-500' },
		{ name: 'Red 500', var: '--red-500', hex: '#EF4444', class: 'bg-red-500' },
		{ name: 'Black 950', var: '--black-950', hex: '#000814', class: 'bg-background' },
		{ name: 'Black 900', var: '--black-900', hex: '#001122', class: 'bg-card' },
		{ name: 'Border', var: '--border', hex: '#1a2744', class: 'bg-border' }
	];

	const fonts = [
		{ name: 'Tourney', var: '--font-display', usage: 'Display/Headlines', class: 'font-display', sample: 'BUILDING WORLDS' },
		{ name: 'Hubot Sans', var: '--font-body', usage: 'Body/Paragraphs', class: 'font-body', sample: 'The quick brown fox jumps over the lazy dog.' },
		{ name: 'Chakra Petch', var: '--font-ui', usage: 'UI/Buttons/Labels', class: 'font-ui', sample: 'START A PROJECT' },
		{ name: 'JetBrains Mono', var: '--font-mono', usage: 'Code/Technical', class: 'font-mono', sample: 'const hello = "world";' }
	];

	const sections = [
		{ id: 'colors', title: 'Colors', icon: Palette },
		{ id: 'typography', title: 'Typography', icon: Type },
		{ id: 'components', title: 'Components', icon: Box },
		{ id: 'layout', title: 'Layout', icon: Layout },
		{ id: 'animations', title: 'Animations', icon: Zap },
		{ id: 'patterns', title: 'Patterns', icon: Layers }
	];
</script>

<svelte:head>
	<title>{m.nav_docs()} — {m.site_name()}</title>
	<meta name="description" content="Design system documentation for MostlyWhat Systems" />
</svelte:head>

<!-- Hero Section -->
<Section padding="xl">
	<div class="mx-auto max-w-3xl text-center" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Documentation</p>
		<h1 class="vt-title mb-6 text-4xl md:text-5xl lg:text-6xl">Design System</h1>
		<p class="font-body text-lg text-muted-foreground md:text-xl">
			A comprehensive guide to our design language, components, and patterns.
		</p>
	</div>
</Section>

<!-- Quick Navigation -->
<Section padding="none" class="border-b border-border">
	<div class="flex flex-wrap gap-2 py-4" use:scrollAnimate={{ animation: 'fade' }}>
		{#each sections as { id, title, icon: Icon }}
			<a
				href="#{id}"
				class="font-ui flex items-center gap-2 border border-border px-4 py-2 text-sm transition-colors hover:bg-muted hover:text-primary"
			>
				<Icon class="h-4 w-4" />
				{title}
			</a>
		{/each}
	</div>
</Section>

<!-- Colors Section -->
<Section id="colors">
	<div class="mb-8" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Foundation</p>
		<h2 class="h2 text-3xl">Colors</h2>
		<p class="font-body mt-2 text-muted-foreground">
			Our color palette is built around cobalt blue, with accents of yellow and red on a dark background.
		</p>
	</div>

	<div class="stagger-children grid gap-4 md:grid-cols-2 lg:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each colors as color}
			<Tile padding="none" class="overflow-hidden">
				<div class="h-24 {color.class} border-b border-border"></div>
				<div class="p-4">
					<div class="flex items-center justify-between">
						<div>
							<p class="font-ui font-semibold">{color.name}</p>
							<p class="font-mono text-sm text-muted-foreground">{color.hex}</p>
						</div>
						<button
							type="button"
							onclick={() => copyToClipboard(color.var, color.name)}
							class="flex h-8 w-8 items-center justify-center border border-border transition-colors hover:bg-muted"
						>
							{#if copiedItem === color.name}
								<Check class="h-4 w-4 text-primary" />
							{:else}
								<Copy class="h-4 w-4" />
							{/if}
						</button>
					</div>
					<p class="font-mono mt-2 text-xs text-muted-foreground">var({color.var})</p>
				</div>
			</Tile>
		{/each}
	</div>
</Section>

<!-- Typography Section -->
<Section id="typography" background="card">
	<div class="mb-8" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Foundation</p>
		<h2 class="h2 text-3xl">Typography</h2>
		<p class="font-body mt-2 text-muted-foreground">
			Four distinct typefaces for different purposes: display, body, UI, and code.
		</p>
	</div>

	<div class="stagger-children space-y-4" use:scrollAnimate={{ animation: 'stagger' }}>
		{#each fonts as font}
			<Tile padding="lg">
				<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div>
						<p class="font-ui text-sm text-primary">{font.usage}</p>
						<p class="{font.class} text-2xl">{font.name}</p>
						<p class="font-mono mt-1 text-xs text-muted-foreground">var({font.var})</p>
					</div>
					<div class="flex-1 md:ml-8">
						<p class="{font.class} text-lg">{font.sample}</p>
					</div>
				</div>
			</Tile>
		{/each}
	</div>

	<!-- Type Scale -->
	<div class="mt-12">
		<h3 class="font-ui mb-4 text-lg font-semibold">Type Scale</h3>
		<Tile padding="lg">
			<div class="space-y-4">
				<p class="text-4xl">Heading 1 (text-4xl)</p>
				<p class="text-3xl">Heading 2 (text-3xl)</p>
				<p class="text-2xl">Heading 3 (text-2xl)</p>
				<p class="text-xl">Heading 4 (text-xl)</p>
				<p class="text-lg">Large Text (text-lg)</p>
				<p class="text-base">Base Text (text-base)</p>
				<p class="text-sm">Small Text (text-sm)</p>
				<p class="text-xs">Extra Small (text-xs)</p>
			</div>
		</Tile>
	</div>
</Section>

<!-- Components Section -->
<Section id="components">
	<div class="mb-8" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">UI Kit</p>
		<h2 class="h2 text-3xl">Components</h2>
		<p class="font-body mt-2 text-muted-foreground">
			Reusable UI components built with shadcn-svelte and customized for our design system.
		</p>
	</div>

	<!-- Buttons -->
	<div class="mb-8">
		<h3 class="font-ui mb-4 text-lg font-semibold">Buttons</h3>
		<Tile padding="lg" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="flex flex-wrap gap-4">
				<Button class="font-ui">Default</Button>
				<Button variant="outline" class="font-ui">Outline</Button>
				<Button variant="secondary" class="font-ui">Secondary</Button>
				<Button variant="ghost" class="font-ui">Ghost</Button>
				<Button variant="destructive" class="font-ui">Destructive</Button>
			</div>
			<div class="mt-4 flex flex-wrap gap-4">
				<Button size="sm" class="font-ui">Small</Button>
				<Button class="font-ui">Default</Button>
				<Button size="lg" class="font-ui">Large</Button>
				<Button size="icon" class="font-ui"><ArrowRight class="h-4 w-4" /></Button>
			</div>
		</Tile>
	</div>

	<!-- Badges -->
	<div class="mb-8">
		<h3 class="font-ui mb-4 text-lg font-semibold">Badges</h3>
		<Tile padding="lg" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="flex flex-wrap gap-4">
				<Badge>Default</Badge>
				<Badge variant="secondary">Secondary</Badge>
				<Badge variant="outline">Outline</Badge>
				<Badge variant="destructive">Destructive</Badge>
			</div>
		</Tile>
	</div>

	<!-- Form Elements -->
	<div class="mb-8">
		<h3 class="font-ui mb-4 text-lg font-semibold">Form Elements</h3>
		<Tile padding="lg" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="grid gap-6 md:grid-cols-2">
				<div class="space-y-2">
					<Label for="demo-input" class="font-ui">Input</Label>
					<Input id="demo-input" placeholder="Enter text..." class="font-body" />
				</div>
				<div class="space-y-2">
					<Label for="demo-textarea" class="font-ui">Textarea</Label>
					<Textarea id="demo-textarea" placeholder="Enter message..." class="font-body" rows={3} />
				</div>
			</div>
		</Tile>
	</div>

	<!-- Tiles -->
	<div class="mb-8">
		<h3 class="font-ui mb-4 text-lg font-semibold">Tiles</h3>
		<div class="stagger-children grid gap-4 md:grid-cols-3" use:scrollAnimate={{ animation: 'stagger' }}>
			<Tile padding="lg">
				<h4 class="font-ui font-semibold">Default Tile</h4>
				<p class="font-body text-sm text-muted-foreground">Standard container</p>
			</Tile>
			<Tile padding="lg" variant="outline">
				<h4 class="font-ui font-semibold">Outline Tile</h4>
				<p class="font-body text-sm text-muted-foreground">Subtle border style</p>
			</Tile>
			<Tile padding="lg" interactive>
				<h4 class="font-ui font-semibold">Interactive Tile</h4>
				<p class="font-body text-sm text-muted-foreground">Hover to see effect</p>
			</Tile>
		</div>
	</div>
</Section>

<!-- Layout Section -->
<Section id="layout" background="card">
	<div class="mb-8" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Structure</p>
		<h2 class="h2 text-3xl">Layout</h2>
		<p class="font-body mt-2 text-muted-foreground">
			Grid-based layout system inspired by IBM Carbon and Metro design.
		</p>
	</div>

	<!-- Grid Examples -->
	<div class="space-y-8">
		<div>
			<h3 class="font-ui mb-4 text-lg font-semibold">Grid System</h3>
			<Grid columns={4}>
				{#each Array(8) as _, i}
					<Tile padding="md" class="text-center">
						<span class="font-mono text-sm">{i + 1}</span>
					</Tile>
				{/each}
			</Grid>
		</div>

		<div>
			<h3 class="font-ui mb-4 text-lg font-semibold">Spacing</h3>
			<Tile padding="lg" use:scrollAnimate={{ animation: 'fade' }}>
				<p class="font-body mb-4 text-muted-foreground">
					Consistent spacing using Tailwind's spacing scale. Primary unit: <code class="font-mono bg-muted px-1">p-4</code> (16px).
				</p>
				<div class="flex flex-wrap gap-4">
					{#each ['p-2', 'p-4', 'p-6', 'p-8'] as spacing}
						<div class="border border-primary bg-primary/10 {spacing}">
							<span class="font-mono text-xs">{spacing}</span>
						</div>
					{/each}
				</div>
			</Tile>
		</div>
	</div>
</Section>

<!-- Animations Section -->
<Section id="animations">
	<div class="mb-8" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Motion</p>
		<h2 class="h2 text-3xl">Animations</h2>
		<p class="font-body mt-2 text-muted-foreground">
			Scroll-based animations using the Intersection Observer API.
		</p>
	</div>

	<div class="stagger-children grid gap-4 md:grid-cols-2" use:scrollAnimate={{ animation: 'stagger' }}>
		<Tile padding="lg">
			<h3 class="font-ui mb-2 font-semibold">Fade In</h3>
			<p class="font-body text-sm text-muted-foreground">Elements fade in from opacity 0 to 1</p>
			<code class="font-mono mt-2 block text-xs text-primary">animation: 'fade'</code>
		</Tile>
		<Tile padding="lg">
			<h3 class="font-ui mb-2 font-semibold">Slide Left</h3>
			<p class="font-body text-sm text-muted-foreground">Elements slide in from the left</p>
			<code class="font-mono mt-2 block text-xs text-primary">animation: 'slide-left'</code>
		</Tile>
		<Tile padding="lg">
			<h3 class="font-ui mb-2 font-semibold">Slide Right</h3>
			<p class="font-body text-sm text-muted-foreground">Elements slide in from the right</p>
			<code class="font-mono mt-2 block text-xs text-primary">animation: 'slide-right'</code>
		</Tile>
		<Tile padding="lg">
			<h3 class="font-ui mb-2 font-semibold">Scale</h3>
			<p class="font-body text-sm text-muted-foreground">Elements scale up from 95% to 100%</p>
			<code class="font-mono mt-2 block text-xs text-primary">animation: 'scale'</code>
		</Tile>
		<Tile padding="lg" class="md:col-span-2">
			<h3 class="font-ui mb-2 font-semibold">Stagger</h3>
			<p class="font-body text-sm text-muted-foreground">
				Children animate sequentially with increasing delays. Add <code class="font-mono bg-muted px-1">stagger-children</code> class to parent.
			</p>
			<code class="font-mono mt-2 block text-xs text-primary">animation: 'stagger'</code>
		</Tile>
	</div>

	<!-- Usage Example -->
	<div class="mt-8">
		<h3 class="font-ui mb-4 text-lg font-semibold">Usage</h3>
		<Tile padding="lg">
			<pre class="font-mono overflow-x-auto text-sm"><code>{`<script>
  import { scrollAnimate } from '$lib/actions/scroll-animate';
</script>

<div use:scrollAnimate={{ animation: 'fade', delay: 200 }}>
  Content here...
</div>`}</code></pre>
		</Tile>
	</div>
</Section>

<!-- Patterns Section -->
<Section id="patterns" background="card">
	<div class="mb-8" use:scrollAnimate={{ animation: 'fade' }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Recipes</p>
		<h2 class="h2 text-3xl">Patterns</h2>
		<p class="font-body mt-2 text-muted-foreground">
			Common UI patterns and compositions used throughout the site.
		</p>
	</div>

	<div class="stagger-children grid gap-6 md:grid-cols-2" use:scrollAnimate={{ animation: 'stagger' }}>
		<Tile padding="lg">
			<h3 class="font-ui mb-4 font-semibold">Section Header</h3>
			<div class="border-l-2 border-primary pl-4">
				<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Label</p>
				<h4 class="h2 text-2xl">Section Title</h4>
				<p class="font-body mt-2 text-sm text-muted-foreground">Optional description text</p>
			</div>
		</Tile>

		<Tile padding="lg">
			<h3 class="font-ui mb-4 font-semibold">Numbered List</h3>
			<div class="flex gap-4">
				<div class="font-display text-4xl text-primary/30">01</div>
				<div>
					<p class="font-ui font-semibold">Item Title</p>
					<p class="font-body text-sm text-muted-foreground">Description</p>
				</div>
			</div>
		</Tile>

		<Tile padding="lg">
			<h3 class="font-ui mb-4 font-semibold">Icon Feature</h3>
			<div class="flex items-start gap-4">
				<div class="flex h-12 w-12 shrink-0 items-center justify-center border border-border">
					<Zap class="h-6 w-6 text-primary" />
				</div>
				<div>
					<p class="font-ui font-semibold">Feature Name</p>
					<p class="font-body text-sm text-muted-foreground">Feature description text</p>
				</div>
			</div>
		</Tile>

		<Tile padding="lg">
			<h3 class="font-ui mb-4 font-semibold">Stat Block</h3>
			<div class="text-center">
				<div class="font-display text-4xl text-primary">100%</div>
				<p class="font-ui mt-1 text-sm uppercase tracking-wider text-muted-foreground">Metric Label</p>
			</div>
		</Tile>
	</div>
</Section>

<!-- Design Principles -->
<Section padding="xl">
	<div class="mx-auto max-w-3xl text-center" use:scrollAnimate={{ animation: 'scale' }}>
		<h2 class="font-display mb-6 text-3xl md:text-4xl">Design Principles</h2>
		<div class="stagger-children grid gap-4 text-left md:grid-cols-3">
			<Tile padding="lg">
				<h3 class="font-ui mb-2 font-semibold">Industrial Precision</h3>
				<p class="font-body text-sm text-muted-foreground">
					No rounded corners. Sharp edges. Grid-based layouts.
				</p>
			</Tile>
			<Tile padding="lg">
				<h3 class="font-ui mb-2 font-semibold">High Contrast</h3>
				<p class="font-body text-sm text-muted-foreground">
					Dark backgrounds with vibrant accents for visual impact.
				</p>
			</Tile>
			<Tile padding="lg">
				<h3 class="font-ui mb-2 font-semibold">Typography First</h3>
				<p class="font-body text-sm text-muted-foreground">
					Clear hierarchy through type scale and weight.
				</p>
			</Tile>
		</div>
	</div>
</Section>
