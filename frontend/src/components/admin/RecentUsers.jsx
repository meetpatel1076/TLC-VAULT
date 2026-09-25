import React, { useEffect, useState } from "react";
import api from "../../services/api";

const RecentUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/users?limit=6");

        setUsers(response.data?.users || []);
      } catch (error) {
        console.error("Failed to fetch recent users:", error);

        setError(
          error.response?.data?.message ||
          "Failed to load recent users."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const formatDate = (date) => {
    if (!date) return "Never";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatLastLogin = (date) => {
    if (!date) return "Never";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name = "") => {
    const words = name.trim().split(/\s+/);

    if (!words.length) return "U";

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return (
      words[0][0] + words[words.length - 1][0]
    ).toUpperCase();
  };

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4 sm:px-5">

        <div>
          <h2 className="text-sm font-medium text-[#f6f1e8]">
            Recent Users
          </h2>

          <p className="mt-1 text-xs text-zinc-600">
            Latest registered accounts
          </p>
        </div>

        <span className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
          Users
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
              className="flex items-center gap-3 px-4 py-4 sm:px-5"
            >
              <div className="h-9 w-9 animate-pulse rounded-lg bg-zinc-800" />

              <div className="min-w-0 flex-1">
                <div className="h-3 w-32 animate-pulse rounded bg-zinc-800" />
                <div className="mt-2 h-2.5 w-44 animate-pulse rounded bg-zinc-800/80" />
              </div>
            </div>
          ))}

        </div>
      )}

      {/* EMPTY */}
      {!loading && !error && users.length === 0 && (
        <div className="px-4 py-10 text-center sm:px-5">
          <p className="text-sm text-zinc-500">
            No users found.
          </p>
        </div>
      )}

      {/* DESKTOP TABLE */}
      {!loading && !error && users.length > 0 && (
        <div className="hidden sm:block">

          <div className="grid grid-cols-[1.7fr_0.7fr_1fr_1fr] border-b border-zinc-800 px-5 py-3">

            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
              User
            </p>

            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
              Role
            </p>

            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
              Joined
            </p>

            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
              Last login
            </p>

          </div>

          <div className="divide-y divide-zinc-800">

            {users.map((user) => (
              <div
                key={user._id}
                className="
                  grid
                  grid-cols-[1.7fr_0.7fr_1fr_1fr]
                  items-center
                  px-5
                  py-4
                  transition-colors
                  duration-200
                  hover:bg-zinc-900
                "
              >

                {/* USER */}
                <div className="flex min-w-0 items-center gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-[10px] font-medium text-zinc-300">
                    {getInitials(user.name)}
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm text-[#f6f1e8]">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-zinc-600">
                      {user.email}
                    </p>

                  </div>

                </div>

                {/* ROLE */}
                <div>
                  <span
                    className={`
                      text-[10px]
                      font-medium
                      uppercase
                      tracking-[0.1em]
                      ${
                        user.role === "admin"
                          ? "text-[#f36631]"
                          : "text-zinc-500"
                      }
                    `}
                  >
                    {user.role}
                  </span>
                </div>

                {/* JOINED */}
                <p className="text-xs text-zinc-500">
                  {formatDate(user.createdAt)}
                </p>

                {/* LAST LOGIN */}
                <p className="text-xs text-zinc-500">
                  {formatLastLogin(user.lastLoginAt)}
                </p>

              </div>
            ))}

          </div>

        </div>
      )}

      {/* MOBILE LIST */}
      {!loading && !error && users.length > 0 && (
        <div className="sm:hidden divide-y divide-zinc-800">

          {users.map((user) => (
            <div
              key={user._id}
              className="px-4 py-4"
            >

              <div className="flex items-start gap-3">

                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-zinc-700 bg-zinc-800 text-[10px] font-medium text-zinc-300">
                  {getInitials(user.name)}
                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex items-start justify-between gap-3">

                    <div className="min-w-0">
                      <p className="truncate text-sm text-[#f6f1e8]">
                        {user.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-zinc-600">
                        {user.email}
                      </p>
                    </div>

                    <span
                      className={`
                        shrink-0
                        text-[9px]
                        font-medium
                        uppercase
                        tracking-[0.1em]
                        ${
                          user.role === "admin"
                            ? "text-[#f36631]"
                            : "text-zinc-600"
                        }
                      `}
                    >
                      {user.role}
                    </span>

                  </div>

                  <div className="mt-3 flex items-center gap-4 text-[10px] text-zinc-600">

                    <span>
                      Joined {formatDate(user.createdAt)}
                    </span>

                    <span>
                      Last login {formatLastLogin(user.lastLoginAt)}
                    </span>

                  </div>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </section>
  );
};

export default RecentUsers;