<script>
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	const steps = [
		{
			number: 1,
			title: 'Tell Us Your Vision',
			description: 'Share your product idea and requirements with our team through a simple consultation.'
		},
		{
			number: 2,
			title: 'Design & Plan',
			description: 'We create a detailed design and project roadmap tailored to your specific needs.'
		},
		{
			number: 3,
			title: 'Build & Test',
			description: 'Our experts develop your product using proven methodologies and rigorous testing.'
		},
		{
			number: 4,
			title: 'Launch & Support',
			description: 'We deliver your finished product and provide ongoing support for your success.'
		}
	];
</script>

<section class="py-16 sm:py-20">
	<div class="border px-4 py-16 text-center">
		<h2 class="text-2xl font-bold text-foreground sm:text-4xl">
			From Idea to Reality
		</h2>
	</div>
	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border divide-y sm:divide-x">
		{#each steps as step}
			<div class="px-4 py-16">
				{#if step.number}
					<div class="size-8 bg-primary font-heading font-bold flex items-center justify-center">
						<span class="">{step.number}</span>
					</div>
				{/if}
				<h3 class="text-lg font-semibold text-foreground mt-4">{step.title}</h3>
				<p class="mt-2 text-muted-foreground">
					{step.description}
				</p>
				<Skeleton class="mt-8 w-full h-64" />
			</div>
		{/each}
	</div>
</section>