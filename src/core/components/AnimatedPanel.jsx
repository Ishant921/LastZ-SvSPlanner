import React from "react";

/**
 * Reusable animated panel wrapper.
 * Slides in from a direction with smooth transition.
 *
 * Props:
 *   - isOpen: boolean - Whether panel is visible
 *   - direction: 'left' | 'right' | 'bottom' | 'top' - Slide direction
 *   - children: React node - Content inside the panel
 *   - className: string - Additional CSS classes
 */
export default function AnimatedPanel({
  isOpen,
  direction = "right",
  children,
  className = "",
}) {
  // Transform values for each direction
  const transforms = {
    left: isOpen ? "translateX(0)" : "translateX(-100%)",
    right: isOpen ? "translateX(0)" : "translateX(100%)",
    bottom: isOpen ? "translateY(0)" : "translateY(100%)",
    top: isOpen ? "translateY(0)" : "translateY(-100%)",
  };

  return (
    <div
      className={`transition-transform duration-300 ease-out ${className}`}
      style={{
        transform: transforms[direction],
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
