<script lang="ts">
	import type { Snippet } from 'svelte';

	/**
	 * SidebarSection - Standardized sidebar section component
	 * Used in FormLayout sidebars for consistent section styling.
	 * 
	 * Features:
	 * - Mono font header with uppercase styling
	 * - Border separator between sections
	 * - Consistent padding
	 */
	
	interface Props {
		/** Section title (will be uppercase) */
		title: string;
		/** Whether this is the first section (no top border) */
		first?: boolean;
		/** Section content */
		children: Snippet;
	}

	let { title, first = false, children }: Props = $props();
</script>

<!-- Section Header -->
<div class="{first ? '' : 'border-t'} border-border px-6 py-4 md:px-8">
	<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{title.toUpperCase()}</span>
</div>

<!-- Section Content -->
<div class="space-y-4 px-6 py-6 md:px-8">
	{@render children()}
</div>
