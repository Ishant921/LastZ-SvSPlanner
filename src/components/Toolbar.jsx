import React from "react";

export default function Toolbar({ onUndo, canUndo, onExport, exporting, onHideUI, onReset }) {
  return (
    <div className="absolute top-4 left-4 right-8 flex gap-2 flex-wrap z-10">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="bg-white/80 backdrop-blur px-3 py-2 rounded-xl shadow text-sm disabled:opacity-40"
      >
        ↩ 
      </button>
      <button
        onClick={onExport}
        disabled={exporting}
        className="bg-white/80 backdrop-blur px-3 py-2 rounded-xl shadow text-sm disabled:opacity-40"
        title="Export as PNG"
      >
        {exporting ? "..." : "📷"}
      </button>
      <button
        onClick={onHideUI}
        className="bg-white/80 backdrop-blur px-3 py-2 rounded-xl shadow text-sm"
        title="Hide UI for 4 seconds"
      >
        🙈
      </button>
      <button
        onClick={onReset}
        className="bg-white/80 backdrop-blur px-3 py-2 rounded-xl shadow text-sm text-red-500"
        title="Reset map"
      >
        🗑
      </button>
    </div>
  );
}
