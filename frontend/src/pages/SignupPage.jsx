import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
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

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.post("/auth/register", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/dashboard");

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 p-4 text-[#f6f1e8] sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1380px] grid-cols-1 gap-4 sm:min-h-[calc(100vh-3rem)] lg:grid-cols-[1.02fr_0.98fr]">

        {/* LEFT SIDE */}
        <section className="relative min-h-[480px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 sm:min-h-[620px] lg:min-h-0">

          {/* subtle orange atmosphere */}
          <div className="pointer-events-none absolute -bottom-40 left-[-10%] h-[480px] w-[620px] rounded-full bg-[#f36631]/20 blur-[110px]" />

          {/* abstract dark waves */}
          <div className="pointer-events-none absolute inset-x-[-15%] bottom-[-5%] h-[58%] opacity-90">
            <div className="absolute left-[-5%] top-[2%] h-28 w-[110%] rotate-[-5deg] rounded-[50%] border-t border-[#f36631]/20 bg-zinc-900" />
            <div className="absolute left-[-5%] top-[25%] h-32 w-[110%] rotate-[4deg] rounded-[50%] border-t border-[#f36631]/15 bg-zinc-950" />
            <div className="absolute left-[-5%] top-[49%] h-32 w-[110%] rotate-[-3deg] rounded-[50%] border-t border-[#f36631]/20 bg-zinc-900" />
            <div className="absolute left-[-5%] top-[73%] h-36 w-[110%] rotate-[4deg] rounded-[50%] border-t border-[#f36631]/10 bg-zinc-950" />
          </div>

          {/* Brand */}
          <div className="absolute left-7 top-7 z-10 flex items-center gap-3 sm:left-9 sm:top-9">
            <img className="h-14" src="tlc-vault-logo.png" alt="" />

            <span className="text-base font-semibold tracking-tight">
              TLC Vault
            </span>
          </div>

          <Link to="/"
            className="absolute right-7 top-7 z-10 rounded-full border border-zinc-700 bg-zinc-950/60 px-3.5 py-1.5 text-xs text-zinc-400 backdrop-blur-sm transition hover:border-zinc-600 hover:text-[#f6f1e8] sm:right-9 sm:top-9"
          >
            Back to website →
          </Link>

          {/* orange horizon */}
          <div className="absolute bottom-[15%] left-[9%] z-10 h-[2px] w-28 bg-[#f36631] shadow-[0_0_28px_rgba(243,102,49,0.5)]" />

          {/* copy */}
          <div className="absolute bottom-10 left-7 z-10 max-w-[480px] sm:bottom-14 sm:left-16">
            <h2 className="text-4xl font-medium leading-[0.98] tracking-[-0.055em] text-[#f6f1e8] sm:text-5xl lg:text-6xl">
              Your code.
              <br />
              Always with you.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-6 text-zinc-500">
              Keep your practice code organized and ready whenever you need it.
            </p>
          </div>
        </section>

        {/* RIGHT SIDE */}
        <section className="flex min-h-[620px] items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-[470px]">
            <div className="mb-9">
              <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-[#f36631]">
                Get started
              </p>

              <h1 className="text-4xl font-medium tracking-[-0.045em] text-[#f6f1e8] sm:text-5xl">
                Create an account
              </h1>

              <p className="mt-4 max-w-md text-sm leading-6 text-zinc-500">
                Create your private space for storing and accessing your code.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-medium text-zinc-300"
                >
                  Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  autoComplete="name"
                  required
                  className="h-12 w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 text-sm text-[#f6f1e8] outline-none transition placeholder:text-zinc-600 focus:border-[#f36631] focus:ring-2 focus:ring-[#f36631]/10"
                />
              </div>

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
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-medium text-zinc-300"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
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
                <p className="rounded-lg border border-red-900/40 bg-red-950/30 px-3 py-2 text-xs text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-lg bg-[#f36631] px-5 text-sm font-semibold text-zinc-950 transition hover:bg-[#ff7441] hover:shadow-[0_8px_30px_rgba(243,102,49,0.16)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-7 text-center text-xs text-zinc-500">
              Already have an account?{" "}

              <Link to="/login"
                className="font-medium text-[#f6f1e8] underline decoration-[#f36631]/70 underline-offset-4 transition hover:text-[#f36631]">
                Log in
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
