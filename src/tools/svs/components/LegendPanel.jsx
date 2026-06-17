// tools/svs/components/LegendPanel.jsx
import React from "react";
import { PALETTE } from "../constants";
import FloatingPanel from "./FloatingPanel";

/**
 * Legend Panel
 *
 * Responsibilities:
 * - Show territory legend
 * - Show hex counts
 * - Rename legend entries
 */
export default function LegendPanel({
  selectedTool,
  legend,
  counts,
  editingLegend,
  editingLegendText,
  setEditingLegend,
  setEditingLegendText,
  onLegendSave,
}) {
  return (
    <FloatingPanel label="Legend" width="w-64" defaultOpen={true}>
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

      {/* Name */}
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

      {/* Count */}
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
