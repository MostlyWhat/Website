<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import { getLocale, locales, localizeHref, type Locale } from '$lib/paraglide/runtime';
	import { Menu, X, ArrowUpRight, Globe, ChevronDown, ChevronRight, Search } from '@lucide/svelte';
	import { GlitchText } from '$lib/components/ui/glitch-text';
	import * as Sheet from '$lib/components/ui/sheet';

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
		<div class="col-span-6 flex items-center px-6 sm:col-span-4 sm:border-r sm:border-border md:px-12 lg:col-span-3 lg:px-16">
			<a href={localizeHref('/')} class="group flex items-center gap-3" onclick={() => (mobileMenuOpen = false)}>
				<span class="font-display text-sm font-black tracking-wider text-primary transition-colors group-hover:text-foreground lg:text-base">MOSTLYWHAT</span>
				<span class="font-display text-sm font-black tracking-wider text-foreground lg:text-base">SYSTEMS</span>
			</a>
		</div>

		<!-- Desktop Navigation - centered grid -->
		<nav class="col-span-6 hidden grid-cols-4 lg:grid">
			{#each navigation as { href, key } (href)}
				<a
					href={localizeHref(href)}
					class="font-ui group flex items-center justify-center border-r border-border text-xs tracking-widest transition-colors {isActive(href)
						? 'bg-primary/10 text-primary'
						: 'text-muted-foreground hover:bg-card hover:text-foreground'}"
				>
					<GlitchText text={key} class="tracking-widest" />
				</a>
			{/each}
		</nav>

		<!-- Right Controls -->
		<div class="col-span-6 flex items-stretch sm:col-span-8 lg:col-span-3">
			<!-- Search Button -->
			<a
				href={localizeHref('/search')}
				class="hidden aspect-square h-16 items-center justify-center border-l border-border text-muted-foreground transition-colors hover:bg-card hover:text-foreground lg:flex"
				aria-label="Search"
			>
				<Search class="h-4 w-4" />
			</a>

			<!-- Language Switcher -->
			<div class="lang-menu relative hidden items-stretch border-l border-border lg:flex">
				<button
					type="button"
					class="flex aspect-square h-16 items-center justify-center text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
					onclick={() => (langMenuOpen = !langMenuOpen)}
					aria-expanded={langMenuOpen}
					aria-label="Change language"
				>
					<Globe class="h-4 w-4" />
				</button>

				{#if langMenuOpen}
					<div class="absolute right-0 top-full z-50 min-w-[140px] border border-t-0 border-border bg-background shadow-lg">
						{#each locales as lang}
							{@const targetLocale = lang as Locale}
							<a
								href={localizeHref(page.url.pathname.replace(/^\/(en|th)/, '') || '/', { locale: targetLocale })}
								data-sveltekit-reload
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
				class="font-ui hidden flex-1 items-center justify-center gap-2 border-l border-border bg-primary text-xs tracking-widest text-primary-foreground transition-colors hover:bg-primary/90 lg:flex"
			>
				CONTACT
				<ArrowUpRight class="h-3.5 w-3.5" />
			</a>

			<!-- Mobile menu button - Sheet Trigger -->
			<Sheet.Root bind:open={mobileMenuOpen}>
				<Sheet.Trigger
					class="ml-auto flex h-16 w-16 flex-shrink-0 items-center justify-center border-l border-border transition-colors hover:bg-card lg:hidden"
					aria-label="Open menu"
				>
					<Menu class="h-5 w-5" />
				</Sheet.Trigger>
				<Sheet.Content side="top" class="flex h-dvh flex-col gap-0 border-b-0 p-0 [&>button[data-dialog-close]]:hidden">
					<!-- Header with Label and Close -->
					<div class="flex items-center justify-between border-b border-border px-6 py-6">
						<div>
							<span class="font-display text-lg font-bold uppercase tracking-wider">NAVIGATION</span>
							<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">// PLEASE SELECT YOUR DESTINATION</p>
						</div>
						<Sheet.Close class="flex h-12 w-12 items-center justify-center border border-border text-muted-foreground transition-colors hover:bg-card hover:text-foreground">
							<X class="h-5 w-5" />
							<span class="sr-only">Close</span>
						</Sheet.Close>
					</div>

					<!-- Navigation Links -->
					<nav class="flex flex-1 flex-col overflow-y-auto">
						{#each navigation as { href, key } (href)}
							<a
								href={localizeHref(href)}
								class="font-display flex items-center border-b border-border px-6 py-8 text-3xl font-bold uppercase tracking-wider transition-colors {isActive(href)
									? 'bg-primary/10 text-primary'
									: 'text-foreground hover:bg-card'}"
								onclick={() => (mobileMenuOpen = false)}
							>
								{key}
								<ChevronRight class="ml-auto h-6 w-6 text-muted-foreground" />
							</a>
						{/each}
						<a
							href={localizeHref('/search')}
							class="font-display flex items-center border-b border-border px-6 py-8 text-3xl font-bold uppercase tracking-wider transition-colors text-foreground hover:bg-card"
							onclick={() => (mobileMenuOpen = false)}
						>
							SEARCH
							<ChevronRight class="ml-auto h-6 w-6 text-muted-foreground" />
						</a>
					</nav>

					<!-- Bottom Section: Language + Contact -->
					<div class="mt-auto border-t border-border">
						<!-- Language Selection -->
						<div class="border-b border-border px-6 py-4">
							<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// LANGUAGE</span>
							<div class="mt-3 flex gap-2">
								{#each locales as lang}
									{@const targetLocale = lang as Locale}
									<a
										href={localizeHref(page.url.pathname.replace(/^\/(en|th)/, '') || '/', { locale: targetLocale })}
										data-sveltekit-reload
										class="font-mono flex flex-1 items-center justify-center gap-2 border px-4 py-3 text-sm tracking-wider transition-colors {lang === currentLocale
											? 'border-primary bg-primary text-primary-foreground'
											: 'border-border text-muted-foreground hover:bg-card hover:text-foreground'}"
										onclick={() => (mobileMenuOpen = false)}
									>
										<Globe class="h-4 w-4" />
										{languageFullNames[targetLocale]}
									</a>
								{/each}
							</div>
						</div>

						<!-- Contact Button -->
						<a
							href={localizeHref('/contact')}
							class="font-display flex items-center justify-center gap-3 bg-primary py-6 text-xl font-bold uppercase tracking-widest text-primary-foreground"
							onclick={() => (mobileMenuOpen = false)}
						>
							CONTACT
							<ArrowUpRight class="h-5 w-5" />
						</a>
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</div>
	</div>

	<!-- Breadcrumb Bar -->
	{#if breadcrumbs().length > 0}
		<div class="flex h-8 items-center border-b border-border bg-card/50 px-6 md:px-12 lg:px-16">
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
</header>

<!-- Spacer for fixed header -->
<div class="{breadcrumbs().length > 0 ? 'h-24' : 'h-16'}"></div>
