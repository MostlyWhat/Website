<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { AlertCircle, Info, CheckCircle, AlertTriangle, type Icon as LucideIcon } from '@lucide/svelte';
	import type { Component } from 'svelte';

	/**
	 * InfoCard - Display informational content with icon
	 * Standardized component using Card from ui
	 */
	interface Props {
		/** Card title */
		title?: string;
		/** Card description */
		description?: string;
		/** Variant determines icon and styling */
		variant?: 'default' | 'info' | 'warning' | 'success' | 'error';
		/** Custom icon (overrides variant icon) */
		icon?: Component;
		/** Card content */
		children?: any;
		/** Custom class */
		class?: string;
	}

	let {
		title,
		description,
		variant = 'default',
		icon: CustomIcon,
		children,
		class: className = ''
	}: Props = $props();

	const variantConfig: Record<string, { icon: Component; class: string }> = {
		default: { icon: Info, class: 'border-border' },
		info: { icon: Info, class: 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/50' },
		warning: { icon: AlertTriangle, class: 'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/50' },
		success: { icon: CheckCircle, class: 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/50' },
		error: { icon: AlertCircle, class: 'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/50' }
	};

	const config = variantConfig[variant];
	const Icon = CustomIcon || config.icon;
</script>

<Card.Root class="{config.class} {className}">
	{#if title || description}
		<Card.Header>
			<div class="flex gap-3">
				<Icon class="h-5 w-5 shrink-0 mt-0.5" />
				<div class="flex-1 space-y-1">
					{#if title}
						<Card.Title>{title}</Card.Title>
					{/if}
					{#if description}
						<Card.Description>{description}</Card.Description>
					{/if}
				</div>
			</div>
		</Card.Header>
	{/if}
	{#if children}
		<Card.Content>
			{@render children()}
		</Card.Content>
	{/if}
</Card.Root>
