/**
 * MostlyWhat Systems - Responsive Grid System
 * ============================================
 * 
 * A consistent grid system based on multiples of 2 for organized layouts.
 * Uses screen height awareness for optimal section sizing.
 * 
 * ## Design Principles
 * - All grid columns are multiples of 2 (2, 4, 6, 8, 12)
 * - Gap sizes follow the spacing scale (gap-px for seamless, gap-2, gap-4)
 * - Hero sections use full viewport height minus header (64px)
 * - Sections should feel distinct but connected through consistent spacing
 * 
 * ## Grid Column Patterns
 * | Breakpoint | Base Cols | Common Patterns |
 * |------------|-----------|-----------------|
 * | Mobile     | 1-2       | 1, 2            |
 * | Tablet     | 2-4       | 2, 4            |
 * | Desktop    | 4-6       | 2, 4, 6         |
 * | Wide       | 6-12      | 4, 6, 8, 12     |
 * 
 * ## Usage Examples
 * 
 * ```svelte
 * <!-- Responsive 2→4→6 grid -->
 * <div class={gridCols({ sm: 2, lg: 4, xl: 6 })}>
 *   {#each items as item}
 *     <GridTile>{item}</GridTile>
 *   {/each}
 * </div>
 * 
 * <!-- Full viewport hero -->
 * <section class="hero-full">
 *   <div class="hero-content">...</div>
 * </section>
 * ```
 * 
 * @module grid
 */

export const HEADER_HEIGHT = 64; // 4rem / 16px * 4

/**
 * Column count presets based on screen size
 * All values are multiples of 2 for consistency
 */
export const GRID_PRESETS = {
    /** Single column on mobile, 2 on tablet+ */
    narrow: { base: 1, sm: 2 },
    /** 2 columns mobile, 4 on desktop */
    standard: { base: 2, lg: 4 },
    /** 2 → 4 → 6 responsive */
    wide: { base: 2, md: 4, xl: 6 },
    /** Full 12-column grid for complex layouts */
    full: { base: 2, sm: 4, lg: 6, xl: 12 }
} as const;

/**
 * Gap presets for different grid densities
 */
export const GAP_PRESETS = {
    /** Seamless tiles with 1px border effect */
    seamless: 'gap-px',
    /** Tight spacing for dense information */
    tight: 'gap-2',
    /** Standard comfortable spacing */
    normal: 'gap-4',
    /** Loose spacing for breathing room */
    loose: 'gap-6'
} as const;

/**
 * Hero height presets
 */
export const HERO_HEIGHTS = {
    /** Full viewport minus header */
    full: 'min-h-[calc(100dvh-64px)]',
    /** 3/4 of viewport */
    large: 'min-h-[calc(75dvh-64px)]',
    /** Half viewport */
    medium: 'min-h-[calc(50dvh-64px)]',
    /** 1/3 of viewport */
    small: 'min-h-[calc(33dvh-64px)]'
} as const;

interface GridColsOptions {
    base?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
    sm?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
    md?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
    lg?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
    xl?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
    '2xl'?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
}

/**
 * Generate responsive grid column classes
 * 
 * @example
 * gridCols({ base: 1, sm: 2, lg: 4 })
 * // Returns: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
 */
export function gridCols(options: GridColsOptions): string {
    const classes: string[] = ['grid'];

    if (options.base) classes.push(`grid-cols-${options.base}`);
    if (options.sm) classes.push(`sm:grid-cols-${options.sm}`);
    if (options.md) classes.push(`md:grid-cols-${options.md}`);
    if (options.lg) classes.push(`lg:grid-cols-${options.lg}`);
    if (options.xl) classes.push(`xl:grid-cols-${options.xl}`);
    if (options['2xl']) classes.push(`2xl:grid-cols-${options['2xl']}`);

    return classes.join(' ');
}

/**
 * Generate a complete grid class string with columns and gap
 */
export function grid(cols: GridColsOptions, gap: keyof typeof GAP_PRESETS = 'seamless'): string {
    return `${gridCols(cols)} ${GAP_PRESETS[gap]}`;
}

/**
 * Standard grid patterns for common use cases
 */
export const GRID_PATTERNS = {
    /** Services grid: 1 → 2 → 3 columns */
    services: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px',
    /** Features grid: 2 → 4 columns */
    features: 'grid grid-cols-2 lg:grid-cols-4 gap-px',
    /** Blog/Cards grid: 1 → 2 → 3 columns */
    cards: 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px',
    /** FAQ/Content: 1 → 2 columns */
    content: 'grid grid-cols-1 lg:grid-cols-2 gap-px',
    /** Stats bar: 2 → 4 columns */
    stats: 'grid grid-cols-2 md:grid-cols-4 gap-px',
    /** Contact options: 1 → 2 → 4 columns */
    options: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px'
} as const;

/**
 * CSS class for the background grid pattern (visual grid overlay)
 */
export const GRID_BACKGROUND = `absolute inset-0 opacity-10`;
export const GRID_BACKGROUND_STYLE = `background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px); background-size: 64px 64px;`;
