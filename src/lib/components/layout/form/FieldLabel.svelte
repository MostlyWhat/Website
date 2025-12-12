<script lang="ts">
	/**
	 * FieldLabel - Standardized field label with mono font styling
	 * Consistent label styling across all forms.
	 * 
	 * Features:
	 * - Mono font with tracking
	 * - Uppercase transformation
	 * - Muted foreground color
	 * - Optional description text
	 */
	
	interface Props {
		/** Label text (will be uppercase) */
		label: string;
		/** Optional for attribute */
		for?: string;
		/** Optional description/help text */
		description?: string;
		/** Optional required indicator */
		required?: boolean;
	}

	let { label, for: htmlFor, description, required = false }: Props = $props();
</script>

<div>
	<label 
		for={htmlFor} 
		class="font-mono text-[10px] tracking-widest text-muted-foreground"
	>
		{label.toUpperCase()}{#if required} *{/if}
	</label>
	{#if description}
		<p class="font-body mt-1 text-xs text-muted-foreground">{description}</p>
	{/if}
</div>
