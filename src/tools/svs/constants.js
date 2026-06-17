// SvS Planner constants
import { buildInitialColors } from "./utils/hexMath";
export const PALETTE = [
  "#4ade80",
  "#f87171",
  "#60a5fa",
  "#fbbf24",
  "#a78bfa",
  "#4ADEDE",
  "#00FFFF",
];

export const ERASER = "ERASER";
export const LABEL_TOOL = "LABEL_TOOL";

export const DEFAULT_LEGEND = {
  "#00FFFF": "Capital Alliance",
  "#4ade80": "Alliance 1",
  "#f87171": "HQ Zone",
  "#60a5fa": "Border",
  "#fbbf24": "Alliance 2",
  "#a78bfa": "Alliance 3",
  "#4ADEDE": "Alliance 4",
};

export const GRID_RANGE = 40;

export const PROTECTED = buildInitialColors();
