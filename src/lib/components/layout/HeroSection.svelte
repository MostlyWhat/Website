<script lang="ts">
	import { page } from '$app/state';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import VideoBackground from './VideoBackground.svelte';
	import { GlitchText } from '$lib/components/ui/glitch-text';
	import { MARATHON_VIDEO } from '$lib/constants';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Small label above title (e.g., "// ABOUT", "// CONTACT") */
		label: string;
		/** Main title text - will be rendered with glitch effect */
		title: string;
		/** Optional description text below title */
		description?: string;
		/** Optional: Use static text instead of glitch effect */
		staticTitle?: boolean;
		/** Whether to show video background (default: true) */
		showVideo?: boolean;
		/** Custom video source URL */
		videoSrc?: string;
		/** Optional action buttons slot */
		actions?: Snippet;
	}

	let {
		label,
		title,
		description,
		staticTitle = false,
		showVideo = true,
		videoSrc = MARATHON_VIDEO,
		actions
	}: Props = $props();

	// Check if we're on a sub-page (has breadcrumbs = additional 2rem header)
	const isSubPage = $derived(() => {
		const pathname = page.url.pathname.replace(/^\/(en|th)/, '') || '/';
		return pathname !== '/';
	});
</script>

<!-- Hero height: 100dvh minus header (4rem) minus breadcrumb if sub-page (2rem) -->
<section class="relative flex flex-col border-b border-border {isSubPage() ? 'h-[calc(100dvh-6rem)]' : 'h-[calc(100dvh-4rem)]'}">
	{#if showVideo}
		<!-- Video Background -->
		<VideoBackground src={videoSrc} class="brightness-[0.60]" />
		<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
			<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
		</div>
	{/if}

	<!-- Hero Content - Left-aligned, Bottom-positioned -->
	<div class="flex flex-1 flex-col items-start justify-end px-6 py-6 md:px-12 md:py-12 lg:px-16 lg:py-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="max-w-4xl text-left">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{label}</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl">
				{#if staticTitle}
					{title}
				{:else}
					<GlitchText text={title} scrambledStart={true} hoverOnly={false} />
				{/if}
			</h1>
			{#if description}
				<p class="font-body mt-4 max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>
			{/if}
			{#if actions}
				<div class="mt-8 flex flex-wrap justify-start gap-3">
					{@render actions()}
				</div>
			{/if}
		</div>
	</div>
</section>
