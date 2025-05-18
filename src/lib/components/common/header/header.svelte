<script lang="ts">
	import { ArrowUpRight, Menu, X } from '@lucide/svelte';
	import { LanguageSelectorDesktop } from '$lib/components/ui/language-selector';
	import { LanguageSelectorMobile } from '$lib/components/ui/language-selector';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let isScrolled = false;
	let isMobileMenuOpen = false;
	let isMobile = false;
	let interval: ReturnType<typeof setInterval>;

	const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
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

	// Function to animate the text with complete animation
	function animate_text(event: Event) {
		let iteration = 0;
		clearInterval(interval);

		// Find the span with data-value within the parent anchor
		const anchor = (event.currentTarget as HTMLElement);
		if (!anchor) return;

		const target = anchor.querySelector('[data-value]') as HTMLElement;
		if (!target || !target.dataset.value) return;

		interval = setInterval(() => {
			target.innerText = target.innerText
				.split('')
				.map((letter: string, index: number) => {
					if (index < iteration) {
						return target.dataset.value?.[index] || '';
					}
					return letters[Math.floor(Math.random() * 26)];
				})
				.join('');

			if (iteration >= (target.dataset.value?.length || 0)) {
				clearInterval(interval);
			}

			iteration += 1 / 3;
		}, 40);
	}
</script>

<header
	class="header fixed z-40 w-full border-b transition-all duration-200 flex"
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
					class="flex flex-row gap-2 text-white hover:bg-primary/80 hover:text-primary-foreground"
					href={link.href}
					onmouseover={animate_text}
					onfocus={animate_text}
				>
					<span data-value={link.title}>{link.title}</span>
					<span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span>
				</a>
			{/each}
			<LanguageSelectorDesktop />
		</nav>

		<!-- Contact Button (visible on all devices) -->
		<div
			class="inline-flex items-center h-full bg-secondary sm:w-auto w-full px-4 lg:px-12 py-2 text-sm text-secondary-foreground hover:bg-secondary/80"
		>
			<a class="font-mono uppercase w-full justify-center sm:justify-start" href="/contact">
				<span class="flex flex-row items-center">Contact [<ArrowUpRight class="h-4 w-4" />]</span>
			</a>
		</div>

		<!-- Mobile menu button -->
		<button
			aria-label="Toggle menu"
			class="p-2 bg-background lg:hidden"
			onclick={toggleMobileMenu}
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
						onclick={() => isMobileMenuOpen = false}
					>
						{link.title}
						<span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span>
					</a>
				{/each}
				<LanguageSelectorMobile />
			</nav>
		</div>
	{/if}
</header>

<style>
    .header {
        view-transition-name: header;
    }
</style>