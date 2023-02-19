import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
	links: [
		{
			text: 'Company',
			links: [
				{
					text: 'About',
					href: getPermalink('/about'),
				},
				{
					text: 'Design',
					href: getPermalink('/design'),
				},
				{
					text: 'Principles',
					href: getPermalink('/principles'),
				},
				{
					text: 'Projects',
					href: getPermalink('/projects'),
				},
				{
					text: 'Partners',
					href: getPermalink('/partners'),
				},
			],
		},
		{
			text: 'Navigation',
			links: [
				{
					text: 'Products',
					href: getPermalink('/products'),
				},
				{
					text: 'Services',
					href: getPermalink('/services'),
				},
				{
					text: 'Legal',
					href: getPermalink('/legal'),
				},
			],
		},
		{
			text: 'Transmissions',
			href: getBlogPermalink(),
		},
		{
			text: 'Contact',
			href: getPermalink('/contact'),
		},
	],
	// actions: [{ type: 'button', text: 'Contact', href: getPermalink('/contact') }],
};

export const footerData = {
	links: [
		{
			title: 'Projects',
			links: [
				{ text: 'Features', href: '#' },
				{ text: 'Security', href: '#' },
				{ text: 'Team', href: '#' },
				{ text: 'Enterprise', href: '#' },
				{ text: 'Customer stories', href: '#' },
				{ text: 'Pricing', href: '#' },
				{ text: 'Resources', href: '#' },
			],
		},
		{
			title: 'Products',
			links: [
				{ text: 'Developer API', href: '#' },
				{ text: 'Partners', href: '#' },
				{ text: 'Atom', href: '#' },
				{ text: 'Electron', href: '#' },
				{ text: 'AstroWind Desktop', href: '#' },
			],
		},
		{
			title: 'Support',
			links: [
				{ text: 'Docs', href: '#' },
				{ text: 'Community Forum', href: '#' },
				{ text: 'Professional Services', href: '#' },
				{ text: 'Skills', href: '#' },
				{ text: 'Status', href: '#' },
			],
		},
		{
			title: 'Company',
			links: [
				{ text: 'About', href: '#' },
				{ text: 'Blog', href: '#' },
				{ text: 'Careers', href: '#' },
				{ text: 'Press', href: '#' },
				{ text: 'Inclusion', href: '#' },
				{ text: 'Social Impact', href: '#' },
				{ text: 'Shop', href: '#' },
			],
		},
	],
	secondaryLinks: [
		{ text: 'Terms', href: getPermalink('/terms') },
		{ text: 'Privacy Policy', href: getPermalink('/privacy') },
	],
	socialLinks: [
		{ ariaLabel: 'Twitter', icon: 'tabler:brand-twitter', href: '#' },
		{ ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
		{ ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
		{ ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
		{ ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/mostlywhat' },
	],
	footNote: '© Copyright 2018-' + new Date().getFullYear() + ' MostlyWhat Systems. All rights reserved.',
};
