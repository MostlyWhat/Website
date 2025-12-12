<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import MarkdownRenderer from '$lib/components/layout/MarkdownRenderer.svelte';
	import { loadDocPage } from '$lib/content';
	import { 
		Grid3x3, 
		Palette, 
		Type, 
		MousePointer 
	} from '@lucide/svelte';

	// Load overview doc
	const doc = loadDocPage('overview', 'overview');
</script>

{#if doc}
	<!-- Header -->
	<section class="border-b border-border">
		<div class="px-6 py-12 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// OVERVIEW</span>
			<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">{doc.title.toUpperCase()}</h1>
			<p class="font-body mt-6 max-w-2xl text-muted-foreground">
				{doc.description}
			</p>
		</div>
		
		<!-- Quick Stats -->
		<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
			<div class="col-span-4 bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-3xl font-bold text-primary">12</span>
				<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">COLUMNS</p>
			</div>
			<div class="col-span-4 bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-3xl font-bold text-primary">64PX</span>
				<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">GRID SIZE</p>
			</div>
			<div class="col-span-4 bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-3xl font-bold text-primary">4</span>
				<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">FONTS</p>
			</div>
		</div>
		
		<!-- Quick Links -->
		<div class="border-t border-border px-6 py-8 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// QUICK.START</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase">GET STARTED</h2>
		</div>
		<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
			{#each [
				{ icon: Grid3x3, title: 'Grid System', desc: '12-column responsive grid', href: '/docs/foundation/grid' },
				{ icon: Palette, title: 'Colors', desc: 'Color palette & usage', href: '/docs/foundation/colors' },
				{ icon: Type, title: 'Typography', desc: 'Fonts & text styles', href: '/docs/foundation/typography' },
				{ icon: MousePointer, title: 'Components', desc: 'UI component library', href: '/docs/components/button' }
			] as item (item.title)}
				<a
					href={localizeHref(item.href)}
					class="col-span-12 flex items-center gap-4 bg-background px-6 py-6 text-left transition-colors hover:bg-card sm:col-span-6 md:px-12 lg:col-span-3 lg:px-16"
				>
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
						<item.icon class="h-5 w-5 text-primary" />
					</div>
					<div>
						<h3 class="font-ui text-sm font-semibold tracking-wider">{item.title}</h3>
						<p class="font-body mt-1 text-xs text-muted-foreground">{item.desc}</p>
					</div>
				</a>
			{/each}
		</div>
	</section>

	<!-- Content -->
	<section class="border-b border-border">
		<div class="px-6 py-8 md:px-12 lg:px-16">
			<MarkdownRenderer content={doc.content} class="max-w-4xl" />
		</div>
	</section>
{:else}
	<!-- Coming Soon -->
	<section class="border-b border-border">
		<div class="flex min-h-[60vh] flex-col items-center justify-center px-6 py-12 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// COMING.SOON</span>
			<h1 class="font-display mt-4 text-center text-3xl font-bold uppercase md:text-4xl">
				DOCUMENTATION
			</h1>
			<p class="font-body mt-4 max-w-md text-center text-muted-foreground">
				This section is currently being developed. Check back soon for comprehensive documentation.
			</p>
		</div>
	</section>
{/if}
