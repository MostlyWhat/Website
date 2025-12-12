<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from '@lucide/svelte';

	/**
	 * BackLink - Standardized back link button
	 */
	interface Props {
		/** Back link destination */
		href: string;
		/** Back link label */
		label?: string;
		/** Show as button (default: ghost) */
		variant?: 'link' | 'ghost' | 'default' | 'outline' | 'secondary';
		/** Custom class */
		class?: string;
	}

	let {
		href,
		label = 'Back',
		variant = 'ghost',
		class: className = ''
	}: Props = $props();
</script>

<Button {href} {variant} size="sm" class="gap-2 {className}">
	<ArrowLeft class="h-4 w-4" />
	{label}
</Button>
