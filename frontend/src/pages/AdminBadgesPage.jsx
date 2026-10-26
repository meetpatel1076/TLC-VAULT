import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Award,
  Users,
  Trophy,
  RefreshCw,
  Search,
  ChevronDown,
  CalendarDays,
  Filter,
} from "lucide-react";
import api from "../services/api";

import bootedBadge from "../assets/badges/1.png";
import loopedBadge from "../assets/badges/2.png";
import committedBadge from "../assets/badges/3.png";
import persistentBadge from "../assets/badges/4.png";
import vaultboundBadge from "../assets/badges/5.png";
import unbrokenBadge from "../assets/badges/6.png";

const BADGE_ART = {
  booted: bootedBadge,
  looped: loopedBadge,
  commited: committedBadge,
  committed: committedBadge,
  persistent: persistentBadge,
  vaultbound: vaultboundBadge,
  unbroken: unbrokenBadge,
};

const TIER_STYLES = {
  bronze: "border-amber-700/30 bg-amber-500/[0.07] text-amber-300",
  silver: "border-zinc-600/50 bg-zinc-500/[0.08] text-zinc-300",
  gold: "border-yellow-600/30 bg-yellow-500/[0.07] text-yellow-300",
};

const formatDate = (date) => {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="min-w-0 rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 sm:p-5">
    <div className="flex items-center justify-between gap-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <Icon size={16} strokeWidth={1.7} className="shrink-0 text-[#f36631]" />
    </div>
    <p className="mt-3 text-2xl font-medium tabular-nums text-[#f6f1e8] sm:text-3xl">
      {value.toLocaleString("en-IN")}
    </p>
  </div>
);

const AdminBadgesPage = () => {
  const [data, setData] = useState({
    summary: { totalBadges: 0, totalAwards: 0, usersWithBadges: 0 },
    badges: [],
    awards: [],
    totalMatchingAwards: 0,
    showing: 0,
  });
  const [badgeKey, setBadgeKey] = useState("all");
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState("30");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBadges = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams({ badgeKey, limit });
      if (search.trim()) params.set("search", search.trim());

      const response = await api.get(`/admin/badges?${params.toString()}`);
      setData({
        summary: response.data?.summary || {
          totalBadges: 0,
          totalAwards: 0,
          usersWithBadges: 0,
        },
        badges: response.data?.badges || [],
        awards: response.data?.awards || [],
        totalMatchingAwards: response.data?.totalMatchingAwards || 0,
        showing: response.data?.showing || 0,
      });
    } catch (err) {
      console.error("Failed to fetch badge activity:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load badge activity. Try refreshing the page."
      );
    } finally {
      setLoading(false);
    }
  }, [badgeKey, limit, search]);

  useEffect(() => {
    const timeout = window.setTimeout(fetchBadges, 250);
    return () => window.clearTimeout(timeout);
  }, [fetchBadges]);

  const selectedBadge = useMemo(
    () => data.badges.find((badge) => badge.key === badgeKey),
    [data.badges, badgeKey]
  );

  return (
    <div className="p-4 sm:p-7 lg:p-8">
      <section className="mb-7">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#f36631]">
          Achievements
        </p>
        <h1 className="mt-2 text-3xl font-medium tracking-[-0.03em] text-[#f6f1e8] sm:text-4xl">
          Badge Activity
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
          Track which users earned each TLC Vault badge and when it was awarded.
        </p>
      </section>

      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Available badges" value={data.summary.totalBadges} icon={Award} />
        <StatCard label="Total awards" value={data.summary.totalAwards} icon={Trophy} />
        <StatCard label="Users with badges" value={data.summary.usersWithBadges} icon={Users} />
      </section>

      <section className="mb-6 rounded-xl border border-zinc-800 bg-zinc-900/60">
        <div className="border-b border-zinc-800 px-4 py-4 sm:px-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium text-[#f6f1e8]">Badge catalogue</h2>
              <p className="mt-1 text-xs text-zinc-600">Select a badge to inspect its recipients.</p>
            </div>
            <Trophy size={17} className="text-zinc-500" />
          </div>
        </div>

        {loading && data.badges.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-lg bg-zinc-800/60" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-3 sm:p-4 xl:grid-cols-6">
            {data.badges.map((badge) => {
              const active = badgeKey === badge.key;
              const image = BADGE_ART[badge.key];
              return (
                <button
                  key={badge.key}
                  type="button"
                  onClick={() => setBadgeKey(active ? "all" : badge.key)}
                  aria-pressed={active}
                  className={`group min-w-0 rounded-lg border p-3 text-left transition-colors ${
                    active
                      ? "border-[#f36631]/60 bg-[#f36631]/[0.07]"
                      : "border-zinc-800 bg-[#0e1015]/40 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex h-16 items-center justify-center">
                    {image ? (
                      <img
                        src={image}
                        alt=""
                        draggable="false"
                        className="h-16 w-16 select-none object-contain [-webkit-user-drag:none]"
                      />
                    ) : (
                      <Award size={28} className="text-zinc-500" />
                    )}
                  </div>
                  <p className="mt-2 truncate text-xs font-semibold tracking-wide text-[#f6f1e8]">
                    {badge.name}
                  </p>
                  <p className="mt-1 line-clamp-2 min-h-8 text-[10px] leading-4 text-zinc-500">
                    {badge.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className={`rounded border px-1.5 py-0.5 text-[9px] uppercase tracking-wide ${TIER_STYLES[badge.tier] || "border-zinc-700 text-zinc-400"}`}>
                      {badge.tier}
                    </span>
                    <span className="text-xs tabular-nums text-[#f36631]">
                      {badge.earnedCount} earned
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
        <div className="flex flex-col gap-4 border-b border-zinc-800 px-4 py-4 sm:px-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-3">
            <Award size={18} strokeWidth={1.6} className="shrink-0 text-zinc-400" />
            <div>
              <h2 className="text-sm font-medium text-[#f6f1e8]">
                {selectedBadge ? `${selectedBadge.name} recipients` : "All badge awards"}
              </h2>
              <p className="mt-1 text-xs text-zinc-600">
                Showing {data.showing} of {data.totalMatchingAwards} matching awards
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="relative min-w-0 sm:w-64">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name or email"
                aria-label="Search badge recipients by name or email"
                className="h-9 w-full rounded-lg border border-zinc-800 bg-[#0e1015] pl-9 pr-3 text-xs text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-zinc-600"
              />
            </label>

            <label className="relative flex items-center">
              <Filter size={13} className="pointer-events-none absolute left-3 text-zinc-600" />
              <select
                value={badgeKey}
                onChange={(event) => setBadgeKey(event.target.value)}
                aria-label="Filter by badge"
                className="h-9 w-full appearance-none rounded-lg border border-zinc-800 bg-[#0e1015] pl-8 pr-8 text-xs text-zinc-300 outline-none focus:border-zinc-600 sm:w-44"
              >
                <option value="all">All badges</option>
                {data.badges.map((badge) => (
                  <option key={badge.key} value={badge.key}>{badge.name}</option>
                ))}
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 text-zinc-600" />
            </label>

            <label className="relative flex items-center">
              <select
                value={limit}
                onChange={(event) => setLimit(event.target.value)}
                aria-label="Number of badge awards to show"
                className="h-9 w-full appearance-none rounded-lg border border-zinc-800 bg-[#0e1015] pl-3 pr-8 text-xs text-zinc-300 outline-none focus:border-zinc-600 sm:w-32"
              >
                <option value="30">Top 30</option>
                <option value="100">Top 100</option>
                <option value="500">Top 500</option>
                <option value="all">All awards</option>
              </select>
              <ChevronDown size={13} className="pointer-events-none absolute right-2.5 text-zinc-600" />
            </label>

            <button
              type="button"
              onClick={fetchBadges}
              disabled={loading}
              aria-label="Refresh badge activity"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-lg border border-zinc-800 text-zinc-500 transition-colors hover:border-zinc-700 hover:text-zinc-200 disabled:opacity-50 sm:self-auto"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 py-10 text-center sm:px-5">
            <p className="text-sm text-zinc-400">{error}</p>
            <button type="button" onClick={fetchBadges} className="mt-3 text-xs text-[#f36631] hover:text-orange-300">
              Try again
            </button>
          </div>
        )}

        {!error && loading && data.awards.length === 0 && (
          <div className="px-4 py-12 text-center text-sm text-zinc-500">Loading badge activity…</div>
        )}

        {!error && !loading && data.awards.length === 0 && (
          <div className="px-4 py-14 text-center">
            <Award size={24} className="mx-auto text-zinc-600" />
            <p className="mt-3 text-sm text-zinc-400">No badge awards match these filters.</p>
            <p className="mt-1 text-xs text-zinc-600">Try another badge or search term.</p>
          </div>
        )}

        {!error && data.awards.length > 0 && (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-left">
                <thead className="border-b border-zinc-800 bg-[#0e1015]/70">
                  <tr>
                    {["User", "Badge", "Tier", "Earned on"].map((heading) => (
                      <th key={heading} className="px-5 py-3 text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">{heading}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/80">
                  {data.awards.map((award) => (
                    <tr key={award._id} className="transition-colors hover:bg-white/[0.015]">
                      <td className="px-5 py-3.5">
                        <p className="text-sm text-[#f6f1e8]">{award.user?.name || "Unknown user"}</p>
                        <p className="mt-1 text-xs text-zinc-600">{award.user?.email || "Account unavailable"}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {BADGE_ART[award.badgeKey] ? <img src={BADGE_ART[award.badgeKey]} alt="" draggable="false" className="h-8 w-8 select-none object-contain [-webkit-user-drag:none]" /> : <Award size={20} className="text-zinc-500" />}
                          <span className="text-xs font-medium text-zinc-200">{award.badgeName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded border px-2 py-1 text-[10px] uppercase tracking-wide ${TIER_STYLES[award.tier] || "border-zinc-700 text-zinc-400"}`}>{award.tier}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-2 text-xs text-zinc-400">
                          <CalendarDays size={13} className="text-zinc-600" />
                          {formatDate(award.unlockedAt)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-zinc-800 md:hidden">
              {data.awards.map((award) => (
                <div key={award._id} className="flex items-center gap-3 px-4 py-3.5">
                  {BADGE_ART[award.badgeKey] ? <img src={BADGE_ART[award.badgeKey]} alt="" draggable="false" className="h-10 w-10 shrink-0 select-none object-contain [-webkit-user-drag:none]" /> : <Award size={24} className="shrink-0 text-zinc-500" />}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-[#f6f1e8]">{award.user?.name || "Unknown user"}</p>
                    <p className="truncate text-xs text-zinc-600">{award.user?.email || "Account unavailable"}</p>
                    <p className="mt-1 text-[10px] text-zinc-500">{award.badgeName} · {formatDate(award.unlockedAt)}</p>
                  </div>
                  <span className={`shrink-0 rounded border px-1.5 py-1 text-[9px] uppercase ${TIER_STYLES[award.tier] || "border-zinc-700 text-zinc-400"}`}>{award.tier}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex flex-col gap-2 border-t border-zinc-800 px-4 py-3 text-[10px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span>Badge awards are read-only; this page does not modify user achievements.</span>
          <span>Showing {data.showing} / {data.totalMatchingAwards}</span>
        </div>
      </section>
    </div>
  );
};

export default AdminBadgesPage;
