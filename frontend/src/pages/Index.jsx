import React from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-[#0e1015] text-white flex items-center justify-center px-6">
      <div className="w-full max-w-xl text-center">

        <h1 className="text-5xl font-semibold tracking-tight">
          TLC Vault
        </h1>

        <p className="mt-4 text-[#9ca3af] text-lg">
          Your personal vault for storing and managing your code projects.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 rounded-lg bg-[#f64f12] text-white font-medium hover:bg-[#f36631] transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 rounded-lg border border-[#30343d] text-[#d1d5db] font-medium hover:bg-[#191c22] transition"
          >
            Sign Up
          </button>
        </div>

      </div>
    </main>
  );
};

export default Index;