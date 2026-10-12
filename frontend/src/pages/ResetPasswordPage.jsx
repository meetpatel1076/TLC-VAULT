import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is invalid or has expired.");
      return;
    }

    if (password.length < 8) {
      setError("Your password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        token,
        password,
      });

      setSuccess(true);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset your password. Please request a new link."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-12 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 pr-16 text-sm text-[#f6f1e8] outline-none transition placeholder:text-zinc-600 focus:border-[#f36631] focus:ring-2 focus:ring-[#f36631]/10";

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 py-10 text-[#f6f1e8]">
      <section className="w-full max-w-[460px] rounded-xl border border-zinc-800 bg-zinc-950 p-6 sm:p-9">
        <Link to="/" className="mb-9 inline-flex items-center gap-3">
          <img
            src="/tlc-vault-logo.png"
            alt=""
            className="h-10 w-auto"
          />

          <span className="text-sm font-semibold tracking-tight">
            TLC Vault
          </span>
        </Link>

        {!success ? (
          <>
            <div className="mb-8">
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.25em] text-[#f36631]">
                Account security
              </p>

              <h1 className="text-3xl font-medium tracking-[-0.045em]">
                Reset your password
              </h1>

              <p className="mt-3 text-sm leading-6 text-zinc-500">
                Choose a new password for your TLC Vault account.
              </p>
            </div>

            {!token && (
              <p
                role="alert"
                className="mb-5 rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-3 text-sm text-red-400"
              >
                This reset link is missing its token. Request a new password
                reset link to continue.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="new-password"
                  className="mb-2 block text-xs font-medium text-zinc-300"
                >
                  New password
                </label>

                <div className="relative">
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter a new password"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    disabled={loading || !token}
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((previous) => !previous)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-1 text-xs text-zinc-500 hover:text-[#f36631]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="mt-2 text-xs text-zinc-600">
                  Use at least 8 characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-xs font-medium text-zinc-300"
                >
                  Confirm new password
                </label>

                <div className="relative">
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    placeholder="Enter your password again"
                    autoComplete="new-password"
                    required
                    disabled={loading || !token}
                    className={inputClass}
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-1 text-xs text-zinc-500 hover:text-[#f36631]"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {confirmPassword && (
                  <p
                    className={`mt-2 text-xs ${
                      passwordsMatch ? "text-green-500" : "text-red-400"
                    }`}
                  >
                    {passwordsMatch
                      ? "Passwords match."
                      : "Passwords do not match."}
                  </p>
                )}
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-3 text-sm leading-5 text-red-400"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={
                  loading ||
                  !token ||
                  !password ||
                  !confirmPassword ||
                  !passwordsMatch ||
                  password.length < 8
                }
                className="flex h-12 w-full items-center justify-center rounded-lg bg-[#f36631] px-5 text-sm font-semibold text-zinc-950 transition hover:bg-[#ff7441] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Updating password..." : "Update password"}
              </button>
            </form>

            <Link
              to="/login"
              className="mt-6 block text-center text-sm text-zinc-500 transition hover:text-[#f6f1e8]"
            >
              Return to login
            </Link>
          </>
        ) : (
          <div aria-live="polite">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.25em] text-[#f36631]">
              Password updated
            </p>

            <h1 className="text-3xl font-medium tracking-[-0.045em]">
              You're all set.
            </h1>

            <p className="mt-4 text-sm leading-6 text-zinc-500">
              Your password has been changed successfully. You can now log in
              using your new password.
            </p>

            <Link
              to="/login"
              className="mt-8 flex h-12 w-full items-center justify-center rounded-lg bg-[#f36631] px-5 text-sm font-semibold text-zinc-950 transition hover:bg-[#ff7441]"
            >
              Continue to login
            </Link>
          </div>
        )}

        <div className="mt-9 border-t border-zinc-800 pt-5">
          <p className="text-center text-[10px] tracking-[0.18em] text-zinc-600">
            THE LAST COMMIT
          </p>
        </div>
      </section>
    </main>
  );
}