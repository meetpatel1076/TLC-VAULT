import React, { useState } from "react";
import Editor from "@monaco-editor/react";
import { Plus, X } from "lucide-react";
import api from "../services/api";


const NewCodeEditor = ({ repoId, onFileCreated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState("main.cpp");
  const [saving, setSaving] = useState(false);
  


  const [language, setLanguage] = useState("cpp");


  const [code, setCode] = useState(
    `#include <iostream>

using namespace std;

int main() {
    cout << "Hello TLC Vault";
    return 0;
}`
  );

  const handleSave = async () => {
    try {
      setSaving(true);

      const response = await api.post(`/repositories/${repoId}/files`, {
        name: fileName,
        language,
        code,
      });
      setIsOpen(false);

      onFileCreated();

    } catch (error) {
      console.error("Failed to save code:", error);
    } finally {
      setSaving(false);
    }
  };
  const editorHeight = Math.min(
    Math.max(100, code.split("\n").length * 20 + 32),
    600
  );

  return (
    <div className="mt-8">

      {/* Add Code */}
      <div className="rounded-xl border border-[#30343d] bg-[#111318] overflow-hidden">

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-14 px-5 flex items-center gap-3 text-white bg-[#111318] hover:bg-[#191c22] transition"
        >
          {isOpen ? <X size={19} /> : <Plus size={19} />}

          <span className="font-medium">
            {isOpen ? "Code Editor" : "Add Code"}
          </span>
        </button>


        {/* Editor */}
        <div
          className={`
            transition-all duration-300
            overflow-hidden
            ${isOpen
              ? "max-h-[800px] opacity-100"
              : "max-h-0 opacity-0"
            }
          `}
        >

          {/* Language Selector */}
          <div className="h-14 px-4 flex items-center justify-between border-t border-b border-[#30343d] bg-[#15171d]">
            <div className="flex items-center gap-3">
              <span>File Name</span>

              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="main.cpp"
                className="h-9 w-40 rounded-md border border-[#30343d] bg-[#111318] px-3 text-sm text-white outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <span>Language</span>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-9 rounded-md border border-[#30343d] bg-[#111318] px-3 text-sm text-white outline-none"
              >
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
                <option value="json">JSON</option>
              </select>
            </div>
          </div>


          {/* Monaco */}
          <Editor
            height={`${editorHeight}px`}
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: {
                enabled: false,
              },

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


          {/* Save */}
          <div className="flex justify-end p-4 border-t border-[#30343d]">

            <button
              onClick={handleSave}
              disabled={saving}
              className="
    px-5 py-2
    rounded-lg
    bg-[#f64f12]
    text-white
    text-sm
    font-medium
    hover:bg-[#f36631]
    transition
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
            >
              {saving ? "Saving..." : "Save Code"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default NewCodeEditor;