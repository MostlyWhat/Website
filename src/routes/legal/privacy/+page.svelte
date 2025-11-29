<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
</script>

<svelte:head>
	<title>{m.legal_privacy()} — {m.site_name()}</title>
	<meta name="description" content="Privacy Policy for MostlyWhat Systems" />
</svelte:head>

<!-- Hero Section -->
<section class="border-b border-border">
	<div class="grid grid-cols-12 gap-px bg-border">
		<div class="col-span-12 bg-background p-6 md:p-8 lg:col-span-8 lg:p-12" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
			<span class="font-mono text-[10px] tracking-widest text-muted-foreground">LEGAL</span>
			<h1 class="font-display mt-4 text-4xl font-black uppercase leading-[0.9] tracking-tight md:text-5xl lg:text-6xl">
				{m.legal_privacy()}
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
				<a href="#information" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">01 — INFORMATION WE COLLECT</a>
				<a href="#usage" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">02 — HOW WE USE IT</a>
				<a href="#sharing" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">03 — INFORMATION SHARING</a>
				<a href="#security" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">04 — DATA SECURITY</a>
				<a href="#cookies" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">05 — COOKIES</a>
				<a href="#rights" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">06 — YOUR RIGHTS</a>
				<a href="#contact" class="font-ui block text-xs tracking-wider text-muted-foreground hover:text-primary">07 — CONTACT US</a>
			</nav>
		</div>
		<article class="col-span-12 bg-background p-6 md:p-8 lg:col-span-9 lg:p-12" use:scrollAnimate={{ animation: 'fade' }}>
			<div class="max-w-3xl space-y-8">
				<section id="information">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">01 — INFORMATION WE COLLECT</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						We collect information you provide directly to us, such as when you fill out a contact form, 
						request a consultation, or communicate with us via email.
					</p>
					<p class="font-body mt-3 text-sm text-muted-foreground">This information may include:</p>
					<ul class="font-body mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
						<li>Name and contact information</li>
						<li>Company name and role</li>
						<li>Project details and requirements</li>
						<li>Communication history</li>
					</ul>
				</section>

				<section id="usage">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">02 — HOW WE USE YOUR INFORMATION</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">We use the information we collect to:</p>
					<ul class="font-body mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
						<li>Respond to your inquiries and provide requested services</li>
						<li>Send you updates about projects and services</li>
						<li>Improve our website and services</li>
						<li>Comply with legal obligations</li>
					</ul>
				</section>

				<section id="sharing">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">03 — INFORMATION SHARING</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						We do not sell, trade, or otherwise transfer your personal information to third parties. 
						We may share information with trusted service providers who assist us in operating our website 
						and conducting our business, so long as they agree to keep this information confidential.
					</p>
				</section>

				<section id="security">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">04 — DATA SECURITY</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						We implement appropriate security measures to protect against unauthorized access, alteration, 
						disclosure, or destruction of your personal information.
					</p>
				</section>

				<section id="cookies">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">05 — COOKIES AND TRACKING</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						Our website may use cookies and similar tracking technologies to enhance your experience. 
						You can choose to disable cookies through your browser settings, though this may affect 
						some website functionality.
					</p>
				</section>

				<section id="rights">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">06 — YOUR RIGHTS</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">You have the right to:</p>
					<ul class="font-body mt-2 list-inside list-disc space-y-1 text-sm text-muted-foreground">
						<li>Access the personal information we hold about you</li>
						<li>Request correction of inaccurate information</li>
						<li>Request deletion of your information</li>
						<li>Opt out of marketing communications</li>
					</ul>
				</section>

				<section id="contact">
					<h2 class="font-ui text-sm font-semibold tracking-wider text-primary">07 — CONTACT US</h2>
					<p class="font-body mt-4 text-sm text-muted-foreground">
						If you have any questions about this Privacy Policy, please contact us at 
						<a href="mailto:privacy@mostlywhat.systems" class="text-primary hover:underline">privacy@mostlywhat.systems</a>.
					</p>
				</section>
			</div>
		</article>
	</div>
</section>
