import type { PageServerLoad } from './$types';
import matter from 'gray-matter';

interface SupportArticle {
	slug: string;
	title: string;
	category: string;
	summary: string;
	order: number;
}

const articleFiles = import.meta.glob('/src/content/support/*.md', { eager: true, query: '?raw', import: 'default' });

function parseArticle(raw: string, slug: string): SupportArticle {
	const { data } = matter(raw);
	return {
		slug: data.slug || slug,
		title: data.title || 'Untitled',
		category: data.category || 'general',
		summary: data.summary || '',
		order: data.order || 99
	};
}

export const load: PageServerLoad = async () => {
	const articles = Object.entries(articleFiles)
		.map(([path, raw]) => {
			const slug = path.split('/').pop()?.replace('.md', '') || '';
			return parseArticle(raw as string, slug);
		})
		.sort((a, b) => a.order - b.order);

	// Group by category
	const categorizedArticles = articles.reduce((acc, article) => {
		if (!acc[article.category]) {
			acc[article.category] = [];
		}
		acc[article.category].push(article);
		return acc;
	}, {} as Record<string, SupportArticle[]>);

	return {
		articles,
		categorizedArticles
	};
};
