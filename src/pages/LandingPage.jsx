import React from "react";
import { toolRegistry } from "../tools";
import { Link } from "react-router-dom"; // ADD THIS

export default function LandingPage() {
  const tools = toolRegistry.getAll();

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-950">
      {/* Hero section */}
      <div className="text-center pt-16 pb-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          LastZ Planner
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Strategy & Tools for LastZ
        </p>
      </div>

      {/* Tool cards grid */}
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <div
              key={tool.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${tool.accent}20` }}
                >
                  {tool.icon}
                </span>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: tool.accent }}
                />
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                {tool.description}
              </p>

              {/* REPLACE THIS BUTTON */}
              <Link to={tool.route}>
                <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-semibold transition">
                  Open Tool
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">
        LastZ Planner v1.0
      </div>
    </div>
  );
}
