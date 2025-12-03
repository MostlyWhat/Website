<script lang="ts">
	/**
	 * App Error Page
	 * 
	 * Error page for the customer portal (app) routes.
	 * Clean, minimal design matching the app layout.
	 */
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { Home, ArrowLeft, RefreshCw, Ticket, LayoutDashboard, AlertTriangle, FileQuestion } from '@lucide/svelte';

	const errorMessages: Record<number, { title: string; description: string }> = {
		400: { title: 'BAD REQUEST', description: 'The request was invalid or cannot be processed.' },
		401: { title: 'UNAUTHORIZED', description: 'You need to sign in to access this page.' },
		403: { title: 'ACCESS DENIED', description: 'You don\'t have permission to access this resource.' },
		404: { title: 'NOT FOUND', description: 'The page or resource you\'re looking for doesn\'t exist.' },
		500: { title: 'SERVER ERROR', description: 'Something went wrong on our end. Please try again later.' }
	};

	const error = $derived(errorMessages[page.status] || { 
		title: 'ERROR', 
		description: page.error?.message || 'An unexpected error occurred.' 
	});
</script>

<svelte:head>
	<title>{page.status} - {error.title} | MostlyWhat Systems</title>
</svelte:head>

<div class="flex min-h-[calc(100dvh-4rem)] flex-col">
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
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ERROR.{page.status}</span>
			
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
				<Button href="/app" size="lg" class="font-ui tracking-wider">
					<LayoutDashboard class="mr-2 h-4 w-4" />
					DASHBOARD
				</Button>
			</div>
		</div>
	</section>

	<!-- Quick Links -->
	<section class="border-b border-border bg-background">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div class="col-span-12 bg-background px-6 py-6 md:px-12 lg:col-span-4 lg:px-16">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// QUICK ACTIONS</span>
				<p class="font-body mt-2 text-sm text-muted-foreground">Need help? Here are some useful links.</p>
			</div>
			
			<div class="col-span-12 grid grid-cols-3 gap-px bg-border lg:col-span-8">
				<a href="/app" class="group flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card">
					<LayoutDashboard class="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
					<span class="font-ui mt-3 text-xs font-semibold tracking-wider">DASHBOARD</span>
					<span class="font-body mt-1 text-[11px] text-muted-foreground">Back to overview</span>
				</a>
				<a href="/app/tickets/new" class="group flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card">
					<Ticket class="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
					<span class="font-ui mt-3 text-xs font-semibold tracking-wider">SUBMIT TICKET</span>
					<span class="font-body mt-1 text-[11px] text-muted-foreground">Report an issue</span>
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
