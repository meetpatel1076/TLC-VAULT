import React from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  Flame,
  Folder,
  Monitor,
  Terminal,
  Trophy,
} from "lucide-react";
import SEO from "../components/SEO";

const features = [
  {
    number: "01",
    icon: Folder,
    title: "A home for your code",
    description:
      "Save code files and group related practice into repositories, so the work you do at home is easier to find in the lab.",
    detail: "Code files · Repositories · One organized workspace",
  },
  {
    number: "02",
    icon: Terminal,
    title: "Compile without switching tabs",
    description:
      "Open the embedded compiler from a saved code file and run supported programs from within your TLC Vault workspace.",
    detail: "An embedded third-party compiler experience",
    note:
      "Code sent to the embedded compiler is processed by that third-party service. Do not submit passwords, API keys, or other secrets.",
  },
  {
    number: "03",
    icon: Flame,
    title: "Build a practice streak",
    description:
      "Track the days you work on your code, see your current streak, and keep an eye on your longest run of consistent practice.",
    detail: "Current streak · Longest streak · Active days",
  },
  {
    number: "04",
    icon: Trophy,
    title: "Earn progress badges",
    description:
      "Celebrate milestones as you use your workspace and build your coding routine. Your achievements make progress easier to see.",
    detail: "Milestones designed to recognize consistency",
  },
  {
    number: "05",
    icon: Activity,
    title: "Review your week",
    description:
      "See a weekly summary of your active days, code-file activity, and repository activity to understand how you spent your practice time.",
    detail: "Weekly activity · File activity · Repository activity",
  },
  {
    number: "06",
    icon: Monitor,
    title: "Pick up from another computer",
    description:
      "Sign in through a browser on another computer to retrieve your saved workspace—useful when you move between home and a college lab.",
    detail: "Browser-based access · No manual file transfer",
  },
];

export default function FeaturesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "TLC Vault Features",
    description:
      "Explore TLC Vault features for saving code, using an embedded compiler, and tracking coding consistency.",
    url: "https://vault.thelastcommit.xyz/features",
    isPartOf: {
      "@type": "WebSite",
      name: "TLC Vault",
      url: "https://vault.thelastcommit.xyz/",
    },
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0e1015] text-[#f6f1e8]">
      <SEO
        title="Features | TLC Vault — Code Workspace, Compiler & Progress"
        description="Explore TLC Vault: organize code in repositories, run supported programs in an embedded compiler, earn badges, maintain practice streaks, and review weekly progress."
        path="/features"
        structuredData={schema}
      />

      <div className="pointer-events-none fixed left-1/2 top-0 z-0 hidden h-screen w-px -translate-x-1/2 bg-white/[0.025] lg:block" />

      <nav className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 pt-5 sm:px-8 lg:px-10">
        <Link to="/" className="group flex items-center gap-3" aria-label="TLC Vault home">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden">
            <img src="/tlc-vault-logo.png" alt="" className="h-8 w-8 object-contain" />
          </div>
          <div className="leading-none">
            <div className="text-sm font-semibold tracking-[-0.02em]">TLC Vault</div>
            <div className="mt-1 text-[9px] uppercase tracking-[0.22em] text-zinc-600">The Last Commit</div>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/" className="hidden text-xs text-zinc-500 transition hover:text-[#f6f1e8] sm:inline-flex">
            Home
          </Link>
          <Link to="/login" className="rounded-full px-2 py-2 text-xs font-medium text-zinc-500 transition hover:text-[#f6f1e8] sm:px-3.5">
            Log in
          </Link>
          <Link to="/register" className="group flex items-center gap-2 rounded-full bg-[#f36631] px-4 py-2.5 text-xs font-semibold text-zinc-950 transition hover:bg-[#ff7544]">
            Open your vault <ArrowRight size={13} strokeWidth={1.8} />
          </Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pb-20 sm:pt-24 lg:px-10 lg:pt-28">
        <div className="max-w-3xl">
          <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#f36631]">What you can do</span>
          <h1 className="mt-5 text-[clamp(3rem,7vw,6.6rem)] font-medium leading-[0.88] tracking-[-0.065em]">
            More than a place
            <br />
            to <span className="text-[#f36631]">save code.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-base sm:leading-8">
            TLC Vault brings your practice code, an embedded compiler, and progress tracking into one browser-based workspace—so you can spend less time moving files around and more time working on code.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/register" className="group inline-flex items-center gap-3 rounded-full bg-[#f6f1e8] px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-[#f36631]">
              Create your free vault <ArrowRight size={14} strokeWidth={1.8} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a href="#features" className="inline-flex items-center gap-2 px-1 py-2 text-xs text-zinc-600 transition hover:text-[#f6f1e8]">
              Explore features <ArrowDownRight size={13} strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="relative z-10 border-y border-white/[0.07] bg-[#111317]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10">
          <div className="mb-10 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-600">Inside the vault</span>
              <h2 className="mt-4 max-w-2xl text-3xl font-medium leading-tight tracking-[-0.045em] sm:text-5xl">
                A focused workspace for the whole practice loop.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-zinc-600">
              Save your work, run supported code, and make your consistency visible over time.
            </p>
          </div>

          <div className="grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.number} className="flex min-h-[290px] flex-col bg-[#111317] p-6 sm:p-8">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] tracking-[0.18em] text-[#f36631]">{feature.number}</span>
                    <Icon size={20} strokeWidth={1.5} className="text-[#f36631]" aria-hidden="true" />
                  </div>
                  <h3 className="mt-8 text-xl font-medium tracking-[-0.03em] text-[#f6f1e8]">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-500">{feature.description}</p>
                  <p className="mt-auto border-t border-white/[0.07] pt-5 text-[10px] uppercase leading-5 tracking-[0.12em] text-zinc-600">{feature.detail}</p>
                  {feature.note && <p className="mt-3 text-xs leading-5 text-zinc-600">{feature.note}</p>}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-[#f36631]">Built for real routines</span>
            <h2 className="mt-5 text-4xl font-medium leading-[0.95] tracking-[-0.055em] sm:text-5xl">From practice at home to code in the lab.</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { number: "01", title: "Save", text: "Keep your practice files organized in your workspace." },
              { number: "02", title: "Run", text: "Open supported code in the embedded compiler when you need to test it." },
              { number: "03", title: "Improve", text: "Review your weekly activity and keep building a consistent habit." },
            ].map((item) => (
              <div key={item.number} className="border-t border-white/[0.12] pt-5">
                <span className="text-[10px] tracking-[0.18em] text-[#f36631]">{item.number}</span>
                <h3 className="mt-5 text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-5 pb-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl bg-[#f36631]">
          <div className="px-6 py-12 sm:px-10 sm:py-16 lg:px-16">
            <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-zinc-950/60">A product by The Last Commit</span>
            <h2 className="mt-5 max-w-2xl text-4xl font-medium leading-[0.93] tracking-[-0.055em] text-zinc-950 sm:text-6xl">Make your next practice session easier to start.</h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-zinc-950/65 sm:text-base">Create a vault for your code and pick up where you left off, wherever you work.</p>
            <Link to="/register" className="group mt-8 inline-flex items-center gap-3 rounded-full bg-zinc-950 px-5 py-3.5 text-sm font-semibold text-[#f6f1e8] transition hover:bg-zinc-800">
              Get started <ArrowRight size={15} strokeWidth={1.8} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 px-5 pb-8 pt-5 text-[10px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <div className="flex items-center gap-2"><span className="font-semibold text-zinc-300">TLC Vault</span><span>by The Last Commit</span></div>
        <div className="flex items-center gap-5">
          <Link to="/" className="transition hover:text-zinc-300">Home</Link>
          <Link to="/login" className="transition hover:text-zinc-300">Log in</Link>
          <Link to="/register" className="transition hover:text-zinc-300">Register</Link>
        </div>
      </footer>
    </main>
  );
}
