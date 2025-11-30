<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import { ArrowLeft } from '@lucide/svelte';

	interface Props {
		/** Button text (e.g., "VIEW ALL POSITIONS") */
		text: string;
		/** Link destination (will be localized) */
		href: string;
	}

	let { text, href }: Props = $props();
</script>

<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<a 
			href={localizeHref(href)} 
			class="col-span-12 flex items-center justify-center gap-2 bg-card px-6 py-8 transition-colors hover:bg-background hover:text-primary md:px-12 lg:px-16"
		>
			<ArrowLeft class="h-3 w-3" />
			<span class="font-ui text-xs tracking-wider">{text}</span>
		</a>
	</div>
</section>
