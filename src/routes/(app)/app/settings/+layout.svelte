<script lang="ts">
	/**
	 * Settings Layout
	 * 
	 * Provides sidebar navigation for settings sections
	 */
	import { page } from '$app/state';
	import { ArrowLeft, User, KeyRound, Bell, Trash2, ChevronRight, ShieldCheck } from '@lucide/svelte';

	let { children, data } = $props();

	const sections = [
		{ href: '/app/settings', label: 'ACCOUNT', icon: User, exact: true },
		{ href: '/app/settings/security', label: 'SECURITY', icon: ShieldCheck },
		{ href: '/app/settings/password', label: 'PASSWORD', icon: KeyRound },
		{ href: '/app/settings/notifications', label: 'NOTIFICATIONS', icon: Bell },
		{ href: '/app/settings/danger', label: 'DANGER ZONE', icon: Trash2, danger: true }
	];

	function isActive(href: string, exact?: boolean): boolean {
		if (exact) {
			return page.url.pathname === href;
		}
		return page.url.pathname.startsWith(href);
	}
</script>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<a
			href="/app"
			class="group inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft class="h-4 w-4 transition-transform group-hover:-translate-x-1" />
			<span class="font-mono text-[10px] tracking-widest">BACK TO DASHBOARD</span>
		</a>
		<h1 class="font-display mt-6 text-2xl font-bold uppercase md:text-3xl">Settings</h1>
		<p class="font-body mt-2 text-muted-foreground">
			Manage your account, security, and preferences.
		</p>
	</section>

	<!-- Settings Content -->
	<section class="border-b border-border bg-background">
		<div class="grid grid-cols-12 gap-px bg-border">
			<!-- Sidebar Navigation -->
			<div class="col-span-12 bg-background lg:col-span-3">
				<nav class="lg:border-r lg:border-border">
					{#each sections as { href, label, icon: Icon, exact, danger }}
						<a
							{href}
							class="group flex items-center gap-3 border-b border-border px-6 py-4 transition-colors 
								{isActive(href, exact) 
									? danger 
										? 'bg-destructive/10 text-destructive' 
										: 'bg-primary/10 text-primary'
									: danger 
										? 'text-destructive/70 hover:bg-destructive/5 hover:text-destructive' 
										: 'text-muted-foreground hover:bg-card hover:text-foreground'}"
						>
							<div class="flex h-10 w-10 items-center justify-center border transition-colors 
								{isActive(href, exact) 
									? danger 
										? 'border-destructive/50 bg-destructive/10' 
										: 'border-primary bg-primary/10'
									: 'border-border bg-card'}">
								<Icon class="h-4 w-4" />
							</div>
							<span class="font-ui flex-1 text-xs tracking-wider">{label}</span>
							<ChevronRight class="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100 {isActive(href, exact) ? 'opacity-100' : ''}" />
						</a>
					{/each}
				</nav>
			</div>

			<!-- Main Content Area -->
			<div class="col-span-12 bg-background lg:col-span-9">
				{@render children()}
			</div>
		</div>
	</section>
</div>
