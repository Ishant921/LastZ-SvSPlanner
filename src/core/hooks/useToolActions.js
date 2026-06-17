import { useState, useCallback, useRef } from "react";

/**
 * Hook for tools to register their actions with the TopBar.
 *
 * How it works:
 * 1. Tool mounts and calls registerTool({ actions, state, toolbar })
 * 2. TopBar reads toolbarConfig and renders buttons
 * 3. User clicks button → TopBar calls the matching action
 * 4. Tool updates state → TopBar updates button appearance (disabled, etc.)
 *
 * Usage inside a tool:
 *   const { registerTool, updateState } = useToolActions();
 *
 *   useEffect(() => {
 *     registerTool({
 *       actions: { undo: handleUndo, export: handleExport },
 *       state: { canUndo: history.length > 0 },
 *       toolbar: [
 *         { id: 'undo', icon: '↩', label: 'Undo', disabled: !history.length },
 *         { id: 'export', icon: '📷', label: 'Export' },
 *       ],
 *     });
 *   }, [history.length]);
 */
export function useToolActions() {
  const [toolConfig, setToolConfig] = useState(null);
  const actionsRef = useRef({});

  const registerTool = useCallback((config) => {
    actionsRef.current = config.actions || {};
    setToolConfig({
      toolbar: config.toolbar || [],
      state: config.state || {},
    });
  }, []);

  const updateState = useCallback((newState) => {
    setToolConfig((prev) =>
      prev ? { ...prev, state: { ...prev.state, ...newState } } : null,
    );
  }, []);

  const executeAction = useCallback((actionId) => {
    const action = actionsRef.current[actionId];
    if (typeof action === "function") {
      action();
    }
  }, []);

  return {
    toolConfig,
    registerTool,
    updateState,
    executeAction,
  };
}
