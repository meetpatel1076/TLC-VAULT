import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/repositories");
      setProjects(response.data.repositories);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchUser();
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen min-w-0 bg-primary overflow-x-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          projects={projects}
          fetchProjects={fetchProjects}
          user={user}
        />
      </div>

      {/* Mobile ChatGPT-style slide-out sidebar */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-[60] bg-black/60 md:hidden"
        />
      )}
      <div className="md:hidden">
        <Sidebar
          collapsed={false}
          setCollapsed={setCollapsed}
          projects={projects}
          fetchProjects={fetchProjects}
          user={user}
          isMobileDrawer
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      </div>

      <div
        className={`
          relative min-h-screen min-w-0 overflow-x-hidden
          transition-all duration-300
          ml-0 ${collapsed ? "md:ml-[72px]" : "md:ml-[350px]"}
        `}
      >
        <Topbar
          collapsed={collapsed}
          user={user}
          onMenuClick={() => setMobileMenuOpen(true)}
        />

        <Outlet context={{ fetchProjects, user }} />
      </div>
    </div>
  );
};

export default Layout;
