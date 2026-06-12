import React, { useState, useRef } from "react";
import { useHexState } from "./hooks/useHexState";
import { hexPoints, axialToPixel } from "./utils/hexMath";
import { exportToPng } from "./utils/exportSvg";
import Toolbar from "./components/Toolbar";
import LegendPanel from "./components/LegendPanel";
import BrushPanel from "./components/BrushPanel";
import { LabelPopup, ResetConfirmPopup, ExportingOverlay } from "./components/Popups";
import { GRID_RANGE } from "./constants";

export default function HexGrid() {
  const baseSize = 20;
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [hideUI, setHideUI] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const lastTouchDist = useRef(null);
  const size = baseSize * zoom;

  const {
    colors, labels, legend, history,
    selectedTool, brushSize, labelInput, labelText,
    editingLegend, editingLegendText, counts,
    setSelectedTool, setBrushSize, setLabelInput, setLabelText,
    setEditingLegend, setEditingLegendText,
    applyTool, handleLabelSubmit, handleUndo, handleReset, handleLegendSave,
  } = useHexState();

  // --- Interaction handlers ---

  const handleClick = (key) => {
    const [q, r] = key.split(",").map(Number);
    applyTool(q, r);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom((z) => Math.max(0.3, Math.min(3, z + delta)));
  };

  const handleMouseDown = (e) => {
    setDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setDragging(false);

  const getTouchDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setDragging(true);
      setLastPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
    if (e.touches.length === 2) {
      lastTouchDist.current = getTouchDistance(e.touches);
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1 && dragging) {
      const dx = e.touches[0].clientX - lastPos.x;
      const dy = e.touches[0].clientY - lastPos.y;
      setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      setLastPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
    if (e.touches.length === 2) {
      const newDist = getTouchDistance(e.touches);
      if (lastTouchDist.current) {
        const delta = (newDist - lastTouchDist.current) * 0.005;
        setZoom((z) => Math.max(0.3, Math.min(3, z + delta)));
      }
      lastTouchDist.current = newDist;
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
    lastTouchDist.current = null;
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
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Hover coords */}
      {!hideUI && (
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur px-3 py-2 rounded-xl shadow text-sm z-10">
          {hovered ? `q: ${hovered.q}, r: ${hovered.r}` : "Hover a hex"}
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
        </>
      )}

      {/* Popups */}
      {labelInput && (
        <LabelPopup
          labelText={labelText}
          setLabelText={setLabelText}
          onSubmit={handleLabelSubmit}
          onCancel={() => { setLabelInput(null); setLabelText(""); }}
        />
      )}
      {showReset && (
        <ResetConfirmPopup
          onConfirm={() => { handleReset(); setShowReset(false); }}
          onCancel={() => setShowReset(false)}
        />
      )}
      {exporting && <ExportingOverlay />}

      {/* SVG canvas */}
      <svg
        width="100%"
        height="100%"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      >
        <g transform={`translate(${offset.x}, ${offset.y})`}>
          {hexagons}
        </g>
      </svg>
    </div>
  );
}
