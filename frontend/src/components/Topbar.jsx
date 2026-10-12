import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

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

const Topbar = ({ collapsed, user, onMenuClick }) => {
  return (
    <header
      className={`
        fixed top-0 right-0 left-0 md:h-[70px] h-[60px]
        border-b border-[#252830] bg-sidebar
        flex items-center justify-between px-4 md:px-7
        transition-all duration-300 z-50
        ${collapsed ? "md:left-[72px]" : "md:left-[350px]"}
      `}
    >
      {/* Left: Menu and Logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="inline-flex md:hidden items-center justify-center rounded-lg p-2 text-[#d1d5db] hover:bg-[#191c22] hover:text-white transition"
        >
          <Menu size={22} />
        </button>

        <Link
          to="/dashboard"
          aria-label="TLC Vault dashboard"
          className="shrink-0"
        >
          <img
            src="/tlc-vault-logo.png"
            alt="TLC Vault"
            className="h-8 w-8 md:h-9 md:w-9 object-contain"
          />
        </Link>
      </div>

      {/* Center: Brand */}
      <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-3 pointer-events-none">
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

      {/* Right: Discord and User Avatar */}
      <div className="flex items-center gap-3">
        <a
          href="https://discord.gg/rtFWb6p9"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join The Last Commit Discord community"
          className="
            inline-flex items-center justify-center gap-2
            rounded-md bg-[#5865F2] px-3 py-2
            text-sm font-semibold text-white
            transition-colors duration-200
            hover:bg-[#4752C4]
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-[#5865F2] focus-visible:ring-offset-2
            focus-visible:ring-offset-[#181a20]
          "
        >
          <DiscordIcon size={19} />
          <span className="hidden sm:inline">Join Discord</span>
        </a>

        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#292d35] shrink-0">
          <span className="text-xs text-white">
            {user?.email?.charAt(0).toUpperCase() || "U"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;