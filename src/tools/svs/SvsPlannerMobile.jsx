import React, { useEffect, useState, useCallback } from "react";
import { useTool } from "../../core/context/ToolContext";
import { useViewport } from "../../core/hooks/useViewport";
import { useHexState } from "./hooks/useHexState";
import { useMapManager } from "./hooks/useMapManager";
import { useMapActions } from "./hooks/useMapActions";
import { useToast } from "../../core/hooks/useToast";
import { exportToPng } from "./utils/exportSvg";
import { GRID_RANGE, PALETTE } from "./constants";
import HexCanvas from "./components/HexCanvas";
import PopupManager from "../../core/components/PopupManager";
import Toast from "../../core/components/Toast";

export default function SvsPlannerMobile() {
  const baseSize = 20;
  const viewport = useViewport();
  const [exporting, setExporting] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showColorSheet, setShowColorSheet] = useState(false);
  const [activeBottomTool, setActiveBottomTool] = useState("paint");

  const hex = useHexState();
  const maps = useMapManager();
  const toast = useToast();
  const mapActions = useMapActions({ hex, maps, toast });
  const { registerTool, updateState } = useTool();

  const size = baseSize * viewport.zoom;

  // Register tool actions with TopBar
  useEffect(() => {
    registerTool({
      actions: {
        undo: hex.handleUndo,
        export: handleExport,
        reset: () => setShowReset(true),
      },
      state: {
        canUndo: hex.history.length > 0,
      },
      toolbar: [
        { id: "undo", icon: "↩", label: "Undo", disabled: !hex.history.length },
        { id: "export", icon: "📷", label: "Export" },
        { id: "reset", icon: "🗑", label: "Reset", danger: true },
      ],
    });
  }, [hex.history.length]);

  // Update toolbar state
  useEffect(() => {
    updateState({
      canUndo: hex.history.length > 0,
    });
  }, [hex.history.length]);

  const handleExport = useCallback(() => {
    exportToPng(
      hex.colors,
      hex.labels,
      hex.legend,
      () => setExporting(true),
      (err) => {
        if (err) toast.showToast(err, "danger");
        setExporting(false);
      },
    );
  }, [hex.colors, hex.labels, hex.legend, toast]);

  const handleHexClick = useCallback(
    (key) => {
      const [q, r] = key.split(",").map(Number);
      hex.applyTool(q, r);
    },
    [hex.applyTool],
  );

  const handleHexHover = useCallback((q, r) => {
    // Mobile doesn't use hover
  }, []);

  const selectPaintTool = useCallback(
    (color) => {
      hex.setSelectedTool(color);
      setActiveBottomTool("paint");
    },
    [hex],
  );

  const selectEraser = useCallback(() => {
    hex.setSelectedTool("ERASER");
    setActiveBottomTool("eraser");
  }, [hex]);

  const selectLabel = useCallback(() => {
    hex.setSelectedTool("LABEL_TOOL");
    setActiveBottomTool("label");
  }, [hex]);

  return (
    <div className="w-full h-full bg-gray-50 dark:bg-gray-950 relative touch-none overflow-hidden">
      {/* SVG canvas - ALL touch handlers added */}
      <svg
        width="100%"
        height="100%"
        onMouseDown={viewport.handleMouseDown}
        onMouseMove={viewport.handleMouseMove}
        onMouseUp={viewport.handleMouseUp}
        onMouseLeave={viewport.handleMouseUp}
        onTouchStart={viewport.handleTouchStart}
        onTouchMove={viewport.handleTouchMove}
        onTouchEnd={viewport.handleTouchEnd}
        style={{
          cursor: viewport.dragging ? "grabbing" : "grab",
          touchAction: "none",
        }}
      >
        <g transform={`translate(${viewport.offset.x}, ${viewport.offset.y})`}>
          <HexCanvas
            size={size}
            colors={hex.colors}
            labels={hex.labels}
            onHexClick={handleHexClick}
            onHexHover={handleHexHover}
          />
        </g>
      </svg>

      {/* Bottom tool bar with safe area padding */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-2 pt-2 flex items-center justify-around z-20"
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <PaintButton
          selectedTool={hex.selectedTool}
          isActive={activeBottomTool === "paint"}
          onClick={() => setShowColorSheet(true)}
        />
        <ToolButton
          icon="✕"
          label="Eraser"
          isActive={activeBottomTool === "eraser"}
          onClick={selectEraser}
        />
        <ToolButton
          icon="T"
          label="Label"
          isActive={activeBottomTool === "label"}
          onClick={selectLabel}
          bold
        />
        <BrushSizeSelector size={hex.brushSize} onChange={hex.setBrushSize} />
      </div>

      {/* Color picker sheet */}
      {showColorSheet && (
        <ColorPickerSheet
          palette={PALETTE}
          onSelect={(color) => {
            selectPaintTool(color);
            setShowColorSheet(false);
          }}
          onClose={() => setShowColorSheet(false)}
        />
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
    </div>
  );
}

/** Paint button showing current color */
function PaintButton({ selectedTool, isActive, onClick }) {
  const isSpecialTool =
    selectedTool === "ERASER" || selectedTool === "LABEL_TOOL";
  const color = isSpecialTool ? "#e5e7eb" : selectedTool;

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${
        isActive
          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600"
          : "text-gray-600 dark:text-gray-400"
      }`}
    >
      <div
        className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-medium">Paint</span>
    </button>
  );
}

/** Generic tool button */
function ToolButton({ icon, label, isActive, onClick, bold }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${
        isActive
          ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600"
          : "text-gray-600 dark:text-gray-400"
      }`}
    >
      <span className={`text-xl ${bold ? "font-bold" : ""}`}>{icon}</span>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

/** Brush size selector */
function BrushSizeSelector({ size, onChange }) {
  const sizes = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col items-center gap-0.5 px-3 py-1.5">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
        Size
      </span>
      <div className="flex gap-1">
        {sizes.map((v) => (
          <button
            key={v}
            onClick={() => onChange(v)}
            className={`w-6 h-6 rounded-lg text-xs font-bold transition ${
              size === v
                ? "bg-indigo-500 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600"
            }`}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Color picker bottom sheet */
function ColorPickerSheet({ palette, onSelect, onClose }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl p-6 z-30">
      <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-center mb-4">Select Color</h3>
      <div className="grid grid-cols-4 gap-4 max-w-xs mx-auto">
        {palette.map((color) => (
          <button
            key={color}
            onClick={() => onSelect(color)}
            className="w-16 h-16 rounded-2xl transition active:scale-95 shadow-sm"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <button
        onClick={onClose}
        className="w-full mt-6 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm font-medium"
      >
        Cancel
      </button>
    </div>
  );
}
