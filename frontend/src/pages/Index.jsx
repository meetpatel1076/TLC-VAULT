import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, FolderKanban, Code2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-primary text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className=" flex items-center">
            <img
              src="/tlc-vault-logo.png"
              alt="TLC Vault"
              className="h-9 w-9 object-contain"
            />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            TLC Vault
          </span>
        </div>

       
      </nav>

      <section className="flex min-h-[calc(100vh-85px)] items-center justify-center px-5 py-16 sm:px-8">
        <div className="w-full max-w-3xl text-center">
          

          <p className="text-xs font-medium uppercase tracking-[0.3em] text-[#f64f12]">
            The Last Commit
          </p>

          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] sm:text-6xl md:text-7xl">
            TLC Vault
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
            A personal workspace to create, organize, and manage your
            development projects and code — all in one place.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/register")}
              className="group flex h-12 items-center justify-center gap-2 rounded-lg bg-[#f64f12] px-6 text-sm font-medium transition hover:bg-[#ff6128]"
            >
              Get started
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>

            <button
              onClick={() => navigate("/login")}
              className="h-12 rounded-lg border border-zinc-800 px-6 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900 hover:text-white"
            >
              Sign in
            </button>
          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 text-xs text-zinc-600 sm:flex-row sm:gap-8">
            <span className="flex items-center gap-2">
              <FolderKanban size={14} />
              Organize projects
            </span>

          

            <span className="flex items-center gap-2">
              <Code2 size={14} />
              Manage your code
            </span>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;