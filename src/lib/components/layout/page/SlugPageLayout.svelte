<script lang="ts">
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ArrowLeft, ArrowRight } from '@lucide/svelte';
	import type { Snippet, Component } from 'svelte';

	interface SidebarLink {
		id: string;
		title: string;
		number?: string;
	}

	interface Props {
		/** Breadcrumb items */
		breadcrumb?: { label: string; href?: string }[];
		/** Main page title */
		title: string;
		/** Optional subtitle/description */
		subtitle?: string;
		/** Sidebar label (e.g., "ON THIS PAGE", "QUICK INFO") */
		sidebarLabel?: string;
		/** Sidebar navigation links */
		sidebarLinks?: SidebarLink[];
		/** Back link text */
		backText?: string;
		/** Back link href */
		backHref?: string;
		/** Main content slot */
		children: Snippet;
		/** Header right side slot (e.g., CTA button) */
		headerRight?: Snippet;
		/** Sidebar custom content slot */
		sidebarContent?: Snippet;
		/** Related items section slot */
		relatedItems?: Snippet;
	}

	let {
		breadcrumb = [],
		title,
		subtitle = '',
		sidebarLabel = 'ON THIS PAGE',
		sidebarLinks = [],
		backText = 'GO BACK',
		backHref = '',
		children,
		headerRight,
		sidebarContent,
		relatedItems
	}: Props = $props();
</script>

<!-- Hero Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-9 lg:px-16 lg:py-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
			{#if breadcrumb.length > 0}
				<div class="flex flex-wrap items-center gap-3">
					{#each breadcrumb as item, i (item.label)}
						{#if i > 0}
							<span class="text-muted-foreground">/</span>
						{/if}
						{#if item.href}
							<a href={localizeHref(item.href)} class="font-mono text-[10px] tracking-widest text-muted-foreground hover:text-primary">{item.label}</a>
						{:else}
							<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{item.label}</span>
						{/if}
					{/each}
				</div>
			{/if}
			<h1 class="font-display mt-4 text-3xl font-black uppercase leading-[0.9] tracking-tight md:text-4xl lg:text-5xl">
				{title}
			</h1>
			{#if subtitle}
				<p class="font-body mt-4 text-lg text-muted-foreground">{subtitle}</p>
			{/if}
		</div>
		{#if headerRight}
			<div class="col-span-12 flex flex-col justify-center bg-card px-6 py-12 md:px-12 lg:col-span-3 lg:px-16 lg:py-16">
				{@render headerRight()}
			</div>
		{/if}
	</div>
</section>

<!-- Content Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12">
		<!-- Sticky Sidebar - Left -->
		<div class="col-span-12 border-b border-border bg-background lg:col-span-3 lg:border-b-0 lg:border-r lg:border-border">
			<div class="lg:sticky lg:top-24">
				<div class="px-6 py-8 md:px-12 lg:px-16 lg:py-12" use:scrollAnimate={{ animation: 'fade' }}>
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{sidebarLabel}</span>
					
					{#if sidebarContent}
						{@render sidebarContent()}
					{:else if sidebarLinks.length > 0}
						<nav class="mt-4 flex flex-col gap-3">
							{#each sidebarLinks as link, i (link.id)}
								<a 
									href="#{link.id}" 
									class="font-ui group flex items-start gap-3 text-xs tracking-wider text-muted-foreground transition-colors hover:text-primary"
								>
									<span class="font-mono text-[10px] text-primary/50 group-hover:text-primary">
										{link.number || String(i + 1).padStart(2, '0')}
									</span>
									<span class="border-b border-transparent group-hover:border-primary">{link.title}</span>
								</a>
							{/each}
						</nav>
					{/if}
				</div>
				
				{#if backHref}
					<div class="border-t border-border">
						<a href={localizeHref(backHref)} class="font-ui flex items-center gap-2 px-6 py-4 text-xs tracking-wider text-muted-foreground hover:bg-card hover:text-primary md:px-12 lg:px-16">
							<ArrowLeft class="h-3 w-3" />
							{backText}
						</a>
					</div>
				{/if}
			</div>
		</div>

		<!-- Main Content - Right -->
		<article class="col-span-12 bg-background px-6 py-12 md:px-12 lg:col-span-9 lg:px-16 lg:py-16" use:scrollAnimate={{ animation: 'fade' }}>
			{@render children()}
		</article>
	</div>
</section>

{#if relatedItems}
	<!-- Related Items Section -->
	<section class="border-b border-border">
		{@render relatedItems()}
	</section>
{/if}
