import { loadDocPage } from '$lib/content';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    // Try overview first
    let doc = loadDocPage('overview', params.slug);

    if (!doc) {
        error(404, 'Page not found');
    }

    return { doc };
};
