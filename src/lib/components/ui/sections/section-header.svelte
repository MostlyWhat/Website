<script lang="ts">
	/**
	 * SectionHeader - Standardized section header with label and title
	 */
	interface Props {
		/** Section label (e.g., "01 — ABOUT") */
		label?: string;
		/** Section title */
		title: string;
		/** Optional description */
		description?: string;
		/** Custom class */
		class?: string;
	}

	let {
		label,
		title,
		description,
		class: className = ''
	}: Props = $props();
</script>

<div class="space-y-4 {className}">
	{#if label}
		<span class="font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{label}</span>
	{/if}
	<h2 class="font-display text-3xl font-bold uppercase md:text-4xl">{title}</h2>
	{#if description}
		<p class="font-body text-muted-foreground">{description}</p>
	{/if}
</div>
