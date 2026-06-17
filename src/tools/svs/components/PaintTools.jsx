import React from "react";
import { PALETTE, ERASER, LABEL_TOOL } from "../constants";

/**
 * Paint tool controls:
 * - Color palette
 * - Eraser
 * - Label tool
 *
 * Used by the Paint panel.
 */
export default function PaintTools({ selectedTool, setSelectedTool }) {
  return (
    <>
      {/* Color palette */}
      <div className="grid grid-cols-5 gap-1.5 mb-3">
        {PALETTE.map((color) => (
          <ColorSwatch
            key={color}
            color={color}
            isActive={selectedTool === color}
            onClick={() => setSelectedTool(color)}
          />
        ))}
      </div>

      {/* Eraser + Label */}
      <div className="flex gap-1.5">
        <SpecialTool
          label="Eraser"
          icon={
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 10L5 7M10 2L5 7M5 7L7 10H10M5 7L2 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          }
          isActive={selectedTool === ERASER}
          onClick={() => setSelectedTool(ERASER)}
        />

        <SpecialTool
          label="Label"
          icon={
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 9.5V8L7.5 2.5L9.5 4.5L4 10H2.5L2 9.5Z"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.5 3.5L8.5 5.5"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          }
          isActive={selectedTool === LABEL_TOOL}
          onClick={() => setSelectedTool(LABEL_TOOL)}
        />
      </div>
    </>
  );
}

function ColorSwatch({ color, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      title={color}
      className="relative flex items-center justify-center rounded-md transition-all duration-150"
      style={{
        background: color,
        width: "28px",
        height: "28px",
        borderRadius: "6px",
        border: isActive
          ? "2px solid rgba(255,255,255,0.9)"
          : "2px solid transparent",
        transform: isActive ? "scale(1.08)" : "scale(1)",
        boxShadow: isActive
          ? `0 0 0 2px ${color}55, 0 2px 8px ${color}44`
          : "none",
        transition: "all 0.15s ease",
        flexShrink: 0,
      }}
    >
      {isActive && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M2 5L4 7L8 3"
            stroke="rgba(0,0,0,0.7)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

function SpecialTool({ label, icon, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-1.5 rounded-md transition-all duration-150"
      title={label}
      style={{
        height: "28px",
        fontSize: "11px",
        fontWeight: 500,
        background: isActive
          ? "rgba(99, 102, 241, 0.25)"
          : "rgba(255,255,255,0.06)",
        border: isActive
          ? "1px solid rgba(99, 102, 241, 0.5)"
          : "1px solid rgba(255,255,255,0.08)",
        color: isActive ? "rgb(165, 180, 252)" : "rgba(255,255,255,0.45)",
        transition: "all 0.15s ease",
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
