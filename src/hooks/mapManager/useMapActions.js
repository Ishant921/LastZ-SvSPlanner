import {
  saveMap,
  loadMap,
  deleteMap,
  mapExists,
} from "../../utils/mapStorage";

export function useMapActions(deps) {
  const { hex, maps, toast } = deps;

const {
  colors,
  labels,
  legend,
  setColors,
  setLabels,
  setLegend,
} = hex;

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

    if (mapExists(name)) {
      setPendingMapName(name);
      setShowSavePopup(false);
      setShowOverwritePopup(true);
      return;
    }

    saveMap(name, colors, labels, legend);

    setMapsRefresh((v) => v + 1);

    setShowSavePopup(false);
    setMapName("");
    toast.showToast(`✓ Saved "${name}"`, "success");
  };

  const overwriteMap = () => {
    saveMap(
      pendingMapName,
      colors,
      labels,
      legend
    );

    setMapsRefresh((v) => v + 1);

    setShowOverwritePopup(false);
    setPendingMapName("");
    setMapName("");
    toast.showToast(`↺ Overwrote "${pendingMapName}"`, "info");
  };

  const confirmLoadMap = () => {
    const map = loadMap(selectedMap);

    if (!map) return;

    setColors(map.colors || {});
    setLabels(map.labels || {});
    setLegend(map.legend || {});

    setShowLoadPopup(false);
    setSelectedMap("");
    toast.showToast(`📂 Loaded "${selectedMap}"`, "default");
  };

  const confirmDeleteMap = () => {
    deleteMap(selectedMap);

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