<script lang="ts">
	import { ArrowUpRight, Menu, X, ChevronDown, ChevronRight } from '@lucide/svelte';
	import DesktopNav from './desktop-nav.svelte';
	import { onMount } from 'svelte';
	import { fly, slide } from 'svelte/transition';
	import { cn } from '$lib/utils';
	import ContactButton from './contact-button.svelte';
	import HomeButton from './home-button.svelte';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { mainNavConfig } from '$lib/config/nav';

	let isScrolled = false;
	let isMobileMenuOpen = false;
	let isMobile = false;
	let expandedItems = new Set();

	const handleScroll = () => {
		isScrolled = window.scrollY > 0;
	};

	const toggleMobileMenu = () => {
		isMobileMenuOpen = !isMobileMenuOpen;
	};

	const toggleSubMenu = (title: string) => {
		if (expandedItems.has(title)) {
			expandedItems.delete(title);
		} else {
			expandedItems.add(title);
		}
		expandedItems = expandedItems; // Trigger reactivity
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
	class="header fixed z-40 w-full border-b transition-all duration-200"
	class:bg-background={isScrolled || isMobileMenuOpen}
>
	<div class="flex w-full items-center justify-between">
		<div class="flex items-center">
			<!-- Mobile menu button -->
			<button
				aria-label="Toggle menu"
				class={cn('bg-secondary lg:hidden', navigationMenuTriggerStyle())}
				on:click={toggleMobileMenu}
			>
				{#if isMobileMenuOpen}
					<X class="size-4 text-white" />
				{:else}
					<Menu class="size-4 text-white" />
				{/if}
			</button>
			<HomeButton />
			<DesktopNav />
		</div>

		<ContactButton />
	</div>

	<!-- Mobile Menu (fullscreen) -->
	{#if isMobileMenuOpen && isMobile}
		<div
			class="bg-background/95 fixed inset-0 top-[36px] z-50 h-screen w-full border-t"
			transition:fly={{ y: -10, duration: 200 }}
		>
			<nav class="font-chakra flex h-full flex-col overflow-y-auto text-sm tracking-wide uppercase">
				{#each mainNavConfig as navItem (navItem.title)}
					{#if navItem.items && navItem.items.length > 0}
						<!-- Nav item with dropdown -->
						<button
							class="border-muted hover:bg-primary/20 flex w-full flex-row justify-between border-b p-4 text-left text-white uppercase"
							on:click={() => toggleSubMenu(navItem.title)}
						>
							{navItem.title}
							<span class="flex flex-row items-center">
								{#if expandedItems.has(navItem.title)}
									<ChevronDown class="h-4 w-4" />
								{:else}
									<ChevronRight class="h-4 w-4" />
								{/if}
							</span>
						</button>

						{#if expandedItems.has(navItem.title)}
							<div class="bg-background/80" transition:slide={{ duration: 200 }}>
								{#each navItem.items as subItem (subItem.title)}
									<a
										class="border-muted/50 hover:bg-primary hover:text-primary-foreground flex flex-row justify-between border-b p-3 pl-8 text-white"
										href={subItem.href}
										on:click={() => (isMobileMenuOpen = false)}
									>
										<div>
											<div class="uppercase">{subItem.title}</div>
											{#if subItem.description}
												<div class="text-muted-foreground text-xs font-normal">
													{subItem.description}
												</div>
											{/if}
										</div>
										<span class="ml-2 flex flex-row items-center"
											>[<ArrowUpRight class="h-4 w-4" />]</span
										>
									</a>
								{/each}
							</div>
						{/if}
					{:else}
						<!-- Direct link -->
						<a
							class="border-muted hover:bg-primary hover:text-primary-foreground flex flex-row justify-between border-b p-4 text-white uppercase"
							href={navItem.href}
							on:click={() => (isMobileMenuOpen = false)}
						>
							{navItem.title}
							<span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span>
						</a>
					{/if}
				{/each}
			</nav>
		</div>
	{/if}
</header>

<style>
	.header {
		view-transition-name: header;
	}
</style>
