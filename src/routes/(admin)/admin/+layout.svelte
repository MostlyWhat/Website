<script lang="ts">
	/**
	 * Admin Layout
	 * 
	 * Dashboard layout for admin/staff with collapsible sidebar navigation.
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
		ChevronDown,
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
		Briefcase,
		Globe,
		Wrench,
		BriefcaseBusiness,
		Mail
	} from '@lucide/svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { InactivityTimeout } from '$lib/components/ui/inactivity-timeout';

	let { children, data } = $props();
	let mobileMenuOpen = $state(false);
	let dismissedAnnouncements = $state<string[]>([]);
	
	// Collapsible section states
	let expandedSections = $state<Record<string, boolean>>({
		operations: true,
		content: false,
		settings: false
	});

	function toggleSection(section: string) {
		expandedSections[section] = !expandedSections[section];
	}

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

	// Nav item type
	type NavItem = {
		href: string;
		label: string;
		icon: typeof LayoutDashboard;
		exact?: boolean;
		adminOnly?: boolean;
	};

	type NavSection = {
		id: string;
		label: string;
		icon: typeof LayoutDashboard;
		items: NavItem[];
	};

	// Grouped navigation structure
	const navSections: NavSection[] = [
		{
			id: 'operations',
			label: 'OPERATIONS',
			icon: FolderKanban,
			items: [
				{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
				{ href: '/admin/projects', label: 'Projects', icon: FolderKanban },
				{ href: '/admin/organizations', label: 'Organizations', icon: Building2 },
				{ href: '/admin/invoices', label: 'Invoices', icon: Receipt },
				{ href: '/admin/tickets', label: 'Tickets', icon: Ticket },
				{ href: '/admin/messages', label: 'Messages', icon: Mail },
				{ href: '/admin/reports', label: 'Reports', icon: BarChart3 }
			]
		},
		{
			id: 'content',
			label: 'CONTENT',
			icon: PenLine,
			items: [
				{ href: '/admin/blog', label: 'Blog Posts', icon: PenLine },
				{ href: '/admin/portfolio', label: 'Portfolio', icon: Briefcase },
				{ href: '/admin/knowledge-base', label: 'Knowledge Base', icon: BookOpen },
				{ href: '/admin/careers', label: 'Careers', icon: BriefcaseBusiness },
				{ href: '/admin/status', label: 'Status Page', icon: Globe }
			]
		},
		{
			id: 'settings',
			label: 'SETTINGS',
			icon: Settings,
			items: [
				{ href: '/admin/users', label: 'Users', icon: Users },
				{ href: '/admin/staff-groups', label: 'Staff Groups', icon: UsersRound },
				{ href: '/admin/announcements', label: 'Announcements', icon: Megaphone, adminOnly: true },
				{ href: '/admin/sla-policies', label: 'SLA Policies', icon: Clock },
				{ href: '/admin/canned-responses', label: 'Templates', icon: MessageSquareText },
				{ href: '/admin/activity-log', label: 'Activity Log', icon: Activity, adminOnly: true },
				{ href: '/admin/settings', label: 'System', icon: Wrench, adminOnly: true }
			]
		}
	];

	// Add notifications popup state
	let notificationsOpen = $state(false);

	function isActive(href: string, exact?: boolean): boolean {
		if (exact) {
			return page.url.pathname === href;
		}
		return page.url.pathname.startsWith(href);
	}

	// Check if any item in a section is active
	function isSectionActive(sectionId: string): boolean {
		const section = navSections.find(s => s.id === sectionId);
		if (!section) return false;
		return section.items.some((item: NavItem) => isActive(item.href, item.exact));
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
			{#each navSections as section}
				<!-- Section Header (Collapsible) -->
				<button
					onclick={() => toggleSection(section.id)}
					class="flex w-full items-center gap-3 border-b border-border px-4 py-2.5 transition-colors hover:bg-muted/30 {isSectionActive(section.id) ? 'bg-primary/5' : ''}"
				>
					<div class="flex h-8 w-8 items-center justify-center border transition-colors {isSectionActive(section.id) ? 'border-primary/50 bg-primary/10' : 'border-border bg-background'}">
						<section.icon class="h-3.5 w-3.5 {isSectionActive(section.id) ? 'text-primary' : 'text-muted-foreground'}" />
					</div>
					<span class="font-mono flex-1 text-left text-[10px] tracking-widest {isSectionActive(section.id) ? 'text-foreground' : 'text-muted-foreground'}">{section.label}</span>
					<ChevronDown class="h-3 w-3 text-muted-foreground transition-transform {expandedSections[section.id] ? 'rotate-180' : ''}" />
				</button>
				
				<!-- Section Items -->
				{#if expandedSections[section.id]}
					<div class="bg-background/50">
						{#each section.items as item}
							{#if !item.adminOnly || isAdmin}
								<a
									href={item.href}
									class="group flex items-center gap-3 border-b border-border/50 px-4 py-2 pl-8 transition-colors {isActive(item.href, item.exact)
										? 'bg-primary/10 text-primary'
										: 'text-muted-foreground/80 hover:bg-muted/30 hover:text-foreground'}"
								>
									<div class="flex h-6 w-6 items-center justify-center border transition-colors {isActive(item.href, item.exact) ? 'border-primary bg-primary/10' : 'border-border/50 bg-background'}">
										<item.icon class="h-3 w-3 {isActive(item.href, item.exact) ? 'text-primary' : ''}" />
									</div>
									<span class="font-ui flex-1 text-[10px] tracking-wider">{item.label}</span>
									<ChevronRight class="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 {isActive(item.href, item.exact) ? 'opacity-100' : ''}" />
								</a>
							{/if}
						{/each}
					</div>
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
							{#each navSections as section}
								<!-- Section Header -->
								<button
									onclick={() => toggleSection(section.id)}
									class="flex w-full items-center gap-4 border-b border-border px-6 py-3 transition-colors hover:bg-muted/30"
								>
									<div class="flex h-10 w-10 items-center justify-center border {isSectionActive(section.id) ? 'border-primary/50 bg-primary/10' : 'border-border bg-card'}">
										<section.icon class="h-4 w-4 {isSectionActive(section.id) ? 'text-primary' : ''}" />
									</div>
									<span class="font-mono flex-1 text-left text-[10px] tracking-widest {isSectionActive(section.id) ? 'text-foreground' : 'text-muted-foreground'}">{section.label}</span>
									<ChevronDown class="h-4 w-4 text-muted-foreground transition-transform {expandedSections[section.id] ? 'rotate-180' : ''}" />
								</button>
								
								{#if expandedSections[section.id]}
									{#each section.items as item}
										{#if !item.adminOnly || isAdmin}
											<a
												href={item.href}
												onclick={() => (mobileMenuOpen = false)}
												class="flex items-center gap-4 border-b border-border/50 px-6 py-3 pl-10 transition-colors {isActive(item.href, item.exact)
													? 'bg-primary/10 text-primary'
													: 'text-muted-foreground hover:bg-muted/30 hover:text-foreground'}"
											>
												<div class="flex h-8 w-8 items-center justify-center border {isActive(item.href, item.exact) ? 'border-primary bg-primary/10' : 'border-border/50 bg-card'}">
													<item.icon class="h-3.5 w-3.5" />
												</div>
												<span class="font-ui flex-1 text-xs tracking-wider">{item.label}</span>
												<ChevronRight class="h-4 w-4" />
											</a>
										{/if}
									{/each}
								{/if}
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

<!-- Inactivity Timeout (15 min warning, 2 min countdown) -->
<InactivityTimeout 
	warningTime={15 * 60 * 1000} 
	logoutTime={2 * 60 * 1000} 
/>
