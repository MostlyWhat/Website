import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { parseFrontmatter, extractSections, extractSlugFromPath } from '$lib/utils/markdown';

interface Section {
    id: string;
    title: string;
}

interface SupportArticle {
    slug: string;
    title: string;
    category: string;
    summary: string;
    order: number;
    content: string;
    sections: Section[];
}

const articleFiles = import.meta.glob('/src/lib/content/support/*.md', { eager: true, query: '?raw', import: 'default' });

function parseArticle(raw: string, slug: string): SupportArticle {
    const { frontmatter, body } = parseFrontmatter(raw);
    // Extract sections using shared utility (returns ContentSection with id, number, title)
    const sections = extractSections(body).map(s => ({ id: s.id, title: s.title }));
    
    return {
        slug: (frontmatter.slug as string) || slug,
        title: (frontmatter.title as string) || 'Untitled',
        category: (frontmatter.category as string) || 'general',
        summary: (frontmatter.summary as string) || '',
        order: (frontmatter.order as number) || 99,
        content: body.trim(),
        sections
    };
}

export const load: PageServerLoad = async ({ params }) => {
    const { slug } = params;

    // Find the matching article
    const filePath = `/src/lib/content/support/${slug}.md`;
    const rawContent = articleFiles[filePath] as string | undefined;

    if (!rawContent) {
        throw error(404, 'Article not found');
    }

    const article = parseArticle(rawContent, slug);

    // Get all articles for navigation
    const allArticles = Object.entries(articleFiles)
        .map(([path, raw]) => {
            const fileSlug = extractSlugFromPath(path);
            return parseArticle(raw as string, fileSlug);
        })
        .sort((a, b) => a.order - b.order);

    // Find prev/next articles
    const currentIndex = allArticles.findIndex(a => a.slug === slug);
    const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
    const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

    // Get related articles (same category)
    const relatedArticles = allArticles
        .filter(a => a.category === article.category && a.slug !== slug)
        .slice(0, 3);

    return {
        article,
        prevArticle,
        nextArticle,
        relatedArticles
    };
};
