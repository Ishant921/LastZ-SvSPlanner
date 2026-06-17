import { useState, useEffect, useCallback } from "react";
import { useStorage } from "./useStorage";

/**
 * Hook for managing dark mode across the entire website.
 * Saves preference to global storage.
 */
export function useTheme() {
  const globalStorage = useStorage("global");

  const [darkMode, setDarkMode] = useState(() => {
    return globalStorage.load("darkMode", false);
  });

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    globalStorage.save("darkMode", darkMode);
  }, [darkMode, globalStorage]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((prev) => !prev);
  }, []);

  return { darkMode, toggleDarkMode };
}
