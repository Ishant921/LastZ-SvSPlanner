import React, { createContext, useContext } from "react";
import { useToolActions } from "../hooks/useToolActions";

// Create the context
const ToolContext = createContext(null);

/**
 * Provider for the currently active tool's actions and state.
 * Wraps the tool component. Provides:
 * - Tool action registration
 * - Toolbar configuration
 * - Action execution
 */
export function ToolProvider({ children }) {
  const toolActions = useToolActions();

  return (
    <ToolContext.Provider value={toolActions}>{children}</ToolContext.Provider>
  );
}

/**
 * Hook to access the current tool's actions.
 * Must be used inside ToolProvider.
 */
export function useTool() {
  const context = useContext(ToolContext);
  if (!context) {
    throw new Error("useTool must be used inside ToolProvider");
  }
  return context;
}
