import React, { useEffect, useMemo, useState } from "react";
import api from "../../services/api";

const CHART_WIDTH = 900;
const CHART_HEIGHT = 300;

const PADDING = {
  top: 20,
  right: 24,
  bottom: 36,
  left: 42,
};

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/admin/analytics");

        setAnalytics(response.data?.analytics || null);
      } catch (error) {
        console.error(
          "Failed to fetch admin analytics:",
          error
        );

        setError(
          error.response?.data?.message ||
            "Failed to load analytics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const chartData = useMemo(() => {
    if (!analytics) return [];

    const users = analytics.users || [];
    const repositories = analytics.repositories || [];
    const codeFiles = analytics.codeFiles || [];

    return users.map((userItem, index) => ({
      date: userItem.date,
      users: userItem.count || 0,
      repositories: repositories[index]?.count || 0,
      codeFiles: codeFiles[index]?.count || 0,
    }));
  }, [analytics]);

  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 1;

    const values = chartData.flatMap((item) => [
      item.users,
      item.repositories,
      item.codeFiles,
    ]);

    return Math.max(...values, 1);
  }, [chartData]);

  const chartInnerWidth =
    CHART_WIDTH - PADDING.left - PADDING.right;

  const chartInnerHeight =
    CHART_HEIGHT - PADDING.top - PADDING.bottom;

  const getX = (index) => {
    if (chartData.length <= 1) {
      return PADDING.left;
    }

    return (
      PADDING.left +
      (index / (chartData.length - 1)) *
        chartInnerWidth
    );
  };

  const getY = (value) => {
    return (
      PADDING.top +
      chartInnerHeight -
      (value / maxValue) * chartInnerHeight
    );
  };

  const getPoints = (key) => {
    return chartData
      .map(
        (item, index) =>
          `${getX(index)},${getY(item[key])}`
      )
      .join(" ");
  };

  const formatDate = (date) => {
    if (!date) return "";

    const [year, month, day] = date
      .split("-")
      .map(Number);

    return new Date(
      year,
      month - 1,
      day
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  const dateLabels = useMemo(() => {
    if (chartData.length === 0) return [];

    const indexes = [
      0,
      Math.floor((chartData.length - 1) / 3),
      Math.floor(((chartData.length - 1) * 2) / 3),
      chartData.length - 1,
    ];

    return [...new Set(indexes)].map((index) => ({
      index,
      date: formatDate(chartData[index].date),
    }));
  }, [chartData]);

  const yLabels = useMemo(() => {
    const steps = 4;

    return Array.from(
      { length: steps + 1 },
      (_, index) => {
        const value =
          (maxValue / steps) *
          (steps - index);

        return Math.round(value);
      }
    );
  }, [maxValue]);

  const totalUsers = useMemo(
    () =>
      chartData.reduce(
        (sum, item) => sum + item.users,
        0
      ),
    [chartData]
  );

  const totalRepositories = useMemo(
    () =>
      chartData.reduce(
        (sum, item) => sum + item.repositories,
        0
      ),
    [chartData]
  );

  const totalCodeFiles = useMemo(
    () =>
      chartData.reduce(
        (sum, item) => sum + item.codeFiles,
        0
      ),
    [chartData]
  );

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900/60">
      {/* Header */}
      <div className="border-b border-zinc-800 px-4 py-4 sm:px-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-medium text-[#f6f1e8]">
              Platform Activity
            </h2>

            <p className="mt-1 text-xs text-zinc-600">
              New users, repositories and code files over the last 30 days
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#f36631]" />

              <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                Users
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />

              <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                Repositories
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />

              <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                Code Files
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-10 text-center sm:px-5">
          <p className="text-sm text-zinc-500">
            {error}
          </p>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="px-4 py-5 sm:px-5">
          <div className="h-[280px] animate-pulse rounded-lg bg-zinc-800/50" />
        </div>
      )}

      {/* Empty */}
      {!loading &&
        !error &&
        chartData.length === 0 && (
          <div className="px-4 py-12 text-center sm:px-5">
            <p className="text-sm text-zinc-500">
              No activity data available.
            </p>
          </div>
        )}

      {/* Chart */}
      {!loading &&
        !error &&
        chartData.length > 0 && (
          <>
            <div className="px-2 pt-4 sm:px-5 sm:pt-5">
              <div className="w-full overflow-hidden">
                <svg
                  viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
                  className="h-auto w-full"
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="30 day platform activity chart"
                >
                  {/* Grid */}
                  {yLabels.map((value, index) => {
                    const y =
                      PADDING.top +
                      (index / 4) *
                        chartInnerHeight;

                    return (
                      <g key={index}>
                        <line
                          x1={PADDING.left}
                          x2={
                            CHART_WIDTH -
                            PADDING.right
                          }
                          y1={y}
                          y2={y}
                          stroke="#27272a"
                          strokeWidth="1"
                        />

                        <text
                          x={PADDING.left - 10}
                          y={y + 3}
                          textAnchor="end"
                          fill="#52525b"
                          fontSize="10"
                        >
                          {value}
                        </text>
                      </g>
                    );
                  })}

                  {/* Users */}
                  <polyline
                    points={getPoints("users")}
                    fill="none"
                    stroke="#f36631"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Repositories */}
                  <polyline
                    points={getPoints(
                      "repositories"
                    )}
                    fill="none"
                    stroke="#d4d4d8"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Code Files */}
                  <polyline
                    points={getPoints("codeFiles")}
                    fill="none"
                    stroke="#52525b"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* User points */}
                  {chartData.map((item, index) => (
                    <circle
                      key={`user-${item.date}`}
                      cx={getX(index)}
                      cy={getY(item.users)}
                      r="2.4"
                      fill="#f36631"
                    >
                      <title>
                        {formatDate(item.date)} — Users:{" "}
                        {item.users}
                      </title>
                    </circle>
                  ))}

                  {/* X-axis labels */}
                  {dateLabels.map(({ index, date }) => (
                    <text
                      key={date}
                      x={getX(index)}
                      y={
                        CHART_HEIGHT -
                        10
                      }
                      textAnchor="middle"
                      fill="#52525b"
                      fontSize="10"
                    >
                      {date}
                    </text>
                  ))}
                </svg>
              </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 border-t border-zinc-800">
              <div className="px-3 py-4 sm:px-5">
                <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                  New Users
                </p>

                <p className="mt-1.5 text-lg font-medium tracking-tight text-[#f6f1e8]">
                  {totalUsers}
                </p>
              </div>

              <div className="border-l border-zinc-800 px-3 py-4 sm:px-5">
                <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                  New Repositories
                </p>

                <p className="mt-1.5 text-lg font-medium tracking-tight text-[#f6f1e8]">
                  {totalRepositories}
                </p>
              </div>

              <div className="border-l border-zinc-800 px-3 py-4 sm:px-5">
                <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                  New Code Files
                </p>

                <p className="mt-1.5 text-lg font-medium tracking-tight text-[#f6f1e8]">
                  {totalCodeFiles}
                </p>
              </div>
            </div>
          </>
        )}
    </section>
  );
};

export default AdminAnalytics;