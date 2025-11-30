<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Home, ArrowLeft, FileQuestion, ArrowRight } from '@lucide/svelte';
</script>

<svelte:head>
	<title>{page.status} — {m.site_name()}</title>
</svelte:head>

<!-- Error Hero - Full Viewport -->
<section class="relative flex h-[calc(100dvh-4rem)] flex-col border-b border-border">
	<!-- Image Background -->
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<img 
			src="https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=2029&auto=format&fit=crop" 
			alt="" 
			class="h-full w-full object-cover brightness-[0.25]"
		/>
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content -->
	<div class="flex flex-1 flex-col justify-center px-4 md:px-6 lg:px-8" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="grid grid-cols-12 gap-4">
			<div class="col-span-12 lg:col-span-8">
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ERROR {page.status}</span>
				<h1 class="font-display mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tight md:text-7xl lg:text-8xl xl:text-9xl">
					{#if page.status === 404}
						PAGE NOT FOUND
					{:else}
						SOMETHING WENT WRONG
					{/if}
				</h1>
			</div>
			<div class="col-span-12 flex flex-col justify-end lg:col-span-4">
				<p class="font-body text-base text-muted-foreground md:text-lg">
					{#if page.status === 404}
						{m.error_404_subtitle()}
					{:else}
						An unexpected error occurred. Please try again or contact support if the problem persists.
					{/if}
				</p>
				<div class="mt-4 flex gap-2">
					<Button href={localizeHref('/')} class="font-ui tracking-wider">
						<Home class="mr-2 h-4 w-4" />
						HOME
					</Button>
					<Button variant="outline" class="font-ui tracking-wider" onclick={() => history.back()}>
						<ArrowLeft class="mr-2 h-4 w-4" />
						GO BACK
					</Button>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Quick Links Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background p-6 md:p-8 lg:col-span-4 lg:p-12" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NAVIGATION</span>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">WHERE TO GO</h2>
			<p class="font-body mt-2 text-sm text-muted-foreground">Here are some helpful links to get you back on track.</p>
		</div>
		
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border lg:col-span-8 lg:grid-cols-4" use:scrollAnimate={{ animation: 'stagger' }}>
			<a href={localizeHref('/')} class="group flex flex-col bg-background p-4 transition-colors hover:bg-card md:p-6">
				<span class="font-mono text-xs text-primary">01</span>
				<h3 class="font-ui mt-2 text-xs font-semibold uppercase tracking-wider group-hover:text-primary">HOME</h3>
				<p class="font-body mt-1 text-[11px] text-muted-foreground">Return to homepage</p>
			</a>
			<a href={localizeHref('/projects')} class="group flex flex-col bg-background p-4 transition-colors hover:bg-card md:p-6">
				<span class="font-mono text-xs text-primary">02</span>
				<h3 class="font-ui mt-2 text-xs font-semibold uppercase tracking-wider group-hover:text-primary">PROJECTS</h3>
				<p class="font-body mt-1 text-[11px] text-muted-foreground">View our work</p>
			</a>
			<a href={localizeHref('/services')} class="group flex flex-col bg-background p-4 transition-colors hover:bg-card md:p-6">
				<span class="font-mono text-xs text-primary">03</span>
				<h3 class="font-ui mt-2 text-xs font-semibold uppercase tracking-wider group-hover:text-primary">SERVICES</h3>
				<p class="font-body mt-1 text-[11px] text-muted-foreground">What we offer</p>
			</a>
			<a href={localizeHref('/contact')} class="group flex flex-col bg-background p-4 transition-colors hover:bg-card md:p-6">
				<span class="font-mono text-xs text-primary">04</span>
				<h3 class="font-ui mt-2 text-xs font-semibold uppercase tracking-wider group-hover:text-primary">CONTACT</h3>
				<p class="font-body mt-1 text-[11px] text-muted-foreground">Get in touch</p>
			</a>
		</div>
	</div>
</section>

<!-- Terminal Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border" use:scrollAnimate={{ animation: 'scale' }}>
		<div class="col-span-12 bg-card p-6 md:col-span-8 md:p-8 lg:p-12">
			<div class="font-mono text-sm">
				<p class="text-muted-foreground">$ <span class="text-primary">curl</span> {page.url.pathname}</p>
				<p class="mt-2 text-red-400">Error: {page.status} {page.error?.message || 'Not Found'}</p>
				<p class="text-muted-foreground">The requested resource could not be located.</p>
				<p class="mt-2 text-muted-foreground">$ <span class="animate-pulse">_</span></p>
			</div>
		</div>
		<div class="col-span-12 flex items-center justify-center bg-primary/10 p-6 md:col-span-4 md:p-8">
			<div class="text-center">
				<FileQuestion class="mx-auto mb-2 h-12 w-12 text-primary" />
				<p class="font-mono text-[10px] tracking-widest text-muted-foreground">STATUS CODE</p>
				<p class="font-display mt-1 text-4xl font-bold text-primary">{page.status}</p>
			</div>
		</div>
	</div>
</section>
