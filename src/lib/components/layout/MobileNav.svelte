/**
 * Mobile Navigation Component
 * 
 * Responsive hamburger menu for mobile devices
 */

<script lang="ts">
	import { slide } from 'svelte/transition';

	interface NavItem {
		label: string;
		href: string;
		icon?: string;
		badge?: number;
	}

	interface Props {
		items: NavItem[];
		currentPath?: string;
		logo?: string;
		siteName?: string;
	}

	let { items = [], currentPath = '', logo, siteName = 'MostlyWhat' }: Props = $props();

	let isOpen = $state(false);

	function toggleMenu() {
		isOpen = !isOpen;
	}

	function closeMenu() {
		isOpen = false;
	}

	function isActive(href: string): boolean {
		return currentPath === href || currentPath.startsWith(href + '/');
	}
</script>

<!-- Mobile Navigation -->
<nav class="mobile-nav lg:hidden">
	<div class="mobile-nav-header">
		<div class="flex items-center gap-3">
			{#if logo}
				<img src={logo} alt={siteName} class="h-8 w-auto" />
			{/if}
			<span class="text-lg font-bold text-gray-900">{siteName}</span>
		</div>

		<button
			onclick={toggleMenu}
			class="mobile-menu-button"
			aria-label="Toggle menu"
			aria-expanded={isOpen}
		>
			{#if isOpen}
				<!-- Close icon -->
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M6 18L18 6M6 6l12 12"
					/>
				</svg>
			{:else}
				<!-- Hamburger icon -->
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			{/if}
		</button>
	</div>

	{#if isOpen}
		<div class="mobile-menu" transition:slide={{ duration: 200 }}>
			{#each items as item (item.href)}
				<a
					href={item.href}
					class="mobile-menu-item"
					class:active={isActive(item.href)}
					onclick={closeMenu}
				>
					{#if item.icon}
						<span class="menu-icon">{@html item.icon}</span>
					{/if}
					<span class="flex-1">{item.label}</span>
					{#if item.badge && item.badge > 0}
						<span class="menu-badge">{item.badge}</span>
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</nav>

<!-- Desktop Navigation - Hidden on mobile -->
<nav class="desktop-nav hidden lg:block">
	<slot />
</nav>

<style>
	.mobile-nav {
		position: sticky;
		top: 0;
		z-index: 40;
		background: white;
		border-bottom: 1px solid #e5e7eb;
	}

	.mobile-nav-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
	}

	.mobile-menu-button {
		padding: 0.5rem;
		color: #4b5563;
		border-radius: 0.375rem;
		transition: all 0.2s;
	}

	.mobile-menu-button:hover {
		background: #f3f4f6;
		color: #1f2937;
	}

	.mobile-menu {
		border-top: 1px solid #e5e7eb;
		background: white;
		max-height: calc(100vh - 80px);
		overflow-y: auto;
	}

	.mobile-menu-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem;
		color: #4b5563;
		border-bottom: 1px solid #f3f4f6;
		transition: all 0.2s;
		text-decoration: none;
		font-size: 0.9375rem;
		font-weight: 500;
	}

	.mobile-menu-item:hover {
		background: #f9fafb;
		color: #1f2937;
	}

	.mobile-menu-item.active {
		background: #eff6ff;
		color: #2563eb;
		border-left: 3px solid #2563eb;
		padding-left: calc(1rem - 3px);
	}

	.menu-icon {
		width: 1.25rem;
		height: 1.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.menu-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 1.25rem;
		height: 1.25rem;
		padding: 0 0.375rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: white;
		background: #ef4444;
		border-radius: 9999px;
	}

	.desktop-nav {
		/* Let the parent component style this */
	}

	/* Touch target optimization for mobile */
	@media (max-width: 1024px) {
		.mobile-menu-item {
			min-height: 48px; /* Minimum touch target size */
		}

		.mobile-menu-button {
			min-width: 44px;
			min-height: 44px;
		}
	}
</style>
