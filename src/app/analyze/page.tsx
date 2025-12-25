"use client";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import AnalysisResults from "@/components/AnalysisResults";
import FileDropzone from "@/components/ui/FileDropzone";
import { FiArrowRight, FiFileText } from "react-icons/fi";

export interface AnalysisResult {
  score: number;
  summary: string;
  feedback: string[];
  strengths?: string[];
  improvements?: string[];
  sections?: {
    documentSynopsis?: {
      score: number;
      atsCompliance?: { status: string; message: string };
      fileType?: { value: string; message: string };
      fileSize?: { value: string; message: string };
      pageCount?: { value: number; message: string };
      wordCount?: { value: number; message: string };
    };
    dataIdentification?: {
      score: number;
      phoneNumber?: { detected: boolean; value?: string; message: string };
      email?: { detected: boolean; value?: string; message: string };
      linkedIn?: { detected: boolean; value?: string; message: string };
      education?: { detected: boolean; message: string };
      workHistory?: { detected: boolean; message: string };
      skills?: { detected: boolean; message: string };
      dateFormatting?: { status: string; message: string };
    };
    lexicalAnalysis?: {
      score: number;
      personalPronouns?: { count: number; examples?: string[]; message: string };
      numericizedData?: { status: string; message: string };
      vocabularyLevel?: { score: number; message: string };
      readingLevel?: { score: number; message: string };
      commonWords?: string[];
    };
    semanticAnalysis?: {
      score: number;
      measurableAchievements?: { count: number; examples?: string[]; message: string };
      softSkills?: { count: number; list?: string[]; message: string };
      hardSkills?: { count: number; list?: string[]; message: string };
      skillsEfficiencyRatio?: { value: number; message: string };
    };
  };
}

export default function AnalyzePage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState("");
  const [showJobDesc, setShowJobDesc] = useState(false);

  const loadingSteps = [
    "Parsing your resume",
    "Analyzing your experience",
    "Extracting your skills",
    "Generating recommendations",
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        router.push("/login");
        return;
      }
      setSession(session);
      if (!session) router.push("/login");
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, s) => {
      setSession(s);
      if (!s) router.push("/login");
    });
    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF");
      return;
    }
    setError("");
    setLoading(true);
    setLoadingStep(0);
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);
    if (jobDesc.trim()) formData.append("jobDesc", jobDesc);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Analysis failed");
      }
      const data = await res.json();
      setResult(data as AnalysisResult);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!loading) {
      return;
    }
    setLoadingStep(0);
    let step = 0;
    const id = window.setInterval(() => {
      step = Math.min(step + 1, loadingSteps.length - 1);
      setLoadingStep(step);
      if (step === loadingSteps.length - 1) {
        window.clearInterval(id);
      }
    }, 1400);
    return () => window.clearInterval(id);
  }, [loadingSteps.length, loading]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50/95 dark:bg-gray-950/95 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
            <div className="mb-8 text-center">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                <FiFileText className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Analyzing your resume</h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">This usually takes just a few seconds.</p>
            </div>
            <div className="space-y-4">
              {loadingSteps.map((label, index) => (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all ${index < loadingStep
                        ? "bg-green-500 text-white"
                        : index === loadingStep
                          ? "bg-blue-500 text-white animate-pulse"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                      }`}
                  >
                    {index < loadingStep ? "✓" : index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${index <= loadingStep ? "text-gray-900 dark:text-white" : "text-gray-400"
                      }`}>
                      {label}
                    </p>
                    {index === loadingStep && (
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                        <div className="h-full bg-blue-500 rounded-full animate-[pulse_1s_ease-in-out_infinite]" style={{ width: '60%' }} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 py-12">
          {!result ? (
            <>
              {/* Header */}
              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-3">
                  Analyze Your Resume
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Upload your resume and get instant AI-powered feedback
                </p>
              </div>

              {/* Upload Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                  <FileDropzone
                    onFileSelect={setFile}
                    selectedFile={file}
                    onClear={() => setFile(null)}
                    accept=".pdf"
                    maxSize={5}
                  />
                </div>

                {/* Job Description Toggle */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => setShowJobDesc(!showJobDesc)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">Add Job Description</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Optional: Get keyword matching analysis
                      </p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${showJobDesc ? "bg-gray-900 dark:bg-white rotate-45" : "bg-gray-100 dark:bg-gray-800"
                      }`}>
                      <span className={`text-lg ${showJobDesc ? "text-white dark:text-gray-900" : "text-gray-600 dark:text-gray-400"}`}>+</span>
                    </div>
                  </button>

                  {showJobDesc && (
                    <div className="px-6 pb-6">
                      <textarea
                        placeholder="Paste the job description here for better keyword matching..."
                        value={jobDesc}
                        onChange={(e) => setJobDesc(e.target.value)}
                        className="w-full p-4 border border-gray-200 dark:border-gray-700 rounded-xl h-32 resize-none bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="w-full flex items-center justify-center gap-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-4 px-6 rounded-xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    "Analyzing..."
                  ) : (
                    <>
                      Analyze Resume
                      <FiArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium text-center">{error}</p>
                  </div>
                )}
              </form>

              {/* Tips */}
              <div className="mt-10 grid sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                  <div className="text-2xl mb-2">📄</div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">PDF Format</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Upload text-based PDFs for best results</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                  <div className="text-2xl mb-2">⚡</div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Instant Analysis</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Get results in under 30 seconds</p>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4">
                  <div className="text-2xl mb-2">🔒</div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Secure & Private</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Your data is never stored or shared</p>
                </div>
              </div>
            </>
          ) : (
            <AnalysisResults result={result} />
          )}
        </div>
      </div>
    </>
  );
}


