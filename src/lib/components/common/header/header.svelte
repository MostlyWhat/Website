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
		isMobile = window.innerWidth < 1024; // Changed to lg breakpoint
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
		<a class="font-bold uppercase" href="/"> MostlyWhat Systems </a>
	</div>

	<div class="flex flex-1 items-center justify-end">
		<!-- Mobile menu button -->
		<button
			aria-label="Toggle menu"
			class="mr-2 lg:hidden ml-auto"
			on:click={toggleMobileMenu}
		>
			{#if isMobileMenuOpen}
				<X class="h-6 w-6 text-white" />
			{:else}
				<Menu class="h-6 w-6 text-white" />
			{/if}
		</button>

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

		<div
			class="hidden lg:inline-flex items-center h-full bg-secondary px-12 py-2 text-secondary-foreground hover:bg-secondary/80"
		>
			<a class="flex flex-row gap-2 font-mono uppercase" href="/contact">
				Contact Us <span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span>
			</a>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if isMobileMenuOpen && isMobile}
		<div
			class="absolute top-full left-0 w-full bg-background border-b"
			transition:fly={{ y: -10, duration: 200 }}
		>
			<nav class="flex flex-col font-mono text-sm uppercase tracking-wide">
				{#each links as link}
					<a
						class="flex flex-row gap-2 p-4 border-b border-muted text-white hover:bg-primary hover:text-primary-foreground"
						href={link.href}
						on:click={() => isMobileMenuOpen = false}
					>
						{link.title}
						<span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span>
					</a>
				{/each}
				<a
					class="flex flex-row gap-2 p-4 bg-secondary text-secondary-foreground hover:bg-secondary/80"
					href="/contact"
					on:click={() => isMobileMenuOpen = false}
				>
					Contact Us <span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span>
				</a>
			</nav>
		</div>
	{/if}
</header>