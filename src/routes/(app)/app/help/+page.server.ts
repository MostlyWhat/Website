import { createDb } from '$lib/server/db';
import { supportArticles } from '$lib/server/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || !locals.profile) {
        return { articles: [], categories: [] };
    }

    // Create per-request database connection
    const db = createDb();

    // Fetch published user-facing support articles
    let articles: Array<{
        id: string;
        slug: string;
        title: string;
        excerpt: string | null;
        category: string;
        createdAt: Date;
    }> = [];

    try {
        articles = await db
            .select({
                id: supportArticles.id,
                slug: supportArticles.slug,
                title: supportArticles.title,
                excerpt: supportArticles.excerpt,
                category: supportArticles.category,
                createdAt: supportArticles.createdAt
            })
            .from(supportArticles)
            .where(
                and(
                    eq(supportArticles.isPublished, true),
                    eq(supportArticles.audience, 'user')
                )
            )
            .orderBy(desc(supportArticles.createdAt));
    } catch (error) {
        // Table may not exist yet
        console.warn('Support articles table not available:', error);
    }

    // Group by category
    const categoriesMap = new Map<string, typeof articles>();
    for (const article of articles) {
        const existing = categoriesMap.get(article.category) ?? [];
        existing.push(article);
        categoriesMap.set(article.category, existing);
    }

    const categories = Array.from(categoriesMap.entries()).map(([name, items]) => ({
        name,
        articles: items
    }));

    return {
        articles,
        categories
    };
};
