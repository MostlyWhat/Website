<script lang="ts">
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Button } from '$lib/components/ui/button';
	import { ArrowLeft } from '@lucide/svelte';

	/**
	 * BackLinkSection - Full-width back link section
	 * @deprecated Use BackLink from ui/navigation instead for most cases
	 */
	interface Props {
		/** Button text (e.g., "VIEW ALL POSITIONS") */
		text: string;
		/** Link destination (will be localized) */
		href: string;
	}

	let { text, href }: Props = $props();
</script>

<section class="border-b border-border py-6">
	<div class="container mx-auto px-6 md:px-12 lg:px-16">
		<Button href={localizeHref(href)} variant="ghost" size="sm" class="gap-2">
			<ArrowLeft class="h-4 w-4" />
			<span class="font-mono text-[10px] tracking-widest uppercase">{text}</span>
		</Button>
	</div>
</section>
