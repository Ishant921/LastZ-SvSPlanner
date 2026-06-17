// Shared animation utilities

/**
 * Gets CSS transition string for panel animations.
 * @param {string} property - CSS property to animate
 * @param {number} duration - Duration in ms
 * @returns {string} CSS transition value
 */
export function getTransition(property = "all", duration = 300) {
  return `${property} ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
}

/**
 * CSS class for fade in animation.
 */
export const fadeInClass = "animate-fade-in";

/**
 * CSS class for slide up animation.
 */
export const slideUpClass = "animate-slide-up";

/**
 * CSS class for slide in from right.
 */
export const slideRightClass = "animate-slide-right";
