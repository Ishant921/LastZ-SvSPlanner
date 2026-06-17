import SvsPlanner from "./SvsPlanner";

/**
 * SvS Planner tool configuration.
 * This is the "info card" that describes the tool to the website.
 */
export const svsTool = {
  id: "svs",
  route: "/svs", // NEW
  name: "SvS Planner",
  icon: "🗺️",
  description:
    "Plan territory control for State vs State battles with an interactive hex grid.",
  accent: "#4ade80",
  component: SvsPlanner,
};

// Default export for convenience
export { default } from "./SvsPlanner";
export { default as SvsPlanner } from "./SvsPlanner";
