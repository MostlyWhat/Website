<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Section from '$lib/components/layout/Section.svelte';
</script>

<svelte:head>
	<title>{m.legal_terms()} — {m.site_name()}</title>
	<meta name="description" content="Terms of Service for MostlyWhat Systems" />
</svelte:head>

<Section padding="xl">
	<div class="mx-auto max-w-3xl" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Legal</p>
		<h1 class="vt-title mb-6 text-4xl md:text-5xl">{m.legal_terms()}</h1>
		<p class="font-body text-muted-foreground">Last updated: January 2024</p>
	</div>
</Section>

<Section>
	<article class="prose-custom mx-auto max-w-3xl" use:scrollAnimate={{ animation: 'fade' }}>
		<h2>1. Acceptance of Terms</h2>
		<p>
			By accessing and using this website, you accept and agree to be bound by the terms and 
			provisions of this agreement. If you do not agree to these terms, please do not use our website.
		</p>

		<h2>2. Services</h2>
		<p>
			MostlyWhat Systems provides web design, development, and consulting services. The specific 
			terms of any engagement will be outlined in a separate agreement or statement of work.
		</p>

		<h2>3. Intellectual Property</h2>
		<p>
			All content on this website, including text, graphics, logos, and code examples, is the 
			property of MostlyWhat Systems and is protected by intellectual property laws. You may 
			not reproduce, distribute, or create derivative works without express written permission.
		</p>

		<h2>4. User Conduct</h2>
		<p>You agree not to:</p>
		<ul>
			<li>Use the website for any unlawful purpose</li>
			<li>Attempt to gain unauthorized access to our systems</li>
			<li>Interfere with the proper functioning of the website</li>
			<li>Submit false or misleading information</li>
		</ul>

		<h2>5. Disclaimer of Warranties</h2>
		<p>
			This website is provided "as is" without any representations or warranties, express or 
			implied. We make no representations or warranties regarding the accuracy, completeness, 
			or suitability of the information contained on this website.
		</p>

		<h2>6. Limitation of Liability</h2>
		<p>
			MostlyWhat Systems shall not be liable for any indirect, incidental, special, consequential, 
			or punitive damages arising out of your use of or inability to use this website.
		</p>

		<h2>7. External Links</h2>
		<p>
			Our website may contain links to third-party websites. We have no control over and assume 
			no responsibility for the content, privacy policies, or practices of any third-party websites.
		</p>

		<h2>8. Modifications</h2>
		<p>
			We reserve the right to modify these terms at any time. Your continued use of the website 
			following any changes indicates your acceptance of the new terms.
		</p>

		<h2>9. Governing Law</h2>
		<p>
			These terms shall be governed by and construed in accordance with applicable laws, 
			without regard to conflict of law principles.
		</p>

		<h2>10. Contact</h2>
		<p>
			For questions about these Terms of Service, please contact us at 
			<a href="mailto:legal@mostlywhat.systems">legal@mostlywhat.systems</a>.
		</p>
	</article>
</Section>
