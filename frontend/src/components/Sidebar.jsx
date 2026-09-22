import React from "react";

import {
  Plus,
  Box,
  ChevronDown,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";
import SwipeRow from "./Swiper";
import api from "../services/api";


const Sidebar = ({ collapsed, setCollapsed, projects, fetchProjects, user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState(null);
  const [deleteProject, setDeleteProject] = React.useState(null);

  const handleDeleteProject = async (repoId) => {
    if (deletingId) return;

    try {
      setDeletingId(repoId);

      await api.delete(`/repositories/${repoId}`);

      await fetchProjects();
      setDeleteProject(null);

      if (location.pathname === `/repo/${repoId}`) {
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await api.post("/auth/logout");
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
            <span className="text-[17px] font-bold text-white whitespace-nowrap" style={{ fontFamily: "monospace" }}>
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
          onClick={() => navigate("/dashboard")}
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
    ${collapsed
            ? "opacity-0 -translate-x-3 pointer-events-none"
            : "opacity-100 translate-x-0"
          }
  `}
      >
        <p className="px-3 mb-4 text-[14px] font-medium text-[#9ca3af]">
          Projects
        </p>

        {projects.length === 0 ? (
          <p className="px-3 text-sm text-[#666b75]">
            No projects yet
          </p>
        ) : (
          <div className="space-y-1">
            {projects.map((project) => {
              const isSelected =
                location.pathname === `/repo/${project._id}`;

              return (
                <div
                  key={project._id}
                  className={`
          group w-full rounded-xl
          flex items-center
          transition-all duration-200
          ${isSelected
                      ? "bg-[#20232b] border border-[#2d313a]"
                      : "hover:bg-[#191c22]"
                    }
        `}
                >
                  <button
                    onClick={() => navigate(`/repo/${project._id}`)}
                    className={`
            flex-1 min-w-0
            text-[15px]
            text-left
            px-4 py-3
            truncate
            ${isSelected
                        ? "text-white"
                        : "text-[#9ca3af] group-hover:text-white"
                      }
          `}
                  >
                    {project.name}
                  </button>

                  <button
                    onClick={() => setDeleteProject(project)}
                    disabled={deletingId === project._id}
                    className="
            mr-2 p-1.5
            rounded-lg
            text-[#717784]
            opacity-0
            group-hover:opacity-100
            hover:text-red-400
            hover:bg-[#272a31]
            transition
            disabled:opacity-50
          "
                  >
                    <MoreVertical size={17} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

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
            actionColor="#f36631"
            drawerColor="#3f3f46"
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
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">
                  {user?.name || "User"}
                </p>

                <p className="text-xs text-[#9ca3af] truncate">
                  {user?.email || ""}
                </p>
              </div>


            </>
          )}

        </div>

      </div>
      {deleteProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#30343d] bg-[#111318] p-6 shadow-2xl">

            <h2 className="text-lg font-semibold text-white">
              Delete project?
            </h2>

            <p className="mt-2 text-sm leading-relaxed text-[#9ca3af]">
              This will permanently delete{" "}
              <span className="font-medium text-white">
                {deleteProject.name}
              </span>{" "}
              and all of its saved code files.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteProject(null)}
                disabled={deletingId}
                className="rounded-lg px-4 py-2 text-sm text-[#9ca3af] hover:bg-[#191c22] hover:text-white transition"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDeleteProject(deleteProject._id)}
                disabled={deletingId}
                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50 transition"
              >
                {deletingId ? "Deleting..." : "Delete Project"}
              </button>
            </div>

          </div>
        </div>
      )}

    </aside>
  );
};

export default Sidebar;