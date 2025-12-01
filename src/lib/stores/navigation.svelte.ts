/**
 * Navigation state store - tracks page transition state globally
 * Used by TransmissionLoader to show loading effect during navigation
 */

let isNavigating = $state(false);

export function getIsNavigating() {
    return isNavigating;
}

export function setNavigating(value: boolean) {
    isNavigating = value;
}

/**
 * Get a random delay between min and max milliseconds
 */
export function getRandomDelay(min: number = 400, max: number = 800): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
