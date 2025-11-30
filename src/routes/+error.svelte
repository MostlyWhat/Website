<script lang="ts">
	import { page } from '$app/state';
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import { localizeHref } from '$lib/paraglide/runtime';
	import Button from '$lib/components/ui/button/button.svelte';
	import HeroSection from '$lib/components/layout/HeroSection.svelte';
	import DescriptionSection from '$lib/components/layout/DescriptionSection.svelte';
	import { Home, ArrowLeft, ArrowRight } from '@lucide/svelte';
</script>

<svelte:head>
	<title>{page.status} — {m.site_name()}</title>
</svelte:head>

<!-- Error Hero - Full Viewport with shared HeroSection -->
<HeroSection
	label="// ERROR.{page.status}"
	title={page.status === 404 ? 'PAGE NOT FOUND' : 'SOMETHING WENT WRONG'}
	description={page.status === 404 
		? "The page you're looking for doesn't exist or has been moved."
		: "An unexpected error occurred. Please try again or contact support if the problem persists."}
	stats={[
		{ value: String(page.status), label: 'STATUS' },
		{ value: 'ERROR', label: 'TYPE' }
	]}
>
	{#snippet actions()}
		<Button href={localizeHref('/')} variant="outline" size="lg" class="font-ui tracking-wider">
			<Home class="mr-2 h-4 w-4" />
			HOME
		</Button>
		<Button size="lg" class="font-ui tracking-wider" onclick={() => history.back()}>
			<ArrowLeft class="mr-2 h-4 w-4" />
			GO BACK
		</Button>
	{/snippet}
</HeroSection>

<!-- Description Section -->
<DescriptionSection
	description={page.status === 404 
		? m.error_404_subtitle()
		: "If this problem persists, please contact our support team with the error details."}
	stats={[
		{ value: '24/7', label: 'SUPPORT' },
		{ value: 'FAST', label: 'RESPONSE' }
	]}
/>

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
