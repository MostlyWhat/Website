import defaultImage from './assets/images/default.png';

const CONFIG = {
	name: 'MostlyWhat Systems',

	origin: 'https://www.mostlywhat.systems',
	basePathname: '/',
	trailingSlash: false,
	defaultImage: defaultImage,

	title: 'MostlyWhat Systems — Design, Develop, Deploy.',
	description:
		"🚀 Hi I'm MostlyWhat! I am a Freelancer Developer and a Minimalist Designer currently based in Thailand.",

	language: 'en',
	textDirection: 'ltr',

	dateFormatter: new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		timeZone: 'UTC',
	}),

	googleAnalyticsId: 'G-JWPBL12SNZ', // or "G-XXXXXXXXXX",
	googleSiteVerificationId: 'orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M',

	blog: {
		disabled: false,
		postsPerPage: 4,

		post: {
			permalink: '/transmissions/%year%/%month%/%day%/%slug%', // Variables: %slug%, %year%, %month%, %day%, %hour%, %minute%, %second%, %category%
			noindex: false,
			disabled: false,
		},

		list: {
			pathname: 'transmissions', // Blog main path, you can change this to "articles" (/articles)
			noindex: false,
			disabled: false,
		},

		category: {
			pathname: 'category', // Category main path /category/some-category
			noindex: true,
			disabled: false,
		},

		tag: {
			pathname: 'tag', // Tag main path /tag/some-tag
			noindex: true,
			disabled: false,
		},
	},
};

export const SITE = { ...CONFIG, blog: undefined };
export const BLOG = CONFIG.blog;
export const DATE_FORMATTER = CONFIG.dateFormatter;
