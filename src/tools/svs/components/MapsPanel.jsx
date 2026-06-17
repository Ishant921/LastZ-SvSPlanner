// tools/svs/components/MapsPanel.jsx
import React, { useState, useEffect } from "react";
import { useStorage } from "../../../core/hooks/useStorage";
import FloatingPanel from "./FloatingPanel";

/**
 * Redesigned MapsPanel — Linear/Figma HUD style.
 *
 * Changes:
 * - Dark frosted glass via FloatingPanel
 * - Save button is a compact ghost button, not a full-width indigo blob
 * - Map rows use hover highlight with icon-only Load/Delete actions
 * - Empty state is a proper invitation, not a gray sentence
 * - Scrollable list capped at 5 visible rows
 */
export default function MapsPanel({ onSave, onLoad, onDelete, refreshKey }) {
  const [maps, setMaps] = useState([]);
  const svsStorage = useStorage("svs");

  useEffect(() => {
    const keys = svsStorage.list();
    const mapKeys = keys.filter((k) => k.startsWith("map-"));
    setMaps(mapKeys.map((k) => k.replace("map-", "")));
  }, [refreshKey]);

  return (
    <FloatingPanel
      label="Saved Maps"
      width="w-52"
      position="left"
      defaultOpen={true}
      top="top-4"
    >
      {/* Save button */}
      <button
        onClick={onSave}
        className="w-full flex items-center justify-center gap-1.5 mb-3 transition-all duration-150"
        style={{
          height: "30px",
          borderRadius: "6px",
          fontSize: "11px",
          fontWeight: 600,
          background: "rgba(99, 102, 241, 0.18)",
          border: "1px solid rgba(99, 102, 241, 0.35)",
          color: "rgb(165, 180, 252)",
          letterSpacing: "0.01em",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(99, 102, 241, 0.28)";
          e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.55)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(99, 102, 241, 0.18)";
          e.currentTarget.style.borderColor = "rgba(99, 102, 241, 0.35)";
        }}
      >
        <SaveIcon />
        Save current map
      </button>

      {/* Divider */}
      <div
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.06)",
          marginBottom: "8px",
        }}
      />

      {/* Map list or empty state */}
      {maps.length === 0 ? (
        <EmptyState />
      ) : (
        <div
          className="space-y-1 overflow-y-auto"
          style={{ maxHeight: "160px" }}
        >
          {maps.map((name) => (
            <MapRow
              key={name}
              name={name}
              onLoad={onLoad}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </FloatingPanel>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{ padding: "12px 0", gap: "6px" }}
    >
      <div style={{ fontSize: "18px", opacity: 0.3 }}>
        <FolderIcon />
      </div>
      <span
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.25)",
          lineHeight: 1.4,
        }}
      >
        No maps saved yet.{"\n"}Save your current layout to start.
      </span>
    </div>
  );
}

function MapRow({ name, onLoad, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center gap-2 rounded-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "5px 6px",
        background: hovered ? "rgba(255,255,255,0.07)" : "transparent",
        borderRadius: "5px",
        transition: "background 0.1s ease",
      }}
    >
      <span
        className="flex-1 truncate"
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.65)",
          fontWeight: 500,
        }}
        title={name}
      >
        {name}
      </span>

      {/* Actions — always visible but low-opacity when not hovered */}
      <div
        className="flex gap-1 flex-shrink-0 transition-opacity duration-100"
        style={{ opacity: hovered ? 1 : 0.3 }}
      >
        <IconButton
          onClick={() => onLoad(name)}
          title="Load map"
          color="rgba(99, 102, 241, 0.8)"
          hoverColor="rgba(99, 102, 241, 1)"
        >
          <LoadIcon />
        </IconButton>
        <IconButton
          onClick={() => onDelete(name)}
          title="Delete map"
          color="rgba(239, 68, 68, 0.7)"
          hoverColor="rgba(239, 68, 68, 1)"
        >
          <DeleteIcon />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({ onClick, title, color, hoverColor, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "22px",
        height: "22px",
        borderRadius: "4px",
        background: hovered ? "rgba(255,255,255,0.08)" : "transparent",
        border: "none",
        color: hovered ? hoverColor : color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.12s ease",
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}

// ── SVG Icons ──────────────────────────────────────────────

function SaveIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path
        d="M2 10h8V4.5L7.5 2H2v8z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 2v2.5h4V2"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="3.5"
        y="6.5"
        width="5"
        height="3.5"
        rx="0.5"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}

function LoadIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path
        d="M5.5 2v6M2.5 5.5l3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 9h7"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path
        d="M2 3h7M4.5 3V2h2v1M8.5 3l-.5 6h-5L2.5 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 7h5l2 2h8a2 2 0 012 2v7a2 2 0 01-2 2H3a2 2 0 01-2-2V9a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
