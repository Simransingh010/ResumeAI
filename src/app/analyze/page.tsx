"use client";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import AnalysisResults from "@/components/AnalysisResults";

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
    return <div className="text-center p-8">Loading...</div>;
  }

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-100/90 dark:bg-slate-900/90 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100 dark:bg-slate-950 dark:ring-slate-800">
            <div className="mb-8 text-center">
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Analyzing your resume</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This usually takes just a few seconds.</p>
            </div>
            <div className="space-y-4">
              {loadingSteps.map((label, index) => (
                <div key={label} className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs font-semibold ${index <= loadingStep
                      ? "border-indigo-500 bg-indigo-500 text-white"
                      : "border-slate-300 text-slate-400"
                      }`}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className={`text-sm ${index <= loadingStep ? "text-slate-800 dark:text-slate-100" : "text-slate-400"}`}>
                      {label}
                    </p>
                    {index === loadingStep && (
                      <div className="mt-2 h-1 w-32 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full w-full origin-left animate-[pulse_1.4s_linear_infinite] bg-indigo-500" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-6xl px-4 py-10">
        {!result ? (
          <>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Upload Resume for ATS Analysis</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Welcome, {session.user.email}!</p>

            <form onSubmit={handleSubmit} className="mt-8 bg-white p-6 rounded-lg shadow-md space-y-4 dark:bg-gray-900 dark:border dark:border-gray-800">
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
              />

              <textarea
                placeholder="Optional: Paste job description for better keyword matching"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md h-24 resize-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
              />

              <button
                type="submit"
                disabled={loading || !file}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Analyze Resume"}
              </button>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            </form>
          </>
        ) : (
          <AnalysisResults result={result} />
        )}
      </div >
    </>
  );
}


