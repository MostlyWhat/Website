<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import type { ComponentProps } from 'svelte';

	interface Props {
		size?: 'full' | 'half' | 'small';
		title: string;
		subtitle?: string;
		description?: string;
		breadcrumbs?: Array<{ label: string; href?: string }>;
		overlay?: boolean;
		accent?: 'primary' | 'secondary' | 'destructive' | 'muted';
		children?: any;
	}

	let {
		size = 'half',
		title,
		subtitle,
		description,
		breadcrumbs = [],
		overlay = true,
		accent = 'primary',
		children
	}: Props = $props();

	const sizeClasses = {
		full: 'min-h-screen',
		half: 'min-h-[50vh]',
		small: 'min-h-[30vh]'
	};

	const overlayClasses = overlay
		? 'bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-sm'
		: 'bg-background';
</script>

<!-- Full Width Header -->
<div class="w-full border-b border-border/20 bg-card/50 backdrop-blur-sm">
	<div class="container mx-auto px-4 py-2">
		{#if breadcrumbs.length > 0}
			<nav class="flex items-center space-x-1 text-xs font-chakra uppercase tracking-wider">
				{#each breadcrumbs as crumb, index (crumb.label)}
					{#if index > 0}
						<span class="text-muted-foreground">/</span>
					{/if}
					{#if crumb.href}
						<a href={crumb.href} class="text-{accent} hover:text-{accent}/80 transition-colors">
							{crumb.label}
						</a>
					{:else}
						<span class="text-muted-foreground">{crumb.label}</span>
					{/if}
				{/each}
			</nav>
		{/if}
	</div>
</div>

<!-- Hero Section -->
<section class="relative {sizeClasses[size]} flex items-center justify-center overflow-hidden">
	<!-- Sci-fi Background Pattern -->
	<div class="absolute inset-0 opacity-5">
		<div
			class="absolute inset-0 bg-[linear-gradient(45deg,transparent_35%,rgba(255,255,255,.1)_50%,transparent_65%)] bg-[length:20px_20px]"></div>
		<div
			class="absolute inset-0 bg-[linear-gradient(-45deg,transparent_35%,rgba(255,255,255,.05)_50%,transparent_65%)] bg-[length:30px_30px]"></div>
	</div>

	<!-- Grid Lines -->
	<div class="absolute inset-0 opacity-10">
		<div
			class="h-full w-full bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
		<div
			class="h-full w-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:2rem_2rem]"></div>
	</div>

	<!-- Content Overlay -->
	<div class="relative z-10 {overlayClasses} w-full">
		<div class="container mx-auto px-4 py-16">
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
				<!-- Text Content -->
				<div class="space-y-6">
					{#if subtitle}
						<div class="flex items-center space-x-3">
							<div class="h-px bg-{accent} w-8"></div>
							<Badge variant="outline" class="font-chakra text-xs uppercase tracking-wider border-{accent}/30">
								{subtitle}
							</Badge>
						</div>
					{/if}

					<div class="space-y-4">
						<h1 class="font-heading text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight">
							{title}
						</h1>

						{#if description}
							<p class="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed">
								{description}
							</p>
						{/if}
					</div>

					{#if children}
						<div class="flex flex-col sm:flex-row gap-4">
							{@render children()}
						</div>
					{/if}
				</div>

				<!-- Visual Element -->
				<div class="relative">
					<div class="aspect-square relative">
						<!-- Sci-fi Circle -->
						<div class="absolute inset-0 rounded-full border border-{accent}/20 animate-pulse"></div>
						<div class="absolute inset-4 rounded-full border border-{accent}/30"></div>
						<div class="absolute inset-8 rounded-full border border-{accent}/40"></div>

						<!-- Center Glow -->
						<div class="absolute inset-1/3 rounded-full bg-{accent}/10 blur-xl"></div>
						<div class="absolute inset-2/5 rounded-full bg-{accent}/20 blur-lg"></div>

						<!-- Corner Accents -->
						<div class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-{accent}/60"></div>
						<div class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-{accent}/60"></div>
						<div class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-{accent}/60"></div>
						<div class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-{accent}/60"></div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Bottom Accent Line -->
	<div
		class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-{accent}/50 to-transparent"></div>
</section>
