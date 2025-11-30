<script lang="ts">
	import { onMount } from 'svelte';
	import { Cookie, X } from '@lucide/svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { localizeHref } from '$lib/paraglide/runtime';

	const COOKIE_CONSENT_KEY = 'cookie-consent-dismissed';
	const COOKIE_CONSENT_EXPIRY_DAYS = 30;

	let isVisible = $state(false);

	function setCookie(name: string, value: string, days: number) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax`;
	}

	function getCookie(name: string): string | null {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
		return null;
	}

	function dismiss() {
		isVisible = false;
		setCookie(COOKIE_CONSENT_KEY, 'true', COOKIE_CONSENT_EXPIRY_DAYS);
	}

	onMount(() => {
		const dismissed = getCookie(COOKIE_CONSENT_KEY);
		if (!dismissed) {
			// Show with a slight delay for better UX
			setTimeout(() => {
				isVisible = true;
			}, 1500);
		}
	});
</script>

{#if isVisible}
	<div
		class="fixed bottom-6 left-6 z-50 max-w-sm border border-border bg-background shadow-lg"
		role="dialog"
		aria-labelledby="cookie-title"
		aria-describedby="cookie-description"
	>
		<div class="flex items-start gap-3 px-4 py-4">
			<div class="flex h-8 w-8 shrink-0 items-center justify-center border border-border bg-card">
				<Cookie class="h-4 w-4 text-primary" />
			</div>
			<div class="flex-1">
				<h3 id="cookie-title" class="font-ui text-xs font-semibold tracking-wider">COOKIES & PRIVACY</h3>
				<p id="cookie-description" class="font-body mt-1 text-[11px] leading-relaxed text-muted-foreground">
					We use cookies to enhance your experience. By continuing to use this site, you agree to our 
					<a href={localizeHref('/legal/privacy')} class="text-primary underline-offset-2 hover:underline">Privacy Policy</a> and 
					<a href={localizeHref('/legal/cookies')} class="text-primary underline-offset-2 hover:underline">Cookie Policy</a>.
				</p>
				<div class="mt-3 flex items-center gap-2">
					<Button size="sm" class="h-7 px-3 text-[10px]" onclick={dismiss}>
						ACCEPT
					</Button>
					<Button variant="ghost" size="sm" class="h-7 px-3 text-[10px]" onclick={dismiss}>
						DISMISS
					</Button>
				</div>
			</div>
			<button
				type="button"
				onclick={dismiss}
				class="flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
				aria-label="Close"
			>
				<X class="h-3.5 w-3.5" />
			</button>
		</div>
	</div>
{/if}
