import { axialToPixel } from "./hexMath";
import { GRID_RANGE } from "../constants";

export async function exportToPng(colors, labels, legend, onStart, onEnd) {
  onStart();
  await new Promise((res) => setTimeout(res, 50));

  try {
    const exportSize = 20;
    const scale = 2;
    const range = GRID_RANGE;
    const padding = 40;

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    for (let q = -range; q <= range; q++) {
      for (let r = -range; r <= range; r++) {
        const s = -q - r;
        if (Math.abs(s) > range) continue;
        const { x, y } = axialToPixel(q, r, exportSize);
        minX = Math.min(minX, x - exportSize);
        maxX = Math.max(maxX, x + exportSize);
        minY = Math.min(minY, y - exportSize);
        maxY = Math.max(maxY, y + exportSize);
      }
    }

    const gridW = maxX - minX + padding * 2;
    const gridH = maxY - minY + padding * 2;
    const offsetX = -minX + padding;
    const offsetY = -minY + padding;

    let hexSVG = "";
    for (let q = -range; q <= range; q++) {
      for (let r = -range; r <= range; r++) {
        const s = -q - r;
        if (Math.abs(s) > range) continue;
        const { x, y } = axialToPixel(q, r, exportSize);
        const key = `${q},${r}`;
        const fill = colors[key] || "#e5e7eb";
        const label = labels[key];

        const pts = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i + Math.PI / 2;
          const px = x + offsetX + exportSize * Math.cos(angle);
          const py = y + offsetY + exportSize * Math.sin(angle);
          pts.push(`${px},${py}`);
        }

        hexSVG += `<polygon points="${pts.join(" ")}" fill="${fill}" stroke="#374151" stroke-width="0.5"/>`;

        if (label) {
          hexSVG += `<text x="${x + offsetX}" y="${y + offsetY + 4}" text-anchor="middle" font-size="8" font-family="Arial" font-weight="bold" fill="#1f2937">${label}</text>`;
        }
      }
    }

    let legendSVG = "";
    const legendEntries = Object.entries(legend);
    const usedColors = new Set(Object.values(colors));
    const visibleLegend = legendEntries.filter(([color]) => usedColors.has(color));
    visibleLegend.forEach(([color, name], i) => {
      const lx = padding;
      const ly = gridH - padding - (visibleLegend.length - i - 1) * 20;
      legendSVG += `<rect x="${lx}" y="${ly - 10}" width="14" height="14" fill="${color}" rx="2"/>`;
      legendSVG += `<text x="${lx + 20}" y="${ly}" font-size="12" font-family="Arial" fill="#1f2937">${name}</text>`;
    });

    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${gridW}" height="${gridH}">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        ${hexSVG}
        ${legendSVG}
      </svg>
    `;

    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = gridW * scale;
      canvas.height = gridH * scale;
      const ctx = canvas.getContext("2d");
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const link = document.createElement("a");
      link.download = "svs-plan.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      onEnd(null);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      onEnd("Export failed. Try again.");
    };

    img.src = url;
  } catch {
    onEnd("Export failed. Try again.");
  }
}
