<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { scrollAnimate } from '$lib/actions/scroll-animate';
	import Section from '$lib/components/layout/Section.svelte';
</script>

<svelte:head>
	<title>{m.legal_cookies()} — {m.site_name()}</title>
	<meta name="description" content="Cookie Policy for MostlyWhat Systems" />
</svelte:head>

<Section padding="xl">
	<div class="mx-auto max-w-3xl" use:scrollAnimate={{ animation: 'fade', startVisible: true }}>
		<p class="font-ui mb-2 text-sm uppercase tracking-wider text-primary">Legal</p>
		<h1 class="vt-title mb-6 text-4xl md:text-5xl">{m.legal_cookies()}</h1>
		<p class="font-body text-muted-foreground">Last updated: January 2024</p>
	</div>
</Section>

<Section>
	<article class="prose-custom mx-auto max-w-3xl" use:scrollAnimate={{ animation: 'fade' }}>
		<h2>What Are Cookies?</h2>
		<p>
			Cookies are small text files that are placed on your device when you visit a website. 
			They are widely used to make websites work more efficiently and provide information 
			to the owners of the site.
		</p>

		<h2>How We Use Cookies</h2>
		<p>We use cookies for the following purposes:</p>

		<h3>Essential Cookies</h3>
		<p>
			These cookies are necessary for the website to function properly. They enable core 
			functionality such as security, network management, and accessibility. You cannot 
			opt out of these cookies.
		</p>

		<h3>Analytics Cookies</h3>
		<p>
			We use analytics cookies to understand how visitors interact with our website. This 
			helps us improve our website and provide a better user experience.
		</p>

		<h3>Preference Cookies</h3>
		<p>
			These cookies remember your preferences, such as language settings, to provide a 
			more personalized experience.
		</p>

		<h2>Third-Party Cookies</h2>
		<p>
			Some cookies are placed by third-party services that appear on our pages. We do not 
			control the dissemination of these cookies. You should check the third-party websites 
			for more information about these cookies.
		</p>

		<h2>Managing Cookies</h2>
		<p>
			Most web browsers allow you to control cookies through their settings. You can 
			typically find these settings in the "Options" or "Preferences" menu of your browser. 
			You can:
		</p>
		<ul>
			<li>Delete all cookies</li>
			<li>Block all cookies</li>
			<li>Allow all cookies</li>
			<li>Block third-party cookies</li>
			<li>Clear all cookies when you close the browser</li>
		</ul>

		<h2>Impact of Disabling Cookies</h2>
		<p>
			If you disable cookies, some features of our website may not function properly. 
			You may not be able to access certain areas or features of our site.
		</p>

		<h2>Updates to This Policy</h2>
		<p>
			We may update this Cookie Policy from time to time to reflect changes in technology 
			or legislation. Any changes will be posted on this page.
		</p>

		<h2>Contact Us</h2>
		<p>
			If you have any questions about our use of cookies, please contact us at 
			<a href="mailto:privacy@mostlywhat.systems">privacy@mostlywhat.systems</a>.
		</p>
	</article>
</Section>
