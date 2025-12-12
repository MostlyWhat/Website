<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ArrowLeft } from '@lucide/svelte';

	interface Props {
		/** The text to display. Default: "BACK TO SUPPORT" */
		text?: string;
		/** The URL to link to. Default: "/support" */
		href?: string;
		/** Additional CSS classes */
		class?: string;
	}

	let { text = 'BACK TO SUPPORT', href = '/support', class: className = '' }: Props = $props();
</script>

<div class="border-b border-border {className}">
	<a
		href={localizeHref(href)}
		class="font-ui flex items-center gap-2 px-6 py-4 text-xs tracking-wider text-muted-foreground hover:bg-card hover:text-primary md:px-12 lg:px-16"
	>
		<ArrowLeft class="h-3 w-3" />
		{text}
	</a>
</div>
