import { useState, useEffect, useCallback } from "react";

/**
 * Hook for showing toast notifications.
 * Auto-dismisses after 2 seconds.
 *
 * Usage:
 *   const { toast, showToast } = useToast();
 *   showToast('Map saved!', 'success');
 */
export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "default") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      setToast(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [toast]);

  return { toast, showToast };
}
