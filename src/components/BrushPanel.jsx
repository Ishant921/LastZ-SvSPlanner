import React, { useState } from "react";

export default function BrushPanel({ brushSize, setBrushSize }) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className="absolute top-20 left-0 z-10 flex items-start"
      style={{
        transform: open ? "translateX(0)" : "translateX(-148px)",
        transition: "transform 0.3s ease",
      }}
    >
      <div className="w-36 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-r-2xl shadow-lg text-sm">
        <div className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Brush</div>
        <div className="flex items-center justify-between mb-2">
          {[1,2,3,4,5].map((v) => (
            <button
              key={v}
              onClick={() => setBrushSize(v)}
              className={`w-6 h-6 rounded-lg text-xs font-bold transition ${
                brushSize === v
                  ? "bg-indigo-500 text-white shadow"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 bg-white dark:bg-gray-900 border border-l-0 border-gray-200 dark:border-gray-700 rounded-r-xl shadow text-sm flex items-center justify-center flex-shrink-0 mt-2 hover:text-indigo-500 transition"
      >
        🖌️
      </button>
    </div>
  );
}