import { Search } from 'lucide-react'
import React from 'react'

const Topbar = ({ collapsed, user }) => {
    return (
        <header
            className={`
        fixed top-0 right-0
        h-[70px]
        border-b border-[#252830]
        bg-sidebar
        flex items-center justify-end px-7
        transition-all duration-300
        z-50
        ${collapsed ? "left-[72px]" : "left-[300px]"}
      `}
        >
            {/* Topbar Logo */}
            <div className="absolute left-6 flex items-center">
                <img
                    src="/tlc-vault-logo.png"
                    alt="TLC Vault"
                    className="h-9 w-9 object-contain"
                />
            </div>

            {/* Center Brand */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
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

            {/* your existing content */}

            <div className='flex '>
                <button className="text-[#9ca3af] hover:text-white">
                    <Search size={20} />
                </button>

                <div className="ml-10 w-8 h-8 rounded-full bg-[#292d35] flex items-center justify-center">
                    <span className="text-xs text-white">
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                </div>
            </div>

        </header>
    );
};

export default Topbar
