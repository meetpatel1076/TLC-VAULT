import { Search } from 'lucide-react'
import React from 'react'

const Topbar = ({ collapsed }) => {
    return (
        <header
            className={`
        fixed top-0 right-0
        h-[70px]
        border-b border-[#252830]
        bg-[#0e1015]
        flex items-center justify-end px-7
        transition-all duration-300
        ${collapsed ? "left-[72px]" : "left-[300px]"}
      `}
        >
            {/* your existing content */}

            <button className="text-[#9ca3af] hover:text-white">
                <Search size={20} />
            </button>

            <div className="ml-10 w-8 h-8 rounded-full bg-[#292d35] flex items-center justify-center">
                <span className="text-xs text-white">T</span>
            </div>

        </header>
    );
};

export default Topbar
