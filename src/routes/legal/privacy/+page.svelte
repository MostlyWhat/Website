<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Section from '$lib/components/layout/Section.svelte';
</script>

<svelte:head>
	<title>{m.legal_privacy()} — {m.site_name()}</title>
	<meta name="description" content="Privacy Policy for MostlyWhat Systems" />
</svelte:head>

<Section padding="xl">
	<div class="mx-auto max-w-3xl" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Legal</p>
		<h1 class="vt-title mb-6 text-4xl md:text-5xl">{m.legal_privacy()}</h1>
		<p class="font-body text-muted-foreground">Last updated: January 2024</p>
	</div>
</Section>

<Section>
	<article class="prose-custom mx-auto max-w-3xl" use:scrollAnimate={{ animation: 'fade' }}>
		<h2>1. Information We Collect</h2>
		<p>
			We collect information you provide directly to us, such as when you fill out a contact form, 
			request a consultation, or communicate with us via email.
		</p>
		<p>This information may include:</p>
		<ul>
			<li>Name and contact information</li>
			<li>Company name and role</li>
			<li>Project details and requirements</li>
			<li>Communication history</li>
		</ul>

		<h2>2. How We Use Your Information</h2>
		<p>We use the information we collect to:</p>
		<ul>
			<li>Respond to your inquiries and provide requested services</li>
			<li>Send you updates about projects and services</li>
			<li>Improve our website and services</li>
			<li>Comply with legal obligations</li>
		</ul>

		<h2>3. Information Sharing</h2>
		<p>
			We do not sell, trade, or otherwise transfer your personal information to third parties. 
			We may share information with trusted service providers who assist us in operating our website 
			and conducting our business, so long as they agree to keep this information confidential.
		</p>

		<h2>4. Data Security</h2>
		<p>
			We implement appropriate security measures to protect against unauthorized access, alteration, 
			disclosure, or destruction of your personal information.
		</p>

		<h2>5. Cookies and Tracking</h2>
		<p>
			Our website may use cookies and similar tracking technologies to enhance your experience. 
			You can choose to disable cookies through your browser settings, though this may affect 
			some website functionality.
		</p>

		<h2>6. Your Rights</h2>
		<p>You have the right to:</p>
		<ul>
			<li>Access the personal information we hold about you</li>
			<li>Request correction of inaccurate information</li>
			<li>Request deletion of your information</li>
			<li>Opt out of marketing communications</li>
		</ul>

		<h2>7. Contact Us</h2>
		<p>
			If you have any questions about this Privacy Policy, please contact us at 
			<a href="mailto:privacy@mostlywhat.systems">privacy@mostlywhat.systems</a>.
		</p>
	</article>
</Section>
