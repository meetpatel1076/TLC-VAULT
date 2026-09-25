import React, { useEffect, useState } from "react";
import api from "../../services/api";

const RecentCodeFiles = () => {
  const [codeFiles, setCodeFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCodeFiles = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/admin/codefiles?limit=6"
        );

        setCodeFiles(
          response.data?.codeFiles || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch recent code files:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load recent code files."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCodeFiles();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getOwnerName = (file) => {
    return file?.userId?.name || "Unknown user";
  };

  const getOwnerEmail = (file) => {
    return file?.userId?.email || "";
  };

  const getRepositoryName = (file) => {
    return file?.repositoryId?.name || "Unknown repository";
  };

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-sm font-medium text-[#f6f1e8]">
            Recent Code Files
          </h2>

          <p className="mt-1 text-xs text-zinc-600">
            Latest code files added by users
          </p>
        </div>

        <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
          Code Files
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-5 sm:px-5">
          <p className="text-sm text-zinc-500">
            {error}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="divide-y divide-zinc-800">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="px-4 py-4 sm:px-5"
            >
              <div className="h-3 w-36 animate-pulse rounded bg-zinc-800" />

              <div className="mt-2 h-2.5 w-52 animate-pulse rounded bg-zinc-800/80" />

              <div className="mt-3 h-2.5 w-32 animate-pulse rounded bg-zinc-800/60" />
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        codeFiles.length === 0 && (
          <div className="px-4 py-10 text-center sm:px-5">
            <p className="text-sm text-zinc-500">
              No code files found.
            </p>
          </div>
        )}

      {/* Desktop */}
      {!loading &&
        !error &&
        codeFiles.length > 0 && (
          <div className="hidden sm:block">
            {/* Table Header */}
            <div
              className="
                grid
                grid-cols-[1.25fr_0.65fr_1.1fr_1.1fr_0.75fr_0.75fr]
                gap-4
                border-b
                border-zinc-800
                px-5
                py-3
              "
            >
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                File
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                Language
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                Owner
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                Repository
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                Created
              </p>

              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                Updated
              </p>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-zinc-800">
              {codeFiles.map((file) => (
                <div
                  key={file._id}
                  className="
                    grid
                    grid-cols-[1.25fr_0.65fr_1.1fr_1.1fr_0.75fr_0.75fr]
                    items-center
                    gap-4
                    px-5
                    py-4
                    transition-colors
                    duration-200
                    hover:bg-zinc-900
                  "
                >
                  {/* File */}
                  <div className="min-w-0">
                    <p className="truncate text-sm text-[#f6f1e8]">
                      {file.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-zinc-600">
                      {file.description || "No description"}
                    </p>
                  </div>

                  {/* Language */}
                  <p className="truncate text-xs text-zinc-400">
                    {file.language || "—"}
                  </p>

                  {/* Owner */}
                  <div className="min-w-0">
                    <p className="truncate text-xs text-zinc-400">
                      {getOwnerName(file)}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-zinc-600">
                      {getOwnerEmail(file)}
                    </p>
                  </div>

                  {/* Repository */}
                  <p className="truncate text-xs text-zinc-400">
                    {getRepositoryName(file)}
                  </p>

                  {/* Created */}
                  <p className="text-xs text-zinc-500">
                    {formatDate(file.createdAt)}
                  </p>

                  {/* Updated */}
                  <p className="text-xs text-zinc-500">
                    {formatDate(file.updatedAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

      {/* Mobile */}
      {!loading &&
        !error &&
        codeFiles.length > 0 && (
          <div className="divide-y divide-zinc-800 sm:hidden">
            {codeFiles.map((file) => (
              <div
                key={file._id}
                className="px-4 py-4"
              >
                {/* File */}
                <div className="min-w-0">
                  <p className="truncate text-sm text-[#f6f1e8]">
                    {file.name}
                  </p>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-600">
                    {file.description || "No description"}
                  </p>
                </div>

                {/* Language + repository */}
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-xs text-zinc-400">
                      {file.language || "—"}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-zinc-600">
                      {getRepositoryName(file)}
                    </p>
                  </div>

                  <p className="shrink-0 text-[10px] text-zinc-600">
                    {formatDate(file.createdAt)}
                  </p>
                </div>

                {/* Owner */}
                <div className="mt-3">
                  <p className="truncate text-xs text-zinc-400">
                    {getOwnerName(file)}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-zinc-600">
                    {getOwnerEmail(file)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
    </section>
  );
};

export default RecentCodeFiles;