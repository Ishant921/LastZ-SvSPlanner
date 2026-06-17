import React, { useState } from "react";

/**
 * Generic floating glass panel.
 *
 * Positioning is handled by the parent component.
 * This component only renders the panel UI and collapse behavior.
 */
export default function FloatingPanel({
  children,
  label,
  width = "w-56",
  defaultOpen = true,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="z-10 flex items-start gap-0">
      {/* Panel body */}
      <div
        className={`
          ${width} text-sm overflow-hidden
          transition-all duration-200 ease-out
          ${
            open
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 -translate-x-2 pointer-events-none"
          }
        `}
        style={{
          background: "rgba(15, 17, 21, 0.82)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "10px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.2)",
        }}
      >
        {label && (
          <div
            className="px-3 pt-3 pb-2 flex items-center justify-between"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
          >
            <span
              className="text-gray-400 font-medium tracking-widest"
              style={{ fontSize: "10px", letterSpacing: "0.1em" }}
            >
              {label.toUpperCase()}
            </span>
          </div>
        )}

        <div className="px-3 py-3">{children}</div>
      </div>

      {/* Toggle tab */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          flex-shrink-0 flex items-center justify-center
          transition-all duration-200 hover:opacity-100
          ml-1
          ${open ? "opacity-40" : "opacity-80"}
        `}
        style={{
          width: "20px",
          height: "28px",
          marginTop: "8px",
          background: "rgba(15, 17, 21, 0.7)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "5px",
          color: "rgba(255,255,255,0.6)",
          fontSize: "10px",
        }}
        title={open ? "Collapse" : "Expand"}
      >
        {open ? "‹" : "›"}
      </button>
    </div>
  );
}
