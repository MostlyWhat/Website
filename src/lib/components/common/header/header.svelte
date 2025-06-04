<script lang="ts">
	import { ArrowUpRight, Menu, X } from '@lucide/svelte';
	import DesktopNav from './desktop-nav.svelte';
	import MobileNav from './mobile-nav.svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import HomeButton from './home-button.svelte';
	import ContactButton from './contact-button.svelte';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';

	let isScrolled = false;
	let isMobileMenuOpen = false;
	let isMobile = false;

	const links = [
		{ title: 'About', href: '/about' },
		{ title: 'Products', href: '/products' },
		{ title: 'Services', href: '/services' },
		{ title: 'Projects', href: '/projects' },
		{ title: 'News', href: '/news' },
		{ title: 'Careers', href: '/careers' },
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
	class="header fixed z-40 w-full border-b transition-all duration-200 flex"
	class:bg-background={isScrolled || isMobileMenuOpen}
>
	<HomeButton />
	<div class="flex flex-1 items-center justify-end">
		<DesktopNav {links} />
		<ContactButton />

		<!-- Mobile menu button -->
		<button
			aria-label="Toggle menu"
			class={cn("lg:hidden",navigationMenuTriggerStyle())}
			onclick={toggleMobileMenu}
		>
			{#if isMobileMenuOpen}
				<X class="h-6 w-6 text-white" />
			{:else}
				<Menu class="h-6 w-6 text-white" />
			{/if}
		</button>
	</div>

</header>

<style>
    .header {
        view-transition-name: header;
    }
</style>