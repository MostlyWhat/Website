<script lang="ts">
	import { ArrowUpRight } from '@lucide/svelte';

	import { onMount } from 'svelte';

	let isScrolled = false;

	const handleScroll = () => {
		isScrolled = window.scrollY > 0;
	};

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});

	const links: { title: string; href: string }[] = [
		{
			title: 'About',
			href: '/about'
		},
		{
			title: 'Services',
			href: '/services'
		},
		{
			title: 'Projects',
			href: '/projects'
		},
		{
			title: 'News',
			href: '/news'
		},
		{
			title: 'Careers',
			href: '/careers'
		},
		{
			title: 'Contact',
			href: '/contact'
		}
	];
</script>

<header
	class="fixed z-40 w-full border-b transition-all duration-200"
	class:bg-background={isScrolled}
>
	<div class="mx-auto flex flex-col flex-wrap items-center md:flex-row">
		<div
			class="inline-flex items-center bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
		>
			<a class="font-bold uppercase" href="/"> MostlyWhat Systems </a>
		</div>
		<nav
			class="mx-4 mr-auto flex flex-wrap items-center justify-center gap-8 p-2 font-mono text-sm uppercase tracking-wide"
		>
			{#each links as link}
				<a
					class="flex flex-row gap-2 text-white hover:bg-primary hover:text-primary-foreground"
					href={link.href}
				>
					{link.title}
					<span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span>
				</a>
			{/each}
		</nav>
		<div
			class="inline-flex items-center bg-secondary px-12 py-2 text-secondary-foreground hover:bg-secondary/80"
		>
			<a class="flex flex-row gap-2 font-mono uppercase" href="/contact">
				Contact Us <span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span
				>
			</a>
		</div>
	</div>
</header>
