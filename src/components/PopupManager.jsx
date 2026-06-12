import {
  LabelPopup,
  ResetConfirmPopup,
  ExportingOverlay,
  SaveMapPopup,
  OverwriteConfirmPopup,
  LoadMapPopup,
  DeleteMapPopup,
} from "./Popups";

export default function PopupManager({
  hex,
  maps,
  mapActions,
  exporting,
  showReset,
  setShowReset,
}) {
  const {
    labelInput,
    labelText,
    setLabelText,
    handleLabelSubmit,
    setLabelInput,
    handleReset,
  } = hex;

  const {
    mapName,
    setMapName,

    pendingMapName,
    setPendingMapName,

    selectedMap,
    setSelectedMap,

    showSavePopup,
    setShowSavePopup,

    showOverwritePopup,
    setShowOverwritePopup,

    showLoadPopup,
    setShowLoadPopup,

    showDeletePopup,
    setShowDeletePopup,
  } = maps;

  return (
    <>
      {labelInput && (
        <LabelPopup
          labelText={labelText}
          setLabelText={setLabelText}
          onSubmit={handleLabelSubmit}
          onCancel={() => {
            setLabelInput(null);
            setLabelText("");
          }}
        />
      )}

      {showReset && (
        <ResetConfirmPopup
          onConfirm={() => {
            handleReset();
            setShowReset(false);
          }}
          onCancel={() => setShowReset(false)}
        />
      )}

      {showSavePopup && (
        <SaveMapPopup
          mapName={mapName}
          setMapName={setMapName}
          onSave={mapActions.confirmSaveMap}
          onCancel={() => {
            setShowSavePopup(false);
            setMapName("");
          }}
        />
      )}

      {showOverwritePopup && (
        <OverwriteConfirmPopup
          mapName={pendingMapName}
          onConfirm={mapActions.overwriteMap}
          onCancel={() => {
            setShowOverwritePopup(false);
            setPendingMapName("");
          }}
        />
      )}

      {showLoadPopup && (
        <LoadMapPopup
          mapName={selectedMap}
          onConfirm={mapActions.confirmLoadMap}
          onCancel={() => {
            setShowLoadPopup(false);
            setSelectedMap("");
          }}
        />
      )}

      {showDeletePopup && (
        <DeleteMapPopup
          mapName={selectedMap}
          onConfirm={mapActions.confirmDeleteMap}
          onCancel={() => {
            setShowDeletePopup(false);
            setSelectedMap("");
          }}
        />
      )}

      {exporting && <ExportingOverlay />}
    </>
  );
}