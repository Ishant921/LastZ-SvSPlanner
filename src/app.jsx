import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "./core/context/AppContext";
import { ToolProvider } from "./core/context/ToolContext";
import { toolRegistry } from "./tools";
import Layout from "./core/layout/Layout";
import LandingPage from "./pages/LandingPage";
import ErrorBoundary from "./core/components/ErrorBoundary";
import NotFoundPage from "./pages/NotFoundPage";

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
  const tools = toolRegistry.getAll();

  return (
    <Routes>
      {/* Landing page */}
      <Route
        path="/"
        element={
          <Layout toolConfig={null}>
            <LandingPage />
          </Layout>
        }
      />

      {/* Tool routes - auto-generated from registry */}
      {tools.map((tool) => (
        <Route
          key={tool.id}
          path={tool.route}
          element={
            <Layout toolConfig={tool}>
              <ActiveTool toolId={tool.id} />
            </Layout>
          }
        />
      ))}

      {/* Settings page */}
      <Route
        path="/settings"
        element={
          <Layout toolConfig={null}>
            <div className="flex items-center justify-center h-full">
              Settings page coming soon
            </div>
          </Layout>
        }
      />

      {/* 404 - redirect to home */}
      <Route
        path="*"
        element={
          <Layout toolConfig={null}>
            <NotFoundPage />
          </Layout>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ToolProvider>
          <AppInner />
        </ToolProvider>
      </AppProvider>
    </BrowserRouter>
  );
}
