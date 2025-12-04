import { db } from '$lib/server/db';
import { supportArticles, profiles } from '$lib/server/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || !locals.profile) {
        throw error(401, 'Unauthorized');
    }

    const { slug } = params;

    try {
        // Fetch the article
        const [article] = await db
            .select({
                id: supportArticles.id,
                slug: supportArticles.slug,
                title: supportArticles.title,
                excerpt: supportArticles.excerpt,
                content: supportArticles.content,
                category: supportArticles.category,
                tags: supportArticles.tags,
                viewCount: supportArticles.viewCount,
                helpfulCount: supportArticles.helpfulCount,
                notHelpfulCount: supportArticles.notHelpfulCount,
                publishedAt: supportArticles.publishedAt,
                createdAt: supportArticles.createdAt,
                updatedAt: supportArticles.updatedAt,
                authorId: supportArticles.authorId
            })
            .from(supportArticles)
            .where(
                and(
                    eq(supportArticles.slug, slug),
                    eq(supportArticles.isPublished, true),
                    eq(supportArticles.audience, 'user')
                )
            )
            .limit(1);

        if (!article) {
            throw error(404, 'Article not found');
        }

        // Increment view count
        await db
            .update(supportArticles)
            .set({ viewCount: sql`${supportArticles.viewCount} + 1` })
            .where(eq(supportArticles.id, article.id));

        // Get author name
        let authorName = 'Support Team';
        if (article.authorId) {
            const [author] = await db
                .select({
                    displayName: profiles.displayName,
                    firstName: profiles.firstName,
                    lastName: profiles.lastName
                })
                .from(profiles)
                .where(eq(profiles.id, article.authorId))
                .limit(1);

            if (author) {
                authorName = author.displayName ??
                    [author.firstName, author.lastName].filter(Boolean).join(' ') ??
                    'Support Team';
            }
        }

        // Fetch related articles (same category, different article)
        const relatedArticles = await db
            .select({
                slug: supportArticles.slug,
                title: supportArticles.title,
                excerpt: supportArticles.excerpt
            })
            .from(supportArticles)
            .where(
                and(
                    eq(supportArticles.category, article.category),
                    eq(supportArticles.isPublished, true),
                    eq(supportArticles.audience, 'user'),
                    sql`${supportArticles.id} != ${article.id}`
                )
            )
            .limit(3);

        return {
            article: {
                ...article,
                authorName
            },
            relatedArticles
        };
    } catch (err) {
        if ((err as { status?: number }).status === 404 || (err as { status?: number }).status === 401) {
            throw err;
        }
        // Table may not exist yet
        console.warn('Error loading article:', err);
        throw error(404, 'Article not found');
    }
};
