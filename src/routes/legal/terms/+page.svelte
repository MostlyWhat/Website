<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
</script>

<svelte:head>
	<title>{m.legal_terms()} — {m.site_name()}</title>
	<meta name="description" content="Terms of Service for MostlyWhat Systems" />
</svelte:head>

<!-- Hero Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background p-6 md:p-8 lg:col-span-8 lg:p-12" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LEGAL</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-5xl lg:text-6xl">
				{m.legal_terms()}
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
				<a href="#acceptance" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">01 — ACCEPTANCE</a>
				<a href="#services" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">02 — SERVICES</a>
				<a href="#ip" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">03 — INTELLECTUAL PROPERTY</a>
				<a href="#conduct" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">04 — USER CONDUCT</a>
				<a href="#warranty" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">05 — WARRANTIES</a>
				<a href="#liability" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">06 — LIABILITY</a>
				<a href="#contact" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">07 — CONTACT</a>
			</nav>
		</div>
		<article class="col-span-12 bg-background p-6 md:p-8 lg:col-span-9 lg:p-12" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="max-w-3xl space-y-8">
				<section id="acceptance">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">01 — ACCEPTANCE OF TERMS</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						By accessing and using this website, you accept and agree to be bound by the terms and 
						provisions of this agreement. If you do not agree to these terms, please do not use our website.
					</p>
				</section>

				<section id="services">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">02 — SERVICES</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						MostlyWhat Systems provides web design, development, and consulting services. The specific 
						terms of any engagement will be outlined in a separate agreement or statement of work.
					</p>
				</section>

				<section id="ip">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">03 — INTELLECTUAL PROPERTY</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						All content on this website, including text, graphics, logos, and code examples, is the 
						property of MostlyWhat Systems and is protected by intellectual property laws.
					</p>
				</section>

				<section id="conduct">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">04 — USER CONDUCT</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">You agree not to:</p>
					<ul class="font-body mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
						<li>Use the website for any unlawful purpose</li>
						<li>Attempt to gain unauthorized access to our systems</li>
						<li>Interfere with the proper functioning of the website</li>
						<li>Submit false or misleading information</li>
					</ul>
				</section>

				<section id="warranty">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">05 — DISCLAIMER OF WARRANTIES</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						This website is provided "as is" without any representations or warranties, express or 
						implied. We make no representations regarding the accuracy or suitability of the information.
					</p>
				</section>

				<section id="liability">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">06 — LIMITATION OF LIABILITY</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						MostlyWhat Systems shall not be liable for any indirect, incidental, special, consequential, 
						or punitive damages arising out of your use of this website.
					</p>
				</section>

				<section id="contact">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">07 — CONTACT</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						For questions about these Terms of Service, please contact us at 
						<a href="mailto:legal@mostlywhat.systems" class="text-primary hover:underline">legal@mostlywhat.systems</a>.
					</p>
				</section>
			</div>
		</article>
	</div>
</section>
