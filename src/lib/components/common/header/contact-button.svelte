<script>
	import { cn } from '$lib/utils.js';
	import { navigationMenuHomeStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { ArrowUpRight } from '@lucide/svelte';
</script>

<a class={cn(navigationMenuHomeStyle())} href="/contact">
	<span class="flex flex-row items-center gap-2 uppercase font-chakra">
		<span>Contact</span>
		<ArrowUpRight class="h-4 w-4" />
	</span>
</a>
