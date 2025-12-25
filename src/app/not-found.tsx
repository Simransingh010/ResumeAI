import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
            <div className="text-center max-w-lg">
                {/* Animated 404 */}
                <div className="relative mb-8">
                    <h1 className="text-[12rem] font-black text-gray-100 dark:text-gray-900 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl animate-bounce">🔍</span>
                    </div>
                </div>

                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                    Oops! Page Not Found
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    Looks like this page took a wrong turn. Don&apos;t worry, even the best resumes have gaps sometimes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="group flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl"
                    >
                        <span>←</span>
                        Go Home
                    </Link>
                    <Link
                        href="/analyze"
                        className="px-6 py-3 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        Analyze Resume
                    </Link>
                </div>

                {/* Fun suggestion */}
                <p className="mt-12 text-sm text-gray-400 dark:text-gray-600">
                    Pro tip: While you&apos;re here, why not{" "}
                    <Link href="/build-resume" className="text-gray-600 dark:text-gray-400 underline hover:text-gray-900 dark:hover:text-white">
                        build a new resume
                    </Link>
                    ?
                </p>
            </div>
        </div>
    );
}
