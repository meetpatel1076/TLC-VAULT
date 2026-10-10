import React, { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import {
  Save,
  Copy,
  Check,
  Play,
  ChevronDown,
  X,
  LoaderCircle,
  ExternalLink,
} from "lucide-react";
import api from "../services/api";
import HoldButton from "./HoldButton";

const ONECOMPILER_ORIGIN = "https://onecompiler.com";

const getOneCompilerLanguage = (language = "") => {
  const normalized = language.toLowerCase().trim();
  const aliases = {
    "c++": "cpp",
    cpp: "cpp",
    c: "c",
    js: "javascript",
    javascript: "javascript",
    ts: "typescript",
    typescript: "typescript",
    py: "python",
    python: "python",
    java: "java",
    html: "html",
    css: "css",
    json: "json",
  };

  return aliases[normalized] || normalized || "javascript";
};


const prepareCodeForOneCompiler = (code, language) => {
  if (language !== "java") return code;

  const mainMethodIndex = code.search(/\bstatic\s+void\s+main\s*\(/);
  if (mainMethodIndex === -1) return code;

  const classMatches = [...code.matchAll(/\b(class)\s+([A-Za-z_$][\w$]*)/g)];
  if (!classMatches.length) return code;

  const mainClass = classMatches.filter((match) => match.index < mainMethodIndex).at(-1);
  if (!mainClass) return code;

  const className = mainClass[2];
  if (className === "Main") return code;

  const classNamePattern = new RegExp(`\\bclass(\\s+)${className}\\b`);
  return code.replace(classNamePattern, `class$1Main`);
};

const SavedCodeEditor = ({ file, onUpdated, onDeleted }) => {
  const [code, setCode] = useState(file.code || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [compilerOpen, setCompilerOpen] = useState(false);
  const [compilerLoading, setCompilerLoading] = useState(false);
  const [compilerError, setCompilerError] = useState("");
  const [compilerFile, setCompilerFile] = useState(null);
  const [compilerSession, setCompilerSession] = useState(0);
  const iframeRef = useRef(null);
  const compilerSectionRef = useRef(null);

  useEffect(() => {
    setCode(file.code || "");
  }, [file._id, file.code]);

  useEffect(() => {
    const handleScroll = () => setCopied(false);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    if (!compilerOpen) return undefined;

    const handleCompilerMessage = (event) => {
      if (
        event.origin !== ONECOMPILER_ORIGIN ||
        event.source !== iframeRef.current?.contentWindow
      ) {
        return;
      }

      const payload = event.data;
      if (!payload || typeof payload !== "object" || !Array.isArray(payload.files)) {
        return;
      }

      const matchingFile =
        payload.files.find((item) => item?.name === compilerFile?.name) ||
        payload.files[0];

      if (typeof matchingFile?.content === "string") {
        setCode(matchingFile.content);
      }
    };

    window.addEventListener("message", handleCompilerMessage);
    return () => window.removeEventListener("message", handleCompilerMessage);
  }, [compilerOpen, compilerFile?.name]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.patch(`/codefiles/${file._id}`, { code });
      await onUpdated?.();
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
      await onDeleted?.();
    } catch (error) {
      console.error("Failed to delete code:", error);
    } finally {
      setDeleting(false);
    }
  };

  const loadCompilerFile = async () => {
    setCompilerOpen(true);
    setCompilerLoading(true);
    setCompilerError("");
    setCompilerFile(null);
    setCompilerSession((session) => session + 1);

    try {
      setCompilerFile({
        name: file.name || "main.js",
        language: getOneCompilerLanguage(file.language),
        code: prepareCodeForOneCompiler(
          typeof code === "string" ? code : (file.code || ""),
          getOneCompilerLanguage(file.language)
        ),
      });
    } catch (error) {
      console.error("Failed to load code for OneCompiler:", error);
      setCompilerError(error.message || "Couldn't load this file. Please try again.");
    } finally {
      setCompilerLoading(false);
    }
  };

  const handleRun = async () => {
  if (compilerOpen) {
    setCompilerOpen(false);
    return;
  }

  await loadCompilerFile();

  setTimeout(() => {
    compilerSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 300);
};

  const handleCompilerLoad = useCallback(() => {
    const iframeWindow = iframeRef.current?.contentWindow;
    if (!iframeWindow || !compilerFile) return;

    const populateCode = () => {
      if (iframeRef.current?.contentWindow !== iframeWindow) return;

      iframeWindow.postMessage(
        {
          eventType: "populateCode",
          language: compilerFile.language,

          files: [
            {
              name:
                compilerFile.language === "cpp"
                  ? "main.cpp"
                  : compilerFile.language === "c"
                    ? "main.c"
                    : compilerFile.language === "java"
                      ? "Main.java"
                      : compilerFile.language === "python"
                        ? "main.py"
                        : compilerFile.language === "javascript"
                          ? "main.js"
                          : compilerFile.language === "typescript"
                            ? "main.ts"
                            : compilerFile.name,
              content: compilerFile.code,
            },
          ],

        },
        ONECOMPILER_ORIGIN
      );
    };

    populateCode();
    window.setTimeout(populateCode, 400);
    window.setTimeout(populateCode, 1000);
    window.setTimeout(() => {
      if (iframeRef.current?.contentWindow !== iframeWindow) return;
      populateCode();
      window.setTimeout(() => {
        if (iframeRef.current?.contentWindow === iframeWindow) {
          iframeWindow.postMessage({ eventType: "triggerRun" }, ONECOMPILER_ORIGIN);
        }
      }, 500);
    }, 1600);
  }, [compilerFile]);

  const editorHeight = Math.min(
    Math.max(100, code.split("\n").length * 20 + 32),
    520
  );

  const compilerSrc = compilerFile
    ? `https://onecompiler.com/embed/${encodeURIComponent(
      compilerFile.language
    )}?theme=dark&listenToEvents=true&codeChangeEvent=true&hideLanguageSelection=true&hideNew=true&hideTitle=true`
    : "";

  return (
    <div className="overflow-hidden rounded-xl border border-[#30343d] bg-[#111318]">
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-[#30343d] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate font-medium text-white">{file.name}</span>
          <span className="shrink-0 text-xs uppercase text-[#717784]">
            {file.language}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleRun}
            disabled={compilerLoading}
            title={compilerOpen ? "Close compiler" : "Run saved code with OneCompiler"}
            className="flex items-center gap-2 rounded-lg border border-orange-400/30 bg-orange-400/10 px-3 py-1.5 text-sm text-orange-300 transition hover:bg-orange-400/20 disabled:cursor-wait disabled:opacity-60"
          >
            {compilerLoading ? (
              <LoaderCircle size={16} className="animate-spin" />
            ) : compilerOpen ? (
              <ChevronDown size={16} />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
            {compilerLoading ? "Loading..." : compilerOpen ? "Hide compiler" : "Run"}
          </button>

          <button
            type="button"
            onClick={handleCopy}
            title="Copy code"
            className="rounded-lg p-2 text-[#9ca3af] transition hover:bg-[#191c22] hover:text-white"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-[#9ca3af] transition hover:bg-[#191c22] hover:text-white disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Updating..." : "Update"}
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
          padding: { top: 16, bottom: 16 },
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          scrollBeyondLastLine: false,
        }}
      />

      {compilerOpen && (
  <section
    ref={compilerSectionRef}
    className="border-t border-[#30343d] bg-[#0b0d11]"
  >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#242832] px-4 py-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Play size={15} className="text-orange-300" />
                OneCompiler
                <span className="rounded-md border border-[#30343d] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#9ca3af]">
                  {compilerFile?.language || file.language}
                </span>
              </div>
              <p className="mt-1 text-xs text-[#858b98]">
                Loaded from the selected Monaco editor. Click Update to save any unsaved edits back to TLC Vault.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://onecompiler.com/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#9ca3af] transition hover:text-white"
              >
                Open OneCompiler <ExternalLink size={13} />
              </a>
              <button
                type="button"
                onClick={() => setCompilerOpen(false)}
                title="Close compiler"
                className="rounded-md p-1.5 text-[#9ca3af] transition hover:bg-[#191c22] hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {compilerLoading && (
            <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-[#9ca3af]">
              <LoaderCircle size={18} className="animate-spin" />
              Loading saved code from your backend...
            </div>
          )}

          {!compilerLoading && compilerError && (
            <div className="m-4 rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-300">
              <p>{compilerError}</p>
              <button
                type="button"
                onClick={loadCompilerFile}
                className="mt-3 rounded-md border border-red-500/30 px-3 py-1.5 text-xs transition hover:bg-red-500/10"
              >
                Try again
              </button>
            </div>
          )}

          {!compilerLoading && !compilerError && compilerFile && (
            <div className="p-2 sm:p-3">
              <iframe
                key={`${file._id}-${compilerSession}`}
                ref={iframeRef}
                title={`OneCompiler for ${compilerFile.name}`}
                src={compilerSrc}
                onLoad={handleCompilerLoad}
                className="block h-[560px] w-full rounded-lg border border-[#242832] bg-[#111318] sm:h-[620px]"
                allow="clipboard-read; clipboard-write"
                loading="eager"
              />
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default SavedCodeEditor;
