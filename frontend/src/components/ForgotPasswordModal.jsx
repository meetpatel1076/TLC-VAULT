import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";

const COOLDOWN_SECONDS = 30;

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  initialEmail = "",
}) {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const intervalRef = useRef(null);
  const cooldownEndRef = useRef(0);

  const clearCountdown = () => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startCountdown = () => {
    clearCountdown();

    const endTime = Date.now() + COOLDOWN_SECONDS * 1000;
    cooldownEndRef.current = endTime;
    setCooldown(COOLDOWN_SECONDS);

    intervalRef.current = window.setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      );

      setCooldown(remaining);

      if (remaining <= 0) {
        clearCountdown();
      }
    }, 250);
  };

  useEffect(() => {
    if (!isOpen) return;

    setEmail(initialEmail);
    setLoading(false);
    setStatus("idle");
    setError("");
    setCooldown(0);

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !loading) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      clearCountdown();
    };
  }, [isOpen, initialEmail, onClose]);

  // Keep the countdown accurate if the user switches browser tabs.
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && cooldownEndRef.current) {
        const remaining = Math.max(
          0,
          Math.ceil((cooldownEndRef.current - Date.now()) / 1000)
        );

        setCooldown(remaining);

        if (remaining <= 0) {
          clearCountdown();
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading || cooldown > 0) return;

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/forgot-password", {
        email: normalizedEmail,
      });

      // Start cooldown only after the API returns successfully.
      startCountdown();
      setStatus("success");

      // Keep the generic response safe to display.
      if (response.data?.message) {
        setStatus("success");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn't process your request. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isSuccess = status === "success";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-md"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
        className="relative my-auto w-full max-w-[440px] rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl sm:p-8"
      >
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          aria-label="Close dialog"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg text-xl text-zinc-500 transition hover:bg-zinc-800 hover:text-[#f6f1e8] disabled:opacity-50"
        >
          ×
        </button>

        <div className="mb-7">
          <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.25em] text-[#f36631]">
            Account recovery
          </p>

          <h2
            id="forgot-password-title"
            className="pr-8 text-3xl font-medium tracking-[-0.045em] text-[#f6f1e8]"
          >
            Forgot password?
          </h2>

          <p className="mt-3 text-sm leading-6 text-zinc-500">
            Enter your registered email address and we'll send you a link to
            reset your password.
          </p>
        </div>

        {isSuccess && (
          <div
            role="status"
            aria-live="polite"
            className="mb-5 rounded-lg border border-green-900/40 bg-green-950/20 p-4"
          >
            <p className="text-sm font-medium text-green-400">
              Reset request submitted
            </p>

            <p className="mt-2 break-words text-sm leading-6 text-zinc-400">
              If an account exists for{" "}
              <span className="text-[#f6f1e8]">{email.trim()}</span>, a
              password reset link will be sent to that address.
            </p>

            <p className="mt-2 text-xs leading-5 text-zinc-500">
              Check your inbox and spam folder. The link expires after 30
              minutes.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="reset-email"
            className="mb-2 block text-xs font-medium text-zinc-300"
          >
            Email address
          </label>

          <input
            id="reset-email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={loading}
            className="h-12 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 text-sm text-[#f6f1e8] outline-none transition placeholder:text-zinc-600 focus:border-[#f36631] focus:ring-2 focus:ring-[#f36631]/10 disabled:opacity-60"
          />

          {error && (
            <p
              role="alert"
              className="mt-3 rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs leading-5 text-red-400"
            >
              {error}
            </p>
          )}

          {!isSuccess ? (
            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-lg bg-[#f36631] px-5 text-sm font-semibold text-zinc-950 transition hover:bg-[#ff7441] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Sending reset link..." : "Send reset link"}
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading || cooldown > 0}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-5 text-sm font-medium text-[#f6f1e8] transition hover:border-zinc-600 hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Sending..."
                : cooldown > 0
                  ? `Resend link in ${String(
                      Math.floor(cooldown / 60)
                    ).padStart(2, "0")}:${String(cooldown % 60).padStart(
                      2,
                      "0"
                    )}`
                  : "Resend reset link"}
            </button>
          )}
        </form>

        {isSuccess && cooldown > 0 && (
          <p className="mt-3 text-center text-xs text-zinc-500">
            You can request another link in{" "}
            <span className="font-medium tabular-nums text-[#f6f1e8]">
              {cooldown}s
            </span>
            .
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="mt-3 h-10 w-full text-sm text-zinc-500 transition hover:text-[#f6f1e8] disabled:opacity-50"
        >
          Back to login
        </button>

        <div className="mt-6 border-t border-zinc-800 pt-4">
          <p className="text-center text-[11px] tracking-wide text-zinc-600">
            TLC VAULT <span className="px-1.5 text-[#f36631]">/</span> THE LAST
            COMMIT
          </p>
        </div>
      </section>
    </div>
  );
}