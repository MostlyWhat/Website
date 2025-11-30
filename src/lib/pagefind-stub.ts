/**
 * Pagefind Development Stub
 * 
 * This module provides a mock implementation of Pagefind for development mode.
 * In production, the actual Pagefind library is loaded from /pagefind/pagefind.js
 * which is generated during the build process.
 */

interface PagefindResultData {
    url: string;
    content: string;
    word_count: number;
    excerpt: string;
    meta: {
        title?: string;
        image?: string;
        [key: string]: string | undefined;
    };
}

interface PagefindResult {
    id: string;
    data: () => Promise<PagefindResultData>;
}

interface PagefindSearchResponse {
    results: PagefindResult[];
}

// Sample mock data for development testing
const mockArticles: PagefindResultData[] = [
    {
        url: '/support/getting-started',
        content: 'Getting started with MostlyWhat. Learn how to set up your project and begin development.',
        word_count: 200,
        excerpt: 'Getting started with MostlyWhat. Learn how to set up your project...',
        meta: { title: '[DEV] Getting Started Guide' }
    },
    {
        url: '/support/troubleshooting',
        content: 'Common troubleshooting steps for resolving issues. Debug and fix problems quickly.',
        word_count: 150,
        excerpt: 'Common troubleshooting steps for resolving issues...',
        meta: { title: '[DEV] Troubleshooting Guide' }
    },
    {
        url: '/blog/web-development-tips',
        content: 'Web development tips and best practices. Modern techniques for building fast websites.',
        word_count: 300,
        excerpt: 'Web development tips and best practices. Modern techniques...',
        meta: { title: '[DEV] Web Development Tips' }
    },
    {
        url: '/projects/sample-project',
        content: 'Sample project showcasing our development capabilities and design expertise.',
        word_count: 250,
        excerpt: 'Sample project showcasing our development capabilities...',
        meta: { title: '[DEV] Sample Project' }
    },
    {
        url: '/services/web-design',
        content: 'Professional web design services. Custom websites tailored to your business needs.',
        word_count: 180,
        excerpt: 'Professional web design services. Custom websites tailored...',
        meta: { title: '[DEV] Web Design Services' }
    }
];

/**
 * Mock Pagefind implementation for development
 */
export const pagefindStub = {
    async init(): Promise<void> {
        console.log('[Pagefind Stub] Initialized in development mode');
    },

    async search(query: string): Promise<PagefindSearchResponse> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 200));

        if (!query.trim()) {
            return { results: [] };
        }

        const searchTerms = query.toLowerCase().split(/\s+/);

        // Filter articles that match any search term
        const matchingArticles = mockArticles.filter(article => {
            const searchableText = `${article.meta.title} ${article.content}`.toLowerCase();
            return searchTerms.some(term => searchableText.includes(term));
        });

        // Create results with highlighted excerpts
        const results = matchingArticles.map((article, index) => ({
            id: `dev-${index}`,
            data: async () => {
                // Highlight matching terms in excerpt
                let excerpt = article.excerpt;
                searchTerms.forEach(term => {
                    const regex = new RegExp(`(${term})`, 'gi');
                    excerpt = excerpt.replace(regex, '<mark>$1</mark>');
                });
                return { ...article, excerpt };
            }
        }));

        console.log(`[Pagefind Stub] Search "${query}" → ${results.length} results`);
        return { results };
    }
};

export type Pagefind = typeof pagefindStub;