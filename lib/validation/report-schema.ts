import { z } from "zod";

export const INPUT_LIMITS = {
  activity: { min: 1, max: 3000 },
  learning: { min: 0, max: 1500 },
  obstacle: { min: 0, max: 1500 },
} as const;

export const MIN_OUTPUT_CHARS = 100;

export const generateRequestSchema = z.object({
  activity: z
    .string()
    .trim()
    .min(INPUT_LIMITS.activity.min, "Tuliskan kegiatan hari ini terlebih dahulu.")
    .max(
      INPUT_LIMITS.activity.max,
      "Catatan terlalu panjang. Ringkas sedikit lalu coba lagi."
    ),
  learning: z
    .string()
    .trim()
    .max(
      INPUT_LIMITS.learning.max,
      "Catatan terlalu panjang. Ringkas sedikit lalu coba lagi."
    )
    .optional()
    .default(""),
  obstacle: z
    .string()
    .trim()
    .max(
      INPUT_LIMITS.obstacle.max,
      "Catatan terlalu panjang. Ringkas sedikit lalu coba lagi."
    )
    .optional()
    .default(""),
});

export type GenerateRequestInput = z.infer<typeof generateRequestSchema>;

// Skema output model — dipakai untuk validasi respons Groq sebelum diteruskan ke browser
export const modelOutputSchema = z.object({
  activity: z.string().min(1),
  learning: z.string().min(1),
  obstacle: z.string().min(1),
});