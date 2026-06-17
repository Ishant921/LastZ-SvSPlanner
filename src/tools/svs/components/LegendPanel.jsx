// tools/svs/components/LegendPanel.jsx
import React from "react";
import { PALETTE, ERASER, LABEL_TOOL } from "../constants";
import FloatingPanel from "./FloatingPanel";

/**
 * Redesigned LegendPanel — Linear/Figma HUD style.
 *
 * Changes:
 * - Dark frosted glass surface (via FloatingPanel)
 * - Color swatches in a tighter grid with checkmark active state
 * - Eraser/Label as icon-only pill buttons
 * - Legend rows use a 2px left color bar instead of a dot square
 * - Hex counts in a monospaced badge on the right
 * - Section dividers use subtle opacity lines
 */
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
  return (
    <FloatingPanel
      label="Tools & Legend"
      width="w-64"
      position="right"
      defaultOpen={true}
      top="top-4"
    >
      {/* Color palette grid */}
      <div className="grid grid-cols-7 gap-1.5 mb-3">
        {PALETTE.map((color) => (
          <ColorSwatch
            key={color}
            color={color}
            isActive={selectedTool === color}
            onClick={() => setSelectedTool(color)}
          />
        ))}
      </div>

      {/* Eraser + Label tools */}
      <div className="flex gap-1.5 mb-3">
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

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.06)",
          marginBottom: "10px",
        }}
      />

      {/* Legend rows */}
      <div className="space-y-1">
        {PALETTE.map((color) => (
          <LegendRow
            key={color}
            color={color}
            name={legend[color]}
            count={counts[color] || 0}
            isActive={selectedTool === color}
            isEditing={editingLegend === color}
            editingText={editingLegendText}
            onStartEdit={() => {
              setEditingLegend(color);
              setEditingLegendText(legend[color] || "");
            }}
            onTextChange={setEditingLegendText}
            onSave={() => onLegendSave(color, editingLegendText)}
          />
        ))}
      </div>
    </FloatingPanel>
  );
}

/** Color swatch with checkmark active state */
function ColorSwatch({ color, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ background: color }}
      className="relative flex items-center justify-center rounded-md transition-all duration-150"
      title={color}
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

/** Eraser / Label tool button */
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

/** Legend row with left color bar and inline editing */
function LegendRow({
  color,
  name,
  count,
  isActive,
  isEditing,
  editingText,
  onStartEdit,
  onTextChange,
  onSave,
}) {
  return (
    <div
      className="flex items-center gap-2 rounded-md transition-all duration-100"
      style={{
        padding: "5px 6px 5px 0",
        background: isActive ? "rgba(255,255,255,0.05)" : "transparent",
        borderRadius: "5px",
      }}
    >
      {/* Left color bar */}
      <div
        style={{
          width: "3px",
          height: "18px",
          borderRadius: "2px",
          background: color,
          flexShrink: 0,
          marginLeft: "2px",
          opacity: count > 0 ? 1 : 0.35,
        }}
      />

      {/* Name — editable inline */}
      {isEditing ? (
        <input
          autoFocus
          value={editingText}
          onChange={(e) => onTextChange(e.target.value)}
          onBlur={onSave}
          onKeyDown={(e) => e.key === "Enter" && onSave()}
          className="flex-1 outline-none rounded px-1"
          style={{
            fontSize: "11px",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(99,102,241,0.5)",
            color: "rgba(255,255,255,0.9)",
            padding: "2px 6px",
            borderRadius: "4px",
          }}
        />
      ) : (
        <span
          onClick={onStartEdit}
          className="flex-1 truncate cursor-text"
          style={{
            fontSize: "11px",
            color:
              count > 0 ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.3)",
            fontWeight: count > 0 ? 500 : 400,
          }}
          title="Click to rename"
        >
          {name || (
            <span style={{ fontStyle: "italic", opacity: 0.4 }}>Unnamed</span>
          )}
        </span>
      )}

      {/* Hex count badge */}
      <span
        style={{
          fontSize: "10px",
          fontFamily: "ui-monospace, monospace",
          color:
            count > 0 ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.12)",
          minWidth: "20px",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {count > 0 ? count : "–"}
      </span>
    </div>
  );
}
