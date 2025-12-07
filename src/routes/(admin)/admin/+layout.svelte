<script lang="ts">
	/**
	 * Admin Layout
	 * 
	 * Dashboard layout for admin/staff with full sidebar navigation.
	 */
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { enhance } from '$app/forms';
	import {
		LayoutDashboard,
		Users,
		Building2,
		FolderKanban,
		FileText,
		Receipt,
		Ticket,
		Settings,
		LogOut,
		Menu,
		X,
		User,
		BarChart3,
		Home,
		ChevronRight,
		Shield,
		MessageSquareText,
		Clock,
		Activity,
		BookOpen,
		UsersRound,
		Bell,
		Megaphone,
		AlertTriangle,
		Info,
		CheckCircle,
		XCircle,
		ArrowLeft,
		ExternalLink,
		PenLine,
		Briefcase
	} from '@lucide/svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';

	let { children, data } = $props();
	let mobileMenuOpen = $state(false);
	let dismissedAnnouncements = $state<string[]>([]);

	// Active announcements (not dismissed)
	const visibleAnnouncements = $derived(
		(data.announcements ?? []).filter(a => !dismissedAnnouncements.includes(a.id))
	);

	// Build breadcrumbs from URL
	const breadcrumbs = $derived(() => {
		const path = page.url.pathname;
		const segments = path.split('/').filter(Boolean);
		const crumbs: { href: string; label: string }[] = [];
		
		let currentPath = '';
		for (const segment of segments) {
			currentPath += '/' + segment;
			// Convert segment to display label
			const label = segment
				.split('-')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
			crumbs.push({ href: currentPath, label });
		}
		
		return crumbs;
	});

	function dismissAnnouncement(id: string) {
		dismissedAnnouncements = [...dismissedAnnouncements, id];
	}

	function getAnnouncementIcon(type: string) {
		switch (type) {
			case 'warning': return AlertTriangle;
			case 'success': return CheckCircle;
			case 'error': return XCircle;
			default: return Info;
		}
	}

	function getAnnouncementStyle(type: string) {
		switch (type) {
			case 'warning': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400';
			case 'success': return 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400';
			case 'error': return 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400';
			default: return 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400';
		}
	}

	// Consolidated navigation - no more legacy section
	const navigation = [
		{ href: '/admin', label: 'DASHBOARD', icon: LayoutDashboard, exact: true },
		{ href: '/admin/projects', label: 'PROJECTS', icon: FolderKanban },
		{ href: '/admin/organizations', label: 'ORGANIZATIONS', icon: Building2 },
		{ href: '/admin/invoices', label: 'INVOICES', icon: Receipt },
		{ href: '/admin/tickets', label: 'TICKETS', icon: Ticket },
		{ href: '/admin/reports', label: 'REPORTS', icon: BarChart3 }
	];

	// Content Management Section
	const contentNav = [
		{ href: '/admin/blog', label: 'BLOG POSTS', icon: PenLine },
		{ href: '/admin/portfolio', label: 'PORTFOLIO', icon: Briefcase }
	];

	// Add notifications popup state
	let notificationsOpen = $state(false);

	// Settings submenu items
	const settingsNav = [
		{ href: '/admin/users', label: 'USERS', icon: Users },
		{ href: '/admin/staff-groups', label: 'STAFF GROUPS', icon: UsersRound },
		{ href: '/admin/announcements', label: 'ANNOUNCEMENTS', icon: Megaphone, adminOnly: true },
		{ href: '/admin/sla-policies', label: 'SLA POLICIES', icon: Clock },
		{ href: '/admin/canned-responses', label: 'TEMPLATES', icon: MessageSquareText },
		{ href: '/admin/knowledge-base', label: 'KNOWLEDGE BASE', icon: BookOpen },
		{ href: '/admin/activity-log', label: 'ACTIVITY', icon: Activity, adminOnly: true },
		{ href: '/admin/settings', label: 'SYSTEM', icon: Settings, adminOnly: true }
	];

	function isActive(href: string, exact?: boolean): boolean {
		if (exact) {
			return page.url.pathname === href;
		}
		return page.url.pathname.startsWith(href);
	}

	const isAdmin = $derived(data.profile?.role === 'admin' || data.profile?.role === 'super_admin');
	const roleLabel = $derived(data.profile?.role === 'super_admin' ? 'SUPER ADMIN' : data.profile?.role === 'admin' ? 'ADMIN' : 'STAFF');
</script>

<div class="flex h-screen overflow-hidden bg-background">
	<!-- Desktop Sidebar -->
	<aside class="hidden w-64 flex-shrink-0 border-r border-border bg-card lg:flex lg:flex-col overflow-hidden">
		<!-- Logo -->
		<div class="flex h-14 items-center border-b border-border px-4">
			<a href={localizeHref('/')} class="group flex items-center gap-2">
				<span class="font-display text-sm font-black uppercase tracking-wider text-primary">MOSTLYWHAT</span>
				<span class="flex items-center gap-1 border border-primary/30 bg-primary/10 px-1.5 py-0.5">
					<Shield class="h-2.5 w-2.5 text-primary" />
					<span class="font-mono text-[9px] tracking-wider text-primary">{roleLabel}</span>
				</span>
			</a>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 overflow-y-auto border-b border-border">
			<!-- Main Navigation -->
			{#each navigation as { href, label, icon: Icon, exact }}
				<a
					{href}
					class="group flex items-center gap-3 border-b border-border px-4 py-2.5 transition-colors {isActive(href, exact)
						? 'bg-primary/10 text-primary'
						: 'text-muted-foreground hover:bg-card hover:text-foreground'}"
				>
					<div class="flex h-8 w-8 items-center justify-center border transition-colors {isActive(href, exact) ? 'border-primary bg-primary/10' : 'border-border bg-background'}">
						<Icon class="h-3.5 w-3.5 {isActive(href, exact) ? 'text-primary' : ''}" />
					</div>
					<span class="font-ui flex-1 text-[11px] tracking-wider">{label}</span>
					<ChevronRight class="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 {isActive(href, exact) ? 'opacity-100' : ''}" />
				</a>
			{/each}

			<!-- Content Management Section -->
			<div class="px-4 py-2 mt-2">
				<span class="font-mono text-[9px] tracking-widest text-muted-foreground/50">CONTENT</span>
			</div>
			{#each contentNav as { href, label, icon: Icon }}
				<a
					{href}
					class="group flex items-center gap-3 border-b border-border px-4 py-2 transition-colors {isActive(href)
						? 'bg-primary/10 text-primary'
						: 'text-muted-foreground/70 hover:bg-card hover:text-foreground'}"
				>
					<div class="flex h-6 w-6 items-center justify-center border transition-colors {isActive(href) ? 'border-primary bg-primary/10' : 'border-border/50 bg-background'}">
						<Icon class="h-3 w-3 {isActive(href) ? 'text-primary' : ''}" />
					</div>
					<span class="font-ui flex-1 text-[10px] tracking-wider">{label}</span>
				</a>
			{/each}

			<!-- Settings Section -->
			<div class="px-4 py-2 mt-2">
				<span class="font-mono text-[9px] tracking-widest text-muted-foreground/50">SETTINGS</span>
			</div>
			{#each settingsNav as { href, label, icon: Icon, adminOnly }}
				{#if !adminOnly || isAdmin}
				<a
					{href}
					class="group flex items-center gap-3 border-b border-border px-4 py-2 transition-colors {isActive(href)
						? 'bg-primary/10 text-primary'
						: 'text-muted-foreground/70 hover:bg-card hover:text-foreground'}"
				>
					<div class="flex h-6 w-6 items-center justify-center border transition-colors {isActive(href) ? 'border-primary bg-primary/10' : 'border-border/50 bg-background'}">
						<Icon class="h-3 w-3 {isActive(href) ? 'text-primary' : ''}" />
					</div>
					<span class="font-ui flex-1 text-[10px] tracking-wider">{label}</span>
				</a>
				{/if}
			{/each}
		</nav>

		<!-- User Section -->
		<div class="mt-auto">
			<!-- Back to Portal Link -->
			<a
				href="/app"
				class="flex items-center gap-3 border-b border-border px-4 py-2.5 transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground"
			>
				<div class="flex h-8 w-8 items-center justify-center border border-border bg-background">
					<Home class="h-3.5 w-3.5" />
				</div>
				<span class="font-ui flex-1 text-[11px] tracking-wider">BACK TO PORTAL</span>
				<ChevronRight class="h-3 w-3" />
			</a>
			
			<!-- Profile -->
			<div class="border-b border-border px-4 py-3">
				<div class="flex items-center gap-3">
					<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
						{#if data.profile?.avatarUrl}
							<img
								src={data.profile.avatarUrl}
								alt="Avatar"
								class="h-10 w-10 object-cover"
							/>
						{:else}
							<User class="h-4 w-4 text-primary" />
						{/if}
					</div>
					<div class="flex-1 min-w-0">
						<p class="font-ui text-xs font-semibold tracking-wider truncate">
							{data.profile?.displayName ?? data.profile?.firstName ?? 'User'}
						</p>
						<p class="font-mono text-[9px] tracking-wider text-muted-foreground truncate uppercase">
							{data.profile?.role}
						</p>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="grid grid-cols-2 gap-px bg-border">
				<a
					href="/admin/settings"
					class="flex items-center justify-center gap-1.5 bg-card px-3 py-3 text-muted-foreground transition-colors hover:bg-card/80 hover:text-foreground"
				>
					<Settings class="h-3.5 w-3.5" />
					<span class="font-mono text-[9px] tracking-wider">SETTINGS</span>
				</a>
				<a
					href="/auth/logout"
					class="flex items-center justify-center gap-1.5 bg-card px-3 py-3 text-muted-foreground transition-colors hover:bg-card/80 hover:text-foreground"
				>
					<LogOut class="h-3.5 w-3.5" />
					<span class="font-mono text-[9px] tracking-wider">LOGOUT</span>
				</a>
			</div>
		</div>
	</aside>

	<!-- Main Content -->
	<div class="flex flex-1 flex-col">
		<!-- Mobile Header -->
		<header class="flex h-16 items-center justify-between border-b border-border bg-card px-6 lg:hidden">
			<a href={localizeHref('/')} class="group flex items-center gap-2">
				<span class="font-display text-sm font-black uppercase tracking-wider text-primary">ADMIN</span>
			</a>

			<Sheet.Root bind:open={mobileMenuOpen}>
				<Sheet.Trigger class="flex h-10 w-10 items-center justify-center border border-border bg-background">
					<Menu class="h-5 w-5" />
				</Sheet.Trigger>
				<Sheet.Content side="right" class="w-80 p-0 [&>button[data-dialog-close]]:hidden">
					<div class="flex h-full flex-col">
						<!-- Header -->
						<div class="flex h-16 items-center justify-between border-b border-border px-6">
							<div class="flex items-center gap-2">
								<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ADMIN</span>
								<span class="flex items-center gap-1 border border-primary/30 bg-primary/10 px-2 py-0.5">
									<Shield class="h-3 w-3 text-primary" />
									<span class="font-mono text-[10px] tracking-wider text-primary">{roleLabel}</span>
								</span>
							</div>
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

							<!-- Content Section -->
							<div class="px-6 py-2 mt-2">
								<span class="font-mono text-[9px] tracking-widest text-muted-foreground/50">CONTENT</span>
							</div>
							{#each contentNav as { href, label, icon: Icon }}
								<a
									{href}
									onclick={() => (mobileMenuOpen = false)}
									class="flex items-center gap-4 border-b border-border px-6 py-3 transition-colors {isActive(href)
										? 'bg-primary/10 text-primary'
										: 'text-muted-foreground hover:bg-card hover:text-foreground'}"
								>
									<div class="flex h-8 w-8 items-center justify-center border {isActive(href) ? 'border-primary bg-primary/10' : 'border-border bg-card'}">
										<Icon class="h-3.5 w-3.5" />
									</div>
									<span class="font-ui flex-1 text-xs tracking-wider">{label}</span>
									<ChevronRight class="h-4 w-4" />
								</a>
							{/each}
						</nav>

						<!-- User Section -->
						<div class="mt-auto border-t border-border">
							<!-- Back to Portal Link -->
							<a
								href="/app"
								onclick={() => (mobileMenuOpen = false)}
								class="flex items-center gap-4 border-b border-border px-6 py-4 transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground"
							>
								<div class="flex h-10 w-10 items-center justify-center border border-border bg-card">
									<Home class="h-4 w-4" />
								</div>
								<span class="font-ui flex-1 text-xs tracking-wider">BACK TO PORTAL</span>
								<ChevronRight class="h-4 w-4" />
							</a>
							<div class="border-b border-border px-6 py-4">
								<div class="flex items-center gap-4">
									<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
										<User class="h-5 w-5 text-primary" />
									</div>
									<div class="flex-1 min-w-0">
										<p class="font-ui text-sm font-semibold tracking-wider truncate">
											{data.profile?.displayName ?? 'User'}
										</p>
										<p class="font-mono text-[10px] tracking-wider text-muted-foreground truncate uppercase">
											{data.profile?.role}
										</p>
									</div>
								</div>
							</div>
							<div class="grid grid-cols-2 gap-px bg-border">
								<a
									href="/admin/settings"
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

		<!-- Top Navigation Bar (Desktop) -->
		<div class="hidden h-14 border-b border-border bg-card lg:flex lg:items-center">
			<div class="flex w-full items-center justify-between px-6">
				<!-- Left: Back + Breadcrumbs -->
				<div class="flex items-center gap-4">
					<a href={localizeHref('/')} class="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground border border-border px-2 py-1 bg-background hover:bg-card">
						<ArrowLeft class="h-3 w-3" />
						<span class="font-mono text-[10px] tracking-wider">MAIN SITE</span>
					</a>
					<div class="h-4 w-px bg-border"></div>
					<nav class="flex items-center gap-2">
						{#each breadcrumbs() as crumb, i}
							{#if i > 0}
								<ChevronRight class="h-3 w-3 text-muted-foreground/50" />
							{/if}
							{#if i === breadcrumbs().length - 1}
								<span class="font-mono text-[10px] tracking-wider text-foreground">{crumb.label}</span>
							{:else}
								<a 
									href={crumb.href} 
									class="font-mono text-[10px] tracking-wider text-muted-foreground hover:text-foreground transition-colors"
								>
									{crumb.label}
								</a>
							{/if}
						{/each}
					</nav>
				</div>

				<!-- Right: Notifications + Announcements indicator -->
				<div class="flex items-center gap-2">
					<!-- Portal Link -->
					<a href="/app" class="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground border border-border px-2 py-1 bg-background hover:bg-card">
						<Home class="h-3 w-3" />
						<span class="font-mono text-[10px] tracking-wider">PORTAL</span>
					</a>

					<!-- Announcements Badge -->
					{#if visibleAnnouncements.length > 0}
						<div class="flex items-center gap-2 border border-yellow-500/30 bg-yellow-500/10 px-2 py-1">
							<Megaphone class="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
							<span class="font-mono text-[10px] tracking-wider text-yellow-600 dark:text-yellow-400">
								{visibleAnnouncements.length} ANNOUNCEMENT{visibleAnnouncements.length > 1 ? 'S' : ''}
							</span>
						</div>
					{/if}

					<!-- Notifications Button -->
					<div class="relative">
						<button
							onclick={() => notificationsOpen = !notificationsOpen}
							class="flex h-8 w-8 items-center justify-center border border-border bg-background hover:bg-card transition-colors relative"
						>
							<Bell class="h-4 w-4 text-muted-foreground" />
							<!-- Notification dot -->
							<span class="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full"></span>
						</button>

						<!-- Notifications Dropdown -->
						{#if notificationsOpen}
							<div class="absolute right-0 top-full mt-2 w-80 border border-border bg-card shadow-lg z-50">
								<div class="flex items-center justify-between border-b border-border px-4 py-3">
									<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NOTIFICATIONS</span>
									<button 
										onclick={() => notificationsOpen = false}
										class="text-muted-foreground hover:text-foreground"
									>
										<X class="h-4 w-4" />
									</button>
								</div>
								<div class="max-h-80 overflow-auto">
									<!-- Sample notifications - replace with real data -->
									<div class="border-b border-border px-4 py-3 hover:bg-muted/50 transition-colors">
										<p class="font-ui text-sm">No new notifications</p>
										<p class="font-body text-xs text-muted-foreground mt-1">You're all caught up!</p>
									</div>
								</div>
								<a href="/admin/settings" class="flex items-center justify-center gap-2 border-t border-border px-4 py-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
									<span class="font-mono text-[10px] tracking-wider">SYSTEM SETTINGS</span>
									<ExternalLink class="h-3 w-3" />
								</a>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Announcements Bar -->
		{#if visibleAnnouncements.length > 0}
			<div class="border-b border-border">
				{#each visibleAnnouncements as announcement (announcement.id)}
					{@const Icon = getAnnouncementIcon(announcement.type)}
					<div class="flex items-center gap-3 px-4 py-2 {getAnnouncementStyle(announcement.type)} border-b last:border-b-0">
						<Icon class="h-4 w-4 flex-shrink-0" />
						<div class="flex-1 min-w-0">
							<span class="font-mono text-[10px] tracking-wider font-medium">{announcement.title}</span>
							{#if announcement.message}
								<span class="font-mono text-[10px] tracking-wider opacity-80 ml-2">{announcement.message}</span>
							{/if}
						</div>
						{#if announcement.dismissible}
							<button
								onclick={() => dismissAnnouncement(announcement.id)}
								class="p-1 hover:bg-white/20 rounded transition-colors"
							>
								<X class="h-3 w-3" />
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
