"use client";
import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import type { Session } from "@supabase/supabase-js";

interface AnalysisResult {
  score: number;
  feedback: string[];
}

export default function AnalyzePage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  if (!session) {
    return <div className="text-center p-8">Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF");
      return;
    }
    setError("");
    setLoading(true);
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
      setResult(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Upload Resume for ATS Analysis</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Welcome, {session.user.email}!</p>

      <button
        onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
        className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
      >
        Sign Out
      </button>

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

        {result && (
          <div className="p-4 bg-green-50 rounded-md border-l-4 border-green-500 dark:bg-green-900/20 dark:border-green-700">
            <h3 className="font-bold text-lg mb-2">Score: {result.score}/100</h3>
            <p className="text-sm text-gray-600 mb-2 dark:text-gray-300">Feedback:</p>
            <ul className="list-disc pl-5 space-y-1">
              {result.feedback.map((item, i) => (
                <li key={i} className="text-sm">{item}</li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
}


