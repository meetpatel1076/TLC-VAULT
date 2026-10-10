import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

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
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          className="inline-flex md:hidden items-center justify-center rounded-lg p-2 text-[#d1d5db] hover:bg-[#191c22] hover:text-white transition"
        >
          <Menu size={22} />
        </button>
        <Link to="/dashboard" aria-label="TLC Vault dashboard" className="shrink-0">
          <img
            src="/tlc-vault-logo.png"
            alt="TLC Vault"
            className="h-8 w-8 md:h-9 md:w-9 object-contain"
          />
        </Link>
      </div>

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

      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#292d35]">
        <span className="text-xs text-white">
          {user?.email?.charAt(0).toUpperCase() || "U"}
        </span>
      </div>
    </header>
  );
};

export default Topbar;
