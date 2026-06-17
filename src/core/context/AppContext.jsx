import React, { createContext, useContext, useState, useCallback } from "react";
import { useStorage } from "../hooks/useStorage";
import { useTheme } from "../hooks/useTheme";

// Create the context
const AppContext = createContext(null);

/**
 * Provider for global application state.
 * Wraps the entire app. Provides:
 * - Current tool navigation
 * - Dark mode
 * - Sidebar state
 * - Announcements
 * - Global settings
 */
export function AppProvider({ children }) {
  const globalStorage = useStorage("global");
  const { darkMode, toggleDarkMode } = useTheme();

  // Which tool is currently active ('home' for landing page)
  const [currentTool, setCurrentTool] = useState("home");

  // Sidebar open state (mainly for mobile drawer)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Announcements
  const [announcements, setAnnouncements] = useState(() => {
    return globalStorage.load("announcements", []);
  });

  // Global settings
  const [settings, setSettings] = useState(() => {
    return globalStorage.load("settings", {
      language: "en",
      autoSave: true,
      showTips: true,
    });
  });

  // Navigate to a tool
  const navigateToTool = useCallback((toolId) => {
    setCurrentTool(toolId);
    setSidebarOpen(false);
  }, []);

  // Go home
  const goHome = useCallback(() => {
    setCurrentTool("home");
    setSidebarOpen(false);
  }, []);

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  // Update a setting
  const updateSetting = useCallback(
    (key, value) => {
      setSettings((prev) => {
        const updated = { ...prev, [key]: value };
        globalStorage.save("settings", updated);
        return updated;
      });
    },
    [globalStorage],
  );

  // Mark announcement as read
  const readAnnouncement = useCallback(
    (id) => {
      setAnnouncements((prev) => {
        const updated = prev.map((a) =>
          a.id === id ? { ...a, read: true } : a,
        );
        globalStorage.save("announcements", updated);
        return updated;
      });
    },
    [globalStorage],
  );

  const value = {
    currentTool,
    navigateToTool,
    goHome,
    sidebarOpen,
    toggleSidebar,
    darkMode,
    toggleDarkMode,
    announcements,
    readAnnouncement,
    settings,
    updateSetting,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/**
 * Hook to access global app state.
 * Must be used inside AppProvider.
 */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside AppProvider");
  }
  return context;
}
