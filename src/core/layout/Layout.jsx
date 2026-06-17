import React from "react";
import { useLocation } from "react-router-dom";
import TopBar from "./TopBar";
import SideBar from "./SideBar";
import BottomPanel from "./BottomPanel";

/**
 * The main application shell.
 *
 * Landing page: Full screen, no sidebar, no bottom panel.
 * Tool page: Sidebar + content area + bottom panel.
 *
 * Props:
 *   - children: The current page/tool component
 *   - toolConfig: Toolbar configuration from the active tool
 */
export default function Layout({ children, toolConfig }) {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* TopBar - always visible */}
      <TopBar toolConfig={toolConfig} />

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - hidden on landing page */}
        {!isHome && <SideBar />}

        {/* Content area */}
        <main className="flex-1 relative overflow-hidden">{children}</main>
      </div>

      {/* Bottom panel - hidden on landing page */}
      {!isHome && <BottomPanel />}
    </div>
  );
}
