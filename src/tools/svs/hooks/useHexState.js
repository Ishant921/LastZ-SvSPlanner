// tools/svs/hooks/useHexState.js
import { useState, useEffect, useMemo } from "react";
import { PROTECTED, DEFAULT_LEGEND, PALETTE } from "../constants";
import { getBrushCells } from "../utils/hexMath";
import { ERASER, LABEL_TOOL } from "../constants";

/**
 * Manages the complete state of the SvS hex grid.
 *
 * Features:
 * - Color painting with brush sizes
 * - Label editing
 * - Undo history (last 50 actions)
 * - Legend customization
 * - Protected zones (cannot be painted over)
 * - Auto-save to localStorage
 */
export function useHexState() {
  // === Core State ===

  /** Map of "q,r" → color hex code */
  const [colors, setColors] = useState(() =>
    loadFromStorage("hex-grid-colors", { ...PROTECTED }),
  );

  /** Map of "q,r" → label text */
  const [labels, setLabels] = useState(() =>
    loadFromStorage("hex-grid-labels", {}),
  );

  /** Map of color → legend name */
  const [legend, setLegend] = useState(() =>
    loadFromStorage("hex-grid-legend", { ...DEFAULT_LEGEND }),
  );

  // === UI State ===

  /** Stack of color snapshots for undo (max 50) */
  const [history, setHistory] = useState([]);

  /** Currently selected tool: a color, ERASER, or LABEL_TOOL */
  const [selectedTool, setSelectedTool] = useState(PALETTE[0]);

  /** Brush radius: 1-5 */
  const [brushSize, setBrushSize] = useState(1);

  /** Label being edited: "q,r" or null */
  const [labelInput, setLabelInput] = useState(null);
  const [labelText, setLabelText] = useState("");

  /** Legend color being edited */
  const [editingLegend, setEditingLegend] = useState(null);
  const [editingLegendText, setEditingLegendText] = useState("");

  // === Persistence ===

  useEffect(() => saveToStorage("hex-grid-colors", colors), [colors]);
  useEffect(() => saveToStorage("hex-grid-labels", labels), [labels]);
  useEffect(() => saveToStorage("hex-grid-legend", legend), [legend]);

  // === Helpers ===

  /** Check if a hex is protected (part of the initial map) */
  const isProtected = (key) => key in PROTECTED;

  /**
   * Apply the current tool to a hex and its neighbors.
   * For paint/eraser: paints all hexes in brush radius.
   * For label: opens the label editor.
   */
  const applyTool = (q, r) => {
    // Label tool: open editor
    if (selectedTool === LABEL_TOOL) {
      const key = `${q},${r}`;
      setLabelInput(key);
      setLabelText(labels[key] || "");
      return;
    }

    // Get all cells in brush radius
    const cells = getBrushCells(q, r, brushSize - 1);
    const freeCells = cells.filter(([cq, cr]) => !isProtected(`${cq},${cr}`));
    if (freeCells.length === 0) return;

    // Save snapshot for undo, then apply color
    setColors((prev) => {
      // Snapshot: remember previous colors of affected cells
      const snapshot = {};
      freeCells.forEach(([cq, cr]) => {
        snapshot[`${cq},${cr}`] = prev[`${cq},${cr}`];
      });
      setHistory((h) => [...h.slice(-49), snapshot]);

      // Apply new colors
      const updated = { ...prev };
      freeCells.forEach(([cq, cr]) => {
        if (selectedTool === ERASER) {
          delete updated[`${cq},${cr}`];
        } else {
          updated[`${cq},${cr}`] = selectedTool;
        }
      });
      return updated;
    });
  };

  /** Save or remove a label */
  const handleLabelSubmit = () => {
    if (!labelInput) return;
    setLabels((prev) => {
      const updated = { ...prev };
      if (labelText.trim() === "") {
        delete updated[labelInput];
      } else {
        updated[labelInput] = labelText.trim();
      }
      return updated;
    });
    setLabelInput(null);
    setLabelText("");
  };

  /** Undo the last painting action */
  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setColors((prev) => {
      const updated = { ...prev };
      Object.entries(last).forEach(([key, val]) => {
        if (val === undefined) {
          delete updated[key];
        } else {
          updated[key] = val;
        }
      });
      return updated;
    });
  };

  /** Reset to initial state (keeps protected zones) */
  const handleReset = () => {
    setColors({ ...PROTECTED });
    setLabels({});
    setHistory([]);
  };

  /** Save a legend name */
  const handleLegendSave = (color, text) => {
    setLegend((prev) => ({ ...prev, [color]: text }));
    setEditingLegend(null);
  };

  // === Derived Data ===

  /** Count of hexes per color */
  const counts = useMemo(() => {
    const map = {};
    Object.values(colors).forEach((c) => {
      map[c] = (map[c] || 0) + 1;
    });
    return map;
  }, [colors]);

  return {
    // State
    colors,
    labels,
    legend,
    history,
    selectedTool,
    brushSize,
    labelInput,
    labelText,
    editingLegend,
    editingLegendText,
    counts,
    // Setters
    setSelectedTool,
    setBrushSize,
    setLabelInput,
    setLabelText,
    setEditingLegend,
    setEditingLegendText,
    setColors,
    setLabels,
    setLegend,
    // Actions
    applyTool,
    handleLabelSubmit,
    handleUndo,
    handleReset,
    handleLegendSave,
  };
}

// === Storage Helpers ===

function loadFromStorage(key, defaultValue) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage errors
  }
}
