export type AnnouncementItem = {
	enabled: boolean;
	type: 'info' | 'warning' | 'danger';
	title: string;
	message: string;
	link?: string;
};

export type NavItem = {
	title: string;
	href?: string;
	disabled?: boolean;
};

export type NavItemWithChildren = NavItem & {
	items: NavItemWithChildren[];
};

export type HeaderNavItem = NavItem & {
	items?: NavItem[];
};

export type FooterNavItem = NavItem & {
	items?: NavItem[];
};

interface NavigationConfig {
	announcement: AnnouncementItem;
	mainNav: HeaderNavItem[];
	footerNav: FooterNavItem[];
}

export const navigationConfig: NavigationConfig = {
	announcement: {
		enabled: true,
		type: 'warning',
		title: 'Warning!',
		message: 'Horizon is a prototype and is not ready for production use.',
		link: '/transmissions/introducing-horizon'
	},
	mainNav: [
		{
			title: 'About',
			items: [
				{
					title: 'Company',
					href: '/about/company'
				},
				{
					title: 'Status',
					href: 'https://status.mostlywhat.com'
				},
				{
					title: 'Blog',
					href: '/blog'
				},
				{
					title: 'Careers',
					href: '/careers'
				},
				{
					title: 'Contact',
					href: '/contact'
				}
			]
		},
		{
			title: 'Design',
			items: [
				{
					title: 'Trajectory',
					href: '/docs'
				},
				{
					title: 'ETA',
					href: '/docs/eta'
				},
				{
					title: 'Elevation',
					href: '/docs/elevation'
				},
				{
					title: 'Typography',
					href: '/docs/typography'
				},
				{
					title: 'Color',
					href: '/docs/color'
				},
				{
					title: 'Iconography',
					href: '/docs/iconography'
				},
				{
					title: 'Illustrations',
					href: '/docs/illustrations'
				}
			]
		},
		{
			title: 'Develop',
			items: [
				{
					title: 'Introduction',
					href: '/docs'
				},
				{
					title: 'Installation',
					href: '/docs/installation'
				},
				{
					title: 'components.json',
					href: '/docs/components-json'
				},
				{
					title: 'Theming',
					href: '/docs/theming'
				},
				{
					title: 'Dark mode',
					href: '/docs/dark-mode'
				},
				{
					title: 'CLI',
					href: '/docs/cli'
				},
				{
					title: 'Typography',
					href: '/docs/typography'
				}
			]
		}
	],
	footerNav: [
		{
			title: 'Navigation',
			items: [
				{
					title: 'About',
					href: '/about'
				},
				{
					title: 'Products',
					href: '/products'
				},
				{
					title: 'Services',
					href: '/services'
				},
				{
					title: 'Projects',
					href: '/projects'
				},
				{
					title: 'News',
					href: '/news'
				},
				{
					title: 'Careers',
					href: '/careers'
				}
			]
		},
		{
			title: 'Connect',
			items: [
				{
					title: 'Email',
					href: '/email'
				},
				{
					title: 'Twitter / X',
					href: 'https://www.x.com/mostlywhat'
				},
				{
					title: 'GitHub',
					href: 'https://www.github.com/mostlywhat'
				},
				{
					title: 'Discord',
					href: 'https://discord.gg/mostlywhat'
				}
			]
		},
		{
			title: 'Legal',
			items: [
				{
					title: 'Privacy Policy',
					href: '/legal/privacy-policy'
				},
				{
					title: 'Terms and Conditions',
					href: '/legal/terms-and-conditions'
				},
				{
					title: 'Cookie Policy',
					href: '/legal/cookie-policy'
				},
				{
					title: 'Accessibility Statement',
					href: '/legal/accessibility-statement'
				}
			]
		}
	]
};
