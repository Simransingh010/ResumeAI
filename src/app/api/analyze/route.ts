import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServerSupabase } from "@/lib/supabase";
// No child processes or OCR needed; using pdfjs-dist Node build for text PDFs

// In Node runtime we don't need a web worker for pdfjs; disable to avoid Next bundling worker chunks
if (!process.env.PDFJS_DISABLE_WORKER) {
  process.env.PDFJS_DISABLE_WORKER = "true";
}

export const runtime = "nodejs";

// Initialize the Gemini client for text generation
const genAIClient = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? "");

interface GeminiAnalysisResult {
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

/**
 * Extracts text content from a PDF buffer using pdfjs-dist.
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfjsLib = (await import("pdfjs-dist/legacy/build/pdf.mjs")) as typeof import("pdfjs-dist/legacy/build/pdf.mjs");

    // Required: valid workerSrc string, otherwise pdf.js fails fake-worker setup
    pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-dist/legacy/build/pdf.worker.mjs";

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
    });

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const parts: string[] = [];

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = (content.items as Array<{ str?: unknown }>)
        .map((item) => (typeof item.str === "string" ? item.str : ""))
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

/**
 * Sends resume text to Gemini for structured ATS analysis.
 * Uses the gemini-2.5-flash-lite model, which is good for fast, structured JSON output.
 */
async function analyzeWithGemini(text: string, jobDesc?: string, fileSize?: number, fileName?: string): Promise<GeminiAnalysisResult> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY for Gemini analysis");
  }

  const prompt = `You are an ATS resume evaluator. Analyze the following resume${jobDesc ? " against the provided job description" : ""} and reply ONLY with strict JSON matching this schema:
{
  "score": number (0-100, overall score),
  "summary": string,
  "strengths": string[] (top 3 strengths in short phrases),
  "improvements": string[] (top 3 actionable fixes),
  "feedback": string[] (bullet guidance for the candidate),
  "sections": {
    "documentSynopsis": {
      "score": number (0-100),
      "atsCompliance": { "status": "pass" or "fail", "message": string },
      "fileType": { "value": string (e.g., "PDF document"), "message": string },
      "fileSize": { "value": string (e.g., "93 KB"), "message": string },
      "pageCount": { "value": number, "message": string },
      "wordCount": { "value": number, "message": string }
    },
    "dataIdentification": {
      "score": number (0-100),
      "phoneNumber": { "detected": boolean, "value": string (if detected), "message": string },
      "email": { "detected": boolean, "value": string (if detected), "message": string },
      "linkedIn": { "detected": boolean, "value": string (if detected), "message": string },
      "education": { "detected": boolean, "message": string },
      "workHistory": { "detected": boolean, "message": string },
      "skills": { "detected": boolean, "message": string },
      "dateFormatting": { "status": "pass" or "fail", "message": string }
    },
    "lexicalAnalysis": {
      "score": number (0-100),
      "personalPronouns": { "count": number, "examples": string[], "message": string },
      "numericizedData": { "status": "pass" or "fail", "message": string },
      "vocabularyLevel": { "score": number (0-10), "message": string },
      "readingLevel": { "score": number (0-10), "message": string },
      "commonWords": string[] (top 5-10 most frequent words)
    },
    "semanticAnalysis": {
      "score": number (0-100),
      "measurableAchievements": { "count": number, "examples": string[] (5-10 examples), "message": string },
      "softSkills": { "count": number, "list": string[], "message": string },
      "hardSkills": { "count": number, "list": string[], "message": string },
      "skillsEfficiencyRatio": { "value": number, "message": string }
    }
  }
}

Analyze thoroughly:
- Document Synopsis: Check ATS compatibility, file format, size, page count, word count
- Data Identification: Extract contact info (phone, email, LinkedIn), verify sections (education, work history, skills), check date formatting
- Lexical Analysis: Count personal pronouns (I, me, my), check for quantified achievements, assess vocabulary and reading level, identify common keywords
- Semantic Analysis: Count measurable achievements with numbers/percentages, identify soft skills (leadership, communication, etc.) and hard skills (technical tools, languages), calculate skills efficiency ratio

Provide specific, actionable feedback. Do not add extra commentary outside the JSON.`;

  const response = await genAIClient
    .getGenerativeModel({ model: "gemini-2.5-flash-lite" })
    .generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { text: `Resume:\n${text}` },
            jobDesc ? { text: `Job Description:\n${jobDesc}` } : undefined,
          ].filter(Boolean) as { text: string }[],
        },
      ],
    });

  const answer = response.response.text();
  try {
    const trimmed = answer.trim();
    const withoutFences = trimmed
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```$/i, "")
      .trim();

    const jsonCandidate = withoutFences.startsWith("{") && withoutFences.endsWith("}")
      ? withoutFences
      : withoutFences.match(/\{[\s\S]*\}/)?.[0] ?? "";

    if (!jsonCandidate) {
      throw new Error("Gemini response did not contain JSON payload");
    }

    const parsed = JSON.parse(jsonCandidate) as GeminiAnalysisResult;
    if (
      typeof parsed.score === "number" &&
      Array.isArray(parsed.feedback) &&
      typeof parsed.summary === "string"
    ) {
      return parsed;
    }
    throw new Error("Gemini response did not match expected structure");
  } catch (err) {
    console.error("[gemini] failed to parse analysis", { answer, err });
    throw new Error("Failed to parse analysis from Gemini");
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
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
      return NextResponse.json({ error: "Upload a valid PDF file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const text: string = await extractTextFromPDF(buffer);
    if (!text || text.length < 50) {
      return NextResponse.json({ error: "No extractable text found. Please ensure the PDF is text-based (not a scanned image)." }, { status: 400 });
    }
    

    const analysis = await analyzeWithGemini(text, jobDesc, file.size, file.name);

    const payload = {
      user_id: user.id,
      content: text,
      // The 'embedding' field has been removed as it is no longer calculated by the LLM.
      // Ensure the 'embedding' column in your Supabase 'resumes' table is NULLABLE
      // or has a default value, or you will get a database error on insertion.
      metadata: {
        score: analysis.score,
        summary: analysis.summary,
        strengths: analysis.strengths ?? [],
        improvements: analysis.improvements ?? [],
        feedback: analysis.feedback,
        sections: analysis.sections ?? {},
        jobDesc: jobDesc || null,
        filename: file.name,
        analyzedAt: new Date().toISOString(),
      },
    };

    const { error: insertError } = await supabase.from("resumes").insert(payload);
    if (insertError) {
      console.error("[supabase] failed to save analysis", {
        insertError,
        payload,
      });
      return NextResponse.json(
        {
          error: "Failed to save analysis",
          details: {
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code,
          },
        },
        { status: 500 }
      );
    }

    // Return the full analysis object
    return NextResponse.json(analysis);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
