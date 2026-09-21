import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Header from "../components/Header";
import DotField from "../bg/DotField";

const HomePage = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#0e1015]">

            <Sidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
            />

            {/* RIGHT SIDE */}
            <div
                className={`
          relative min-h-screen overflow-hidden transition-all duration-300
          ${collapsed ? "ml-[72px]" : "ml-[300px]"}
        `}
            >

                {/* Background */}
                <div className="absolute inset-0 w-full h-full z-0">
                    <DotField />
                </div>

                {/* Content */}
                <div className="relative z-10">
                    <Topbar collapsed={collapsed} />
                    <Header />
                </div>

            </div>

        </div>
    );
};

export default HomePage;