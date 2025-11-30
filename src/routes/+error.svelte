<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import VideoBackground from '$lib/components/layout/VideoBackground.svelte';
	import { GlitchText } from '$lib/components/ui/glitch-text';
	import { MARATHON_VIDEO } from '$lib/constants';
	import { Home, ArrowLeft, FileQuestion, ArrowRight } from '@lucide/svelte';
</script>

<svelte:head>
	<title>{page.status} — {m.site_name()}</title>
</svelte:head>

<!-- Error Hero - Full Viewport -->
<section class="relative flex h-[calc(100dvh-4rem)] flex-col border-b border-border">
	<!-- Video Background -->
	<VideoBackground 
		src={MARATHON_VIDEO}
		class="brightness-[0.20]"
	/>
	<div class="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
		<div class="absolute inset-0 opacity-[0.08]" style="background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;"></div>
	</div>

	<!-- Hero Content - Left-aligned, Bottom-positioned -->
	<div class="flex flex-1 flex-col items-start justify-end px-6 pb-12 md:px-12 lg:px-16" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<div class="mb-12 max-w-4xl text-left">
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">ERROR {page.status}</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl">
				<GlitchText text={page.status === 404 ? 'PAGE NOT FOUND' : 'SOMETHING WENT WRONG'} scrambledStart={true} />
			</h1>
			<div class="mt-8 flex flex-wrap justify-start gap-3">
				<Button href={localizeHref('/')} variant="outline" size="lg" class="font-ui tracking-wider">
					<Home class="mr-2 h-4 w-4" />
					HOME
				</Button>
				<Button size="lg" class="font-ui tracking-wider" onclick={() => history.back()}>
					<ArrowLeft class="mr-2 h-4 w-4" />
					GO BACK
				</Button>
			</div>
		</div>
	</div>
</section>

<!-- Description Section -->
<section class="border-b border-border bg-background">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-12 md:col-span-6 md:px-12 lg:px-16">
			<p class="font-body max-w-xl text-lg text-muted-foreground md:text-xl">
				{#if page.status === 404}
					{m.error_404_subtitle()}
				{:else}
					An unexpected error occurred. Please try again or contact support if the problem persists.
				{/if}
			</p>
		</div>
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border md:col-span-6">
			<div class="flex flex-col justify-center bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-lg font-bold text-primary md:text-xl">{page.status}</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">STATUS CODE</p>
			</div>
			<div class="flex flex-col justify-center bg-background px-6 py-6 md:px-12 lg:px-16">
				<span class="font-display text-lg font-bold text-primary md:text-xl">ERROR</span>
				<p class="font-mono mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">TYPE</p>
			</div>
		</div>
	</div>
</section>

<!-- Quick Links Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background px-6 py-8 md:px-12 lg:col-span-4 lg:px-16 lg:py-12" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">NAVIGATION</span>
			<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">WHERE TO GO</h2>
			<p class="font-body mt-2 text-sm text-muted-foreground">Here are some helpful links to get you back on track.</p>
		</div>
		
		<div class="col-span-12 grid grid-cols-2 gap-px bg-border lg:col-span-8 lg:grid-cols-4" use:scrollAnimate={{ animation: 'stagger' }}>
			<a href={localizeHref('/')} class="group flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card md:px-8">
				<span class="font-mono text-xs text-primary">01</span>
				<h3 class="font-ui mt-2 text-xs font-semibold uppercase tracking-wider group-hover:text-primary">HOME</h3>
				<p class="font-body mt-1 text-[11px] text-muted-foreground">Return to homepage</p>
			</a>
			<a href={localizeHref('/projects')} class="group flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card md:px-8">
				<span class="font-mono text-xs text-primary">02</span>
				<h3 class="font-ui mt-2 text-xs font-semibold uppercase tracking-wider group-hover:text-primary">PROJECTS</h3>
				<p class="font-body mt-1 text-[11px] text-muted-foreground">View our work</p>
			</a>
			<a href={localizeHref('/services')} class="group flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card md:px-8">
				<span class="font-mono text-xs text-primary">03</span>
				<h3 class="font-ui mt-2 text-xs font-semibold uppercase tracking-wider group-hover:text-primary">SERVICES</h3>
				<p class="font-body mt-1 text-[11px] text-muted-foreground">What we offer</p>
			</a>
			<a href={localizeHref('/contact')} class="group flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card md:px-8">
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
		<div class="col-span-12 bg-card px-6 py-8 md:col-span-8 md:px-12 lg:px-16 lg:py-12">
			<div class="font-mono text-sm">
				<p class="text-muted-foreground">$ <span class="text-primary">curl</span> {page.url.pathname}</p>
				<p class="mt-2 text-red-400">Error: {page.status} {page.error?.message || 'Not Found'}</p>
				<p class="text-muted-foreground">The requested resource could not be located.</p>
				<p class="mt-2 text-muted-foreground">$ <span class="animate-pulse">_</span></p>
			</div>
		</div>
		<div class="col-span-12 flex items-center justify-center bg-primary/10 px-6 py-8 md:col-span-4 md:px-12 lg:px-16">
			<div class="text-center">
				<FileQuestion class="mx-auto mb-2 h-12 w-12 text-primary" />
				<p class="font-mono text-[10px] tracking-widest text-muted-foreground">STATUS CODE</p>
				<p class="font-display mt-1 text-4xl font-bold text-primary">{page.status}</p>
			</div>
		</div>
	</div>
</section>
