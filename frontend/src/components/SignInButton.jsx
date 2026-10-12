
import React from "react";
import { useNavigate } from "react-router-dom";

const SignInButton = () => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/login")}
      className="flex h-10 w-full items-center justify-center whitespace-nowrap rounded-lg bg-zinc-900 px-3 text-xs font-semibold text-zinc-300 transition hover:bg-zinc-800 hover:text-white sm:h-11 sm:w-auto sm:px-5 sm:text-sm"
    >
      Sign in / Login
    </button>
  );
};

export default SignInButton;
