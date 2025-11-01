"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";

export default function Home() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center">
        <div className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">AI-POWERED ATS RESUME ANALYZER</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-black text-gray-900 dark:text-white leading-tight mb-6">
          Get Instant Resume Scores & Actionable Fixes
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Our AI reviews your resume like a recruiter and an ATS: grades relevance, highlights gaps, and suggests precise improvements to get you more interviews.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {isLoggedIn ? (
            <button 
              onClick={handleLogout} 
              className="rounded-lg bg-gray-900 px-8 py-4 text-lg font-bold text-white hover:bg-gray-700 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Log out
            </button>
          ) : (
            <Link 
              href="/login" 
              className="rounded-lg bg-gray-900 px-8 py-4 text-lg font-bold text-white hover:bg-gray-700 transition-colors dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              Get Started
            </Link>
          )}
          <Link 
            href="#features" 
            className="rounded-lg border-2 border-gray-900 px-8 py-4 text-lg font-bold text-gray-900 hover:bg-gray-100 transition-colors dark:border-white dark:text-white dark:hover:bg-gray-800"
          >
            See How It Works
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ATS Score */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-800 p-8 hover:border-gray-900 dark:hover:border-white transition-colors">
            <div className="text-4xl mb-4">🏅</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">ATS Score</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Overall fit score with recruiter-style and ATS checks combined.
            </p>
          </div>

          {/* Keyword Match */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-800 p-8 hover:border-gray-900 dark:hover:border-white transition-colors">
            <div className="text-4xl mb-4">🔎</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Keyword Match</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Job description vs resume: skills coverage and missing keywords.
            </p>
          </div>

          {/* Actionable Advice */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-800 p-8 hover:border-gray-900 dark:hover:border-white transition-colors">
            <div className="text-4xl mb-4">🛠️</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Actionable Advice</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Concrete bullet fixes prioritized by impact.
            </p>
          </div>

          {/* Section Optimizer */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-800 p-8 hover:border-gray-900 dark:hover:border-white transition-colors">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Section Optimizer</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              AI rewrites summary and bullets for clarity, impact, and ATS parsing.
            </p>
          </div>

          {/* Export */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-800 p-8 hover:border-gray-900 dark:hover:border-white transition-colors">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">One-click Export</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Download tailored versions for each job with tracked changes.
            </p>
          </div>

          {/* Fast Analysis */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-800 p-8 hover:border-gray-900 dark:hover:border-white transition-colors">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Instant Results</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Get comprehensive analysis in seconds, not hours.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
 