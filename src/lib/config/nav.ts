// Core navigation item type
export type NavItem = {
	title: string;
	href?: string;
	disabled?: boolean;
	description?: string;
};

// Announcement configuration
export type AnnouncementConfig = {
	enabled: boolean;
	type: 'info' | 'warning' | 'danger';
	title: string;
	message: string;
	link?: string;
	linkText?: string;
};

// Main navigation types with layout options
export type MainNavLayout = 'grid' | 'cards' | 'featured' | 'list';

export type MainNavSubItem = NavItem & {
	image?: string;
	featured?: boolean;
};

export type MainNavItem = NavItem & {
	layout?: MainNavLayout;
	items?: MainNavSubItem[];
};

// Footer navigation section
export type FooterNavSection = {
	title: string;
	items: NavItem[];
};

// Announcement configuration
export const announcementConfig: AnnouncementConfig = {
	enabled: true,
	type: 'warning',
	title: 'Warning!',
	message: 'Horizon is a prototype and is not ready for production use.',
	link: '/transmissions/introducing-horizon',
	linkText: 'Learn more'
};

// Main navigation configuration
export const mainNavConfig: MainNavItem[] = [
	{
		title: 'About',
		layout: 'grid',
		items: [
			{
				title: 'Company',
				href: '/about/company',
				description: 'Learn about our mission and values'
			},
			{
				title: 'Status',
				href: 'https://status.mostlywhat.com',
				description: 'Check our system status'
			},
			{
				title: 'Blog',
				href: '/blog',
				description: 'Read our latest updates'
			},
			{
				title: 'Careers',
				href: '/careers',
				description: 'Join our growing team'
			},
			{
				title: 'Contact',
				href: '/contact',
				description: 'Get in touch with us'
			}
		]
	},
	{
		title: 'Products',
		layout: 'featured',
		items: [
			{
				title: 'Horizon',
				href: '/products/horizon',
				description: 'Our flagship development platform',
				featured: true
			},
			{
				title: 'Horizon CLI',
				href: '/products/horizon-cli',
				description: 'Command line interface for Horizon'
			},
			{
				title: 'Horizon SDK',
				href: '/products/horizon-sdk',
				description: 'Developer toolkit for integration'
			}
		]
	},
	{
		title: 'Services',
		layout: 'cards',
		items: [
			{
				title: 'Consulting',
				href: '/services/consulting',
				description: 'Expert guidance and strategy'
			},
			{
				title: 'Support',
				href: '/services/support',
				description: '24/7 technical assistance'
			},
			{
				title: 'Training',
				href: '/services/training',
				description: 'Workshops and certification'
			}
		]
	},
	{
		title: 'Projects',
		layout: 'list',
		items: [
			{
				title: 'Clients',
				href: '/projects/clients',
				description: 'Our work with clients'
			},
			{
				title: 'Open Source',
				href: '/projects/open-source',
				description: 'Our contributions to the community'
			},
			{
				title: 'Community',
				href: '/projects/community',
				description: 'Join our developer network'
			}
		]
	}
];

// Footer navigation configuration
export const footerNavConfig: FooterNavSection[] = [
	{
		title: 'Navigation',
		items: [
			{ title: 'About', href: '/about' },
			{ title: 'Products', href: '/products' },
			{ title: 'Services', href: '/services' },
			{ title: 'Projects', href: '/projects' },
			{ title: 'News', href: '/news' },
			{ title: 'Careers', href: '/careers' }
		]
	},
	{
		title: 'Connect',
		items: [
			{ title: 'Email', href: '/email' },
			{ title: 'Twitter / X', href: 'https://www.x.com/mostlywhat' },
			{ title: 'GitHub', href: 'https://www.github.com/mostlywhat' },
			{ title: 'Discord', href: 'https://discord.gg/mostlywhat' }
		]
	},
	{
		title: 'Legal',
		items: [
			{ title: 'Privacy Policy', href: '/legal/privacy-policy' },
			{ title: 'Terms and Conditions', href: '/legal/terms-and-conditions' },
			{ title: 'Cookie Policy', href: '/legal/cookie-policy' },
			{ title: 'Accessibility Statement', href: '/legal/accessibility-statement' }
		]
	}
];

// For backward compatibility
export const navigationConfig = {
	announcement: announcementConfig,
	mainNav: mainNavConfig,
	footerNav: footerNavConfig
};
