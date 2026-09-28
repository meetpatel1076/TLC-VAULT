import React, { useEffect, useState } from "react";
import { Users, ChevronDown, RefreshCw } from "lucide-react";

import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import api from "../services/api";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [limit, setLimit] = useState("30");
  const [totalUsers, setTotalUsers] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async (selectedLimit = limit) => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/admin/users?limit=${selectedLimit}`
      );

      setUsers(response.data?.users || []);
      setTotalUsers(response.data?.totalUsers || 0);
    } catch (error) {
      console.error("Failed to fetch users:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers("30");
  }, []);

  const handleLimitChange = (event) => {
    const nextLimit = event.target.value;

    setLimit(nextLimit);
    fetchUsers(nextLimit);
  };

  const formatDate = (date) => {
    if (!date) return "Never";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getInitials = (name, email) => {
    const value = name?.trim() || email?.trim();

    if (!value) return "U";

    const parts = value.split(/\s+/);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return value.slice(0, 2).toUpperCase();
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

            {/* Page Heading */}
            <section className="mb-7">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#f36631]">
                Users
              </p>

              <h1 className="mt-2 text-3xl font-medium tracking-[-0.03em] text-[#f6f1e8] sm:text-4xl">
                All Users
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                View and inspect user accounts across the TLC Vault platform.
              </p>
            </section>

            {/* Main Card */}
            <section className="rounded-xl border border-zinc-800 bg-zinc-900/60">

              {/* Card Header */}
              <div className="flex flex-col gap-4 border-b border-zinc-800 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">

                <div className="flex items-center gap-3">
                  <Users
                    size={18}
                    strokeWidth={1.6}
                    className="shrink-0 text-zinc-400"
                  />

                  <div>
                    <h2 className="text-sm font-medium text-[#f6f1e8]">
                      Users
                    </h2>

                    <p className="mt-1 text-xs text-zinc-600">
                      Showing {users.length} of {totalUsers}
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    onClick={() => fetchUsers()}
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
                    aria-label="Refresh users"
                  >
                    <RefreshCw
                      size={15}
                      strokeWidth={1.6}
                      className={loading ? "animate-spin" : ""}
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
                        All Users
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
                    onClick={() => fetchUsers()}
                    className="mt-3 text-xs text-zinc-300 transition-colors hover:text-[#f36631]"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Loading */}
              {loading && !error && (
                <div className="divide-y divide-zinc-800">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <div
                      key={index}
                      className="px-4 py-4 sm:px-5"
                    >
                      <div className="h-3 w-36 animate-pulse rounded bg-zinc-800" />

                      <div className="mt-2 h-2.5 w-48 animate-pulse rounded bg-zinc-800/80" />

                      <div className="mt-3 h-2.5 w-24 animate-pulse rounded bg-zinc-800/60" />
                    </div>
                  ))}
                </div>
              )}

              {/* Empty */}
              {!loading &&
                !error &&
                users.length === 0 && (
                  <div className="px-4 py-14 text-center sm:px-5">
                    <p className="text-sm text-zinc-500">
                      No users found.
                    </p>
                  </div>
                )}

              {/* Desktop Table */}
              {!loading &&
                !error &&
                users.length > 0 && (
                  <div className="hidden sm:block">

                    {/* Header */}
                    <div
                      className="
                        grid
                        grid-cols-[1.6fr_0.7fr_0.9fr_0.9fr]
                        gap-4
                        border-b
                        border-zinc-800
                        px-5
                        py-3
                      "
                    >
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
                        Last Login
                      </p>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-zinc-800">
                      {users.map((user) => (
                        <div
                          key={user._id}
                          className="
                            grid
                            grid-cols-[1.6fr_0.7fr_0.9fr_0.9fr]
                            items-center
                            gap-4
                            px-5
                            py-4
                            transition-colors
                            duration-200
                            hover:bg-zinc-900
                          "
                        >
                          {/* User */}
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-[10px] font-medium text-zinc-400">
                              {getInitials(
                                user.name,
                                user.email
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm text-[#f6f1e8]">
                                {user.name || "Unnamed user"}
                              </p>

                              <p className="mt-1 truncate text-xs text-zinc-600">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          {/* Role */}
                          <p
                            className={
                              user.role === "admin"
                                ? "text-xs font-medium text-[#f36631]"
                                : "text-xs text-zinc-400"
                            }
                          >
                            {user.role || "user"}
                          </p>

                          {/* Joined */}
                          <p className="text-xs text-zinc-500">
                            {formatDate(user.createdAt)}
                          </p>

                          {/* Last Login */}
                          <p className="text-xs text-zinc-500">
                            {formatDate(user.lastLoginAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Mobile Rows */}
              {!loading &&
                !error &&
                users.length > 0 && (
                  <div className="divide-y divide-zinc-800 sm:hidden">
                    {users.map((user) => (
                      <div
                        key={user._id}
                        className="px-4 py-4"
                      >
                        <div className="flex items-start gap-3">

                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-[10px] font-medium text-zinc-400">
                            {getInitials(
                              user.name,
                              user.email
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="truncate text-sm text-[#f6f1e8]">
                                  {user.name || "Unnamed user"}
                                </p>

                                <p className="mt-1 truncate text-xs text-zinc-600">
                                  {user.email}
                                </p>
                              </div>

                              <span
                                className={
                                  user.role === "admin"
                                    ? "shrink-0 text-[10px] font-medium text-[#f36631]"
                                    : "shrink-0 text-[10px] text-zinc-500"
                                }
                              >
                                {user.role || "user"}
                              </span>
                            </div>

                            <div className="mt-3 flex items-center justify-between gap-3">
                              <p className="text-[10px] text-zinc-600">
                                Joined {formatDate(user.createdAt)}
                              </p>

                              <p className="text-[10px] text-zinc-600">
                                Login {formatDate(user.lastLoginAt)}
                              </p>
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}

            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminUsersPage;