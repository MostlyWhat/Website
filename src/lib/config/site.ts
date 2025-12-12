/**
 * Site Configuration
 * Central configuration file for SEO, contact information, URLs, and site standards.
 * Import from '$lib/config/site' to use these values throughout the site.
 */

export const siteConfig = {
    // Site Information
    name: 'MostlyWhat',
    title: 'MostlyWhat',
    description: 'Digital solutions and software development studio',
    tagline: 'Building digital experiences',

    // URLs
    url: 'https://mostlywhat.com',
    baseUrl: 'https://mostlywhat.com',

    // Contact Emails
    emails: {
        hello: 'hello@mostlywhat.com',
        support: 'support@mostlywhat.com',
        urgent: 'urgent@mostlywhat.com',
        careers: 'careers@mostlywhat.com',
        legal: 'legal@mostlywhat.com',
    },

    // Social Links
    social: {
        github: 'https://github.com/MostlyWhat',
        twitter: 'https://twitter.com/mostlywhat',
        linkedin: 'https://linkedin.com/company/mostlywhat',
    },

    // SEO Defaults
    seo: {
        defaultTitle: 'MostlyWhat',
        titleTemplate: '%s | MostlyWhat Systems',
        defaultDescription: 'Digital solutions and software development studio specializing in modern web applications.',
        defaultImage: '/og-image.png',
        twitterHandle: '@mostlywhat',
        locale: 'en_US',
        type: 'website',
    },

    // Company Information
    company: {
        name: 'MostlyWhat',
        legalName: 'MostlyWhat Systems Co., Ltd.',
        foundedYear: 2018,
        location: 'Thailand',
    },

    // Navigation Links
    nav: {
        main: [
            { label: 'About', href: '/about' },
            { label: 'Services', href: '/services' },
            { label: 'Projects', href: '/projects' },
            { label: 'Blog', href: '/blog' },
            { label: 'Contact', href: '/contact' },
        ],
        footer: [
            { label: 'About', href: '/about' },
            { label: 'Services', href: '/services' },
            { label: 'Projects', href: '/projects' },
            { label: 'Blog', href: '/blog' },
            { label: 'Careers', href: '/careers' },
            { label: 'Contact', href: '/contact' },
            { label: 'Support', href: '/support' },
            { label: 'Legal', href: '/legal' },
        ],
    },
} as const;

// Type exports for better TypeScript support
export type SiteConfig = typeof siteConfig;
export type Email = keyof typeof siteConfig.emails;
export type SocialPlatform = keyof typeof siteConfig.social;

// Helper functions
export function getEmail(type: Email): string {
    return siteConfig.emails[type];
}

export function getMailtoLink(type: Email): string {
    return `mailto:${siteConfig.emails[type]}`;
}

export function getSocialLink(platform: SocialPlatform): string {
    return siteConfig.social[platform];
}

export default siteConfig;
