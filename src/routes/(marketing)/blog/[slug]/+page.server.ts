import { createDb } from '$lib/server/db';
import { blogPosts, profiles } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const db = createDb();

    try {
        const [post] = await db
            .select({
                id: blogPosts.id,
                slug: blogPosts.slug,
                title: blogPosts.title,
                excerpt: blogPosts.excerpt,
                content: blogPosts.content,
                category: blogPosts.category,
                tags: blogPosts.tags,
                status: blogPosts.status,
                publishedAt: blogPosts.publishedAt,
                readTime: blogPosts.readTime,
                featuredImage: blogPosts.featuredImage,
                metaTitle: blogPosts.metaTitle,
                metaDescription: blogPosts.metaDescription,
                authorId: blogPosts.authorId,
                authorName: profiles.displayName
            })
            .from(blogPosts)
            .leftJoin(profiles, eq(blogPosts.authorId, profiles.id))
            .where(
                and(
                    eq(blogPosts.slug, params.slug),
                    eq(blogPosts.status, 'published')
                )
            )
            .limit(1);

        if (!post) {
            error(404, 'Post not found');
        }

        // Extract sections from markdown content (simple H2 header extraction)
        const sections = extractSections(post.content);

        return {
            post: {
                ...post,
                sections
            }
        };
    } catch (err) {
        if ((err as { status?: number }).status === 404) {
            throw err;
        }
        console.error('Failed to load blog post:', err);
        error(500, 'Failed to load blog post');
    }
};

// Simple section extraction from markdown
function extractSections(content: string): Array<{ id: string; title: string }> {
    const sections: Array<{ id: string; title: string }> = [];
    const lines = content.split('\n');

    for (const line of lines) {
        const match = line.match(/^##\s+(.+)$/);
        if (match) {
            const title = match[1].trim();
            const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
            sections.push({ id, title });
        }
    }

    return sections;
}
