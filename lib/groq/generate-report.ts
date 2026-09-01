import { callGroqChat } from "@/lib/groq/client";
import {
  SYSTEM_PROMPT,
  buildUserPrompt,
  buildRepairPrompt,
} from "@/lib/prompt/report-prompt";
import { modelOutputSchema, MIN_OUTPUT_CHARS } from "@/lib/validation/report-schema";
import { ReportData } from "@/types/report";

export class GenerationError extends Error {
  code: string;
  status: number;

  constructor(code: string, status: number, message: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

const FIELD_LABELS: Record<keyof ReportData, string> = {
  activity: "Uraian Aktivitas",
  learning: "Pembelajaran yang Diperoleh",
  obstacle: "Kendala yang Dialami",
};

function parseModelJson(raw: string): ReportData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new GenerationError(
      "MODEL_RESPONSE_INVALID",
      502,
      "Respons model tidak sesuai skema yang dibutuhkan."
    );
  }

  const result = modelOutputSchema.safeParse(parsed);
  if (!result.success) {
    throw new GenerationError(
      "MODEL_RESPONSE_INVALID",
      502,
      "Respons model tidak sesuai skema yang dibutuhkan."
    );
  }

  return {
    activity: result.data.activity.trim(),
    learning: result.data.learning.trim(),
    obstacle: result.data.obstacle.trim(),
  };
}

async function repairShortField(
  field: keyof ReportData,
  currentValue: string
): Promise<string> {
  const repaired = await callGroqChat(
    [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: buildRepairPrompt(FIELD_LABELS[field], currentValue),
      },
    ],
    { temperature: 0.3, maxTokens: 500 }
  );
  return repaired.trim();
}

export async function generateReport(
  activity: string,
  learning: string,
  obstacle: string
): Promise<{ data: ReportData; meta: Record<string, number> }> {
  let raw: string;
  try {
    raw = await callGroqChat(
      [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(activity, learning, obstacle) },
      ],
      { temperature: 0.3, maxTokens: 1500, jsonMode: true }
    );
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new GenerationError(
        "GENERATION_TIMEOUT",
        504,
        "Proses membutuhkan waktu terlalu lama. Silakan coba lagi."
      );
    }
    throw new GenerationError(
      "GENERATION_FAILED",
      502,
      "Laporan belum berhasil dibuat. Silakan coba lagi."
    );
  }

  let data = parseModelJson(raw);

  // BR-06: satu kali percobaan perbaikan untuk bagian yang < 100 karakter
  const fields: (keyof ReportData)[] = ["activity", "learning", "obstacle"];
  for (const field of fields) {
    if (data[field].length < MIN_OUTPUT_CHARS) {
      try {
        const repaired = await repairShortField(field, data[field]);
        if (repaired.length >= data[field].length) {
          data = { ...data, [field]: repaired };
        }
      } catch {
        // repair gagal — biarkan nilai asli, frontend akan menampilkan warning counter
      }
    }
  }

  return {
    data,
    meta: {
      activityChars: data.activity.length,
      learningChars: data.learning.length,
      obstacleChars: data.obstacle.length,
    },
  };
}