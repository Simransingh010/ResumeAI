import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createServerSupabase } from "@/lib/supabase";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rateLimit";
import { validateResumeFile, validateJobDescription } from "@/lib/validation";
import { ERROR_MESSAGES, FILE_LIMITS } from "@/lib/constants";

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
 * This is the most reliable method for serverless environments.
 */
async function extractTextWithPdfJs(buffer: Buffer): Promise<string> {
  try {
    // Use the legacy build which works better in Node.js environments
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    // Set a dummy worker src to prevent the error, but disable actual worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = "data:,";

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(buffer),
      useSystemFonts: true,
      disableFontFace: true,
      verbosity: 0,
      isEvalSupported: false,
    });

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const parts: string[] = [];

    console.log(`[pdfjs] Processing ${numPages} pages...`);

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageText = (content.items as any[])
        .map((item) => (typeof item.str === "string" ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (pageText) {
        parts.push(pageText);
      }
    }

    const finalText = parts.join("\n\n").trim();
    console.log(`[pdfjs] Extracted ${finalText.length} characters from ${numPages} pages`);
    return finalText;
  } catch (err) {
    console.error("[pdfjs] extraction failed:", err);
    throw err;
  }
}

/**
 * Extracts text using pdf-parse as a fallback.
 * Note: pdf-parse may not work in all serverless environments.
 */
async function extractTextWithPdfParse(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import - pdf-parse exports differently in ESM vs CJS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfParseModule = await import("pdf-parse") as any;
    const pdfParse = pdfParseModule.default || pdfParseModule;

    const data = await pdfParse(buffer);
    const text = data.text?.trim() || "";

    console.log(`[pdf-parse] Extracted ${text.length} characters`);
    return text;
  } catch (err) {
    console.error("[pdf-parse] extraction failed:", err);
    throw err;
  }
}

/**
 * Main PDF text extraction function with multiple fallbacks.
 * Returns empty string if all methods fail - caller should use Gemini Vision.
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  const errors: string[] = [];

  // Method 1: Try pdfjs-dist first
  try {
    const text = await extractTextWithPdfJs(buffer);
    if (text && text.length > 50) {
      return text;
    }
    console.warn("[extractTextFromPDF] pdfjs returned insufficient text:", text.length);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    errors.push(`pdfjs: ${errMsg}`);
    console.warn("[extractTextFromPDF] pdfjs failed:", errMsg);
  }

  // Method 2: Try pdf-parse as fallback
  try {
    const text = await extractTextWithPdfParse(buffer);
    if (text && text.length > 50) {
      return text;
    }
    console.warn("[extractTextFromPDF] pdf-parse returned insufficient text:", text.length);
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    errors.push(`pdf-parse: ${errMsg}`);
    console.warn("[extractTextFromPDF] pdf-parse failed:", errMsg);
  }

  // If all methods failed, log the errors and return empty string
  // The caller will use Gemini Vision as fallback
  console.error("[extractTextFromPDF] All extraction methods failed:", errors);
  return "";
}

/**
 * Sends resume to Gemini for structured ATS analysis.
 * Can accept either extracted text OR the raw PDF buffer for multimodal analysis.
 * Includes retry logic for rate limits.
 */
async function analyzeWithGemini(
  textOrBuffer: string | Buffer,
  jobDesc?: string,
  isBuffer: boolean = false,
  retryCount: number = 0
): Promise<GeminiAnalysisResult> {
  const MAX_RETRIES = 3;
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

  // Models to try in order of preference (updated Dec 2025)
  // gemini-2.5-flash is fast and has good free tier limits
  // gemini-2.5-pro is the premium fallback
  const models = ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"];
  const modelName = models[Math.min(retryCount, models.length - 1)];
  console.log(`[gemini] Using model: ${modelName} (attempt ${retryCount + 1})`);
  const model = genAIClient.getGenerativeModel({ model: modelName });

  // Build the content parts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parts: any[] = [];

  if (isBuffer) {
    // Send PDF directly to Gemini for multimodal analysis
    const base64Data = (textOrBuffer as Buffer).toString("base64");
    parts.push({
      inlineData: {
        mimeType: "application/pdf",
        data: base64Data,
      },
    });
    parts.push({ text: prompt });
  } else {
    // Send extracted text
    parts.push({ text: prompt });
    parts.push({ text: `Resume:\n${textOrBuffer as string}` });
  }

  if (jobDesc) {
    parts.push({ text: `Job Description:\n${jobDesc}` });
  }

  try {
    const response = await model.generateContent({
      contents: [{ role: "user", parts }],
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
    } catch (parseErr) {
      console.error("[gemini] failed to parse analysis", { answer, parseErr });
      throw new Error("Failed to parse analysis from Gemini");
    }
  } catch (err) {
    // Check if it's a rate limit error and retry
    const errorMessage = err instanceof Error ? err.message : String(err);
    if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("rate")) {
      if (retryCount < MAX_RETRIES) {
        const waitTime = Math.pow(2, retryCount + 1) * 1000; // 2s, 4s
        console.log(`[gemini] Rate limited, retrying in ${waitTime}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return analyzeWithGemini(textOrBuffer, jobDesc, isBuffer, retryCount + 1);
      }
      throw new Error("Rate limit exceeded. Please try again in a minute.");
    }
    throw err;
  }
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: ERROR_MESSAGES.UNAUTHORIZED }, { status: 401 });
  }

  // Rate limiting
  const rateLimitResult = checkRateLimit(user.id);
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: ERROR_MESSAGES.RATE_LIMITED },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("resume") as File | null;
    const jobDesc = (formData.get("jobDesc") as string | null) || undefined;

    // Validate file
    const fileValidation = validateResumeFile(file);
    if (!fileValidation.valid || !file) {
      return NextResponse.json({ error: fileValidation.error }, { status: 400 });
    }

    // At this point, file is guaranteed to be non-null
    const validFile = file;

    // Validate job description if provided
    if (jobDesc) {
      const jobDescValidation = validateJobDescription(jobDesc);
      if (!jobDescValidation.valid) {
        return NextResponse.json({ error: jobDescValidation.error }, { status: 400 });
      }
    }

    // Additional file size check
    if (validFile.size > FILE_LIMITS.MAX_SIZE_BYTES) {
      return NextResponse.json({ error: ERROR_MESSAGES.FILE_TOO_LARGE }, { status: 400 });
    }

    const buffer = Buffer.from(await validFile.arrayBuffer());
    console.log("[analyze] Processing PDF:", validFile.name, "Size:", validFile.size, "bytes");

    // Try to extract text from PDF
    const text: string = await extractTextFromPDF(buffer);
    console.log("[analyze] Extracted text length:", text.length);

    let analysis: GeminiAnalysisResult;

    if (text && text.length > 50) {
      // Use extracted text for analysis
      console.log("[analyze] Using extracted text for analysis");
      analysis = await analyzeWithGemini(text, jobDesc, false);
    } else {
      // Fallback: Send PDF directly to Gemini for multimodal analysis
      console.log("[analyze] Text extraction failed, using Gemini multimodal analysis");
      analysis = await analyzeWithGemini(buffer, jobDesc, true);
    }

    // For storage, we'll use the extracted text if available, otherwise a placeholder
    const contentForStorage = text && text.length > 50
      ? text
      : `[PDF analyzed via Gemini Vision - ${validFile.name}]`;

    const payload = {
      user_id: user.id,
      content: contentForStorage,
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
        filename: validFile.name,
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
