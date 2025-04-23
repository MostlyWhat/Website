<script>
	import Button from '../../ui/button/button.svelte';

	// Sample news data - you can replace with actual data
	const newsItems = [
		{
			id: 1,
			title: 'Main Feature',
			image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c',
			excerpt: 'Stay connected with the latest news, including upcoming releases, updates, and communications from the team.',
			category: 'Communications',
			href: '/news'
		},
		{
			id: 2,
			title: 'Technology',
			image: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
			excerpt: 'Tech advances',
			category: 'Communications',
			href: '/news'
		},
		{
			id: 3,
			title: 'Innovation',
			image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
			excerpt: 'Future trends',
			category: 'Communications',
			href: '/news'
		},
		{
			id: 4,
			title: 'Development',
			image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40',
			excerpt: 'Best practices',
			category: 'Communications',
			href: '/news'
		}
	];
</script>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 min-h-full divide-x">
	{#each newsItems as item}
		<div class="col-span-1 min-h-80 border-b">
			<div class="h-full flex flex-col justify-between">
				<div>
					<img src="{item.image}" alt="{item.title}" class="mb-4 aspect-square object-cover" />
					<div class="p-4">
						<p class="mb-2 font-mono text-xs uppercase">// {item.category}</p>
						<h3 class="font-sans text-2xl font-black uppercase">{item.title}</h3>
						<p class="mt-4 text-sm text-muted-foreground max-w-md">{item.excerpt}</p>
					</div>
				</div>
				<Button class="mt-8 self-end" variant="secondary" size="lg">Read more</Button>
			</div>
		</div>
	{/each}
</div>