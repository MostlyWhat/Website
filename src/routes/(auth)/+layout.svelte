<script lang="ts">
	/**
	 * Auth Layout
	 * 
	 * Minimal layout for authentication pages.
	 * Clean, focused design without navigation distractions.
	 * Full screen height with no scroll.
	 */
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ArrowLeft } from '@lucide/svelte';

	let { children } = $props();
</script>

<div class="flex h-screen flex-col overflow-hidden bg-background">
	<!-- Simple header with logo -->
	<header class="shrink-0 border-b border-border">
		<div class="flex h-16 items-center justify-between px-6 md:px-12 lg:px-16">
			<a 
				href={localizeHref('/')} 
				class="font-mono group flex items-center gap-2 text-[10px] tracking-wider text-muted-foreground transition-colors hover:text-foreground"
			>
				<ArrowLeft class="h-3 w-3 transition-transform group-hover:-translate-x-1" />
				BACK TO SITE
			</a>
			<a href={localizeHref('/')} class="group flex items-center gap-2">
				<span class="font-display text-sm font-black uppercase tracking-wider text-primary transition-colors group-hover:text-foreground">MOSTLYWHAT</span>
				<span class="font-display text-sm font-black uppercase tracking-wider text-foreground">SYSTEMS</span>
			</a>
			<div class="w-20"></div>
		</div>
	</header>

	<!-- Main content -->
	<main class="flex-1 overflow-hidden">
		{@render children()}
	</main>
</div>
