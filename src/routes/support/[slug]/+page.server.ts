import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import matter from 'gray-matter';

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

const articleFiles = import.meta.glob('/src/content/support/*.md', { eager: true, query: '?raw', import: 'default' });

function extractSections(content: string): Section[] {
    const headingRegex = /^##\s+(.+)$/gm;
    const sections: Section[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const title = match[1].trim();
        const id = title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-');
        sections.push({ id, title });
    }

    return sections;
}

function parseArticle(raw: string, slug: string): SupportArticle {
    const { data, content } = matter(raw);
    return {
        slug: data.slug || slug,
        title: data.title || 'Untitled',
        category: data.category || 'general',
        summary: data.summary || '',
        order: data.order || 99,
        content: content.trim(),
        sections: extractSections(content)
    };
}

export const load: PageServerLoad = async ({ params }) => {
    const { slug } = params;

    // Find the matching article
    const filePath = `/src/content/support/${slug}.md`;
    const rawContent = articleFiles[filePath] as string | undefined;

    if (!rawContent) {
        throw error(404, 'Article not found');
    }

    const article = parseArticle(rawContent, slug);

    // Get all articles for navigation
    const allArticles = Object.entries(articleFiles)
        .map(([path, raw]) => {
            const fileSlug = path.split('/').pop()?.replace('.md', '') || '';
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
