<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Header, Footer } from '$lib/components/layout';
	import { Home, ArrowLeft, ArrowRight, AlertTriangle, FileQuestion, ExternalLink } from '@lucide/svelte';
</script>

<svelte:head>
	<title>{page.status} — {m.site_name()}</title>
</svelte:head>

<!-- Header -->
<Header />

<!-- Error Content -->
<div class="flex min-h-[calc(100dvh-4rem)] flex-col">
	<!-- Main Error Content -->
	<section class="flex flex-1 flex-col items-center justify-center border-b border-border bg-background px-6 py-16 md:px-12 lg:px-16">
		<div class="text-center">
			<!-- Error Icon -->
			<div class="mx-auto mb-8 flex h-24 w-24 items-center justify-center border border-border bg-card">
				{#if page.status === 404}
					<FileQuestion class="h-12 w-12 text-muted-foreground" />
				{:else}
					<AlertTriangle class="h-12 w-12 text-destructive" />
				{/if}
			</div>
			
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// ERROR.{page.status}</span>
			<h1 class="font-display mt-4 text-4xl font-bold uppercase md:text-5xl lg:text-6xl">
				{page.status === 404 ? 'PAGE NOT FOUND' : 'SOMETHING WENT WRONG'}
			</h1>
			<p class="font-body mx-auto mt-6 max-w-md text-muted-foreground">
				{page.status === 404 
					? "The page you're looking for doesn't exist or has been moved."
					: "An unexpected error occurred. Please try again or contact support if the problem persists."}
			</p>
			
			<div class="mt-8 flex flex-wrap justify-center gap-4">
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
	</section>

	<!-- Quick Links Section -->
	<section class="border-b border-border">
		<div class="grid grid-cols-12 gap-px bg-border">
			<div 
				class="col-span-12 bg-background px-6 py-8 md:px-12 lg:col-span-4 lg:px-16 lg:py-12" 
				use:scrollAnimate={{ animation: 'fade' }}
			>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">// NAVIGATION</span>
				<h2 class="font-display mt-2 text-2xl font-bold uppercase md:text-3xl">WHERE TO GO</h2>
				<p class="font-body mt-2 text-sm text-muted-foreground">Here are some helpful links to get you back on track.</p>
			</div>
			
			<div 
				class="col-span-12 grid grid-cols-2 gap-px bg-border lg:col-span-8 lg:grid-cols-4" 
				use:scrollAnimate={{ animation: 'stagger' }}
			>
				<a href={localizeHref('/')} class="group flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card md:px-8">
					<span class="font-mono text-xs text-primary">01</span>
					<h3 class="font-ui mt-2 text-xs font-semibold uppercase tracking-wider group-hover:text-primary">HOME</h3>
					<p class="font-body mt-1 text-[11px] text-muted-foreground">Return to homepage</p>
					<ArrowRight class="mt-auto h-3 w-3 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100" />
				</a>
				<a href={localizeHref('/projects')} class="group flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card md:px-8">
					<span class="font-mono text-xs text-primary">02</span>
					<h3 class="font-ui mt-2 text-xs font-semibold uppercase tracking-wider group-hover:text-primary">PROJECTS</h3>
					<p class="font-body mt-1 text-[11px] text-muted-foreground">View our work</p>
					<ArrowRight class="mt-auto h-3 w-3 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100" />
				</a>
				<a href={localizeHref('/services')} class="group flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card md:px-8">
					<span class="font-mono text-xs text-primary">03</span>
					<h3 class="font-ui mt-2 text-xs font-semibold uppercase tracking-wider group-hover:text-primary">SERVICES</h3>
					<p class="font-body mt-1 text-[11px] text-muted-foreground">What we offer</p>
					<ArrowRight class="mt-auto h-3 w-3 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100" />
				</a>
				<a href={localizeHref('/contact')} class="group flex flex-col bg-background px-6 py-6 transition-colors hover:bg-card md:px-8">
					<span class="font-mono text-xs text-primary">04</span>
					<h3 class="font-ui mt-2 text-xs font-semibold uppercase tracking-wider group-hover:text-primary">CONTACT</h3>
					<p class="font-body mt-1 text-[11px] text-muted-foreground">Get in touch</p>
					<ArrowRight class="mt-auto h-3 w-3 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100" />
				</a>
			</div>
		</div>
	</section>
</div>

<!-- Footer -->
<Footer />
