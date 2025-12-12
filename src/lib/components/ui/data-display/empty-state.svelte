<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { AlertCircle, Info, CheckCircle, AlertTriangle } from '@lucide/svelte';
	import type { Component } from 'svelte';

	/**
	 * EmptyState - Display when no data is available
	 * Standardized component using Card from ui
	 */
	interface Props {
		/** Icon to display */
		icon?: Component;
		/** Heading text */
		title: string;
		/** Description */
		description: string;
		/** Optional action snippet */
		action?: any;
		/** Variant for styling */
		variant?: 'default' | 'info' | 'warning' | 'success';
		/** Custom class */
		class?: string;
	}

	let {
		icon: CustomIcon,
		title,
		description,
		action,
		variant = 'default',
		class: className = ''
	}: Props = $props();

	const defaultIcons: Record<string, Component> = {
		default: AlertCircle,
		info: Info,
		warning: AlertTriangle,
		success: CheckCircle
	};

	const Icon = CustomIcon || defaultIcons[variant];
</script>

<Card.Root class="text-center {className}">
	<Card.Content class="pt-12 pb-12">
		<div class="flex flex-col items-center gap-4">
			<div class="rounded-full border-2 border-muted p-4">
				<Icon class="h-8 w-8 text-muted-foreground" />
			</div>
			<div class="space-y-2">
				<h3 class="text-lg font-semibold">{title}</h3>
				<p class="text-sm text-muted-foreground max-w-md">{description}</p>
			</div>
			{#if action}
				<div class="mt-4">
					{@render action()}
				</div>
			{/if}
		</div>
	</Card.Content>
</Card.Root>
