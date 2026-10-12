import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, CalendarDays, Flame, LogOut, Mail, UserRound, X } from "lucide-react";
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

const ProfileMenu = ({ user, onClose }) => {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const [streak, setStreak] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

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
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) onClose();
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

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
            <div className="flex min-w-0 items-center gap-1.5">
              <p className="truncate text-sm font-semibold">{user?.name || "TLC Vault user"}</p>
              {isEmailVerified(user) && (
                <span
                  title="Email verified"
                  aria-label="Email verified"
                  className="inline-flex shrink-0 items-center justify-center text-[#3b82f6]"
                >
                  <BadgeCheck size={16} fill="currentColor" stroke="#090b0f" strokeWidth={2.4} />
                </span>
              )}
            </div>
            <p className="mt-1 break-all text-xs text-[#8d939f]">{user?.email || "No email available"}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-[#777e8a] transition hover:bg-white/[0.06] hover:text-white">
            <X size={16} />
          </button>
        </div>

        <div className="mx-4 h-px bg-[#252830]" />

        <div className="grid grid-cols-2 gap-2 p-4">
          <div className="rounded-xl border border-[#252830] bg-white/[0.025] p-3">
            <div className="flex items-center gap-2 text-[#f64f12]"><Flame size={15} /><span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#858b98]">Streak</span></div>
            <p className="mt-2 text-xl font-semibold tabular-nums">{streak} <span className="text-xs font-normal text-[#858b98]">{streak === 1 ? "day" : "days"}</span></p>
          </div>
          <div className="rounded-xl border border-[#252830] bg-white/[0.025] p-3">
            <div className="flex items-center gap-2 text-[#a6abb5]"><CalendarDays size={15} /><span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#858b98]">Member since</span></div>
            <p className="mt-2 text-sm font-semibold">{getMemberSince(user)}</p>
          </div>
        </div>
        <div className="px-4 pb-4">
          <div className={`flex items-center gap-2 rounded-xl  px-3 py-2.5 ${
            isEmailVerified
              ? " text-[#60a5fa]"
              : " text-[#fbbf24]"
          }`}>
            
            <span className="text-xs font-medium">
              {isEmailVerified ? "Verified User" : "Email not verified"}
            </span>
            <span className="ml-auto text-[10px] uppercase tracking-wider opacity-75">
              {isEmailVerified ? "Verified" : "Unverified"}
            </span>
          </div>
        </div>

       

        <div className="border-t border-[#252830] p-2">
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-white transition bg-[#f64f12] disabled:cursor-wait disabled:opacity-60"
          >
            <LogOut size={17} />
            {loggingOut ? "Signing out…" : "Log out"}
          </button>
        </div>
      </section>
    </>
  );
};

export default ProfileMenu;
