import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Save, Trash2, Copy, Check } from "lucide-react";
import api from "../services/api";
import HoldButton from "./HoldButton";

const SavedCodeEditor = ({ file, onUpdated, onDeleted }) => {
  const [code, setCode] = useState(file.code || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setCopied(false);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

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
            onClick={handleCopy}
            className="text-[#9ca3af] hover:text-white transition"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-[#9ca3af] hover:text-white hover:bg-[#191c22] transition disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "updating..." : "Update"}
          </button>

          <HoldButton
            onHold={handleDelete}
            disabled={deleting}
            holdTime={1500}
            backgroundColor="#191c22"
            fillColor="#FF0000"
            textColor="#9ca3af"
            fillTextColor="#ffffff"
            size="sm"
          >
            Delete
          </HoldButton>
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