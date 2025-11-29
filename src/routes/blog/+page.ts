import { loadBlogPosts } from '$lib/content';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
    const posts = await loadBlogPosts();

    // Extract unique categories
    const categories = ['All', ...new Set(posts.map(p => p.category))];

    return {
        posts,
        categories
    };
};
