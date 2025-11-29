<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
	import { Github, Twitter, Mail, ArrowUpRight, type Icon } from '@lucide/svelte';

	const currentYear = new Date().getFullYear();

	interface NavLink {
		href: string;
		label: string;
	}

	interface SocialLink {
		href: string;
		label: string;
		fullLabel: string;
		icon: typeof Icon;
	}

	const navigation: { company: NavLink[]; resources: NavLink[]; legal: NavLink[] } = {
		company: [
			{ href: '/about', label: 'ABOUT' },
			{ href: '/services', label: 'SERVICES' },
			{ href: '/projects', label: 'PROJECTS' },
			{ href: '/blog', label: 'BLOG' },
			{ href: '/contact', label: 'CONTACT' }
		],
		resources: [
			{ href: '/docs', label: 'DOCS' },
			{ href: '/help', label: 'HELP CENTER' },
			{ href: '/support', label: 'SUPPORT' }
		],
		legal: [
			{ href: '/legal', label: 'ALL DOCUMENTS' },
			{ href: '/legal/privacy', label: 'PRIVACY' },
			{ href: '/legal/terms', label: 'TERMS' },
			{ href: '/legal/cookies', label: 'COOKIES' }
		]
	};

	const social: SocialLink[] = [
		{ href: 'https://github.com/mostlywhat', label: 'GH', fullLabel: 'GITHUB', icon: Github },
		{ href: 'https://x.com/mostlywhat', label: 'X', fullLabel: 'TWITTER', icon: Twitter },
		{ href: 'mailto:hello@mostlywhat.systems', label: 'EM', fullLabel: 'EMAIL', icon: Mail }
	];
</script>

<footer class="border-t border-border bg-background">
	<!-- Main Footer Grid - 12 column edge to edge -->
	<div class="grid grid-cols-12 gap-px bg-border">
		<!-- Brand Column - 3 cols -->
		<div class="col-span-12 bg-background px-6 py-8 md:col-span-6 md:px-12 lg:col-span-3 lg:px-16">
			<div class="flex items-center gap-2">
				<span class="font-display text-lg font-black tracking-wider text-primary">MOSTLYWHAT</span>
				<span class="font-display text-lg font-black tracking-wider text-foreground">SYSTEMS</span>
			</div>
			<p class="font-body mt-4 text-sm text-muted-foreground">
				{m.footer_tagline()}
			</p>
			
			<!-- Social Links -->
			<div class="mt-6 grid grid-cols-3 gap-px bg-border">
				{#each social as { href, label, fullLabel, icon: Icon } (label)}
					<a
						{href}
						target="_blank"
						rel="noopener noreferrer"
						class="group flex flex-col items-center gap-1 bg-card py-3 transition-colors hover:bg-primary/10"
						aria-label={fullLabel}
					>
						<Icon class="h-4 w-4 text-muted-foreground group-hover:text-primary" />
						<span class="font-mono text-[10px] tracking-wider text-muted-foreground group-hover:text-primary">{label}</span>
					</a>
				{/each}
			</div>
		</div>

		<!-- Navigation Columns - each 3 cols on desktop -->
		<div class="col-span-4 bg-background px-4 py-6 md:col-span-2 md:px-6 lg:col-span-3 lg:px-8">
			<h3 class="font-mono text-[10px] tracking-widest text-muted-foreground">NAVIGATE</h3>
			<ul class="mt-4 space-y-2">
				{#each navigation.company as { href, label } (href)}
					<li>
						<a
							href={localizeHref(href)}
							class="font-ui text-xs tracking-wider text-muted-foreground transition-colors hover:text-primary"
						>
							{label}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="col-span-4 bg-background px-4 py-6 md:col-span-2 md:px-6 lg:col-span-3 lg:px-8">
			<h3 class="font-mono text-[10px] tracking-widest text-muted-foreground">RESOURCES</h3>
			<ul class="mt-4 space-y-2">
				{#each navigation.resources as { href, label } (href)}
					<li>
						<a
							href={localizeHref(href)}
							class="font-ui text-xs tracking-wider text-muted-foreground transition-colors hover:text-primary"
						>
							{label}
						</a>
					</li>
				{/each}
			</ul>
		</div>

		<div class="col-span-4 bg-background px-4 py-6 md:col-span-2 md:px-6 lg:col-span-3 lg:px-8">
			<h3 class="font-mono text-[10px] tracking-widest text-muted-foreground">LEGAL</h3>
			<ul class="mt-4 space-y-2">
				{#each navigation.legal as { href, label } (href)}
					<li>
						<a
							href={localizeHref(href)}
							class="font-ui text-xs tracking-wider text-muted-foreground transition-colors hover:text-primary"
						>
							{label}
						</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<!-- Bottom Bar - 12 column -->
	<div class="grid grid-cols-12 gap-px border-t border-border bg-border">
		<div class="col-span-12 flex items-center justify-between bg-background px-6 py-4 md:px-12 lg:col-span-9 lg:px-16">
			<p class="font-mono text-[10px] tracking-wider text-muted-foreground">
				© 2018—{currentYear} MOSTLYWHAT SYSTEMS. {m.footer_rights().toUpperCase()}
			</p>
		</div>
		<div class="col-span-12 flex items-center justify-center bg-card px-6 py-4 lg:col-span-3">
			<a
				href={localizeHref('/contact')}
				class="font-ui flex items-center gap-2 text-xs tracking-widest text-primary transition-colors hover:text-primary/80"
			>
				START A PROJECT
				<ArrowUpRight class="h-3.5 w-3.5" />
			</a>
		</div>
	</div>
</footer>
