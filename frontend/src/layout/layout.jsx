import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const Layout = () => {

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#0e1015]">

      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`
          relative min-h-screen
          transition-all duration-300
          ${collapsed ? "ml-[72px]" : "ml-[300px]"}
        `}
      >

        <Topbar collapsed={collapsed} />

        <Outlet />

      </div>

    </div>
  );
};

export default Layout;