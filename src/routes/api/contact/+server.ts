import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createDb } from '$lib/server/db';
import { contactSubmissions } from '$lib/server/db/schema';
import { siteConfig } from '$lib/config/site';
import { logActivity } from '$lib/server/utils/activity-logger';
import { rateLimiters, getClientIP } from '$lib/server/utils/rate-limiter';
import { contactSchema, validateRequest } from '$lib/server/utils/validation';

interface ContactFormData {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    message?: string;
    topic?: 'quote' | 'support' | 'general' | 'partnership' | 'feedback';
    subject?: string;
    projectType?: string;
    budget?: string;
    timeline?: string;
    orderId?: string;
    urgency?: string;
}

export const POST: RequestHandler = async ({ request, getClientAddress }) => {
    try {
        // Rate limiting - 5 requests per 10 minutes
        const clientIP = getClientIP(request, request.headers);
        const rateLimitResult = await rateLimiters.contact.check(clientIP);

        if (!rateLimitResult.success) {
            const resetInMinutes = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000 / 60);
            return json(
                {
                    error: `Too many requests. Please try again in ${resetInMinutes} minute${resetInMinutes > 1 ? 's' : ''}.`,
                    retryAfter: rateLimitResult.resetTime
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
                    }
                }
            );
        }

        const body = await request.json() as ContactFormData;

        // Validate request with Zod schema
        const validation = await validateRequest(contactSchema, {
            name: body.name,
            email: body.email,
            subject: body.subject || body.topic || 'General inquiry',
            message: body.message,
            phone: body.phone,
            company: body.company,
            orderId: body.orderId
        });

        if (!validation.success) {
            const errors = validation.errors.issues.map((err: any) => `${err.path.join('.')}: ${err.message}`);
            return json(
                {
                    error: 'Validation failed',
                    details: errors
                },
                { status: 400 }
            );
        }

        const validatedData = validation.data;
        const name = validatedData.name;
        const email = validatedData.email;
        const company = validatedData.company;
        const phone = validatedData.phone;
        const message = validatedData.message;
        const subject = validatedData.subject;
        const orderId = validatedData.orderId;

        const topic = body.topic || 'general';
        const projectType = body.projectType;
        const budget = body.budget;
        const timeline = body.timeline;
        const urgency = body.urgency;

        // Validate topic if provided
        const validTopics = ['quote', 'support', 'general', 'partnership', 'feedback'];
        if (topic && !validTopics.includes(topic)) {
            return json(
                { error: 'Invalid topic' },
                { status: 400 }
            );
        }

        // Get request metadata
        let ipAddress: string | null = null;
        try {
            ipAddress = getClientAddress();
        } catch {
            // IP address not available
        }

        const userAgent = request.headers.get('user-agent');
        const referrer = request.headers.get('referer');

        // Create per-request database connection
        const db = createDb();

        // Store in database
        const [submission] = await db.insert(contactSubmissions).values({
            name,
            email,
            company: company || null,
            phone: phone || null,
            topic: topic as 'quote' | 'support' | 'general' | 'partnership' | 'feedback',
            subject: subject || null,
            message,
            projectType: projectType || null,
            budget: budget || null,
            timeline: timeline || null,
            orderId: orderId || null,
            urgency: urgency || null,
            source: 'website',
            ipAddress,
            userAgent,
            referrer
        }).returning({ id: contactSubmissions.id });

        // Log for debugging (can be removed in production)
        console.log('Contact form submission stored:', {
            id: submission.id,
            name,
            email,
            topic,
            timestamp: new Date().toISOString()
        });

        // Log activity
        await logActivity({
            entityType: 'user',
            entityId: submission.id,
            activityType: 'created',
            description: `New ${topic} inquiry from ${name} (${email})`,
            newValues: {
                name,
                email,
                company,
                topic,
                subject
            },
            ipAddress: ipAddress ?? undefined,
            userAgent: userAgent ?? undefined
        });

        // TODO: Send email notification to admin
        // This can be implemented using:
        // 1. Supabase Edge Functions with Resend/SendGrid
        // 2. Direct SMTP via Nodemailer
        // 3. A webhook to a notification service
        // For now, we rely on admin dashboard to view new submissions

        return json({
            success: true,
            message: 'Thank you for your message. We will get back to you within 24 hours!',
            submissionId: submission.id
        }, {
            headers: {
                'X-RateLimit-Remaining': String(rateLimitResult.remaining),
                'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
            }
        });
    } catch (error) {
        console.error('Contact form error:', error);
        return json(
            { error: 'Failed to submit your message. Please try again or email us directly.' },
            { status: 500 }
        );
    }
};
