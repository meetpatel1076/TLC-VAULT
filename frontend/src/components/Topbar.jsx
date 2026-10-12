import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import ProfileMenu from "./ProfileMenu";

const Topbar = ({ collapsed, user, onMenuClick }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const closeProfile = useCallback(() => setProfileOpen(false), []);
  const initial = (user?.name?.trim()?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <header
      className={`fixed top-0 right-0 left-0 h-[60px] md:h-[70px] border-b border-[#252830] bg-sidebar flex items-center justify-between px-4 md:px-7 transition-all duration-300 z-50 ${collapsed ? "md:left-[72px]" : "md:left-[350px]"}`}
    >
      <div className="flex items-center gap-3">
        <button type="button" onClick={onMenuClick} aria-label="Open navigation menu" className="inline-flex md:hidden items-center justify-center rounded-lg p-2 text-[#d1d5db] transition hover:bg-[#191c22] hover:text-white">
          <Menu size={22} />
        </button>
        <Link to="/dashboard" aria-label="TLC Vault dashboard" className="shrink-0">
          <img src="/tlc-vault-logo.png" alt="TLC Vault" className="h-8 w-8 object-contain md:h-9 md:w-9" />
        </Link>
      </div>

      <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 md:flex">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#666b75]">The Last Commit</span>
        <span className="h-1 w-1 rounded-full bg-[#f64f12]" />
        <span className="text-sm font-medium tracking-[0.12em] text-[#f6f1e8]" style={{ fontFamily: "MaskingRenta, sans-serif" }}>TLC Vault</span>
      </div>

      <div className="relative z-[95] ml-auto">
        <button
          type="button"
          aria-label="Open profile menu"
          aria-haspopup="dialog"
          aria-expanded={profileOpen}
          onClick={() => setProfileOpen((open) => !open)}
          className={`group flex h-10 items-center gap-2 rounded-full border p-1 transition ${profileOpen ? "" : "border-transparent hover:border-[#30343d] hover:bg-white/[0.04]"}`}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3a3e47] bg-[#292d35] text-xs font-semibold text-white">{initial}</span>
          <ChevronDown size={14} className={`mr-1 hidden text-[#858b98] transition sm:block ${profileOpen ? "rotate-180" : ""}`} />
        </button>
        {profileOpen && <ProfileMenu user={user} onClose={closeProfile} />}
      </div>
    </header>
  );
};

export default Topbar;
