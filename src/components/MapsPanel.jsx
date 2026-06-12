import React, { useState, useEffect } from "react";
import { getSavedMaps } from "../utils/mapStorage";

export default function MapsPanel({ onSave, onLoad, onDelete, refreshKey }) {
  const [open, setOpen] = useState(true);
  const [maps, setMaps] = useState([]);

  useEffect(() => {
  setMaps(getSavedMaps());
}, [refreshKey]);

  return (
    <div
  className="absolute top-64 left-0 z-10 flex items-start"
  style={{
    transform: open ? "translateX(0)" : "translateX(calc(-100% + 32px))",
    transition: "transform 0.3s ease",
  }}
>
      <div
        className="bg-white/80 backdrop-blur px-4 py-3 rounded-r-xl shadow text-sm min-w-[220px]"
      >
        <div className="font-semibold mb-2">Maps</div>

        <button
  onClick={onSave}
  className="w-full mb-3 bg-gray-100 rounded px-2 py-1"
>
  + Save Current
</button>

        {maps.length === 0 ? (
  <div className="text-xs text-gray-500">
    No saved maps yet
  </div>
) : (
  <div className="space-y-2">
    {maps.map((map) => (
      
    <div
  key={map}
  className="text-sm border rounded px-2 py-1 flex items-center justify-between gap-2"
>
  <span>{map}</span>

  <div className="flex gap-1">
    <button
  onClick={() => onLoad(map)}
  className="px-2 py-1 text-xs bg-gray-100 rounded"
>
  Load
</button>

    <button
  onClick={() => onDelete(map)}
  className="px-2 py-1 text-xs bg-red-100 rounded"
>
  🗑
</button>
  </div>
</div>
    ))}
  </div>
)}
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 bg-white/80 backdrop-blur rounded-r-xl shadow text-sm flex items-center justify-center flex-shrink-0 mt-1"
      >
        📁
      </button>
    </div>
  );
}