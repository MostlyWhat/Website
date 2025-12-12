<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronRight, ArrowLeft } from '@lucide/svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import type { Component } from 'svelte';

	/**
	 * Breadcrumbs - Standardized breadcrumb navigation
	 * Uses Breadcrumb component from ui
	 */
	interface BreadcrumbItem {
		label: string;
		href: string;
	}

	interface Props {
		/** Breadcrumb items */
		items: BreadcrumbItem[];
		/** Show back button instead of first breadcrumb */
		showBackButton?: boolean;
		/** Custom class */
		class?: string;
	}

	let {
		items,
		showBackButton = false,
		class: className = ''
	}: Props = $props();
</script>

<Breadcrumb.Root class={className}>
	<Breadcrumb.List>
		{#each items as item, i}
			{#if i > 0}
				<Breadcrumb.Separator>
					<ChevronRight class="h-4 w-4" />
				</Breadcrumb.Separator>
			{/if}
			{#if i === items.length - 1}
				<Breadcrumb.Item>
					<Breadcrumb.Page>{item.label}</Breadcrumb.Page>
				</Breadcrumb.Item>
			{:else if i === 0 && showBackButton}
				<Breadcrumb.Item>
					<Breadcrumb.Link href={item.href}>
						<Button variant="ghost" size="sm" class="h-7 gap-1">
							<ArrowLeft class="h-3.5 w-3.5" />
							{item.label}
						</Button>
					</Breadcrumb.Link>
				</Breadcrumb.Item>
			{:else}
				<Breadcrumb.Item>
					<Breadcrumb.Link href={item.href}>{item.label}</Breadcrumb.Link>
				</Breadcrumb.Item>
			{/if}
		{/each}
	</Breadcrumb.List>
</Breadcrumb.Root>
