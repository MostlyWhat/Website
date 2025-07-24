<script lang="ts">
	import DesignHero from '$lib/components/sections/hero/design-hero.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Alert from '$lib/components/ui/alert/index.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import {
		ArrowLeft,
		Copy,
		Check,
		AlertCircle,
		Info,
		Component,
		Palette,
		MousePointer,
		MessageSquare,
		Layout,
		Navigation
	} from '@lucide/svelte/icons';

	let copiedCode = $state('');

	const copyCode = async (code: string, id: string) => {
		try {
			await navigator.clipboard.writeText(code);
			copiedCode = id;
			setTimeout(() => copiedCode = '', 2000);
		} catch (err) {
			console.error('Failed to copy: ', err);
		}
	};

	const componentCategories = [
		{
			id: 'actions',
			name: 'Actions',
			icon: MousePointer,
			components: ['Button', 'Link Button', 'Icon Button'],
			count: 8,
			accent: 'primary',
			description: 'Interactive elements that trigger actions'
		},
		{
			id: 'forms',
			name: 'Forms',
			icon: Component,
			components: ['Input', 'Textarea', 'Select', 'Checkbox', 'Switch', 'Radio Group'],
			count: 12,
			accent: 'secondary',
			description: 'Form controls for data collection'
		},
		{
			id: 'feedback',
			name: 'Feedback',
			icon: MessageSquare,
			components: ['Alert', 'Badge', 'Toast', 'Progress'],
			count: 6,
			accent: 'destructive',
			description: 'Components for user feedback and status'
		},
		{
			id: 'layout',
			name: 'Layout',
			icon: Layout,
			components: ['Card', 'Separator', 'Tabs', 'Accordion'],
			count: 8,
			accent: 'muted',
			description: 'Structural components for organizing content'
		},
		{
			id: 'navigation',
			name: 'Navigation',
			icon: Navigation,
			components: ['Navigation Menu', 'Breadcrumb', 'Pagination'],
			count: 5,
			accent: 'primary',
			description: 'Components for site navigation'
		}
	];

	let selectedTab = $state('actions');
</script>

<DesignHero
	accent="secondary"
	breadcrumbs={[
		{ label: 'About', href: '/about' },
		{ label: 'Design System', href: '/about/design' },
		{ label: 'Components' }
	]}
	description="Interactive examples of our UI components with code snippets and usage guidelines. Explore 30+ components across different categories."
	size="small"
	subtitle="UI Library"
	title="Components"
>
	{#snippet children()}
		<Button href="/about/design" variant="outline" class="font-chakra uppercase">
			<ArrowLeft class="mr-2 h-4 w-4" />
			Back to Design System
		</Button>
	{/snippet}
</DesignHero>

<!-- Main Content -->
<div class="container mx-auto px-4 py-16 space-y-16">

	<!-- Component Categories Overview -->
	<section class="space-y-8" id="overview">
		<div class="space-y-4">
			<div class="flex items-center space-x-3">
				<Component class="h-6 w-6 text-secondary" />
				<Badge class="font-chakra text-xs uppercase tracking-wider" variant="outline">
					Component Library
				</Badge>
			</div>
			<h2 class="font-heading text-3xl md:text-4xl font-black uppercase">
				30+ UI Components
			</h2>
			<p class="text-muted-foreground text-lg max-w-3xl">
				Our comprehensive component library provides everything you need to build modern, accessible interfaces.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			{#each componentCategories as category (category.id)}
				<div class="group relative">
					<!-- Background Gradient -->
					<div
						class="absolute inset-0 bg-gradient-to-br from-{category.accent}/5 to-{category.accent}/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

					<!-- Card Content -->
					<div
						class="relative bg-card border border-border/50 rounded-lg p-6 hover:border-{category.accent}/30 transition-all duration-300">
						<!-- Header -->
						<div class="flex items-center justify-between mb-4">
							<div class="flex items-center space-x-3">
								<div
									class="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-{category.accent}/10 text-{category.accent}">
									<svelte:component this={category.icon} class="h-5 w-5" />
								</div>
								<div>
									<h3 class="font-heading text-lg font-bold uppercase">
										{category.name}
									</h3>
									<p class="text-xs text-muted-foreground">
										{category.description}
									</p>
								</div>
							</div>
							<Badge variant="outline" class="font-chakra text-xs">
								{category.count}
							</Badge>
						</div>

						<!-- Component List -->
						<div class="flex flex-wrap gap-2">
							{#each category.components as component (component)}
								<Badge variant="secondary" class="text-xs">
									{component}
								</Badge>
							{/each}
						</div>
					</div>
				</div>
			{/each}
		</div>
	</section>

	<!-- Interactive Examples with Vertical Tabs -->
	<section class="space-y-8" id="examples">
		<div class="space-y-4">
			<div class="flex items-center space-x-3">
				<Palette class="h-6 w-6 text-destructive" />
				<Badge class="font-chakra text-xs uppercase tracking-wider" variant="outline">
					Interactive Examples
				</Badge>
			</div>
			<h2 class="font-heading text-3xl md:text-4xl font-black uppercase">
				Live Component Showcase
			</h2>
		</div>

		<div class="bg-card border border-border/20 rounded-lg overflow-hidden">
			<Tabs.Root bind:value={selectedTab} class="grid grid-cols-1 lg:grid-cols-4 min-h-[600px]" orientation="vertical">
				<!-- Vertical Tab List -->
				<div class="lg:col-span-1 border-r border-border/20 bg-muted/20">
					<Tabs.List class="flex flex-col h-full w-full bg-transparent p-2 space-y-1">
						{#each componentCategories as category (category.id)}
							<Tabs.Trigger
								value={category.id}
								class="w-full justify-start space-x-3 p-4 rounded-lg data-[state=active]:bg-{category.accent}/10 data-[state=active]:text-{category.accent} data-[state=active]:border-{category.accent}/20 hover:bg-background/50 transition-all"
							>
								<svelte:component this={category.icon} class="h-4 w-4" />
								<div class="text-left">
									<div class="font-chakra text-xs uppercase font-medium">
										{category.name}
									</div>
									<div class="text-xs text-muted-foreground">
										{category.count} components
									</div>
								</div>
							</Tabs.Trigger>
						{/each}
					</Tabs.List>
				</div>

				<!-- Content Area -->
				<div class="lg:col-span-3">
					<!-- Actions Tab -->
					<Tabs.Content class="p-6 m-0 space-y-8" value="actions">
						<div class="space-y-6">
							<div>
								<h3 class="font-heading text-xl font-bold uppercase mb-2">Button Components</h3>
								<p class="text-muted-foreground text-sm mb-6">Interactive buttons with multiple variants and sizes</p>
							</div>

							<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
								<!-- Visual Examples -->
								<div class="space-y-6">
									<div class="space-y-4">
										<h4 class="font-chakra text-sm uppercase text-muted-foreground">Button Variants</h4>
										<div class="flex flex-wrap gap-3">
											<Button>Default</Button>
											<Button variant="secondary">Secondary</Button>
											<Button variant="outline">Outline</Button>
											<Button variant="ghost">Ghost</Button>
											<Button variant="destructive">Destructive</Button>
										</div>
									</div>

									<div class="space-y-4">
										<h4 class="font-chakra text-sm uppercase text-muted-foreground">Button Sizes</h4>
										<div class="flex flex-wrap items-center gap-3">
											<Button size="sm">Small</Button>
											<Button>Default</Button>
											<Button size="lg">Large</Button>
										</div>
									</div>
								</div>

								<!-- Code Snippet -->
								<div class="space-y-4">
									<div class="flex items-center justify-between">
										<h4 class="font-chakra text-sm uppercase text-muted-foreground">Code Example</h4>
										<button
											class="inline-flex items-center px-3 py-1 bg-muted hover:bg-muted/80 rounded text-xs transition-colors"
											onclick={() => copyCode(`<Button variant="default">Default</Button>`, 'button-code')}
										>
											{#if copiedCode === 'button-code'}
												<Check class="mr-2 h-3 w-3 text-green-500" />
												Copied
											{:else}
												<Copy class="mr-2 h-3 w-3" />
												Copy
											{/if}
										</button>
									</div>
									<div class="bg-muted/50 p-4 rounded-lg">
										<pre class="text-xs overflow-x-auto"><code>{`<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button size="sm">Small Button</Button>
<Button variant="destructive">Delete</Button>`}</code></pre>
									</div>
								</div>
							</div>
						</div>
					</Tabs.Content>

					<!-- Forms Tab -->
					<Tabs.Content class="p-6 m-0 space-y-8" value="forms">
						<div class="space-y-6">
							<div>
								<h3 class="font-heading text-xl font-bold uppercase mb-2">Form Controls</h3>
								<p class="text-muted-foreground text-sm mb-6">Input components for collecting user data</p>
							</div>

							<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
								<!-- Visual Examples -->
								<div class="space-y-6">
									<div class="space-y-3">
										<Label class="font-chakra text-xs uppercase" for="email">Email Address</Label>
										<Input id="email" placeholder="Enter your email" type="email" />
									</div>

									<div class="space-y-3">
										<Label class="font-chakra text-xs uppercase" for="message">Message</Label>
										<Textarea id="message" placeholder="Type your message here" rows="4" />
									</div>

									<div class="space-y-4">
										<div class="flex items-center space-x-2">
											<Checkbox id="terms" />
											<Label class="text-sm" for="terms">Accept terms and conditions</Label>
										</div>

										<div class="flex items-center space-x-2">
											<Switch id="notifications" />
											<Label class="text-sm" for="notifications">Enable notifications</Label>
										</div>
									</div>
								</div>

								<!-- Code Snippet -->
								<div class="space-y-4">
									<div class="flex items-center justify-between">
										<h4 class="font-chakra text-sm uppercase text-muted-foreground">Code Example</h4>
										<button
											class="inline-flex items-center px-3 py-1 bg-muted hover:bg-muted/80 rounded text-xs transition-colors"
											onclick={() => copyCode(`<Label for="email">Email</Label>`, 'form-code')}
										>
											{#if copiedCode === 'form-code'}
												<Check class="mr-2 h-3 w-3 text-green-500" />
												Copied
											{:else}
												<Copy class="mr-2 h-3 w-3" />
												Copy
											{/if}
										</button>
									</div>
									<div class="bg-muted/50 p-4 rounded-lg">
										<pre class="text-xs overflow-x-auto"><code>{`<Label for="email">Email Address</Label>
<Input type="email" placeholder="Enter your email" />

<Textarea placeholder="Type your message" />

<Checkbox id="terms" />
<Label for="terms">Accept terms</Label>

<Switch id="notifications" />
<Label for="notifications">Enable notifications</Label>`}</code></pre>
									</div>
								</div>
							</div>
						</div>
					</Tabs.Content>

					<!-- Feedback Tab -->
					<Tabs.Content class="p-6 m-0 space-y-8" value="feedback">
						<div class="space-y-6">
							<div>
								<h3 class="font-heading text-xl font-bold uppercase mb-2">Feedback Components</h3>
								<p class="text-muted-foreground text-sm mb-6">Components for providing user feedback and status</p>
							</div>

							<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
								<!-- Visual Examples -->
								<div class="space-y-6">
									<div class="space-y-4">
										<h4 class="font-chakra text-sm uppercase text-muted-foreground">Alerts</h4>
										<div class="space-y-3">
											<Alert.Root>
												<Info class="h-4 w-4" />
												<Alert.Title>Information</Alert.Title>
												<Alert.Description>
													This is an informational alert with additional context.
												</Alert.Description>
											</Alert.Root>

											<Alert.Root variant="destructive">
												<AlertCircle class="h-4 w-4" />
												<Alert.Title>Error</Alert.Title>
												<Alert.Description>
													Something went wrong. Please try again.
												</Alert.Description>
											</Alert.Root>
										</div>
									</div>

									<div class="space-y-4">
										<h4 class="font-chakra text-sm uppercase text-muted-foreground">Badges</h4>
										<div class="flex flex-wrap gap-2">
											<Badge>Default</Badge>
											<Badge variant="secondary">Secondary</Badge>
											<Badge variant="outline">Outline</Badge>
											<Badge variant="destructive">Destructive</Badge>
										</div>
									</div>
								</div>

								<!-- Code Snippet -->
								<div class="space-y-4">
									<div class="flex items-center justify-between">
										<h4 class="font-chakra text-sm uppercase text-muted-foreground">Code Example</h4>
										<button
											class="inline-flex items-center px-3 py-1 bg-muted hover:bg-muted/80 rounded text-xs transition-colors"
											onclick={() => copyCode(`<Alert.Root>`, 'feedback-code')}
										>
											{#if copiedCode === 'feedback-code'}
												<Check class="mr-2 h-3 w-3 text-green-500" />
												Copied
											{:else}
												<Copy class="mr-2 h-3 w-3" />
												Copy
											{/if}
										</button>
									</div>
									<div class="bg-muted/50 p-4 rounded-lg">
										<pre class="text-xs overflow-x-auto"><code>{`<Alert.Root>
  <Info class="h-4 w-4" />
  <Alert.Title>Information</Alert.Title>
  <Alert.Description>
    This is an informational alert.
  </Alert.Description>
</Alert.Root>

<Badge variant="secondary">Badge</Badge>
<Badge variant="destructive">Error</Badge>`}</code></pre>
									</div>
								</div>
							</div>
						</div>
					</Tabs.Content>

					<!-- Layout Tab -->
					<Tabs.Content class="p-6 m-0 space-y-8" value="layout">
						<div class="space-y-6">
							<div>
								<h3 class="font-heading text-xl font-bold uppercase mb-2">Layout Components</h3>
								<p class="text-muted-foreground text-sm mb-6">Structural components for organizing content</p>
							</div>

							<div class="text-center py-12">
								<Layout class="h-16 w-16 text-muted-foreground mx-auto mb-4" />
								<h4 class="font-heading text-lg font-bold uppercase mb-2">Coming Soon</h4>
								<p class="text-muted-foreground text-sm">
									Layout components like cards, separators, tabs, and accordion layouts.
								</p>
							</div>
						</div>
					</Tabs.Content>

					<!-- Navigation Tab -->
					<Tabs.Content class="p-6 m-0 space-y-8" value="navigation">
						<div class="space-y-6">
							<div>
								<h3 class="font-heading text-xl font-bold uppercase mb-2">Navigation Components</h3>
								<p class="text-muted-foreground text-sm mb-6">Components for site and app navigation</p>
							</div>

							<div class="text-center py-12">
								<Navigation class="h-16 w-16 text-muted-foreground mx-auto mb-4" />
								<h4 class="font-heading text-lg font-bold uppercase mb-2">Coming Soon</h4>
								<p class="text-muted-foreground text-sm">
									Navigation components like menus, breadcrumbs, and pagination controls.
								</p>
							</div>
						</div>
					</Tabs.Content>
				</div>
			</Tabs.Root>
		</div>
	</section>
</div>
