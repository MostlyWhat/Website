<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Switch } from '$lib/components/ui/switch';
	import { Label } from '$lib/components/ui/label';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Progress } from '$lib/components/ui/progress';
	import { Separator } from '$lib/components/ui/separator';
	import { GlitchText } from '$lib/components/ui/glitch-text';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Kbd } from '$lib/components/ui/kbd';
	import CTASection from '$lib/components/layout/CTASection.svelte';
	import { ArrowRight, Copy, Check, Palette, Type, Layout, Layers, Zap, Box, Grid3x3, Component } from '@lucide/svelte';

	let copiedItem = $state<string | null>(null);
	let switchValue = $state(true);
	let progressValue = $state(75);

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
		{ name: 'Tourney', var: 'font-display', usage: 'Headlines', class: 'font-display', sample: 'BUILDING WORLDS' },
		{ name: 'Hubot Sans', var: 'font-body', usage: 'Body Text', class: 'font-body', sample: 'The quick brown fox jumps over the lazy dog.' },
		{ name: 'Chakra Petch', var: 'font-ui', usage: 'UI/Buttons', class: 'font-ui', sample: 'START A PROJECT' },
		{ name: 'JetBrains Mono', var: 'font-mono', usage: 'Code/Labels', class: 'font-mono', sample: 'const hello = "world";' }
	];

	const sections = [
		{ id: 'grid', title: 'GRID SYSTEM', icon: Grid3x3 },
		{ id: 'colors', title: 'COLORS', icon: Palette },
		{ id: 'typography', title: 'TYPOGRAPHY', icon: Type },
		{ id: 'components', title: 'COMPONENTS', icon: Box },
		{ id: 'layout', title: 'LAYOUT', icon: Component },
		{ id: 'animations', title: 'ANIMATIONS', icon: Zap },
		{ id: 'patterns', title: 'PATTERNS', icon: Layers }
	];
</script>

<svelte:head>
	<title>Documentation — {m.site_name()}</title>
	<meta name="description" content="Design system documentation for MostlyWhat Systems" />
</svelte:head>

<!-- Hero Section - Full Viewport -->
<section class="relative flex h-[calc(100dvh-6rem)] flex-col border-b border-border">
	<!-- Image Background -->
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<img 
			src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?q=80&w=2064&auto=format&fit=crop" 
			alt="" 
			class="h-full w-full object-cover brightness-[0.15]"
		/>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content - Positioned at Bottom -->
	<div class="flex flex-1 flex-col justify-end px-6 pb-8 md:px-8 lg:px-12" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid grid-cols-12 gap-4">
			<div class="col-span-12 lg:col-span-8">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">REFERENCE</span>
				<h1 class="font-display mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl">
					DESIGN SYSTEM
				</h1>
			</div>
			<div class="col-span-12 flex flex-col justify-end lg:col-span-4">
				<p class="font-body text-muted-foreground">A comprehensive guide to our design language, grid system, components, and patterns.</p>
			</div>
		</div>
	</div>

	<!-- Stats Bar -->
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
		<div class="col-span-4 bg-card/80 p-4 backdrop-blur-sm">
			<span class="font-display text-lg font-bold text-primary md:text-2xl">12</span>
			<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">COLUMNS</p>
		</div>
		<div class="col-span-4 bg-card/80 p-4 backdrop-blur-sm">
			<span class="font-display text-lg font-bold text-primary md:text-2xl">64PX</span>
			<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">GRID SIZE</p>
		</div>
		<div class="col-span-4 bg-card/80 p-4 backdrop-blur-sm">
			<span class="font-display text-lg font-bold text-primary md:text-2xl">4</span>
			<p class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">FONTS</p>
		</div>
	</div>
</section>

<!-- Quick Navigation -->
<section class="border-b border-border">
	<div class="grid grid-cols-8 gap-px bg-border">
		<div class="flex items-center justify-center bg-card px-6 py-4 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">JUMP TO</span>
		</div>
		{#each sections as { id, title, icon: Icon } (id)}
			<a
				href="#{id}"
				class="font-mono flex items-center justify-center gap-2 bg-background px-4 py-4 text-xs tracking-wider text-muted-foreground transition-colors hover:bg-card hover:text-primary"
			>
				<Icon class="h-3.5 w-3.5" />
				<span class="hidden sm:inline">{title}</span>
			</a>
		{/each}
	</div>
</section>

<!-- Grid System Section -->
<section id="grid" class="min-h-[80vh] border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Section Header -->
		<div class="col-span-12 bg-background p-8 lg:col-span-4 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">FOUNDATION</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">GRID SYSTEM</h2>
			<p class="font-body mt-4 text-muted-foreground">
				12-column grid with 1px gap borders. All elements align to the grid for visual consistency.
			</p>
		</div>
		
		<!-- Grid Demo -->
		<div class="col-span-12 bg-card p-8 lg:col-span-8 lg:p-12">
			<p class="font-mono mb-4 text-[10px] tracking-widest text-muted-foreground">12-COLUMN GRID</p>
			<div class="grid grid-cols-12 gap-px bg-border">
				{#each Array(12) as _, i (i)}
					<div class="flex items-center justify-center bg-background py-4">
						<span class="font-mono text-xs text-muted-foreground">{i + 1}</span>
					</div>
				{/each}
			</div>
			
			<p class="font-mono mb-4 mt-8 text-[10px] tracking-widest text-muted-foreground">COMMON PATTERNS</p>
			<div class="space-y-2">
				<div class="grid grid-cols-12 gap-px bg-border">
					<div class="col-span-3 flex items-center justify-center bg-primary/20 py-3"><span class="font-mono text-xs">3</span></div>
					<div class="col-span-9 flex items-center justify-center bg-background py-3"><span class="font-mono text-xs">9</span></div>
				</div>
				<div class="grid grid-cols-12 gap-px bg-border">
					<div class="col-span-4 flex items-center justify-center bg-primary/20 py-3"><span class="font-mono text-xs">4</span></div>
					<div class="col-span-4 flex items-center justify-center bg-background py-3"><span class="font-mono text-xs">4</span></div>
					<div class="col-span-4 flex items-center justify-center bg-background py-3"><span class="font-mono text-xs">4</span></div>
				</div>
				<div class="grid grid-cols-12 gap-px bg-border">
					<div class="col-span-6 flex items-center justify-center bg-primary/20 py-3"><span class="font-mono text-xs">6</span></div>
					<div class="col-span-6 flex items-center justify-center bg-background py-3"><span class="font-mono text-xs">6</span></div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Colors Section -->
<section id="colors" class="min-h-[80vh] border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Section Header -->
		<div class="col-span-12 bg-background p-8 lg:col-span-3 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">FOUNDATION</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">COLORS</h2>
			<p class="font-body mt-4 text-muted-foreground">
				Cobalt blue primary, with yellow and red accents on dark backgrounds.
			</p>
		</div>
		
		<!-- Color Swatches -->
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border lg:col-span-9 lg:grid-cols-3">
			{#each colors as color (color.name)}
				<div class="flex flex-col bg-background">
					<div class="h-24 {color.class}"></div>
					<div class="flex items-center justify-between p-4">
						<div>
							<p class="font-ui text-sm font-semibold">{color.name}</p>
							<p class="font-mono text-xs text-muted-foreground">{color.hex}</p>
						</div>
						<button
							type="button"
							onclick={() => copyToClipboard(color.var, color.name)}
							class="flex h-8 w-8 items-center justify-center border border-border transition-colors hover:bg-card"
						>
							{#if copiedItem === color.name}
								<Check class="h-4 w-4 text-primary" />
							{:else}
								<Copy class="h-4 w-4" />
							{/if}
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Typography Section -->
<section id="typography" class="min-h-[80vh] border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Section Header -->
		<div class="col-span-12 bg-card p-8 lg:col-span-3 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">FOUNDATION</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">TYPOGRAPHY</h2>
			<p class="font-body mt-4 text-muted-foreground">
				Four distinct typefaces for display, body, UI, and code.
			</p>
		</div>
		
		<!-- Font Samples -->
		<div class="col-span-12 grid grid-cols-1 gap-px bg-border lg:col-span-9 lg:grid-cols-2">
			{#each fonts as font (font.name)}
				<div class="flex flex-col bg-background p-6">
					<span class="font-mono text-[10px] tracking-widest text-primary">{font.usage.toUpperCase()}</span>
					<p class="{font.class} mt-2 text-2xl">{font.name}</p>
					<p class="{font.class} mt-4 text-lg text-muted-foreground">{font.sample}</p>
					<p class="font-mono mt-4 text-xs text-muted-foreground">.{font.var}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Components Section -->
<section id="components" class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Section Header -->
		<div class="col-span-12 bg-background px-6 py-8 md:px-12 lg:col-span-3 lg:px-16 lg:py-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">UI KIT</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">COMPONENTS</h2>
			<p class="font-body mt-4 text-muted-foreground">
				Reusable UI components built with shadcn-svelte.
			</p>
		</div>
		
		<!-- Component Demos -->
		<div class="col-span-12 grid grid-cols-1 gap-px bg-border lg:col-span-9">
			<!-- Buttons -->
			<div class="bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">BUTTONS</span>
				<div class="mt-4 flex flex-wrap gap-4">
					<Button class="font-ui">DEFAULT</Button>
					<Button variant="outline" class="font-ui">OUTLINE</Button>
					<Button variant="secondary" class="font-ui">SECONDARY</Button>
					<Button variant="ghost" class="font-ui">GHOST</Button>
					<Button size="lg" class="font-ui">LARGE</Button>
					<Button size="sm" class="font-ui">SMALL</Button>
				</div>
			</div>
			
			<!-- Glitch Text -->
			<div class="bg-card px-6 py-6 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">GLITCH TEXT</span>
				<p class="font-body mt-2 text-xs text-muted-foreground">Hover over text to see effect</p>
				<div class="mt-4 flex flex-wrap items-center gap-6">
					<GlitchText text="HOVER ME" class="font-display text-2xl font-bold uppercase" />
					<Button class="font-ui"><GlitchText text="BUTTON WITH GLITCH" /></Button>
				</div>
			</div>
			
			<!-- Badges -->
			<div class="bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">BADGES</span>
				<div class="mt-4 flex flex-wrap gap-4">
					<Badge>DEFAULT</Badge>
					<Badge variant="secondary">SECONDARY</Badge>
					<Badge variant="outline">OUTLINE</Badge>
					<Badge variant="destructive">DESTRUCTIVE</Badge>
				</div>
			</div>
			
			<!-- Form Elements -->
			<div class="bg-card px-6 py-6 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">FORM ELEMENTS</span>
				<div class="mt-4 grid max-w-2xl grid-cols-2 gap-4">
					<div>
						<Label class="font-mono text-[10px]">INPUT</Label>
						<Input placeholder="ENTER TEXT..." class="font-mono mt-2 text-xs uppercase tracking-wider" />
					</div>
					<div>
						<Label class="font-mono text-[10px]">TEXTAREA</Label>
						<Textarea placeholder="LONGER TEXT..." class="font-mono mt-2 text-xs tracking-wider" rows={2} />
					</div>
				</div>
				<div class="mt-4 flex items-center gap-4">
					<div class="flex items-center gap-2">
						<Switch bind:checked={switchValue} />
						<Label class="font-mono text-[10px]">SWITCH {switchValue ? 'ON' : 'OFF'}</Label>
					</div>
				</div>
			</div>
			
			<!-- Accordion -->
			<div class="bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ACCORDION</span>
				<div class="mt-4 max-w-xl">
					<Accordion.Root class="divide-y divide-border border border-border">
						<Accordion.Item value="item-1">
							<Accordion.Trigger class="font-ui px-4 py-3 text-xs tracking-wider">FIRST ITEM</Accordion.Trigger>
							<Accordion.Content class="font-body px-4 pb-3 text-sm text-muted-foreground">Content for the first accordion item.</Accordion.Content>
						</Accordion.Item>
						<Accordion.Item value="item-2">
							<Accordion.Trigger class="font-ui px-4 py-3 text-xs tracking-wider">SECOND ITEM</Accordion.Trigger>
							<Accordion.Content class="font-body px-4 pb-3 text-sm text-muted-foreground">Content for the second accordion item.</Accordion.Content>
						</Accordion.Item>
					</Accordion.Root>
				</div>
			</div>
			
			<!-- Progress & Spinner -->
			<div class="bg-card px-6 py-6 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PROGRESS & LOADING</span>
				<div class="mt-4 max-w-xl space-y-4">
					<div>
						<Label class="font-mono text-[10px]">PROGRESS {progressValue}%</Label>
						<Progress value={progressValue} class="mt-2" />
					</div>
					<div class="flex items-center gap-4">
						<Spinner size="sm" />
						<Spinner size="default" />
						<Spinner size="lg" />
						<span class="font-mono text-[10px] text-muted-foreground">SPINNER SIZES</span>
					</div>
				</div>
			</div>
			
			<!-- Keyboard Shortcuts -->
			<div class="bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">KEYBOARD</span>
				<div class="mt-4 flex flex-wrap items-center gap-4">
					<div class="flex items-center gap-1">
						<Kbd>⌘</Kbd><Kbd>K</Kbd>
						<span class="font-mono ml-2 text-[10px] text-muted-foreground">Command menu</span>
					</div>
					<div class="flex items-center gap-1">
						<Kbd>⌘</Kbd><Kbd>S</Kbd>
						<span class="font-mono ml-2 text-[10px] text-muted-foreground">Save</span>
					</div>
					<div class="flex items-center gap-1">
						<Kbd>Esc</Kbd>
						<span class="font-mono ml-2 text-[10px] text-muted-foreground">Close</span>
					</div>
				</div>
			</div>
			
			<!-- Separator -->
			<div class="bg-card px-6 py-6 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SEPARATOR</span>
				<div class="mt-4 space-y-4">
					<p class="font-body text-sm text-muted-foreground">Horizontal separator</p>
					<Separator />
					<div class="flex h-8 items-center gap-4">
						<span class="font-mono text-xs">ITEM 1</span>
						<Separator orientation="vertical" />
						<span class="font-mono text-xs">ITEM 2</span>
						<Separator orientation="vertical" />
						<span class="font-mono text-xs">ITEM 3</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Layout Components Section -->
<section id="layout" class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Section Header -->
		<div class="col-span-12 bg-card px-6 py-8 md:px-12 lg:col-span-3 lg:px-16 lg:py-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LAYOUTS</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">LAYOUT</h2>
			<p class="font-body mt-4 text-muted-foreground">
				Reusable layout components and sections.
			</p>
		</div>
		
		<!-- Layout Demos -->
		<div class="col-span-12 grid grid-cols-1 gap-px bg-border lg:col-span-9">
			<!-- CTA Variants -->
			<div class="bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CTA SECTION VARIANTS</span>
				<p class="font-body mt-2 text-xs text-muted-foreground">Available variants: default, compact, minimal, split, large</p>
				<div class="mt-4 space-y-2">
					<code class="font-mono block text-xs text-primary">&lt;CTASection variant="default" title="..." /&gt;</code>
					<code class="font-mono block text-xs text-primary">&lt;CTASection variant="compact" title="..." /&gt;</code>
					<code class="font-mono block text-xs text-primary">&lt;CTASection variant="minimal" title="..." /&gt;</code>
					<code class="font-mono block text-xs text-primary">&lt;CTASection variant="split" title="..." stats=&#123;[...]&#125; /&gt;</code>
					<code class="font-mono block text-xs text-primary">&lt;CTASection variant="large" title="..." /&gt;</code>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Animations Section -->
<section id="animations" class="min-h-[60vh] border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Section Header -->
		<div class="col-span-12 bg-card p-8 lg:col-span-3 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">MOTION</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">ANIMATIONS</h2>
			<p class="font-body mt-4 text-muted-foreground">
				Scroll-based animations using Intersection Observer.
			</p>
		</div>
		
		<!-- Animation Types -->
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border lg:col-span-9 lg:grid-cols-4">
			{#each ['fade', 'slide-left', 'slide-right', 'scale'] as anim (anim)}
				<div class="flex flex-col bg-background p-6">
					<span class="font-mono text-[10px] tracking-widest text-primary">{anim.toUpperCase()}</span>
					<p class="font-body mt-2 text-sm text-muted-foreground">
						{anim === 'fade' ? 'Opacity 0 to 1' : anim === 'scale' ? 'Scale 95% to 100%' : `Slide from ${anim.split('-')[1]}`}
					</p>
					<code class="font-mono mt-4 text-xs text-muted-foreground">animation: '{anim}'</code>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Patterns Section -->
<section id="patterns" class="min-h-[60vh] border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Section Header -->
		<div class="col-span-12 bg-background p-8 lg:col-span-3 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">RECIPES</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">PATTERNS</h2>
			<p class="font-body mt-4 text-muted-foreground">
				Common UI patterns and compositions.
			</p>
		</div>
		
		<!-- Pattern Examples -->
		<div class="col-span-12 grid grid-cols-1 gap-px bg-border lg:col-span-9 lg:grid-cols-2">
			<div class="bg-background p-6">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">SECTION HEADER</span>
				<div class="mt-4">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LABEL</span>
					<h3 class="font-display mt-2 text-2xl font-bold uppercase">SECTION TITLE</h3>
					<p class="font-body mt-2 text-sm text-muted-foreground">Optional description text goes here.</p>
				</div>
			</div>
			
			<div class="bg-card p-6">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">STAT BLOCK</span>
				<div class="mt-4">
					<span class="font-display text-4xl font-bold text-primary">100%</span>
					<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">METRIC LABEL</p>
				</div>
			</div>
			
			<div class="bg-card p-6">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NUMBERED ITEM</span>
				<div class="mt-4 flex gap-4">
					<span class="font-display text-4xl text-primary/30">01</span>
					<div>
						<p class="font-ui font-semibold">Item Title</p>
						<p class="font-body text-sm text-muted-foreground">Description text</p>
					</div>
				</div>
			</div>
			
			<div class="bg-background p-6">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">FILTER BAR</span>
				<div class="mt-4 grid grid-cols-4 gap-px bg-border">
					<div class="flex items-center justify-center bg-card p-2"><span class="font-mono text-[10px]">FILTER</span></div>
					<div class="flex items-center justify-center bg-primary p-2"><span class="font-mono text-[10px] text-primary-foreground">ALL</span></div>
					<div class="flex items-center justify-center bg-background p-2"><span class="font-mono text-[10px]">A</span></div>
					<div class="flex items-center justify-center bg-background p-2"><span class="font-mono text-[10px]">B</span></div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Design Principles -->
<section class="min-h-[50vh] border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex flex-col justify-center bg-background p-8 lg:col-span-6 lg:p-12">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">PHILOSOPHY</span>
			<h2 class="font-display mt-4 text-3xl font-bold uppercase md:text-4xl">DESIGN PRINCIPLES</h2>
		</div>
		<div class="col-span-12 grid grid-cols-1 gap-px bg-border lg:col-span-6 lg:grid-cols-1">
			<div class="bg-card p-6">
				<span class="font-display text-xl font-bold text-primary">01</span>
				<h3 class="font-ui mt-2 font-semibold">INDUSTRIAL PRECISION</h3>
				<p class="font-body mt-1 text-sm text-muted-foreground">No rounded corners. Sharp edges. Grid-based layouts.</p>
			</div>
			<div class="bg-background p-6">
				<span class="font-display text-xl font-bold text-primary">02</span>
				<h3 class="font-ui mt-2 font-semibold">HIGH CONTRAST</h3>
				<p class="font-body mt-1 text-sm text-muted-foreground">Dark backgrounds with vibrant accents for visual impact.</p>
			</div>
			<div class="bg-card p-6">
				<span class="font-display text-xl font-bold text-primary">03</span>
				<h3 class="font-ui mt-2 font-semibold">TYPOGRAPHY FIRST</h3>
				<p class="font-body mt-1 text-sm text-muted-foreground">Clear hierarchy through type scale and weight.</p>
			</div>
		</div>
	</div>
</section>
