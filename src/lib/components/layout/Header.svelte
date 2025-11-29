<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import { languageTag } from '$lib/paraglide/runtime';
	import LanguageSwitcher from '$lib/components/layout/LanguageSwitcher.svelte';
	import { Menu, X } from '@lucide/svelte';

	let mobileMenuOpen = $state(false);

	const navigation = [
		{ href: '/', label: () => m.nav_home() },
		{ href: '/about', label: () => m.nav_about() },
		{ href: '/services', label: () => m.nav_services() },
		{ href: '/projects', label: () => m.nav_projects() },
		{ href: '/blog', label: () => m.nav_blog() },
		{ href: '/contact', label: () => m.nav_contact() }
	];

	function isActive(href: string): boolean {
		if (href === '/') {
			return page.url.pathname === '/';
		}
		return page.url.pathname.startsWith(href);
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}
</script>

<header class="vt-nav fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
	<div class="mx-auto max-w-7xl px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2" onclick={closeMobileMenu}>
				<span class="font-display text-xl tracking-wider text-primary">MOSTLYWHAT</span>
				<span class="font-ui text-sm text-muted-foreground">SYSTEMS</span>
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden items-center gap-1 md:flex">
				{#each navigation as { href, label }}
					<a
						{href}
						class="font-ui px-4 py-2 text-sm transition-colors {isActive(href)
							? 'bg-primary text-primary-foreground'
							: 'text-muted-foreground hover:bg-secondary hover:text-foreground'}"
					>
						{label()}
					</a>
				{/each}
			</nav>

			<!-- Right side: Language + Mobile menu -->
			<div class="flex items-center gap-2">
				<LanguageSwitcher />
				
				<!-- Mobile menu button -->
				<button
					type="button"
					class="flex h-10 w-10 items-center justify-center border border-border md:hidden"
					onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
					aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
					aria-expanded={mobileMenuOpen}
				>
					{#if mobileMenuOpen}
						<X class="h-5 w-5" />
					{:else}
						<Menu class="h-5 w-5" />
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile Navigation -->
	{#if mobileMenuOpen}
		<nav class="border-t border-border bg-background md:hidden">
			<div class="flex flex-col">
				{#each navigation as { href, label }}
					<a
						{href}
						class="font-ui border-b border-border px-4 py-4 text-sm transition-colors {isActive(href)
							? 'bg-primary text-primary-foreground'
							: 'text-muted-foreground hover:bg-secondary hover:text-foreground'}"
						onclick={closeMobileMenu}
					>
						{label()}
					</a>
				{/each}
			</div>
		</nav>
	{/if}
</header>

<!-- Spacer for fixed header -->
<div class="h-16"></div>
