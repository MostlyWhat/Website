<script lang="ts">
	import { ArrowUpRight, Menu, X } from '@lucide/svelte';
	// import { LanguageSelectorDesktop } from '$lib/components/ui/language-selector';
	// import { LanguageSelectorMobile } from '$lib/components/ui/language-selector';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let isScrolled = false;
	let isMobileMenuOpen = false;
	let isMobile = false;

	const links = [
		{ title: 'About', href: '/about' },
		{ title: 'Products', href: '/products' },
		{ title: 'Services', href: '/services' },
		{ title: 'Projects', href: '/projects' },
		{ title: 'News', href: '/news' },
		{ title: 'Careers', href: '/careers' }
	];

	const handleScroll = () => {
		isScrolled = window.scrollY > 0;
	};

	const toggleMobileMenu = () => {
		isMobileMenuOpen = !isMobileMenuOpen;
	};

	const checkMobile = () => {
		isMobile = window.innerWidth < 1024;
	};

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		window.addEventListener('resize', checkMobile);
		checkMobile();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', checkMobile);
		};
	});
</script>

<header
	class="header fixed z-40 flex w-full border-b transition-all duration-200"
	class:bg-background={isScrolled || isMobileMenuOpen}
>
	<div class="bg-primary text-primary-foreground hover:bg-primary/90 h-full px-4 py-2">
		<a class="font-heading font-bold uppercase" href="/">
			<span class="block sm:hidden">MostlyWhat</span>
			<span class="hidden sm:block">MostlyWhat Systems</span>
		</a>
	</div>

	<div class="flex flex-1 items-center justify-end">
		<!-- Desktop Navigation -->
		<nav
			class="font-chakra mx-4 mr-auto hidden flex-wrap items-center justify-center gap-8 p-2 text-sm tracking-wide uppercase lg:flex"
		>
			{#each links as link}
				<a
					class="hover:bg-primary/80 hover:text-primary-foreground flex flex-row gap-2 text-white"
					href={link.href}
				>
					<span>{link.title}</span>
					<span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span>
				</a>
			{/each}
			<!--			<LanguageSelectorDesktop />-->
		</nav>

		<!-- Contact Button (visible on all devices) -->
		<div
			class="bg-secondary text-secondary-foreground hover:bg-secondary/80 inline-flex h-full w-full items-center px-4 py-2 text-sm sm:w-auto lg:px-12"
		>
			<a class="font-chakra w-full justify-center uppercase sm:justify-start" href="/contact">
				<span class="flex flex-row items-center">Contact [<ArrowUpRight class="h-4 w-4" />]</span>
			</a>
		</div>

		<!-- Mobile menu button -->
		<button aria-label="Toggle menu" class="bg-background p-2 lg:hidden" onclick={toggleMobileMenu}>
			{#if isMobileMenuOpen}
				<X class="h-6 w-6 text-white" />
			{:else}
				<Menu class="h-6 w-6 text-white" />
			{/if}
		</button>
	</div>

	<!-- Mobile Menu (fullscreen) -->
	{#if isMobileMenuOpen && isMobile}
		<div
			class="bg-background/95 fixed inset-0 top-[40px] z-50 h-screen w-full border-t"
			transition:fly={{ y: -10, duration: 200 }}
		>
			<nav class="font-chakra flex h-full flex-col overflow-y-auto text-sm tracking-wide uppercase">
				{#each links as link}
					<a
						class="border-muted hover:bg-primary hover:text-primary-foreground flex flex-row justify-between border-b p-4 text-white"
						href={link.href}
						onclick={() => (isMobileMenuOpen = false)}
					>
						{link.title}
						<span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span>
					</a>
				{/each}
				<!--				<LanguageSelectorMobile />-->
			</nav>
		</div>
	{/if}
</header>

<style>
	.header {
		view-transition-name: header;
	}
</style>
