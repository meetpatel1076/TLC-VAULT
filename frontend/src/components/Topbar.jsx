import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, ChevronDown, Code2 } from "lucide-react";
import ProfileMenu from "./ProfileMenu";

const DiscordIcon = ({ size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.27 5.33A19.8 19.8 0 0 0 14.36 3.8a.07.07 0 0 0-.08.04c-.21.37-.44.85-.6 1.23a18.3 18.3 0 0 0-5.36 0c-.16-.39-.4-.86-.61-1.23a.08.08 0 0 0-.08-.04 19.75 19.75 0 0 0-4.91 1.53.07.07 0 0 0-.03.03C-.43 9.93-1.28 14.4-.85 18.81c0 .02.02.04.03.05a19.93 19.93 0 0 0 6.02 3.04.08.08 0 0 0 .09-.03c.46-.63.87-1.3 1.22-2.01a.08.08 0 0 0-.04-.11 13.1 13.1 0 0 1-1.88-.9.08.08 0 0 1-.01-.13c.13-.1.25-.2.37-.3a.08.08 0 0 1 .08-.01c3.94 1.8 8.2 1.8 12.09 0a.08.08 0 0 1 .08.01c.12.1.24.2.37.3a.08.08 0 0 1-.01.13c-.6.35-1.23.65-1.88.9a.08.08 0 0 0-.04.11c.36.71.77 1.38 1.22 2.01a.08.08 0 0 0 .09.03 19.88 19.88 0 0 0 6.02-3.04.08.08 0 0 0 .03-.05c.52-5.1-.86-9.54-3.67-13.45a.06.06 0 0 0-.03-.03ZM8.02 15.55c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.2 0 2.17 1.09 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Zm7.96 0c-1.18 0-2.15-1.08-2.15-2.4 0-1.32.95-2.4 2.15-2.4 1.2 0 2.17 1.09 2.15 2.4 0 1.32-.95 2.4-2.15 2.4Z" />
  </svg>
);

const InstagramIcon = ({ size = 19 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
  </svg>
);

const Topbar = ({ collapsed, user, onMenuClick, onUserUpdated, standalone = false }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const closeProfile = useCallback(() => setProfileOpen(false), []);
  const initial = (user?.name?.trim()?.[0] || user?.email?.[0] || "U").toUpperCase();

  return (
    <header
      className={`
        fixed top-0 right-0 left-0 md:h-[70px] h-[60px]
        border-b border-[#252830] bg-sidebar
        flex items-center justify-between px-4 md:px-7
        transition-all duration-300 z-50
        ${standalone ? "left-0" : collapsed ? "md:left-[72px]" : "md:left-[350px]"}
      `}
    >
    
      <div className="flex items-center gap-3">
        {!standalone && (
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            className="inline-flex md:hidden items-center justify-center rounded-lg p-2 text-[#d1d5db] transition hover:bg-[#191c22] hover:text-white"
          >
            <Menu size={22} />
          </button>
        )}

        <div className="flex justify-center items-center gap-4">
          <Link to="/dashboard" aria-label="TLC Vault dashboard" className="shrink-0">
          <img
            src="/tlc-vault-logo.png"
            alt="TLC Vault"
            className="h-8 w-8 md:h-9 md:w-9 object-contain"
          />
        </Link>
        <div className="hidden md:block"><Link
          to="/compiler"
          aria-label="Open online compiler"
          title="Online Compiler"
          className="inline-flex h-8.5 items-center justify-center gap-2 rounded-md border border-[#30343d]  px-3 text-sm font-medium text-[#f6f1e8] transition hover:border-[#f64f12]/60 hover:bg-[#191c22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f64f12]"
        >
          <Code2 size={18} className="text-[#f64f12]" />
          <span className="hidden sm:inline">Compiler</span>
        </Link></div>
        </div>
      </div>

   
      <div className="pointer-events-none absolute left-1/2 hidden -translate-x-1/2 items-center gap-3 md:flex">
        <span className="text-[11px] uppercase tracking-[0.3em] text-[#666b75]">
          The Last Commit
        </span>
        <span className="h-1 w-1 rounded-full bg-[#f64f12]" />
        <span
          className="text-sm font-medium tracking-[0.12em] text-[#f6f1e8]"
          style={{ fontFamily: "MaskingRenta, sans-serif" }}
        >
          TLC Vault
        </span>
      </div>

      
      <div className="flex items-center gap-3">
        

        <a
          href="https://discord.gg/M83dEcZKqk"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join The Last Commit Discord community"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#5865F2] px-3 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#4752C4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5865F2] focus-visible:ring-offset-2 focus-visible:ring-offset-[#181a20]"
        >
          <DiscordIcon size={19} />
          <span className="hidden lg:inline">Join Discord</span>
        </a>

        
        <a
          href="https://www.instagram.com/thelastcommit.tlc/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Instagram profile"
          title="Instagram"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-white hover:text-[#E1306C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E1306C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#181a20]"
        >
          <InstagramIcon size={31} />
        </a>

        <div className="relative z-[95]">
          <button
            type="button"
            aria-label="Open profile menu"
            aria-haspopup="dialog"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
            className={`group flex h-10 items-center gap-2 rounded-full border p-1 transition ${
              profileOpen
                ? "border-[#30343d] bg-white/[0.04]"
                : "border-transparent hover:border-[#30343d] hover:bg-white/[0.04]"
            }`}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#3a3e47] bg-[#292d35] text-xs font-semibold text-white">
              {initial}
            </span>
            <ChevronDown
              size={14}
              className={`mr-1 hidden text-[#858b98] transition sm:block ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>
          {profileOpen && <ProfileMenu user={user} onClose={closeProfile} onUserUpdated={onUserUpdated} />}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
