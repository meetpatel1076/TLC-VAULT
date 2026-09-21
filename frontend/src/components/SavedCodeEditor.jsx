import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Save, Trash2 } from "lucide-react";
import api from "../services/api";

const SavedCodeEditor = ({ file, onUpdated, onDeleted }) => {
  const [code, setCode] = useState(file.code || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async () => {
    try {
      setSaving(true);

      await api.patch(`/codefiles/${file._id}`, {
        code,
      });

      onUpdated();
    } catch (error) {
      console.error("Failed to update code:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await api.delete(`/codefiles/${file._id}`);

      onDeleted();
    } catch (error) {
      console.error("Failed to delete code:", error);
    } finally {
      setDeleting(false);
    }
  };
  const editorHeight = Math.min(
  Math.max(100, code.split("\n").length * 20 + 32),
  600
);

  return (
    <div className="rounded-xl border border-[#30343d] bg-[#111318] overflow-hidden">
      
      <div className="h-14 flex items-center justify-between px-4 border-b border-[#30343d]">
        
        <div className="flex items-center gap-3">
          <span className="text-white font-medium">
            {file.name}
          </span>

          <span className="text-xs text-[#717784] uppercase">
            {file.language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[#9ca3af] hover:text-white hover:bg-[#191c22] transition disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-[#191c22] transition disabled:opacity-50"
          >
            <Trash2 size={16} />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>

      </div>

      <Editor
        height={`${editorHeight}px`}
        language={file.language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          padding: {
            top: 16,
            bottom: 16,
          },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          scrollBeyondLastLine: false,
          
        }}
      />

    </div>
  );
};

export default SavedCodeEditor;