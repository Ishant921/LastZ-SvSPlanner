import React from "react";

export default function BrushPanel({ brushSize, setBrushSize }) {
  return (
    <div className="absolute top-16 left-4 bg-white/80 backdrop-blur px-4 py-3 rounded-xl shadow text-sm z-10">
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
  );
}
