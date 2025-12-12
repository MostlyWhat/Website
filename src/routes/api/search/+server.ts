import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { parseFrontmatter, extractSlugFromPath, generateExcerpt } from '$lib/utils/markdown';
import { siteConfig } from '$lib/config/site';
import { rateLimiters, getClientIP } from '$lib/server/utils/rate-limiter';
import { searchSchema } from '$lib/server/utils/validation';

// Content index - built at startup
interface ContentItem {
    title: string;
    slug: string;
    url: string;
    category: string;
    excerpt: string;
    content: string;
    type: 'support' | 'blog' | 'project' | 'service' | 'career' | 'legal' | 'page';
    keywords: string[];
}

// Static pages that should be searchable
const staticPages: ContentItem[] = [
    {
        title: 'Home',
        slug: 'home',
        url: '/',
        category: 'Page',
        excerpt: 'MostlyWhat Systems - Digital products that work. We build software solutions that scale.',
        content: 'mostlywhat systems home digital products software solutions development engineering design',
        type: 'page',
        keywords: ['home', 'mostlywhat', 'systems', 'digital', 'products']
    },
    {
        title: 'About',
        slug: 'about',
        url: '/about',
        category: 'Page',
        excerpt: 'Learn about MostlyWhat Systems - our team, mission, and values.',
        content: 'about us team mission values company culture who we are mostlywhat systems engineering design development',
        type: 'page',
        keywords: ['about', 'team', 'mission', 'values', 'company']
    },
    {
        title: 'Contact',
        slug: 'contact',
        url: '/contact',
        category: 'Page',
        excerpt: 'Get in touch with MostlyWhat Systems. Start a project or ask us anything.',
        content: `contact us get in touch start a project email ${siteConfig.emails.hello} reach out inquiry`,
        type: 'page',
        keywords: ['contact', 'email', 'reach', 'project', 'inquiry']
    },
    {
        title: 'Services',
        slug: 'services',
        url: '/services',
        category: 'Page',
        excerpt: 'Our services - web development, mobile apps, UI/UX design, and more.',
        content: 'services web development mobile apps ui ux design consulting engineering software development',
        type: 'page',
        keywords: ['services', 'development', 'design', 'consulting', 'engineering']
    },
    {
        title: 'Projects',
        slug: 'projects',
        url: '/projects',
        category: 'Page',
        excerpt: 'Our portfolio of work - case studies and projects we\'ve built.',
        content: 'projects portfolio case studies work samples clients showcase',
        type: 'page',
        keywords: ['projects', 'portfolio', 'case studies', 'work']
    },
    {
        title: 'Blog',
        slug: 'blog',
        url: '/blog',
        category: 'Page',
        excerpt: 'Insights, tutorials, and updates from the MostlyWhat Systems team.',
        content: 'blog articles posts insights tutorials engineering design updates news',
        type: 'page',
        keywords: ['blog', 'articles', 'insights', 'tutorials']
    },
    {
        title: 'Careers',
        slug: 'careers',
        url: '/careers',
        category: 'Page',
        excerpt: 'Join our team - open positions and career opportunities at MostlyWhat Systems.',
        content: 'careers jobs positions hiring work with us join team opportunities employment',
        type: 'page',
        keywords: ['careers', 'jobs', 'hiring', 'positions', 'opportunities']
    },
    {
        title: 'Support',
        slug: 'support',
        url: '/support',
        category: 'Page',
        excerpt: 'Help center and support resources for MostlyWhat Systems products.',
        content: 'support help center faq troubleshooting documentation guides articles',
        type: 'page',
        keywords: ['support', 'help', 'faq', 'documentation']
    },
    {
        title: 'Legal',
        slug: 'legal',
        url: '/legal',
        category: 'Page',
        excerpt: 'Legal documents - Privacy Policy, Terms of Service, Cookie Policy, and EULA.',
        content: 'legal privacy policy terms of service cookies eula agreement documents policies',
        type: 'page',
        keywords: ['legal', 'privacy', 'terms', 'cookies', 'eula', 'policy']
    },
    {
        title: 'Status',
        slug: 'status',
        url: '/status',
        category: 'Page',
        excerpt: 'System status and uptime monitoring for MostlyWhat Systems services.',
        content: 'status uptime monitoring systems services operational incidents',
        type: 'page',
        keywords: ['status', 'uptime', 'monitoring', 'operational']
    }
];

// Import all markdown files at build time
const supportFiles = import.meta.glob('/src/lib/content/support/*.md', { query: '?raw', import: 'default', eager: true });
const blogFiles = import.meta.glob('/src/lib/content/blog/*.md', { query: '?raw', import: 'default', eager: true });
const projectFiles = import.meta.glob('/src/lib/content/projects/*.md', { query: '?raw', import: 'default', eager: true });
const serviceFiles = import.meta.glob('/src/lib/content/services/*.md', { query: '?raw', import: 'default', eager: true });
const careerFiles = import.meta.glob('/src/lib/content/careers/*.md', { query: '?raw', import: 'default', eager: true });
const legalFiles = import.meta.glob('/src/lib/content/legal/*.md', { query: '?raw', import: 'default', eager: true });

function parseMarkdownFiles(
    files: Record<string, unknown>,
    type: ContentItem['type'],
    baseUrl: string
): ContentItem[] {
    return Object.entries(files).map(([path, raw]) => {
        const content = raw as string;
        const { frontmatter, body } = parseFrontmatter(content);

        // Extract slug from path or frontmatter
        const pathSlug = extractSlugFromPath(path);
        const slug = (frontmatter.slug as string) || pathSlug;

        // Generate excerpt from content using shared utility
        const plainContent = generateExcerpt(body, 10000); // Get full plain text for searching
        const excerpt = (frontmatter.excerpt as string) || (frontmatter.summary as string) || generateExcerpt(body, 200);

        // Extract keywords from tags, category, and title
        const tags = (frontmatter.tags as string[]) || [];
        const title = (frontmatter.title as string) || '';
        const category = (frontmatter.category as string) || '';

        const keywords: string[] = [
            ...tags,
            category,
            ...title.toLowerCase().split(/\s+/)
        ].filter(Boolean);

        return {
            title: title || slug,
            slug,
            url: `${baseUrl}/${slug}`,
            category: category || type,
            excerpt,
            content: plainContent.toLowerCase(),
            type,
            keywords: keywords.map(k => k.toLowerCase())
        };
    });
}

// Build the content index
function buildIndex(): ContentItem[] {
    const items: ContentItem[] = [
        ...staticPages,
        ...parseMarkdownFiles(supportFiles, 'support', '/support'),
        ...parseMarkdownFiles(blogFiles, 'blog', '/blog'),
        ...parseMarkdownFiles(projectFiles, 'project', '/projects'),
        ...parseMarkdownFiles(serviceFiles, 'service', '/services'),
        ...parseMarkdownFiles(careerFiles, 'career', '/careers'),
        ...parseMarkdownFiles(legalFiles, 'legal', '/legal'),
    ];

    return items;
}

const contentIndex = buildIndex();

// Search function
function search(query: string, filter?: string, limit = 20): Array<{
    title: string;
    excerpt: string;
    url: string;
    type: string;
    score: number;
}> {
    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);

    const results = contentIndex
        .map(item => {
            let score = 0;

            // Title match (highest weight)
            const titleLower = item.title.toLowerCase();
            for (const term of searchTerms) {
                if (titleLower.includes(term)) score += 10;
                if (titleLower === term) score += 20;
            }

            // Keyword match
            for (const term of searchTerms) {
                if (item.keywords.some(k => k.includes(term))) score += 5;
            }

            // Content match
            for (const term of searchTerms) {
                const regex = new RegExp(term, 'gi');
                const matches = item.content.match(regex);
                if (matches) score += matches.length;
            }

            return { ...item, score };
        })
        .filter(item => item.score > 0)
        .filter(item => {
            if (!filter || filter === 'all') return true;
            if (filter === 'support') return item.type === 'support';
            if (filter === 'projects') return item.type === 'project';
            if (filter === 'blog') return ['blog', 'service', 'legal'].includes(item.type);
            return true;
        })
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);

    // Generate excerpt with highlighted search terms
    return results.map(item => {
        let excerpt = item.excerpt;

        // Try to find a snippet around the search term
        for (const term of searchTerms) {
            const idx = item.content.indexOf(term);
            if (idx !== -1) {
                const start = Math.max(0, idx - 50);
                const end = Math.min(item.content.length, idx + 100);
                let snippet = item.content.slice(start, end);

                // Add ellipsis if not at start/end
                if (start > 0) snippet = '...' + snippet;
                if (end < item.content.length) snippet = snippet + '...';

                // Highlight the term
                snippet = snippet.replace(
                    new RegExp(`(${term})`, 'gi'),
                    '<mark>$1</mark>'
                );

                excerpt = snippet;
                break;
            }
        }

        return {
            title: item.title,
            excerpt,
            url: item.url,
            type: item.type,
            score: item.score
        };
    });
}

export const GET: RequestHandler = async ({ url, request }) => {
    // Rate limiting - 30 searches per minute per IP
    const clientIP = getClientIP(request, request.headers);
    const rateLimitResult = await rateLimiters.search.check(clientIP);

    if (!rateLimitResult.success) {
        const resetInSeconds = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
        error(429, `Too many search requests. Please try again in ${resetInSeconds} seconds.`);
    }

    // Validate and parse query parameters
    const params = {
        query: url.searchParams.get('q') || '',
        type: url.searchParams.get('filter') || 'all',
        limit: parseInt(url.searchParams.get('limit') || '20', 10)
    };

    // Validate input
    const validation = searchSchema.safeParse(params);
    if (!validation.success) {
        const errorMessages = validation.error.issues.map((issue: { message: string }) => issue.message).join(', ');
        error(400, `Invalid search parameters: ${errorMessages}`);
    }

    const { query, type, limit } = validation.data;
    const filter = type === 'all' ? 'all' : type;
    const results = search(query, filter, limit);

    return json({
        query,
        results,
        total: results.length
    });
};
