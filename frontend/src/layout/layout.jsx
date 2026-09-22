import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import api from "../services/api";

const Layout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [projects, setProjects] = useState([]);

  const fetchProjects = async () => {
    try {
      const response = await api.get("/repositories");

      setProjects(response.data.repositories);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e1015]">

      <Sidebar
  collapsed={collapsed}
  setCollapsed={setCollapsed}
  projects={projects}
  fetchProjects={fetchProjects}
/>

      <div
        className={`
          relative min-h-screen
          transition-all duration-300
          ${collapsed ? "ml-[72px]" : "ml-[300px]"}
        `}
      >
        <Topbar collapsed={collapsed} />

        <Outlet context={{ fetchProjects }} />
      </div>

    </div>
  );
};

export default Layout;