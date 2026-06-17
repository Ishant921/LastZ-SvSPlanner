import React, { useState } from "react";

/**
 * Redesigned FloatingPanel — Linear/Figma-style HUD panel.
 *
 * Changes from original:
 * - Frosted glass surface with backdrop-blur
 * - Razor-thin border, elevated shadow
 * - Proper floating position (not edge-attached)
 * - Clean chevron toggle tab instead of emoji
 */
export default function FloatingPanel({
  children,
  label,
  width = "w-56",
  position = "left",
  defaultOpen = true,
  top = "top-4",
}) {
  const [open, setOpen] = useState(defaultOpen);
  const isLeft = position === "left";

  return (
    <div
      className={`absolute ${top} ${isLeft ? "left-3" : "right-3"} z-10 flex items-start gap-0`}
    >
      {/* Panel body */}
      <div
        className={`
          ${width} text-sm overflow-hidden
          transition-all duration-200 ease-out
          ${
            open
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : isLeft
                ? "opacity-0 -translate-x-2 pointer-events-none"
                : "opacity-0 translate-x-2 pointer-events-none"
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
        {/* Panel header */}
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

        {/* Content */}
        <div className="px-3 py-3">{children}</div>
      </div>

      {/* Toggle tab */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          flex-shrink-0 flex items-center justify-center
          transition-all duration-200 hover:opacity-100
          ${isLeft ? "ml-1" : "mr-1 order-first"}
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
        {isLeft ? (open ? "‹" : "›") : open ? "›" : "‹"}
      </button>
    </div>
  );
}
