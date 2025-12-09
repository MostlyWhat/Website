<script lang="ts">
	/**
	 * Notifications Page
	 * 
	 * View and manage all user notifications
	 */
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Bell, Check, CheckCheck, ExternalLink, Trash2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { data, form } = $props();

	function getNotificationIcon(type: string) {
		// Return icon based on notification type
		return Bell;
	}

	function getNotificationColor(type: string) {
		const colors: Record<string, string> = {
			announcement: 'text-blue-500',
			ticket_update: 'text-yellow-500',
			project_update: 'text-green-500',
			invoice_update: 'text-purple-500',
			system: 'text-gray-500',
			mention: 'text-pink-500'
		};
		return colors[type] || 'text-gray-500';
	}

	async function markAsRead(id: string) {
		try {
			await fetch(`/api/notifications?id=${id}`, { method: 'PATCH' });
			// Reload page to refresh data
			window.location.reload();
		} catch (error) {
			console.error('Failed to mark notification as read:', error);
		}
	}

	function handleNotificationClick(notification: typeof data.notifications[0]) {
		if (!notification.isRead) {
			markAsRead(notification.id);
		}
		if (notification.link) {
			goto(notification.link);
		}
	}

	function formatDate(date: Date) {
		const now = new Date();
		const diff = now.getTime() - new Date(date).getTime();
		const hours = Math.floor(diff / (1000 * 60 * 60));
		const days = Math.floor(hours / 24);

		if (hours < 1) return 'Just now';
		if (hours < 24) return `${hours}h ago`;
		if (days < 7) return `${days}d ago`;
		return new Date(date).toLocaleDateString();
	}
</script>

<svelte:head>
	<title>Notifications | MostlyWhat Systems</title>
</svelte:head>

<div class="min-h-[calc(100dvh-4rem)]">
	<!-- Header Section -->
	<section class="border-b border-border bg-background px-6 py-8 md:px-12 lg:px-16">
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// YOUR UPDATES</span>
				<h1 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">
					Notifications
				</h1>
				<p class="font-body mt-1 text-sm text-muted-foreground">
					{data.unreadCount > 0
						? `You have ${data.unreadCount} unread notification${data.unreadCount === 1 ? '' : 's'}`
						: 'All caught up!'}
				</p>
			</div>

			{#if data.unreadCount > 0}
				<form method="POST" action="?/markAllRead" use:enhance>
					<Button type="submit" variant="outline" size="sm">
						<CheckCheck class="mr-2 h-4 w-4" />
						Mark all as read
					</Button>
				</form>
			{/if}
		</div>
	</section>

	<!-- Success/Error Messages -->
	{#if form?.success}
		<div class="mx-6 mt-6 flex items-center gap-3 border border-green-500/30 bg-green-500/10 px-4 py-3 md:mx-12 lg:mx-16">
			<Check class="h-5 w-5 text-green-500" />
			<p class="font-body text-sm text-green-500">{form.message}</p>
		</div>
	{/if}

	<!-- Notifications List -->
	<section class="px-6 py-8 md:px-12 lg:px-16">
		{#if data.notifications.length === 0}
			<div class="flex flex-col items-center justify-center py-16">
				<div class="flex h-20 w-20 items-center justify-center border border-border bg-card">
					<Bell class="h-10 w-10 text-muted-foreground opacity-50" />
				</div>
				<h2 class="font-ui mt-6 text-lg font-semibold tracking-wider">No notifications yet</h2>
				<p class="font-body mt-2 text-sm text-muted-foreground">
					We'll notify you when something important happens.
				</p>
			</div>
		{:else}
			<div class="max-w-4xl space-y-2">
				{#each data.notifications as notification}
					<button
						onclick={() => handleNotificationClick(notification)}
						class="w-full border border-border bg-card p-4 text-left transition-colors hover:bg-accent {!notification.isRead
							? 'border-l-4 border-l-primary bg-primary/5'
							: ''}"
					>
						<div class="flex items-start gap-4">
							<div
								class="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-border bg-background"
							>
								{@const Icon = getNotificationIcon(notification.type)}
								<Icon class="h-4 w-4 {getNotificationColor(notification.type)}" />
							</div>

							<div class="min-w-0 flex-1">
								<div class="flex items-start justify-between gap-2">
									<div class="min-w-0 flex-1">
										<h3 class="font-ui text-sm font-semibold tracking-wide {!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}">
											{notification.title}
										</h3>
										<p class="font-body mt-1 text-sm text-muted-foreground">
											{notification.message}
										</p>
										<div class="mt-2 flex items-center gap-3">
											<span class="font-mono text-[10px] text-muted-foreground">
												{formatDate(notification.createdAt)}
											</span>
											<span
												class="font-mono text-[10px] uppercase tracking-wider text-muted-foreground"
											>
												{notification.type.replace('_', ' ')}
											</span>
										</div>
									</div>

									<div class="flex items-center gap-2">
										{#if !notification.isRead}
											<div
												class="h-2 w-2 flex-shrink-0 rounded-full bg-primary"
												title="Unread"
											></div>
										{/if}
										{#if notification.link}
											<ExternalLink class="h-4 w-4 flex-shrink-0 text-muted-foreground" />
										{/if}
									</div>
								</div>
							</div>
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</section>
</div>
