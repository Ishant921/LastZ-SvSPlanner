export function hexPoints(cx, cy, size) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i + Math.PI / 2;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(" ");
}

export function axialToPixel(q, r, hexSize) {
  const x = hexSize * Math.sqrt(3) * (q + r / 2);
  const y = hexSize * 1.5 * r;
  return { x, y };
}

export function getBrushCells(q, r, radius) {
  const results = [];
  for (let dq = -radius; dq <= radius; dq++) {
    for (let dr = -radius; dr <= radius; dr++) {
      const ds = -dq - dr;
      if (Math.abs(ds) <= radius) {
        results.push([q + dq, r + dr]);
      }
    }
  }
  return results;
}

export function buildInitialColors() {
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
    [0, -19],
    [1, -19],
    [2, -19],
    [3, -19],
    [-1, -18],
    [0, -18],
    [1, -18],
    [2, -18],
    [3, -18],
    [-2, -17],
    [-1, -17],
    [-3, -16],
    [-2, -16],
    [-3, -15],
    [18, -3],
    [19, -3],
    [18, -2],
    [19, -2],
    [18, -1],
    [19, -1],
    [18, 0],
    [19, 0],
    [17, 1],
    [18, 1],
    [16, 2],
    [17, 2],
    [15, 3],
    [16, 3],
    [-18, 15],
    [-19, 16],
    [-18, 16],
    [-19, 17],
    [-18, 17],
    [-19, 18],
    [-18, 18],
    [-17, 18],
    [-16, 18],
    [-15, 18],
    [-19, 19],
    [-18, 19],
    [-17, 19],
    [-16, 19],
  ];

  extraRed.forEach(([q, r]) => {
    initial[`${q},${r}`] = "#f87171";
  });

  return initial;
}
