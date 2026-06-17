import { useState, useRef, useCallback } from "react";

/**
 * Hook for managing canvas viewport - zoom, pan, drag.
 * Supports both mouse and touch interactions.
 *
 * Usage:
 *   const viewport = useViewport();
 *   // Attach handlers to your canvas element
 *   // Use viewport.zoom, viewport.offset for transforms
 */
export function useViewport() {
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  const lastPos = useRef({ x: 0, y: 0 });
  const lastTouchDist = useRef(null);

  // Zoom with mouse wheel
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom((z) => Math.max(0.3, Math.min(3, z + delta)));
  }, []);

  // Start dragging with mouse
  const handleMouseDown = useCallback((e) => {
    setDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Drag with mouse
  const handleMouseMove = useCallback(
    (e) => {
      if (!dragging) return;

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;

      setOffset((prev) => ({
        x: prev.x + dx,
        y: prev.y + dy,
      }));

      lastPos.current = { x: e.clientX, y: e.clientY };
    },
    [dragging],
  );

  // Stop dragging
  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  // Calculate distance between two touch points
  const getTouchDistance = useCallback((touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Start touch interaction
  const handleTouchStart = useCallback(
    (e) => {
      if (e.touches.length === 1) {
        setDragging(true);
        lastPos.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }

      if (e.touches.length === 2) {
        lastTouchDist.current = getTouchDistance(e.touches);
      }
    },
    [getTouchDistance],
  );

  // Touch move - pan or pinch zoom
  const handleTouchMove = useCallback(
    (e) => {
      if (e.touches.length === 1 && dragging) {
        const dx = e.touches[0].clientX - lastPos.current.x;
        const dy = e.touches[0].clientY - lastPos.current.y;

        setOffset((prev) => ({
          x: prev.x + dx,
          y: prev.y + dy,
        }));

        lastPos.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }

      if (e.touches.length === 2) {
        const newDist = getTouchDistance(e.touches);

        if (lastTouchDist.current) {
          const delta = (newDist - lastTouchDist.current) * 0.005;
          setZoom((z) => Math.max(0.3, Math.min(3, z + delta)));
        }

        lastTouchDist.current = newDist;
      }
    },
    [dragging, getTouchDistance],
  );

  // End touch
  const handleTouchEnd = useCallback(() => {
    setDragging(false);
    lastTouchDist.current = null;
  }, []);

  return {
    zoom,
    setZoom,
    offset,
    setOffset,
    dragging,
    handleWheel,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
