<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowLeft, ArrowRight, Clock } from '@lucide/svelte';
	import { marked } from 'marked';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	// Category labels
	const categoryLabels: Record<string, string> = {
		'getting-started': 'GETTING STARTED',
		'services': 'SERVICES',
		'process': 'PROCESS',
		'technical': 'TECHNICAL',
		'billing': 'BILLING',
		'support': 'SUPPORT'
	};

	// Extract sections from content
	interface ContentSection {
		id: string;
		number: string;
		title: string;
	}

	function extractSections(markdown: string): ContentSection[] {
		const sections: ContentSection[] = [];
		const headingRegex = /^##\s+(\d+)\s*[—–-]\s*(.+)$/gm;
		let match;

		while ((match = headingRegex.exec(markdown)) !== null) {
			const number = match[1].padStart(2, '0');
			const title = match[2].trim().toUpperCase();
			const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
			sections.push({ id, number, title });
		}

		return sections;
	}

	function renderContent(markdown: string): string {
		// Convert ## headings to styled versions
		let processed = markdown.replace(
			/^##\s+(\d+)\s*[—–-]\s*(.+)$/gm,
			(_, num, title) => {
				const number = num.padStart(2, '0');
				const id = title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
				return `<h2 id="${id}" class="font-ui text-sm font-semibold tracking-wider text-primary mt-12 first:mt-0">${number} — ${title.trim().toUpperCase()}</h2>`;
			}
		);

		const html = marked.parse(processed) as string;

		return html
			.replace(/<p>/g, '<p class="font-body text-sm text-muted-foreground mt-4">')
			.replace(/<ul>/g, '<ul class="font-body list-disc list-inside space-y-2 text-sm text-muted-foreground mt-4 ml-4">')
			.replace(/<li>/g, '<li class="pl-2">')
			.replace(/<strong>/g, '<strong class="text-foreground font-medium">');
	}

	const sections = extractSections(data.content);
	const renderedContent = renderContent(data.content);
</script>

<svelte:head>
	<title>{data.title} — Help Center — {m.site_name()}</title>
	<meta name="description" content={data.title} />
</svelte:head>

<!-- Article Header -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-8 lg:px-16 lg:py-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
			<div class="flex items-center gap-4 text-xs">
				<span class="font-mono uppercase text-primary">{categoryLabels[data.category] || data.category.toUpperCase()}</span>
				<span class="font-mono flex items-center gap-1 text-muted-foreground">
					<Clock class="h-3 w-3" />
					{data.readTime}
				</span>
			</div>
			<h1 class="font-display mt-4 text-3xl font-black uppercase leading-[0.95] tracking-tight md:text-4xl lg:text-5xl">
				{data.title}
			</h1>
		</div>
		<div class="col-span-12 flex flex-col justify-center bg-card px-6 py-12 md:px-12 lg:col-span-4 lg:px-16 lg:py-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">HELP CENTER</span>
			<p class="font-body mt-2 text-sm text-muted-foreground">Browse our knowledge base for answers to common questions.</p>
		</div>
	</div>
</section>

<!-- Article Content -->
<section class="border-b border-border">
	<div class="grid grid-cols-12">
		<!-- Sticky Sidebar - Left -->
		<div class="col-span-12 border-b border-border bg-card lg:col-span-3 lg:border-b-0 lg:border-r lg:border-border">
			<div class="lg:sticky lg:top-24">
				<div class="px-6 py-8 md:px-12 lg:px-16 lg:py-12">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ON THIS PAGE</span>
					<nav class="mt-4 flex flex-col gap-3">
						{#each sections as section, i (section.id)}
							<a 
								href="#{section.id}" 
								class="font-ui group flex items-start gap-3 text-xs tracking-wider text-muted-foreground transition-colors hover:text-primary"
							>
								<span class="font-mono text-[10px] text-primary/50 group-hover:text-primary">{section.number}</span>
								<span class="border-b border-transparent group-hover:border-primary">{section.title}</span>
							</a>
						{/each}
					</nav>
				</div>
				<!-- Back link at bottom -->
				<div class="border-t border-border">
					<a href={localizeHref('/help')} class="font-ui flex items-center gap-2 px-6 py-4 text-xs tracking-wider text-muted-foreground hover:bg-background hover:text-primary md:px-12 lg:px-16">
						<ArrowLeft class="h-3 w-3" />
						BACK TO HELP CENTER
					</a>
				</div>
			</div>
		</div>
		
		<!-- Article Body - Right -->
		<article class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-9 lg:px-16 lg:py-16">
			<div class="max-w-3xl">
				{@html renderedContent}
			</div>
		</article>
	</div>
</section>

<!-- Navigation -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-8 md:px-12 lg:col-span-6 lg:px-16">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">MORE ARTICLES</span>
			<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">NEED MORE HELP?</h2>
			<p class="font-body mt-4 text-muted-foreground">Browse our full knowledge base or get in touch with our team.</p>
		</div>
		<div class="col-span-12 flex items-center justify-center gap-4 bg-card px-6 py-8 md:px-12 lg:col-span-6 lg:px-16">
			<Button href={localizeHref('/help')} variant="outline" size="lg" class="font-ui tracking-wider">
				ALL ARTICLES
			</Button>
			<Button href={localizeHref('/contact')} size="lg" class="font-ui tracking-wider">
				CONTACT US
				<ArrowRight class="ml-2 h-4 w-4" />
			</Button>
		</div>
	</div>
</section>
