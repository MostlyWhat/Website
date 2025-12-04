<script lang="ts">
	/**
	 * Login Page
	 * 
	 * Supports email/password, magic link, and OAuth (GitHub, Google)
	 */
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Mail, Github, Loader2, LogIn, ArrowRight, KeyRound } from '@lucide/svelte';

	let { form } = $props();

	let email = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let activeMethod = $state<'password' | 'magic-link' | null>(null);
	let timeoutError = $state('');
	let loadingTimeout: ReturnType<typeof setTimeout> | null = null;

	const redirectTo = $derived(page.url.searchParams.get('redirectTo') ?? '/app');

	function handleSubmit(method: 'password' | 'magic-link') {
		return () => {
			isLoading = true;
			activeMethod = method;
			timeoutError = '';
			
			// Safety timeout - reset loading state after 30 seconds if no response
			loadingTimeout = setTimeout(() => {
				if (isLoading) {
					isLoading = false;
					activeMethod = null;
					timeoutError = 'Request timed out. Please check your connection and try again.';
					console.error('Form submission timed out');
				}
			}, 30000);
			
			return async ({ result, update }: { result: any; update: () => Promise<void> }) => {
				// Clear the timeout since we got a response
				if (loadingTimeout) {
					clearTimeout(loadingTimeout);
					loadingTimeout = null;
				}
				
				// Always reset loading state after form submission completes
				isLoading = false;
				activeMethod = null;
				
				// Update form state for all result types
				await update();
			};
		};
	}
</script>

<svelte:head>
	<title>Sign In | MostlyWhat Systems</title>
</svelte:head>

<!-- Full height section with grid layout -->
<section class="h-full">
	<div class="grid h-full grid-cols-12 gap-px bg-border">
		<!-- Left Panel - Branding -->
		<div class="col-span-12 hidden flex-col justify-between bg-background px-6 py-12 md:px-12 lg:col-span-6 lg:flex lg:px-16">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// AUTH.LOGIN</span>
				<h1 class="font-display mt-6 text-4xl font-bold uppercase md:text-5xl">
					WELCOME<br />BACK
				</h1>
				<p class="font-body mt-6 max-w-md text-muted-foreground">
					Sign in to access your dashboard, manage projects, view proposals, and track tickets.
				</p>
			</div>
			
			<div class="space-y-4">
				<div class="flex items-center gap-4">
					<div class="flex h-12 w-12 items-center justify-center border border-border bg-card">
						<KeyRound class="h-5 w-5 text-primary" />
					</div>
					<div>
						<h3 class="font-ui text-sm font-semibold tracking-wider">SECURE ACCESS</h3>
						<p class="font-body text-xs text-muted-foreground">Protected with industry-standard encryption</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Right Panel - Login Form -->
		<div class="col-span-12 flex flex-col items-center justify-center overflow-y-auto bg-background px-6 py-8 md:px-12 lg:col-span-6 lg:px-16">
			<div class="w-full max-w-md">
				<!-- Mobile Header -->
				<div class="mb-8 lg:hidden">
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// AUTH.LOGIN</span>
					<h1 class="font-display mt-4 text-3xl font-bold uppercase">WELCOME BACK</h1>
				</div>

				<!-- Error Message -->
				{#if form?.error || timeoutError}
					<div class="mb-6 border border-destructive/50 bg-destructive/10 px-6 py-4">
						<p class="font-mono text-sm text-destructive">{form?.error || timeoutError}</p>
					</div>
				{/if}

				<!-- Success Message (for magic link) -->
				{#if form?.success}
					<div class="mb-6 border border-primary/50 bg-primary/10 px-6 py-4">
						<p class="font-mono text-sm text-primary">{form.message}</p>
					</div>
				{/if}

				<div class="space-y-8">
					<!-- OAuth Providers -->
					<div class="space-y-3">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK SIGN IN</span>
					
						<a
							href="/auth/oauth/github?redirectTo={encodeURIComponent(redirectTo)}"
							class="group flex w-full items-center gap-4 border border-border bg-card px-6 py-4 transition-colors hover:bg-card/80"
						>
							<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
								<Github class="h-4 w-4" />
							</div>
							<span class="font-ui flex-1 text-sm tracking-wider">Continue with GitHub</span>
							<ArrowRight class="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
						</a>

					<a
						href="/auth/oauth/google?redirectTo={encodeURIComponent(redirectTo)}"
						class="group flex w-full items-center gap-4 border border-border bg-card px-6 py-4 transition-colors hover:bg-card/80"
					>
						<div class="flex h-10 w-10 items-center justify-center border border-border bg-background">
							<svg class="h-4 w-4" viewBox="0 0 24 24">
								<path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
								<path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
								<path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
								<path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
							</svg>
						</div>
						<span class="font-ui flex-1 text-sm tracking-wider">Continue with Google</span>
						<ArrowRight class="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
					</a>
				</div>

				<!-- Divider -->
				<div class="relative">
					<div class="absolute inset-0 flex items-center">
						<div class="w-full border-t border-border"></div>
					</div>
					<div class="relative flex justify-center">
						<span class="font-mono bg-background px-4 text-[10px] uppercase tracking-widest text-muted-foreground">
							Or continue with email
						</span>
					</div>
				</div>

				<!-- Email/Password Form -->
				<form
					method="POST"
					action="?/login"
					use:enhance={handleSubmit('password')}
					class="space-y-6"
				>
					<input type="hidden" name="redirectTo" value={redirectTo} />

					<div class="space-y-2">
						<Label for="email" class="font-mono text-[10px] tracking-widest text-muted-foreground">
							EMAIL ADDRESS
						</Label>
						<Input
							id="email"
							name="email"
							type="email"
							autocomplete="email"
							required
							bind:value={email}
							placeholder="you@example.com"
							class="h-12 border-border bg-card px-4 font-body placeholder:text-muted-foreground/50"
						/>
					</div>

					<div class="space-y-2">
						<div class="flex items-center justify-between">
							<Label for="password" class="font-mono text-[10px] tracking-widest text-muted-foreground">
								PASSWORD
							</Label>
							<a href={localizeHref('/auth/forgot-password')} class="font-mono text-[10px] tracking-wider text-primary hover:underline">
								FORGOT PASSWORD?
							</a>
						</div>
						<Input
							id="password"
							name="password"
							type="password"
							autocomplete="current-password"
							required
							bind:value={password}
							placeholder="••••••••"
							class="h-12 border-border bg-card px-4 font-body placeholder:text-muted-foreground/50"
						/>
					</div>

					<Button type="submit" size="lg" class="font-ui w-full tracking-wider" disabled={isLoading && activeMethod === 'password'}>
						{#if isLoading && activeMethod === 'password'}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							SIGNING IN...
						{:else}
							<LogIn class="mr-2 h-4 w-4" />
							SIGN IN
						{/if}
					</Button>
				</form>

				<!-- Magic Link Option -->
				<form
					method="POST"
					action="?/magicLink"
					use:enhance={handleSubmit('magic-link')}
				>
					<input type="hidden" name="email" value={email} />
					<input type="hidden" name="redirectTo" value={redirectTo} />

					<Button
						type="submit"
						variant="outline"
						size="lg"
						class="font-ui w-full tracking-wider"
						disabled={!email || (isLoading && activeMethod === 'magic-link')}
					>
						{#if isLoading && activeMethod === 'magic-link'}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							SENDING LINK...
						{:else}
							<Mail class="mr-2 h-4 w-4" />
							SEND MAGIC LINK
						{/if}
					</Button>
				</form>

				<!-- Register Link -->
				</div>
				<div class="border-t border-border pt-6">
					<p class="font-body text-center text-sm text-muted-foreground">
						Don't have an account?
						<a href={localizeHref('/auth/register')} class="font-ui ml-2 text-primary hover:underline">
							CREATE ONE
						</a>
					</p>
				</div>
			</div>
		</div>
	</div>
</section>
