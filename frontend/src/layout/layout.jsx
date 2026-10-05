
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
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

  return (
    <div className="min-h-screen min-w-0 bg-primary overflow-x-hidden">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        projects={projects}
        fetchProjects={fetchProjects}
        user={user}
      />

      <div
        className={`
          relative min-h-screen min-w-0 overflow-x-hidden
          transition-all duration-300
          ${collapsed ? "ml-[72px]" : "ml-[350px]"}
        `}
      >
        <Topbar collapsed={collapsed} user={user} />

        <Outlet context={{ fetchProjects, user }} />
      </div>
    </div>
  );
};

export default Layout;
