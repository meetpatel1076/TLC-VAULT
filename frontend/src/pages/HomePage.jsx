import React from "react";
import { useOutletContext } from "react-router-dom";

import Header from "../components/Header";
import DotField from "../bg/DotField";
import SignInButton from "../components/SignInButton";
import Dashboard from "../components/dashboard/Dashboard";

const HomePage = () => {
  const { user } = useOutletContext();

  return (
    <div className="relative min-h-screen overflow-x-hidden pt-[76px]">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
        <DotField />
      </div>

      <div className="relative z-10">
        {!user && <Header />}

        {!user && (
          <div className="mx-auto mb-6 w-full max-w-7xl px-3 sm:px-6 lg:px-10">
            <div className="flex flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#252830] bg-[#111318]/80 px-4 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:px-5">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#f6f1e8] sm:text-[15px]">
                  You're not signed in
                </p>
                <p className="mt-1 text-xs leading-5 text-[#717784] sm:text-sm">
                  Sign in to save your repositories and continue your work.
                </p>
              </div>

              <div className="w-full shrink-0 sm:w-auto">
                <SignInButton />
              </div>
            </div>
          </div>
        )}

        <Dashboard />
      </div>
    </div>
  );
};

export default HomePage;
