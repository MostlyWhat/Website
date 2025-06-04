<script>
	import { cn } from '$lib/utils.js';
	import { navigationMenuHomeStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
</script>

<a
	class={cn(navigationMenuHomeStyle())}
	href="/"
>
	<span class="block sm:hidden">MostlyWhat</span>
	<span class="hidden sm:block">MostlyWhat Systems</span>
</a>