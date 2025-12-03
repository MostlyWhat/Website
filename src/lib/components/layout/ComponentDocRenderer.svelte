<script lang="ts">
	import { marked } from 'marked';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	
	// Import all UI components for live examples
	import Button from '$lib/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Switch } from '$lib/components/ui/switch';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { Progress } from '$lib/components/ui/progress';
	import { Separator } from '$lib/components/ui/separator';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Alert from '$lib/components/ui/alert';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Select from '$lib/components/ui/select';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Popover from '$lib/components/ui/popover';
	import * as Sheet from '$lib/components/ui/sheet';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Carousel from '$lib/components/ui/carousel';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Command from '$lib/components/ui/command';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import * as Menubar from '$lib/components/ui/menubar';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu';
	import * as Pagination from '$lib/components/ui/pagination';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import * as Resizable from '$lib/components/ui/resizable';
	import * as Toggle from '$lib/components/ui/toggle';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import { AspectRatio } from '$lib/components/ui/aspect-ratio';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Slider } from '$lib/components/ui/slider';
	import { Calendar } from '$lib/components/ui/calendar';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Kbd } from '$lib/components/ui/kbd';
	import {
		Mail,
		ArrowRight,
		Loader2,
		AlertCircle,
		Info,
		AlertTriangle,
		CheckCircle,
		Terminal,
		Copy,
		Check,
		ChevronDown,
		ChevronRight,
		ChevronLeft,
		Bold,
		Italic,
		Underline,
		User,
		CreditCard,
		Settings,
		LogOut,
		Plus,
		Menu,
		X,
		Home,
		File,
		Search,
		CalendarIcon,
		ChevronsUpDown
	} from '@lucide/svelte';
	import { today, getLocalTimeZone, CalendarDate } from '@internationalized/date';

	interface Props {
		/** Raw markdown content to render */
		content: string;
		/** Component slug being documented */
		slug: string;
		/** Additional CSS classes for the wrapper */
		class?: string;
	}

	let { content, slug, class: className = '' }: Props = $props();

	// Interactive states for examples
	let switchChecked = $state(false);
	let checkboxChecked = $state(false);
	let inputValue = $state('');
	let textareaValue = $state('');
	let progressValue = $state(60);
	let dialogOpen = $state(false);
	let alertDialogOpen = $state(false);
	let sheetOpen = $state(false);
	let drawerOpen = $state(false);
	let collapsibleOpen = $state(false);
	let copied = $state(false);
	let selectedValue = $state('');
	let sliderValue = $state(50);
	let calendarValue = $state<CalendarDate | undefined>(today(getLocalTimeZone()));
	let togglePressed = $state(false);
	let toggleGroupValue = $state('center');
	let radioValue = $state('option1');

	// Copy code to clipboard
	async function copyCode(code: string) {
		await navigator.clipboard.writeText(code);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}

	// Configure marked renderer
	const renderer = new marked.Renderer();
	renderer.heading = ({ text, depth }) => {
		const id = text
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-');
		return `<h${depth} id="${id}" class="scroll-mt-24"><a href="#${id}" class="heading-anchor">${text}</a></h${depth}>`;
	};

	// Process markdown and extract live example blocks
	interface ContentBlock {
		type: 'markdown' | 'live-example';
		content: string;
		code?: string;
	}

	function processContent(rawContent: string): ContentBlock[] {
		const blocks: ContentBlock[] = [];
		// Strip the first H1
		const stripped = rawContent.replace(/^\s*#\s+.+\n*/, '');
		
		// Split by live example markers: ```svelte live
		const parts = stripped.split(/```svelte\s+live\n/);
		
		parts.forEach((part, index) => {
			if (index === 0) {
				// First part is always markdown
				if (part.trim()) {
					blocks.push({ type: 'markdown', content: part });
				}
			} else {
				// This part starts with live example code, ends with ```
				const codeEnd = part.indexOf('```');
				if (codeEnd !== -1) {
					const code = part.substring(0, codeEnd).trim();
					const afterCode = part.substring(codeEnd + 3);
					
					blocks.push({ type: 'live-example', content: code, code });
					
					if (afterCode.trim()) {
						blocks.push({ type: 'markdown', content: afterCode });
					}
				} else {
					// No closing ```, treat as markdown
					blocks.push({ type: 'markdown', content: '```svelte live\n' + part });
				}
			}
		});
		
		return blocks;
	}

	// Check if component has a preview available
	function hasPreview(componentSlug: string): boolean {
		const previewComponents = [
			'button', 'badge', 'input', 'textarea', 'switch', 'checkbox', 'label',
			'progress', 'separator', 'skeleton', 'card', 'dialog', 'tabs', 'accordion',
			'alert', 'tooltip', 'alert-dialog', 'aspect-ratio', 'avatar', 'popover',
			'dropdown-menu', 'sheet', 'scroll-area', 'select', 'breadcrumb', 'calendar',
			'carousel', 'collapsible', 'command', 'context-menu', 'drawer', 'hover-card',
			'menubar', 'navigation-menu', 'pagination', 'radio-group', 'resizable',
			'slider', 'toggle', 'toggle-group', 'spinner', 'kbd'
		];
		return previewComponents.includes(componentSlug);
	}

	marked.use({ renderer });
	const contentBlocks = $derived(processContent(content));
</script>

<div class="component-doc {className}" use:scrollAnimate={{ animation: 'fade' }}>
	{#each contentBlocks as block}
		{#if block.type === 'markdown'}
			<div class="prose-custom max-w-4xl">
				{@html marked(block.content)}
			</div>
		{:else if block.type === 'live-example'}
			<!-- Live Example Container -->
			<div class="my-8 border border-border bg-card/50">
				<!-- Preview Area -->
				<div class="border-b border-border">
					<div class="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// PREVIEW</span>
					</div>
					<div class="p-6 flex flex-wrap items-center gap-4 min-h-[120px]">
						<!-- Button Examples -->
						{#if slug === 'button'}
							{#if block.code?.includes('variant="secondary"')}
								<Button class="font-ui">DEFAULT</Button>
								<Button variant="secondary" class="font-ui">SECONDARY</Button>
								<Button variant="destructive" class="font-ui">DESTRUCTIVE</Button>
								<Button variant="outline" class="font-ui">OUTLINE</Button>
								<Button variant="ghost" class="font-ui">GHOST</Button>
								<Button variant="link" class="font-ui">LINK</Button>
							{:else if block.code?.includes('size="sm"')}
								<Button size="sm" class="font-ui">SMALL</Button>
								<Button size="default" class="font-ui">DEFAULT</Button>
								<Button size="lg" class="font-ui">LARGE</Button>
								<Button size="xl" class="font-ui">EXTRA LARGE</Button>
								<Button size="icon"><Mail class="h-4 w-4" /></Button>
							{:else if block.code?.includes('Mail')}
								<Button class="font-ui">
									<Mail class="mr-2 h-4 w-4" />
									LOGIN WITH EMAIL
								</Button>
								<Button variant="outline" class="font-ui">
									CONTINUE
									<ArrowRight class="ml-2 h-4 w-4" />
								</Button>
								<Button variant="secondary" disabled class="font-ui">
									<Loader2 class="mr-2 h-4 w-4 animate-spin" />
									LOADING
								</Button>
							{:else if block.code?.includes('href')}
								<Button href="#" class="font-ui">AS LINK</Button>
							{:else}
								<Button class="font-ui">DEFAULT BUTTON</Button>
							{/if}

						<!-- Badge Examples -->
						{:else if slug === 'badge'}
							{#if block.code?.includes('variant=')}
								<Badge class="font-ui">DEFAULT</Badge>
								<Badge variant="secondary" class="font-ui">SECONDARY</Badge>
								<Badge variant="destructive" class="font-ui">DESTRUCTIVE</Badge>
								<Badge variant="outline" class="font-ui">OUTLINE</Badge>
							{:else}
								<Badge class="font-ui">DEFAULT</Badge>
							{/if}

						<!-- Input Examples -->
						{:else if slug === 'input'}
							{#if block.code?.includes('disabled')}
								<Input disabled placeholder="Disabled input" class="max-w-sm" />
							{:else if block.code?.includes('type="email"')}
								<Input type="email" placeholder="Email" class="max-w-sm" />
							{:else if block.code?.includes('type="password"')}
								<Input type="password" placeholder="Password" class="max-w-sm" />
							{:else if block.code?.includes('Label')}
								<div class="grid w-full max-w-sm items-center gap-1.5">
									<Label for="email">Email</Label>
									<Input type="email" id="email" placeholder="Email" />
								</div>
							{:else}
								<Input placeholder="Enter text..." class="max-w-sm" bind:value={inputValue} />
							{/if}

						<!-- Textarea Examples -->
						{:else if slug === 'textarea'}
							{#if block.code?.includes('disabled')}
								<Textarea disabled placeholder="Disabled textarea" class="max-w-sm" />
							{:else if block.code?.includes('Label')}
								<div class="grid w-full max-w-sm gap-1.5">
									<Label for="message">Message</Label>
									<Textarea id="message" placeholder="Type your message here." />
								</div>
							{:else}
								<Textarea placeholder="Enter text..." class="max-w-sm" bind:value={textareaValue} />
							{/if}

						<!-- Switch Examples -->
						{:else if slug === 'switch'}
							{#if block.code?.includes('disabled')}
								<Switch disabled />
							{:else if block.code?.includes('Label')}
								<div class="flex items-center space-x-2">
									<Switch id="airplane-mode" bind:checked={switchChecked} />
									<Label for="airplane-mode">Airplane Mode</Label>
								</div>
							{:else}
								<Switch bind:checked={switchChecked} />
							{/if}

						<!-- Checkbox Examples -->
						{:else if slug === 'checkbox'}
							{#if block.code?.includes('disabled')}
								<Checkbox disabled />
							{:else if block.code?.includes('Label')}
								<div class="flex items-center space-x-2">
									<Checkbox id="terms" bind:checked={checkboxChecked} />
									<Label for="terms">Accept terms and conditions</Label>
								</div>
							{:else}
								<Checkbox bind:checked={checkboxChecked} />
							{/if}

						<!-- Label Examples -->
						{:else if slug === 'label'}
							<Label>Email Address</Label>

						<!-- Progress Examples -->
						{:else if slug === 'progress'}
							<div class="w-full max-w-md space-y-4">
								<Progress value={progressValue} class="w-full" />
								<div class="flex gap-2">
									<Button size="sm" onclick={() => progressValue = Math.max(0, progressValue - 10)}>-10</Button>
									<Button size="sm" onclick={() => progressValue = Math.min(100, progressValue + 10)}>+10</Button>
								</div>
							</div>

						<!-- Separator Examples -->
						{:else if slug === 'separator'}
							{#if block.code?.includes('orientation="vertical"')}
								<div class="flex h-5 items-center space-x-4 text-sm">
									<span>Home</span>
									<Separator orientation="vertical" />
									<span>Docs</span>
									<Separator orientation="vertical" />
									<span>Components</span>
								</div>
							{:else}
								<div class="w-full max-w-md">
									<div class="text-sm">Section One</div>
									<Separator class="my-4" />
									<div class="text-sm">Section Two</div>
								</div>
							{/if}

						<!-- Skeleton Examples -->
						{:else if slug === 'skeleton'}
							{#if block.code?.includes('Card')}
								<div class="flex items-center space-x-4">
									<Skeleton class="h-12 w-12" />
									<div class="space-y-2">
										<Skeleton class="h-4 w-[250px]" />
										<Skeleton class="h-4 w-[200px]" />
									</div>
								</div>
							{:else}
								<Skeleton class="h-4 w-[250px]" />
							{/if}

						<!-- Card Examples -->
						{:else if slug === 'card'}
							<Card.Root class="w-full max-w-sm">
								<Card.Header>
									<Card.Title>Card Title</Card.Title>
									<Card.Description>Card description goes here.</Card.Description>
								</Card.Header>
								<Card.Content>
									<p class="text-sm text-muted-foreground">This is the card content area.</p>
								</Card.Content>
								<Card.Footer>
									<Button class="w-full font-ui">ACTION</Button>
								</Card.Footer>
							</Card.Root>

						<!-- Dialog Examples -->
						{:else if slug === 'dialog'}
							<Dialog.Root bind:open={dialogOpen}>
								<Dialog.Trigger>
									{#snippet child({ props })}
										<Button {...props} class="font-ui">OPEN DIALOG</Button>
									{/snippet}
								</Dialog.Trigger>
								<Dialog.Content class="sm:max-w-[425px]">
									<Dialog.Header>
										<Dialog.Title>Dialog Title</Dialog.Title>
										<Dialog.Description>
											This is a dialog description. Make changes here.
										</Dialog.Description>
									</Dialog.Header>
									<div class="px-4 py-4">
										<p class="text-sm text-muted-foreground">Dialog content goes here.</p>
									</div>
									<Dialog.Footer>
										<Button onclick={() => dialogOpen = false} class="font-ui">SAVE CHANGES</Button>
									</Dialog.Footer>
								</Dialog.Content>
							</Dialog.Root>

						<!-- Tabs Examples -->
						{:else if slug === 'tabs'}
							<Tabs.Root value="account" class="w-full max-w-md">
								<Tabs.List class="grid w-full grid-cols-2">
									<Tabs.Trigger value="account" class="font-ui">ACCOUNT</Tabs.Trigger>
									<Tabs.Trigger value="password" class="font-ui">PASSWORD</Tabs.Trigger>
								</Tabs.List>
								<Tabs.Content value="account" class="p-4 border border-t-0 border-border">
									<p class="text-sm text-muted-foreground">Account settings content here.</p>
								</Tabs.Content>
								<Tabs.Content value="password" class="p-4 border border-t-0 border-border">
									<p class="text-sm text-muted-foreground">Password settings content here.</p>
								</Tabs.Content>
							</Tabs.Root>

						<!-- Accordion Examples -->
						{:else if slug === 'accordion'}
							<Accordion.Root type="single" class="w-full max-w-md">
								<Accordion.Item value="item-1">
									<Accordion.Trigger class="font-ui">IS IT ACCESSIBLE?</Accordion.Trigger>
									<Accordion.Content>
										<p class="text-sm text-muted-foreground">Yes. It follows WAI-ARIA design patterns.</p>
									</Accordion.Content>
								</Accordion.Item>
								<Accordion.Item value="item-2">
									<Accordion.Trigger class="font-ui">IS IT STYLED?</Accordion.Trigger>
									<Accordion.Content>
										<p class="text-sm text-muted-foreground">Yes. Styled with Tailwind CSS.</p>
									</Accordion.Content>
								</Accordion.Item>
							</Accordion.Root>

						<!-- Alert Examples -->
						{:else if slug === 'alert'}
							{#if block.code?.includes('variant="destructive"')}
								<Alert.Root variant="destructive" class="max-w-md">
									<AlertCircle class="h-4 w-4" />
									<Alert.Title>Error</Alert.Title>
									<Alert.Description>Something went wrong. Please try again.</Alert.Description>
								</Alert.Root>
							{:else}
								<Alert.Root class="max-w-md">
									<Info class="h-4 w-4" />
									<Alert.Title>Information</Alert.Title>
									<Alert.Description>This is an informational alert message.</Alert.Description>
								</Alert.Root>
							{/if}

						<!-- Tooltip Examples -->
						{:else if slug === 'tooltip'}
							<Tooltip.Provider>
								<Tooltip.Root>
									<Tooltip.Trigger>
										{#snippet child({ props })}
											<Button {...props} variant="outline" class="font-ui">HOVER ME</Button>
										{/snippet}
									</Tooltip.Trigger>
									<Tooltip.Content>
										<p>This is a tooltip</p>
									</Tooltip.Content>
								</Tooltip.Root>
							</Tooltip.Provider>

						<!-- Alert Dialog Examples -->
						{:else if slug === 'alert-dialog'}
							<AlertDialog.Root bind:open={alertDialogOpen}>
								<AlertDialog.Trigger>
									{#snippet child({ props })}
										<Button {...props} variant="destructive" class="font-ui">DELETE ACCOUNT</Button>
									{/snippet}
								</AlertDialog.Trigger>
								<AlertDialog.Content>
									<AlertDialog.Header>
										<AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
										<AlertDialog.Description>
											This action cannot be undone. This will permanently delete your account.
										</AlertDialog.Description>
									</AlertDialog.Header>
									<AlertDialog.Footer>
										<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
										<AlertDialog.Action>Continue</AlertDialog.Action>
									</AlertDialog.Footer>
								</AlertDialog.Content>
							</AlertDialog.Root>

						<!-- Aspect Ratio Examples -->
						{:else if slug === 'aspect-ratio'}
							<div class="w-full max-w-md">
								<AspectRatio ratio={16 / 9} class="bg-muted">
									<div class="flex h-full items-center justify-center">
										<span class="text-sm text-muted-foreground">16:9</span>
									</div>
								</AspectRatio>
							</div>

						<!-- Avatar Examples -->
						{:else if slug === 'avatar'}
							<div class="flex gap-4">
								<Avatar.Root>
									<Avatar.Image src="https://github.com/shadcn.png" alt="Avatar" />
									<Avatar.Fallback>CN</Avatar.Fallback>
								</Avatar.Root>
								<Avatar.Root>
									<Avatar.Fallback>JD</Avatar.Fallback>
								</Avatar.Root>
							</div>

						<!-- Popover Examples -->
						{:else if slug === 'popover'}
							<Popover.Root>
								<Popover.Trigger>
									{#snippet child({ props })}
										<Button {...props} variant="outline" class="font-ui">OPEN POPOVER</Button>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content class="w-80">
									<div class="grid gap-4">
										<div class="space-y-2">
											<h4 class="font-medium leading-none">Popover Title</h4>
											<p class="text-sm text-muted-foreground">Popover content goes here.</p>
										</div>
									</div>
								</Popover.Content>
							</Popover.Root>

						<!-- Dropdown Menu Examples -->
						{:else if slug === 'dropdown-menu'}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									{#snippet child({ props })}
										<Button {...props} variant="outline" class="font-ui">OPEN MENU</Button>
									{/snippet}
								</DropdownMenu.Trigger>
								<DropdownMenu.Content class="w-56">
									<DropdownMenu.Label>My Account</DropdownMenu.Label>
									<DropdownMenu.Separator />
									<DropdownMenu.Item>
										<User class="mr-2 h-4 w-4" />
										<span>Profile</span>
									</DropdownMenu.Item>
									<DropdownMenu.Item>
										<Settings class="mr-2 h-4 w-4" />
										<span>Settings</span>
									</DropdownMenu.Item>
									<DropdownMenu.Separator />
									<DropdownMenu.Item>
										<LogOut class="mr-2 h-4 w-4" />
										<span>Log out</span>
									</DropdownMenu.Item>
								</DropdownMenu.Content>
							</DropdownMenu.Root>

						<!-- Sheet Examples -->
						{:else if slug === 'sheet'}
							<Sheet.Root bind:open={sheetOpen}>
								<Sheet.Trigger>
									{#snippet child({ props })}
										<Button {...props} variant="outline" class="font-ui">OPEN SHEET</Button>
									{/snippet}
								</Sheet.Trigger>
								<Sheet.Content>
									<Sheet.Header>
										<Sheet.Title>Sheet Title</Sheet.Title>
										<Sheet.Description>Sheet description goes here.</Sheet.Description>
									</Sheet.Header>
									<div class="px-4 py-4">
										<p class="text-sm text-muted-foreground">Sheet content goes here.</p>
									</div>
								</Sheet.Content>
							</Sheet.Root>

						<!-- Scroll Area Examples -->
						{:else if slug === 'scroll-area'}
							<ScrollArea class="h-48 w-48 border border-border">
								<div class="p-4">
									{#each Array(20) as _, i}
										<div class="py-2 text-sm">Item {i + 1}</div>
									{/each}
								</div>
							</ScrollArea>

						<!-- Select Examples -->
						{:else if slug === 'select'}
							<Select.Root type="single" bind:value={selectedValue}>
								<Select.Trigger class="w-[180px]">
									{selectedValue || 'Select option'}
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="option1">Option 1</Select.Item>
									<Select.Item value="option2">Option 2</Select.Item>
									<Select.Item value="option3">Option 3</Select.Item>
								</Select.Content>
							</Select.Root>

						<!-- Breadcrumb Examples -->
						{:else if slug === 'breadcrumb'}
							<Breadcrumb.Root>
								<Breadcrumb.List>
									<Breadcrumb.Item>
										<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
									</Breadcrumb.Item>
									<Breadcrumb.Separator />
									<Breadcrumb.Item>
										<Breadcrumb.Link href="/docs">Docs</Breadcrumb.Link>
									</Breadcrumb.Item>
									<Breadcrumb.Separator />
									<Breadcrumb.Item>
										<Breadcrumb.Page>Breadcrumb</Breadcrumb.Page>
									</Breadcrumb.Item>
								</Breadcrumb.List>
							</Breadcrumb.Root>

						<!-- Calendar Examples -->
						{:else if slug === 'calendar'}
							<Calendar type="single" bind:value={calendarValue} class="border border-border" />

						<!-- Carousel Examples -->
						{:else if slug === 'carousel'}
							<div class="w-full max-w-xs">
								<Carousel.Root>
									<Carousel.Content>
										{#each [1, 2, 3, 4, 5] as item}
											<Carousel.Item>
												<div class="p-1">
													<Card.Root>
														<Card.Content class="flex aspect-square items-center justify-center p-6">
															<span class="text-4xl font-semibold">{item}</span>
														</Card.Content>
													</Card.Root>
												</div>
											</Carousel.Item>
										{/each}
									</Carousel.Content>
									<Carousel.Previous />
									<Carousel.Next />
								</Carousel.Root>
							</div>

						<!-- Collapsible Examples -->
						{:else if slug === 'collapsible'}
							<Collapsible.Root bind:open={collapsibleOpen} class="w-[350px] space-y-2">
								<div class="flex items-center justify-between space-x-4 px-4">
									<h4 class="text-sm font-semibold">@peduarte starred 3 repositories</h4>
									<Collapsible.Trigger>
										{#snippet child({ props })}
											<Button {...props} variant="ghost" size="sm" class="w-9 p-0">
												<ChevronsUpDown class="h-4 w-4" />
												<span class="sr-only">Toggle</span>
											</Button>
										{/snippet}
									</Collapsible.Trigger>
								</div>
								<div class="border border-border px-4 py-3 font-mono text-sm">
									@radix-ui/primitives
								</div>
								<Collapsible.Content class="space-y-2">
									<div class="border border-border px-4 py-3 font-mono text-sm">
										@radix-ui/colors
									</div>
									<div class="border border-border px-4 py-3 font-mono text-sm">
										@stitches/react
									</div>
								</Collapsible.Content>
							</Collapsible.Root>

						<!-- Command Examples -->
						{:else if slug === 'command'}
							<Command.Root class="border border-border w-[350px]">
								<Command.Input placeholder="Type a command or search..." />
								<Command.List>
									<Command.Empty>No results found.</Command.Empty>
									<Command.Group heading="Suggestions">
										<Command.Item>
											<CalendarIcon class="mr-2 h-4 w-4" />
											<span>Calendar</span>
										</Command.Item>
										<Command.Item>
											<Search class="mr-2 h-4 w-4" />
											<span>Search</span>
										</Command.Item>
										<Command.Item>
											<Settings class="mr-2 h-4 w-4" />
											<span>Settings</span>
										</Command.Item>
									</Command.Group>
								</Command.List>
							</Command.Root>

						<!-- Context Menu Examples -->
						{:else if slug === 'context-menu'}
							<ContextMenu.Root>
								<ContextMenu.Trigger class="flex h-[150px] w-[300px] items-center justify-center border border-dashed border-border text-sm">
									Right click here
								</ContextMenu.Trigger>
								<ContextMenu.Content class="w-64">
									<ContextMenu.Item>Back</ContextMenu.Item>
									<ContextMenu.Item>Forward</ContextMenu.Item>
									<ContextMenu.Item>Reload</ContextMenu.Item>
									<ContextMenu.Separator />
									<ContextMenu.Item>Save As...</ContextMenu.Item>
									<ContextMenu.Item>Print...</ContextMenu.Item>
								</ContextMenu.Content>
							</ContextMenu.Root>

						<!-- Drawer Examples -->
						{:else if slug === 'drawer'}
							<Drawer.Root bind:open={drawerOpen}>
								<Drawer.Trigger>
									{#snippet child({ props })}
										<Button {...props} variant="outline" class="font-ui">OPEN DRAWER</Button>
									{/snippet}
								</Drawer.Trigger>
								<Drawer.Content>
									<Drawer.Header>
										<Drawer.Title>Drawer Title</Drawer.Title>
										<Drawer.Description>Drawer description goes here.</Drawer.Description>
									</Drawer.Header>
									<div class="p-4">
										<p class="text-sm text-muted-foreground">Drawer content goes here.</p>
									</div>
									<Drawer.Footer>
										<Button onclick={() => drawerOpen = false}>Close</Button>
									</Drawer.Footer>
								</Drawer.Content>
							</Drawer.Root>

						<!-- Hover Card Examples -->
						{:else if slug === 'hover-card'}
							<HoverCard.Root>
								<HoverCard.Trigger>
									{#snippet child({ props })}
										<Button {...props} variant="link" class="font-ui">@MOSTLYWHAT</Button>
									{/snippet}
								</HoverCard.Trigger>
								<HoverCard.Content class="w-80">
									<div class="flex justify-between space-x-4">
										<Avatar.Root>
											<Avatar.Fallback>MW</Avatar.Fallback>
										</Avatar.Root>
										<div class="space-y-1">
											<h4 class="text-sm font-semibold">@mostlywhat</h4>
											<p class="text-sm text-muted-foreground">
												Digital solutions and software development studio.
											</p>
										</div>
									</div>
								</HoverCard.Content>
							</HoverCard.Root>

						<!-- Menubar Examples -->
						{:else if slug === 'menubar'}
							<Menubar.Root>
								<Menubar.Menu>
									<Menubar.Trigger>File</Menubar.Trigger>
									<Menubar.Content>
										<Menubar.Item>New Tab</Menubar.Item>
										<Menubar.Item>New Window</Menubar.Item>
										<Menubar.Separator />
										<Menubar.Item>Print</Menubar.Item>
									</Menubar.Content>
								</Menubar.Menu>
								<Menubar.Menu>
									<Menubar.Trigger>Edit</Menubar.Trigger>
									<Menubar.Content>
										<Menubar.Item>Undo</Menubar.Item>
										<Menubar.Item>Redo</Menubar.Item>
										<Menubar.Separator />
										<Menubar.Item>Cut</Menubar.Item>
										<Menubar.Item>Copy</Menubar.Item>
										<Menubar.Item>Paste</Menubar.Item>
									</Menubar.Content>
								</Menubar.Menu>
							</Menubar.Root>

						<!-- Navigation Menu Examples -->
						{:else if slug === 'navigation-menu'}
							<NavigationMenu.Root>
								<NavigationMenu.List>
									<NavigationMenu.Item>
										<NavigationMenu.Trigger>Getting Started</NavigationMenu.Trigger>
										<NavigationMenu.Content>
											<div class="p-4">
												<p class="text-sm">Introduction content here.</p>
											</div>
										</NavigationMenu.Content>
									</NavigationMenu.Item>
									<NavigationMenu.Item>
										<NavigationMenu.Link href="/docs">Documentation</NavigationMenu.Link>
									</NavigationMenu.Item>
								</NavigationMenu.List>
							</NavigationMenu.Root>

						<!-- Pagination Examples -->
						{:else if slug === 'pagination'}
							<Pagination.Root count={100} perPage={10} siblingCount={1}>
								{#snippet children({ pages, currentPage })}
									<Pagination.Content>
										<Pagination.Item>
											<Pagination.PrevButton />
										</Pagination.Item>
										{#each pages as page (page.key)}
											{#if page.type === 'ellipsis'}
												<Pagination.Item>
													<Pagination.Ellipsis />
												</Pagination.Item>
											{:else}
												<Pagination.Item>
													<Pagination.Link {page} isActive={currentPage === page.value}>
														{page.value}
													</Pagination.Link>
												</Pagination.Item>
											{/if}
										{/each}
										<Pagination.Item>
											<Pagination.NextButton />
										</Pagination.Item>
									</Pagination.Content>
								{/snippet}
							</Pagination.Root>

						<!-- Radio Group Examples -->
						{:else if slug === 'radio-group'}
							<RadioGroup.Root bind:value={radioValue}>
								<div class="flex items-center space-x-2">
									<RadioGroup.Item value="option1" id="option1" />
									<Label for="option1">Option 1</Label>
								</div>
								<div class="flex items-center space-x-2">
									<RadioGroup.Item value="option2" id="option2" />
									<Label for="option2">Option 2</Label>
								</div>
								<div class="flex items-center space-x-2">
									<RadioGroup.Item value="option3" id="option3" />
									<Label for="option3">Option 3</Label>
								</div>
							</RadioGroup.Root>

						<!-- Resizable Examples -->
						{:else if slug === 'resizable'}
							<Resizable.PaneGroup direction="horizontal" class="min-h-[200px] max-w-md border border-border">
								<Resizable.Pane defaultSize={50}>
									<div class="flex h-full items-center justify-center p-6">
										<span class="font-semibold">Panel 1</span>
									</div>
								</Resizable.Pane>
								<Resizable.Handle />
								<Resizable.Pane defaultSize={50}>
									<div class="flex h-full items-center justify-center p-6">
										<span class="font-semibold">Panel 2</span>
									</div>
								</Resizable.Pane>
							</Resizable.PaneGroup>

						<!-- Slider Examples -->
						{:else if slug === 'slider'}
							<Slider type="single" bind:value={sliderValue} max={100} step={1} class="w-[60%]" />

						<!-- Toggle Examples -->
						{:else if slug === 'toggle'}
							<Toggle.Root bind:pressed={togglePressed} aria-label="Toggle bold">
								<Bold class="h-4 w-4" />
							</Toggle.Root>

						<!-- Toggle Group Examples -->
						{:else if slug === 'toggle-group'}
							<ToggleGroup.Root type="single" bind:value={toggleGroupValue}>
								<ToggleGroup.Item value="left" aria-label="Align left">
									<ChevronLeft class="h-4 w-4" />
								</ToggleGroup.Item>
								<ToggleGroup.Item value="center" aria-label="Align center">
									<Bold class="h-4 w-4" />
								</ToggleGroup.Item>
								<ToggleGroup.Item value="right" aria-label="Align right">
									<ChevronRight class="h-4 w-4" />
								</ToggleGroup.Item>
							</ToggleGroup.Root>

						<!-- Spinner Examples -->
						{:else if slug === 'spinner'}
							<div class="flex items-center gap-4">
								<Spinner size="sm" />
								<Spinner size="md" />
								<Spinner size="lg" />
							</div>

						<!-- Kbd Examples -->
						{:else if slug === 'kbd'}
							<div class="flex items-center gap-1">
								<Kbd>⌘</Kbd>
								<Kbd>K</Kbd>
							</div>

						{:else}
							<p class="text-sm text-muted-foreground italic">Preview not available for this component.</p>
						{/if}
					</div>
				</div>

				<!-- Code Area -->
				<div class="relative">
					<div class="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
						<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// CODE</span>
						<button 
							onclick={() => copyCode(block.code || '')}
							class="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							{#if copied}
								<Check class="h-3 w-3" />
								<span>Copied</span>
							{:else}
								<Copy class="h-3 w-3" />
								<span>Copy</span>
							{/if}
						</button>
					</div>
					<pre class="p-4 font-mono text-xs overflow-x-auto bg-card/50"><code>{block.code}</code></pre>
				</div>
			</div>
		{/if}
	{/each}
</div>

<style>
	/* Heading anchor links */
	:global(.component-doc .prose-custom .heading-anchor) {
		color: inherit;
		text-decoration: none;
	}

	:global(.component-doc .prose-custom h2) {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 700;
		text-transform: uppercase;
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		letter-spacing: 0.05em;
	}

	:global(.component-doc .prose-custom h3) {
		font-family: var(--font-ui);
		font-size: 1rem;
		font-weight: 600;
		text-transform: uppercase;
		margin-top: 1.5rem;
		margin-bottom: 0.75rem;
		letter-spacing: 0.05em;
	}

	:global(.component-doc .prose-custom p) {
		font-family: var(--font-body);
		color: var(--muted-foreground);
		margin-bottom: 1rem;
	}

	:global(.component-doc .prose-custom code:not(pre code)) {
		font-family: var(--font-mono);
		font-size: 0.85em;
		background: var(--muted);
		padding: 0.2em 0.4em;
	}

	:global(.component-doc .prose-custom pre) {
		background: var(--card);
		border: 1px solid var(--border);
		padding: 1rem;
		margin: 1rem 0;
		overflow-x: auto;
	}

	:global(.component-doc .prose-custom pre code) {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		background: transparent;
		padding: 0;
	}

	:global(.component-doc .prose-custom table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
		font-size: 0.875rem;
		border: 1px solid var(--border);
	}

	:global(.component-doc .prose-custom th) {
		font-family: var(--font-ui);
		font-weight: 600;
		text-transform: uppercase;
		font-size: 0.75rem;
		letter-spacing: 0.05em;
		text-align: left;
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border);
		border-right: 1px solid var(--border);
		color: var(--muted-foreground);
		background: var(--card);
	}

	:global(.component-doc .prose-custom th:last-child) {
		border-right: none;
	}

	:global(.component-doc .prose-custom td) {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--border);
		border-right: 1px solid var(--border);
	}

	:global(.component-doc .prose-custom td:last-child) {
		border-right: none;
	}

	:global(.component-doc .prose-custom td code) {
		font-size: 0.75rem;
	}
</style>
