<script lang="ts">
	/**
	 * Onboarding Layout
	 * 
	 * Clean layout for the onboarding process.
	 * Full screen height with no scroll.
	 */
	import { localizeHref } from '$lib/paraglide/runtime';
	import { LogOut } from '@lucide/svelte';

	let { children, data } = $props();
</script>

<div class="flex h-screen flex-col overflow-hidden bg-background">
	<!-- Simple header with logo -->
	<header class="shrink-0 border-b border-border">
		<div class="flex h-16 items-center justify-between px-6 md:px-12 lg:px-16">
			<a href={localizeHref('/')} class="group flex items-center gap-2">
				<span class="font-display text-sm font-black uppercase tracking-wider text-primary transition-colors group-hover:text-foreground">MOSTLYWHAT</span>
				<span class="font-display text-sm font-black uppercase tracking-wider text-foreground">SYSTEMS</span>
			</a>
			{#if data.user}
				<div class="flex items-center gap-4">
					<span class="font-mono text-[10px] tracking-wider text-muted-foreground">{data.user.email}</span>
					<a
						href="/auth/logout"
						class="flex h-8 w-8 items-center justify-center border border-border bg-card text-muted-foreground transition-colors hover:bg-card/80 hover:text-foreground"
						title="Sign out"
					>
						<LogOut class="h-4 w-4" />
					</a>
				</div>
			{/if}
		</div>
	</header>

	<!-- Main content -->
	<main class="flex-1 overflow-hidden">
		{@render children()}
	</main>
</div>
