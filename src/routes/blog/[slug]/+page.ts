import { loadBlogPost } from '$lib/content';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
    const post = await loadBlogPost(params.slug);

    if (!post) {
        throw error(404, 'Post not found');
    }

    return { post };
};
