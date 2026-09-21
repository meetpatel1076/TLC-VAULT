import React, { useState } from "react";

import api from "../services/api";

export default function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      console.log("LOGIN RESPONSE:", response.data);

      window.location.href = "/dashboard";

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to sign in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 p-4 text-[#f6f1e8] sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1380px] grid-cols-1 gap-4 sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.02fr_0.98fr]">

        {/* LEFT IMAGE PANEL */}
        <section className="relative min-h-[480px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 sm:min-h-[620px] lg:min-h-0">

          {/* Replace /tlc-login-bg.jpg with your preferred image */}
          <img
            src="/tlc-login-bg.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Dark overlay keeps the image consistent with TLC Vault */}
          <div className="absolute inset-0 bg-zinc-950/55" />

          {/* Subtle orange atmosphere */}
          <div className="pointer-events-none absolute -bottom-40 left-[-10%] h-[430px] w-[600px] rounded-full bg-[#f36631]/20 blur-[110px]" />

          {/* Orange accent line */}
          <div className="absolute bottom-[15%] left-[9%] z-10 h-[2px] w-28 bg-[#f36631] shadow-[0_0_28px_rgba(243,102,49,0.5)]" />

          {/* Brand */}
          <div className="absolute left-7 top-7 z-10 flex items-center gap-3 sm:left-9 sm:top-9">
            <img className="h-14" src="tlc-vault-logo.png" alt="" />

            <span className="text-base font-semibold tracking-tight">
              TLC Vault
            </span>
          </div>

          {/* Back */}
          <a
            href="/"
            className="absolute right-7 top-7 z-10 rounded-full border border-zinc-700 bg-zinc-950/60 px-3.5 py-1.5 text-xs text-zinc-400 backdrop-blur-sm transition hover:border-zinc-600 hover:text-[#f6f1e8] sm:right-9 sm:top-9"
          >
            Back to website →
          </a>

          {/* Left copy */}
          <div className="absolute bottom-10 left-7 z-10 max-w-[480px] sm:bottom-14 sm:left-16">
            <h2 className="text-4xl font-medium leading-[0.98] tracking-[-0.055em] text-[#f6f1e8] sm:text-5xl lg:text-6xl">
              Your code.
              <br />
              Always with you.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-400">
              Pick up where you left off, from wherever you are.
            </p>
          </div>
        </section>

        {/* RIGHT FORM PANEL */}
        <section className="flex min-h-[620px] items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-[470px]">

            <div className="mb-9">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#f36631]">
                Welcome back
              </p>

              <h1 className="text-4xl font-medium tracking-[-0.045em] text-[#f6f1e8] sm:text-5xl">
                Log in
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500">
                Access your repositories and continue working on your code.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-zinc-300"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="h-12 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 text-sm text-[#f6f1e8] outline-none transition placeholder:text-zinc-600 focus:border-[#f36631] focus:ring-2 focus:ring-[#f36631]/10"
                />
              </div>

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-zinc-300"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs text-zinc-500 transition hover:text-[#f36631]"
                    onClick={() => {
                      // Forgot-password flow is not implemented in the V1 backend.
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-12 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 pr-16 text-sm text-[#f6f1e8] outline-none transition placeholder:text-zinc-600 focus:border-[#f36631] focus:ring-2 focus:ring-[#f36631]/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 text-xs text-zinc-500 transition hover:text-[#f36631]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-400"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-lg bg-[#f36631] px-5 text-sm font-semibold text-zinc-950 transition hover:bg-[#ff7441] hover:shadow-[0_8px_30px_rgba(243,102,49,0.16)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-7 text-center text-xs text-zinc-500">
              Don't have an account?{" "}
              <a
                href="/register"
                className="font-medium text-[#f6f1e8] underline decoration-[#f36631]/70 underline-offset-4 transition hover:text-[#f36631]"
              >
                Create one
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
