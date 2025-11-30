<script lang="ts">
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import VideoBackground from './VideoBackground.svelte';
	import { GlitchText } from '$lib/components/ui/glitch-text';
	import { MARATHON_VIDEO } from '$lib/constants';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Small label above title (e.g., "ABOUT", "CONTACT") */
		label: string;
		/** Main title text - will be rendered with glitch effect */
		title: string;
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
		staticTitle = false,
		showVideo = true,
		videoSrc = MARATHON_VIDEO,
		actions
	}: Props = $props();
</script>

<section class="relative flex h-[calc(100dvh-4rem)] flex-col border-b border-border">
	{#if showVideo}
		<!-- Video Background -->
		<VideoBackground src={videoSrc} class="brightness-[0.20]" />
		<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
			<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
		</div>
	{/if}

	<!-- Hero Content - Left-aligned, Bottom-positioned -->
	<div class="flex flex-1 flex-col items-start justify-end px-6 pb-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="mb-12 max-w-4xl text-left">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{label}</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl">
				{#if staticTitle}
					{title}
				{:else}
					<GlitchText text={title} scrambledStart={true} />
				{/if}
			</h1>
			{#if actions}
				<div class="mt-8 flex flex-wrap justify-start gap-3">
					{@render actions()}
				</div>
			{/if}
		</div>
	</div>
</section>
