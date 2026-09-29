import React from "react";
import { useNavigate } from "react-router-dom";

const SignInButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/login")}
      className="h-14 w-80 px-6 rounded-lg font-semibold bg-zinc-900 text-md text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
    >
      Sign in / Login
    </button>
  );
};

export default SignInButton;