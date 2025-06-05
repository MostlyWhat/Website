<script>
	import { cn } from '$lib/utils';
	import { navigationMenuHomeStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
</script>

<a
	class={cn("w-full text-left pl-0 lg:hidden", navigationMenuHomeStyle())}
	href="/"
>
	<span class="block sm:hidden">MostlyWhat</span>
	<span class="hidden sm:block lg:hidden">MostlyWhat Systems</span>
</a>