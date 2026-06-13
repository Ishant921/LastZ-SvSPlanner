import React, { useState } from "react";
import { PALETTE, ERASER, LABEL_TOOL } from "../constants";

export default function LegendPanel({
  selectedTool,
  setSelectedTool,
  legend,
  counts,
  editingLegend,
  editingLegendText,
  setEditingLegend,
  setEditingLegendText,
  onLegendSave,
}) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className="absolute top-20 right-0 z-10 flex items-start"
      style={{
        transform: open ? "translateX(0)" : "translateX(280px)",
        transition: "transform 0.3s ease",
      }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 bg-white dark:bg-gray-900 border border-r-0 border-gray-200 dark:border-gray-700 rounded-l-xl shadow text-sm flex items-center justify-center flex-shrink-0 mt-2 hover:text-indigo-500 transition"
      >
        🗺️
      </button>
      <div className="w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-l-2xl shadow-lg text-sm max-h-[75vh] overflow-y-auto">
        
        {/* Tools section */}
        <div className="mb-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Tools</div>
        <div className="flex gap-2 mb-4 flex-wrap">
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedTool(c)}
              style={{ background: c }}
              className={`w-8 h-8 rounded-xl transition ${
                selectedTool === c
                  ? "ring-2 ring-indigo-500 ring-offset-2 scale-110 shadow"
                  : "hover:scale-105 opacity-80 hover:opacity-100"
              }`}
            />
          ))}
          <button
            onClick={() => setSelectedTool(ERASER)}
            className={`w-8 h-8 rounded-xl border-2 transition text-sm ${
              selectedTool === ERASER
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900 text-indigo-600 ring-2 ring-indigo-500 ring-offset-2 scale-110"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-indigo-400"
            }`}
            title="Eraser"
          >
            ✕
          </button>
          <button
            onClick={() => setSelectedTool(LABEL_TOOL)}
            className={`w-8 h-8 rounded-xl border-2 transition text-sm font-bold ${
              selectedTool === LABEL_TOOL
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900 text-indigo-600 ring-2 ring-indigo-500 ring-offset-2 scale-110"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:border-indigo-400"
            }`}
            title="Label tool"
          >
            T
          </button>
        </div>

        <div className="w-full h-px bg-gray-100 dark:bg-gray-800 mb-3" />

        {/* Legend section */}
        <div className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Legend</div>
        <div className="space-y-2">
          {PALETTE.map((color) => (
            <div key={color} className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded flex-shrink-0 shadow-sm"
                style={{ background: color }}
              />
              {editingLegend === color ? (
                <input
                  autoFocus
                  className="text-xs border border-indigo-300 rounded-lg px-2 py-1 flex-1 outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-gray-200 dark:border-indigo-700"
                  value={editingLegendText}
                  onChange={(e) => setEditingLegendText(e.target.value)}
                  onBlur={() => onLegendSave(color, editingLegendText)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onLegendSave(color, editingLegendText);
                  }}
                />
              ) : (
                <span
                  className="text-xs text-gray-700 dark:text-gray-300 cursor-pointer hover:text-indigo-500 dark:hover:text-indigo-400 flex-1 truncate"
                  onClick={() => {
                    setEditingLegend(color);
                    setEditingLegendText(legend[color] || "");
                  }}
                >
                  {legend[color] || <span className="text-gray-400 italic">Tap to name</span>}
                </span>
              )}
              <span className="text-xs text-gray-400 dark:text-gray-500 font-mono ml-auto flex-shrink-0">
                {counts[color] || 0}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}