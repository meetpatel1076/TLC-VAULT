
import React from "react";

import {
  Plus,
  MoreVertical,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";

import { useLocation, useNavigate, Link } from "react-router-dom";

import SlideCommit from "./SlideCommit";
import api from "../services/api";
import CreateProject from "./CreateProject";

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
        bg-sidebar
        flex flex-col
        overflow-x-hidden
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[72px]" : "w-[350px]"}
      `}
    >
      {/* Header */}
      <div
        className={`
          flex items-center py-5
          transition-all duration-300
          ${collapsed ? "justify-center px-3" : "justify-between px-5"}
        `}
      >
        <div
          className={`
            overflow-hidden
            transition-all duration-300 ease-in-out
            ${collapsed
              ? "w-0 opacity-0 -translate-x-3"
              : "w-auto opacity-100 translate-x-0"
            }
          `}
        >
          <span
            className="text-[17px] font-bold text-white whitespace-nowrap"
            style={{ fontFamily: "monospace" }}
          >
            TLC Vault
          </span>
        </div>

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

      {/* New Repository */}
      <div className="relative shrink-0">
        {/* Collapsed Plus Button */}
        <div
          className={`
            absolute left-0 right-0 top-0
            flex justify-center
            transition-all duration-300 ease-in-out
            ${collapsed
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-90 -translate-y-2 pointer-events-none"
            }
          `}
        >
          <button
            onClick={() => setCollapsed(false)}
            className="
              w-[56px] h-[56px]
              rounded-xl
              border border-[#30343d]
              flex items-center justify-center
              bg-[#f64f12]
              text-white
              hover:bg-[#ff6228]
              transition-all duration-200
              mt-3
            "
          >
            <Plus size={21} strokeWidth={2.2} />
          </button>
        </div>

        {/* Create Repository */}
        <div
          className={`
            transition-all duration-300 ease-in-out
            ${collapsed
              ? "max-h-0 opacity-0 -translate-x-2 pointer-events-none"
              : "max-h-[520px] opacity-100 translate-x-0"
            }
          `}
        >
          <CreateProject
            fetchProjects={fetchProjects}
            user={user}
          />
        </div>
      </div>

      {/* Repositories */}
      <div
        className={`
          flex-1 min-h-0
          px-5 mt-4
          overflow-y-auto
          overflow-x-hidden
              [scrollbar-width:none]
    [&::-webkit-scrollbar]:hidden
          transition-all duration-300 ease-out
          ${collapsed
            ? "opacity-0 -translate-x-3 pointer-events-none"
            : "opacity-100 translate-x-0"
          }
        `}
      >
        <p className="px-3 mb-4 text-[17px] font-medium text-white">
          Repositories
        </p>

        {projects.length === 0 ? (
          <p className="px-3 text-sm text-[#666b75]">
            No repositories yet
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
      </div>

      {/* Account - Fixed Bottom */}
      <div
        className={`
          shrink-0
          border-t border-[#252830]
          py-4
          bg-sidebar
          transition-all duration-300
          ${collapsed ? "px-3" : "px-5"}
        `}
      >
        {/* Logout */}
        <div
          className={`
            overflow-hidden
            transition-all duration-300 ease-in-out
            ${collapsed
              ? "max-h-0 opacity-0 -translate-y-2 mb-0"
              : "max-h-[60px] opacity-100 translate-y-0 mb-2.5"
            }
          `}
        >
          {user && (
            <SlideCommit
              label="Swipe to log out"
              onConfirm={handleLogout}
              trackColor="#27272a"
              handleColor="#a1a1aa"
              successColor="#f64f12"
              dangerColor="#ef4444"
              width={300}
              height={52}
              radius={12}
              holdMs={0}
              disabled={loggingOut}
              icon={<LogOut size={19} strokeWidth={2} />}
            />
          )}
        </div>

        {/* User */}
        <div
          className={`
            flex items-center
            transition-all duration-300
            ${collapsed ? "justify-center" : "gap-3"}
          `}
        >
          <div className="w-10 h-10 shrink-0 rounded-full bg-[#292d35] border border-[#3a3e47] flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>

          <div
            className={`
              overflow-hidden
              transition-all duration-300 ease-in-out
              ${collapsed
                ? "w-0 opacity-0 translate-x-2"
                : "flex-1 opacity-100 translate-x-0"
              }
            `}
          >
            <p className="text-sm font-semibold text-white whitespace-nowrap">
              {user?.name || "User"}
            </p>

            <p className="text-xs text-[#9ca3af] truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
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
                className="
                  rounded-lg px-4 py-2
                  text-sm text-[#9ca3af]
                  hover:bg-[#191c22]
                  hover:text-white
                  transition
                "
              >
                Cancel
              </button>

              <button
                onClick={() => handleDeleteProject(deleteProject._id)}
                disabled={deletingId}
                className="
                  rounded-lg
                  bg-red-500
                  px-4 py-2
                  text-sm font-medium text-white
                  hover:bg-red-600
                  disabled:opacity-50
                  transition
                "
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

