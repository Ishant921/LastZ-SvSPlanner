import React from "react";
import { hexPoints, axialToPixel } from "../utils/hexMath";
import { GRID_RANGE } from "../constants";

export default function HexCanvas({
  size,
  colors,
  labels,
  onHexClick,
  onHexHover,
}) {
  const cells = [];

  for (let q = -GRID_RANGE; q <= GRID_RANGE; q++) {
    for (let r = -GRID_RANGE; r <= GRID_RANGE; r++) {
      const s = -q - r;
      if (Math.abs(s) > GRID_RANGE) continue;

      const { x, y } = axialToPixel(q, r, size);
      const key = `${q},${r}`;

      cells.push(
        <g key={key}>
          <polygon
            points={hexPoints(x, y, size)}
            fill={colors[key] || "#e5e7eb"}
            stroke="#374151"
            strokeWidth="1"
            onClick={() => onHexClick?.(key)}
            onContextMenu={(e) => e.preventDefault()}
            onMouseEnter={() => onHexHover?.(q, r)}
            onMouseLeave={() => onHexHover?.(null)}
            style={{ cursor: "pointer" }}
          />
          {labels[key] && (
            <text
              x={x}
              y={y + 4}
              textAnchor="middle"
              fontSize={size * 0.4}
              fontFamily="Arial"
              fontWeight="bold"
              fill="#1f2937"
              pointerEvents="none"
            >
              {labels[key]}
            </text>
          )}
        </g>,
      );
    }
  }

  return <>{cells}</>;
}
