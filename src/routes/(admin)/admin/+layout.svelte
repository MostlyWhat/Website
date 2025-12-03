<script lang="ts">
	/**
	 * Admin Layout
	 * 
	 * Dashboard layout for admin/staff with full sidebar navigation.
	 */
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';
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
		Activity
	} from '@lucide/svelte';
	import * as Sheet from '$lib/components/ui/sheet';

	let { children, data } = $props();
	let mobileMenuOpen = $state(false);

	const navigation = [
		{ href: '/admin', label: 'DASHBOARD', icon: LayoutDashboard, exact: true },
		{ href: '/admin/users', label: 'USERS', icon: Users },
		{ href: '/admin/organizations', label: 'ORGANIZATIONS', icon: Building2 },
		{ href: '/admin/projects', label: 'PROJECTS', icon: FolderKanban },
		{ href: '/admin/proposals', label: 'PROPOSALS', icon: FileText },
		{ href: '/admin/invoices', label: 'INVOICES', icon: Receipt },
		{ href: '/admin/tickets', label: 'TICKETS', icon: Ticket },
		{ href: '/admin/sla-policies', label: 'SLA POLICIES', icon: Clock },
		{ href: '/admin/canned-responses', label: 'CANNED RESPONSES', icon: MessageSquareText },
		{ href: '/admin/activity-log', label: 'ACTIVITY LOG', icon: Activity, adminOnly: true },
		{ href: '/admin/reports', label: 'REPORTS', icon: BarChart3 }
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
	<aside class="hidden w-72 flex-shrink-0 border-r border-border bg-card lg:flex lg:flex-col overflow-hidden">
		<!-- Logo -->
		<div class="flex h-16 items-center border-b border-border px-6">
			<a href={localizeHref('/')} class="group flex items-center gap-3">
				<span class="font-display text-sm font-black uppercase tracking-wider text-primary">MOSTLYWHAT</span>
				<span class="flex items-center gap-1 border border-primary/30 bg-primary/10 px-2 py-0.5">
					<Shield class="h-3 w-3 text-primary" />
					<span class="font-mono text-[10px] tracking-wider text-primary">{roleLabel}</span>
				</span>
			</a>
		</div>

		<!-- Navigation -->
		<nav class="flex-1 overflow-y-auto border-b border-border">
			{#each navigation as { href, label, icon: Icon, exact, adminOnly }}
				{#if !adminOnly || isAdmin}
				<a
					{href}
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
				{/if}
			{/each}
		</nav>

		<!-- User Section -->
		<div class="mt-auto">
			<!-- Back to Portal Link -->
			<a
				href="/app"
				class="flex items-center gap-4 border-b border-border px-6 py-4 transition-colors text-muted-foreground hover:bg-muted/50 hover:text-foreground"
			>
				<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
					<Home class="h-4 w-4" />
				</div>
				<span class="font-ui flex-1 text-xs tracking-wider">BACK TO PORTAL</span>
				<ChevronRight class="h-4 w-4" />
			</a>
			
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
						<p class="font-mono text-[10px] tracking-wider text-muted-foreground truncate uppercase">
							{data.profile?.role}
						</p>
					</div>
				</div>
			</div>

			<!-- Actions -->
			<div class="grid grid-cols-2 gap-px bg-border">
				<a
					href="/admin/settings"
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
							{#each navigation as { href, label, icon: Icon, exact, adminOnly }}
								{#if !adminOnly || isAdmin}
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

		<!-- Back to Main Site (Desktop) -->
		<div class="hidden border-b border-border bg-card/50 px-6 py-2 lg:block">
			<a href={localizeHref('/')} class="font-mono flex items-center gap-2 text-[10px] tracking-wider text-muted-foreground transition-colors hover:text-foreground">
				<Home class="h-3 w-3" />
				BACK TO MAIN SITE
			</a>
		</div>

		<!-- Page Content -->
		<main class="flex-1 overflow-auto">
			{@render children()}
		</main>
	</div>
</div>
