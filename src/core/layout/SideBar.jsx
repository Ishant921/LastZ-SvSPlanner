import React from "react";
import { useApp } from "../context/AppContext";
import { toolRegistry } from "../../tools";

/**
 * Sidebar navigation for switching between tools.
 *
 * PC: Fixed vertical strip on the left with icons and tool names.
 * Mobile: Slide-out drawer from the left with full overlay.
 */
export default function SideBar() {
  const { currentTool, navigateToTool, sidebarOpen, toggleSidebar } = useApp();

  const tools = toolRegistry.getAll();

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col z-40 transition-all duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed inset-y-0 left-0 w-64 md:translate-x-0 md:static md:w-16 lg:w-64
        `}
      >
        {/* Tool list */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {tools.map((tool) => {
            const isActive = currentTool === tool.id;

            return (
              <button
                key={tool.id}
                onClick={() => navigateToTool(tool.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left
                  ${
                    isActive
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                {/* Icon with accent dot */}
                <span className="relative text-xl">
                  {tool.icon}
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-900"
                    style={{ backgroundColor: tool.accent }}
                  />
                </span>

                {/* Name - hidden on md, shown on lg */}
                <span className="font-medium text-sm md:hidden lg:block">
                  {tool.name}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Bottom: Home button */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => navigateToTool("home")}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-left
              ${
                currentTool === "home"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }
            `}
          >
            <span className="text-xl">🏠</span>
            <span className="font-medium text-sm md:hidden lg:block">Home</span>
          </button>
        </div>
      </aside>
    </>
  );
}
