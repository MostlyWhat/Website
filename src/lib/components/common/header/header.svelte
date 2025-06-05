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
	class="header fixed z-40 w-full border-b transition-all duration-200 flex"
	class:bg-background={isScrolled || isMobileMenuOpen}
>
	<div class="flex flex-1 items-center justify-between">
		<HomeButton />
		<div class="flex items-center">
			<DesktopNav />
			<ContactButton />
			<!-- Mobile menu button -->
			<button
				aria-label="Toggle menu"
				class={cn("bg-secondary lg:hidden", navigationMenuTriggerStyle())}
				on:click={toggleMobileMenu}
			>
				{#if isMobileMenuOpen}
					<X class="h-6 w-6 text-white" />
				{:else}
					<Menu class="h-6 w-6 text-white" />
				{/if}
			</button>
		</div>
	</div>

	<!-- Mobile Menu (fullscreen) -->
	{#if isMobileMenuOpen && isMobile}
		<div
			class="fixed inset-0 top-[36px] z-50 w-full h-screen border-t bg-background/95"
			transition:fly={{ y: -10, duration: 200 }}
		>
			<nav class="flex flex-col font-chakra text-sm uppercase tracking-wide h-full overflow-y-auto">
				{#each mainNavConfig as navItem (navItem.title)}
					{#if navItem.items && navItem.items.length > 0}
						<!-- Nav item with dropdown -->
						<button
							class="flex flex-row justify-between p-4 border-b border-muted text-white hover:bg-primary/20 w-full text-left"
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
										class="flex flex-row justify-between p-3 pl-8 border-b border-muted/50 text-white hover:bg-primary hover:text-primary-foreground"
										href={subItem.href}
										on:click={() => isMobileMenuOpen = false}
									>
										<div>
											<div>{subItem.title}</div>
											{#if subItem.description}
												<div class="text-xs font-normal text-muted-foreground">{subItem.description}</div>
											{/if}
										</div>
										<span class="flex flex-row items-center ml-2">[<ArrowUpRight class="h-4 w-4" />]</span>
									</a>
								{/each}
							</div>
						{/if}
					{:else}
						<!-- Direct link -->
						<a
							class="flex flex-row justify-between p-4 border-b border-muted text-white hover:bg-primary hover:text-primary-foreground"
							href={navItem.href}
							on:click={() => isMobileMenuOpen = false}
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