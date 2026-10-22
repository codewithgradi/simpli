"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";



const SCREENS = [
  {
    id: "dashboard",
    label: "Analytics",
    title: "Live occupancy and traffic",
    text: "Visitors today, rooms occupied and available, and a seven-day traffic view, all in one place.",
    src: "/screens/dashboard.png",
    url: "simply.app/console",
    width: 1366,
    height: 684,
  },
  {
    id: "logs",
    label: "Visitor logs",
    title: "A searchable record of every visit",
    text: "Search, sort and filter check-ins with the reason for the visit and current status.",
    src: "/screens/visitor-logs.png",
    url: "simply.app/console",
    width: 1366,
    height: 684,
  },
  {
    id: "actions",
    label: "Quick actions",
    title: "Common tasks, one click away",
    text: "Add a room, check in a walk-in guest, or open the scanner terminal without digging through menus.",
    src: "/screens/quick-actions.png",
    url: "simply.app/console",
    width: 1364,
    height: 691,
  },
  {
    id: "scanner",
    label: "Exit terminal",
    title: "Scan out in a second",
    text: "Guards scan the visitor’s QR pass at the gate and the room is released immediately.",
    src: "/screens/scanner.png",
    url: "simply.app/console/scan",
    width: 1363,
    height: 678,
  },
];

const STEPS = [
  {
    title: "Check in",
    text: "The visitor enters their details at the terminal or the front desk.",
  },
  {
    title: "Secure storage",
    text: "ID numbers are hashed with SHA-256 before being stored in MongoDB.",
  },
  {
    title: "Pass issued",
    text: "A unique NanoID is generated as a QR pass and displayed to visitor which may be downloaded by the visitor.",
  },
  {
    title: "Check out",
    text: "Scanning the pass at the exit releases the room straight away.",
  },
];

const REASONS = [
  {
    title: "Replace paper logs",
    text: "Manual sign-in sheets are hard to audit and slow at the gate. Simply digitises the full lifecycle of a visit.",
  },
  {
    title: "POPIA aware",
    text: "Visitor data is removed automatically after 30 days, so you keep only what you need.",
  },
  {
    title:"AI and Automation",
    text:"A built in assistant that handles checking visitors in and out, and many more additional features"
  }
];

function BrowserFrame({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_32px_-12px_rgba(15,23,42,0.18)]">
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="mx-auto w-full max-w-xs rounded-md bg-white px-3 py-1 text-center text-xs text-slate-400 ring-1 ring-inset ring-slate-200">
          {url}
        </div>
        <div className="w-10" />
      </div>
      {children}
    </div>
  );
}

const SimplyLanding = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [active, setActive] = useState(0);
  const screen = SCREENS[active];

  return (
    <div className="min-h-screen scroll-smooth bg-white font-sans text-slate-600 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Navigation */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#001E2B]">
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 text-emerald-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-900">
              Simply
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <Link
              href="#product"
              className="text-slate-500 transition-colors hover:text-slate-900"
            >
              Product
            </Link>
            <Link
              href="#workflow"
              className="text-slate-500 transition-colors hover:text-slate-900"
            >
              How it works
            </Link>
            <Link
              href="#why-us"
              className="text-slate-500 transition-colors hover:text-slate-900"
            >
              Why Simply
            </Link>
            <Link
              href="/login"
              className="rounded-md bg-[#001E2B] px-4 py-2 font-medium text-white transition-colors hover:bg-[#00303f]"
            >
              Try today
            </Link>
          </nav>

          <button
            className="rounded-md p-2 text-slate-700 hover:bg-slate-100 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-slate-200 bg-white md:hidden"
            >
              <div className="flex flex-col gap-1 px-6 py-4 text-sm">
                {[
                  ["Product", "#product"],
                  ["How it works", "#workflow"],
                  ["Why Simply", "#why-us"],
                ].map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                    className="rounded-md px-2 py-2.5 text-slate-600 hover:bg-slate-50"
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="mt-2 rounded-md bg-[#001E2B] px-4 py-2.5 text-center font-medium text-white"
                >
                  Try today
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-32 md:pb-24 md:pt-44">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-5 text-sm font-medium text-emerald-700">
              Visitor management for hotels and properties
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl md:text-6xl md:leading-[1.08]">
              Know who is on your property, at every moment.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-500">
              Simply replaces paper sign-in sheets with QR passes. Check
              visitors in, track room occupancy and check them out in seconds.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="w-full rounded-md bg-[#001E2B] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#00303f] sm:w-auto"
              >
                Try Simply today
              </Link>
              <Link
                href="#product"
                className="w-full rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
              >
                See the product
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="relative mx-auto mt-16 max-w-5xl"
          >
            <BrowserFrame url="simply.app/console">
              <Image
                src="/screens/dashboard.png"
                alt="Simply analytics dashboard showing today's visitors, room occupancy and a seven-day traffic chart"
                width={1366}
                height={684}
                priority
                className="h-auto w-full"
              />
            </BrowserFrame>
          </motion.div>
        </section>

        {/* Product */}
        <section
          id="product"
          className="border-t border-slate-200 bg-slate-50 py-20 md:py-28"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-emerald-700">Product</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                One console for the front desk and the gate.
              </h2>
            </div>

            <div
              className="mt-10 flex gap-1 overflow-x-auto border-b border-slate-200"
              role="tablist"
            >
              {SCREENS.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={i === active}
                  onClick={() => setActive(i)}
                  className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                    i === active
                      ? "border-slate-900 text-slate-900"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="mt-10 grid items-start gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={screen.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-xl font-semibold text-slate-900">
                      {screen.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-slate-500">
                      {screen.text}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="lg:col-span-8">
                <BrowserFrame url={screen.url}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={screen.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image
                        src={screen.src}
                        alt={`${screen.label} screen of the Simply console`}
                        width={screen.width}
                        height={screen.height}
                        className="h-auto w-full"
                      />
                    </motion.div>
                  </AnimatePresence>
                </BrowserFrame>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="workflow" className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-emerald-700">
                How it works
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                From arrival to exit in four steps.
              </h2>
            </div>

            <ol className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <li key={step.title} className="border-t border-slate-200 pt-5">
                  <span className="text-sm font-medium tabular-nums text-slate-400">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 text-base font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Why */}
        <section
          id="why-us"
          className="border-t border-slate-200 bg-slate-50 py-20 md:py-28"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-emerald-700">Why Simply</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Less paperwork. Better security.
              </h2>
            </div>

            <div className="mt-14 grid gap-10 md:grid-cols-3">
              {REASONS.map((r) => (
                <div key={r.title}>
                  <h3 className="text-base font-semibold text-slate-900">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {r.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#001E2B] px-8 py-12 md:flex-row md:items-center md:px-12">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
                  Ready to retire the sign-in sheet?
                </h2>
                <p className="mt-2 text-slate-300">
                  Set up your property in minutes.
                </p>
              </div>
              <Link
                href="/login"
                className="rounded-md bg-white px-6 py-3 text-sm font-medium text-[#001E2B] transition-colors hover:bg-slate-100"
              >
                Try Simply today
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-slate-400 md:flex-row">
          <span>© {new Date().getFullYear()} Simply</span>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="transition-colors hover:text-slate-700"
            >
              Privacy
            </Link>
            <Link
              href="/security"
              className="transition-colors hover:text-slate-700"
            >
              Security
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SimplyLanding;
