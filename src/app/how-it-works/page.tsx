"use client";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-12 text-center">
        <div className="inline-block px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg mb-6">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">SIMPLE & POWERFUL</span>
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white leading-tight mb-6">
          How It Works
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Get your resume analyzed in three simple steps. Our AI does the heavy lifting while you focus on landing your dream job.
        </p>
      </section>

      {/* Steps Section */}
      <section className="mx-auto max-w-5xl px-6 pb-20">
        <div className="space-y-12">
          {/* Step 1 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-8 md:p-12 hover:border-gray-900 dark:hover:border-white transition-colors">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center">
                  <span className="text-3xl font-black text-white dark:text-gray-900">1</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Upload Your Resume</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  Simply drag and drop your resume PDF or paste the text. We support all standard resume formats and our AI can parse any layout.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold rounded-lg border border-gray-200 dark:border-gray-700">
                    PDF
                  </span>
                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold rounded-lg border border-gray-200 dark:border-gray-700">
                    DOCX
                  </span>
                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-bold rounded-lg border border-gray-200 dark:border-gray-700">
                    TXT
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-8 md:p-12 hover:border-gray-900 dark:hover:border-white transition-colors">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center">
                  <span className="text-3xl font-black text-white dark:text-gray-900">2</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">AI Analyzes Everything</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  Our advanced AI scans your resume for ATS compatibility, keyword optimization, formatting issues, and content quality. We check:
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">ATS Compliance</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Format & parsing compatibility</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Keyword Match</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Skills & experience alignment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Content Quality</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Writing & impact assessment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Structure</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Layout & organization</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border-2 border-gray-200 dark:border-gray-800 p-8 md:p-12 hover:border-gray-900 dark:hover:border-white transition-colors">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-white flex items-center justify-center">
                  <span className="text-3xl font-black text-white dark:text-gray-900">3</span>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Get Actionable Insights</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  Receive a comprehensive report with your overall score, detailed breakdowns, and specific recommendations to improve your resume.
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Your Score</span>
                    <span className="text-4xl font-black text-gray-900 dark:text-white">85</span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold text-gray-700 dark:text-gray-300">Document Quality</span>
                        <span className="font-bold text-gray-900 dark:text-white">92</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 dark:bg-white rounded-full" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-bold text-gray-700 dark:text-gray-300">Content Depth</span>
                        <span className="font-bold text-gray-900 dark:text-white">78</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 dark:bg-white rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="bg-gray-900 dark:bg-white rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-black text-white dark:text-gray-900 mb-4">
            Ready to Optimize Your Resume?
          </h2>
          <p className="text-lg text-gray-300 dark:text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have improved their resumes and landed more interviews.
          </p>
          <Link
            href="/analyze"
            className="inline-block rounded-lg bg-white dark:bg-gray-900 px-8 py-4 text-lg font-bold text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Analyze Your Resume Now
          </Link>
        </div>
      </section>
    </div>
  );
}
