import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  Flame,
  LoaderCircle,
  LogOut,
  Pencil,
  X,
} from "lucide-react";
import api from "../services/api";

const getInitial = (user) => {
  const name = user?.name?.trim();
  return (name?.[0] || user?.email?.[0] || "U").toUpperCase();
};

// Only show the verification badge when the backend explicitly confirms email verification.
const isEmailVerified = (user) =>
  user?.emailVerified === true ||
  user?.isEmailVerified === true ||
  user?.email_verified === true;

const getMemberSince = (user) => {
  const dateValue = user?.createdAt || user?.created_at || user?.joinedAt;
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, { month: "short", year: "numeric" });
};

const ProfileMenu = ({ user, onClose, onUserUpdated }) => {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const nameInputRef = useRef(null);

  const [streak, setStreak] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(user?.name || "");
  const [savingName, setSavingName] = useState(false);
  const [nameError, setNameError] = useState("");
  const [nameSaved, setNameSaved] = useState(false);

  useEffect(() => {
    setNameDraft(user?.name || "");
  }, [user?.name]);

  useEffect(() => {
    if (!editingName) return;
    const frame = requestAnimationFrame(() => {
      nameInputRef.current?.focus();
      nameInputRef.current?.select();
    });
    return () => cancelAnimationFrame(frame);
  }, [editingName]);

  useEffect(() => {
    let active = true;
    const fetchStreak = async () => {
      try {
        const response = await api.get("/dashboard/summary");
        if (active) setStreak(response.data?.summary?.streak?.currentStreak ?? 0);
      } catch (error) {
        console.error("Failed to fetch profile streak:", error);
      }
    };
    fetchStreak();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) onClose();
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (editingName) {
          cancelNameEdit();
        } else {
          onClose();
        }
      }
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, editingName]);

  const startNameEdit = () => {
    setNameDraft(user?.name || "");
    setNameError("");
    setNameSaved(false);
    setEditingName(true);
  };

  const cancelNameEdit = () => {
    if (savingName) return;
    setNameDraft(user?.name || "");
    setNameError("");
    setEditingName(false);
  };

  const handleNameSave = async (event) => {
    event?.preventDefault();
    if (savingName) return;

    const nextName = nameDraft.trim();

    if (!nextName) {
      setNameError("Name is required.");
      nameInputRef.current?.focus();
      return;
    }

    if (nextName.length < 2 || nextName.length > 50) {
      setNameError("Use between 2 and 50 characters.");
      nameInputRef.current?.focus();
      return;
    }

    if (nextName === (user?.name || "").trim()) {
      setEditingName(false);
      setNameError("");
      return;
    }

    try {
      setSavingName(true);
      setNameError("");
      setNameSaved(false);

      const response = await api.patch("/auth/me", { name: nextName });
      const updatedUser = response.data?.user;

      if (!updatedUser) {
        throw new Error("The server did not return the updated profile.");
      }

      onUserUpdated?.(updatedUser);
      setNameDraft(updatedUser.name || nextName);
      setEditingName(false);
      setNameSaved(true);
    } catch (error) {
      console.error("Failed to update profile name:", error);
      setNameError(
        error.response?.data?.message ||
          error.message ||
          "Couldn't update your name. Please try again."
      );
    } finally {
      setSavingName(false);
    }
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      onClose();
      navigate("/login", { replace: true });
    }
  };

  const verified = isEmailVerified(user);

  return (
    <>
      <button
        type="button"
        aria-label="Close profile menu"
        onClick={onClose}
        className="fixed inset-0 z-[80] cursor-default bg-black/10 backdrop-blur-[2px]"
      />
      <section
        ref={panelRef}
        role="dialog"
        aria-label="Profile menu"
        className="absolute right-0 top-[calc(100%+10px)] z-[90] w-[min(340px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-[#30343d] bg-[#090b0f] text-[#f6f1e8] shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl animate-in fade-in slide-in-from-top-2 duration-150"
      >
        <div className="flex items-start gap-3 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#3a3e47] bg-[#292d35] text-base font-semibold text-[#ff8758]">
            {getInitial(user)}
          </div>

          <div className="min-w-0 flex-1 pt-0.5">
            {!editingName ? (
              <div className="flex min-w-0 items-center gap-1.5">
                <p className="truncate text-sm font-semibold">
                  {user?.name || "TLC Vault user"}
                </p>
                {verified && (
                  <span
                    title="Email verified"
                    aria-label="Email verified"
                    className="inline-flex shrink-0 items-center justify-center text-[#3b82f6]"
                  >
                    <BadgeCheck size={16} fill="currentColor" stroke="#090b0f" strokeWidth={2.4} />
                  </span>
                )}
                <button
                  type="button"
                  onClick={startNameEdit}
                  aria-label="Edit name"
                  title="Edit name"
                  className="ml-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#858b98] transition hover:bg-white/[0.06] hover:text-[#f6f1e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f36631]"
                >
                  <Pencil size={13} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleNameSave} className="min-w-0">
                <label
                  htmlFor="profile-display-name"
                  className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.14em] text-[#858b98]"
                >
                  Display name
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    ref={nameInputRef}
                    id="profile-display-name"
                    type="text"
                    autoComplete="name"
                    maxLength={50}
                    value={nameDraft}
                    onChange={(event) => {
                      setNameDraft(event.target.value);
                      if (nameError) setNameError("");
                    }}
                    disabled={savingName}
                    className="h-9 min-w-0 flex-1 rounded-lg border border-[#383d47] bg-[#11141a] px-2.5 text-sm text-[#f6f1e8] outline-none transition placeholder:text-[#555c68] focus:border-[#f36631] focus:ring-2 focus:ring-[#f36631]/15 disabled:cursor-wait disabled:opacity-60"
                    placeholder="Your name"
                  />
                  <button
                    type="submit"
                    disabled={savingName || !nameDraft.trim() || nameDraft.trim() === (user?.name || "").trim()}
                    aria-label="Save name"
                    title="Save name"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#f36631] text-[#111111] transition hover:bg-[#ff7a49] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f36631] focus-visible:ring-offset-2 focus-visible:ring-offset-[#090b0f] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {savingName ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Check size={17} strokeWidth={2.4} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={cancelNameEdit}
                    disabled={savingName}
                    aria-label="Cancel editing name"
                    title="Cancel"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#30343d] text-[#858b98] transition hover:bg-white/[0.05] hover:text-[#f6f1e8] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    <X size={16} />
                  </button>
                </div>
                {nameError && (
                  <p role="alert" className="mt-1.5 text-[11px] leading-4 text-[#f28b68]">
                    {nameError}
                  </p>
                )}
                <p className="mt-1 text-[10px] text-[#626976]">2–50 characters</p>
              </form>
            )}

            {!editingName && (
              <p className="mt-1 break-all text-xs text-[#8d939f]">
                {user?.email || "No email available"}
              </p>
            )}
            {nameSaved && !editingName && (
              <p role="status" className="mt-1 text-[11px] text-[#f36631]">
                Name updated
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-[#777e8a] transition hover:bg-white/[0.06] hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="mx-4 h-px bg-[#252830]" />

        <div className="grid grid-cols-2 gap-2 p-4">
          <div className="rounded-xl border border-[#252830] bg-white/[0.025] p-3">
            <div className="flex items-center gap-2 text-[#f64f12]">
              <Flame size={15} />
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#858b98]">
                Streak
              </span>
            </div>
            <p className="mt-2 text-xl font-semibold tabular-nums">
              {streak}{" "}
              <span className="text-xs font-normal text-[#858b98]">
                {streak === 1 ? "day" : "days"}
              </span>
            </p>
          </div>

          <div className="rounded-xl border border-[#252830] bg-white/[0.025] p-3">
            <div className="flex items-center gap-2 text-[#a6abb5]">
              <CalendarDays size={15} />
              <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#858b98]">
                Member since
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold">{getMemberSince(user)}</p>
          </div>
        </div>

        <div className="px-4 pb-4">
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 ${
              verified ? "text-[#60a5fa]" : "text-[#fbbf24]"
            }`}
          >
            <span className="text-xs font-medium">
              {verified ? "Verified User" : "Email not verified"}
            </span>
            <span className="ml-auto text-[10px] uppercase tracking-wider opacity-75">
              {verified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>

        <div className="border-t border-[#252830] p-2">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut || savingName}
            className="flex h-11 w-full items-center gap-3 rounded-xl bg-[#f64f12] px-3 text-sm font-medium text-white transition disabled:cursor-wait disabled:opacity-60"
          >
            {loggingOut ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <LogOut size={17} />
            )}
            {loggingOut ? "Signing out…" : "Log out"}
          </button>
        </div>
      </section>
    </>
  );
};

export default ProfileMenu;
