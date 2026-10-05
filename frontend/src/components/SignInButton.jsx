import React from "react";
import { useNavigate } from "react-router-dom";

const SignInButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/login")}
      className="h-11 px-5 rounded-lg font-semibold bg-zinc-900 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
    >
      Sign in / Login
    </button>
  );
};

export default SignInButton;