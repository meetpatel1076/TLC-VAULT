import React, { useState } from "react";

import {
  Plus,
  Box,
  ChevronDown,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SwipeRow from "./Swiper";

const projects = [
  "Portfolio Website"
  
];

const Sidebar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const API_BASE_URL = import.meta.env.VITE_API_URL || "";

      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  };
  return (
    <aside
      className={`
        fixed left-0 top-0 z-50 h-screen
        border-r border-[#252830]
        bg-[#111318]
        flex flex-col
        transition-all duration-300
        ${collapsed ? "w-[72px]" : "w-[300px]"}
      `}
    >

      {/* Header */}
      <div
        className={`
          flex items-center py-5
          ${collapsed ? "justify-center px-3" : "justify-between px-5"}
        `}
      >

        {/* Logo */}
        <div className="flex items-center gap-3">



          {!collapsed && (
            <span className="text-[17px] font-semibold text-white whitespace-nowrap">
              TLC Vault
            </span>
          )}

        </div>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#9ca3af] hover:text-white transition"
        >
          {collapsed ? (
            <PanelLeftOpen size={21} />
          ) : (
            <PanelLeftClose size={21} />
          )}
        </button>

      </div>


      {/* New Project */}
      <div className={collapsed ? "px-3 mt-2" : "px-5 mt-2"}>

        <button
        onClick={()=>navigate("/dashboard")}
          className={`
            h-[48px] rounded-xl
            border border-[#30343d]
            flex items-center
            text-[#e5e7eb]
            bg-[#f64f12]
            transition
            ${collapsed
              ? "w-full justify-center"
              : "w-full gap-3 px-5"
            }
          `}
        >

          <Plus size={20} />

          {!collapsed && (
            <span className="font-medium">
              New Project
            </span>
          )}

        </button>

      </div>


<div
  className={`
    mt-12 px-5
    transition-all duration-300 ease-out
    ${
      collapsed
        ? "opacity-0 -translate-x-3 pointer-events-none"
        : "opacity-100 translate-x-0"
    }
  `}
>
  <p className="px-3 mb-4 text-[14px] font-medium text-[#9ca3af]">
    Projects
  </p>

  <div className="space-y-1">

    {projects.map((project, index) => (
      <button
        key={project}
        className={`
          w-full
          rounded-xl
          text-[15px]
          text-left
          px-4 py-3
          transition-colors duration-200

          ${
            index === 0
              ? "bg-[#20232b] text-white border border-[#2d313a]"
              : "text-[#9ca3af] hover:bg-[#191c22] hover:text-white"
          }
        `}
      >
        {project}
      </button>
    ))}

  </div>

  <button className="mt-4 px-3 flex items-center gap-2 text-[14px] text-[#9ca3af] hover:text-white transition-colors">
    Show more
    <ChevronDown size={15} />
  </button>
</div>


      {/* User */}
      <div
        className={`
          mt-auto border-t border-[#252830] py-4
          ${collapsed ? "px-3" : "px-5"}
        `}
      >

        {/* Logout swipe action */}
        {!collapsed && (
          <SwipeRow
            actions={[
              {
                id: "logout",
                label: loggingOut ? "Logging out..." : "Logout",
                icon: <LogOut size={19} strokeWidth={2} />,
              },
            ]}
            onCommit={handleLogout}
            actionColor="#D22B2B"
            drawerColor="#f36631"
            rowColor="#27272a"
            textColor="#f5f5f5"
            height={52}
            radius={12}
            actionWidth={88}
            direction="left"
            snapBounce={0.2}
            resistance={0.55}
            collapseMs={200}
            commitAt={0.6}
            fullSwipe
            disabled={loggingOut}
            label="Logout"
            style={{ marginBottom: 10 }}
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-sm text-zinc-300">
                Swipe to log out
              </span>
              <span className="text-xs text-zinc-500">←</span>
            </div>
          </SwipeRow>
        )}

        <div
          className={`
            flex items-center
            ${collapsed ? "justify-center" : "gap-3"}
          `}
        >

          {/* Avatar */}
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#292d35] border border-[#3a3e47] flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              T
            </span>
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">
                Meet
              </p>

              <p className="text-xs text-[#9ca3af] truncate">
                meetpatel@gmail.com
              </p>
            </div>
          )}

        </div>

      </div>

    </aside>
  );
};

export default Sidebar;