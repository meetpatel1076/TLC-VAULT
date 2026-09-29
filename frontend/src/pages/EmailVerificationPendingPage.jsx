import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import api from "../services/api";

const COOLDOWN_SECONDS = 30;

export default function EmailVerificationPendingPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const email = useMemo(
    () => searchParams.get("email")?.trim() || "",
    [searchParams]
  );

  const emailSent = location.state?.emailSent !== false;
  const loginAttempt = location.state?.loginAttempt === true;

  const [seconds, setSeconds] = useState(
    emailSent ? COOLDOWN_SECONDS : 0
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(
    emailSent
      ? "Verification email sent."
      : loginAttempt
        ? "Your email hasn't been verified yet."
        : "We couldn't send the verification email right now."
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (seconds <= 0) return;

    const timer = window.setInterval(() => {
      setSeconds((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [seconds]);

  const handleResend = async () => {
    if (!email || seconds > 0 || loading) return;

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/resend-verification", {
        email,
      });

      if (response.data?.alreadyVerified) {
        setMessage("Your email is already verified. You can log in.");
        return;
      }

      setMessage("Verification email sent.");
      setSeconds(COOLDOWN_SECONDS);
    } catch (err) {
      const retryAfter = err.response?.data?.retryAfter;

      if (err.response?.status === 429 && retryAfter) {
        setSeconds(retryAfter);
      }

      setError(
        err.response?.data?.message ||
        "We couldn't send the verification email right now."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 p-4 text-[#f6f1e8] sm:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1380px] items-center justify-center sm:min-h-[calc(100vh-3rem)]">
        <section className="w-full max-w-[560px] rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-12 sm:px-12 sm:py-16">
          <div className="mb-10 flex items-center gap-3">
            <img className="h-12" src="/tlc-vault-logo.png" alt="" />
            <span className="font-semibold tracking-tight">TLC Vault</span>
          </div>

          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#f36631]">
            Almost there
          </p>

          <h1 className="text-4xl font-medium tracking-[-0.045em] sm:text-5xl">
            Check your email
          </h1>

          <p className="mt-5 text-sm leading-6 text-zinc-400">
            We've sent a verification link to
          </p>

          <p className="mt-1 break-all text-sm font-medium text-[#f6f1e8]">
            {email || "your email address"}
          </p>

          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
            <p className="text-sm leading-6 text-zinc-400">
              Open the email and click <span className="text-zinc-200">Verify Email</span>{" "}
              to activate your TLC Vault account.
            </p>

            {message && (
              <p className="mt-4 text-xs text-[#f36631]" role="status">
                {message}
              </p>
            )}

            {error && (
              <p className="mt-4 rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-400" role="alert">
                {error}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={!email || seconds > 0 || loading}
            className="mt-6 h-12 w-full rounded-lg bg-[#f36631] px-5 text-sm font-semibold text-zinc-950 transition hover:bg-[#ff7441] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? "Sending..."
              : seconds > 0
                ? `Resend verification email · ${String(seconds).padStart(2, "0")}s`
                : "Resend verification email"}
          </button>

          <p className="mt-6 text-center text-xs leading-5 text-zinc-500">
            Didn't receive it? Check your spam or junk folder.
          </p>

          <p className="mt-8 text-center text-xs text-zinc-500">
            Already verified?{" "}
            <Link
              to="/login"
              className="font-medium text-[#f6f1e8] underline decoration-[#f36631]/70 underline-offset-4 hover:text-[#f36631]"
            >
              Log in
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
