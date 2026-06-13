import React, { useState } from "react";

export default function Toolbar({ onUndo, canUndo, onExport, exporting, onHideUI, onReset, darkMode, setDarkMode }) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className="absolute top-0 left-1/2 z-20 flex flex-col items-center"
      style={{
        transform: open ? "translate(-50%, 0)" : "translate(-50%, -48px)",
        transition: "transform 0.3s ease",
      }}
    >
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2 rounded-b-2xl shadow-lg flex gap-2 items-center">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center text-base disabled:opacity-30 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition"
          title="Undo"
        >
          ↩
        </button>
        <button
          onClick={onExport}
          disabled={exporting}
          className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center text-base disabled:opacity-30 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition"
          title="Export as PNG"
        >
          {exporting ? "⏳" : "📷"}
        </button>
        <button
          onClick={onHideUI}
          className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center text-base hover:bg-indigo-50 dark:hover:bg-indigo-900 transition"
          title="Hide UI"
        >
          🙈
        </button>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
        <button
          onClick={() => setDarkMode((v) => !v)}
          className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 flex items-center justify-center text-base hover:bg-indigo-50 dark:hover:bg-indigo-900 transition"
          title="Toggle dark mode"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />
        <button
          onClick={onReset}
          className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-500 flex items-center justify-center text-base hover:bg-red-100 dark:hover:bg-red-900/50 transition"
          title="Reset map"
        >
          🗑
        </button>
      </div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-7 bg-white dark:bg-gray-900 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-xl shadow text-xs flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-indigo-500 transition"
      >
        ⚙️
      </button>
    </div>
  );
}