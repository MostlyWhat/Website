import { loadDocPage } from '$lib/content';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    const doc = loadDocPage('foundation', params.slug);

    if (!doc) {
        throw error(404, 'Foundation doc not found');
    }

    return { doc };
};
