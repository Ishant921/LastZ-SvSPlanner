// tools/svs/components/BrushPanel.jsx
import React from "react";
import FloatingPanel from "./FloatingPanel";
import PaintTools from "./PaintTools";

/**
 * Paint Panel
 *
 * Responsibilities:
 * - Colors
 * - Eraser / Label tools
 * - Brush size selection
 * - Brush preview
 */
export default function BrushPanel({
  brushSize,
  setBrushSize,
  selectedTool,
  setSelectedTool,
}) {
  const sizes = [1, 2, 3, 4, 5];

  return (
    <FloatingPanel label="Paint" width="w-[520px]" defaultOpen={true}>
      <div className="flex gap-4 items-stretch">
        {/* Left Side - Paint Tools */}
        <div className="flex-[1.1]">
          <PaintTools
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
          />
        </div>

        {/* Vertical Divider */}
        <div
          style={{
            width: "1px",
            background: "rgba(255,255,255,0.08)",
            alignSelf: "stretch",
          }}
        />

        {/* Right Side - Brush Settings */}
        <div className="flex-[0.9] flex flex-col">
          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.08em",
              marginBottom: "8px",
            }}
          >
            BRUSH SIZE
          </div>

          <div
            className="flex items-center justify-between"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "7px",
              padding: "3px",
              gap: "2px",
              marginBottom: "12px",
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

          <div
            style={{
              height: "1px",
              background: "rgba(255,255,255,0.06)",
              marginBottom: "10px",
            }}
          />

          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.08em",
              marginBottom: "8px",
            }}
          >
            PREVIEW
          </div>

          <div className="flex justify-center">
            <BrushPreview size={brushSize} />
          </div>

          <div
            className="text-center mt-2"
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            {brushSize === 1 ? "Single hex" : `${brushSize}-hex radius`}
          </div>
        </div>
      </div>
    </FloatingPanel>
  );
}

/** Brush size button */
function SizeButton({ size, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        height: "30px",
        borderRadius: "6px",
        fontSize: "11px",
        fontWeight: 600,
        background: isActive
          ? "rgba(99, 102, 241, 0.3)"
          : "rgba(255,255,255,0.04)",
        border: isActive
          ? "1px solid rgba(99, 102, 241, 0.5)"
          : "1px solid rgba(255,255,255,0.08)",
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
 */
function BrushPreview({ size }) {
  const dots = [];
  const r = size - 1;
  const dotSize = Math.max(3, 6 - r);
  const gap = dotSize + 2;

  for (let dq = -r; dq <= r; dq++) {
    for (let dr = -r; dr <= r; dr++) {
      const ds = -dq - dr;
      if (Math.abs(ds) > r) continue;

      const x = gap * (dq + dr / 2);
      const y = gap * 0.866 * dr;

      dots.push({
        x,
        y,
        key: `${dq},${dr}`,
        isCenter: dq === 0 && dr === 0,
      });
    }
  }

  const xs = dots.map((d) => d.x);
  const ys = dots.map((d) => d.y);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  return (
    <svg width="80" height="50" viewBox="-40 -25 80 50">
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
