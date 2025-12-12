<script lang="ts">
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { SectionHeader as SectionHeaderUI } from '$lib/components/ui/sections';

	/**
	 * SectionHeader - Section header with animation support
	 * @deprecated Use SectionHeader from ui/sections directly for new code
	 */
	interface Props {
		/** Section number (e.g., "01") */
		number?: string;
		/** Section label (e.g., "SERVICES", "FAQ") */
		label: string;
		/** Section title */
		title: string;
		/** Optional description */
		description?: string;
		/** Whether to animate on scroll (default: true) */
		animate?: boolean;
	}

	let { 
		number, 
		label, 
		title, 
		description,
		animate = true 
	}: Props = $props();

	const displayLabel = number ? `${number} — ${label}` : label;
</script>

{#if animate}
	<div 
		class="px-6 py-12 md:px-12 lg:px-16" 
		use:scrollAnimate={{ animation: 'fade' }}
	>
		<SectionHeaderUI {title} {description} label={displayLabel} />
	</div>
{:else}
	<div class="px-6 py-12 md:px-12 lg:px-16">
		<SectionHeaderUI {title} {description} label={displayLabel} />
	</div>
{/if}
