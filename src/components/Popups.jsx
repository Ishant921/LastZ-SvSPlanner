import React, { useRef, useEffect } from "react";

function PopupShell({ children }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl px-6 py-5 w-72">
        {children}
      </div>
    </div>
  );
}

function ConfirmPopup({
  title,
  message,
  confirmText,
  confirmColor,
  onConfirm,
  onCancel,
}) {
  return (
    <PopupShell>
      <div className="text-sm font-semibold mb-1">
        {title}
      </div>

      <div className="text-xs text-gray-500 mb-3">
        {message}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onConfirm}
          className={`flex-1 text-white rounded-lg py-2 text-sm font-semibold ${
            confirmColor === "red"
              ? "bg-red-500"
              : "bg-blue-500"
          }`}
        >
          {confirmText}
        </button>

        <button
          onClick={onCancel}
          className="flex-1 bg-gray-100 rounded-lg py-2 text-sm"
        >
          Cancel
        </button>
      </div>
    </PopupShell>
  );
}
function InputPopup({
  title,
  value,
  setValue,
  placeholder,
  submitText,
  onSubmit,
  onCancel,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <PopupShell>
      <div className="text-sm font-semibold mb-3">
        {title}
      </div>

      <input
        ref={inputRef}
        className="w-full border rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-blue-400"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSubmit();
        }}
      />

      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm font-semibold"
        >
          {submitText}
        </button>

        <button
          onClick={onCancel}
          className="flex-1 bg-gray-100 rounded-lg py-2 text-sm"
        >
          Cancel
        </button>
      </div>
    </PopupShell>
  );
}

export function LabelPopup({
  labelText,
  setLabelText,
  onSubmit,
  onCancel,
}) {
  return (
    <InputPopup
      title="Add Label"
      value={labelText}
      setValue={setLabelText}
      placeholder="Type label..."
      submitText="Save"
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}

export function ResetConfirmPopup({
  onConfirm,
  onCancel,
}) {
  return (
    <ConfirmPopup
      title="Reset map?"
      message="This will clear all your colors and labels."
      confirmText="Yes, Reset"
      confirmColor="red"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export function OverwriteConfirmPopup({
  mapName,
  onConfirm,
  onCancel,
}) {
  return (
    <ConfirmPopup
      title="Overwrite map?"
      message={`"${mapName}" already exists.`}
      confirmText="Overwrite"
      confirmColor="red"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export function ExportingOverlay() {
  return (
    <PopupShell>
      <div className="text-center text-sm font-semibold">
        Generating image...
      </div>
    </PopupShell>
  );
}

export function SaveMapPopup({
  mapName,
  setMapName,
  onSave,
  onCancel,
}) {
  return (
    <InputPopup
      title="Save Map"
      value={mapName}
      setValue={setMapName}
      placeholder="Map name..."
      submitText="Save"
      onSubmit={onSave}
      onCancel={onCancel}
    />
  );
}
export function LoadMapPopup({
  mapName,
  onConfirm,
  onCancel,
}) {
  return (
    <ConfirmPopup
      title="Load map?"
      message={`Load "${mapName}"? Current unsaved changes will be lost.`}
      confirmText="Load"
      confirmColor="blue"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
export function DeleteMapPopup({
  mapName,
  onConfirm,
  onCancel,
}) {
  return (
    <ConfirmPopup
      title="Delete map?"
      message={`Delete "${mapName}"? This cannot be undone.`}
      confirmText="Delete"
      confirmColor="red"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}