<script lang="ts">
	/**
	 * Inactivity Timeout Component
	 *
	 * Monitors user activity and shows a warning modal before automatically
	 * logging out due to inactivity. For security and compliance.
	 */
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import { Clock, AlertTriangle, LogOut } from '@lucide/svelte';

	interface Props {
		/** Time in milliseconds before showing warning (default: 10 minutes) */
		warningTime?: number;
		/** Time in milliseconds after warning before logout (default: 2 minutes) */
		logoutTime?: number;
		/** Called when user is logged out due to inactivity */
		onLogout?: () => void;
	}

	let {
		warningTime = 10 * 60 * 1000, // 10 minutes
		logoutTime = 2 * 60 * 1000, // 2 minutes after warning
		onLogout
	}: Props = $props();

	let showWarning = $state(false);
	let countdown = $state(0);
	let activityTimer: ReturnType<typeof setTimeout> | null = null;
	let countdownInterval: ReturnType<typeof setInterval> | null = null;
	let lastActivity = $state(Date.now());

	// Events to track as user activity
	const activityEvents = ['mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove'];

	// Format countdown as MM:SS
	const formattedCountdown = $derived(() => {
		const minutes = Math.floor(countdown / 60);
		const seconds = countdown % 60;
		return `${minutes}:${seconds.toString().padStart(2, '0')}`;
	});

	function resetTimer() {
		lastActivity = Date.now();
		showWarning = false;

		// Clear existing timers
		if (activityTimer) clearTimeout(activityTimer);
		if (countdownInterval) clearInterval(countdownInterval);

		// Set timer for warning
		activityTimer = setTimeout(() => {
			showWarning = true;
			countdown = Math.floor(logoutTime / 1000);

			// Start countdown
			countdownInterval = setInterval(() => {
				countdown--;
				if (countdown <= 0) {
					performLogout();
				}
			}, 1000);
		}, warningTime);
	}

	function handleActivity() {
		// Debounce activity events
		const now = Date.now();
		if (now - lastActivity > 1000) {
			// Only reset if not showing warning
			if (!showWarning) {
				resetTimer();
			}
		}
	}

	function stayLoggedIn() {
		showWarning = false;
		resetTimer();
	}

	function performLogout() {
		if (countdownInterval) clearInterval(countdownInterval);
		if (activityTimer) clearTimeout(activityTimer);

		if (onLogout) {
			onLogout();
		} else {
			// Default: navigate to logout
			window.location.href = '/auth/logout';
		}
	}

	onMount(() => {
		if (!browser) return;

		// Start tracking
		resetTimer();

		// Add activity listeners
		activityEvents.forEach((event) => {
			document.addEventListener(event, handleActivity, { passive: true });
		});

		// Also listen for visibility changes
		document.addEventListener('visibilitychange', () => {
			if (document.visibilityState === 'visible') {
				// Check if we should have logged out while away
				const timeSinceActivity = Date.now() - lastActivity;
				if (timeSinceActivity > warningTime + logoutTime) {
					performLogout();
				} else if (timeSinceActivity > warningTime) {
					// Show warning with remaining time
					showWarning = true;
					const remaining = warningTime + logoutTime - timeSinceActivity;
					countdown = Math.max(0, Math.floor(remaining / 1000));
					countdownInterval = setInterval(() => {
						countdown--;
						if (countdown <= 0) {
							performLogout();
						}
					}, 1000);
				}
			}
		});
	});

	onDestroy(() => {
		if (!browser) return;

		// Clean up timers
		if (activityTimer) clearTimeout(activityTimer);
		if (countdownInterval) clearInterval(countdownInterval);

		// Remove listeners
		activityEvents.forEach((event) => {
			document.removeEventListener(event, handleActivity);
		});
	});
</script>

{#if showWarning}
	<!-- Backdrop -->
	<div class="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm" aria-hidden="true"></div>

	<!-- Modal -->
	<div
		class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
		role="dialog"
		aria-modal="true"
		aria-labelledby="inactivity-title"
	>
		<div class="w-full max-w-md border border-border bg-background p-8 shadow-xl">
			<!-- Icon -->
			<div class="flex justify-center">
				<div class="flex h-16 w-16 items-center justify-center border border-yellow-500/30 bg-yellow-500/10">
					<AlertTriangle class="h-8 w-8 text-yellow-500" />
				</div>
			</div>

			<!-- Title -->
			<h2
				id="inactivity-title"
				class="font-display mt-6 text-center text-xl font-bold uppercase tracking-tight"
			>
				Session Timeout Warning
			</h2>

			<!-- Description -->
			<p class="font-body mt-4 text-center text-sm text-muted-foreground">
				Your session is about to expire due to inactivity. For your security, you will be automatically logged out.
			</p>

			<!-- Countdown -->
			<div class="mt-6 flex flex-col items-center gap-2 border border-border bg-card p-4">
				<div class="flex items-center gap-2 text-muted-foreground">
					<Clock class="h-4 w-4" />
					<span class="font-mono text-[10px] tracking-widest">TIME REMAINING</span>
				</div>
				<p class="font-display text-3xl font-bold tabular-nums text-foreground">
					{formattedCountdown()}
				</p>
			</div>

			<!-- Actions -->
			<div class="mt-8 flex flex-col gap-3">
				<button
					onclick={stayLoggedIn}
					class="flex w-full items-center justify-center gap-2 border border-primary bg-primary px-4 py-3 text-sm text-primary-foreground transition-colors hover:bg-primary/90"
				>
					<span class="font-mono text-xs tracking-wider">STAY LOGGED IN</span>
				</button>

				<button
					onclick={performLogout}
					class="flex w-full items-center justify-center gap-2 border border-border bg-background px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground"
				>
					<LogOut class="h-4 w-4" />
					<span class="font-mono text-xs tracking-wider">LOGOUT NOW</span>
				</button>
			</div>

			<!-- Help Text -->
			<p class="font-body mt-6 text-center text-xs text-muted-foreground">
				Click anywhere or press any key to stay logged in.
			</p>
		</div>
	</div>
{/if}
