import React from "react";

export default function LegendCornerPanel({ open, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={open ? "Hide legend" : "Show legend"}
      className="absolute bottom-4 right-4 z-20
                 w-11 h-11 rounded-full
                 flex items-center justify-center
                 shadow-lg backdrop-blur-md
                 transition-all duration-150"
      style={{
        background: "rgba(15,17,21,0.82)",
        border: "1px solid rgba(255,255,255,0.08)",
        color: "rgba(255,255,255,0.85)",
      }}
    >
      ⓘ
    </button>
  );
}
