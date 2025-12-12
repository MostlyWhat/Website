// Layout Components
export { default as HeroSection } from './HeroSection.svelte';
export { default as DescriptionSection } from './DescriptionSection.svelte';
export { default as CapabilitiesSection } from './CapabilitiesSection.svelte';
export { default as CTASection } from './CTASection.svelte';
export { default as LinkCTASection } from './LinkCTASection.svelte';
export { default as WideNavSection } from './WideNavSection.svelte';
export { default as BackLinkSection } from './BackLinkSection.svelte';
export { default as SectionHeader } from './SectionHeader.svelte';
export { default as SlugPageLayout } from './SlugPageLayout.svelte';
export { default as VideoBackground } from './VideoBackground.svelte';
export { default as TransmissionLoader } from './TransmissionLoader.svelte';
export { default as MarkdownRenderer } from './MarkdownRenderer.svelte';
export { default as Header } from './Header.svelte';
export { default as Footer } from './Footer.svelte';
export { default as CookieConsent } from './CookieConsent.svelte';
export { default as LanguageSwitcher } from './LanguageSwitcher.svelte';
export { default as Grid } from './Grid.svelte';
export { default as Section } from './Section.svelte';
export { default as Tile } from './Tile.svelte';

// Page Layouts (use these for admin pages)
export { default as CreatePageLayout } from './CreatePageLayout.svelte';
export { default as DetailPageLayout } from './DetailPageLayout.svelte';
export { default as EditPageLayout } from './EditPageLayout.svelte';
export { default as PageHeader } from './PageHeader.svelte';

// Note: For new code, prefer using components from $lib/components/ui/* directly
// - Use ui/sections for PageHeader, SectionHeader, PageSection
// - Use ui/data-display for StatCard, EmptyState, InfoCard
// - Use ui/form-fields for TextField, SelectField, etc.
// - Use ui/navigation for Breadcrumbs, BackLink, Pagination
// - Use ui/form for form handling with validation
