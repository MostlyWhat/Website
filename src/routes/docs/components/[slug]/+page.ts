import { loadDocPage } from '$lib/content';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    const doc = loadDocPage('components', params.slug);

    if (!doc) {
        throw error(404, 'Component not found');
    }

    return { doc };
};
