// Global constants for the LastZ Planner website

// Tool list - each tool registers here
export const TOOLS = [];

// Animation presets
export const ANIMATION = {
  panelSlide: {
    duration: 300,
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  fadeIn: {
    duration: 200,
    easing: "ease-out",
  },
  toast: {
    duration: 300,
    delay: 2000,
  },
};

// Loading screen tips
export const LOADING_TIPS = [
  "Did you know? Press Ctrl+Z to undo!",
  "Tip: Use number keys 1-7 to quickly select colors.",
  "Tip: Pinch to zoom on mobile devices.",
  "Tip: Long press on mobile to access more options.",
  "Did you know? Your data is saved automatically.",
  "Tip: Drag with two fingers to pan the map.",
  "Tip: Click the website title to return home.",
];

// Breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
};

// Storage prefixes
export const STORAGE_PREFIX = "lastz";
