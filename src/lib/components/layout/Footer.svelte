<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { Github, Twitter, Mail, ExternalLink } from '@lucide/svelte';

	const currentYear = new Date().getFullYear();

	const navigation = {
		company: [
			{ href: '/about', label: () => m.nav_about() },
			{ href: '/services', label: () => m.nav_services() },
			{ href: '/projects', label: () => m.nav_projects() },
			{ href: '/blog', label: () => m.nav_blog() },
			{ href: '/contact', label: () => m.nav_contact() }
		],
		legal: [
			{ href: '/legal/privacy', label: () => m.legal_privacy() },
			{ href: '/legal/terms', label: () => m.legal_terms() },
			{ href: '/legal/cookies', label: () => m.legal_cookies() }
		],
		resources: [
			{ href: '/docs', label: () => m.nav_docs() }
		]
	};

	const social = [
		{ href: 'https://github.com/mostlywhat', label: 'GitHub', icon: Github },
		{ href: 'https://x.com/mostlywhat', label: 'X (Twitter)', icon: Twitter },
		{ href: 'mailto:hello@mostlywhat.systems', label: 'Email', icon: Mail }
	];
</script>

<footer class="border-t border-border bg-card">
	<div class="mx-auto max-w-7xl px-4 py-16">
		<div class="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
			<!-- Brand -->
			<div class="lg:col-span-1">
				<div class="mb-4">
					<span class="font-display text-2xl tracking-wider text-primary">MOSTLYWHAT</span>
					<span class="font-ui ml-2 text-sm text-muted-foreground">SYSTEMS</span>
				</div>
				<p class="font-body mb-6 text-sm text-muted-foreground">
					{m.footer_tagline()}
				</p>
				<div class="flex gap-2">
					{#each social as { href, label, icon: Icon }}
						<a
							{href}
							target="_blank"
							rel="noopener noreferrer"
							class="flex h-10 w-10 items-center justify-center border border-border transition-colors hover:border-primary hover:text-primary"
							aria-label={label}
						>
							<Icon class="h-5 w-5" />
						</a>
					{/each}
				</div>
			</div>

			<!-- Navigation -->
			<div>
				<h3 class="font-ui mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
					{m.footer_navigation()}
				</h3>
				<ul class="space-y-2">
					{#each navigation.company as { href, label }}
						<li>
							<a
								{href}
								class="font-body text-sm text-muted-foreground transition-colors hover:text-primary"
							>
								{label()}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Resources -->
			<div>
				<h3 class="font-ui mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
					{m.footer_resources()}
				</h3>
				<ul class="space-y-2">
					{#each navigation.resources as { href, label }}
						<li>
							<a
								{href}
								class="font-body text-sm text-muted-foreground transition-colors hover:text-primary"
							>
								{label()}
							</a>
						</li>
					{/each}
				</ul>
			</div>

			<!-- Legal -->
			<div>
				<h3 class="font-ui mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
					{m.footer_legal()}
				</h3>
				<ul class="space-y-2">
					{#each navigation.legal as { href, label }}
						<li>
							<a
								{href}
								class="font-body text-sm text-muted-foreground transition-colors hover:text-primary"
							>
								{label()}
							</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Bottom bar -->
		<div class="mt-12 border-t border-border pt-8">
			<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
				<p class="font-body text-sm text-muted-foreground">
					© 2018-{currentYear} MostlyWhat Systems. {m.footer_rights()}
				</p>
				<p class="font-body text-xs text-muted-foreground">
					{m.footer_trademark()}
				</p>
			</div>
		</div>
	</div>
</footer>
