import { useStorage } from "../../../core/hooks/useStorage";

export function useMapActions(deps) {
  const { hex, maps, toast } = deps;
  const svsStorage = useStorage("svs");

  const { colors, labels, legend, setColors, setLabels, setLegend } = hex;

  const {
    selectedMap,
    mapName,
    pendingMapName,

    setMapsRefresh,

    setShowSavePopup,
    setShowOverwritePopup,
    setShowLoadPopup,
    setShowDeletePopup,

    setMapName,
    setPendingMapName,
    setSelectedMap,
  } = maps;

  const confirmSaveMap = () => {
    const name = mapName.trim();
    if (!name) return;

    const existing = svsStorage.load(`map-${name}`, null);
    if (existing) {
      setPendingMapName(name);
      setShowSavePopup(false);
      setShowOverwritePopup(true);
      return;
    }

    svsStorage.save(`map-${name}`, { colors, labels, legend });
    setMapsRefresh((v) => v + 1);
    setShowSavePopup(false);
    setMapName("");
    toast.showToast(`✓ Saved "${name}"`, "success");
  };

  const overwriteMap = () => {
    svsStorage.save(`map-${pendingMapName}`, { colors, labels, legend });
    setMapsRefresh((v) => v + 1);
    setShowOverwritePopup(false);
    setPendingMapName("");
    setMapName("");
    toast.showToast(`↺ Overwrote "${pendingMapName}"`, "info");
  };

  const confirmLoadMap = () => {
    const map = svsStorage.load(`map-${selectedMap}`, null);
    if (!map) return;

    setColors(map.colors || {});
    setLabels(map.labels || {});
    setLegend(map.legend || {});

    setShowLoadPopup(false);
    setSelectedMap("");
    toast.showToast(`📂 Loaded "${selectedMap}"`, "default");
  };

  const confirmDeleteMap = () => {
    svsStorage.remove(`map-${selectedMap}`);
    setMapsRefresh((v) => v + 1);
    setShowDeletePopup(false);
    setSelectedMap("");
    toast.showToast(`🗑 Deleted "${selectedMap}"`, "danger");
  };

  return {
    confirmSaveMap,
    overwriteMap,
    confirmLoadMap,
    confirmDeleteMap,
  };
}
