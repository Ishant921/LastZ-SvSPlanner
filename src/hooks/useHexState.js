import { useState, useEffect, useMemo } from "react";
import { PROTECTED, DEFAULT_LEGEND, PALETTE } from "../constants";
import { getBrushCells } from "../utils/hexMath";
import { ERASER, LABEL_TOOL } from "../constants";

export function useHexState() {
  const [colors, setColors] = useState(() => {
    try {
      const saved = localStorage.getItem("hex-grid-colors");
      return saved ? JSON.parse(saved) : { ...PROTECTED };
    } catch {
      return { ...PROTECTED };
    }
  });

  const [labels, setLabels] = useState(() => {
    try {
      const saved = localStorage.getItem("hex-grid-labels");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [legend, setLegend] = useState(() => {
    try {
      const saved = localStorage.getItem("hex-grid-legend");
      return saved ? JSON.parse(saved) : { ...DEFAULT_LEGEND };
    } catch {
      return { ...DEFAULT_LEGEND };
    }
  });

  const [history, setHistory] = useState([]);
  const [selectedTool, setSelectedTool] = useState(PALETTE[0]);
  const [brushSize, setBrushSize] = useState(1);
  const [labelInput, setLabelInput] = useState(null);
  const [labelText, setLabelText] = useState("");
  const [editingLegend, setEditingLegend] = useState(null);
  const [editingLegendText, setEditingLegendText] = useState("");

  // Persist to localStorage
  useEffect(() => {
    try { localStorage.setItem("hex-grid-colors", JSON.stringify(colors)); } catch {}
  }, [colors]);

  useEffect(() => {
    try { localStorage.setItem("hex-grid-labels", JSON.stringify(labels)); } catch {}
  }, [labels]);

  useEffect(() => {
    try { localStorage.setItem("hex-grid-legend", JSON.stringify(legend)); } catch {}
  }, [legend]);

  const isProtected = (key) => key in PROTECTED;

  const applyTool = (q, r) => {
    if (selectedTool === LABEL_TOOL) {
      const key = `${q},${r}`;
      setLabelInput(key);
      setLabelText(labels[key] || "");
      return;
    }

    const cells = getBrushCells(q, r, brushSize - 1);
    const freeCells = cells.filter(([cq, cr]) => !isProtected(`${cq},${cr}`));
    if (freeCells.length === 0) return;

    setColors((prev) => {
      const snapshot = {};
      freeCells.forEach(([cq, cr]) => {
        snapshot[`${cq},${cr}`] = prev[`${cq},${cr}`];
      });
      setHistory((h) => [...h.slice(-49), snapshot]);

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

  const handleReset = () => {
    setColors({ ...PROTECTED });
    setLabels({});
    setHistory([]);
  };

  const handleLegendSave = (color, text) => {
    setLegend((prev) => ({ ...prev, [color]: text }));
    setEditingLegend(null);
  };

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
