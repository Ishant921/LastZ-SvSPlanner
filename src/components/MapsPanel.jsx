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
        transform: open ? "translateX(0)" : "translateX(-220px)",
        transition: "transform 0.3s ease",
      }}
    >
      <div className="w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-r-2xl shadow-lg text-sm">
        <div className="mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Saved Maps</div>

        <button
          onClick={onSave}
          className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl px-3 py-2 text-xs font-semibold transition shadow"
        >
          + Save Current Map
        </button>

        {maps.length === 0 ? (
          <div className="text-xs text-gray-400 dark:text-gray-500 text-center py-4">
            No saved maps yet
          </div>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {maps.map((map) => (
              <div
                key={map}
                className="flex items-center justify-between gap-1 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2"
              >
                <span className="text-xs text-gray-700 dark:text-gray-300 truncate flex-1">{map}</span>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => onLoad(map)}
                    className="px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 transition font-semibold"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => onDelete(map)}
                    className="px-2 py-1 text-xs bg-red-100 dark:bg-red-900/30 text-red-500 rounded-lg hover:bg-red-200 transition"
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
        className="w-8 h-8 bg-white dark:bg-gray-900 border border-l-0 border-gray-200 dark:border-gray-700 rounded-r-xl shadow text-sm flex items-center justify-center flex-shrink-0 mt-2 hover:text-indigo-500 transition"
      >
        📁
      </button>
    </div>
  );
}