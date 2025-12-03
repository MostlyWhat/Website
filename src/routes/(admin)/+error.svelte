<script lang="ts">
	/**
	 * Admin Error Page
	 * 
	 * Error page for the admin dashboard routes.
	 * Clean, minimal design matching the admin layout.
	 * Includes its own header since error pages don't inherit layouts.
	 */
	import { page } from '$app/state';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft, RefreshCw, LayoutDashboard, AlertTriangle, FileQuestion, Users, Settings, ExternalLink } from '@lucide/svelte';

	const errorMessages: Record<number, { title: string; description: string }> = {
		400: { title: 'BAD REQUEST', description: 'The request was invalid or cannot be processed.' },
		401: { title: 'UNAUTHORIZED', description: 'You need to sign in to access this page.' },
		403: { title: 'ACCESS DENIED', description: 'You don\'t have admin permissions to access this resource.' },
		404: { title: 'NOT FOUND', description: 'The page or resource you\'re looking for doesn\'t exist.' },
		500: { title: 'SERVER ERROR', description: 'Something went wrong on our end. Please try again later.' }
	};

	const error = $derived(errorMessages[page.status] || { 
		title: 'ERROR', 
		description: page.error?.message || 'An unexpected error occurred.' 
	});
</script>

<svelte:head>
	<title>{page.status} - {error.title} | Admin | MostlyWhat Systems</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-background">
	<!-- Top Bar -->
	<header class="flex h-16 flex-shrink-0 items-center justify-between border-b border-border px-6">
		<a href="/admin" class="group flex items-center gap-2">
			<span class="font-display text-sm font-black uppercase tracking-wider text-primary">MOSTLYWHAT</span>
			<span class="font-mono text-[10px] tracking-wider text-muted-foreground">// ADMIN</span>
		</a>
		<a 
			href={localizeHref('/')} 
			class="font-ui flex items-center gap-2 text-xs tracking-wider text-muted-foreground transition-colors hover:text-foreground"
		>
			<span>BACK TO SITE</span>
			<ExternalLink class="h-3 w-3" />
		</a>
	</header>

	<!-- Main Error Content -->
	<section class="flex flex-1 flex-col items-center justify-center border-b border-border bg-background px-6 py-16 md:px-12 lg:px-16">
		<div class="text-center">
			<!-- Error Icon -->
			<div class="mx-auto mb-8 flex h-20 w-20 items-center justify-center border border-border bg-card">
				{#if page.status === 404}
					<FileQuestion class="h-10 w-10 text-muted-foreground" />
				{:else if page.status === 403 || page.status === 401}
					<AlertTriangle class="h-10 w-10 text-destructive" />
				{:else}
					<AlertTriangle class="h-10 w-10 text-destructive" />
				{/if}
			</div>
			
			<!-- Error Code -->
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ADMIN.ERROR.{page.status}</span>
			
			<!-- Error Title -->
			<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">{error.title}</h1>
			
			<!-- Error Description -->
			<p class="font-body mx-auto mt-4 max-w-md text-muted-foreground">{error.description}</p>
			
			<!-- Actions -->
			<div class="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
				<Button variant="outline" size="lg" class="font-ui tracking-wider" onclick={() => history.back()}>
					<ArrowLeft class="mr-2 h-4 w-4" />
					GO BACK
				</Button>
				<Button href="/admin" size="lg" class="font-ui tracking-wider">
					<LayoutDashboard class="mr-2 h-4 w-4" />
					ADMIN DASHBOARD
				</Button>
			</div>
		</div>
	</section>

	<!-- Quick Links -->
	<section class="border-b border-border bg-background">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-12 bg-background px-6 py-6 md:px-12 lg:col-span-4 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// QUICK ACTIONS</span>
				<p class="font-body mt-2 text-sm text-muted-foreground">Admin navigation shortcuts.</p>
			</div>
			
			<div class="col-span-12 grid grid-cols-3 gap-px bg-border lg:col-span-8">
				<a href="/admin" class="group flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card">
					<LayoutDashboard class="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
					<span class="font-ui mt-3 text-xs font-semibold tracking-wider">DASHBOARD</span>
					<span class="font-body mt-1 text-[11px] text-muted-foreground">Back to overview</span>
				</a>
				<a href="/admin/users" class="group flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card">
					<Users class="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
					<span class="font-ui mt-3 text-xs font-semibold tracking-wider">USERS</span>
					<span class="font-body mt-1 text-[11px] text-muted-foreground">Manage users</span>
				</a>
				<button onclick={() => location.reload()} class="group flex flex-col bg-background px-6 py-6 text-left transition-colors hover:bg-card">
					<RefreshCw class="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
					<span class="font-ui mt-3 text-xs font-semibold tracking-wider">REFRESH</span>
					<span class="font-body mt-1 text-[11px] text-muted-foreground">Try again</span>
				</button>
			</div>
		</div>
	</section>
</div>
