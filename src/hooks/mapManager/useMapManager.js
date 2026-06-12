import { useState } from "react";

export function useMapManager() {
  // Popup State
  const [mapsRefresh, setMapsRefresh] = useState(0);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showOverwritePopup, setShowOverwritePopup] = useState(false);
  const [showLoadPopup, setShowLoadPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // Map State
  const [mapName, setMapName] = useState("");
  const [pendingMapName, setPendingMapName] = useState("");
  const [selectedMap, setSelectedMap] = useState("");


const handleSaveMap = () => {
  setMapName("");
  setShowSavePopup(true);
};

  const handleLoadRequest = (name) => {
  setSelectedMap(name);
  setShowLoadPopup(true);
};

const handleDeleteRequest = (name) => {
  setSelectedMap(name);
  setShowDeletePopup(true);
};








  
  return {
    mapsRefresh,
    setMapsRefresh,

    handleSaveMap,
    handleLoadRequest,
    handleDeleteRequest,

    showSavePopup,
    setShowSavePopup,

    showOverwritePopup,
    setShowOverwritePopup,

    showLoadPopup,
    setShowLoadPopup,

    showDeletePopup,
    setShowDeletePopup,

    mapName,
    setMapName,

    pendingMapName,
    setPendingMapName,

    selectedMap,
    setSelectedMap,
  };
}