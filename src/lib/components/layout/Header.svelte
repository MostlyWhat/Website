<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import LanguageSwitcher from '$lib/components/layout/LanguageSwitcher.svelte';
	import { Menu, X, ArrowUpRight } from '@lucide/svelte';

	let mobileMenuOpen = $state(false);

	const navigation = [
		{ href: '/about', label: () => m.nav_about() },
		{ href: '/services', label: () => m.nav_services() },
		{ href: '/projects', label: () => m.nav_projects() },
		{ href: '/blog', label: () => m.nav_blog() }
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

<header class="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background">
	<div class="mx-auto max-w-7xl px-4">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-3" onclick={closeMobileMenu}>
				<span class="font-display text-lg font-black tracking-widest">MOSTLYWHAT SYSTEMS</span>
			</a>

			<!-- Desktop Navigation -->
			<nav class="hidden items-center gap-0 lg:flex">
				{#each navigation as { href, label }}
					<a
						{href}
						class="font-ui px-4 py-2 text-sm tracking-wide transition-colors {isActive(href)
							? 'text-foreground'
							: 'text-muted-foreground hover:text-foreground'}"
					>
						{label()}
					</a>
				{/each}
			</nav>

			<!-- Right side: Contact + Language + Mobile menu -->
			<div class="flex items-center gap-3">
				<LanguageSwitcher />
				
				<a
					href="/contact"
					class="font-ui hidden items-center gap-2 border border-primary bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:flex"
				>
					{m.nav_contact()}
					<ArrowUpRight class="h-4 w-4" />
				</a>
				
				<!-- Mobile menu button -->
				<button
					type="button"
					class="flex h-10 w-10 items-center justify-center border border-border lg:hidden"
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
		<nav class="border-t border-border bg-background lg:hidden">
			<div class="flex flex-col">
				{#each navigation as { href, label }}
					<a
						{href}
						class="font-ui border-b border-border px-4 py-4 text-sm transition-colors {isActive(href)
							? 'text-foreground'
							: 'text-muted-foreground hover:text-foreground'}"
						onclick={closeMobileMenu}
					>
						{label()}
					</a>
				{/each}
				<a
					href="/contact"
					class="font-ui flex items-center gap-2 border-b border-border bg-primary px-4 py-4 text-sm text-primary-foreground"
					onclick={closeMobileMenu}
				>
					{m.nav_contact()}
					<ArrowUpRight class="h-4 w-4" />
				</a>
			</div>
		</nav>
	{/if}
</header>

<!-- Spacer for fixed header -->
<div class="h-16"></div>
