<script lang="ts">
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { ArrowRight } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Stat {
		value: string;
		label: string;
	}

	interface Props {
		/** CTA style variant */
		variant?: 'default' | 'compact' | 'minimal' | 'split' | 'large';
		/** Small label above title */
		label?: string;
		/** Main heading */
		title: string;
		/** Description text */
		description?: string;
		/** Button text */
		buttonText?: string;
		/** Button link */
		buttonHref?: string;
		/** Secondary button text */
		secondaryButtonText?: string;
		/** Secondary button link or action */
		secondaryButtonHref?: string;
		/** Stats to show (for split variant) */
		stats?: Stat[];
		/** Custom content slot */
		children?: Snippet;
	}

	let {
		variant = 'default',
		label = '',
		title,
		description = '',
		buttonText = '',
		buttonHref = '',
		secondaryButtonText = '',
		secondaryButtonHref = '',
		stats = [],
		children
	}: Props = $props();
</script>

<section class="border-b border-border">
	{#if variant === 'minimal'}
		<!-- Minimal: Single row with text and button -->
		<div class="flex flex-col items-center justify-between gap-4 bg-card px-6 py-6 md:flex-row md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade' }}>
			<div>
				{#if label}
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{label}</span>
				{/if}
				<h2 class="font-display text-lg font-bold uppercase md:text-xl">{title}</h2>
			</div>
			{#if buttonText && buttonHref}
				<Button href={localizeHref(buttonHref)} class="font-ui tracking-wider">
					{buttonText}
					<ArrowRight class="ml-2 h-4 w-4" />
				</Button>
			{/if}
		</div>

	{:else if variant === 'compact'}
		<!-- Compact: Single row, minimal height -->
		<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'scale' }}>
			<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-6 md:px-12 lg:col-span-8 lg:px-16">
				{#if label}
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{label}</span>
				{/if}
				<h2 class="font-display mt-2 text-xl font-bold uppercase md:text-2xl">{title}</h2>
				{#if description}
					<p class="font-body mt-2 text-sm text-muted-foreground">{description}</p>
				{/if}
			</div>
			<div class="col-span-12 flex items-center justify-center bg-card px-6 py-6 md:px-12 lg:col-span-4 lg:px-16">
				{#if buttonText && buttonHref}
					<Button href={localizeHref(buttonHref)} class="font-ui uppercase tracking-wider">
						{buttonText}
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				{/if}
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>

	{:else if variant === 'split'}
		<!-- Split: Left content, right stats grid -->
		<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'scale' }}>
			<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-12 md:px-12 lg:col-span-6 lg:px-16">
				{#if label}
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{label}</span>
				{/if}
				<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl">{title}</h2>
				{#if description}
					<p class="font-body mt-4 text-sm text-muted-foreground">{description}</p>
				{/if}
				{#if buttonText && buttonHref}
					<div class="mt-6">
						<Button href={localizeHref(buttonHref)} class="font-ui tracking-wider">
							{buttonText}
							<ArrowRight class="ml-2 h-4 w-4" />
						</Button>
					</div>
				{/if}
			</div>
			{#if stats.length > 0}
				<div class="col-span-12 grid grid-cols-2 gap-px bg-border lg:col-span-6">
					{#each stats as stat (stat.label)}
						<div class="flex flex-col justify-center bg-card px-6 py-8 md:px-12 lg:px-16">
							<span class="font-display text-2xl font-bold text-primary">{stat.value}</span>
							<p class="font-mono mt-1 text-[10px] tracking-widest text-muted-foreground">{stat.label}</p>
						</div>
					{/each}
				</div>
			{:else if children}
				<div class="col-span-12 flex items-center justify-center bg-card px-6 py-12 md:px-12 lg:col-span-6 lg:px-16">
					{@render children()}
				</div>
			{/if}
		</div>

	{:else if variant === 'large'}
		<!-- Large: Big text CTA for contact pages -->
		<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'scale' }}>
			<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-16 md:px-12 lg:col-span-8 lg:px-16 lg:py-20">
				{#if label}
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{label}</span>
				{/if}
				<h2 class="font-display mt-4 text-3xl font-black uppercase leading-[0.95] md:text-4xl lg:text-5xl xl:text-6xl">{title}</h2>
				{#if description}
					<p class="font-body mt-6 max-w-xl text-base text-muted-foreground md:text-lg">{description}</p>
				{/if}
				{#if buttonText || secondaryButtonText}
					<div class="mt-8 flex flex-wrap gap-4">
						{#if buttonText && buttonHref}
							<Button href={localizeHref(buttonHref)} variant="ghost" size="lg" class="font-ui uppercase tracking-wider">
								{buttonText}
								<ArrowRight class="ml-2 h-4 w-4" />
							</Button>
						{/if}
						{#if secondaryButtonText && secondaryButtonHref}
							<Button href={secondaryButtonHref} variant="ghost" size="lg" class="font-ui uppercase tracking-wider">
								{secondaryButtonText}
							</Button>
						{/if}
					</div>
				{/if}
			</div>
			<div class="col-span-12 flex flex-col items-center justify-center bg-primary/10 px-6 py-12 lg:col-span-4 lg:px-16">
				{#if children}
					{@render children()}
				{:else}
					<p class="font-mono text-[10px] tracking-widest text-muted-foreground">QUICK CONTACT</p>
					<a href="mailto:hello@mostlywhat.systems" class="font-ui mt-3 block text-sm uppercase text-primary hover:underline">
						HELLO@MOSTLYWHAT.SYSTEMS
					</a>
				{/if}
			</div>
		</div>

	{:else}
		<!-- Default: Standard two column -->
		<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'scale' }}>
			<div class="col-span-12 flex flex-col justify-center bg-background px-6 py-12 md:px-12 lg:col-span-6 lg:px-16">
				{#if label}
					<span class="font-mono text-[10px] tracking-widest text-muted-foreground">{label}</span>
				{/if}
				<h2 class="font-display mt-4 text-2xl font-bold uppercase md:text-3xl lg:text-4xl">{title}</h2>
				{#if description}
					<p class="font-body mt-4 text-muted-foreground">{description}</p>
				{/if}
			</div>
			<div class="col-span-12 flex items-center justify-center bg-card px-6 py-12 md:px-12 lg:col-span-6 lg:px-16">
				{#if buttonText && buttonHref}
					<Button href={localizeHref(buttonHref)} size="lg" class="font-ui uppercase tracking-wider">
						{buttonText}
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				{/if}
				{#if children}
					{@render children()}
				{/if}
			</div>
		</div>
	{/if}
</section>
