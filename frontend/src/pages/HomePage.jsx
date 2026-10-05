
import React from "react";
import { useOutletContext } from "react-router-dom";

import Header from "../components/Header";
import DotField from "../bg/DotField";
import SignInButton from "../components/SignInButton";
import Dashboard from "../components/dashboard/Dashboard";

const HomePage = () => {
  const { user } = useOutletContext();

  return (
   <div className="relative min-h-screen overflow-hidden pt-[76px]">

  {/* Background */}
  <div className="absolute inset-0 w-full h-full z-0">
    <DotField />
  </div>

  <div className="relative z-10">

    {!user && <Header />}

    {!user && (
          <div className="px-6 lg:px-10 mb-6 mx-20">
            <div className="rounded-2xl border border-[#252830] bg-[#111318]/80 backdrop-blur-sm px-5 py-4 flex items-center justify-between gap-4">

              <div>
                <p className="text-[15px] font-medium text-[#f6f1e8]">
                  You're not signed in
                </p>

                <p className="mt-1 text-sm text-[#717784]">
                  Sign in to save your repositories and continue your work.
                </p>
              </div>

              <SignInButton />

            </div>
          </div>
        )}

    <Dashboard />

  </div>
</div>
  );
};

export default HomePage;
