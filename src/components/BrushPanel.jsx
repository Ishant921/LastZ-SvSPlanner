import React, { useState } from "react";

export default function BrushPanel({ brushSize, setBrushSize }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="absolute top-16 left-0 z-10 flex items-start">
      <div
        style={{
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
        className="bg-white/80 backdrop-blur px-4 py-3 rounded-r-xl shadow text-sm"
      >
        <div className="mb-1 font-semibold">Brush: {brushSize}</div>
        <input
          type="range"
          min="1"
          max="5"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-24"
        />
      </div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 bg-white/80 backdrop-blur rounded-r-xl shadow text-sm flex items-center justify-center flex-shrink-0 mt-1"
      >
        🖌️
      </button>
    </div>
  );
}
