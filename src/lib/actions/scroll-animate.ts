/**
 * Scroll Animation Action
 * 
 * A Svelte action that triggers CSS animations when elements enter the viewport.
 * Uses Intersection Observer for performant scroll-based animations.
 * 
 * @module scroll-animate
 * 
 * @example
 * ```svelte
 * <script>
 *   import { scrollAnimate } from '$lib/actions/scroll-animate';
 * </script>
 * 
 * <!-- Basic fade in -->
 * <div use:scrollAnimate>Content fades in</div>
 * 
 * <!-- With options -->
 * <div use:scrollAnimate={{ animation: 'slide-left', delay: 200, threshold: 0.3 }}>
 *   Slides in from left
 * </div>
 * 
 * <!-- Staggered children -->
 * <div use:scrollAnimate={{ animation: 'stagger' }}>
 *   <div>Child 1</div>
 *   <div>Child 2</div>
 *   <div>Child 3</div>
 * </div>
 * ```
 */

export type AnimationType =
    | 'fade'        // Fade in from bottom (default)
    | 'slide-left'  // Slide in from left
    | 'slide-right' // Slide in from right
    | 'scale'       // Scale up from smaller
    | 'stagger';    // Stagger children animations

export interface ScrollAnimateOptions {
    /**
     * Type of animation to apply
     * @default 'fade'
     */
    animation?: AnimationType;

    /**
     * Delay before animation starts (in ms)
     * @default 0
     */
    delay?: number;

    /**
     * How much of the element must be visible to trigger (0-1)
     * @default 0.1
     */
    threshold?: number;

    /**
     * Whether animation should replay when element leaves and re-enters viewport
     * @default false
     */
    repeat?: boolean;

    /**
     * Root margin for intersection observer (CSS margin syntax)
     * @default '0px 0px -50px 0px'
     */
    rootMargin?: string;

    /**
     * Whether the element starts visible (useful for above-the-fold content)
     * @default false
     */
    startVisible?: boolean;

    /**
     * Only animate when user has scrolled down from top (prevents animation on page load when navigating mid-page)
     * @default true
     */
    onlyOnScrollDown?: boolean;
}

const animationClasses: Record<AnimationType, string> = {
    'fade': 'fade-in-section',
    'slide-left': 'slide-in-left',
    'slide-right': 'slide-in-right',
    'scale': 'scale-in',
    'stagger': 'stagger-children'
};

/**
 * Svelte action for scroll-triggered animations
 */
export function scrollAnimate(node: HTMLElement, options: ScrollAnimateOptions = {}) {
    const {
        animation = 'fade',
        delay = 0,
        threshold = 0.1,
        repeat = false,
        rootMargin = '0px 0px -50px 0px',
        startVisible = false,
        onlyOnScrollDown = true
    } = options;

    const animationClass = animationClasses[animation];

    // Add the animation class
    node.classList.add(animationClass);

    // Apply delay if specified
    if (delay > 0) {
        node.style.transitionDelay = `${delay}ms`;
    }

    // If startVisible, immediately show
    if (startVisible) {
        node.classList.add('visible');
        return { destroy() { } };
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        node.classList.add('visible');
        return { destroy() { } };
    }

    let hasAnimated = false;
    let userHasScrolled = !onlyOnScrollDown; // If onlyOnScrollDown is false, consider user has scrolled
    let initialScrollY = window.scrollY;

    // Track if user has scrolled down from initial position
    const handleScroll = () => {
        if (window.scrollY > initialScrollY + 50) {
            userHasScrolled = true;
            window.removeEventListener('scroll', handleScroll);
        }
    };

    // If page loads at top, immediately allow animations
    if (initialScrollY < 100) {
        userHasScrolled = true;
    } else if (onlyOnScrollDown) {
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && userHasScrolled) {
                    if (!hasAnimated || repeat) {
                        // Small delay to ensure CSS is applied
                        requestAnimationFrame(() => {
                            node.classList.add('visible');
                        });
                        hasAnimated = true;
                    }
                } else if (repeat && hasAnimated) {
                    node.classList.remove('visible');
                }
            });
        },
        {
            threshold,
            rootMargin
        }
    );

    observer.observe(node);

    return {
        update(newOptions: ScrollAnimateOptions) {
            // Handle option updates if needed
            if (newOptions.delay !== undefined && newOptions.delay !== delay) {
                node.style.transitionDelay = `${newOptions.delay}ms`;
            }
        },
        destroy() {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
            if (delay > 0) {
                node.style.transitionDelay = '';
            }
        }
    };
}

/**
 * Batch observer for multiple elements (more performant)
 * Use this when you have many elements to animate
 */
export function createScrollAnimateObserver(options: Omit<ScrollAnimateOptions, 'animation'> = {}) {
    const {
        threshold = 0.1,
        repeat = false,
        rootMargin = '0px 0px -50px 0px'
    } = options;

    const prefersReducedMotion = typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(() => {
                        entry.target.classList.add('visible');
                    });
                    if (!repeat) {
                        observer.unobserve(entry.target);
                    }
                } else if (repeat) {
                    entry.target.classList.remove('visible');
                }
            });
        },
        {
            threshold,
            rootMargin
        }
    );

    return {
        observe(element: HTMLElement, animation: AnimationType = 'fade') {
            element.classList.add(animationClasses[animation]);

            if (prefersReducedMotion) {
                element.classList.add('visible');
                return;
            }

            observer.observe(element);
        },
        unobserve(element: HTMLElement) {
            observer.unobserve(element);
        },
        disconnect() {
            observer.disconnect();
        }
    };
}

export default scrollAnimate;
