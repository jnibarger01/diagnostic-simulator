import { createServerFn } from "@tanstack/react-start";
import { generateLocalCase } from "@/lib/cases/generate";
import type { Difficulty } from "@/lib/sim/types";

export const generateCaseStory = createServerFn({ method: "POST" })
  .validator((input: { prompt: string; difficulty: Difficulty }) => input)
  .handler(async ({ data }) => {
    const fallback = generateLocalCase(data.prompt, data.difficulty);
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: true as const, source: "local" as const, concern: fallback.concern };

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          max_tokens: 280,
          messages: [
            {
              role: "system",
              content:
                "You write Toyota/Lexus customer concerns for a diagnostic simulator. Return 2-4 sentences in the customer's voice. Do not name the failed part. Do not diagnose. No markdown.",
            },
            { role: "user", content: data.prompt.slice(0, 600) },
          ],
        }),
      });
      if (!res.ok) return { ok: true as const, source: "local" as const, concern: fallback.concern };
      const body = (await res.json()) as { choices: { message: { content: string } }[] };
      const concern = (body.choices[0]?.message.content ?? "").trim() || fallback.concern;
      return { ok: true as const, source: "ai" as const, concern };
    } catch {
      return { ok: true as const, source: "local" as const, concern: fallback.concern };
    }
  });
