import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [state, setState] = useState("verifying");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("user");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("This verification link is invalid or has expired.");
      setState("error");
      return;
    }

    let cancelled = false;

    const verify = async () => {
      try {
        const response = await api.post("/auth/verify-email", { token });

        if (cancelled) return;

        setRole(response.data?.user?.role || "user");

        if (response.data?.code === "ALREADY_VERIFIED") {
          setMessage("Your TLC Vault account is already active.");
          setState("already");
          return;
        }

        setState("success");
        setMessage("Email verified successfully.");

        window.setTimeout(() => {
          navigate(
            response.data?.user?.role === "admin"
              ? "/admin"
              : "/dashboard",
            { replace: true }
          );
        }, 1200);
      } catch (err) {
        if (cancelled) return;

        const code = err.response?.data?.code;

        if (code === "VERIFICATION_TOKEN_EXPIRED") {
          setMessage("This verification link is invalid or has expired.");
        } else {
          setMessage(
            err.response?.data?.message ||
            "We couldn't verify your email right now."
          );
        }

        setState("error");
      }
    };

    verify();

    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams]);

  const goToDashboard = () => {
    navigate(role === "admin" ? "/admin" : "/dashboard", {
      replace: true,
    });
  };

  return (
    <main className="min-h-screen bg-zinc-950 p-4 text-[#f6f1e8] sm:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1380px] items-center justify-center sm:min-h-[calc(100vh-3rem)]">
        <section className="w-full max-w-[560px] rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-14 text-center sm:px-12">
          <img
            className="mx-auto mb-8 h-14"
            src="/tlc-vault-logo.png"
            alt=""
          />

          {state === "verifying" && (
            <>
              <div className="mx-auto mb-7 h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-[#f36631]" />
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#f36631]">
                Verifying
              </p>
              <h1 className="mt-3 text-3xl font-medium tracking-[-0.04em]">
                Verifying your email...
              </h1>
              <p className="mt-4 text-sm text-zinc-500">
                Please wait while we activate your TLC Vault account.
              </p>
            </>
          )}

          {state === "success" && (
            <>
              <div className="mx-auto mb-7 flex h-10 w-10 items-center justify-center rounded-full border border-[#f36631]/30 bg-[#f36631]/10 text-[#f36631]">
                ✓
              </div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#f36631]">
                Verified
              </p>
              <h1 className="mt-3 text-3xl font-medium tracking-[-0.04em]">
                Email verified
              </h1>
              <p className="mt-4 text-sm text-zinc-500">
                Your TLC Vault account is ready.
              </p>
              <p className="mt-2 text-xs text-zinc-600">
                Taking you to your workspace...
              </p>
            </>
          )}

          {state === "already" && (
            <>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#f36631]">
                Already active
              </p>
              <h1 className="mt-3 text-3xl font-medium tracking-[-0.04em]">
                Email already verified
              </h1>
              <p className="mt-4 text-sm leading-6 text-zinc-500">
                {message}
              </p>
              <button
                type="button"
                onClick={goToDashboard}
                className="mt-8 h-12 w-full rounded-lg bg-[#f36631] px-5 text-sm font-semibold text-zinc-950 hover:bg-[#ff7441]"
              >
                Go to {role === "admin" ? "Admin" : "Dashboard"}
              </button>
            </>
          )}

          {state === "error" && (
            <>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[#f36631]">
                Verification unavailable
              </p>
              <h1 className="mt-3 text-3xl font-medium tracking-[-0.04em]">
                Verification link unavailable
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-500">
                {message}
              </p>

              <Link
                to="/login"
                className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-lg bg-[#f36631] px-5 text-sm font-semibold text-zinc-950 hover:bg-[#ff7441]"
              >
                Go to login
              </Link>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
