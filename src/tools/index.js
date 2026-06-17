import { svsTool } from "./svs";

/**
 * Central registry for all tools.
 * Each tool exports a config object with its metadata and component.
 *
 * To add a new tool:
 * 1. Create a new folder in tools/
 * 2. Export a tool config from tools/[new-tool]/index.js
 * 3. Import it here and add to the registry
 */

const tools = [
  svsTool,
  // Future tools go here:
  // calculatorTool,
  // labPlannerTool,
  // badgesTool,
  // modVehicleTool,
  // infoTool,
  // guidesTool,
];

/**
 * Tool registry - provides methods to query available tools.
 */
export const toolRegistry = {
  getAll() {
    return tools;
  },
  getById(id) {
    return tools.find((tool) => tool.id === id) || null;
  },
  has(id) {
    return tools.some((tool) => tool.id === id);
  },
  // ADD THIS METHOD:
  getByRoute(route) {
    return tools.find((tool) => tool.route === route) || null;
  },
};

// Also export individual tools for direct imports
export { svsTool } from "./svs";
