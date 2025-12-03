/**
 * Authentication Helper Functions
 * 
 * Server-side utilities for user authentication and profile management.
 * All database operations go through Drizzle ORM.
 */

import { db } from '$lib/server/db';
import { profiles, type Profile, type NewProfile } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { error } from '@sveltejs/kit';
import type { User } from '@supabase/supabase-js';

/**
 * Default user preferences
 */
export const DEFAULT_PREFERENCES = {
    emailNotifications: true,
    smsNotifications: false,
    theme: 'system' as const,
    language: 'en',
    timezone: 'UTC',
    magicLinkEnabled: false
};

/**
 * Get or create a user profile
 * 
 * If the user doesn't have a profile yet (new registration), creates one.
 * This is called after successful authentication.
 */
export async function getOrCreateProfile(user: User): Promise<Profile> {
    // Try to get existing profile
    const existingProfile = await db.query.profiles.findFirst({
        where: eq(profiles.id, user.id)
    });

    if (existingProfile) {
        // Update last login
        await db
            .update(profiles)
            .set({ lastLoginAt: new Date() })
            .where(eq(profiles.id, user.id));

        return existingProfile;
    }

    // Create new profile for first-time users
    const newProfile: NewProfile = {
        id: user.id,
        email: user.email ?? '',
        firstName: user.user_metadata?.full_name?.split(' ')[0] ?? null,
        lastName: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') ?? null,
        displayName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
        avatarUrl: user.user_metadata?.avatar_url ?? null,
        role: 'customer', // Default role for new users
        onboardingCompleted: false,
        preferences: DEFAULT_PREFERENCES,
        lastLoginAt: new Date()
    };

    const [createdProfile] = await db.insert(profiles).values(newProfile).returning();

    if (!createdProfile) {
        error(500, 'Failed to create user profile');
    }

    return createdProfile;
}

/**
 * Get a user profile by ID
 */
export async function getProfileById(userId: string): Promise<Profile | null> {
    const profile = await db.query.profiles.findFirst({
        where: eq(profiles.id, userId)
    });

    return profile ?? null;
}

/**
 * Update a user profile
 */
export async function updateProfile(
    userId: string,
    data: Partial<Omit<NewProfile, 'id' | 'createdAt'>>
): Promise<Profile> {
    const [updatedProfile] = await db
        .update(profiles)
        .set({
            ...data,
            updatedAt: new Date()
        })
        .where(eq(profiles.id, userId))
        .returning();

    if (!updatedProfile) {
        error(404, 'Profile not found');
    }

    return updatedProfile;
}

/**
 * Complete user onboarding
 */
export async function completeOnboarding(
    userId: string,
    data: {
        firstName: string;
        lastName: string;
        displayName?: string;
        phone?: string;
        preferences?: Partial<Profile['preferences']>;
    }
): Promise<Profile> {
    const currentProfile = await getProfileById(userId);

    if (!currentProfile) {
        error(404, 'Profile not found');
    }

    const [updatedProfile] = await db
        .update(profiles)
        .set({
            firstName: data.firstName,
            lastName: data.lastName,
            displayName: data.displayName ?? `${data.firstName} ${data.lastName}`,
            phone: data.phone,
            preferences: {
                emailNotifications: data.preferences?.emailNotifications ?? currentProfile.preferences?.emailNotifications ?? DEFAULT_PREFERENCES.emailNotifications,
                smsNotifications: data.preferences?.smsNotifications ?? currentProfile.preferences?.smsNotifications ?? DEFAULT_PREFERENCES.smsNotifications,
                theme: data.preferences?.theme ?? currentProfile.preferences?.theme ?? DEFAULT_PREFERENCES.theme,
                language: data.preferences?.language ?? currentProfile.preferences?.language ?? DEFAULT_PREFERENCES.language,
                timezone: data.preferences?.timezone ?? currentProfile.preferences?.timezone ?? DEFAULT_PREFERENCES.timezone,
                magicLinkEnabled: data.preferences?.magicLinkEnabled ?? currentProfile.preferences?.magicLinkEnabled ?? DEFAULT_PREFERENCES.magicLinkEnabled
            },
            onboardingCompleted: true,
            updatedAt: new Date()
        })
        .where(eq(profiles.id, userId))
        .returning();

    if (!updatedProfile) {
        error(500, 'Failed to complete onboarding');
    }

    return updatedProfile;
}

/**
 * Check if a user has a specific role
 */
export function hasRole(profile: Profile | null, roles: Profile['role'][]): boolean {
    if (!profile) return false;
    return roles.includes(profile.role);
}

/**
 * Check if user is admin
 */
export function isAdmin(profile: Profile | null): boolean {
    return hasRole(profile, ['admin']);
}

/**
 * Check if user is staff (includes admin)
 */
export function isStaff(profile: Profile | null): boolean {
    return hasRole(profile, ['admin', 'staff']);
}

/**
 * Check if user is customer
 */
export function isCustomer(profile: Profile | null): boolean {
    return hasRole(profile, ['customer']);
}
