<script>
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { default as AccordionRoot } from '$lib/components/ui/accordion/accordion-root.svelte';
	import { default as AccordionItem } from '$lib/components/ui/accordion/accordion-item.svelte';
	import { default as AccordionTrigger } from '$lib/components/ui/accordion/accordion-trigger.svelte';
	import { default as AccordionContent } from '$lib/components/ui/accordion/accordion-content.svelte';
</script>

<section class="py-24 sm:py-32">
	<div class="mx-auto max-w-4xl px-6 lg:px-8">
		<div class="mx-auto max-w-2xl text-center">
			<Badge class="mb-6" variant="outline">FAQ</Badge>
			<h2 class="text-3xl font-bold tracking-tight sm:text-4xl">Questions, answered</h2>
			<p class="mt-6 text-lg leading-8 text-muted-foreground">
				Short and helpful answers to the most common questions.
			</p>
		</div>

		<div class="mt-12">
			<AccordionRoot type="single" collapsible>
				{#each [
					{q: 'How do we start?', a: 'Begin with a short intro call to discuss goals, scope, and timeline.'},
					{q: 'What is your typical timeline?', a: 'Most engagements run 4–12 weeks depending on scope.'},
					{q: 'Do you work with startups or enterprise?', a: 'Both. We tailor our process to the org and constraints.'},
					{q: 'What tech do you use?', a: 'SvelteKit, TypeScript, Tailwind, shadcn/ui, and modern tooling.'}
				] as row, i}
					<AccordionItem value={`item-${i}`}>
						<AccordionTrigger class="text-left text-base">{row.q}</AccordionTrigger>
						<AccordionContent class="text-muted-foreground">{row.a}</AccordionContent>
					</AccordionItem>
				{/each}
			</AccordionRoot>
		</div>
	</div>
</section>
