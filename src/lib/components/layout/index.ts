// Page Layouts
export { default as CreatePageLayout } from './page/CreatePageLayout.svelte';
export { default as DetailPageLayout } from './page/DetailPageLayout.svelte';
export { default as EditPageLayout } from './page/EditPageLayout.svelte';
export { default as PageHeader } from './page/PageHeader.svelte';
export { default as SlugPageLayout } from './page/SlugPageLayout.svelte';

// Section Components
export { default as HeroSection } from './section/HeroSection.svelte';
export { default as DescriptionSection } from './section/DescriptionSection.svelte';
export { default as CapabilitiesSection } from './section/CapabilitiesSection.svelte';
export { default as CTASection } from './section/CTASection.svelte';
export { default as LinkCTASection } from './section/LinkCTASection.svelte';
export { default as WideNavSection } from './section/WideNavSection.svelte';
export { default as BackLinkSection } from './section/BackLinkSection.svelte';
export { default as BackToSection } from './section/BackToSection.svelte';
export { default as SectionHeader } from './section/SectionHeader.svelte';
export { default as Section } from './section/Section.svelte';
export { default as SidebarSection } from './section/SidebarSection.svelte';

// Navigation Components
export { default as Header } from './navigation/Header.svelte';
export { default as Footer } from './navigation/Footer.svelte';
export { default as MobileNav } from './navigation/MobileNav.svelte';

// Form Components
export { default as FormLayout } from './form/FormLayout.svelte';
export { default as MobileForm } from './form/MobileForm.svelte';
export { default as FieldLabel } from './form/FieldLabel.svelte';

// Utility Components
export { default as VideoBackground } from './VideoBackground.svelte';
export { default as TransmissionLoader } from './TransmissionLoader.svelte';
export { default as MarkdownRenderer } from './MarkdownRenderer.svelte';
export { default as CookieConsent } from './CookieConsent.svelte';
export { default as LanguageSwitcher } from './LanguageSwitcher.svelte';
export { default as Grid } from './Grid.svelte';
export { default as GridContainer } from './GridContainer.svelte';
export { default as Tile } from './Tile.svelte';
export { default as CardHeader } from './CardHeader.svelte';
export { default as ComponentDocRenderer } from './ComponentDocRenderer.svelte';
export { default as NotificationBell } from './NotificationBell.svelte';
export { default as ResponsiveContainer } from './ResponsiveContainer.svelte';
export { default as ResponsiveTable } from './ResponsiveTable.svelte';
export { default as TutorialOverlay } from './TutorialOverlay.svelte';

// Note: For new code, prefer using components from $lib/components/ui/* directly
// - Use ui/sections for PageHeader, SectionHeader, PageSection
// - Use ui/data-display for StatCard, EmptyState, InfoCard
// - Use ui/form-fields for TextField, SelectField, etc.
// - Use ui/navigation for Breadcrumbs, BackLink, Pagination
// - Use ui/form for form handling with validation
