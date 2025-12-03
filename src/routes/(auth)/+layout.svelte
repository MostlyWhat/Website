<script lang="ts">
	/**
	 * Auth Layout
	 * 
	 * Minimal layout for authentication pages.
	 * Clean, focused design without navigation distractions.
	 * Full screen height with no scroll.
	 */
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ArrowRight } from '@lucide/svelte';

	let { children } = $props();

	const footerLinks = [
		{ href: '/contact', label: 'Contact' },
		{ href: '/legal/privacy-policy', label: 'Privacy' },
		{ href: '/legal/terms-of-service', label: 'Terms of use' },
		{ href: '/docs/foundation/accessibility', label: 'Accessibility' }
	];
</script>

<div class="flex h-screen flex-col overflow-hidden bg-background">
	<!-- Simple header with logo -->
	<header class="shrink-0 border-b border-border">
		<div class="flex h-16 items-center justify-between px-6 md:px-12 lg:px-16">
			<a href={localizeHref('/')} class="group flex items-center gap-2">
				<span class="font-display text-sm font-black uppercase tracking-wider text-primary transition-colors group-hover:text-foreground">MOSTLYWHAT</span>
				<span class="font-display text-sm font-black uppercase tracking-wider text-foreground">SYSTEMS</span>
			</a>
			<a 
				href={localizeHref('/')} 
				class="font-mono group flex items-center gap-2 text-[10px] tracking-wider text-muted-foreground transition-colors hover:text-foreground"
			>
				BACK TO SITE
				<ArrowRight class="h-3 w-3 transition-transform group-hover:translate-x-1" />
			</a>
		</div>
	</header>

	<!-- Main content -->
	<main class="flex-1 overflow-auto">
		{@render children()}
	</main>

	<!-- Footer -->
	<footer class="shrink-0 border-t border-border bg-card/50">
		<div class="flex h-12 items-center justify-between px-6 md:px-12 lg:px-16">
			<span class="font-mono text-[10px] tracking-wider text-muted-foreground">
				© {new Date().getFullYear()} MostlyWhat
			</span>
			<nav class="flex items-center gap-4 md:gap-6">
				{#each footerLinks as link}
					<a 
						href={localizeHref(link.href)} 
						class="font-mono text-[10px] tracking-wider text-muted-foreground transition-colors hover:text-foreground"
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>
	</footer>
</div>
