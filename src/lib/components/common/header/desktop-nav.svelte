<script lang="ts">
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import { ArrowUpRight } from '@lucide/svelte';
	import {
		navigationMenuTriggerStyle
	} from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { cn } from '$lib/utils';

	let { links } = $props();
</script>


<NavigationMenu.Root class="mr-auto hidden lg:block" viewport>
    <NavigationMenu.List>
        {#each links as link}
            <NavigationMenu.Item>
                <NavigationMenu.Link
                    class={cn(navigationMenuTriggerStyle())}
                    href={link.href}
                >
					<span class="flex flex-row items-center uppercase gap-2">
						<span>{link.title}</span>
						<ArrowUpRight class="h-4 w-4" />
					</span>
                </NavigationMenu.Link>
            </NavigationMenu.Item>
        {/each}
        <NavigationMenu.Item>
            <NavigationMenu.Trigger>Item one</NavigationMenu.Trigger>
            <NavigationMenu.Content>
                <NavigationMenu.Link>Item one content</NavigationMenu.Link>
            </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
            <NavigationMenu.Trigger>Item two</NavigationMenu.Trigger>
            <NavigationMenu.Content>
                <NavigationMenu.Link>Item two content</NavigationMenu.Link>
            </NavigationMenu.Content>
        </NavigationMenu.Item>
    </NavigationMenu.List>
</NavigationMenu.Root>