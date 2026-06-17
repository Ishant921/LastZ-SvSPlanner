import React, { useState } from "react";
import { AppProvider } from "./core/context/AppContext";
import { useApp } from "./core/context/AppContext";
import { toolRegistry } from "./tools";
import Layout from "./core/layout/Layout";
import LandingPage from "./pages/LandingPage";
import ErrorBoundary from "./core/components/ErrorBoundary";

function ActiveTool({ toolId }) {
  const [errorKey, setErrorKey] = useState(0);
  const tool = toolRegistry.getById(toolId);

  if (!tool) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Tool not found: {toolId}
      </div>
    );
  }

  return (
    <ErrorBoundary key={errorKey} onReset={() => setErrorKey((k) => k + 1)}>
      <tool.component />
    </ErrorBoundary>
  );
}

function AppInner() {
  const { currentTool } = useApp();
  const isHome = currentTool === "home";

  return (
    <Layout toolConfig={isHome ? null : toolRegistry.getById(currentTool)}>
      {isHome ? <LandingPage /> : <ActiveTool toolId={currentTool} />}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
