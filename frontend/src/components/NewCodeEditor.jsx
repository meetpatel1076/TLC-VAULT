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

      await api.post(`/repositories/${repoId}/files`, {
        name: fileName,
        language,
        code,
      });

      // Reset the editor after the file has been saved successfully.
      setCode(`#include <iostream>\n\nusing namespace std;\n\nint main() {\n    cout << "Hello TLC Vault";\n    return 0;\n}`);
      setFileName("main.cpp");
      setLanguage("cpp");
      setIsOpen(false);

      await onFileCreated?.();

    } catch (error) {
      console.error("Failed to save code:", error);
    } finally {
      setSaving(false);
    }
  };
  const editorHeight = Math.min(
    Math.max(100, code.split("\n").length * 20 + 32),
    400
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
            {isOpen ? "Code Editor" : "Add Code "}
          </span>
          <span className="text-gray-500 text-xs sm:text-sm">(paste your code work)</span>
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
          <div className="flex flex-col gap-3 border-t border-b border-[#30343d] bg-[#15171d] px-3 py-3 sm:h-14 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-0">
            <div className="flex min-w-0 items-center justify-between gap-2 sm:justify-start sm:gap-3">
              <span>File Name</span>

              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="main.cpp"
                className="h-9 min-w-0 w-full max-w-[10rem] rounded-lg border border-[#30343d] bg-[#0b0d11] px-3 text-sm text-white outline-none transition placeholder:text-[#626875] focus:border-[#f64f12] focus:ring-2 focus:ring-[#f64f12]/15 sm:w-40"
              />
            </div>

            <div className="flex min-w-0 items-center justify-between gap-2 sm:justify-start sm:gap-3">
              <span className="shrink-0 text-xs text-[#9ca3af] sm:text-sm">Language</span>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-10 min-w-0 w-full max-w-[14rem] flex-1 appearance-none rounded-lg border border-[#30343d] bg-[#0b0d11] px-3 text-sm text-white outline-none transition focus:border-[#f64f12] focus:ring-2 focus:ring-[#f64f12]/15 sm:w-48 sm:flex-none"
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
          <div className="flex justify-end border-t border-[#30343d] p-3 sm:p-4">

            <button
              onClick={handleSave}
              disabled={saving}
              className="
    w-full px-5 py-2 sm:w-auto
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