"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter, usePathname } from "next/navigation";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check initial dark mode state
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const toggleDarkMode = useCallback(() => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

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

  const isActiveLink = (href: string) => pathname === href;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 dark:bg-gray-900/80 dark:border-gray-800 shadow-sm exclude-print">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Brand */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              width={180}
              height={100}
              alt="ATSense Logo"
              className="object-cover cursor-pointer hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* Center: Navigation */}
          <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${isActiveLink(link.href)
                    ? "text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-800"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                  }`}
                aria-current={isActiveLink(link.href) ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: Auth actions */}
          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 rounded-lg transition-all"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hidden sm:block px-5 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-lg transition-all shadow-sm hover:shadow"
              >
                Log out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/login"
                  className="hidden sm:block px-5 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-lg transition-all shadow-sm hover:shadow"
                >
                  Get started
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 rounded-lg transition-all"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <FiX className="h-5 w-5" />
              ) : (
                <FiMenu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-col space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 text-base font-semibold rounded-lg transition-all ${isActiveLink(link.href)
                      ? "text-gray-900 bg-gray-100 dark:text-white dark:bg-gray-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                    }`}
                  aria-current={isActiveLink(link.href) ? "page" : undefined}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile auth buttons */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-2">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-base font-semibold text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-lg transition-all"
                  >
                    Log out
                  </button>
                ) : (
                  <Link
                    href="/login"
                    className="block w-full px-4 py-3 text-base font-semibold text-center text-white bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 rounded-lg transition-all"
                  >
                    Get started
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
