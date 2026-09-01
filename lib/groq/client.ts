const GROQ_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

export function getGroqConfig() {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY belum diset di environment variable.");
  }
  if (!model) {
    throw new Error("GROQ_MODEL belum diset di environment variable.");
  }

  return { apiKey, model, endpoint: GROQ_ENDPOINT };
}

type ChatMessage = { role: "system" | "user"; content: string };

export async function callGroqChat(
  messages: ChatMessage[],
  options: { temperature?: number; maxTokens?: number; jsonMode?: boolean; timeoutMs?: number }
) {
  const { apiKey, model, endpoint } = getGroqConfig();
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    options.timeoutMs ?? 18000
  );

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature ?? 0.3,
        max_tokens: options.maxTokens ?? 1200,
        ...(options.jsonMode ? { response_format: { type: "json_object" } } : {}),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      throw new Error(`Groq API error ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    const content: string | undefined = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("Respons Groq tidak berisi konten.");
    }
    return content;
  } finally {
    clearTimeout(timeout);
  }
}