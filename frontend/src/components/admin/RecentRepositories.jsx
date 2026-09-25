import React, { useEffect, useState } from "react";
import api from "../../services/api";

const RecentRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/admin/repositories?limit=6"
        );

        setRepositories(
          response.data?.repositories || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch recent repositories:",
          error
        );

        setError(
          error.response?.data?.message ||
          "Failed to load recent repositories."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getOwnerName = (repository) => {
    return repository?.userId?.name || "Unknown user";
  };

  const getOwnerEmail = (repository) => {
    return repository?.userId?.email || "";
  };

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4 sm:px-5">

        <div>
          <h2 className="text-sm font-medium text-[#f6f1e8]">
            Recent Repositories
          </h2>

          <p className="mt-1 text-xs text-zinc-600">
            Latest repositories created by users
          </p>
        </div>

        <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
          Repositories
        </span>

      </div>

      {/* ERROR */}
      {error && (
        <div className="px-4 py-5 sm:px-5">
          <p className="text-sm text-zinc-500">
            {error}
          </p>
        </div>
      )}

      {/* LOADING */}
      {loading && !error && (
        <div className="divide-y divide-zinc-800">

          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="px-4 py-4 sm:px-5"
            >
              <div className="h-3 w-36 animate-pulse rounded bg-zinc-800" />

              <div className="mt-2 h-2.5 w-52 animate-pulse rounded bg-zinc-800/80" />

              <div className="mt-3 h-2.5 w-28 animate-pulse rounded bg-zinc-800/60" />
            </div>
          ))}

        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && repositories.length === 0 && (
        <div className="px-4 py-10 text-center sm:px-5">
          <p className="text-sm text-zinc-500">
            No repositories found.
          </p>
        </div>
      )}

      {/* DESKTOP */}
      {!loading && !error && repositories.length > 0 && (
        <div className="hidden sm:block">

          {/* TABLE HEADER */}
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

          {/* ROWS */}
          <div className="divide-y divide-zinc-800">

            {repositories.map((repository) => (
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

                {/* REPOSITORY */}
                <div className="min-w-0">

                  <p className="truncate text-sm text-[#f6f1e8]">
                    {repository.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-zinc-600">
                    {repository.description || "No description"}
                  </p>

                </div>

                {/* OWNER */}
                <div className="min-w-0">

                  <p className="truncate text-xs text-zinc-400">
                    {getOwnerName(repository)}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-zinc-600">
                    {getOwnerEmail(repository)}
                  </p>

                </div>

                {/* CREATED */}
                <p className="text-xs text-zinc-500">
                  {formatDate(repository.createdAt)}
                </p>

                {/* UPDATED */}
                <p className="text-xs text-zinc-500">
                  {formatDate(repository.updatedAt)}
                </p>

              </div>
            ))}

          </div>

        </div>
      )}

      {/* MOBILE */}
      {!loading && !error && repositories.length > 0 && (
        <div className="divide-y divide-zinc-800 sm:hidden">

          {repositories.map((repository) => (
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
                    {getOwnerName(repository)}
                  </p>

                  <p className="mt-1 truncate text-[10px] text-zinc-600">
                    {getOwnerEmail(repository)}
                  </p>

                </div>

                <p className="shrink-0 text-[10px] text-zinc-600">
                  {formatDate(repository.createdAt)}
                </p>

              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
};

export default RecentRepositories;