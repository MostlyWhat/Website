import { createDb } from '$lib/server/db';
import { blogPosts, profiles } from '$lib/server/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { CachePresets, setCacheHeaders } from '$lib/server/utils/cache';

export const load: PageServerLoad = async ({ setHeaders }) => {
    const db = createDb();

    // Set cache headers for public page (5min cache, 30min stale-while-revalidate)
    setCacheHeaders(setHeaders, CachePresets.DYNAMIC_MEDIUM);

    // Load published blog posts from database
    async function loadBlogPosts() {
        try {
            const posts = await db
                .select({
                    id: blogPosts.id,
                    slug: blogPosts.slug,
                    title: blogPosts.title,
                    excerpt: blogPosts.excerpt,
                    category: blogPosts.category,
                    tags: blogPosts.tags,
                    status: blogPosts.status,
                    isFeatured: blogPosts.isFeatured,
                    publishedAt: blogPosts.publishedAt,
                    readTime: blogPosts.readTime,
                    featuredImage: blogPosts.featuredImage,
                    authorName: profiles.displayName
                })
                .from(blogPosts)
                .leftJoin(profiles, eq(blogPosts.authorId, profiles.id))
                .where(eq(blogPosts.status, 'published'))
                .orderBy(desc(blogPosts.publishedAt));

            // Extract unique categories
            const categories = ['All', ...new Set(posts.map(p => p.category).filter(Boolean))];

            return { posts, categories };
        } catch (error) {
            console.warn('Failed to load blog posts from database:', error);
            return { posts: [], categories: ['All'] };
        }
    }

    return {
        streamed: {
            blogData: loadBlogPosts()
        }
    };
};
