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

function buildInitialColors() {
  const range = 40;
  const innerRadius = 17;
  const outerRings = 5;
  const initial = {};

  for (let q = -range; q <= range; q++) {
    for (let r = -range; r <= range; r++) {
      const s = -q - r;
      const dist = Math.max(Math.abs(q), Math.abs(r), Math.abs(s));

      if (dist <= innerRadius) {
        initial[`${q},${r}`] = "#f87171";
      }

      if (dist > range - outerRings && dist <= range) {
        initial[`${q},${r}`] = "#60a5fa";
      }
    }
  }

  const extraRed = [
    [0, -19], [1, -19], [2, -19], [3, -19],
    [-1, -18], [0, -18], [1, -18], [2, -18], [3, -18],
    [-2, -17], [-1, -17],
    [-3, -16], [-2, -16],
    [-3, -15],
    [18, -3], [19, -3], [18, -2], [19, -2], [18, -1], [19, -1], [18, 0], [19, 0],
    [17, 1], [18, 1], [16, 2], [17, 2], [15, 3], [16, 3],
    [-18, 15], [-19, 16], [-18, 16], [-19, 17], [-18, 17], [-19, 18], [-18, 18],
    [-17, 18], [-16, 18], [-15, 18], [-19, 19],
    [-18, 19], [-17, 19], [-16, 19],
  ];

  extraRed.forEach(([q, r]) => {
    initial[`${q},${r}`] = "#f87171";
  });

  return initial;
}

export const PROTECTED = buildInitialColors();
