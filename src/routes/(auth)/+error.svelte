<script lang="ts">
	/**
	 * Auth Error Page
	 * 
	 * Error page for authentication routes.
	 * Simple, clean design matching the auth layout.
	 */
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Home, ArrowLeft, RefreshCw, LogIn, AlertTriangle, FileQuestion } from '@lucide/svelte';

	const errorMessages: Record<number, { title: string; description: string }> = {
		400: { title: 'BAD REQUEST', description: 'The request was invalid. Please check your input and try again.' },
		401: { title: 'SESSION EXPIRED', description: 'Your session has expired. Please sign in again.' },
		403: { title: 'ACCESS DENIED', description: 'You don\'t have permission to access this page.' },
		404: { title: 'NOT FOUND', description: 'The page you\'re looking for doesn\'t exist.' },
		500: { title: 'SERVER ERROR', description: 'Something went wrong. Please try again later.' }
	};

	const error = $derived(errorMessages[page.status] || { 
		title: 'ERROR', 
		description: page.error?.message || 'An unexpected error occurred.' 
	});
</script>

<svelte:head>
	<title>{page.status} - {error.title} | MostlyWhat Systems</title>
</svelte:head>

<!-- Full height section with grid layout -->
<section class="h-full">
	<div class="grid h-full grid-cols-12 gap-px bg-border">
		<!-- Left Panel - Error Info -->
		<div class="col-span-12 hidden flex-col items-center justify-center bg-background px-6 py-12 md:px-12 lg:col-span-6 lg:flex lg:px-16">
			<div class="text-center">
				<!-- Error Icon -->
				<div class="mx-auto mb-8 flex h-24 w-24 items-center justify-center border border-border bg-card">
					{#if page.status === 404}
						<FileQuestion class="h-12 w-12 text-muted-foreground" />
					{:else}
						<AlertTriangle class="h-12 w-12 text-destructive" />
					{/if}
				</div>
				
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ERROR.{page.status}</span>
				<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl">{error.title}</h1>
				<p class="font-body mx-auto mt-4 max-w-sm text-muted-foreground">{error.description}</p>
			</div>
		</div>

		<!-- Right Panel - Actions -->
		<div class="col-span-12 flex flex-col items-center justify-center overflow-y-auto bg-background px-6 py-8 md:px-12 lg:col-span-6 lg:px-16">
			<!-- Mobile Header -->
			<div class="mb-8 text-center lg:hidden">
				<div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center border border-border bg-card">
					{#if page.status === 404}
						<FileQuestion class="h-8 w-8 text-muted-foreground" />
					{:else}
						<AlertTriangle class="h-8 w-8 text-destructive" />
					{/if}
				</div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ERROR.{page.status}</span>
				<h1 class="font-display mt-4 text-3xl font-bold uppercase">{error.title}</h1>
				<p class="font-body mt-2 text-sm text-muted-foreground">{error.description}</p>
			</div>

			<div class="w-full max-w-sm space-y-6">
				<div class="space-y-3">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">WHAT WOULD YOU LIKE TO DO?</span>
					
					<button
						onclick={() => history.back()}
						class="group flex w-full items-center gap-4 border border-border bg-card px-6 py-4 transition-colors hover:bg-card/80"
					>
						<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
							<ArrowLeft class="h-4 w-4" />
						</div>
						<span class="font-ui flex-1 text-left text-sm tracking-wider">Go Back</span>
					</button>

					<a
						href={localizeHref('/auth/login')}
						class="group flex w-full items-center gap-4 border border-border bg-card px-6 py-4 transition-colors hover:bg-card/80"
					>
						<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
							<LogIn class="h-4 w-4" />
						</div>
						<span class="font-ui flex-1 text-sm tracking-wider">Sign In</span>
					</a>

					<a
						href={localizeHref('/')}
						class="group flex w-full items-center gap-4 border border-border bg-card px-6 py-4 transition-colors hover:bg-card/80"
					>
						<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
							<Home class="h-4 w-4" />
						</div>
						<span class="font-ui flex-1 text-sm tracking-wider">Go to Homepage</span>
					</a>

					<button
						onclick={() => location.reload()}
						class="group flex w-full items-center gap-4 border border-border bg-card px-6 py-4 transition-colors hover:bg-card/80"
					>
						<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
							<RefreshCw class="h-4 w-4" />
						</div>
						<span class="font-ui flex-1 text-left text-sm tracking-wider">Try Again</span>
					</button>
				</div>
			</div>
		</div>
	</div>
</section>
