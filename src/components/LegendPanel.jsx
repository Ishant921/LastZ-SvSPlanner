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
  className="absolute top-16 right-0 z-10 flex items-start transition-transform duration-300"
  style={{
    transform: open ? "translateX(0)" : "translateX(280px)",
  }}
>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 bg-white/80 backdrop-blur rounded-l-xl shadow text-sm flex items-center justify-center flex-shrink-0 mt-1"
      >
        🗺️
      </button>
      <div
        className="w-72 bg-white/80 backdrop-blur px-4 py-3 rounded-l-xl shadow text-sm max-h-[70vh] overflow-y-auto"
      >
        <div className="mb-2 font-semibold">Tools</div>
        <div className="flex gap-2 mb-3 flex-wrap">
          {PALETTE.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedTool(c)}
              style={{ background: c }}
              className={`w-7 h-7 rounded ${selectedTool === c ? "ring-2 ring-black scale-110" : ""}`}
            />
          ))}
          <button
            onClick={() => setSelectedTool(ERASER)}
            className={`w-7 h-7 rounded border-2 border-gray-400 bg-white text-xs ${selectedTool === ERASER ? "ring-2 ring-black scale-110" : ""}`}
          >
            ✕
          </button>
          <button
            onClick={() => setSelectedTool(LABEL_TOOL)}
            className={`w-7 h-7 rounded border-2 border-gray-400 bg-white text-xs font-bold ${selectedTool === LABEL_TOOL ? "ring-2 ring-black scale-110" : ""}`}
          >
            T
          </button>
        </div>

        <div className="mb-2 font-semibold">Legend</div>
        <div className="space-y-1">
          {PALETTE.map((color) => (
            <div key={color} className="flex items-center gap-2">
              <div className="w-4 h-4 rounded flex-shrink-0" style={{ background: color }} />
              {editingLegend === color ? (
                <input
                  autoFocus
                  className="text-xs border rounded px-1 py-0.5 w-24"
                  value={editingLegendText}
                  onChange={(e) => setEditingLegendText(e.target.value)}
                  onBlur={() => onLegendSave(color, editingLegendText)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onLegendSave(color, editingLegendText);
                  }}
                />
              ) : (
                <span
                  className="text-xs cursor-pointer hover:underline"
                  onClick={() => {
                    setEditingLegend(color);
                    setEditingLegendText(legend[color] || "");
                  }}
                >
                  {legend[color] || "Tap to name"}
                </span>
              )}
              <span className="text-xs text-gray-400 ml-auto">{counts[color] || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
