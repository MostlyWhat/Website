import { loadLegalDoc } from '$lib/content';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = ({ params }) => {
    const doc = loadLegalDoc(params.slug);

    if (!doc) {
        throw error(404, 'Legal document not found');
    }

    return {
        doc
    };
};
