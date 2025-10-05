import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
// No child processes or OCR needed; using pdfjs-dist Node build for text PDFs

// In Node runtime we don't need a web worker for pdfjs; disable to avoid Next bundling worker chunks
if (!process.env.PDFJS_DISABLE_WORKER) {
  process.env.PDFJS_DISABLE_WORKER = "true";
}

export const runtime = "nodejs";

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  modelName: "embedding-001",
});

interface AnalysisResult {
  score: number;
  feedback: string[];
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfjsLib: any = await import("pdfjs-dist/legacy/build/pdf.mjs");

    // Required: valid workerSrc string, otherwise pdf.js fails fake-worker setup
    pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-dist/legacy/build/pdf.worker.mjs";

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      disableWorker: true, // Don't spawn a web worker
      useWorkerFetch: false,
      isEvalSupported: false,
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const parts: string[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items
        .map((item: any) => (typeof item.str === "string" ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (text) parts.push(text);
    }

    const finalText = parts.join("\n\n").trim();
    return finalText;
  } catch (err) {
    console.error("[pdfjs] extraction failed:", err);
    return "";
  }
}

// No pdftotext or OCR fallback; pdfjs handles text-based PDFs reliably on server

function extractKeywords(input: string): Set<string> {
  const stopWords = new Set([
    "the",
    "and",
    "or",
    "to",
    "a",
    "in",
    "is",
    "you",
    "that",
    "it",
    "of",
    "for",
    "on",
    "with",
  ]);
  return new Set(
    input
      .toLowerCase()
      .split(/\s+/)
      .filter((word) => word.length > 3 && !stopWords.has(word))
  );
}

async function calculateScore(text: string, jobDesc?: string): Promise<AnalysisResult> {
  let score = 0;
  const feedback: string[] = [];

  const jobKeywords = extractKeywords(jobDesc || "");
  const resumeKeywords = extractKeywords(text);
  const common = [...resumeKeywords].filter((x) => jobKeywords.has(x));
  const matchRate = jobKeywords.size > 0 ? common.length / jobKeywords.size : 0.5;
  score += Math.floor(matchRate * 40);
  if (matchRate < 0.75 && jobKeywords.size > 0) {
    const suggestions = Array.from(jobKeywords).slice(0, 3).join(", ");
    feedback.push(`Low keyword match (~${Math.round(matchRate * 100)}%). Add: ${suggestions}`);
  }

  const sections = [
    "professional summary",
    "summary",
    "work experience",
    "experience",
    "skills",
    "education",
  ];
  let matches = 0;
  sections.forEach((sec) => {
    if (new RegExp(`\\b${sec.replace(/\s+/g, "\\s+")}\\b`, "i").test(text)) matches++;
    else feedback.push(`Add "${sec.charAt(0).toUpperCase() + sec.slice(1)}" section`);
  });
  score += Math.floor((matches / sections.length) * 15);

  if (text.length > 500 && text.length < 2000) score += 20;
  else feedback.push("Aim for 1-2 pages (500-2000 chars).");

  if (text.includes("\t") || text.includes("||")) feedback.push("Avoid tables/images; use plain bullets.");
  if (!text.includes("@")) feedback.push("Add email/contact at top.");

  if (text.match(/(\d+%|\d+x|\d+.*(increased|reduced|achieved))/i)) score += 15;
  else feedback.push('Include metrics (e.g., "Boosted sales 30%").');

  score += 10;
  return { score: Math.min(score, 100), feedback };
}

export async function POST(req: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies: () => cookies() });
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const jobDesc = (formData.get("jobDesc") as string | null) || undefined;

    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Upload a valid PDF" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text: string = await extractTextFromPDF(buffer);
    if (!text || text.length < 50) {
      return NextResponse.json({ error: "No extractable text found. Try a text-based PDF (not scanned)." }, { status: 400 });
    }
    

    const { score, feedback } = await calculateScore(text, jobDesc);

    let vector: number[] | null = null;
    if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      try {
        vector = await embeddings.embedQuery(text);
      } catch (_e) {
        // Non-fatal if embeddings fail
      }
    }

    const { error: insertError } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        content: text,
        embedding: vector,
        metadata: {
          score,
          jobDesc: jobDesc || null,
          filename: file.name,
          analyzedAt: new Date().toISOString(),
        },
      });
    if (insertError) {
      return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 });
    }

    return NextResponse.json({ score, feedback });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
