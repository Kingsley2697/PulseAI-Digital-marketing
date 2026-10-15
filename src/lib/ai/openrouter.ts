export type AiTaskType = "backend_lead_scoring" | "client_copywriting" | "bulk_brainstorming";

type AiTaskOptions = {
  systemPrompt: string;
  userPrompt: string;
  responseFormat?: "json" | "text";
  maxTokens?: number;
  temperature?: number;
};

type OpenRouterCompletion = {
  choices?: Array<{ message?: { content?: string | Array<{ text?: string }> } }>;
  error?: { message?: string };
};

const defaultModels: Record<AiTaskType, string> = {
  backend_lead_scoring: "openai/gpt-4o",
  client_copywriting: "anthropic/claude-3.5-sonnet",
  bulk_brainstorming: "google/gemini-2.5-flash",
};

function modelForTask(task: AiTaskType) {
  const configuredModels: Record<AiTaskType, string | undefined> = {
    backend_lead_scoring: process.env.OPENROUTER_BACKEND_LEAD_SCORING_MODEL || process.env.OPENROUTER_LEAD_ANALYTICS_MODEL,
    client_copywriting: process.env.OPENROUTER_CLIENT_COPYWRITING_MODEL,
    bulk_brainstorming: process.env.OPENROUTER_BULK_BRAINSTORMING_MODEL,
  };

  return configuredModels[task] || defaultModels[task];
}

function contentToText(content: string | Array<{ text?: string }> | undefined) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((part) => part.text || "").join("");
  return "";
}

/**
 * Single server-side gateway for all model calls. Selects the model by task,
 * keeping model policy and OpenRouter credentials out of application routes.
 */
export async function runAiTask(task: AiTaskType, options: AiTaskOptions): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error("OPENROUTER_API_KEY is not configured.");

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "PulseAI Digital",
    },
    body: JSON.stringify({
      model: modelForTask(task),
      messages: [
        { role: "system", content: options.systemPrompt },
        { role: "user", content: options.userPrompt },
      ],
      max_tokens: options.maxTokens || 1_200,
      temperature: options.temperature ?? 0.3,
      ...(options.responseFormat === "json" ? { response_format: { type: "json_object" } } : {}),
    }),
  });

  const payload = (await response.json()) as OpenRouterCompletion;
  if (!response.ok) {
    throw new Error(payload.error?.message || `OpenRouter request failed (${response.status}).`);
  }

  const output = contentToText(payload.choices?.[0]?.message?.content);
  if (!output) throw new Error("OpenRouter returned no content.");
  return output;
}

export function getAiModelForTask(task: AiTaskType) {
  return modelForTask(task);
}
