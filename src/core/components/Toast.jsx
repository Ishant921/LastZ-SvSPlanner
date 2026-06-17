import React from "react";

/**
 * Toast notification component.
 * Shows a temporary message at the top-right of the screen.
 *
 * Props:
 *   - toast: { message: string, type: 'success' | 'danger' | 'info' | 'default' } | null
 */
export default function Toast({ toast }) {
  const backgroundColors = {
    success: "bg-green-500",
    danger: "bg-red-500",
    info: "bg-blue-500",
    default: "bg-white dark:bg-gray-800",
  };

  const textColors = {
    success: "text-white",
    danger: "text-white",
    info: "text-white",
    default: "text-gray-800 dark:text-gray-200",
  };

  const bgClass = backgroundColors[toast?.type || "default"];
  const textClass = textColors[toast?.type || "default"];

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        toast
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-8 pointer-events-none"
      }`}
    >
      <div
        className={`${bgClass} ${textClass} shadow-lg rounded-xl px-4 py-3 text-sm font-medium`}
      >
        {toast?.message}
      </div>
    </div>
  );
}
