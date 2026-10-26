import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FileCode2, Search, LoaderCircle, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const SearchCodeFiles = ({ projects = [], onNavigate }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadFiles = async () => {
      if (!projects.length) {
        setFiles([]);
        return;
      }

      setLoading(true);
      setLoadError("");

      try {
        const results = await Promise.all(
          projects.map(async (project) => {
            try {
              const response = await api.get(`/repositories/${project._id}/files`);
              const data = response?.data;
              const repoFiles = Array.isArray(data)
                ? data
                : data?.files || data?.codeFiles || data?.repository?.files || [];

              return repoFiles.map((file) => ({
                ...file,
                id: file._id || file.id,
                repository: {
                  id: project._id,
                  name: project.name,
                },
              }));
            } catch (error) {
              console.error(`Failed to load files for ${project.name}:`, error);
              return [];
            }
          })
        );

        if (!cancelled) {
          setFiles(results.flat().filter((file) => file.id));
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError("Couldn't load your code files.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadFiles();
    return () => {
      cancelled = true;
    };
  }, [projects]);

  const filteredFiles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];
    return files
      .filter((file) => (file.name || "").toLowerCase().includes(normalizedQuery))
      .slice(0, 8);
  }, [files, query]);

  const openFile = (file) => {
    navigate(`/repo/${file.repository.id}?file=${file.id}`);
    setQuery("");
    onNavigate?.();
  };

  const isSearching = Boolean(query.trim());

  return (
    <>
      {isSearching &&
        createPortal(
          <button
            type="button"
            aria-label="Close code search"
            onClick={() => setQuery("")}
            className="fixed inset-0 z-[40] cursor-default bg-black/25 backdrop-blur-[3px]"
          />,
          document.body
        )}
      <div className={`relative ${isSearching ? "z-[60]" : ""}`}>
      <label className="flex h-11 items-center gap-2.5 rounded-xl border border-[#30343d] bg-[#0e1015] px-3 text-[#858b98] transition  ">
        {loading ? (
          <LoaderCircle size={17} className="shrink-0 animate-spin" />
        ) : (
          <Search size={17} className="shrink-0" />
        )}
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search code files..."
          aria-label="Search code files by filename"
          className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#666b75]"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="rounded p-1 hover:bg-[#252830] hover:text-white"
          >
          
          </button>
        )}
      </label>

      {query.trim() && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[90] overflow-hidden rounded-xl border border-[#30343d] bg-[#111318] shadow-2xl">
          {loading && files.length === 0 ? (
            <p className="px-4 py-3 text-sm text-[#858b98]">Searching files...</p>
          ) : loadError ? (
            <p className="px-4 py-3 text-sm text-red-300">{loadError}</p>
          ) : filteredFiles.length ? (
            <div className="max-h-72 overflow-y-auto py-1">
              {filteredFiles.map((file) => (
                <button
                  key={`${file.repository.id}-${file.id}`}
                  type="button"
                  onClick={() => openFile(file)}
                  className="flex w-full items-center gap-3 px-3 py-3 text-left transition hover:bg-[#20232b]"
                >
                  <FileCode2 size={17} className="shrink-0 text-zinc-500" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-white">{file.name || "Untitled file"}</span>
                    <span className="block truncate text-xs text-[#858b98]">{file.repository.name}</span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="px-4 py-3 text-sm text-[#858b98]">No matching code files found.</p>
          )}
          {filteredFiles.length === 8 && (
            <p className="border-t border-[#252830] px-3 py-2 text-xs text-[#666b75]">
              Showing the first 8 matches. Type more to narrow your search.
            </p>
          )}
        </div>
      )}
      </div>
    </>
  );
};

export default SearchCodeFiles;
