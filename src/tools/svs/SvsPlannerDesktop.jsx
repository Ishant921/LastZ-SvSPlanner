// tools/svs/SvsPlannerDesktop.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useTool } from "../../core/context/ToolContext";
import { useViewport } from "../../core/hooks/useViewport";
import { useHexState } from "./hooks/useHexState";
import { useMapManager } from "./hooks/useMapManager";
import { useMapActions } from "./hooks/useMapActions";
import { useToast } from "../../core/hooks/useToast";
import { exportToPng } from "./utils/exportSvg";
import HexCanvas from "./components/HexCanvas";
import BrushPanel from "./components/BrushPanel";
import LegendPanel from "./components/LegendPanel";
import MapsPanel from "./components/MapsPanel";
import PopupManager from "../../core/components/PopupManager";
import Toast from "../../core/components/Toast";

export default function SvsPlannerDesktop() {
  const baseSize = 20;
  const viewport = useViewport();
  const [hovered, setHovered] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [hideUI, setHideUI] = useState(false);
  const [showReset, setShowReset] = useState(false);

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
        hideUI: handleHideUI,
        reset: () => setShowReset(true),
      },
      state: {
        canUndo: hex.history.length > 0,
        isExporting: exporting,
      },
      toolbar: [
        { id: "undo", icon: "↩", label: "Undo", disabled: !hex.history.length },
        { id: "export", icon: "📷", label: "Export", disabled: exporting },
        { id: "hideUI", icon: "🙈", label: "Hide UI" },
        { id: "reset", icon: "🗑", label: "Reset", danger: true },
      ],
    });
  }, [hex.history.length, exporting]);

  // Update toolbar state when dependencies change
  useEffect(() => {
    updateState({
      canUndo: hex.history.length > 0,
      isExporting: exporting,
    });
  }, [hex.history.length, exporting]);

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

  const handleHideUI = useCallback(() => {
    setHideUI(true);
    setTimeout(() => setHideUI(false), 4000);
  }, []);

  const handleHexClick = useCallback(
    (key) => {
      const [q, r] = key.split(",").map(Number);
      hex.applyTool(q, r);
    },
    [hex.applyTool],
  );

  const handleHexHover = useCallback((q, r) => {
    setHovered(q === null ? null : { q, r });
  }, []);

  return (
    <div
      className="w-full h-full bg-gray-50 dark:bg-gray-950 relative touch-none overflow-hidden"
      onWheel={viewport.handleWheel}
      onMouseMove={viewport.handleMouseMove}
      onMouseUp={viewport.handleMouseUp}
      onMouseLeave={viewport.handleMouseUp}
      onTouchMove={viewport.handleTouchMove}
      onTouchEnd={viewport.handleTouchEnd}
    >
      {/* Coordinate display */}
      {!hideUI && (
        <div className="absolute top-4 left-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl shadow text-sm z-10 text-gray-700 dark:text-gray-300">
          {hovered ? `x: ${hovered.q}, y: ${hovered.r}` : "Hover a hex"}
        </div>
      )}

      {/* Floating panels */}
      {!hideUI && (
        <>
          <BrushPanel
            brushSize={hex.brushSize}
            setBrushSize={hex.setBrushSize}
          />
          <LegendPanel
            selectedTool={hex.selectedTool}
            setSelectedTool={hex.setSelectedTool}
            legend={hex.legend}
            counts={hex.counts}
            editingLegend={hex.editingLegend}
            editingLegendText={hex.editingLegendText}
            setEditingLegend={hex.setEditingLegend}
            setEditingLegendText={hex.setEditingLegendText}
            onLegendSave={hex.handleLegendSave}
          />
          <MapsPanel
            onSave={maps.handleSaveMap}
            onLoad={maps.handleLoadRequest}
            onDelete={maps.handleDeleteRequest}
            refreshKey={maps.mapsRefresh}
          />
        </>
      )}

      {/* Popups and notifications */}
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
          <HexCanvas
            size={size}
            colors={hex.colors}
            labels={hex.labels}
            onHexClick={handleHexClick}
            onHexHover={handleHexHover}
          />
        </g>
      </svg>
    </div>
  );
}
