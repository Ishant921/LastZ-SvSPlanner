// tools/svs/utils/exportSvg.js
import { axialToPixel } from "./hexMath";
import { GRID_RANGE } from "../constants";

const EXPORT_SIZE = 20;
const SCALE = 2;
const PADDING = 40;

/**
 * Exports the hex grid as a PNG image.
 * Renders to SVG, then draws to canvas for download.
 */
export async function exportToPng(colors, labels, legend, onStart, onEnd) {
  onStart();
  await new Promise((res) => setTimeout(res, 50));

  try {
    const { width, height, offsetX, offsetY } = calculateGridBounds();

    const hexSVG = buildHexSVG(colors, labels, offsetX, offsetY);
    const legendSVG = buildLegendSVG(legend, colors, height);

    const svgString = wrapSVG(width, height, hexSVG + legendSVG);

    await renderSVGToPNG(svgString, width, height, onEnd);
  } catch {
    onEnd("Export failed. Try again.");
  }
}

/** Calculate the bounding box of the entire grid */
function calculateGridBounds() {
  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;

  for (let q = -GRID_RANGE; q <= GRID_RANGE; q++) {
    for (let r = -GRID_RANGE; r <= GRID_RANGE; r++) {
      const s = -q - r;
      if (Math.abs(s) > GRID_RANGE) continue;

      const { x, y } = axialToPixel(q, r, EXPORT_SIZE);
      minX = Math.min(minX, x - EXPORT_SIZE);
      maxX = Math.max(maxX, x + EXPORT_SIZE);
      minY = Math.min(minY, y - EXPORT_SIZE);
      maxY = Math.max(maxY, y + EXPORT_SIZE);
    }
  }

  const width = maxX - minX + PADDING * 2;
  const height = maxY - minY + PADDING * 2;
  const offsetX = -minX + PADDING;
  const offsetY = -minY + PADDING;

  return { width, height, offsetX, offsetY };
}

/** Build SVG for all hexagons */
function buildHexSVG(colors, labels, offsetX, offsetY) {
  let svg = "";

  for (let q = -GRID_RANGE; q <= GRID_RANGE; q++) {
    for (let r = -GRID_RANGE; r <= GRID_RANGE; r++) {
      const s = -q - r;
      if (Math.abs(s) > GRID_RANGE) continue;

      const { x, y } = axialToPixel(q, r, EXPORT_SIZE);
      const key = `${q},${r}`;
      const fill = colors[key] || "#e5e7eb";
      const label = labels[key];

      svg += buildHexagon(x + offsetX, y + offsetY, fill);

      if (label) {
        svg += buildLabel(x + offsetX, y + offsetY, label);
      }
    }
  }

  return svg;
}

/** Build a single hexagon polygon */
function buildHexagon(cx, cy, fill) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 2;
    const px = cx + EXPORT_SIZE * Math.cos(angle);
    const py = cy + EXPORT_SIZE * Math.sin(angle);
    points.push(`${px},${py}`);
  }

  return `<polygon points="${points.join(" ")}" fill="${fill}" stroke="#374151" stroke-width="0.5"/>`;
}

/** Build a label text element */
function buildLabel(x, y, text) {
  return `<text x="${x}" y="${y + 4}" text-anchor="middle" font-size="8" font-family="Arial" font-weight="bold" fill="#1f2937">${text}</text>`;
}

/** Build SVG for the legend */
function buildLegendSVG(legend, colors, gridHeight) {
  const entries = Object.entries(legend);
  const usedColors = new Set(Object.values(colors));
  const visible = entries.filter(([color]) => usedColors.has(color));

  let svg = "";
  visible.forEach(([color, name], i) => {
    const x = PADDING;
    const y = gridHeight - PADDING - (visible.length - i - 1) * 20;
    svg += `<rect x="${x}" y="${y - 10}" width="14" height="14" fill="${color}" rx="2"/>`;
    svg += `<text x="${x + 20}" y="${y}" font-size="12" font-family="Arial" fill="#1f2937">${name}</text>`;
  });

  return svg;
}

/** Wrap SVG content in proper SVG container */
function wrapSVG(width, height, content) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      ${content}
    </svg>
  `;
}

/** Render SVG string to PNG and trigger download */
function renderSVGToPNG(svgString, width, height, onEnd) {
  return new Promise((resolve) => {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * SCALE;
      canvas.height = height * SCALE;
      const ctx = canvas.getContext("2d");
      ctx.scale(SCALE, SCALE);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const link = document.createElement("a");
      link.download = "svs-plan.png";
      link.href = canvas.toDataURL("image/png");
      link.click();

      onEnd(null);
      resolve();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      onEnd("Export failed. Try again.");
      resolve();
    };

    img.src = url;
  });
}
