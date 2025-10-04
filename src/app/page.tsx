"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setIsLoggedIn(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.refresh();
  }, [router, supabase]);

  return (
    <div className="relative min-h-[calc(100vh-0px)] overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Background grid and subtle animated orbs */}
      <div className="bg-grid" aria-hidden />
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-fuchsia-500/10 to-purple-400/20 blur-3xl animate-pulse" />

      {/* Hero */}
      <section className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 pt-16 text-center sm:pt-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs text-gray-700 backdrop-blur dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300">
          AI-powered ATS resume analyzer
        </div>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-gray-900 dark:text-white sm:text-5xl">
          Get instant resume scores, keyword matches, and actionable fixes
        </h1>
        <p className="mt-4 max-w-2xl text-base text-gray-600 dark:text-gray-400">
          Our AI reviews your resume like a recruiter and an ATS: grades relevance, highlights gaps, and suggests precise improvements to get you more interviews.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {isLoggedIn ? (
            <button onClick={handleLogout} className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
              Log out
            </button>
          ) : (
            <Link href="/login" className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400">
              Get started
            </Link>
          )}
          <Link href="#features" className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800">
            See how it works
          </Link>
        </div>
      </section>

      {/* Bento Box */}
      <section id="features" className="relative z-10 mx-auto mt-16 max-w-6xl px-4 pb-24 sm:mt-24">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
          {/* Score Card */}
          <div className="group relative col-span-1 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:col-span-2">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10">🏅</span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">ATS Score</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Overall fit score with recruiter-style and ATS checks combined.</p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
            </div>
          </div>

          {/* Keyword Match */}
          <div className="relative col-span-1 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:col-span-2">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10">🔎</span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Keyword Match</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Job JD vs resume: skills coverage and missing keywords.</p>
            <ul className="mt-3 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              <li>• Matched: React, TypeScript, Tailwind</li>
              <li>• Missing: GraphQL, Cypress</li>
            </ul>
          </div>

          {/* Actionable Advice (tall) */}
          <div className="relative col-span-1 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:col-span-2 sm:row-span-2">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-500/10">🛠️</span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Actionable Advice</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Concrete bullet fixes prioritized by impact.</p>
            <ol className="mt-3 list-decimal space-y-2 pl-4 text-sm text-gray-700 dark:text-gray-300">
              <li>Quantify impact in experience bullets.</li>
              <li>Add role-specific keywords from JD.</li>
              <li>Reorder sections for faster skim.</li>
            </ol>
          </div>

          {/* Section Optimizer */}
          <div className="relative col-span-1 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:col-span-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/10">🧠</span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Section Optimizer</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">AI rewrites summary and bullets for clarity, impact, and ATS parsing.</p>
            <div className="mt-4 rounded-lg border border-dashed border-gray-300 p-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">Drag & drop your PDF or paste text</div>
          </div>

          {/* Export */}
          <div className="relative col-span-1 overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900 sm:col-span-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-500/10">📄</span>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">One-click Export</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Download tailored versions for each job with tracked changes.</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300">
              <Image src="/file.svg" width={14} height={14} alt="file" /> PDF, DOCX
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
 