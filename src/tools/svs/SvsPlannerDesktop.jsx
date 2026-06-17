// tools/svs/SvsPlannerDesktop.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import { useTool } from "../../core/context/ToolContext";
import { useApp } from "../../core/context/AppContext";
import { useViewport } from "../../core/hooks/useViewport";
import { useHexState } from "./hooks/useHexState";
import { useMapManager } from "./hooks/useMapManager";
import { useMapActions } from "./hooks/useMapActions";
import { useToast } from "../../core/hooks/useToast";
import { exportToPng } from "./utils/exportSvg";
import HexCanvas from "./components/HexCanvas";
import BrushPanel from "./components/BrushPanel";
import LegendPanel from "./components/LegendPanel";
import LegendCornerPanel from "./components/LegendCornerPanel";
import MapsPanel from "./components/MapsPanel";
import PopupManager from "../../core/components/PopupManager";
import Toast from "../../core/components/Toast";

export default function SvsPlannerDesktop() {
  const baseSize = 20;
  const containerRef = useRef(null);
  const viewport = useViewport();
  const [hovered, setHovered] = useState(null);
  const [activePanel, setActivePanel] = useState(null);
  const [showLegend, setShowLegend] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const hex = useHexState();
  const maps = useMapManager();
  const toast = useToast();
  const mapActions = useMapActions({ hex, maps, toast });
  const { registerTool, updateState } = useTool();
  const { toolbarAnchors } = useApp();

  const size = baseSize * viewport.zoom;
  const paintAnchor = toolbarAnchors.paint;
  const mapsAnchor = toolbarAnchors.maps;

  const getPanelPosition = useCallback((anchor) => {
    if (!anchor || !containerRef.current) {
      return { left: 0, top: 0 };
    }

    const containerRect = containerRef.current.getBoundingClientRect();

    return {
      left: anchor.left - containerRect.left + anchor.width / 2,

      top: anchor.bottom - containerRect.top + 8,
    };
  }, []);

  const paintPosition = getPanelPosition(paintAnchor);
  const mapsPosition = getPanelPosition(mapsAnchor);

  // Register tool actions with TopBar
  useEffect(() => {
    registerTool({
      actions: {
        undo: hex.handleUndo,
        export: handleExport,
        paint: () => handleTogglePanel("paint"),
        maps: () => handleTogglePanel("maps"),
        reset: () => setShowReset(true),
      },
      state: {
        canUndo: hex.history.length > 0,
        isExporting: exporting,
      },
      toolbar: [
        { id: "paint", icon: "🎨", label: "Paint" },
        { id: "maps", icon: "🗺", label: "Maps" },

        { id: "undo", icon: "↩", label: "Undo", disabled: !hex.history.length },
        { id: "export", icon: "📷", label: "Export", disabled: exporting },
        { id: "reset", icon: "🗑", label: "Reset", danger: true },
      ],
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

  const handleTogglePanel = useCallback((panelId) => {
    setActivePanel((prev) => (prev === panelId ? null : panelId));
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
      ref={containerRef}
      className="w-full h-full bg-gray-50 dark:bg-gray-950 relative touch-none overflow-hidden"
      onWheel={viewport.handleWheel}
      onMouseMove={viewport.handleMouseMove}
      onMouseUp={viewport.handleMouseUp}
      onMouseLeave={viewport.handleMouseUp}
      onTouchMove={viewport.handleTouchMove}
      onTouchEnd={viewport.handleTouchEnd}
    >
      {/* Coordinate display */}

      <LegendCornerPanel
        open={showLegend}
        onToggle={() => setShowLegend((v) => !v)}
      />

      {/* Floating panels */}
      <>
        {activePanel === "paint" && paintAnchor && (
          <div
            className="absolute z-20 -translate-x-1/2"
            style={{
              left: paintPosition.left,
              top: paintPosition.top,
            }}
          >
            <BrushPanel
              brushSize={hex.brushSize}
              setBrushSize={hex.setBrushSize}
              selectedTool={hex.selectedTool}
              setSelectedTool={hex.setSelectedTool}
            />
          </div>
        )}
        {showLegend && (
          <div className="absolute bottom-20 right-4 z-20">
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
          </div>
        )}
        {activePanel === "maps" && mapsAnchor && (
          <div
            className="absolute z-20 -translate-x-1/2"
            style={{
              left: mapsPosition.left,
              top: mapsPosition.top,
            }}
          >
            <MapsPanel
              onSave={maps.handleSaveMap}
              onLoad={maps.handleLoadRequest}
              onDelete={maps.handleDeleteRequest}
              refreshKey={maps.mapsRefresh}
            />
          </div>
        )}
      </>

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
