import { z, defineCollection } from 'astro:content';

const post = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		image: z.string().optional(),

		canonical: z.string().url().optional(),

		publishDate: z.date().or(z.string()).optional(),
		draft: z.boolean().optional(),

		excerpt: z.string().optional(),
		category: z.string().optional(),
		tags: z.array(z.string()).optional(),
		author: z.string().optional(),
	}),
});

const legal = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		image: z.string().optional(),

		canonical: z.string().url().optional(),

		publishDate: z.date().or(z.string()).optional(),
		draft: z.boolean().optional(),

		excerpt: z.string().optional(),
		category: z.string().optional(),
		tags: z.array(z.string()).optional(),
		author: z.string().optional(),
	}),
});

const products = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		image: z.string().optional(),

		canonical: z.string().url().optional(),

		publishDate: z.date().or(z.string()).optional(),
		draft: z.boolean().optional(),

		excerpt: z.string().optional(),
		category: z.string().optional(),
		tags: z.array(z.string()).optional(),
		author: z.string().optional(),
	}),
});

const projects = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		image: z.string().optional(),

		canonical: z.string().url().optional(),

		publishDate: z.date().or(z.string()).optional(),
		draft: z.boolean().optional(),

		excerpt: z.string().optional(),
		category: z.string().optional(),
		tags: z.array(z.string()).optional(),
		author: z.string().optional(),
	}),
});

const services = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		image: z.string().optional(),

		canonical: z.string().url().optional(),

		publishDate: z.date().or(z.string()).optional(),
		draft: z.boolean().optional(),

		excerpt: z.string().optional(),
		category: z.string().optional(),
		tags: z.array(z.string()).optional(),
		author: z.string().optional(),
	}),
});

export const collections = {
	post: post,
	legal: legal,
	products: products,
	services: services,
	projects: projects,
};
