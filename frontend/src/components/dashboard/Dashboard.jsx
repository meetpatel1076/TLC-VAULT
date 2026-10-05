
import React, { useEffect, useState } from "react";
import api from "../../services/api";

import WeeklyStats from "./WeeklyStats";
import ConsistencyHub from "./ConsistencyHub";
import ContinueWork from "./ContinueWork";
import DashboardStats from "./DashboardStats";

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/dashboard/summary");

        setSummary(response.data?.summary || null);
      } catch (error) {
        console.error("Failed to fetch dashboard:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <section className="px-6 lg:px-10 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_0.75fr] gap-4">
          <div className="h-[260px] rounded-2xl border border-[#252830] bg-[#111318]/60 animate-pulse" />
          <div className="h-[260px] rounded-2xl border border-[#252830] bg-[#111318]/60 animate-pulse" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="px-6 lg:px-10 pb-10">
        <div className="flex justify-center">
          <p className="text-sm text-[#9ca3af]">
            {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-6 lg:px-10 pb-10">

      {/* TOP ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.65fr_0.75fr] gap-4">

        <WeeklyStats summary={summary} />

        <ConsistencyHub summary={summary} />

      </div>

      {/* BOTTOM ROW */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] gap-4">

        <ContinueWork summary={summary} />

        <DashboardStats summary={summary} />

      </div>

    </section>
  );
};

export default Dashboard;
