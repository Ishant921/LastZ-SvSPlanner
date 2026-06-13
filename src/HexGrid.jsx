import React, { useState } from "react";
import { useHexState } from "./hooks/useHexState";
import { useMapManager } from "./hooks/mapManager/useMapManager.js";
import { useMapActions } from "./hooks/mapManager/useMapActions.js";
import { useViewport } from "./hooks/useViewport";
import PopupManager from "./components/PopupManager";
import { hexPoints, axialToPixel } from "./utils/hexMath";
import { exportToPng } from "./utils/exportSvg";
import Toolbar from "./components/Toolbar";
import LegendPanel from "./components/LegendPanel";
import BrushPanel from "./components/BrushPanel";
import MapsPanel from "./components/MapsPanel";
import { GRID_RANGE } from "./constants"; 
import { useToast } from "./hooks/useToast";
import Toast from "./components/Toast";

export default function HexGrid() {
  const baseSize = 20;
  const viewport = useViewport();
  const [hovered, setHovered] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [hideUI, setHideUI] = useState(false);
  const hex = useHexState();

const {
  colors,
  labels,
  legend,
  history,

  selectedTool,
  brushSize,

  editingLegend,
  editingLegendText,
  counts,

  setSelectedTool,
  setBrushSize,

  setEditingLegend,
  setEditingLegendText,

  applyTool,
  handleUndo,
  handleLegendSave,
} = hex;
  const maps = useMapManager();
  const {
  mapsRefresh,
} = maps;
  const toast = useToast();
  const mapActions = useMapActions({
  hex,
  maps,
    toast,
});
  const [showReset, setShowReset] = useState(false);
  const size = baseSize * viewport.zoom;

  // --- Interaction handlers ---

  const handleClick = (key) => {
    const [q, r] = key.split(",").map(Number);
    applyTool(q, r);
  };

  const handleHideUI = () => {
    setHideUI(true);
    setTimeout(() => setHideUI(false), 4000);
  };

  const handleExport = () => {
    exportToPng(
      colors,
      labels,
      legend,
      () => setExporting(true),
      (err) => {
        if (err) alert(err);
        setExporting(false);
      }
    );
  };
  
  // --- Build hexagons ---

  const hexagons = [];
  for (let q = -GRID_RANGE; q <= GRID_RANGE; q++) {
    for (let r = -GRID_RANGE; r <= GRID_RANGE; r++) {
      const s = -q - r;
      if (Math.abs(s) > GRID_RANGE) continue;

      const { x, y } = axialToPixel(q, r, size);
      const key = `${q},${r}`;
      const label = labels[key];

      hexagons.push(
        <g key={key}>
          <polygon
            points={hexPoints(x, y, size)}
            fill={colors[key] || "#e5e7eb"}
            stroke="#374151"
            strokeWidth="1"
            onClick={() => handleClick(key)}
            onContextMenu={(e) => e.preventDefault()}
            onMouseEnter={() => setHovered({ q, r })}
            onMouseLeave={() => setHovered(null)}
          />
          {label && (
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
              {label}
            </text>
          )}
        </g>
      );
    }
  }

  return (
    <div
      className="w-full h-screen bg-gray-100 relative touch-none overflow-hidden"
      onWheel={viewport.handleWheel}
      onMouseMove={viewport.handleMouseMove}
      onMouseUp={viewport.handleMouseUp}
      onMouseLeave={viewport.handleMouseUp}
      onTouchMove={viewport.handleTouchMove}
      onTouchEnd={viewport.handleTouchEnd}
    >
      {/* Hover coords */}
      {!hideUI && (
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-2 rounded-xl shadow text-sm z-10">
          {hovered ? `x: ${hovered.q}, y: ${hovered.r}` : "Hover a hex"}
        </div>
      )}

      {!hideUI && (
        <>
          <Toolbar
            onUndo={handleUndo}
            canUndo={history.length > 0}
            onExport={handleExport}
            exporting={exporting}
            onHideUI={handleHideUI}
            onReset={() => setShowReset(true)}
          />
          <LegendPanel
            selectedTool={selectedTool}
            setSelectedTool={setSelectedTool}
            legend={legend}
            counts={counts}
            editingLegend={editingLegend}
            editingLegendText={editingLegendText}
            setEditingLegend={setEditingLegend}
            setEditingLegendText={setEditingLegendText}
            onLegendSave={handleLegendSave}
          />
          <BrushPanel brushSize={brushSize} setBrushSize={setBrushSize} />
          <MapsPanel
  onSave={maps.handleSaveMap}
  onLoad={maps.handleLoadRequest}
  onDelete={maps.handleDeleteRequest}
  refreshKey={mapsRefresh}
/>
        </>
      )}

      {/* Popups */}
      <PopupManager
  hex={hex}
  maps={maps}
  mapActions={mapActions}
  exporting={exporting}
  showReset={showReset}
  setShowReset={setShowReset}
/>
      <Toast toast={toast.toast} />

      {/* SVG canvas */}
      <svg
        width="100%"
        height="100%"
        onMouseDown={viewport.handleMouseDown}
        onTouchStart={viewport.handleTouchStart}
        style={{ cursor: viewport.dragging ? "grabbing" : "grab" }}
      >
        <g transform={`translate(${viewport.offset.x}, ${viewport.offset.y})`}>
          {hexagons}
        </g>
      </svg>
    </div>
  );
}
