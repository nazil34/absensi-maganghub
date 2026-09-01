import { NextRequest, NextResponse } from "next/server";
import { generateRequestSchema } from "@/lib/validation/report-schema";
import { generateReport, GenerationError } from "@/lib/groq/generate-report";
import { GenerateReportResponse } from "@/types/report";

// Rate limit sederhana per IP dalam memory. Cukup untuk MVP single-instance;
// kalau deploy multi-region/multi-instance, ganti dengan store eksternal (mis. Upstash Redis).
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX ?? 10);
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW ?? 60_000);
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT_MAX;
}

function errorResponse(
  code: string,
  status: number,
  message: string
): NextResponse<GenerateReportResponse> {
  return NextResponse.json({ success: false, error: { code, message } }, { status });
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return errorResponse(
      "RATE_LIMITED",
      429,
      "Terlalu banyak permintaan. Tunggu sebentar lalu coba lagi."
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return errorResponse("INVALID_INPUT", 400, "Format permintaan tidak valid.");
  }

  const parsed = generateRequestSchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return errorResponse(
      "INVALID_INPUT",
      400,
      firstIssue?.message ?? "Input tidak valid."
    );
  }

  const { activity, learning, obstacle } = parsed.data;

  try {
    const { data, meta } = await generateReport(activity, learning, obstacle);
    const response: GenerateReportResponse = {
      success: true,
      data,
      meta: {
        activityChars: meta.activityChars,
        learningChars: meta.learningChars,
        obstacleChars: meta.obstacleChars,
      },
    };
    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    if (err instanceof GenerationError) {
      return errorResponse(err.code, err.status, err.message);
    }
    // Jangan pernah mengirim stack trace atau detail internal ke client (bagian 12.3)
    return errorResponse(
      "GENERATION_FAILED",
      500,
      "Laporan belum berhasil dibuat. Silakan coba lagi."
    );
  }
}