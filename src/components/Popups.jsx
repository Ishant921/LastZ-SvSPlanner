import React, { useRef, useEffect } from "react";

export function LabelPopup({ labelText, setLabelText, onSubmit, onCancel }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl px-6 py-5 w-72">
        <div className="text-sm font-semibold mb-3">Add Label</div>
        <input
          ref={inputRef}
          className="w-full border rounded-lg px-3 py-2 text-sm mb-3 outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type label..."
          value={labelText}
          onChange={(e) => setLabelText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onSubmit(); }}
        />
        <div className="flex gap-2">
          <button
            onClick={onSubmit}
            className="flex-1 bg-blue-500 text-white rounded-lg py-2 text-sm font-semibold"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 rounded-lg py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function ResetConfirmPopup({ onConfirm, onCancel }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl px-6 py-5 w-72">
        <div className="text-sm font-semibold mb-1">Reset map?</div>
        <div className="text-xs text-gray-500 mb-3">This will clear all your colors and labels.</div>
        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 text-white rounded-lg py-2 text-sm font-semibold"
          >
            Yes, Reset
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 rounded-lg py-2 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function ExportingOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-50">
      <div className="bg-white/90 px-6 py-4 rounded-xl shadow text-sm font-semibold">
        Generating image...
      </div>
    </div>
  );
}
