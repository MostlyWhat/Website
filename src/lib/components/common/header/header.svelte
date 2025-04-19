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

	const links: { title: string; href: string; }[] = [
		{
			title: "About",
			href: "/about",
		},
		{
			title: "Services",
			href: "/services",
		},
		{
			title: "Projects",
			href: "/projects",
		},
		{
			title: "News",
			href: "/news",
		},
		{
			title: "Careers",
			href: "/careers",
		},
		{
			title: "Contact",
			href: "/contact",
		},
	];
</script>

<header class="z-40 border-b w-full fixed transition-all duration-200" class:bg-background={isScrolled}>
	<div class="mx-auto flex flex-wrap flex-col md:flex-row items-center">
		<div class="px-4 py-2 inline-flex items-center bg-primary text-primary-foreground hover:bg-primary/90">
			<a class="font-bold uppercase" href="/">
				MostlyWhat Systems
			</a>
		</div>
		<nav class="p-2 mx-4 mr-auto flex flex-wrap gap-8 items-center justify-center text-sm font-mono uppercase tracking-wide">
			{#each links as link}
				<a class="flex flex-row gap-2 hover:bg-primary text-white hover:text-primary-foreground" href={link.href}>
					{link.title} <span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span>
				</a>
			{/each}
		</nav>
		<div class="px-12 py-2 inline-flex items-center bg-secondary text-secondary-foreground hover:bg-secondary/80">
			<a class="flex flex-row gap-2 font-mono uppercase" href="/contact">
				Contact Us <span class="flex flex-row items-center">[<ArrowUpRight class="h-4 w-4" />]</span>
			</a>
		</div>
	</div>
</header>