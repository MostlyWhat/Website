<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import { getLocale, locales, localizeHref, type Locale } from '$lib/paraglide/runtime';
	import { Menu, X, ArrowUpRight, Globe, ChevronDown } from '@lucide/svelte';

	let mobileMenuOpen = $state(false);
	let langMenuOpen = $state(false);

	const navigation = [
		{ href: '/about', label: () => m.nav_about(), key: 'ABOUT' },
		{ href: '/services', label: () => m.nav_services(), key: 'SERVICES' },
		{ href: '/projects', label: () => m.nav_projects(), key: 'PROJECTS' },
		{ href: '/blog', label: () => m.nav_blog(), key: 'BLOG' }
	];

	const languageNames: Record<Locale, string> = {
		en: 'EN',
		th: 'TH'
	};

	const languageFullNames: Record<Locale, string> = {
		en: 'ENGLISH',
		th: 'ไทย'
	};

	function isActive(href: string): boolean {
		const pathname = page.url.pathname.replace(/^\/(en|th)/, '') || '/';
		if (href === '/') return pathname === '/';
		return pathname.startsWith(href);
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.lang-menu')) {
			langMenuOpen = false;
		}
	}

	$effect(() => {
		if (langMenuOpen) {
			document.addEventListener('click', handleClickOutside);
		}
		return () => document.removeEventListener('click', handleClickOutside);
	});

	const currentLocale = $derived(getLocale());
	
	// Get current path for breadcrumb display
	const currentPath = $derived(() => {
		const pathname = page.url.pathname.replace(/^\/(en|th)/, '') || '/';
		if (pathname === '/') return null;
		const segment = pathname.split('/')[1];
		return segment ? segment.toUpperCase() : null;
	});
</script>

<header class="vt-nav fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
	<!-- Main header row -->
	<div class="grid h-16 grid-cols-12 items-stretch border-b border-border">
		<!-- Logo Section -->
		<div class="col-span-4 flex items-center border-r border-border px-4 lg:col-span-3">
			<a href="/" class="flex items-center gap-2" onclick={closeMobileMenu}>
				<span class="font-mono text-xs text-primary">//</span>
				<span class="font-display text-sm font-black tracking-widest lg:text-base">MOSTLYWHAT</span>
			</a>
		</div>

		<!-- Desktop Navigation - Center -->
		<nav class="col-span-6 hidden items-stretch lg:flex">
			{#each navigation as { href, key }}
				<a
					href={localizeHref(href)}
					class="font-ui flex items-center border-r border-border px-6 text-xs tracking-widest transition-colors {isActive(href)
						? 'bg-primary/10 text-primary'
						: 'text-muted-foreground hover:bg-card hover:text-foreground'}"
				>
					{key}
				</a>
			{/each}
		</nav>

		<!-- Right Controls -->
		<div class="col-span-8 flex items-stretch justify-end lg:col-span-3">
			<!-- Language Switcher -->
			<div class="lang-menu relative flex items-stretch border-l border-border">
				<button
					type="button"
					class="font-mono flex items-center gap-2 px-4 text-xs tracking-wider text-muted-foreground transition-colors hover:text-foreground"
					onclick={() => (langMenuOpen = !langMenuOpen)}
					aria-expanded={langMenuOpen}
				>
					<Globe class="h-3.5 w-3.5" />
					<span>{languageNames[currentLocale]}</span>
					<ChevronDown class="h-3 w-3 transition-transform {langMenuOpen ? 'rotate-180' : ''}" />
				</button>

							{#if langMenuOpen}
					<div class="absolute right-0 top-full z-50 border border-border bg-background shadow-lg">
						{#each locales as lang}
							{@const targetLocale = lang as Locale}
							<a
								href={localizeHref(page.url.pathname.replace(/^\/(en|th)/, '') || '/', { locale: targetLocale })}
								class="font-mono flex items-center gap-3 px-4 py-3 text-xs tracking-wider transition-colors {lang === currentLocale
									? 'bg-primary text-primary-foreground'
									: 'text-muted-foreground hover:bg-card hover:text-foreground'}"
								onclick={() => (langMenuOpen = false)}
							>
								<span class="w-6">{languageNames[targetLocale]}</span>
								<span class="text-[10px] opacity-60">{languageFullNames[targetLocale]}</span>
							</a>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Contact CTA -->
			<a
				href={localizeHref('/contact')}
				class="font-ui hidden items-center gap-2 border-l border-border bg-primary px-6 text-xs tracking-widest text-primary-foreground transition-colors hover:bg-primary/90 sm:flex"
			>
				CONTACT
				<ArrowUpRight class="h-3.5 w-3.5" />
			</a>

			<!-- Mobile menu button -->
			<button
				type="button"
				class="flex h-full w-14 items-center justify-center border-l border-border lg:hidden"
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

	<!-- Breadcrumb Bar (shows current section) -->
	{#if currentPath()}
		<div class="flex h-8 items-center border-b border-border bg-card/50 px-4">
			<span class="font-mono text-[10px] tracking-wider text-muted-foreground">
				<span class="text-primary">//</span> HOME / <span class="text-foreground">{currentPath()}</span>
			</span>
		</div>
	{/if}

	<!-- Mobile Navigation -->
	{#if mobileMenuOpen}
		<nav class="border-t border-border bg-background lg:hidden">
			<div class="grid grid-cols-2 gap-px bg-border">
				{#each navigation as { href, key }}
					<a
						href={localizeHref(href)}
						class="font-ui flex items-center justify-center bg-background py-4 text-xs tracking-widest transition-colors {isActive(href)
							? 'bg-primary/10 text-primary'
							: 'text-muted-foreground hover:bg-card'}"
						onclick={closeMobileMenu}
					>
						{key}
					</a>
				{/each}
			</div>
			<a
				href={localizeHref('/contact')}
				class="font-ui flex items-center justify-center gap-2 bg-primary py-4 text-xs tracking-widest text-primary-foreground"
				onclick={closeMobileMenu}
			>
				CONTACT
				<ArrowUpRight class="h-3.5 w-3.5" />
			</a>
		</nav>
	{/if}
</header>

<!-- Spacer for fixed header (adjusts based on breadcrumb visibility) -->
<div class="h-16" class:h-24={currentPath()}></div>
