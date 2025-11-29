<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import { getLocale, locales, localizeHref, type Locale } from '$lib/paraglide/runtime';
	import { Menu, X, ArrowUpRight, Globe, ChevronDown, ChevronRight } from '@lucide/svelte';

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
	
	// Get current path segments for breadcrumb
	const breadcrumbs = $derived(() => {
		const pathname = page.url.pathname.replace(/^\/(en|th)/, '') || '/';
		if (pathname === '/') return [];
		const segments = pathname.split('/').filter(Boolean);
		return segments.map((seg, i) => ({
			label: seg.toUpperCase().replace(/-/g, ' '),
			href: '/' + segments.slice(0, i + 1).join('/'),
			isLast: i === segments.length - 1
		}));
	});
</script>

<header class="vt-nav fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
	<!-- Main header row - edge to edge grid -->
	<div class="grid h-16 grid-cols-12 border-b border-border">
		<!-- Logo Section -->
		<div class="col-span-6 flex items-center border-r border-border px-4 sm:col-span-4 lg:col-span-3">
			<a href={localizeHref('/')} class="flex items-center gap-3" onclick={closeMobileMenu}>
				<span class="font-display text-sm font-black tracking-wider lg:text-base">MOSTLYWHAT SYSTEMS</span>
			</a>
		</div>

		<!-- Desktop Navigation - centered grid -->
		<nav class="col-span-6 hidden grid-cols-4 lg:grid">
			{#each navigation as { href, key } (href)}
				<a
					href={localizeHref(href)}
					class="font-ui flex items-center justify-center border-r border-border text-xs tracking-widest transition-colors {isActive(href)
						? 'bg-primary/10 text-primary'
						: 'text-muted-foreground hover:bg-card hover:text-foreground'}"
				>
					{key}
				</a>
			{/each}
		</nav>

		<!-- Right Controls -->
		<div class="col-span-6 flex items-stretch sm:col-span-8 lg:col-span-3">
			<!-- Language Switcher -->
			<div class="lang-menu relative hidden flex-1 items-stretch border-l border-border sm:flex">
				<button
					type="button"
					class="font-mono flex w-full items-center justify-center gap-1.5 text-xs tracking-wider text-muted-foreground transition-colors hover:text-foreground"
					onclick={() => (langMenuOpen = !langMenuOpen)}
					aria-expanded={langMenuOpen}
				>
					<Globe class="h-3.5 w-3.5" />
					<span>{languageNames[currentLocale]}</span>
					<ChevronDown class="h-3 w-3 transition-transform {langMenuOpen ? 'rotate-180' : ''}" />
				</button>

				{#if langMenuOpen}
					<div class="absolute right-0 top-full z-50 w-full min-w-[140px] border border-t-0 border-border bg-background shadow-lg">
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
				class="font-ui hidden flex-1 items-center justify-center gap-2 border-l border-border bg-primary text-xs tracking-widest text-primary-foreground transition-colors hover:bg-primary/90 sm:flex"
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

	<!-- Breadcrumb Bar -->
	{#if breadcrumbs().length > 0}
		<div class="flex h-8 items-center border-b border-border bg-card/50 px-4">
			<nav class="font-mono flex items-center gap-1 text-[10px] tracking-wider">
				<a href={localizeHref('/')} class="text-muted-foreground transition-colors hover:text-primary">HOME</a>
				{#each breadcrumbs() as { label, href, isLast }}
					<ChevronRight class="h-3 w-3 text-muted-foreground/50" />
					{#if isLast}
						<span class="text-foreground">{label}</span>
					{:else}
						<a href={localizeHref(href)} class="text-muted-foreground transition-colors hover:text-primary">{label}</a>
					{/if}
				{/each}
			</nav>
		</div>
	{/if}

	<!-- Mobile Navigation - Full Screen -->
	{#if mobileMenuOpen}
		<nav class="fixed inset-0 top-16 z-40 flex flex-col bg-background lg:hidden">
			<div class="flex flex-1 flex-col">
				{#each navigation as { href, key } (href)}
					<a
						href={localizeHref(href)}
						class="font-display flex items-center border-b border-border px-6 py-6 text-2xl font-bold uppercase tracking-wider transition-colors {isActive(href)
							? 'bg-primary/10 text-primary'
							: 'text-foreground hover:bg-card'}"
						onclick={closeMobileMenu}
					>
						{key}
						<ChevronRight class="ml-auto h-5 w-5 text-muted-foreground" />
					</a>
				{/each}
			</div>
			<a
				href={localizeHref('/contact')}
				class="font-display flex items-center justify-center gap-3 bg-primary py-6 text-xl font-bold uppercase tracking-widest text-primary-foreground"
				onclick={closeMobileMenu}
			>
				CONTACT
				<ArrowUpRight class="h-5 w-5" />
			</a>
		</nav>
	{/if}
</header>

<!-- Spacer for fixed header -->
<div class="{breadcrumbs().length > 0 ? 'h-24' : 'h-16'}"></div>
