import React, { useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { useLocation } from "react-router-dom";
import { useTool } from "../context/ToolContext";

/**
 * Top navigation bar.
 *
 * Left side: Hamburger menu (mobile), website title (click to go home)
 * Middle: Tool name + tool-specific action buttons (from ToolContext)
 * Right side: Announcements bell, dark mode toggle, settings
 *
 * On mobile: Tool buttons collapse into overflow menu.
 */
export default function TopBar({ toolConfig }) {
  const location = useLocation();
  const {
    currentTool,
    goHome,
    sidebarOpen,
    toggleSidebar,
    darkMode,
    toggleDarkMode,
    setToolbarAnchor,
  } = useApp();

  const isHome = location.pathname === "/";
  const { toolConfig: activeToolConfig, executeAction } = useTool();
  const toolName = toolConfig?.name || "LastZ Planner";
  const toolbar = activeToolConfig?.toolbar || [];
  const buttonRefs = useRef({});

  useEffect(() => {
    const updateAnchors = () => {
      Object.entries(buttonRefs.current).forEach(([id, element]) => {
        if (!element) return;

        setToolbarAnchor(id, element.getBoundingClientRect());
      });
    };

    updateAnchors();

    window.addEventListener("resize", updateAnchors);

    return () => {
      window.removeEventListener("resize", updateAnchors);
    };
  }, [toolbar, setToolbarAnchor]);

  return (
    <header className="h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 shrink-0">
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-3">
        {/* Hamburger - only show when not on home page */}
        {!isHome && (
          <button
            onClick={toggleSidebar}
            className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center text-lg"
            title="Toggle sidebar"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        )}

        {/* Title - clickable to go home */}
        <button
          onClick={goHome}
          className="flex flex-col items-start hover:opacity-80 transition"
        >
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            LastZ Planner
          </span>
          {!isHome && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {toolName}
            </span>
          )}
        </button>
      </div>

      {/* Middle: Tool-specific buttons */}
      {!isHome && toolbar.length > 0 && (
        <div className="hidden md:flex items-center gap-1">
          {toolbar.map((button) => (
            <button
              key={button.id}
              ref={(el) => {
                buttonRefs.current[button.id] = el;
              }}
              onClick={() => executeAction(button.id)}
              disabled={button.disabled}
              title={button.label}
              className={`px-3 h-9 rounded-xl transition text-sm font-medium ${
                button.danger
                  ? "bg-red-50 dark:bg-red-900/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              } disabled:opacity-30`}
            >
              <span className="mr-1">{button.icon}</span>
              <span className="hidden lg:inline">{button.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Right: Global actions */}
      <div className="flex items-center gap-1">
        {/* Announcements bell */}
        <button
          className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center relative"
          title="Announcements"
        >
          🔔
          {/* Red dot for unread - placeholder */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center"
          title={darkMode ? "Light mode" : "Dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Settings */}
        <button
          className="w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center"
          title="Settings"
        >
          ⚙️
        </button>
      </div>
    </header>
  );
}
