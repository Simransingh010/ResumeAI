"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

export default function Header() {
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
    router.push("/");
  }, [router, supabase]);

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800">
      <div className="mx-auto max-w-screen-xl px-4">
        <div className="flex h-16 items-center">
          {/* Left: Brand */}
          <div className="flex flex-none items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/file.svg" width={28} height={28} alt="ATS Resume Checker logo" />
              <span className="text-sm font-semibold tracking-tight dark:text-white">ATS Resume Checker</span>
            </Link>
          </div>

          {/* Center: Menu */}
          <div className="hidden md:flex flex-1 justify-center">
            <ul className="flex items-center gap-8 text-gray-900 dark:text-gray-100">
             <li>
              <Link href="/analyze" className="inline-flex items-center gap-1 hover:text-gray-700 dark:hover:text-gray-300">
                <span>Analyze</span>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="text-gray-400">
                </svg>
              </Link>
             </li>
            </ul>
          </div>

          {/* Right: Auth actions */}
          <div className="hidden md:flex flex-none items-center gap-4">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Log out
              </button>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="ml-auto md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-300 dark:hover:bg-gray-800 dark:focus:ring-gray-700"
              aria-label="Open main menu"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}


