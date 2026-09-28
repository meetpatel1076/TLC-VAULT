import React, { useEffect, useState } from "react";
import {
  FolderKanban,
  ChevronDown,
  RefreshCw,
} from "lucide-react";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import api from "../services/api";

const AdminRepositoriesPage = () => {
  const [repositories, setRepositories] = useState([]);
  const [limit, setLimit] = useState("30");
  const [totalRepositories, setTotalRepositories] =
    useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRepositories = async (
    selectedLimit = limit
  ) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/repositories?limit=${selectedLimit}`
      );

      setRepositories(
        response.data?.repositories || []
      );

      setTotalRepositories(
        response.data?.totalRepositories || 0
      );
    } catch (error) {
      console.error(
        "Failed to fetch repositories:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to load repositories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepositories("30");
  }, []);

  const handleLimitChange = (event) => {
    const nextLimit = event.target.value;

    setLimit(nextLimit);
    fetchRepositories(nextLimit);
  };

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getOwnerName = (repository) => {
    return (
      repository?.userId?.name ||
      "Unknown user"
    );
  };

  const getOwnerEmail = (repository) => {
    return repository?.userId?.email || "";
  };

  return (
    <main className="min-h-screen bg-[#0e1015] text-[#f6f1e8]">
      <div className="flex min-h-screen">

        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Main */}
        <div className="min-w-0 flex-1">

          {/* Topbar */}
          <header className="h-[72px] border-b border-zinc-800 bg-[#0e1015]">
            <AdminTopbar />
          </header>

          {/* Content */}
          <div className="p-4 sm:p-7 lg:p-8">

            {/* Heading */}
            <section className="mb-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#f36631]">
                Repositories
              </p>

              <h1 className="mt-2 text-3xl font-medium tracking-[-0.03em] text-[#f6f1e8] sm:text-4xl">
                All Repositories
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                View repositories created across the TLC Vault platform.
              </p>
            </section>

            {/* Main Card */}
            <section className="rounded-xl border border-zinc-800 bg-zinc-900/60">

              {/* Card Header */}
              <div className="flex flex-col gap-4 border-b border-zinc-800 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

                <div className="flex items-center gap-3">
                  <FolderKanban
                    size={18}
                    strokeWidth={1.6}
                    className="shrink-0 text-zinc-400"
                  />

                  <div>
                    <h2 className="text-sm font-medium text-[#f6f1e8]">
                      Repositories
                    </h2>

                    <p className="mt-1 text-xs text-zinc-600">
                      Showing {repositories.length} of{" "}
                      {totalRepositories}
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() => fetchRepositories()}
                    disabled={loading}
                    className="
                      inline-flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-lg
                      border
                      border-zinc-800
                      text-zinc-500
                      transition-colors
                      hover:border-zinc-700
                      hover:text-zinc-300
                      disabled:pointer-events-none
                      disabled:opacity-40
                    "
                    aria-label="Refresh repositories"
                  >
                    <RefreshCw
                      size={15}
                      strokeWidth={1.6}
                      className={
                        loading
                          ? "animate-spin"
                          : ""
                      }
                    />
                  </button>

                  <div className="relative">
                    <select
                      value={limit}
                      onChange={handleLimitChange}
                      className="
                        h-9
                        appearance-none
                        rounded-lg
                        border
                        border-zinc-800
                        bg-zinc-900
                        pl-3
                        pr-8
                        text-xs
                        text-zinc-300
                        outline-none
                        transition-colors
                        hover:border-zinc-700
                        focus:border-zinc-600
                      "
                    >
                      <option value="30">
                        Top 30
                      </option>

                      <option value="60">
                        Top 60
                      </option>

                      <option value="all">
                        All Repositories
                      </option>
                    </select>

                    <ChevronDown
                      size={14}
                      strokeWidth={1.6}
                      className="
                        pointer-events-none
                        absolute
                        right-2.5
                        top-1/2
                        -translate-y-1/2
                        text-zinc-600
                      "
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="px-4 py-10 text-center sm:px-5">
                  <p className="text-sm text-zinc-500">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      fetchRepositories()
                    }
                    className="mt-3 text-xs text-zinc-300 transition-colors hover:text-[#f36631]"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Loading */}
              {loading && !error && (
                <div className="divide-y divide-zinc-800">
                  {Array.from({ length: 8 }).map(
                    (_, index) => (
                      <div
                        key={index}
                        className="px-4 py-4 sm:px-5"
                      >
                        <div className="h-3 w-36 animate-pulse rounded bg-zinc-800" />

                        <div className="mt-2 h-2.5 w-52 animate-pulse rounded bg-zinc-800/80" />

                        <div className="mt-3 h-2.5 w-32 animate-pulse rounded bg-zinc-800/60" />
                      </div>
                    )
                  )}
                </div>
              )}

              {/* Empty */}
              {!loading &&
                !error &&
                repositories.length === 0 && (
                  <div className="px-4 py-14 text-center sm:px-5">
                    <p className="text-sm text-zinc-500">
                      No repositories found.
                    </p>
                  </div>
                )}

              {/* Desktop */}
              {!loading &&
                !error &&
                repositories.length > 0 && (
                  <div className="hidden sm:block">

                    <div
                      className="
                        grid
                        grid-cols-[1.4fr_1.25fr_0.75fr_0.8fr]
                        gap-4
                        border-b
                        border-zinc-800
                        px-5
                        py-3
                      "
                    >
                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                        Repository
                      </p>

                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                        Owner
                      </p>

                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                        Created
                      </p>

                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                        Updated
                      </p>
                    </div>

                    <div className="divide-y divide-zinc-800">
                      {repositories.map(
                        (repository) => (
                          <div
                            key={repository._id}
                            className="
                              grid
                              grid-cols-[1.4fr_1.25fr_0.75fr_0.8fr]
                              items-center
                              gap-4
                              px-5
                              py-4
                              transition-colors
                              duration-200
                              hover:bg-zinc-900
                            "
                          >
                            {/* Repository */}
                            <div className="min-w-0">
                              <p className="truncate text-sm text-[#f6f1e8]">
                                {repository.name}
                              </p>

                              <p className="mt-1 truncate text-xs text-zinc-600">
                                {repository.description ||
                                  "No description"}
                              </p>
                            </div>

                            {/* Owner */}
                            <div className="min-w-0">
                              <p className="truncate text-xs text-zinc-400">
                                {getOwnerName(
                                  repository
                                )}
                              </p>

                              <p className="mt-1 truncate text-[10px] text-zinc-600">
                                {getOwnerEmail(
                                  repository
                                )}
                              </p>
                            </div>

                            {/* Created */}
                            <p className="text-xs text-zinc-500">
                              {formatDate(
                                repository.createdAt
                              )}
                            </p>

                            {/* Updated */}
                            <p className="text-xs text-zinc-500">
                              {formatDate(
                                repository.updatedAt
                              )}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* Mobile */}
              {!loading &&
                !error &&
                repositories.length > 0 && (
                  <div className="divide-y divide-zinc-800 sm:hidden">
                    {repositories.map(
                      (repository) => (
                        <div
                          key={repository._id}
                          className="px-4 py-4"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm text-[#f6f1e8]">
                              {repository.name}
                            </p>

                            <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-600">
                              {repository.description ||
                                "No description"}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate text-xs text-zinc-400">
                                {getOwnerName(
                                  repository
                                )}
                              </p>

                              <p className="mt-1 truncate text-[10px] text-zinc-600">
                                {getOwnerEmail(
                                  repository
                                )}
                              </p>
                            </div>

                            <p className="shrink-0 text-[10px] text-zinc-600">
                              {formatDate(
                                repository.createdAt
                              )}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminRepositoriesPage;