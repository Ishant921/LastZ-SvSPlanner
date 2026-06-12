import { useState, useRef } from "react";

export function useViewport( { setOffsetExternal } = {}) {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
const [dragging, setDragging] = useState(false);
const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

const lastTouchDist = useRef(null);


  const handleWheel = (e) => {
  e.preventDefault();

  const delta = -e.deltaY * 0.001;

  setZoom((z) =>
    Math.max(0.3, Math.min(3, z + delta))
  );
};

const handleMouseDown = (e) => {
  setDragging(true);

  setLastPos({
    x: e.clientX,
    y: e.clientY,
  });
};

const handleMouseMove = (e) => {
  if (!dragging) return;

  const dx = e.clientX - lastPos.x;
  const dy = e.clientY - lastPos.y;

  setOffset((prev) => ({
    x: prev.x + dx,
    y: prev.y + dy,
  }));

  setLastPos({
    x: e.clientX,
    y: e.clientY,
  });
};

const handleMouseUp = () => {
  setDragging(false);
};

const getTouchDistance = (touches) => {
  const dx =
    touches[0].clientX - touches[1].clientX;

  const dy =
    touches[0].clientY - touches[1].clientY;

  return Math.sqrt(dx * dx + dy * dy);
};

const handleTouchStart = (e) => {
  if (e.touches.length === 1) {
    setDragging(true);

    setLastPos({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  }

  if (e.touches.length === 2) {
    lastTouchDist.current =
      getTouchDistance(e.touches);
  }
};

const handleTouchMove = (e) => {
  if (e.touches.length === 1 && dragging) {
    const dx =
      e.touches[0].clientX - lastPos.x;

    const dy =
      e.touches[0].clientY - lastPos.y;

    setOffset((prev) => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    setLastPos({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  }

  if (e.touches.length === 2) {
    const newDist =
      getTouchDistance(e.touches);

    if (lastTouchDist.current) {
      const delta =
        (newDist - lastTouchDist.current) *
        0.005;

      setZoom((z) =>
        Math.max(
          0.3,
          Math.min(3, z + delta)
        )
      );
    }

    lastTouchDist.current = newDist;
  }
};

const handleTouchEnd = () => {
  setDragging(false);
  lastTouchDist.current = null;
};

  
  return {
    zoom,
    setZoom,
    offset,
  setOffset,

  dragging,
  setDragging,

  lastPos,
  setLastPos,

  lastTouchDist,
    handleWheel,
handleMouseDown,
handleMouseMove,
handleMouseUp,

handleTouchStart,
handleTouchMove,
handleTouchEnd,
  };
}