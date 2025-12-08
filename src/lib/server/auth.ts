/**
 * Authentication Helper Functions
 * 
 * Server-side utilities for user authentication and profile management.
 * All database operations go through Drizzle ORM.
 * 
 * NOTE: Uses createDb() to ensure Cloudflare Workers compatibility.
 * Each function call creates its own database connection within the
 * request context.
 */

import { createDb } from '$lib/server/db';
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
    magicLinkEnabled: false,
    accountType: 'personal' as const
};

/**
 * Get or create a user profile
 * 
 * If the user doesn't have a profile yet (new registration), creates one.
 * This is called after successful authentication.
 */
export async function getOrCreateProfile(user: User): Promise<Profile> {
    const db = createDb();
    
    try {
        // Try to get existing profile (may have been created by database trigger)
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
        // Note: A database trigger may also create profiles, so we handle conflicts
        const newProfile: NewProfile = {
            id: user.id,
            email: user.email ?? '',
            firstName: user.user_metadata?.full_name?.split(' ')[0] ??
                user.user_metadata?.first_name ?? null,
            lastName: user.user_metadata?.full_name?.split(' ').slice(1).join(' ') ??
                user.user_metadata?.last_name ?? null,
            displayName: user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
            avatarUrl: user.user_metadata?.avatar_url ?? null,
            role: 'customer', // Default role for new users
            onboardingCompleted: false,
            preferences: DEFAULT_PREFERENCES,
            lastLoginAt: new Date()
        };

        const [createdProfile] = await db
            .insert(profiles)
            .values(newProfile)
            .onConflictDoUpdate({
                target: profiles.id,
                set: {
                    lastLoginAt: new Date(),
                    // Update fields that might be missing from trigger-created profile
                    displayName: newProfile.displayName,
                    preferences: newProfile.preferences
                }
            })
            .returning();

        if (!createdProfile) {
            throw new Error('Profile insert returned no data');
        }

        return createdProfile;
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error('Database error saving new user:', errorMessage, err);
        throw error(500, `Database error saving new user: ${errorMessage}`);
    }
}

/**
 * Get a user profile by ID
 */
export async function getProfileById(userId: string): Promise<Profile | null> {
    const db = createDb();
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
    const db = createDb();
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
    const db = createDb();
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
                magicLinkEnabled: data.preferences?.magicLinkEnabled ?? currentProfile.preferences?.magicLinkEnabled ?? DEFAULT_PREFERENCES.magicLinkEnabled,
                accountType: data.preferences?.accountType ?? currentProfile.preferences?.accountType ?? DEFAULT_PREFERENCES.accountType
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
