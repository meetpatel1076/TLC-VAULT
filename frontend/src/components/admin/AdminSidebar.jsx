import React from "react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileCode2,
  Settings,
  LogOut,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import HoldButton from "../HoldButton";

import api from "../../services/api";

const navigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Repositories",
    path: "/admin/repositories",
    icon: FolderKanban,
  },
  {
    label: "Code Files",
    path: "/admin/codefiles",
    icon: FileCode2,
  },
];

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await api.post("/auth/logout");
    } catch (error) {
      console.error("Admin logout error:", error);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className="flex h-screen w-[250px] shrink-0 flex-col border-r border-zinc-800 bg-sidebar">

      {/* BRAND */}
      <div className="px-6 pt-6">
        <div className="flex items-center gap-3">

          <div className="left-6 flex items-center">
            <img
              src="/tlc-vault-logo.png"
              alt="TLC Vault"
              className="h-9 w-9 object-contain"
            />
          </div>


          <div>
            <p className="text-sm font-medium tracking-tight text-[#f6f1e8]">
              TLC Vault

            </p>



            <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
              Admin Console
            </p>
          </div>

        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="mt-10 px-3">

        <p className="mb-3 px-3 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
          Workspace
        </p>

        <div className="space-y-1">

          {navigation.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.path === "/admin"
                ? location.pathname === "/admin"
                : location.pathname.startsWith(item.path);

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`
                  group flex h-10 items-center gap-3 rounded-md px-3
                  text-sm transition-colors duration-200
                  ${isActive
                    ? "bg-zinc-900 text-[#f6f1e8]"
                    : "text-zinc-500 hover:bg-zinc-900/70 hover:text-zinc-200"
                  }
                `}
              >
                <Icon
                  size={17}
                  strokeWidth={1.7}
                  className={
                    isActive
                      ? "text-[#f36631]"
                      : "text-zinc-500 group-hover:text-zinc-300"
                  }
                />

                <span>{item.label}</span>


              </NavLink>
            );
          })}

        </div>
      </nav>

      {/* BOTTOM */}
      <div className="mt-auto px-3 pb-5">

        <div className="mb-4 h-px bg-zinc-800" />

        {/* SETTINGS */}
        <button
          type="button"
          className="
            group flex h-10 w-full items-center gap-3
            rounded-md px-3
            text-sm text-zinc-500
            transition-colors duration-200
            hover:bg-zinc-900/70 hover:text-zinc-200
          "
        >
          <Settings
            size={17}
            strokeWidth={1.7}
            className="text-zinc-500 group-hover:text-zinc-300"
          />

          <span>Settings</span>
        </button>

        {/* LOGOUT */}
        <HoldButton
          onHold={handleLogout}
          disabled={loggingOut}
          holdTime={1500}
          backgroundColor="#27272a"
          fillColor="#f64f12"
          textColor="#a1a1aa"
          fillTextColor="#ffffff"
          size="xl"
          radius={8}
          icon={<LogOut size={20} strokeWidth={1.7} />}
          className="mt-1 w-full"
        >
          Hold to logout
        </HoldButton>


      </div>
    </aside>
  );
};

export default AdminSidebar;