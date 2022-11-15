export const SITE = {
	name: 'MostlyWhat Systems',

	origin: 'https://www.mostlywhat.systems',
	basePathname: '/',
	trailingSlash: false,

	title: 'MostlyWhat Systems — Design, Develop, Deploy.',
	description: "🚀 Hi I'm MostlyWhat! I am a Freelancer Developer and a Minimalist Designer currently based in Thailand.",

	googleAnalyticsId: "G-JWPBL12SNZ", // or "G-XXXXXXXXXX",
	googleSiteVerificationId: 'orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M',
};

export const BLOG = {
	disabled: false,
	postsPerPage: 4,

	blog: {
		disabled: false,
		pathname: 'blog', // blog main path, you can change this to "articles" (/articles)
	},

	post: {
		disabled: false,
		pathname: 'blog', // empty for /some-post, value for /pathname/some-post
	},

	category: {
		disabled: false,
		pathname: 'category', // set empty to change from /category/some-category to /some-category
	},

	tag: {
		disabled: false,
		pathname: 'tag', // set empty to change from /tag/some-tag to /some-tag
	},
};
