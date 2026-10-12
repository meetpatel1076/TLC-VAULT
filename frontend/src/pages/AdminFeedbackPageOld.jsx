import React, { useCallback, useEffect, useState } from "react";
import {
  MessageSquare,
  Bug,
  RefreshCw,
  ChevronDown,
  X,
  Clock3,
  CheckCircle2,
  CircleDot,
  ExternalLink,
} from "lucide-react";

import api from "../services/api";

const STATUSES = ["new", "reviewing", "resolved", "closed"];

const STATUS_STYLES = {
  new: "border-zinc-700 bg-zinc-800/60 text-zinc-300",
  reviewing: "border-amber-500/20 bg-amber-500/[0.07] text-amber-300/80",
  resolved: "border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-300/80",
  closed: "border-slate-500/20 bg-slate-500/[0.07] text-slate-400",
};

const statusIcons = {
  new: CircleDot,
  reviewing: Clock3,
  resolved: CheckCircle2,
  closed: X,
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

const StatusBadge = ({ status }) => {
  const Icon = statusIcons[status] || CircleDot;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-md border px-2 py-1 text-[10px] font-medium capitalize tracking-wide ${
        STATUS_STYLES[status] || STATUS_STYLES.new
      }`}
    >
      <Icon size={12} strokeWidth={1.7} />
      {status}
    </span>
  );
};

const StatusSelect = ({ status, onChange, disabled }) => (
  <div className="relative inline-flex">
    <select
      value={status}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Change submission status"
      className={`h-8 max-w-full appearance-none rounded-md border pl-2.5 pr-7 text-xs capitalize outline-none transition focus:border-zinc-600 disabled:cursor-wait disabled:opacity-50 ${
        STATUS_STYLES[status] || STATUS_STYLES.new
      }`}
    >
      {STATUSES.map((value) => (
        <option
          key={value}
          value={value}
          className="bg-zinc-900 text-zinc-200"
        >
          {value}
        </option>
      ))}
    </select>

    <ChevronDown
      size={12}
      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 opacity-60"
    />
  </div>
);

const AdminFeedbackPage = () => {
  const [feedback, setFeedback] = useState([]);
  const [summary, setSummary] = useState({
    newFeedback: 0,
    newIssues: 0,
  });

  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [limit, setLimit] = useState("30");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [actionError, setActionError] = useState("");

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("limit", limit);

      if (typeFilter !== "all") {
        params.set("type", typeFilter);
      }

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const response = await api.get(
        `/admin/feedback?${params.toString()}`
      );

      const items = response.data?.feedback || [];

      setFeedback(items);

      setSummary(
        response.data?.summary || {
          newFeedback: 0,
          newIssues: 0,
        }
      );

      setSelectedFeedback((current) =>
        current
          ? items.find((item) => item._id === current._id) || null
          : null
      );
    } catch (err) {
      console.error("Failed to fetch feedback:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load feedback and issue reports."
      );
    } finally {
      setLoading(false);
    }
  }, [limit, typeFilter, statusFilter]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const updateStatus = async (item, nextStatus) => {
    if (
      !STATUSES.includes(nextStatus) ||
      nextStatus === item.status ||
      updatingId
    ) {
      return;
    }

    const previousStatus = item.status;

    setUpdatingId(item._id);
    setActionError("");

    // Update the UI immediately, then revert if the API fails.
    const applyStatus = (status) => {
      setFeedback((current) =>
        current.map((entry) =>
          entry._id === item._id
            ? { ...entry, status }
            : entry
        )
      );

      setSelectedFeedback((current) =>
        current?._id === item._id
          ? { ...current, status }
          : current
      );
    };

    applyStatus(nextStatus);

    try {
      const response = await api.patch(
        `/admin/feedback/${item._id}/status`,
        { status: nextStatus }
      );

      const updated = response.data?.feedback;

      if (updated) {
        setFeedback((current) =>
          current.map((entry) =>
            entry._id === item._id
              ? { ...entry, ...updated }
              : entry
          )
        );

        setSelectedFeedback((current) =>
          current?._id === item._id
            ? { ...current, ...updated }
            : current
        );
      }
    } catch (err) {
      console.error("Failed to update feedback status:", err);

      applyStatus(previousStatus);

      setActionError(
        err.response?.data?.message ||
          "Couldn't update the status. Please try again."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const newCount =
    (summary.newFeedback || 0) + (summary.newIssues || 0);

  return (
    <div className="min-w-0 p-4 sm:p-7 lg:p-8">
      {/* Page heading */}
      <section className="mb-7">
        <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[#f36631]">
          Support
        </p>

        <div className="mt-2 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-3xl font-medium tracking-[-0.03em] text-[#f6f1e8] sm:text-4xl">
              Feedback & Issues
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500">
              Review user feedback, investigate reported issues, and manage
              submission status.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchFeedback}
            disabled={loading}
            className="inline-flex h-9 items-center justify-center gap-2 self-start rounded-lg border border-zinc-800 px-3 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200 disabled:opacity-40 sm:self-auto"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </section>

      {/* Summary cards */}
      <section className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-zinc-500">New submissions</p>
            <CircleDot size={16} className="text-zinc-500" />
          </div>

          <p className="mt-3 text-2xl font-medium tracking-tight text-[#f6f1e8]">
            {newCount}
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            Awaiting initial review
          </p>
        </div>

        <div className="rounded-xl border border-red-500/15 bg-red-500/[0.025] p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-zinc-500">New issues</p>
            <Bug size={16} className="text-red-300/70" />
          </div>

          <p className="mt-3 text-2xl font-medium tracking-tight text-[#f6f1e8]">
            {summary.newIssues || 0}
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            Reported problems requiring review
          </p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-zinc-500">New feedback</p>
            <MessageSquare size={16} className="text-zinc-500" />
          </div>

          <p className="mt-3 text-2xl font-medium tracking-tight text-[#f6f1e8]">
            {summary.newFeedback || 0}
          </p>

          <p className="mt-1 text-xs text-zinc-600">
            Suggestions and user feedback
          </p>
        </div>
      </section>

      {/* Main panel */}
      <section className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 border-b border-zinc-800 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 className="text-sm font-medium text-[#f6f1e8]">
              Submissions
            </h2>

            <p className="mt-1 text-xs text-zinc-600">
              {feedback.length} records loaded
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              className="h-9 min-w-0 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-300 outline-none focus:border-zinc-600"
              aria-label="Filter submission type"
            >
              <option value="all">All types</option>
              <option value="issue">Issues</option>
              <option value="feedback">Feedback</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-9 min-w-0 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-300 outline-none focus:border-zinc-600"
              aria-label="Filter submission status"
            >
              <option value="all">All statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <select
              value={limit}
              onChange={(event) => setLimit(event.target.value)}
              className="col-span-2 h-9 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-300 outline-none focus:border-zinc-600 sm:col-span-1"
              aria-label="Number of submissions"
            >
              <option value="30">Latest 30</option>
              <option value="60">Latest 60</option>
              <option value="all">All submissions</option>
            </select>
          </div>
        </div>

        {actionError && (
          <div
            role="alert"
            className="border-b border-red-500/15 bg-red-500/[0.04] px-4 py-3 text-sm text-red-300/80 sm:px-5"
          >
            {actionError}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-zinc-400">{error}</p>

            <button
              type="button"
              onClick={fetchFeedback}
              className="mt-3 text-xs text-[#f36631] hover:text-[#ff8155]"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading */}
        {loading && !error && (
          <div className="divide-y divide-zinc-800">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="px-4 py-5 sm:px-5">
                <div className="h-3 w-40 animate-pulse rounded bg-zinc-800" />
                <div className="mt-3 h-2.5 w-56 max-w-full animate-pulse rounded bg-zinc-800/70" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && feedback.length === 0 && (
          <div className="px-5 py-16 text-center">
            <MessageSquare
              size={24}
              strokeWidth={1.4}
              className="mx-auto text-zinc-700"
            />

            <p className="mt-4 text-sm text-zinc-400">
              No submissions found
            </p>

            <p className="mt-1 text-xs text-zinc-600">
              Try changing the filters or check again later.
            </p>
          </div>
        )}

        {/* Desktop table */}
        {!loading && !error && feedback.length > 0 && (
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[800px] table-fixed text-left">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="w-[29%] px-5 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Submission
                  </th>

                  <th className="w-[16%] px-3 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Submitted by
                  </th>

                  <th className="w-[14%] px-3 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Category
                  </th>

                  <th className="w-[17%] px-3 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Status
                  </th>

                  <th className="w-[16%] px-3 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                    Date
                  </th>

                  <th className="w-[8%] px-3 py-3 text-[10px] font-medium uppercase tracking-[0.14em] text-zinc-600">
                    View
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-800/80">
                {feedback.map((item) => {
                  const isIssue = item.type === "issue";

                  return (
                    <tr
                      key={item._id}
                      onClick={() => setSelectedFeedback(item)}
                      className={`cursor-pointer transition-colors ${
                        isIssue
                          ? "bg-red-500/[0.025] hover:bg-red-500/[0.055]"
                          : "hover:bg-zinc-800/25"
                      }`}
                    >
                      <td className="px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                              isIssue
                                ? "border-red-500/20 bg-red-500/[0.06] text-red-300/80"
                                : "border-zinc-800 bg-zinc-800/50 text-zinc-400"
                            }`}
                          >
                            {isIssue ? (
                              <Bug size={15} strokeWidth={1.6} />
                            ) : (
                              <MessageSquare size={15} strokeWidth={1.6} />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm text-[#f6f1e8]">
                              {isIssue ? "Issue report" : "Feedback"}
                            </p>

                            <p className="mt-1 text-[10px] text-zinc-600">
                              {item.type}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        <p className="truncate text-xs text-zinc-300">
                          {item.userId?.name || "Unknown user"}
                        </p>

                        <p className="mt-1 truncate text-[10px] text-zinc-600">
                          {item.userId?.email || "—"}
                        </p>
                      </td>

                      <td className="px-3 py-4">
                        <span className="inline-block max-w-full truncate rounded-md border border-zinc-800 px-2 py-1 text-[10px] text-zinc-400">
                          {item.category}
                        </span>
                      </td>

                      <td
                        className="px-3 py-4"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <StatusSelect
                          status={item.status}
                          disabled={updatingId === item._id}
                          onChange={(status) => updateStatus(item, status)}
                        />
                      </td>

                      <td className="px-3 py-4 text-xs text-zinc-500">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-3 py-4">
                        <button
                          type="button"
                          aria-label="View submission details"
                          onClick={(event) => {
                            event.stopPropagation();
                            setSelectedFeedback(item);
                          }}
                          className="rounded-md p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
                        >
                          <ExternalLink size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile cards */}
        {!loading && !error && feedback.length > 0 && (
          <div className="divide-y divide-zinc-800 md:hidden">
            {feedback.map((item) => {
              const isIssue = item.type === "issue";

              return (
                <article
                  key={item._id}
                  className={`p-4 ${
                    isIssue ? "bg-red-500/[0.025]" : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedFeedback(item)}
                    className="flex w-full min-w-0 items-start gap-3 text-left"
                  >
                    <div
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                        isIssue
                          ? "border-red-500/20 bg-red-500/[0.06] text-red-300/80"
                          : "border-zinc-800 bg-zinc-800/50 text-zinc-400"
                      }`}
                    >
                      {isIssue ? <Bug size={16} /> : <MessageSquare size={16} />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-[#f6f1e8]">
                          {isIssue ? "Issue report" : "Feedback"}
                        </p>

                        <span className="rounded border border-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500">
                          {item.category}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs text-zinc-400">
                        {item.userId?.name || "Unknown user"}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-zinc-600">
                        {item.userId?.email || "—"}
                      </p>

                      <p className="mt-2 text-[10px] text-zinc-600">
                        {formatDate(item.createdAt)}
                      </p>
                    </div>
                  </button>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <StatusBadge status={item.status} />

                    <button
                      type="button"
                      onClick={() => setSelectedFeedback(item)}
                      className="text-xs text-zinc-500 transition hover:text-zinc-200"
                    >
                      View details
                    </button>
                  </div>

                  <div className="mt-3 border-t border-zinc-800/70 pt-3">
                    <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-600">
                      Update status
                    </p>

                    <StatusSelect
                      status={item.status}
                      disabled={updatingId === item._id}
                      onChange={(status) => updateStatus(item, status)}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Details modal */}
      {selectedFeedback && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-[3px]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedFeedback(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="submission-title"
            className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-zinc-800 bg-[#111318] shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-zinc-800 p-5 sm:p-6">
              <div className="flex min-w-0 items-start gap-3">
                <div
                  className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    selectedFeedback.type === "issue"
                      ? "border-red-500/20 bg-red-500/[0.06] text-red-300/80"
                      : "border-zinc-800 bg-zinc-800/50 text-zinc-400"
                  }`}
                >
                  {selectedFeedback.type === "issue" ? (
                    <Bug size={18} />
                  ) : (
                    <MessageSquare size={18} />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
                    {selectedFeedback.type === "issue"
                      ? "Issue report"
                      : "User feedback"}
                  </p>

                  <h2
                    id="submission-title"
                    className="mt-1 text-lg font-medium text-[#f6f1e8]"
                  >
                    {selectedFeedback.category}
                  </h2>

                  <p className="mt-1 text-xs text-zinc-600">
                    Received {formatDate(selectedFeedback.createdAt)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                aria-label="Close submission details"
                className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-zinc-200"
              >
                <X size={18} />
              </button>
            </header>

            <div className="space-y-6 p-5 sm:p-6">
              {/* Submitter */}
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-600">
                  Submitted by
                </p>

                <p className="mt-2 break-words text-sm text-[#f6f1e8]">
                  {selectedFeedback.userId?.name || "Unknown user"}
                </p>

                <p className="mt-1 break-all text-xs text-zinc-500">
                  {selectedFeedback.userId?.email || "Email unavailable"}
                </p>
              </div>

              {/* Message */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                  {selectedFeedback.type === "issue"
                    ? "Issue description"
                    : "Feedback message"}
                </p>

                <div className="whitespace-pre-wrap break-words rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4 text-sm leading-7 text-zinc-300">
                  {selectedFeedback.message}
                </div>
              </div>

              {/* Reproduction steps */}
              {selectedFeedback.type === "issue" &&
                selectedFeedback.steps && (
                  <div>
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
                      Steps to reproduce
                    </p>

                    <div className="whitespace-pre-wrap break-words rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4 text-sm leading-7 text-zinc-300">
                      {selectedFeedback.steps}
                    </div>
                  </div>
                )}

              {/* Status */}
              <div className="flex flex-col gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-medium text-[#f6f1e8]">
                    Submission status
                  </p>

                  <p className="mt-1 text-xs text-zinc-600">
                    Update this as you review the submission.
                  </p>
                </div>

                <StatusSelect
                  status={selectedFeedback.status}
                  disabled={updatingId === selectedFeedback._id}
                  onChange={(status) =>
                    updateStatus(selectedFeedback, status)
                  }
                />
              </div>

              {actionError && (
                <p role="alert" className="text-xs text-red-300/80">
                  {actionError}
                </p>
              )}
            </div>

            <footer className="flex justify-end border-t border-zinc-800 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => setSelectedFeedback(null)}
                className="rounded-lg border border-zinc-800 px-4 py-2 text-xs text-zinc-400 transition hover:border-zinc-700 hover:text-zinc-200"
              >
                Close
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbackPage;