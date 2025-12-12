<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	/**
	 * PageSection - Standardized page section with optional card wrapper
	 * Uses Card component from ui for consistent styling
	 */
	interface Props {
		/** Section title */
		title?: string;
		/** Section description */
		description?: string;
		/** Wrap in card (default: true) */
		card?: boolean;
		/** Content padding */
		padding?: 'none' | 'sm' | 'md' | 'lg';
		/** Section content */
		children: any;
		/** Custom class */
		class?: string;
	}

	let {
		title,
		description,
		card = true,
		padding = 'md',
		children,
		class: className = ''
	}: Props = $props();

	const paddingClasses = {
		none: '',
		sm: 'p-4',
		md: 'p-6',
		lg: 'p-8'
	};
</script>

{#if card}
	<Card.Root class={className}>
		{#if title || description}
			<Card.Header>
				{#if title}
					<Card.Title>{title}</Card.Title>
				{/if}
				{#if description}
					<Card.Description>{description}</Card.Description>
				{/if}
			</Card.Header>
		{/if}
		<Card.Content class={paddingClasses[padding]}>
			{@render children()}
		</Card.Content>
	</Card.Root>
{:else}
	<div class="{paddingClasses[padding]} {className}">
		{#if title || description}
			<div class="mb-6 space-y-2">
				{#if title}
					<h2 class="text-2xl font-bold">{title}</h2>
				{/if}
				{#if description}
					<p class="text-muted-foreground">{description}</p>
				{/if}
			</div>
		{/if}
		{@render children()}
	</div>
{/if}
