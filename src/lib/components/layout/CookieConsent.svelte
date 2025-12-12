<script lang="ts">
	import { onMount } from 'svelte';
	import { Cookie, X, Settings } from '@lucide/svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { localizeHref } from '$lib/paraglide/runtime';

	const COOKIE_CONSENT_KEY = 'cookie-consent';
	const COOKIE_CONSENT_EXPIRY_DAYS = 365; // GDPR requires consent to be valid for max 12 months

	let isVisible = $state(false);
	let showPreferences = $state(false);
	
	interface ConsentPreferences {
		necessary: boolean;
		functional: boolean;
		analytics: boolean;
		marketing: boolean;
		timestamp: string;
		version: string;
	}
	
	let preferences = $state<ConsentPreferences>({
		necessary: true, // Always true, can't be changed
		functional: false,
		analytics: false,
		marketing: false,
		timestamp: new Date().toISOString(),
		version: '1.0'
	});

	function setCookie(name: string, value: string, days: number) {
		const date = new Date();
		date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
		document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/;SameSite=Lax;Secure`;
	}

	function getCookie(name: string): string | null {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop()?.split(';').shift() ?? null;
		return null;
	}
	
	function saveConsent() {
		const consentData = {
			...preferences,
			timestamp: new Date().toISOString()
		};
		
		// Save to cookie
		setCookie(COOKIE_CONSENT_KEY, JSON.stringify(consentData), COOKIE_CONSENT_EXPIRY_DAYS);
		
		// Apply consent settings
		applyConsent(preferences);
		
		// Save to server if user is logged in
		saveConsentToServer(preferences).catch(console.error);
		
		isVisible = false;
		showPreferences = false;
	}
	
	function acceptAll() {
		preferences = {
			...preferences,
			necessary: true,
			functional: true,
			analytics: true,
			marketing: true
		};
		saveConsent();
	}
	
	function rejectAll() {
		preferences = {
			...preferences,
			necessary: true,
			functional: false,
			analytics: false,
			marketing: false
		};
		saveConsent();
	}
	
	function applyConsent(consents: ConsentPreferences) {
		// Apply analytics consent
		if (typeof window !== 'undefined' && (window as any).gtag) {
			(window as any).gtag('consent', 'update', {
				analytics_storage: consents.analytics ? 'granted' : 'denied',
				ad_storage: consents.marketing ? 'granted' : 'denied',
				ad_user_data: consents.marketing ? 'granted' : 'denied',
				ad_personalization: consents.marketing ? 'granted' : 'denied'
			});
		}
	}
	
	async function saveConsentToServer(consents: ConsentPreferences) {
		try {
			await fetch('/api/consent', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(consents)
			});
		} catch (error) {
			// Silently fail - consent is already saved in cookie
		}
	}

	onMount(() => {
		const consentCookie = getCookie(COOKIE_CONSENT_KEY);
		if (!consentCookie) {
			// Show with a slight delay for better UX
			setTimeout(() => {
				isVisible = true;
			}, 1500);
		} else {
			try {
				const saved = JSON.parse(consentCookie);
				preferences = { ...preferences, ...saved };
				applyConsent(saved);
			} catch {
				// Invalid cookie, show banner again
				isVisible = true;
			}
		}
	});
</script>

{#if isVisible}
	<div
		class="fixed bottom-6 left-6 z-50 max-w-md border border-border bg-background shadow-lg"
		role="dialog"
		aria-labelledby="cookie-title"
		aria-describedby="cookie-description"
	>
		{#if !showPreferences}
			<div class="flex items-start gap-4 px-6 py-5">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center border border-border bg-card">
					<Cookie class="h-5 w-5 text-primary" />
				</div>
				<div class="flex-1">
					<h3 id="cookie-title" class="font-ui text-sm font-semibold tracking-wider">COOKIES & PRIVACY</h3>
					<p id="cookie-description" class="font-body mt-2 text-xs leading-relaxed text-muted-foreground">
						We use cookies to enhance your experience. Choose your preferences below.
						Read our <a href={localizeHref('/legal/privacy')} class="text-primary underline-offset-2 hover:underline">Privacy Policy</a> and 
						<a href={localizeHref('/legal/cookies')} class="text-primary underline-offset-2 hover:underline">Cookie Policy</a>.
					</p>
					<div class="mt-4 flex flex-wrap items-center gap-2">
						<Button size="sm" class="h-8 px-4 text-xs" onclick={acceptAll}>
							ACCEPT ALL
						</Button>
						<Button variant="outline" size="sm" class="h-8 px-4 text-xs" onclick={rejectAll}>
							REJECT ALL
						</Button>
						<Button variant="ghost" size="sm" class="h-8 px-3 text-xs" onclick={() => showPreferences = true}>
							<Settings class="h-3 w-3 mr-1" />
							CUSTOMIZE
						</Button>
					</div>
				</div>
				<button
					type="button"
					onclick={() => isVisible = false}
					class="flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
					aria-label="Close"
				>
					<X class="h-4 w-4" />
				</button>
			</div>
		{:else}
			<div class="px-6 py-5">
				<div class="flex items-center justify-between mb-4">
					<h3 class="font-ui text-sm font-semibold tracking-wider">COOKIE PREFERENCES</h3>
					<button
						type="button"
						onclick={() => showPreferences = false}
						class="flex h-6 w-6 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
						aria-label="Back"
					>
						<X class="h-4 w-4" />
					</button>
				</div>
				
				<div class="space-y-3">
					<div class="flex items-start gap-3 p-3 border border-border rounded">
						<Checkbox checked={true} disabled={true} class="mt-0.5" />
						<div class="flex-1">
							<h4 class="font-ui text-xs font-semibold">NECESSARY</h4>
							<p class="font-body text-xs text-muted-foreground mt-1">
								Required for the website to function. Cannot be disabled.
							</p>
						</div>
					</div>
					
					<div class="flex items-start gap-3 p-3 border border-border rounded">
						<Checkbox bind:checked={preferences.functional} class="mt-0.5" />
						<div class="flex-1">
							<h4 class="font-ui text-xs font-semibold">FUNCTIONAL</h4>
							<p class="font-body text-xs text-muted-foreground mt-1">
								Enable enhanced features and personalization.
							</p>
						</div>
					</div>
					
					<div class="flex items-start gap-3 p-3 border border-border rounded">
						<Checkbox bind:checked={preferences.analytics} class="mt-0.5" />
						<div class="flex-1">
							<h4 class="font-ui text-xs font-semibold">ANALYTICS</h4>
							<p class="font-body text-xs text-muted-foreground mt-1">
								Help us understand how visitors use our website.
							</p>
						</div>
					</div>
					
					<div class="flex items-start gap-3 p-3 border border-border rounded">
						<Checkbox bind:checked={preferences.marketing} class="mt-0.5" />
						<div class="flex-1">
							<h4 class="font-ui text-xs font-semibold">MARKETING</h4>
							<p class="font-body text-xs text-muted-foreground mt-1">
								Used to deliver personalized advertisements.
							</p>
						</div>
					</div>
				</div>
				
				<div class="mt-4 flex items-center gap-2">
					<Button size="sm" class="h-8 px-4 text-xs flex-1" onclick={saveConsent}>
						SAVE PREFERENCES
					</Button>
					<Button variant="ghost" size="sm" class="h-8 px-4 text-xs" onclick={() => showPreferences = false}>
						BACK
					</Button>
				</div>
			</div>
		{/if}
	</div>
{/if}
