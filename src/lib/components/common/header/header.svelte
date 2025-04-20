<script lang="ts">
	import { ArrowUpRight, Menu, X } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let isScrolled = false;
	let isMobileMenuOpen = false;
	let isMobile = false;

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

	const links = [
		{ title: 'About', href: '/about' },
		{ title: 'Products', href: '/products' },
		{ title: 'Services', href: '/services' },
		{ title: 'Projects', href: '/projects' },
		{ title: 'News', href: '/news' },
		{ title: 'Careers', href: '/careers' }
	];
</script>

<header
	class="fixed z-40 w-full border-b transition-all duration-200 flex"
	class:bg-background={isScrolled || isMobileMenuOpen}
>
	<div
		class="bg-primary h-full py-2 px-4 text-primary-foreground hover:bg-primary/90"
	>
		<a class="font-bold uppercase" href="/">
			<span class="block sm:hidden">MostlyWhat</span>
			<span class="hidden sm:block">MostlyWhat Systems</span>
		</a>
	</div>

	<div class="flex flex-1 items-center justify-end">
		<!-- Desktop Navigation -->
		<nav
			class="hidden mx-4 mr-auto flex-wrap items-center justify-center gap-8 p-2 font-mono text-sm uppercase tracking-wide lg:flex"
		>
			{#each links as link}
				<a
					class="flex flex-row gap-2 text-white hover:bg-primary hover:text-primary-foreground"
					href={link.href}
				>
					{link.title}
					<span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span>
				</a>
			{/each}
		</nav>

		<!-- Contact Button (visible on all devices) -->
		<div
			class="inline-flex items-center h-full bg-secondary sm:w-auto w-full px-4 lg:px-12 py-2 text-secondary-foreground hover:bg-secondary/80"
		>
			<a class="flex flex-row gap-2 font-mono uppercase w-full justify-center sm:justify-start" href="/contact">
				Contact<span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span>
			</a>
		</div>

		<!-- Mobile menu button -->
		<button
			aria-label="Toggle menu"
			class="p-2 bg-background lg:hidden"
			on:click={toggleMobileMenu}
		>
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
			class="fixed inset-0 top-[40px] z-50 w-full h-screen border-t bg-background/95"
			transition:fly={{ y: -10, duration: 200 }}
		>
			<nav class="flex flex-col font-mono text-sm uppercase tracking-wide h-full overflow-y-auto">
				{#each links as link}
					<a
						class="flex flex-row justify-between p-4 border-b border-muted text-white hover:bg-primary hover:text-primary-foreground"
						href={link.href}
						on:click={() => isMobileMenuOpen = false}
					>
						{link.title}
						<span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span>
					</a>
				{/each}
			</nav>
		</div>
	{/if}
</header>