import React, { useState } from "react";

export default function Toolbar({ onUndo, canUndo, onExport, exporting, onHideUI, onReset }) {
  const [open, setOpen] = useState(true);

  return (
    <div
  className="absolute top-0 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center transition-transform duration-300"
  style={{
    transform: open
      ? "translate(-50%, 0)"
      : "translate(-50%, -44px)",
  }}
>
      <div
        className="bg-white/80 backdrop-blur px-3 py-2 rounded-b-xl shadow flex gap-2"
      >
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="px-3 py-1 rounded-lg bg-gray-100 text-sm disabled:opacity-40"
        >
          ↩
        </button>
        <button
          onClick={onExport}
          disabled={exporting}
          className="px-3 py-1 rounded-lg bg-gray-100 text-sm disabled:opacity-40"
        >
          {exporting ? "..." : "📷"}
        </button>
        <button
          onClick={onHideUI}
          className="px-3 py-1 rounded-lg bg-gray-100 text-sm"
        >
          🙈
        </button>
        <button
          onClick={onReset}
          className="px-3 py-1 rounded-lg bg-gray-100 text-sm text-red-500"
        >
          🗑
        </button>
      </div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 bg-white/80 backdrop-blur rounded-b-xl shadow text-sm flex items-center justify-center"
      >
        ⚙️
      </button>
    </div>
  );
}
