import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";

import api from "../../services/api";

const AdminTopbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data?.user || null);
      } catch (error) {
        console.error("Failed to fetch admin user:", error);
      }
    };

    fetchUser();
  }, []);

  const getInitials = (name = "") => {
    const words = name.trim().split(/\s+/);

    if (words.length === 0) return "A";

    if (words.length === 1) {
      return words[0].slice(0, 2).toUpperCase();
    }

    return (
      words[0][0] + words[words.length - 1][0]
    ).toUpperCase();
  };

  return (
    <header className="flex h-full items-center justify-between px-5 sm:px-7">

      {/* SEARCH */}
      <div className="w-full max-w-[520px]">

        <div className="flex h-10 items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 transition-colors duration-200 focus-within:border-zinc-700">

          <Search
            size={17}
            strokeWidth={1.7}
            className="shrink-0 text-zinc-500"
          />

          <input
            type="text"
            placeholder="Search users, repositories, code files..."
            className="
              w-full
              bg-transparent
              text-sm
              text-zinc-300
              outline-none
              placeholder:text-zinc-600
            "
          />

        </div>

      </div>

      {/* ADMIN PROFILE */}
      <div className="ml-6 flex shrink-0 items-center gap-3">

        <div className="hidden h-7 w-px bg-zinc-800 sm:block" />

        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-xs font-medium text-[#f6f1e8]">
            {getInitials(user?.name || "Admin")}
          </div>

          {/* Details */}
          <div className="hidden leading-tight sm:block">

            <p className="text-sm font-medium text-[#f6f1e8]">
              {user?.name || "Admin"}
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-zinc-600">
              Administrator
            </p>

          </div>

        </div>

      </div>

    </header>
  );
};

export default AdminTopbar;