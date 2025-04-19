import { NavigationMenu as NavigationMenuPrimitive } from 'bits-ui';
import Root from './navigation-menu.svelte';
import Content from './navigation-menu-content.svelte';
import Indicator from './navigation-menu-indicator.svelte';
import List from './navigation-menu-list.svelte';
import ListItem from './navigation-menu-list-item.svelte';
import Trigger from './navigation-menu-trigger.svelte';
import Viewport from './navigation-menu-viewport.svelte';

const Item = NavigationMenuPrimitive.Item;
const Link = NavigationMenuPrimitive.Link;

export {
	Root,
	Content,
	Indicator,
	Item,
	Link,
	List,
	ListItem,
	Trigger,
	Viewport,
	//
	Root as NavigationMenu,
	Content as NavigationMenuContent,
	Indicator as NavigationMenuIndicator,
	Item as NavigationMenuItem,
	Link as NavigationMenuLink,
	List as NavigationMenuList,
	ListItem as NavigationMenuListItem,
	Trigger as NavigationMenuTrigger,
	Viewport as NavigationMenuViewport
};

export const NavigationMenuTriggerStyle =
	'group inline-flex h-12 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50';
