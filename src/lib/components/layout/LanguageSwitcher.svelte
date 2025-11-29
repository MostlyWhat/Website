<script lang="ts">
	import { page } from '$app/state';
	import { getLocale, locales, type Locale } from '$lib/paraglide/runtime';
	import { Globe } from '@lucide/svelte';

	let open = $state(false);

	const languageNames: Record<Locale, string> = {
		en: 'English',
		th: 'ไทย'
	};

	function getLocalizedPath(lang: Locale): string {
		const currentPath = page.url.pathname;
		// Remove current language prefix if exists
		const pathWithoutLang = currentPath.replace(/^\/(en|th)/, '');
		// Add new language prefix (only add for non-default locale)
		if (lang === 'en') {
			return pathWithoutLang || '/';
		}
		return `/${lang}${pathWithoutLang || ''}`;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (!target.closest('.language-switcher')) {
			open = false;
		}
	}

	$effect(() => {
		if (open) {
			document.addEventListener('click', handleClickOutside);
		}
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	const currentLocale = $derived(getLocale());
</script>

<div class="language-switcher relative">
	<button
		type="button"
		class="font-ui flex h-10 items-center gap-2 border border-border px-3 text-sm transition-colors hover:border-primary"
		onclick={() => (open = !open)}
		aria-expanded={open}
		aria-haspopup="true"
	>
		<Globe class="h-4 w-4" />
		<span class="hidden sm:inline">{languageNames[currentLocale]}</span>
		<span class="sm:hidden">{currentLocale.toUpperCase()}</span>
	</button>

	{#if open}
		<div class="absolute right-0 top-full z-50 mt-1 border border-border bg-card shadow-lg">
			{#each locales as lang}
				<a
					href={getLocalizedPath(lang)}
					class="font-ui flex items-center gap-2 px-4 py-2 text-sm transition-colors {lang === currentLocale
						? 'bg-primary text-primary-foreground'
						: 'text-muted-foreground hover:bg-secondary hover:text-foreground'}"
					onclick={() => (open = false)}
				>
					{languageNames[lang]}
				</a>
			{/each}
		</div>
	{/if}
</div>
