import React from "react";

/**
 * Thin status bar at the bottom of the screen.
 * Shows version info and subtle status messages.
 */
export default function BottomPanel() {
  return (
    <footer className="h-8 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 text-xs text-gray-400 dark:text-gray-500 shrink-0">
      <span>LastZ Planner v1.0</span>
      <span>Ready</span>
    </footer>
  );
}
