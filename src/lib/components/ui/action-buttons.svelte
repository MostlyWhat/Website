<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import type { Component } from 'svelte';
	
	interface Props {
		/** Primary action button text */
		primaryText?: string;
		/** Primary action handler */
		onPrimary?: () => void;
		/** Primary button variant */
		primaryVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
		/** Primary button icon */
		primaryIcon?: Component;
		/** Primary button loading state */
		primaryLoading?: boolean;
		/** Primary button disabled state */
		primaryDisabled?: boolean;
		
		/** Secondary action button text */
		secondaryText?: string;
		/** Secondary action handler */
		onSecondary?: () => void;
		/** Secondary button variant */
		secondaryVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
		/** Secondary button icon */
		secondaryIcon?: Component;
		
		/** Cancel/back button text */
		cancelText?: string;
		/** Cancel action handler */
		onCancel?: () => void;
		
		/** Align buttons (left, center, right) */
		align?: 'left' | 'center' | 'right';
		/** Additional CSS classes */
		class?: string;
	}
	
	let {
		primaryText,
		onPrimary,
		primaryVariant = 'default',
		primaryIcon: PrimaryIcon,
		primaryLoading = false,
		primaryDisabled = false,
		
		secondaryText,
		onSecondary,
		secondaryVariant = 'outline',
		secondaryIcon: SecondaryIcon,
		
		cancelText,
		onCancel,
		
		align = 'left',
		class: className = ''
	}: Props = $props();
	
	const alignClasses = {
		left: 'justify-start',
		center: 'justify-center',
		right: 'justify-end'
	};
</script>

<div class={cn(
	'flex items-center gap-3',
	alignClasses[align],
	className
)}>
	{#if cancelText && onCancel}
		<Button variant="ghost" onclick={onCancel}>
			{cancelText}
		</Button>
	{/if}
	
	{#if secondaryText && onSecondary}
		<Button variant={secondaryVariant} onclick={onSecondary}>
			{#if SecondaryIcon}
				<SecondaryIcon class="mr-2 h-4 w-4" />
			{/if}
			{secondaryText}
		</Button>
	{/if}
	
	{#if primaryText && onPrimary}
		<Button 
			variant={primaryVariant} 
			onclick={onPrimary}
			disabled={primaryDisabled || primaryLoading}
		>
			{#if primaryLoading}
				<span class="mr-2 h-4 w-4 animate-spin">⏳</span>
			{:else if PrimaryIcon}
				<PrimaryIcon class="mr-2 h-4 w-4" />
			{/if}
			{primaryText}
		</Button>
	{/if}
</div>
