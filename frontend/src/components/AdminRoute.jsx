import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

import api from "../services/api";

const AdminRoute = () => {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let mounted = true;

    const checkAdminAccess = async () => {
      try {
        const response = await api.get("/auth/me");

        const role = response.data?.user?.role;

        if (!mounted) return;

        if (role === "admin") {
          setStatus("admin");
        } else {
          setStatus("user");
        }
      } catch (error) {
        if (!mounted) return;

        setStatus("unauthenticated");
      }
    };

    checkAdminAccess();

    return () => {
      mounted = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#0e1015] flex items-center justify-center text-[#f6f1e8]">
        <div className="text-sm text-zinc-500">
          Checking access...
        </div>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }

  if (status === "user") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;