import type { PageServerLoad } from './$types';
import { parseFrontmatter, extractSlugFromPath } from '$lib/utils/markdown';
import { CachePresets, setCacheHeaders } from '$lib/server/utils/cache';

interface SupportArticle {
    slug: string;
    title: string;
    category: string;
    summary: string;
    order: number;
}

const articleFiles = import.meta.glob('/src/lib/content/support/*.md', { eager: true, query: '?raw', import: 'default' });

function parseArticle(raw: string, slug: string): SupportArticle {
    const { frontmatter } = parseFrontmatter(raw);
    return {
        slug: (frontmatter.slug as string) || slug,
        title: (frontmatter.title as string) || 'Untitled',
        category: (frontmatter.category as string) || 'general',
        summary: (frontmatter.summary as string) || '',
        order: (frontmatter.order as number) || 99
    };
}

export const load: PageServerLoad = async ({ setHeaders }) => {
    // Set cache headers for support articles (10min cache, content rarely changes)
    setCacheHeaders(setHeaders, CachePresets.STATIC_LONG);

    const articles = Object.entries(articleFiles)
        .map(([path, raw]) => {
            const slug = extractSlugFromPath(path);
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
