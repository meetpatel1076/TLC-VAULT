import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  Check,
  Code2,
  Copy,
  Folder,
  LockKeyhole,
  MoveUpRight,
} from "lucide-react";

const codeLines = [
  "class Student {",
  "  public:",
  "    void practice() {",
  "      solveProblems();",
  "    }",
  "};",
];

function TinyLabel({ children, orange = false }) {
  return (
    <span
      className={`text-[10px] font-medium uppercase tracking-[0.24em] ${orange ? "text-[#f36631]" : "text-zinc-600"
        }`}
    >
      {children}
    </span>
  );
}

function AppWindow() {
  return (
    <div className="relative w-full overflow-hidden rounded-[14px] border border-zinc-800 bg-[#111214] shadow-[0_25px_70px_rgba(0,0,0,0.35)]">
      {/* top bar */}
      <div className="flex h-8 items-center justify-between border-b border-zinc-800 px-3">
        <div className="flex items-center gap-1.5">
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-700" />
          </div>

          <span className="ml-2 text-[9px] text-zinc-600">
            tlc-vault
          </span>
        </div>

        <div className="rounded border border-zinc-800 px-2 py-0.5 text-[8px] text-zinc-700">
          private workspace
        </div>
      </div>

      <div className="flex min-h-[285px]">
        {/* sidebar */}
        <aside className="hidden w-[115px] shrink-0 border-r border-zinc-800 px-2.5 py-3 sm:block">
          <div className="mb-4 px-1.5 text-[8px] font-semibold tracking-[0.18em] text-[#f6f1e8]">
            YOUR VAULT
          </div>

          <div className="space-y-0.5">
            {[
              ["DSA", true],
              ["Web Development", false],
              ["College", false],
            ].map(([name, active]) => (
              <div
                key={name}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[8px] ${active
                    ? "bg-zinc-800 text-[#f6f1e8]"
                    : "text-zinc-600"
                  }`}
              >
                <Folder
                  size={10}
                  strokeWidth={1.6}
                  className={
                    active ? "text-[#f36631]" : "text-zinc-700"
                  }
                />

                {name}
              </div>
            ))}
          </div>

          <div className="mt-4 border-t border-zinc-800 pt-3">
            <div className="px-1.5 text-[8px] uppercase tracking-[0.18em] text-zinc-700">
              Recent
            </div>

            <div className="mt-1.5 space-y-1 px-1.5">
              <div className="text-[8px] text-zinc-500">
                binary-search.cpp
              </div>

              <div className="text-[8px] text-zinc-600">
                linked-list.cpp
              </div>

              <div className="text-[8px] text-zinc-700">
                stack.cpp
              </div>
            </div>
          </div>
        </aside>

        {/* main */}
        <div className="min-w-0 flex-1 p-3">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-medium text-[#f6f1e8]">
                binary-search.cpp
              </div>

              <div className="mt-0.5 text-[8px] text-zinc-700">
                DSA / Searching
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="hidden rounded border border-zinc-800 px-1.5 py-1 text-[8px] text-zinc-600 sm:inline">
                C++
              </span>

              <div className="flex h-6 w-6 items-center justify-center rounded border border-zinc-800 text-zinc-600">
                <Copy size={10} strokeWidth={1.6} />
              </div>
            </div>
          </div>

          {/* editor */}
          <div className="overflow-hidden rounded-lg border border-zinc-800 bg-[#0c0d0f]">
            <div className="flex border-b border-zinc-800">
              <div className="border-r border-zinc-800 px-3 py-1.5 text-[8px] text-zinc-600">
                binary-search.cpp
              </div>

              <div className="px-3 py-1.5 text-[8px] text-[#f36631]">
                saved
              </div>
            </div>

            <div className="grid grid-cols-[22px_1fr] p-3 font-mono text-[8px] leading-5 sm:text-[9px]">
              <div className="select-none pr-2 text-right text-zinc-800">
                {codeLines.map((_, index) => (
                  <div key={index}>{index + 1}</div>
                ))}
              </div>

              <div className="text-zinc-500">
                {codeLines.map((line, index) => (
                  <div key={index}>
                    <span
                      className={
                        index === 0
                          ? "text-[#f6f1e8]"
                          : index === 1
                            ? "text-[#f36631]"
                            : "text-zinc-500"
                      }
                    >
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-zinc-800 pt-3">
            <span className="text-[8px] text-zinc-700">
              Last updated just now
            </span>

            <div className="flex items-center gap-1.5 text-[8px] text-zinc-600">
              <LockKeyhole size={9} strokeWidth={1.6} />
              private to you
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0e1015] text-[#f6f1e8]">
      {/* subtle center guide */}
      <div className="pointer-events-none fixed left-1/2 top-0 z-0 hidden h-screen w-px -translate-x-1/2 bg-white/[0.025] lg:block" />

      {/* NAVBAR */}
      <nav className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-5 pt-5 sm:px-8 lg:px-10">
        {/* brand */}
        <Link
          to="/"
          className="group flex items-center gap-3"
        >
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden">
            <img
              src="/tlc-vault-logo.png"
              alt="TLC Vault"
              className="h-8 w-8 object-contain"
            />
          </div>

          <div className="leading-none">
            <div className="text-sm font-semibold tracking-[-0.02em]">
              TLC Vault
            </div>

            <div className="mt-1 text-[9px] uppercase tracking-[0.22em] text-zinc-600">
              The Last Commit
            </div>
          </div>
        </Link>

        {/* center navigation */}
        <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.18em]">
            <span className="text-zinc-500">
              A private code workspace
            </span>

            <span className="h-px w-8 bg-zinc-800" />

            <span className="text-zinc-700">
              built for students
            </span>
          </div>
        </div>

        {/* actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/login"
            className="rounded-full px-3.5 py-2 text-xs font-medium text-zinc-500 transition hover:text-[#f6f1e8]"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="group flex items-center gap-2 rounded-full bg-[#f36631] px-4 py-2.5 text-xs font-semibold text-zinc-950 transition hover:bg-[#ff7544]"
          >
            Open your vault

            <ArrowRight
              size={13}
              strokeWidth={1.8}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-14 pt-14 sm:px-8 sm:pb-16 sm:pt-20 lg:px-10 lg:pb-20 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14 xl:gap-20">

          {/* LEFT — STORY */}
          <div>
            <TinyLabel orange>
              Built under The Last Commit
            </TinyLabel>

            <h1 className="mt-4 max-w-[700px] text-[clamp(3.25rem,6.5vw,6.7rem)] font-medium leading-[0.86] tracking-[-0.065em]">
              Your code
              <br />
              shouldn't be
              <br />
              <span className="text-[#f36631]">
                stuck at home.
              </span>
            </h1>

            <p className="mt-7 max-w-lg text-sm leading-6 text-zinc-500 sm:text-base sm:leading-7">
              You practice at home. Then the college lab starts,
              the laptop stays behind, and suddenly the code you
              worked on is somewhere you cannot reach.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="group flex items-center gap-3 rounded-full bg-[#f6f1e8] px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-[#f36631]"
              >
                Create your free vault

                <ArrowRight
                  size={14}
                  strokeWidth={1.8}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>

              <a
                href="#why"
                className="flex items-center gap-2 px-2 py-2 text-xs text-zinc-600 transition hover:text-[#f6f1e8]"
              >
                See how it works
                <ArrowDownRight size={13} strokeWidth={1.5} />
              </a>
            </div>

            {/* moved from above the preview */}
            <div className="mt-7 max-w-[310px] border-l border-[#f36631]/35 pl-4">
              <p className="text-xs leading-5 text-zinc-600">
                “I had the code.
                <br />
                I just didn't have it with me.”
              </p>

              <div className="mt-2 text-[8px] uppercase tracking-[0.18em] text-zinc-800">
                A very ordinary college problem
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-zinc-700">
              <Check
                size={11}
                strokeWidth={1.7}
                className="text-[#f36631]"
              />
              Free for students
            </div>
          </div>

          {/* RIGHT — PRODUCT PREVIEW */}
          <div className="relative lg:-mt-2">
            <AppWindow />

            {/* tiny contextual label */}
            <div className="mt-3 flex items-center justify-between px-1">
              <span className="text-[8px] uppercase tracking-[0.18em] text-zinc-800">
                Your practice space
              </span>

              <span className="text-[8px] text-zinc-700">
                available anywhere
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* STORY */}
      <section
        id="why"
        className="relative z-10 border-y border-white/[0.07]"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-[0.35fr_0.65fr]">
            <div className="border-b border-white/[0.07] py-12 lg:border-b-0 lg:border-r lg:py-16 lg:pr-12">
              <TinyLabel>The problem</TinyLabel>

              <div className="mt-5 text-4xl font-medium leading-[0.95] tracking-[-0.045em] sm:text-5xl">
                The lab
                <br />
                changes the rules.
              </div>
            </div>

            <div className="py-12 lg:py-16 lg:pl-16">
              <div className="max-w-2xl">
                <p className="text-2xl font-medium leading-tight tracking-[-0.035em] text-[#f6f1e8] sm:text-4xl">
                  You write code at home because that's where
                  you can focus.
                </p>

                <div className="my-10 flex items-center gap-4">
                  <div className="h-px w-16 bg-[#f36631]" />

                  <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-700">
                    then comes lab day
                  </span>
                </div>

                <p className="max-w-xl text-base leading-7 text-zinc-500">
                  Phones are away. Personal laptops may be away.
                  Your GitHub account might be somewhere you do
                  not want to sign into on a shared college
                  computer. The code you spent two hours writing
                  is suddenly on the wrong side of the room.
                </p>

                <div className="mt-10 grid gap-0 border-y border-white/[0.07] sm:grid-cols-3">
                  {[
                    {
                      number: "01",
                      title: "Practice",
                      text: "Write and improve your code at home.",
                    },
                    {
                      number: "02",
                      title: "Arrive",
                      text: "Sit down at a college lab machine.",
                    },
                    {
                      number: "03",
                      title: "Stuck",
                      text: "Realize the code is somewhere else.",
                    },
                  ].map((item, index) => (
                    <div
                      key={item.number}
                      className={`py-6 ${index !== 2
                          ? "border-b border-white/[0.07] sm:border-b-0 sm:border-r sm:border-white/[0.07]"
                          : ""
                        } ${index !== 0
                          ? "sm:pl-6"
                          : ""
                        }`}
                    >
                      <div className="text-[9px] tracking-[0.18em] text-[#f36631]">
                        {item.number}
                      </div>

                      <div className="mt-3 text-sm font-medium text-[#f6f1e8]">
                        {item.title}
                      </div>

                      <p className="mt-2 max-w-xs text-xs leading-5 text-zinc-600">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="relative z-10 bg-[#111317] px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-[0.42fr_0.58fr] lg:gap-20">
            <div>
              <TinyLabel orange>
                The simple fix
              </TinyLabel>

              <h2 className="mt-5 max-w-xl text-5xl font-medium leading-[0.95] tracking-[-0.055em] sm:text-6xl">
                Put the code
                <br />
                somewhere you
                <br />
                can always reach.
              </h2>

              <p className="mt-7 max-w-md text-sm leading-6 text-zinc-500 sm:text-base">
                TLC Vault gives you a private browser-based
                workspace for the code you're actually practicing.
              </p>

              <div className="mt-9 divide-y divide-white/[0.07] border-y border-white/[0.07]">
                {[
                  "Store your practice code in one place.",
                  "Organize it by repositories.",
                  "Open it from the lab when you need it.",
                ].map((text, index) => (
                  <div
                    key={text}
                    className="flex items-center gap-4 py-4"
                  >
                    <span className="text-[9px] tracking-[0.18em] text-[#f36631]">
                      0{index + 1}
                    </span>

                    <span className="text-sm text-zinc-400">
                      {text}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                to="/register"
                className="group mt-10 inline-flex items-center gap-3 border-b border-[#f36631] pb-2 text-sm font-medium text-[#f6f1e8] transition hover:text-[#f36631]"
              >
                Start using TLC Vault

                <ArrowRight
                  size={15}
                  strokeWidth={1.7}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div>
              <AppWindow />
            </div>
          </div>
        </div>
      </section>

      {/* STREAK */}
      <section className="relative z-10 border-b border-white/[0.07] px-5 py-24 sm:px-8 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.35fr_0.65fr]">
            <div>
              <TinyLabel orange>
                Stay consistent
              </TinyLabel>

              <h2 className="mt-5 max-w-sm text-5xl font-medium leading-[0.94] tracking-[-0.055em] sm:text-6xl">
                Your practice
                <br />
                should leave
                <br />
                a trace.
              </h2>
            </div>

            <div className="lg:pl-16">
              <p className="max-w-2xl text-xl font-medium leading-[1.15] tracking-[-0.03em] text-[#f6f1e8] sm:text-3xl">
                TLC Vault keeps track of the days you actually
                work on your code — not the days you simply
                opened the app.
              </p>

              <p className="mt-7 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">
                Create or meaningfully update your code and
                that day becomes part of your activity history.
                Keep showing up and your streak grows with you.
              </p>

              <div className="mt-12 border-y border-white/[0.07]">
                <div className="grid sm:grid-cols-3">
                  <div className="border-b border-white/[0.07] py-6 sm:border-b-0 sm:border-r sm:border-white/[0.07]">
                    <div className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                      Current
                    </div>

                    <div className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#f6f1e8]">
                      Streak
                    </div>

                    <p className="mt-2 pr-6 text-xs leading-5 text-zinc-600">
                      See how consistently you've been showing up.
                    </p>
                  </div>

                  <div className="border-b border-white/[0.07] py-6 sm:border-b-0 sm:border-r sm:border-white/[0.07] sm:pl-6">
                    <div className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                      Longest
                    </div>

                    <div className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#f6f1e8]">
                      Record
                    </div>

                    <p className="mt-2 pr-6 text-xs leading-5 text-zinc-600">
                      Your personal best stays with your account.
                    </p>
                  </div>

                  <div className="py-6 sm:pl-6">
                    <div className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
                      Total
                    </div>

                    <div className="mt-3 text-3xl font-medium tracking-[-0.04em] text-[#f6f1e8]">
                      Active days
                    </div>

                    <p className="mt-2 text-xs leading-5 text-zinc-600">
                      A record of the days you genuinely practiced.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3 text-[10px] uppercase tracking-[0.16em] text-zinc-700">
                <span className="h-1.5 w-1.5 bg-[#f36631]" />
                Built around consistency, not gamification.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRAND */}
      <section className="relative z-10 border-b border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.55fr_0.45fr] lg:items-end">
            <div>
              <TinyLabel>
                Built under
              </TinyLabel>

              <div className="mt-6 flex items-center gap-5">
                <img
                  src="/tlc-vault-logo.png"
                  alt="TLC Vault"
                  className="h-12 w-12 object-contain"
                />

                <div>
                  <div className="text-2xl font-semibold tracking-[-0.035em]">
                    The Last Commit
                  </div>

                  <div className="mt-1 text-xs text-zinc-600">
                    The organization behind TLC Vault.
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l border-zinc-800 pl-6 lg:ml-auto lg:max-w-md">
              <p className="text-base leading-7 text-zinc-500">
                TLC Vault started from a very ordinary problem:
                having practiced code that is useful, but trapped
                on the wrong machine.
              </p>

              <p className="mt-4 text-base leading-7 text-zinc-500">
                We're keeping the solution ordinary too —
                useful, focused, and free.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 px-5 pb-8 pt-8 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden bg-[#f36631]">
          <div className="relative px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            {/* restrained graphic */}
            <div className="pointer-events-none absolute right-[-5%] top-1/2 hidden h-72 w-72 -translate-y-1/2 rounded-full border border-zinc-950/10 md:block" />

            <div className="pointer-events-none absolute right-[7%] top-1/2 hidden h-40 w-40 -translate-y-1/2 rounded-full border border-zinc-950/10 md:block" />

            <div className="relative max-w-3xl">
              <TinyLabel>
                It's free
              </TinyLabel>

              <h2 className="mt-4 text-5xl font-medium leading-[0.92] tracking-[-0.06em] text-zinc-950 sm:text-6xl lg:text-7xl">
                Keep your code
                <br />
                close.
              </h2>

              <p className="mt-6 max-w-lg text-sm leading-6 text-zinc-950/65 sm:text-base">
                Create your TLC Vault and stop worrying about
                where your practice code is when the lab session
                begins.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/register"
                  className="group flex items-center gap-3 rounded-full bg-zinc-950 px-5 py-3.5 text-sm font-semibold text-[#f6f1e8] transition hover:bg-zinc-800"
                >
                  Create your free vault

                  <ArrowRight
                    size={15}
                    strokeWidth={1.8}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>

                <span className="px-2 text-xs text-zinc-950/55">
                  No credit card.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col gap-4 px-5 pb-8 pt-5 text-[10px] text-zinc-600 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-300">
            TLC Vault
          </span>

          <span>by The Last Commit</span>
        </div>

        <div className="flex items-center gap-5">
          <Link
            to="/login"
            className="transition hover:text-zinc-300"
          >
            Log in
          </Link>

          <Link
            to="/register"
            className="transition hover:text-zinc-300"
          >
            Register
          </Link>
        </div>
      </footer>
    </main>
  );
}