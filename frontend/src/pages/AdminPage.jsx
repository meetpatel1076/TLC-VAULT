import { useEffect, useState } from "react";
import {
  Users,
  LogIn,
  FolderKanban,
  FileCode2,
} from "lucide-react";

import api from "../services/api";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import AdminStatCard from "../components/admin/AdminStatCard";
import RecentUsers from "../components/admin/RecentUsers";
import RecentRepositories from "../components/admin/RecentRepositories";
import RecentCodeFiles from "../components/admin/RecentCodeFiles";
import AdminAnalytics from "../components/admin/AdminAnalytics";

const AdminPage = () => {

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        setStatsError("");

        const response = await api.get("/admin/stats");

        setStats(response.data?.stats || null);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);

        setStatsError(
          error.response?.data?.message ||
          "Failed to load dashboard statistics."
        );
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-[#0e1015] text-[#f6f1e8]">

      <div className="flex min-h-screen">

        {/* ADMIN SIDEBAR AREA */}
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* MAIN WORKSPACE */}
        <section className="min-w-0 flex-1">

          {/* TOPBAR AREA */}
          <header className="h-[72px] border-b border-zinc-800 bg-[#0e1015]">
            <AdminTopbar />
          </header>

          {/* PAGE CONTENT */}
          <div className="p-4 sm:p-7 lg:p-8">

            {/* PAGE HEADER */}
            <div className="mb-8">
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#f36631]">
                Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-medium tracking-[-0.03em] text-[#f6f1e8] sm:text-4xl">
                Overview
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
                Key metrics and activity across the TLC Vault platform.
              </p>
            </div>

            {/* DASHBOARD CONTENT AREA */}
            <div className="space-y-6">

              {/* Stats */}
              <section>

                {statsError ? (
                  <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 px-5 py-4">
                    <p className="text-sm text-zinc-400">
                      {statsError}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 xl:grid-cols-4">

                    <AdminStatCard
                      label="Total Users"
                      value={stats?.users?.total ?? 0}
                      secondary={`+${stats?.users?.today ?? 0} today`}
                      icon={Users}
                      loading={loadingStats}
                    />

                    <AdminStatCard
                      label="Logins Today"
                      value={stats?.logins?.today ?? 0}
                      icon={LogIn}
                      loading={loadingStats}
                    />

                    <AdminStatCard
                      label="Total Repositories"
                      value={stats?.repositories?.total ?? 0}
                      secondary={`+${stats?.repositories?.today ?? 0} today`}
                      icon={FolderKanban}
                      loading={loadingStats}
                    />

                    <AdminStatCard
                      label="Total Code Files"
                      value={stats?.codeFiles?.total ?? 0}
                      secondary={`+${stats?.codeFiles?.today ?? 0} today`}
                      icon={FileCode2}
                      loading={loadingStats}
                    />

                  </div>
                )}

              </section>

              {/* Analytics */}
              <section>
                <AdminAnalytics />
              </section>

              {/* Recent Data */}
              <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <RecentUsers />
                <RecentRepositories />
              </section>

              <section>
                <RecentCodeFiles />
              </section>

            </div>

          </div>
        </section>

      </div>

    </main >
  );
};

export default AdminPage;