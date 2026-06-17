// tools/svs/components/BrushPanel.jsx
import React from "react";
import FloatingPanel from "./FloatingPanel";

/**
 * Redesigned BrushPanel — Linear/Figma HUD style.
 *
 * Changes:
 * - Dark frosted glass via FloatingPanel
 * - Size buttons rendered as visual hex-dot previews, not number buttons
 * - Slider replaced with a segmented pill selector for cleaner interaction
 * - Active state uses a soft indigo fill, not a ring
 */
export default function BrushPanel({ brushSize, setBrushSize }) {
  const sizes = [1, 2, 3, 4, 5];

  return (
    <FloatingPanel
      label="Brush"
      width="w-44"
      position="left"
      defaultOpen={true}
      top="top-4"
    >
      {/* Segmented size selector */}
      <div
        className="flex items-center justify-between"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: "7px",
          padding: "3px",
          gap: "2px",
        }}
      >
        {sizes.map((v) => (
          <SizeButton
            key={v}
            size={v}
            isActive={brushSize === v}
            onClick={() => setBrushSize(v)}
          />
        ))}
      </div>

      {/* Visual preview of brush size */}
      <div
        className="flex items-center justify-center mt-3"
        style={{ height: "36px" }}
      >
        <BrushPreview size={brushSize} />
      </div>

      {/* Label */}
      <div
        className="text-center mt-1"
        style={{
          fontSize: "10px",
          color: "rgba(255,255,255,0.25)",
          letterSpacing: "0.05em",
        }}
      >
        {brushSize === 1 ? "Single hex" : `${brushSize}-hex radius`}
      </div>
    </FloatingPanel>
  );
}

/** Segmented pill button for a size value */
function SizeButton({ size, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: "26px",
        borderRadius: "5px",
        fontSize: "11px",
        fontWeight: 600,
        background: isActive ? "rgba(99, 102, 241, 0.3)" : "transparent",
        border: isActive
          ? "1px solid rgba(99, 102, 241, 0.5)"
          : "1px solid transparent",
        color: isActive ? "rgb(165, 180, 252)" : "rgba(255,255,255,0.35)",
        transition: "all 0.15s ease",
        cursor: "pointer",
      }}
    >
      {size}
    </button>
  );
}

/**
 * Visual dot preview showing brush coverage.
 * Renders a small hex-dot cluster to represent the selected radius.
 */
function BrushPreview({ size }) {
  // Dot grid: render a diamond of dots up to `size` radius
  const dots = [];
  const r = size - 1;
  const dotSize = Math.max(3, 6 - r);
  const gap = dotSize + 2;

  for (let dq = -r; dq <= r; dq++) {
    for (let dr = -r; dr <= r; dr++) {
      const ds = -dq - dr;
      if (Math.abs(ds) > r) continue;
      // Offset layout: axial to pixel (flat-top)
      const x = gap * (dq + dr / 2);
      const y = gap * 0.866 * dr;
      dots.push({ x, y, key: `${dq},${dr}`, isCenter: dq === 0 && dr === 0 });
    }
  }

  // Center the preview
  const xs = dots.map((d) => d.x);
  const ys = dots.map((d) => d.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  return (
    <svg width="80" height="36" viewBox="-40 -18 80 36">
      {dots.map((d) => (
        <circle
          key={d.key}
          cx={d.x - cx}
          cy={d.y - cy}
          r={dotSize / 2}
          fill={d.isCenter ? "rgb(129, 140, 248)" : "rgba(99, 102, 241, 0.45)"}
        />
      ))}
    </svg>
  );
}
