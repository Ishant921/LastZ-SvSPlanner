import { useCallback } from "react";
import {
  saveData,
  loadData,
  deleteData,
  getKeys,
  clearNamespace,
} from "../utils/storage";

/**
 * Hook for reading and writing storage data.
 * Automatically namespaces by tool ID or 'global'.
 *
 * Usage:
 *   const storage = useStorage('svs');
 *   storage.save('map-1', data);
 *   const data = storage.load('map-1', defaultValue);
 */
export function useStorage(namespace) {
  const save = useCallback(
    (key, value) => saveData(namespace, key, value),
    [namespace],
  );

  const load = useCallback(
    (key, defaultValue) => loadData(namespace, key, defaultValue),
    [namespace],
  );

  const remove = useCallback((key) => deleteData(namespace, key), [namespace]);

  const list = useCallback(() => getKeys(namespace), [namespace]);

  const clear = useCallback(() => clearNamespace(namespace), [namespace]);

  return { save, load, remove, list, clear };
}
