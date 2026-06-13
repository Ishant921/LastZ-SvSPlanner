import React, { useRef, useEffect } from "react";

function PopupBase({ children }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl px-6 py-5 w-80 animate-fade-in">
        {children}
      </div>
    </div>
  );
}

function PopupTitle({ children }) {
  return <div className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-1">{children}</div>;
}

function PopupDesc({ children }) {
  return <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">{children}</div>;
}

function PopupActions({ children }) {
  return <div className="flex gap-2 mt-2">{children}</div>;
}

function PrimaryBtn({ onClick, disabled, children }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex-1 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 text-white rounded-xl py-2 text-sm font-semibold transition"
    >
      {children}
    </button>
  );
}

function DangerBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-xl py-2 text-sm font-semibold transition"
    >
      {children}
    </button>
  );
}

function CancelBtn({ onClick, children = "Cancel" }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl py-2 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    >
      {children}
    </button>
  );
}

function TextInput({ value, onChange, onKeyDown, placeholder, autoFocus }) {
  const ref = useRef(null);
  useEffect(() => { if (autoFocus && ref.current) ref.current.focus(); }, [autoFocus]);
  return (
    <input
      ref={ref}
      className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-indigo-400 dark:bg-gray-800 dark:text-gray-200"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
    />
  );
}

export function LabelPopup({ labelText, setLabelText, onSubmit, onCancel }) {
  return (
    <PopupBase>
      <PopupTitle>Add Label</PopupTitle>
      <PopupDesc>Type a label for this hex. Leave empty to remove.</PopupDesc>
      <TextInput
        autoFocus
        placeholder="e.g. R5 Rally"
        value={labelText}
        onChange={(e) => setLabelText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
      />
      <PopupActions>
        <PrimaryBtn onClick={onSubmit}>Save</PrimaryBtn>
        <CancelBtn onClick={onCancel} />
      </PopupActions>
    </PopupBase>
  );
}

export function ResetConfirmPopup({ onConfirm, onCancel }) {
  return (
    <PopupBase>
      <PopupTitle>Reset Map?</PopupTitle>
      <PopupDesc>This will clear all painted hexes and labels. Protected zones stay intact.</PopupDesc>
      <PopupActions>
        <DangerBtn onClick={onConfirm}>Yes, Reset</DangerBtn>
        <CancelBtn onClick={onCancel} />
      </PopupActions>
    </PopupBase>
  );
}

export function SaveMapPopup({ mapName, setMapName, onSave, onCancel }) {
  return (
    <PopupBase>
      <PopupTitle>Save Map</PopupTitle>
      <PopupDesc>Give your map a name to save it.</PopupDesc>
      <TextInput
        autoFocus
        placeholder="e.g. Week 3 SvS Plan"
        value={mapName}
        onChange={(e) => setMapName(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") onSave(); }}
      />
      <PopupActions>
        <PrimaryBtn onClick={onSave} disabled={!mapName.trim()}>Save</PrimaryBtn>
        <CancelBtn onClick={onCancel} />
      </PopupActions>
    </PopupBase>
  );
}

export function OverwriteConfirmPopup({ mapName, onConfirm, onCancel }) {
  return (
    <PopupBase>
      <PopupTitle>Overwrite "{mapName}"?</PopupTitle>
      <PopupDesc>A map with this name already exists. This will replace it.</PopupDesc>
      <PopupActions>
        <DangerBtn onClick={onConfirm}>Overwrite</DangerBtn>
        <CancelBtn onClick={onCancel} />
      </PopupActions>
    </PopupBase>
  );
}

export function LoadMapPopup({ mapName, onConfirm, onCancel }) {
  return (
    <PopupBase>
      <PopupTitle>Load "{mapName}"?</PopupTitle>
      <PopupDesc>This will replace your current map. Unsaved changes will be lost.</PopupDesc>
      <PopupActions>
        <PrimaryBtn onClick={onConfirm}>Load</PrimaryBtn>
        <CancelBtn onClick={onCancel} />
      </PopupActions>
    </PopupBase>
  );
}

export function DeleteMapPopup({ mapName, onConfirm, onCancel }) {
  return (
    <PopupBase>
      <PopupTitle>Delete "{mapName}"?</PopupTitle>
      <PopupDesc>This action cannot be undone.</PopupDesc>
      <PopupActions>
        <DangerBtn onClick={onConfirm}>Delete</DangerBtn>
        <CancelBtn onClick={onCancel} />
      </PopupActions>
    </PopupBase>
  );
}

export function ExportingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl px-8 py-6 flex flex-col items-center gap-3">
        <div className="text-2xl animate-spin">⏳</div>
        <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Generating image...</div>
      </div>
    </div>
  );
}