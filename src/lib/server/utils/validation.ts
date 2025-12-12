/**
 * Request Validation Schemas
 * 
 * Zod schemas for validating API requests to prevent invalid data.
 */
import { z } from 'zod';

/**
 * Contact form validation
 */
export const contactSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
    message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message too long'),
    phone: z.string().optional(),
    company: z.string().optional(),
    orderId: z.string().optional()
});

/**
 * Ticket creation validation
 */
export const ticketSchema = z.object({
    subject: z.string().min(1, 'Subject is required').max(200),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    priority: z.enum(['low', 'medium', 'high', 'urgent']),
    category: z.enum(['general', 'technical', 'billing', 'feature_request', 'bug']),
    organizationId: z.string().uuid().optional(),
    projectId: z.string().uuid().optional()
});

/**
 * File upload validation
 */
export const fileUploadSchema = z.object({
    file: z.object({
        name: z.string().min(1),
        size: z.number().max(10 * 1024 * 1024, 'File size must be less than 10MB'),
        type: z.string().refine(
            (fileType: string) => ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain'].includes(fileType),
            'Invalid file type'
        )
    }),
    entityType: z.enum(['project', 'ticket', 'invoice', 'profile']),
    entityId: z.string().uuid()
});

/**
 * User profile update validation
 */
export const profileUpdateSchema = z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    phone: z.string().max(20).optional(),
    avatarUrl: z.string().url().optional().or(z.literal('')),
    bio: z.string().max(500).optional()
});

/**
 * Organization creation validation
 */
export const organizationSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    email: z.string().email().optional(),
    phone: z.string().max(20).optional(),
    website: z.string().url().optional().or(z.literal('')),
    billingAddressLine1: z.string().max(200).optional(),
    billingCity: z.string().max(100).optional(),
    billingCountry: z.string().max(100).optional(),
    ownerId: z.string().uuid().optional()
});

/**
 * Project creation validation
 */
export const projectSchema = z.object({
    name: z.string().min(1, 'Project name is required').max(200),
    description: z.string().max(2000).optional(),
    organizationId: z.string().uuid('Invalid organization ID'),
    budgetAmount: z.number().min(0).optional(),
    budgetCurrency: z.string().length(3).optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    phase: z.enum(['request', 'review', 'proposal', 'confirmed', 'building', 'completed', 'support']).optional()
});

/**
 * Invoice creation validation
 */
export const invoiceSchema = z.object({
    organizationId: z.string().uuid('Invalid organization ID'),
    projectId: z.string().uuid().optional(),
    dueDate: z.string().datetime(),
    notes: z.string().max(2000).optional(),
    taxRate: z.number().min(0).max(100),
    discountAmount: z.number().min(0).optional(),
    lineItems: z.array(z.object({
        description: z.string().min(1).max(500),
        quantity: z.number().min(1),
        unitPrice: z.number().min(0)
    })).min(1, 'At least one line item is required')
});

/**
 * Search query validation
 */
export const searchSchema = z.object({
    query: z.string().min(1).max(200),
    type: z.enum(['all', 'projects', 'tickets', 'invoices', 'users', 'organizations']).optional(),
    limit: z.number().min(1).max(100).optional()
});

/**
 * Helper to validate request body
 */
export async function validateRequest<T>(
    schema: z.ZodSchema<T>,
    data: unknown
): Promise<{ success: true; data: T } | { success: false; errors: z.ZodError }> {
    const result = schema.safeParse(data);

    if (result.success) {
        return { success: true, data: result.data };
    }

    return { success: false, errors: result.error };
}
