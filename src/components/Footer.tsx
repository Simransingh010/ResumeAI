"use client";

import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 exclude-print">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-3">
                            {APP_NAME}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 max-w-md">
                            AI-powered resume analyzer and builder. Get instant scores, actionable fixes, and build ATS-friendly resumes.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Product
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/analyze"
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Analyze Resume
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/build-resume"
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Build Resume
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/how-it-works"
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    How It Works
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                            Legal
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    href="/privacy"
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/terms"
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                    <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                        © {currentYear} {APP_NAME}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
