<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
</script>

<svelte:head>
	<title>{m.legal_cookies()} — {m.site_name()}</title>
	<meta name="description" content="Cookie Policy for MostlyWhat Systems" />
</svelte:head>

<!-- Hero Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background p-6 md:p-8 lg:col-span-8 lg:p-12" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LEGAL</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-5xl lg:text-6xl">
				{m.legal_cookies()}
			</h1>
		</div>
		<div class="col-span-12 flex items-center bg-card p-6 md:p-8 lg:col-span-4 lg:p-12">
			<div>
				<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LAST UPDATED</span>
				<p class="font-display mt-1 text-sm font-bold md:text-base">JANUARY 2024</p>
			</div>
		</div>
	</div>
</section>

<!-- Content Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background p-6 md:p-8 lg:col-span-3 lg:p-12" use:scrollAnimate={{ animation: 'fade' }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">CONTENTS</span>
			<nav class="mt-4 space-y-2">
				<a href="#what" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">01 — WHAT ARE COOKIES</a>
				<a href="#how" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">02 — HOW WE USE THEM</a>
				<a href="#types" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">03 — COOKIE TYPES</a>
				<a href="#manage" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">04 — MANAGING COOKIES</a>
				<a href="#contact" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">05 — CONTACT US</a>
			</nav>
		</div>
		<article class="col-span-12 bg-background p-6 md:p-8 lg:col-span-9 lg:p-12" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="max-w-3xl space-y-8">
				<section id="what">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">01 — WHAT ARE COOKIES</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						Cookies are small text files that are placed on your device when you visit a website. 
						They are widely used to make websites work more efficiently and provide information 
						to the owners of the site.
					</p>
				</section>

				<section id="how">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">02 — HOW WE USE COOKIES</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">We use cookies for the following purposes:</p>
				</section>

				<section id="types">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">03 — COOKIE TYPES</h2>
					<div class="mt-4 space-y-4">
						<div>
							<h3 class="font-ui text-xs font-semibold tracking-wider">ESSENTIAL COOKIES</h3>
							<p class="font-body mt-1 text-sm text-muted-foreground">
								These cookies are necessary for the website to function properly. You cannot opt out.
							</p>
						</div>
						<div>
							<h3 class="font-ui text-xs font-semibold tracking-wider">ANALYTICS COOKIES</h3>
							<p class="font-body mt-1 text-sm text-muted-foreground">
								We use these to understand how visitors interact with our website.
							</p>
						</div>
						<div>
							<h3 class="font-ui text-xs font-semibold tracking-wider">PREFERENCE COOKIES</h3>
							<p class="font-body mt-1 text-sm text-muted-foreground">
								These remember your preferences for a more personalized experience.
							</p>
						</div>
					</div>
				</section>

				<section id="manage">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">04 — MANAGING COOKIES</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						Most web browsers allow you to control cookies through their settings. You can:
					</p>
					<ul class="font-body mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
						<li>Delete all cookies</li>
						<li>Block all cookies</li>
						<li>Allow all cookies</li>
						<li>Block third-party cookies</li>
						<li>Clear all cookies when you close the browser</li>
					</ul>
				</section>

				<section id="contact">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">05 — CONTACT US</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						If you have any questions about our use of cookies, please contact us at 
						<a href="mailto:privacy@mostlywhat.systems" class="text-primary hover:underline">privacy@mostlywhat.systems</a>.
					</p>
				</section>
			</div>
		</article>
	</div>
</section>
