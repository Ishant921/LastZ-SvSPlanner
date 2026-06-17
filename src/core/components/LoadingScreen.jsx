import React, { useMemo } from "react";
import { LOADING_TIPS } from "../utils/constants";

/**
 * Loading screen shown while a tool is loading.
 * Displays a spinner, tool name, and a random helpful tip.
 *
 * Props:
 *   - toolName: string - Name of the tool being loaded
 */
export default function LoadingScreen({ toolName }) {
  // Pick a random tip that stays consistent during this load
  const tip = useMemo(() => {
    const index = Math.floor(Math.random() * LOADING_TIPS.length);
    return LOADING_TIPS[index];
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 z-40">
      {/* Spinner */}
      <div className="w-12 h-12 border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-500 rounded-full animate-spin mb-6" />

      {/* Tool name */}
      <div className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Loading {toolName}...
      </div>

      {/* Tip */}
      <div className="text-sm text-gray-500 dark:text-gray-400 max-w-md text-center px-4">
        {tip}
      </div>
    </div>
  );
}
