import { useState, useEffect } from "react";

/**
 * Hook to detect if a CSS media query matches.
 * Useful for responsive design without CSS-in-JS.
 *
 * Usage:
 *   const isMobile = useMediaQuery("(max-width: 768px)");
 *   const isDark = useMediaQuery("(prefers-color-scheme: dark)");
 *
 * @param {string} query - CSS media query string
 * @returns {boolean} Whether the query currently matches
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);

    const handleChange = (e) => {
      setMatches(e.matches);
    };

    // Modern browsers
    media.addEventListener("change", handleChange);
    // Initial check
    setMatches(media.matches);

    return () => {
      media.removeEventListener("change", handleChange);
    };
  }, [query]);

  return matches;
}
