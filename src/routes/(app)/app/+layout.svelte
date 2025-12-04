<script lang="ts">
	/**
	 * App Layout (Customer Portal)
	 * 
	 * Dashboard layout for customers with sidebar navigation.
	 */
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { onMount } from 'svelte';
	import {
		LayoutDashboard,
		FolderKanban,
		FileText,
		Receipt,
		Ticket,
		Settings,
		LogOut,
		Menu,
		X,
		User,
		Home,
		ChevronRight,
		Shield,
		Megaphone,
		Building2,
		HelpCircle,
		Sparkles
	} from '@lucide/svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import TutorialOverlay from '$lib/components/layout/TutorialOverlay.svelte';
	import { tutorialStore } from '$lib/stores/tutorial.svelte';

	let { children, data } = $props();
	let mobileMenuOpen = $state(false);
	let dismissedAnnouncements = $state<string[]>([]);

	// Check if user has admin access
	const isAdmin = $derived(
		data.profile?.role === 'super_admin' || 
		data.profile?.role === 'admin' || 
		data.profile?.role === 'staff'
	);

	// Check if user has organizations
	const hasOrganizations = $derived((data.userOrganizations ?? []).length > 0);
	const isOrganizationAccount = $derived(data.profile?.preferences?.accountType === 'organization');
	const isPersonalAccount = $derived(data.profile?.preferences?.accountType === 'personal');

	// Active announcements (filter out dismissed ones)
	const visibleAnnouncements = $derived(
		(data.announcements ?? []).filter(a => !dismissedAnnouncements.includes(a.id))
	);

	function dismissAnnouncement(id: string) {
		dismissedAnnouncements = [...dismissedAnnouncements, id];
	}

	// Build navigation dynamically based on account type
	const navigation = $derived([
		{ href: '/app', label: 'DASHBOARD', icon: LayoutDashboard, exact: true, tutorialId: 'dashboard-link' },
		{ href: '/app/projects', label: 'PROJECTS', icon: FolderKanban, tutorialId: 'projects-link' },
		{ href: '/app/organization', label: isPersonalAccount ? 'WORKSPACE' : 'ORGANIZATION', icon: Building2, tutorialId: 'org-link' },
		{ href: '/app/proposals', label: 'PROPOSALS', icon: FileText, tutorialId: 'proposals-link' },
		{ href: '/app/invoices', label: 'INVOICES', icon: Receipt, tutorialId: 'invoices-link' },
		{ href: '/app/tickets', label: 'TICKETS', icon: Ticket, tutorialId: 'tickets-link' },
		{ href: '/app/help', label: 'HELP CENTER', icon: HelpCircle, tutorialId: 'help-link' },
		{ href: '/app/settings', label: 'SETTINGS', icon: Settings, tutorialId: 'settings-link' }
	]);

	// Start tutorial for new users
	onMount(() => {
		// Check if user has completed onboarding recently and hasn't seen the tutorial
		if (data.profile?.onboardingCompleted && !tutorialStore.isCompleted('app-intro')) {
			// Small delay to let the page render first
			setTimeout(() => {
				tutorialStore.start('app-intro');
			}, 500);
		}
	});

	function startTutorial() {
		tutorialStore.start('app-intro');
	}

	function isActive(href: string, exact?: boolean): boolean {
		if (exact) {
			return page.url.pathname === href;
		}
		return page.url.pathname.startsWith(href);
	}
</script>

<!-- Tutorial Overlay -->
<TutorialOverlay />

<div class="flex h-screen overflow-hidden bg-background">
	<!-- Desktop Sidebar -->
	<aside class="hidden w-72 flex-shrink-0 border-r border-border bg-card lg:flex lg:flex-col overflow-hidden" data-tutorial="sidebar">
		<!-- Logo -->
		<div class="flex h-16 items-center justify-between border-b border-border px-6">
			<a href={localizeHref('/')} class="group flex items-center gap-2">
				<span class="font-display text-sm font-black uppercase tracking-wider text-primary">MOSTLYWHAT</span>
				<span class="font-mono text-[10px] tracking-wider text-muted-foreground">// PORTAL</span>
			</a>
			<!-- Tutorial Button -->
			<button
				onclick={startTutorial}
				class="flex h-8 w-8 items-center justify-center border border-border bg-background transition-colors hover:bg-card hover:border-primary"
				title="Start tutorial"
			>
				<Sparkles class="h-3.5 w-3.5 text-muted-foreground hover:text-primary" />
			</button>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 overflow-y-auto border-b border-border">
			{#each navigation as { href, label, icon: Icon, exact, tutorialId }}
				<a
					{href}
					data-tutorial={tutorialId}
					class="group flex items-center gap-4 border-b border-border px-6 py-4 transition-colors {isActive(href, exact)
						? 'bg-primary/10 text-primary'
						: 'text-muted-foreground hover:bg-card hover:text-foreground'}"
				>
					<div class="flex h-10 w-10 items-center justify-center border transition-colors {isActive(href, exact) ? 'border-primary bg-primary/10' : 'border-border bg-background'}">
						<Icon class="h-4 w-4 {isActive(href, exact) ? 'text-primary' : ''}" />
					</div>
					<span class="font-ui flex-1 text-xs tracking-wider">{label}</span>
					<ChevronRight class="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 {isActive(href, exact) ? 'opacity-100' : ''}" />
				</a>
			{/each}
		</nav>

		<!-- User Section -->
		<div class="mt-auto">
			<!-- Admin Panel Access (for staff) -->
			{#if isAdmin}
				<a
					href="/admin"
					class="flex items-center gap-4 border-b border-border px-6 py-4 transition-colors text-muted-foreground hover:bg-primary/10 hover:text-primary"
				>
					<div class="flex h-10 w-10 items-center justify-center border border-primary/30 bg-primary/10">
						<Shield class="h-4 w-4 text-primary" />
					</div>
					<span class="font-ui flex-1 text-xs tracking-wider">ADMIN PANEL</span>
					<ChevronRight class="h-4 w-4" />
				</a>
			{/if}
			
			<!-- Profile -->
			<div class="border-b border-border px-6 py-4">
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-background">
						{#if data.profile?.avatarUrl}
							<img
								src={data.profile.avatarUrl}
								alt="Avatar"
								class="h-12 w-12 object-cover"
							/>
						{:else}
							<User class="h-5 w-5 text-primary" />
						{/if}
					</div>
					<div class="flex-1 min-w-0">
						<p class="font-ui text-sm font-semibold tracking-wider truncate">
							{data.profile?.displayName ?? data.profile?.firstName ?? 'User'}
						</p>
						<p class="font-mono text-[10px] tracking-wider text-muted-foreground truncate">
							{data.user?.email}
						</p>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="grid grid-cols-2 gap-px bg-border">
				<a
					href="/app/settings"
					class="flex items-center justify-center gap-2 bg-card px-4 py-4 text-muted-foreground transition-colors hover:bg-card/80 hover:text-foreground"
				>
					<Settings class="h-4 w-4" />
					<span class="font-mono text-[10px] tracking-wider">SETTINGS</span>
				</a>
				<a
					href="/auth/logout"
					class="flex items-center justify-center gap-2 bg-card px-4 py-4 text-muted-foreground transition-colors hover:bg-card/80 hover:text-foreground"
				>
					<LogOut class="h-4 w-4" />
					<span class="font-mono text-[10px] tracking-wider">LOGOUT</span>
				</a>
			</div>
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex flex-1 flex-col">
		<!-- Mobile Header -->
		<header class="flex h-16 items-center justify-between border-b border-border bg-card px-6 lg:hidden">
			<a href={localizeHref('/')} class="group flex items-center gap-2">
				<span class="font-display text-sm font-black uppercase tracking-wider text-primary">MOSTLYWHAT</span>
			</a>

			<Sheet.Root bind:open={mobileMenuOpen}>
				<Sheet.Trigger class="flex h-10 w-10 items-center justify-center border border-border bg-background">
					<Menu class="h-5 w-5" />
				</Sheet.Trigger>
				<Sheet.Content side="right" class="w-80 p-0 [&>button[data-dialog-close]]:hidden">
					<div class="flex h-full flex-col">
						<!-- Header -->
						<div class="flex h-16 items-center justify-between border-b border-border px-6">
							<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// NAVIGATION</span>
							<Sheet.Close class="flex h-10 w-10 items-center justify-center border border-border bg-background">
								<X class="h-5 w-5" />
							</Sheet.Close>
						</div>

						<!-- Navigation -->
						<nav class="flex-1 overflow-auto">
							{#each navigation as { href, label, icon: Icon, exact }}
								<a
									{href}
									onclick={() => (mobileMenuOpen = false)}
									class="flex items-center gap-4 border-b border-border px-6 py-4 transition-colors {isActive(href, exact)
										? 'bg-primary/10 text-primary'
										: 'text-muted-foreground hover:bg-card hover:text-foreground'}"
								>
									<div class="flex h-10 w-10 items-center justify-center border {isActive(href, exact) ? 'border-primary bg-primary/10' : 'border-border bg-card'}">
										<Icon class="h-4 w-4" />
									</div>
									<span class="font-ui flex-1 text-xs tracking-wider">{label}</span>
									<ChevronRight class="h-4 w-4" />
								</a>
							{/each}
						</nav>

						<!-- User Section -->
						<div class="mt-auto border-t border-border">
							{#if isAdmin}
								<a
									href="/admin"
									onclick={() => (mobileMenuOpen = false)}
									class="flex items-center gap-4 border-b border-border px-6 py-4 transition-colors text-muted-foreground hover:bg-primary/10 hover:text-primary"
								>
									<div class="flex h-10 w-10 items-center justify-center border border-primary/30 bg-primary/10">
										<Shield class="h-4 w-4 text-primary" />
									</div>
									<span class="font-ui flex-1 text-xs tracking-wider">ADMIN PANEL</span>
									<ChevronRight class="h-4 w-4" />
								</a>
							{/if}
							<div class="border-b border-border px-6 py-4">
								<div class="flex items-center gap-4">
									<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
										<User class="h-5 w-5 text-primary" />
									</div>
									<div class="flex-1 min-w-0">
										<p class="font-ui text-sm font-semibold tracking-wider truncate">
											{data.profile?.displayName ?? 'User'}
										</p>
										<p class="font-mono text-[10px] tracking-wider text-muted-foreground truncate">
											{data.user?.email}
										</p>
									</div>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-px bg-border">
								<a
									href="/app/settings"
									onclick={() => (mobileMenuOpen = false)}
									class="flex items-center justify-center gap-2 bg-background px-4 py-4 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
								>
									<Settings class="h-4 w-4" />
									<span class="font-mono text-[10px] tracking-wider">SETTINGS</span>
								</a>
								<a
									href="/auth/logout"
									class="flex items-center justify-center gap-2 bg-background px-4 py-4 text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
								>
									<LogOut class="h-4 w-4" />
									<span class="font-mono text-[10px] tracking-wider">LOGOUT</span>
								</a>
							</div>
						</div>
					</div>
				</Sheet.Content>
			</Sheet.Root>
		</header>

		<!-- Back to Main Site (Desktop) -->
		<div class="hidden border-b border-border bg-card/50 px-6 py-2 lg:block">
			<a href={localizeHref('/')} class="font-mono flex items-center gap-2 text-[10px] tracking-wider text-muted-foreground transition-colors hover:text-foreground">
				<Home class="h-3 w-3" />
				BACK TO MAIN SITE
			</a>
		</div>

		<!-- Announcement Bar -->
		{#if visibleAnnouncements.length > 0}
			<div class="border-b border-border">
				{#each visibleAnnouncements as announcement (announcement.id)}
					{@const typeStyles: Record<string, { bg: string; text: string }> = {
						warning: { bg: 'border-yellow-500/30 bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400' },
						success: { bg: 'border-green-500/30 bg-green-500/10', text: 'text-green-600 dark:text-green-400' },
						error: { bg: 'border-destructive/30 bg-destructive/10', text: 'text-destructive' },
						info: { bg: 'border-blue-500/30 bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' }
					}}
					{@const style = typeStyles[announcement.type] || typeStyles.info}
					<div class="flex items-center gap-4 border-b last:border-b-0 px-4 py-2 {style.bg}">
						<Megaphone class="h-4 w-4 flex-shrink-0 {style.text}" />
						<div class="flex-1 min-w-0">
							<span class="font-ui text-xs font-semibold tracking-wider {style.text}">{announcement.title}</span>
							{#if announcement.message}
								<span class="mx-2 text-muted-foreground/50">—</span>
								<span class="font-body text-sm text-muted-foreground">{announcement.message}</span>
							{/if}
						</div>
						{#if announcement.dismissible}
							<button
								type="button"
								onclick={() => dismissAnnouncement(announcement.id)}
								class="flex h-6 w-6 flex-shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
							>
								<X class="h-4 w-4" />
							</button>
						{/if}
					</div>
				{/each}
			</div>
		{/if}

		<!-- Page Content -->
		<main class="flex-1 overflow-auto">
			{@render children()}
		</main>
	</div>
</div>
