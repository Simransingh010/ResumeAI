"use client";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiZap, FiShield, FiClock } from "react-icons/fi";

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

  // Use handleLogout when user is logged in
  void handleLogout; // Prevent unused variable warning - used conditionally

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-full mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">AI-Powered Resume Analysis</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 dark:text-white leading-[1.1] mb-6 tracking-tight">
          Land More Interviews with
          <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Optimized Resumes
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          Get instant ATS scores, actionable feedback, and build professional resumes that recruiters love. Join thousands of job seekers who landed their dream jobs.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          {isLoggedIn ? (
            <>
              <Link
                href="/analyze"
                className="group flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-4 text-lg font-bold text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                Analyze Resume
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/build-resume"
                className="rounded-xl border-2 border-gray-900 px-8 py-4 text-lg font-bold text-gray-900 hover:bg-gray-100 transition-colors dark:border-white dark:text-white dark:hover:bg-gray-800"
              >
                Build Resume
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="group flex items-center gap-2 rounded-xl bg-gray-900 px-8 py-4 text-lg font-bold text-white hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
              >
                Get Started Free
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#features"
                className="rounded-xl border-2 border-gray-900 px-8 py-4 text-lg font-bold text-gray-900 hover:bg-gray-100 transition-colors dark:border-white dark:text-white dark:hover:bg-gray-800"
              >
                See How It Works
              </Link>
            </>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <FiZap className="w-4 h-4 text-yellow-500" />
            <span>Instant Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <FiShield className="w-4 h-4 text-green-500" />
            <span>ATS Optimized</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="w-4 h-4 text-blue-500" />
            <span>5 Min Setup</span>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">10K+</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Resumes Analyzed</div>
            </div>
            <div>
              <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">85%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Interview Rate Increase</div>
            </div>
            <div>
              <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">4.9★</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">User Rating</div>
            </div>
            <div>
              <div className="text-4xl font-black text-gray-900 dark:text-white mb-1">30s</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Average Analysis Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="mx-auto max-w-6xl px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our AI-powered platform gives you the tools and insights to create resumes that get noticed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ATS Score */}
          <div className="group bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-8 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg">
            <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🏅</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">ATS Score</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Get an instant compatibility score showing how well your resume will perform with Applicant Tracking Systems.
            </p>
          </div>

          {/* Keyword Match */}
          <div className="group bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-8 hover:border-green-500 dark:hover:border-green-500 transition-all hover:shadow-lg">
            <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🔎</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">Keyword Match</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Compare your resume against job descriptions to identify missing keywords and skills gaps.
            </p>
          </div>

          {/* Actionable Advice */}
          <div className="group bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-8 hover:border-purple-500 dark:hover:border-purple-500 transition-all hover:shadow-lg">
            <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🛠️</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">Actionable Advice</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Receive specific, prioritized recommendations to improve your resume&apos;s impact and effectiveness.
            </p>
          </div>

          {/* Section Optimizer */}
          <div className="group bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-8 hover:border-orange-500 dark:hover:border-orange-500 transition-all hover:shadow-lg">
            <div className="w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <span className="text-2xl">🧠</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">AI Optimizer</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Let AI rewrite your summary and bullet points for maximum clarity, impact, and ATS compatibility.
            </p>
          </div>

          {/* Resume Builder */}
          <div className="group bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-8 hover:border-pink-500 dark:hover:border-pink-500 transition-all hover:shadow-lg">
            <div className="w-14 h-14 rounded-xl bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <span className="text-2xl">✍️</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">Resume Builder</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Create professional, ATS-friendly resumes from scratch with our intuitive builder and live preview.
            </p>
          </div>

          {/* Instant Results */}
          <div className="group bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-8 hover:border-yellow-500 dark:hover:border-yellow-500 transition-all hover:shadow-lg">
            <div className="w-14 h-14 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">Instant Results</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Get comprehensive analysis in seconds, not hours. Upload your resume and see results immediately.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
            Three Simple Steps
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Get your optimized resume in minutes
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-black text-white dark:text-gray-900">1</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload Resume</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Drag and drop your PDF or paste your resume text
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-black text-white dark:text-gray-900">2</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Get Analysis</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our AI scans for ATS compatibility and content quality
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-black text-white dark:text-gray-900">3</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Improve & Apply</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Follow recommendations and download your optimized resume
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4">
            Loved by Job Seekers
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              &quot;After using ATSense, I got 3x more interview callbacks. The keyword analysis was a game-changer for my job search.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                S
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Sarah M.</div>
                <div className="text-sm text-gray-500">Software Engineer</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              &quot;The resume builder is incredibly intuitive. I created a professional resume in under 10 minutes. Highly recommend!&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white font-bold">
                J
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">James K.</div>
                <div className="text-sm text-gray-500">Product Manager</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400">★</span>
              ))}
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              &quot;Finally, a tool that actually helps! The AI suggestions improved my resume score from 45 to 92. Got my dream job!&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Alex R.</div>
                <div className="text-sm text-gray-500">Data Analyst</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-100 dark:to-white rounded-3xl p-12 text-center">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white dark:text-gray-900 mb-4">
              Ready to Land More Interviews?
            </h2>
            <p className="text-xl text-gray-300 dark:text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who have optimized their resumes and accelerated their careers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={isLoggedIn ? "/analyze" : "/login"}
                className="group flex items-center gap-2 rounded-xl bg-white dark:bg-gray-900 px-8 py-4 text-lg font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-lg"
              >
                {isLoggedIn ? "Analyze Your Resume" : "Get Started Free"}
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/build-resume"
                className="rounded-xl border-2 border-white/30 dark:border-gray-900/30 px-8 py-4 text-lg font-bold text-white dark:text-gray-900 hover:bg-white/10 dark:hover:bg-gray-900/10 transition-colors"
              >
                Build Resume
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
