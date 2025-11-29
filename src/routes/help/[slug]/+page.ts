import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

// Help article content
const helpArticles: Record<string, { title: string; category: string; content: string; readTime: string }> = {
    'what-we-do': {
        title: 'What Does MostlyWhat Systems Do?',
        category: 'getting-started',
        readTime: '3 min',
        content: `
## 01 — OVERVIEW

MostlyWhat Systems is a web development studio specializing in modern, high-performance websites and applications. We work with startups, agencies, and product teams who need thoughtful, well-crafted digital experiences.

## 02 — OUR SERVICES

We offer end-to-end digital product development:

- **Product Strategy** — Discovery, roadmapping, and defining success metrics
- **Brand & Visual Design** — Identity systems, design language, and art direction
- **UX & Prototyping** — User flows, wireframes, and interactive prototypes
- **Web Engineering** — SvelteKit, TypeScript, and modern web technologies
- **Platform Development** — Headless CMS, e-commerce, and integrations
- **Growth** — Analytics, SEO, and conversion optimization

## 03 — OUR APPROACH

We believe in shipping fast without sacrificing quality. Every project follows our proven process: Discovery, Design, Development, and Delivery.

## 04 — WHO WE WORK WITH

We partner with teams who value craft and clear communication. Whether you're a startup launching your first product or an established company modernizing your digital presence, we can help.
`
    },
    'project-process': {
        title: 'How Our Project Process Works',
        category: 'getting-started',
        readTime: '5 min',
        content: `
## 01 — DISCOVERY

Every project starts with understanding your goals, audience, and constraints. We conduct stakeholder interviews, competitive analysis, and define clear success metrics.

## 02 — DESIGN

We create wireframes, visual designs, and interactive prototypes. You'll see exactly how your product will look and function before we write any code.

## 03 — DEVELOPMENT

Using modern technologies like SvelteKit and TypeScript, we build performant, accessible applications. We work in sprints with regular demos and feedback sessions.

## 04 — DELIVERY

We handle deployment, monitoring setup, and documentation. Post-launch, we offer maintenance packages to keep your product running smoothly.
`
    },
    'starting-project': {
        title: 'How to Start a Project',
        category: 'getting-started',
        readTime: '4 min',
        content: `
## 01 — GET IN TOUCH

Reach out through our contact form or email us at hello@mostlywhat.systems. Tell us about your project, timeline, and budget.

## 02 — INITIAL CALL

We'll schedule a 30-minute call to discuss your needs and see if we're a good fit. This call is free with no obligations.

## 03 — PROPOSAL

If we're aligned, we'll prepare a detailed proposal including scope, timeline, and pricing. We'll walk you through everything and answer questions.

## 04 — KICKOFF

Once you approve the proposal, we'll schedule a kickoff meeting, set up project tools, and begin the discovery phase.
`
    },
    'web-development': {
        title: 'Web Development Services',
        category: 'services',
        readTime: '6 min',
        content: `
## 01 — MODERN STACK

We specialize in SvelteKit, TypeScript, and TailwindCSS. Our sites are fast, accessible, and built to last.

## 02 — PERFORMANCE FIRST

Every site we build scores 90+ on Core Web Vitals. We optimize for real-world performance, not just benchmarks.

## 03 — ACCESSIBILITY

We follow WCAG 2.1 guidelines and build with semantic HTML. Everyone should be able to use your site.

## 04 — DEPLOYMENT

We deploy to modern platforms like Cloudflare, Vercel, and Netlify. Your site will be fast for users anywhere in the world.
`
    },
    'design-systems': {
        title: 'Design Systems & Brand Identity',
        category: 'services',
        readTime: '5 min',
        content: `
## 01 — BRAND IDENTITY

We create cohesive visual identities including logos, color palettes, typography, and brand guidelines.

## 02 — DESIGN SYSTEMS

We build scalable design systems with components, patterns, and documentation. Your team can build consistently without us.

## 03 — PROTOTYPES

We create interactive prototypes in Figma that feel like the real thing. Test ideas with users before committing to code.

## 04 — HANDOFF

We provide detailed specifications, assets, and documentation for smooth developer handoff.
`
    },
    'tech-stack': {
        title: 'Our Technology Stack',
        category: 'technical',
        readTime: '4 min',
        content: `
## 01 — FRONTEND

- SvelteKit for applications and marketing sites
- TypeScript for type safety and better DX
- TailwindCSS for utility-first styling
- shadcn-svelte for UI components

## 02 — BACKEND

- Cloudflare Workers for edge computing
- D1 and Turso for databases
- Drizzle ORM for type-safe queries

## 03 — INFRASTRUCTURE

- Cloudflare for global CDN and edge functions
- GitHub for version control and CI/CD
- Sentry for error monitoring

## 04 — DESIGN

- Figma for design and prototyping
- Linear for project management
`
    },
    'integrations': {
        title: 'Third-Party Integrations',
        category: 'technical',
        readTime: '5 min',
        content: `
## 01 — CMS PLATFORMS

We integrate with headless CMS platforms like Contentful, Sanity, Strapi, and Payload CMS.

## 02 — E-COMMERCE

We work with Shopify, Swell, and custom solutions for online stores.

## 03 — PAYMENTS

Stripe, Paddle, and LemonSqueezy for subscription and one-time payments.

## 04 — ANALYTICS

Google Analytics 4, Plausible, Fathom, and PostHog for user analytics and insights.
`
    },
    'timeline': {
        title: 'Project Timelines',
        category: 'process',
        readTime: '3 min',
        content: `
## 01 — SPRINT PROJECTS

2-4 weeks for focused, single-deliverable projects like landing pages or design sprints.

## 02 — BUILD PROJECTS

6-12 weeks for end-to-end product development including design and engineering.

## 03 — ONGOING PARTNERSHIPS

Continuous engagement for teams who need dedicated capacity and strategic support.

## 04 — FACTORS

Timeline depends on scope, complexity, feedback turnaround, and third-party dependencies.
`
    },
    'communication': {
        title: 'Communication & Collaboration',
        category: 'process',
        readTime: '4 min',
        content: `
## 01 — ASYNC FIRST

We use Slack, Linear, and GitHub for day-to-day communication. No unnecessary meetings.

## 02 — WEEKLY SYNCS

Regular check-ins to review progress, gather feedback, and plan upcoming work.

## 03 — SHARED TOOLS

You'll have access to Figma files, GitHub repos, and project boards for full transparency.

## 04 — DOCUMENTATION

We document decisions, processes, and technical details for future reference.
`
    },
    'pricing': {
        title: 'Pricing & Estimates',
        category: 'billing',
        readTime: '4 min',
        content: `
## 01 — PROJECT-BASED

Fixed-price for well-defined projects. You'll know the cost upfront.

## 02 — TIME & MATERIALS

Hourly or daily rates for flexible engagements. Good for evolving scope.

## 03 — RETAINERS

Monthly commitment for ongoing work. Best value for long-term partnerships.

## 04 — ESTIMATES

We provide detailed estimates with breakdowns by phase. No hidden costs.
`
    },
    'invoicing': {
        title: 'Invoicing & Payment',
        category: 'billing',
        readTime: '3 min',
        content: `
## 01 — PAYMENT TERMS

Net 15 for most invoices. Larger projects may have milestone-based payments.

## 02 — METHODS

We accept bank transfers, credit cards via Stripe, and PayPal.

## 03 — DEPOSITS

Projects typically start with a 50% deposit. Balance due on completion.

## 04 — INVOICING

You'll receive detailed invoices with time tracking and deliverable summaries.
`
    },
    'maintenance': {
        title: 'Post-Launch Support',
        category: 'support',
        readTime: '4 min',
        content: `
## 01 — MAINTENANCE PACKAGES

Monthly plans for updates, security patches, and bug fixes.

## 02 — MONITORING

We set up error tracking, uptime monitoring, and performance alerts.

## 03 — UPDATES

Regular dependency updates, CMS upgrades, and platform maintenance.

## 04 — PRIORITY SUPPORT

Direct access to our team for urgent issues and feature requests.
`
    }
};

export const load: PageLoad = ({ params }) => {
    const article = helpArticles[params.slug];

    if (!article) {
        error(404, 'Article not found');
    }

    return {
        slug: params.slug,
        ...article
    };
};
