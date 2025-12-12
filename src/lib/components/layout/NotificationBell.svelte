<script lang="ts">
	/**
	 * Notification Bell Component
	 * 
	 * Displays unread notification count and dropdown menu
	 */
	import { onMount } from 'svelte';
	import { Bell } from '@lucide/svelte';
	import { goto } from '$app/navigation';

	let unreadCount = $state(0);
	let recentNotifications = $state<any[]>([]);
	let showDropdown = $state(false);
	let loading = $state(false);

	async function fetchNotifications() {
		try {
			loading = true;
			const response = await fetch('/api/notifications?limit=5');
			if (response.ok) {
				const data = await response.json() as { unreadCount: number; notifications: any[] };
				unreadCount = data.unreadCount;
				recentNotifications = data.notifications.slice(0, 5);
			}
		} catch (error) {
			console.error('Failed to fetch notifications:', error);
		} finally {
			loading = false;
		}
	}

	async function markAsRead(id: string) {
		try {
			await fetch(`/api/notifications?id=${id}`, { method: 'PATCH' });
			await fetchNotifications();
		} catch (error) {
			console.error('Failed to mark notification as read:', error);
		}
	}

	function handleNotificationClick(notification: any) {
		if (!notification.isRead) {
			markAsRead(notification.id);
		}
		if (notification.link) {
			goto(notification.link);
		}
		showDropdown = false;
	}

	onMount(() => {
		fetchNotifications();
		// Poll for new notifications every 30 seconds
		const interval = setInterval(fetchNotifications, 30000);
		return () => clearInterval(interval);
	});
</script>

<div class="relative">
	<button
		onclick={() => (showDropdown = !showDropdown)}
		class="relative flex h-10 w-10 items-center justify-center border border-border bg-card hover:bg-accent transition-colors"
		aria-label="Notifications"
	>
		<Bell class="h-4 w-4 text-muted-foreground" />
		{#if unreadCount > 0}
			<span
				class="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center border border-background bg-primary text-[10px] font-semibold text-primary-foreground"
			>
				{unreadCount > 9 ? '9+' : unreadCount}
			</span>
		{/if}
	</button>

	{#if showDropdown}
		<div
			class="absolute right-0 top-full z-50 mt-2 w-80 border border-border bg-card shadow-lg"
			role="menu"
		>
			<div class="flex items-center justify-between border-b border-border px-4 py-3">
				<span class="font-ui text-sm font-semibold tracking-wider">Notifications</span>
				{#if unreadCount > 0}
					<a
						href="/app/notifications"
						class="font-mono text-xs text-primary hover:underline"
						onclick={() => (showDropdown = false)}
					>
						View All ({unreadCount})
					</a>
				{/if}
			</div>

			<div class="max-h-96 overflow-y-auto">
				{#if loading}
					<div class="flex items-center justify-center py-8">
						<div class="h-6 w-6 animate-spin border-2 border-primary border-t-transparent"></div>
					</div>
				{:else if recentNotifications.length === 0}
					<div class="px-4 py-8 text-center">
						<Bell class="mx-auto h-8 w-8 text-muted-foreground opacity-50" />
						<p class="font-body mt-2 text-sm text-muted-foreground">No notifications</p>
					</div>
				{:else}
					{#each recentNotifications as notification}
						<button
							onclick={() => handleNotificationClick(notification)}
							class="w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-accent {!notification.isRead
								? 'bg-primary/5'
								: ''}"
						>
							<div class="flex items-start justify-between gap-2">
								<div class="min-w-0 flex-1">
									<p class="font-ui text-sm font-semibold tracking-wide {!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}">
										{notification.title}
									</p>
									<p class="font-body mt-1 text-xs text-muted-foreground line-clamp-2">
										{notification.message}
									</p>
									<p class="font-mono mt-1 text-[10px] text-muted-foreground">
										{new Date(notification.createdAt).toLocaleDateString()}
									</p>
								</div>
								{#if !notification.isRead}
									<div class="h-2 w-2 flex-shrink-0 rounded-full bg-primary"></div>
								{/if}
							</div>
						</button>
					{/each}
				{/if}
			</div>

			{#if recentNotifications.length > 0}
				<div class="border-t border-border px-4 py-3">
					<a
						href="/app/notifications"
						class="font-mono text-xs text-primary hover:underline"
						onclick={() => (showDropdown = false)}
					>
						View all notifications →
					</a>
				</div>
			{/if}
		</div>
	{/if}
</div>

{#if showDropdown}
	<button
		class="fixed inset-0 z-40"
		onclick={() => (showDropdown = false)}
		aria-label="Close notifications"
	></button>
{/if}
