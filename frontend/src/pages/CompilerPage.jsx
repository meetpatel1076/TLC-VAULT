import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Code2, FolderPlus, Save, X, LoaderCircle, FileCode2 } from "lucide-react";
import api from "../services/api";

const ONECOMPILER_ORIGIN = "https://onecompiler.com";

const LANGUAGE_EXTENSIONS = {
  c: "c",
  cpp: "cpp",
  java: "java",
  python: "py",
  javascript: "js",
  typescript: "ts",
  html: "html",
  css: "css",
  json: "json",
  csharp: "cs",
  go: "go",
  rust: "rs",
  ruby: "rb",
  php: "php",
  kotlin: "kt",
  swift: "swift",
};

const supportedLanguage = (value) => {
  const language = String(value || "").toLowerCase().trim();
  return LANGUAGE_EXTENSIONS[language] ? language : "javascript";
};

const filenameForLanguage = (language) => `main.${LANGUAGE_EXTENSIONS[supportedLanguage(language)] || "js"}`;

const CompilerPage = () => {
  const iframeRef = useRef(null);
  const [user, setUser] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [files, setFiles] = useState([]);
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [fileName, setFileName] = useState("main.cpp");
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveTarget, setSaveTarget] = useState("existing");
  const [repoChoice, setRepoChoice] = useState("");
  const [fileMode, setFileMode] = useState("new");
  const [fileChoice, setFileChoice] = useState("");
  const [newRepoName, setNewRepoName] = useState("");
  const [newRepoDescription, setNewRepoDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const compilerSrc = useMemo(
    () => "https://onecompiler.com/embed/cpp?theme=dark&listenToEvents=true&codeChangeEvent=true",
    []
  );

  const fetchRepositories = useCallback(async () => {
    setLoadingRepos(true);
    try {
      const [repoResponse, userResponse] = await Promise.all([
        api.get("/repositories"),
        api.get("/auth/me").catch(() => null),
      ]);
      const list = repoResponse.data?.repositories || [];
      setRepositories(list);
      setUser(userResponse?.data?.user || null);
      if (!repoChoice && list[0]?._id) setRepoChoice(list[0]._id);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't load your repositories. Please sign in and try again.");
    } finally {
      setLoadingRepos(false);
    }
  }, [repoChoice]);

  useEffect(() => {
    fetchRepositories();
  }, [fetchRepositories]);

  useEffect(() => {
    if (!repoChoice) {
      setFiles([]);
      setFileChoice("");
      return;
    }

    let cancelled = false;
    const fetchFiles = async () => {
      try {
        const { data } = await api.get(`/repositories/${repoChoice}/files`);
        if (cancelled) return;
        const list = data?.codeFiles || [];
        setFiles(list);
        setFileChoice((current) => list.some((file) => file._id === current) ? current : (list[0]?._id || ""));
      } catch (err) {
        if (!cancelled) {
          setFiles([]);
          setFileChoice("");
        }
      }
    };

    fetchFiles();
    return () => { cancelled = true; };
  }, [repoChoice]);

  useEffect(() => {
    const handleCompilerMessage = (event) => {
      if (event.origin !== ONECOMPILER_ORIGIN || event.source !== iframeRef.current?.contentWindow) return;
      const payload = event.data;
      if (!payload || typeof payload !== "object" || !Array.isArray(payload.files)) return;

      const matchingFile = payload.files.find((item) => item && typeof item.content === "string");
      if (matchingFile) setCode(matchingFile.content);

      if (payload.language) {
        const nextLanguage = supportedLanguage(payload.language);
        setLanguage((current) => current === nextLanguage ? current : nextLanguage);
        setFileName((current) => {
          const hasKnownExtension = /\.(c|cpp|java|py|js|ts|html|css|json|cs|go|rs|rb|php|kt|swift)$/i.test(current);
          return hasKnownExtension ? current.replace(/\.[^.]+$/, `.${LANGUAGE_EXTENSIONS[nextLanguage]}`) : filenameForLanguage(nextLanguage);
        });
      }
    };

    window.addEventListener("message", handleCompilerMessage);
    return () => window.removeEventListener("message", handleCompilerMessage);
  }, []);

  const handleLanguageChange = (nextLanguage) => {
    const next = supportedLanguage(nextLanguage);
    setLanguage(next);
    setFileName((current) => {
      const extension = LANGUAGE_EXTENSIONS[next];
      return current.includes(".") ? current.replace(/\.[^.]+$/, `.${extension}`) : filenameForLanguage(next);
    });
  };

  const handleSave = async () => {
    setError("");
    setMessage("");

    if (!user) {
      setError("Please sign in to save code.");
      return;
    }
    if (!code.trim()) {
      setError("There is no code to save yet. Write code in OneCompiler first.");
      return;
    }
    if (!fileName.trim()) {
      setError("Enter a filename before saving.");
      return;
    }
    if (saveTarget === "new" && !newRepoName.trim()) {
      setError("Enter a name for your new repository.");
      return;
    }
    if (saveTarget === "existing" && !repoChoice) {
      setError("Select a repository.");
      return;
    }
    if (saveTarget === "existing" && fileMode === "update" && !fileChoice) {
      setError("Select a file to update.");
      return;
    }

    setSaving(true);
    try {
      let targetRepoId = repoChoice;

      if (saveTarget === "new") {
        const { data } = await api.post("/repositories", {
          name: newRepoName.trim(),
          description: newRepoDescription.trim(),
        });
        const newRepository = data?.repository;
        if (!newRepository?._id) throw new Error("Repository was created, but its ID was not returned.");
        targetRepoId = newRepository._id;
      }

      if (saveTarget === "existing" && fileMode === "update") {
        await api.patch(`/codefiles/${fileChoice}`, { code });
        setMessage("Code saved to the selected existing file.");
      } else {
        await api.post(`/repositories/${targetRepoId}/files`, {
          name: fileName.trim(),
          language,
          code,
        });
        setMessage(saveTarget === "new"
          ? "Repository and code file created successfully."
          : "Code saved as a new file in your repository.");
      }

      await fetchRepositories();
      if (saveTarget === "new") {
        setRepoChoice(targetRepoId);
        setSaveTarget("existing");
        setNewRepoName("");
        setNewRepoDescription("");
      }
      if (saveTarget === "existing" && fileMode === "new") {
        const { data } = await api.get(`/repositories/${targetRepoId}/files`);
        setFiles(data?.codeFiles || []);
      }
      setSaveOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Couldn't save code. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen min-w-0 overflow-x-hidden bg-primary text-white">
      <main className="mx-auto w-full max-w-[1800px] px-3 pb-8 pt-[76px] sm:px-5 md:px-6 md:pt-[86px]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>


            <p className="mt-1 text-sm text-[#858b98]">Write, run, and <span className=" text-white">Save</span> your code to your TLC Vault repositories.</p>
          </div>

        </div>

        <section className="overflow-hidden rounded-xl border border-[#30343d] bg-[#111318]">

          <iframe
            ref={iframeRef}
            title="TLC Vault OneCompiler"
            src={compilerSrc}
            className="block h-[calc(100vh-245px)] min-h-[560px] w-full bg-[#111318]"
            allow="clipboard-read; clipboard-write"
            loading="eager"
          />
        </section>

        <section className="mt-5 overflow-hidden rounded-2xl border border-[#30343d] bg-[#111318] shadow-[0_12px_36px_rgba(0,0,0,0.16)]">
          <button
            type="button"
            onClick={() => { setSaveOpen((open) => !open); setError(""); setMessage(""); }}
            aria-expanded={saveOpen}
            className="flex bg-[#f64f12] w-full items-center justify-between gap-4 px-4 py-4 text-left transition  sm:px-6"
          >
            <span className="flex min-w-0 items-center gap-3 sm:gap-4">

              <span className="min-w-0">
                <span className="block font-semibold tracking-tight text-white">Save Code to TLC Vault</span>
                
              </span>
            </span>
            
          </button>

          {saveOpen && (
            <div className="space-y-6 border-t border-[#30343d] p-4 sm:p-6">
              {!user && (
                <p className="rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3.5 text-sm leading-6 text-amber-200">
                  You need to <Link to="/login" className="font-semibold underline underline-offset-4">sign in</Link> before saving code.
                </p>
              )}

              <div>
                <div className="mb-3">
                  <h2 className="text-sm  text-gray-300">Where do you want to save?</h2>

                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setSaveTarget("new")}
                    className={`group flex min-h-[108px] items-start gap-3 rounded-xl border p-4 text-left transition sm:p-5 ${saveTarget === "new" ? "border-[#f64f12]  shadow-[inset_0_0_0_1px_rgba(246,79,18,0.12)]" : "border-[#30343d] bg-[#0d0f13] hover:border-[#454a55] "}`}
                  >

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">Create new repository {saveTarget === "new" && ""}</span>
                      <span className="mt-1.5 block text-xs leading-5 text-[#858b98]">Start a new project and save this code as its first file.</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSaveTarget("existing")}
                    className={`group flex min-h-[108px] items-start gap-3 rounded-xl border p-4 text-left transition sm:p-5 ${saveTarget === "existing" ? "border-[#f64f12]  shadow-[inset_0_0_0_1px_rgba(246,79,18,0.12)]" : "border-[#30343d] bg-[#0d0f13] hover:border-[#454a55] "}`}
                  >

                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">Use existing repository {saveTarget === "existing" && ""}</span>
                      <span className="mt-1.5 block text-xs leading-5 text-[#858b98]">Add a new file or replace code in a file you already saved.</span>
                    </span>
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-[#30343d] bg-[#0d0f13] p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">

                  <h2 className="text-sm font-semibold text-gray-300">{saveTarget === "new" ? "New repository details" : "Repository details"}</h2>
                </div>

                {saveTarget === "new" ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#9ca3af]">Repository name</label>
                      <input value={newRepoName} onChange={(e) => setNewRepoName(e.target.value)} placeholder="My C++ Practice" className="h-11 w-full rounded-lg border border-[#30343d] bg-[#090a0d] px-3.5 text-sm text-white outline-none transition placeholder:text-[#626875] focus:border-[#f64f12] focus:ring-2 focus:ring-[#f64f12]/10" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#9ca3af]">Description <span className="normal-case tracking-normal text-[#626875]">(optional)</span></label>
                      <input value={newRepoDescription} onChange={(e) => setNewRepoDescription(e.target.value)} placeholder="Practice problems and experiments" className="h-11 w-full rounded-lg border border-[#30343d] bg-[#090a0d] px-3.5 text-sm text-white outline-none transition placeholder:text-[#626875] focus:border-[#f64f12] focus:ring-2 focus:ring-[#f64f12]/10" />
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#9ca3af]">Choose repository</label>
                      <select value={repoChoice} onChange={(e) => setRepoChoice(e.target.value)} disabled={loadingRepos || repositories.length === 0} className="h-11 w-full rounded-lg border border-[#30343d] bg-[#090a0d] px-3.5 text-sm text-white outline-none transition focus:border-[#f64f12] disabled:cursor-not-allowed disabled:opacity-60">
                        {repositories.length === 0 ? <option value="">No repositories found</option> : repositories.map((repo) => <option key={repo._id} value={repo._id}>{repo.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#9ca3af]">Save method</label>
                      <select value={fileMode} onChange={(e) => setFileMode(e.target.value)} className="h-11 w-full rounded-lg border border-[#30343d] bg-[#090a0d] px-3.5 text-sm text-white outline-none transition focus:border-[#f64f12]">
                        <option value="new">Create a new code file</option>
                        <option value="update">Update an existing file</option>
                      </select>
                    </div>
                  </div>
                )}

                {saveTarget === "existing" && fileMode === "update" && (
                  <div className="mt-4">
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#9ca3af]">File to update</label>
                    <select value={fileChoice} onChange={(e) => setFileChoice(e.target.value)} disabled={files.length === 0} className="h-11 w-full rounded-lg border border-[#30343d] bg-[#090a0d] px-3.5 text-sm text-white outline-none transition focus:border-[#f64f12] disabled:cursor-not-allowed disabled:opacity-60">
                      {files.length === 0 ? <option value="">This repository has no code files</option> : files.map((file) => <option key={file._id} value={file._id}>{file.name} ({file.language})</option>)}
                    </select>
                    <p className="mt-2 text-xs leading-5 text-amber-200/80">This replaces the selected file's saved code with the code currently in OneCompiler.</p>
                  </div>
                )}

                {(saveTarget === "new" || (saveTarget === "existing" && fileMode === "new")) && (
                  <div className="mt-4">
                    <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-[#9ca3af]">File name</label>
                    <input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder={filenameForLanguage(language)} className="h-11 w-full max-w-xl rounded-lg border border-[#30343d] bg-[#090a0d] px-3.5 text-sm text-white outline-none transition placeholder:text-[#626875] focus:border-[#f64f12] focus:ring-2 focus:ring-[#f64f12]/10" />
                  </div>
                )}
              </div>

              {error && <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/[0.06] p-3.5 text-sm leading-5 text-red-300">{error}</p>}
              {message && <p role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.06] p-3.5 text-sm leading-5 text-emerald-300">{message}</p>}

              <div className="flex flex-col gap-3 border-t border-[#30343d] pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-lg text-xs leading-5 text-[#717784]">Your latest code in the compiler will be saved to the selected destination.</p>
                <button type="button" onClick={handleSave} disabled={saving || loadingRepos} className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#f64f12] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(246,79,18,0.16)] transition hover:bg-[#f36631] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f64f12] focus-visible:ring-offset-2 focus-visible:ring-offset-[#111318] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto">
                  {saving ? <LoaderCircle size={17} className="animate-spin" /> : <Save size={17} />}
                  {saving ? "Saving..." : "Save Code"}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CompilerPage;
