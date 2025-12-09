import { error, fail } from '@sveltejs/kit';
import { getSurveyByToken, submitSatisfactionSurvey } from '$lib/server/ticket-relationships';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const { token } = params;

    const survey = await getSurveyByToken(token);

    if (!survey) {
        error(404, 'Survey not found or invalid token');
    }

    // Check if survey has already been completed
    if (survey.respondedAt) {
        return {
            completed: true,
            survey
        };
    }

    // Check if survey is expired (30 days from sent date)
    const sentDate = new Date(survey.surveySentAt);
    const expiryDate = new Date(sentDate);
    expiryDate.setDate(expiryDate.getDate() + 30);

    if (new Date() > expiryDate) {
        return {
            expired: true,
            survey
        };
    }

    return {
        completed: false,
        expired: false,
        survey
    };
};

export const actions: Actions = {
    submit: async ({ request, params }) => {
        const { token } = params;
        const formData = await request.formData();

        const rating = parseInt(formData.get('rating') as string);
        const responseTimeRating = formData.get('responseTimeRating') ? parseInt(formData.get('responseTimeRating') as string) : null;
        const resolutionQualityRating = formData.get('resolutionQualityRating') ? parseInt(formData.get('resolutionQualityRating') as string) : null;
        const staffProfessionalismRating = formData.get('staffProfessionalismRating') ? parseInt(formData.get('staffProfessionalismRating') as string) : null;
        const feedback = (formData.get('feedback') as string)?.trim() || null;
        const wouldRecommend = formData.get('wouldRecommend') === 'yes';

        // Validate rating
        if (!rating || rating < 1 || rating > 5) {
            return fail(400, { error: 'Please provide an overall satisfaction rating' });
        }

        const result = await submitSatisfactionSurvey(token, {
            rating,
            responseTimeRating,
            resolutionQualityRating,
            staffProfessionalismRating,
            feedback,
            wouldRecommend
        });

        if (!result.success) {
            return fail(400, { error: result.error ?? 'Failed to submit survey' });
        }

        return { success: true };
    }
};
