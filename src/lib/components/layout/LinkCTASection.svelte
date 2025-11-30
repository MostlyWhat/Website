<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';

	interface Props {
		/** Main heading */
		title: string;
		/** Description text */
		description: string;
		/** Button text */
		buttonText: string;
		/** Button link (href) */
		buttonHref: string;
	}

	let { title, description, buttonText, buttonHref }: Props = $props();
</script>

<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-12 md:col-span-8 md:px-12 lg:px-16">
			<h2 class="font-display text-2xl font-bold uppercase md:text-3xl">{title}</h2>
			<p class="font-body mt-4 text-muted-foreground">{description}</p>
		</div>
		<a 
			href={buttonHref}
			class="col-span-12 flex items-center justify-center gap-3 bg-card px-6 py-12 transition-colors hover:bg-background hover:text-primary md:col-span-4 md:px-12 lg:px-16"
		>
			<span class="font-ui text-sm tracking-widest">{buttonText}</span>
			<ArrowRight class="h-4 w-4" />
		</a>
	</div>
</section>
